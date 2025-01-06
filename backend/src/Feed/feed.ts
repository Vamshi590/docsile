import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";


const feed = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();


feed.get("/:id", async (c) => {



    const params = c.req.param();
    const userid = parseInt(params.id);

    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());


    try{
        // Get user's connections (both followers and following)
        const connections = await prisma.follow.findMany({
            where: {
                OR: [
                    { followerId: userid },
                    { followingId: userid }
                ]
            },
            select: {
                followerId: true,
                followingId: true
            }
        });

        // Get unique connection IDs
        const connectionIds = [...new Set([
            ...connections.map(c => c.followerId),
            ...connections.map(c => c.followingId)
        ].filter(id => id !== userid))];

        // Get posts from connections first
        const connectionPosts = await prisma.posts.findMany({
            where: {
                userId: {
                    in: connectionIds
                }
            },
            include: {
                User: {
                    select: {
                        name: true,
                        organisation_name: true,
                        city: true,
                        department: true,
                        profile_picture: true
                    }
                },
                postImageLinks: true
            },
            orderBy: {
                posted_at: 'desc'
            }
        });

        // Get questions from connections
        const connectionQuestions = await prisma.questions.findMany({
            where: {
                userId: {
                    in: connectionIds
                }
            },
            include: {
                answers: true,
                User: {
                    select: {
                        name: true,
                        organisation_name: true,
                        city: true,
                        department: true,
                        profile_picture: true
                    }
                },
                question_image_links: true
            },
            orderBy: {
                urgency: 'desc'
            }
        });

        const user = await prisma.user.findUnique({
            where:{
                id: userid
            },
            select:{
                city: true,
                name : true,
                department: true,
                organisation_name : true,
                memberships : true
            }
        })


        if(!user){
            return c.json({status: "error", message: "User not found"}, 404);
        }

        const cityDeptPosts = await prisma.posts.findMany({
            where:{
                AND:[
                    {userId: { not: userid }},
                    {User: {city: user.city}},
                    {User: {department: user.department}}
                ]
            },
            include:{
                User:{
                    select:{
                        name: true,
                        organisation_name: true,
                        city: true,
                        department: true,
                        profile_picture : true
                    }
                },
                postImageLinks: true
            },
            orderBy:{
                posted_at: "desc"
            }
        })

        const orgDeptPosts = await prisma.posts.findMany({
            where:{
                AND:[
                    {userId : {not : userid}},
                    {User : {organisation_name : user.organisation_name}},
                    {User: {department : user.department }},
                    { id : {notIn : cityDeptPosts.map(p => p.id)} }
                ]
            },
            include:{
                postImageLinks : true,
                User:{
                    select:{
                        name : true,
                        organisation_name : true,
                        city: true,
                        department : true,
                        profile_picture : true
                    }
                }
            },
            orderBy:{
                posted_at : 'desc'
            }
        })


        const membershipPosts = await prisma.posts.findMany({
            where :{
                AND:[
                    {userId : {not : userid}},
                    {
                        User:{
                            memberships :{
                                some :{
                                    societyname :{
                                        in : user.memberships
                                        .map(m => m.societyname)
                                        .filter((name) : name is string => name !== null)
                                    }
                                }
                            }
                        }
                    },{
                        id : {
                            notIn : [... cityDeptPosts.map(p => p.id),
                                ... orgDeptPosts.map(p => p.id)
                            ],

                        }
                    }
                ]
            },
            include:{
                postImageLinks: true,
                User:{
                    select:{
                        name : true,
                        organisation_name : true,
                        city: true,
                        department : true,
                        profile_picture : true
                    }
                }
            },
            orderBy :{
                posted_at : 'desc'
            }
        })


        let allPosts = [
            ...cityDeptPosts,
            ...orgDeptPosts,
            ...membershipPosts
        ]


        const additionalPosts = allPosts.length < 50 ? await prisma.posts.findMany({
            where : {
                AND : [
                    {userId : {not : userid}},

                    {
                        id :{
                            notIn : [... allPosts.map( p => p.id)]
                        }
                    }
                    
                ]
            },
            include:{
                postImageLinks: true,
                User :{
                    select : {
                        name : true,
                        organisation_name : true,
                        department : true,
                        city : true,
                        profile_picture : true
                    }
                },
            },
            
            orderBy:{
                posted_at : 'desc'
            },
            take: 50 - allPosts.length
        }) : [];


        const finalPosts  = [...allPosts, ...additionalPosts];

         // Get questions in priority order
    const cityDeptQuestions = await prisma.questions.findMany({
        where: {
          AND: [
            { userId: { not: userid } }, // Exclude user's own questions
            { User: { city: user.city } },
            { User: { department: user.department } }
          ]
        },
        include: {
          answers: true,
          User: {
            select: {
              name: true,
              organisation_name: true,
              city: true,
              department: true
            }
          },
          question_image_links: true
        },
        orderBy: {
          urgency: 'desc' // This will sort HIGH -> MEDIUM -> LOW
        }
      });
  
      const orgDeptQuestions = await prisma.questions.findMany({
        where: {
          AND: [
            { userId: { not: userid } },
            { User: { organisation_name: user.organisation_name } },
            { User: { department: user.department } },
            { id: { notIn: cityDeptQuestions.map(q => q.id) } } // Exclude already fetched questions
          ]
        },
        include: {
          answers: true,
          User: {
            select: {
              name: true,
              organisation_name: true,
              city: true,
              department: true
            }
          },
          question_image_links: true
        },
        orderBy: {
          urgency: 'desc'
        }
      });
  
      const membershipQuestions = await prisma.questions.findMany({
        where: {
          AND: [
            { userId: { not: userid } },
            { 
              User: {
                memberships: {
                  some: {
                    societyname: {
                      in: user.memberships
                        .map(m => m.societyname)
                        .filter((name): name is string => name !== null)
                    }
                  }
                }
              }
            },
            { 
              id: { 
                notIn: [...cityDeptQuestions.map(q => q.id), 
                       ...orgDeptQuestions.map(q => q.id)] 
              } 
            }
          ]
        },
        include: {
          answers: true,
          User: {
            select: {
              name: true,
              organisation_name: true,
              city: true,
              department: true
            }
          },
          question_image_links: true
        },
        orderBy: {
          urgency: 'desc'
        }
      });
  
      let allQuestions = [
        ...cityDeptQuestions,
        ...orgDeptQuestions,
        ...membershipQuestions
      ];
  
      
  
      // Combine and sort priority questions
      const priorityQuestions = [
        ...cityDeptQuestions,
        ...orgDeptQuestions,
        ...membershipQuestions
      ].sort((a, b) => {
        const urgencyOrder: { [key: string]: number } = { HIGH: 3, MEDIUM: 2, LOW: 1 };
        const urgencyDiff = urgencyOrder[b.urgency as string] - urgencyOrder[a.urgency as string];
        
        if (urgencyDiff === 0) {
          return new Date(b.asked_at).getTime() - new Date(a.asked_at).getTime();
        }
        
        return urgencyDiff;
      });
  
      // Get additional questions if needed
      const additionalQuestions = allQuestions.length < 50 ? await prisma.questions.findMany({
        where: {
          AND: [
            { userId: { not: userid } },
            { id: { notIn: priorityQuestions.map(q => q.id) } }
          ]
        },
        include: {
          answers: true,
          User: {
            select: {
              name: true,
              organisation_name: true,
              city: true,
              department: true
            }
          },
          question_image_links: true
        },
        orderBy: {
          urgency: 'desc'
        },
        take: 50 - priorityQuestions.length
      }) : [];
  
      const finalQuestions = [...priorityQuestions, ...additionalQuestions];



      // Combine all content with connection content first
      const finalData = [
        ...connectionPosts,
        ...connectionQuestions,
        ...finalPosts.filter(post => !connectionIds.includes(post.userId ?? 0)),
        ...finalQuestions.filter(question => !connectionIds.includes(question.userId ?? 0))
      ].sort((a, b) => {
        const dateA = new Date('posted_at' in a ? a.posted_at : a.asked_at);
        const dateB = new Date('posted_at' in b ? b.posted_at : b.asked_at);
        return dateB.getTime() - dateA.getTime();
      });

        // Get existing connections first
        const existingConnections = await prisma.follow.findMany({
            where: {
                followerId: userid
            }
        });
        
        const existingConnectionIds = existingConnections.map(c => c.followingId);

        // Get recommended users
        const recommendedUsers = await prisma.user.findMany({
            where: {
                AND: [
                    { id: { not: userid } },
                    { id: { notIn: existingConnectionIds } },
                    {
                        OR: [
                            { department: user.department },
                            { city: user.city },
                            { organisation_name: user.organisation_name },
                            {
                                memberships: {
                                    some: {
                                        societyname: {
                                            in: user.memberships
                                                .map(m => m.societyname)
                                                .filter((name): name is string => name !== null)
                                        }
                                    }
                                }
                            }
                        ]
                    }
                ]
            },
            select: {
                id: true,
                name: true,
                organisation_name: true,
                city: true,
                department: true,
                profile_picture: true
            },
            take: 5 // Limit to 5 recommendations
        });

        return c.json({
            status: "success",
            data: finalData,
            recommendedUsers: recommendedUsers,
            userDetails : user
        });








    }catch(e){
        console.error(e);
        return c.json({status: "error", message: "Failed to get feed"}, 500);
    }



});

export default feed;