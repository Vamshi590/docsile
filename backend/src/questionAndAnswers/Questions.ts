import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

const questions = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

questions.post("/ask-question/:id", async (c) => {
  const body = await c.req.json();

  const params = c.req.param();

  const userid = parseInt(params.id);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const question = await prisma.questions.create({
      data: {
        userId: userid,
        question: body.title,
        question_description: body.description,
        anonymous: body.anonymous,
        urgency: body.urgency,
        questionReferences: {
          create: body.referenceTags.map((ref: string) => ({ reference: ref })),
        },
      },
    });

    return c.json({
        status: "success",
        data: question
    })
  } catch (e) {
    console.log(e);
  }
});

questions.get("/:id", async (c) => {
  const params = c.req.param();
  const userId = parseInt(params.id);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // First get user details
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        city: true,
        department: true,
        organisation_name: true,
        memberships: true
      }
    });



    if (!user) {
      return c.json({ status: "error", message: "User not found" }, 404);
    }

    console.log(user);

    // Get questions in priority order
    const cityDeptQuestions = await prisma.questions.findMany({
      where: {
        AND: [
          { userId: { not: userId } }, // Exclude user's own questions
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
        }
      },
      orderBy: {
        urgency: 'desc' // This will sort HIGH -> MEDIUM -> LOW
      }
    });

    const orgDeptQuestions = await prisma.questions.findMany({
      where: {
        AND: [
          { userId: { not: userId } },
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
        }
      },
      orderBy: {
        urgency: 'desc'
      }
    });

    const membershipQuestions = await prisma.questions.findMany({
      where: {
        AND: [
          { userId: { not: userId } },
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
        }
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
          { userId: { not: userId } },
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
        }
      },
      orderBy: {
        urgency: 'desc'
      },
      take: 50 - priorityQuestions.length
    }) : [];

    const finalQuestions = [...priorityQuestions, ...additionalQuestions];

    return c.json({
      status: "success",
      data: finalQuestions
    });

  } catch (e) {
    console.error(e);
    return c.json({ 
      status: "error", 
      message: "Failed to fetch questions" 
    }, 500);
  }
});


export default questions;
