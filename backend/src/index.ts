import { PrismaClient } from "@prisma/client/edge";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { cors } from "hono/cors";
import { withAccelerate } from "@prisma/extension-accelerate";
import { getCookie, setCookie } from "hono/cookie";
import auth from "./Auth/auth";
import signup from "./signup";
import followRoute from "./follow/FollowRoute";
import questions from "./questionAndAnswers/Questions";
import answers from "./questionAndAnswers/answers";
import { S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import feed from "./Feed/feed";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    AWS_ACCESS_KEY: string;
    AWS_SECRET: string;
  };
}>();
//cors middleware
app.use(
  "/*",
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    allowMethods: ["POST", "GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

app.route("/auth", auth);
app.route("/signup", signup);
app.route("/follow", followRoute);
app.route("/questions", questions);
app.route("/answer", answers);
app.route("/feed", feed)

app.get("/get-upload-url", async (c) => {
  const fileName = `uploads/${Date.now()}.jpg`;
  const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: c.env.AWS_ACCESS_KEY,
      secretAccessKey: c.env.AWS_SECRET,
    },
  });

  const command = new PutObjectCommand({
    Bucket: "dev-docsile-profile",
    Key: fileName,
  });

  try {
    const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    const imageURL = `https://dev-docsile-profile.s3.ap-south-1.amazonaws.com/${fileName}`;
    return c.json({ uploadURL, imageURL });
  } catch (error) {
    return c.json({ error: "Failed to generate upload URL" }, 500);
  }
});

app.post("/get-upload-urls", async (c) => {
  const { fileCount, fileTypes, id, type } = await c.req.json();
  
  // Validate request
  if (!fileCount || fileCount > 6 || !Array.isArray(fileTypes)) {
    return c.json({ error: "Invalid request. Maximum 6 files allowed." }, 400);
  }

  const s3Client = new S3Client({
    region: "ap-south-1",
    credentials: {
      accessKeyId: c.env.AWS_ACCESS_KEY,
      secretAccessKey: c.env.AWS_SECRET,
    },
  });

  try {
    const urls = await Promise.all(
      Array.from({ length: fileCount }).map(async (_, index) => {
        const uniqueSuffix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
const fileName = `${id}/${type}/${uniqueSuffix}.${fileTypes[index].split("/")[1]}`;
        const command = new PutObjectCommand({
          Bucket: "dev-docsile-profile",
          Key: fileName,
          ContentType: fileTypes[index]
        });

        const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 60 });
        const imageURL = `https://dev-docsile-profile.s3.ap-south-1.amazonaws.com/${fileName}`;
        
        return { uploadURL, imageURL };
      })
    );

    console.log(urls);

    return c.json({ urls });
  } catch (error) {
    console.error(error);
    return c.json({ error: "Failed to generate upload URLs" }, 500);
  }
});

// Add new endpoint to update profile picture URL
app.post("/update-profile-picture", async (c) => {
  const { userId, imageUrl } = await c.req.json();
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    await prisma.user.update({
      where: { id: parseInt(userId) },
      data: { profile_picture: imageUrl },
    });
    return c.json({ success: true });
  } catch (error) {
    return c.json({ error: "Failed to update profile picture" }, 500);
  }
});

app.get("/check-verification", async (c) => {
  const userid = c.req.query("id") || "";
  const intUserId = parseInt(userid);
  const verifiedcookie = getCookie(c, "verifytoken");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    if (verifiedcookie) {
      // Verify the JWT token
      const decoded: any = await verify(verifiedcookie, c.env.JWT_SECRET);

      console.log(decoded);
      const intdecodedId = parseInt(decoded.userId);

      if (intdecodedId === intUserId) {
        return c.json({ verified: true });
      } else {
        return c.json({ message: "Token user mismatch" }, 403);
      }
    }

    // If no cookie or invalid, check database
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userid || "") },
      select: {
        register_number: true,
        verified: true,
        medical_counsel: true,
        id: true,
      },
    });

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    if (user.register_number && user.verified) {
      // User is verified, generate a new token
      const newToken = await sign(
        {
          userId: user.id,
          registrationNo: user.register_number,
          medicalCouncil: user.medical_counsel,
        },
        c.env.JWT_SECRET
      );

      // Set the new token in cookies
      setCookie(c, "verifytoken", newToken, {
        httpOnly: true,
        maxAge: 34559999, // 400 days
        secure: false,
        sameSite: "strict",
        path: "/",
      });

      return c.json({ verified: true });
    } else {
      return c.json({ verified: false });
    }
  } catch (err) {
    console.error("Error:", err);
    return c.json({ message: "Internal server error" }, 500);
  }
});

app.get("/profile/:id", async (c) => {
  const userid = parseInt(c.req.param("id"));

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const userData = await prisma.user.findUnique({
      where: { id: userid },
      select: {
        id: true,
        name: true,
        city: true,
        profile_picture: true,
        specialisation_field_of_study: true,
        organisation_name: true,
        department: true,
        questions: true,
        posts: true,
        certifications: true,
        achievementsAwards: true,
        professionalExperience: true,
        education: true,
        memberships: true,
        // email and password are excluded
      },
    });

    if (!userData) {
      return c.json({ message: "User not found" }, 404);
    }

    return c.json({
      status: "success",
      data: userData,
    });
  } catch (e) {
    console.error("Error fetching profile:", e);
    return c.json(
      {
        status: "error",
        message: "Failed to fetch profile data",
      },
      500
    );
  }
});

// ask question

app.post("/publish-post/:id", async (c) => {
  const body = await c.req.json();
  const params = c.req.param();
  const userid = parseInt(params.id);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.$transaction(async (tx) => {
      const newPost = await tx.posts.create({
        data: {
          userId: userid,
          title: body.title,
          description: body.description,
          postImageLinks: body.imageUrls?.length ? {
            create: body.imageUrls.map((url: string) => ({
              postImageLink: url
            }))
          } : undefined
        },
        include: {
          postImageLinks: true
        }
      });

      return newPost;
    }, { timeout: 10000 });

    return c.json({
      status: "success",
      data: post,
    });
  } catch (e) {
    console.error(e);
    return c.json(
      {
        status: "error",
        message: "Failed to create post",
      },
      500
    );
  }
});

app.post("/add-certificate/:id", async (c) => {
  const body = await c.req.json();

  const params = c.req.param();

  const userid = parseInt(params.id);

  console.log(body.imageUrl);

  const mediaLink = body.imageUrl || '';

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.certifications.create({
      data: {
        userId: userid,
        certificateName: body.certificateName,
        issuingOrganisation: body.issuingOrganisation,
        issueDate: body.issueDate,
        certificateURL: body.certificateURL,
        descreption: body.descreption,
        certificateMediaLink : mediaLink
      },
    });

    return c.json(post);
  } catch (e) {
    return c.json({ e });
  }
});

app.post("/add-professional-experience/:id", async (c) => {
  const body = await c.req.json();

  const params = c.req.param();

  const userid = parseInt(params.id);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.professionalExperience.create({
      data: {
        userId: userid,
        title: body.title,
        organisation: body.organisation,
        startDate: body.startDate,
        endDate: body.endDate,
        location: body.location,
      },
    });

    return c.json(post);
  } catch (e) {
    return c.json({ e });
  }
});

app.post("/add-education/:id", async (c) => {
  const body = await c.req.json();

  const params = c.req.param();

  const userid = parseInt(params.id);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.education.create({
      data: {
        userId: userid,
        schoolName: body.schoolName,
        degree: body.degree,
        department: body.department,
        startDate: body.startDate,
        endDate: body.endDate,
        grade: body.grade,
      },
    });

    return c.json(post);
  } catch (e) {
    return c.json({ e });
  }
});

app.post("/add-memberships/:id", async (c) => {
  const body = await c.req.json();

  const params = c.req.param();

  const userid = parseInt(params.id);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const post = await prisma.memberships.create({
      data: {
        userId: userid,
        societyname: body.societyName,
        position: body.position,
        relatedDepartment: body.relatedDepartment,
        membershipId: body.membershipId,
      },
    });

    return c.json(post);
  } catch (e) {
    return c.json({ e });
  }
});

app.get("/connections/:id", async (c) => {
  const params = c.req.param();

  const userid = parseInt(params.id);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Retrieve user's info to match relevant users
    const user = await prisma.user.findUnique({
      where: { id: userid },
      select: {
        specialisation_field_of_study: true,
        department: true,
        city: true,
        organisation_name: true,
      },
    });

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    // First get exact matches
    const exactMatches = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userid } },
          {
            NOT: {
              followers: {
                some: {
                  followingId: userid,
                },
              },
            },
          },
          {
            OR: [
              {
                specialisation_field_of_study:
                  user.specialisation_field_of_study,
              },
              { department: user.department },
              { city: user.city },
              { organisation_name: user.organisation_name },
            ],
          },
        ],
      },
      orderBy: [
        { specialisation_field_of_study: "desc" },
        { department: "desc" },
        { city: "desc" },
        { organisation_name: "desc" },
      ],
    });

    let relatedUsers = exactMatches;

    // If less than 50 results, fetch additional users
    if (exactMatches.length < 50) {
      const remainingCount = 50 - exactMatches.length;
      const additionalUsers = await prisma.user.findMany({
        where: {
          AND: [
            { id: { not: userid } },
            {
              NOT: {
                followers: {
                  some: {
                    followingId: userid,
                  },
                },
              },
            },
            // Exclude users already in exactMatches
            {
              id: {
                notIn: exactMatches.map((user) => user.id),
              },
            },
          ],
        },
        orderBy: {
          created_at: "desc", // Show newest users first
        },
        take: remainingCount,
      });

      relatedUsers = [...exactMatches, ...additionalUsers];
    }

    return c.json(relatedUsers);
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error fetching related users" }, 500);
  }
});

app.get("/connections/network/:id", async (c) => {
  const params = c.req.param();
  const userid = parseInt(params.id);

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Get followers (people who follow the user)
    const followers = await prisma.follow.findMany({
      where: {
        followingId: userid,
      },
      select: {
        follower: {
          select: {
            id: true,
            name: true,
            specialisation_field_of_study: true,
            organisation_name: true,
            city: true,
          },
        },
      },
    });

    // Get following (people whom the user follows)
    const following = await prisma.follow.findMany({
      where: {
        followerId: userid,
      },
      select: {
        following: {
          select: {
            id: true,
            name: true,
            specialisation_field_of_study: true,
            organisation_name: true,
            city: true,
          },
        },
      },
    });

    // Transform the data to flatten the structure
    const formattedFollowers = followers.map((f) => f.follower);
    const formattedFollowing = following.map((f) => f.following);

    return c.json({
      followers: formattedFollowers,
      following: formattedFollowing,
      followersCount: formattedFollowers.length,
      followingCount: formattedFollowing.length,
    });
  } catch (error) {
    console.error(error);
    return c.json({ message: "Error fetching network data" }, 500);
  }
});

app.post("/verify-doctor", async (c) => {
  try {
    const body = await c.req.json();
    const { registrationNo, medicalCouncil, userId } = body;

    const intUserId = parseInt(userId);

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    // Check if data exists in doctors table
    const doctorRecord = await prisma.doctors.findFirst({
      where: {
        registrationNo: registrationNo,
      },
    });

    if (doctorRecord) {
      // Parse stored doctors data
      const doctorsData = JSON.parse(doctorRecord.doctors);

      // Check if registration matches medical council
      const isValid = doctorsData.some(
        (doctor: any) => doctor.smcName === medicalCouncil
      );

      if (isValid) {
        // Generate and set verification token

        const response = await prisma.user.update({
          where: { id: intUserId },
          data: {
            medical_counsel: medicalCouncil,
            register_number: registrationNo,
            verified: true,
          },
        });

        if (response) {
          const token = await sign(
            {
              registrationNo,
              userId,
              medicalCouncil,
            },
            c.env.JWT_SECRET
          );

          setCookie(c, "verifytoken", token, {
            httpOnly: true,
            maxAge: 34559999,
            secure: true,
            sameSite: "strict",
            path: "/",
          });
        }

        return c.json({ verified: true, data: doctorsData });
      }

      return c.json({ verified: false, data: doctorsData });
    }

    // If no local data, fetch from NMC
    const response = await fetch(
      "https://www.nmc.org.in/MCIRest/open/getDataFromService?service=searchDoctor",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
        },
        body: JSON.stringify({ registrationNo }),
      }
    );

    const data = await response.json();

    // Store the response in doctors table regardless of validation
    await prisma.doctors.create({
      data: {
        registrationNo: registrationNo,
        doctors: JSON.stringify(data),
      },
    });

    if (Array.isArray(data) && data.length > 0) {
      // Check if registration matches medical council
      const isValid = data.some(
        (doctor: any) => doctor.smcName === medicalCouncil
      );

      if (isValid) {
        const response = await prisma.user.update({
          where: { id: intUserId },
          data: {
            medical_counsel: medicalCouncil,
            register_number: registrationNo,
            verified: true,
          },
        });

        if (response) {
          // Generate and set verification token
          const token = await sign(
            {
              registrationNo,
              userId,
              medicalCouncil,
            },
            c.env.JWT_SECRET
          );

          setCookie(c, "verifytoken", token, {
            httpOnly: true,
            maxAge: 3600,
            secure: true,
            sameSite: "strict",
            path: "/",
          });
        }

        return c.json({ verified: true, data });
      }

      return c.json({ verified: false, data });
    }

    // Empty array or error response
    return c.json({
      verified: false,
      message: "No doctor found with given registration number",
      data,
    });
  } catch (error) {
    console.error("Error:", error);
    return c.json({ message: "Error verifying doctor registration" }, 500);
  }
});

export default app;
