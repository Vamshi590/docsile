import {Hono} from "hono"
import AuthMiddleware from "../middlewares/AuthMiddleware";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";



const signup = new Hono<{
    Bindings: {
      DATABASE_URL: string;
      JWT_SECRET: string;
    };
}>();

signup.use("/*" , AuthMiddleware)


signup.post("/doctor", async (c) => {
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const response = await prisma.user.update({
      where: {
        id: body.id,
      },
      //@ts-ignore
      data: {
        name: body.name,
        country: body.country,
        city: body.city,
        organisation_name: body.organisation_name,
        department: body.specialisation_field_of_study,
        gender: body.gender,
        category: "doctor",
      },
    });

  
    if (response) {
      return c.json("Success");
    }
  } catch (e: any) {
    console.error(e);
  }
});

//signup/student

signup.post("/student", async (c) => {
  const body = await c.req.json();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const response = await prisma.user.update({
      where: {
        id: body.id,
      },
      data: {
        name: body.name,
        country: body.country,
        city: body.city,
        organisation_name: body.organisation_name,
        specialisation_field_of_study: body.specialisation_field_of_study,
        department: body.department,
        gender: body.gender,
        category: "student",
      },
    });

    if (response) {
      return c.json("Success");
    }
  } catch (e: any) {
    console.error(e);
  }
});



signup.post("/organisation", async (c) => {
  const body = await c.req.json();

  const email = body.email;
  const id = body.id;

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    if (email && id) {
      const response = await prisma.organisations.create({
        data: {
          email: email,
          category: "organisation",
          password: email,
          organisation_type: body.organisation_type,
          country: body.country,
          city: body.city,
          organisation_name: body.organisation_name,
        },
      });
    }

    const response = await prisma.organisations.update({
      where: {
        id: body.id,
      },
      data: {
        organisation_type: body.organisation_type,
        country: body.country,
        city: body.city,
        organisation_name: body.organisation_name,
      },
    });

    if (response) {
      return c.json("Success");
    }
  } catch (e: any) {
    console.error(e);
  }
});

export default signup
  