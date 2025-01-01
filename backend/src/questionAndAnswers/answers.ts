import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";



const answers = new Hono<{
    Bindings : {
        DATABASE_URL: string,
        JWT_SECRET: string;
    }
}>()



answers.post("/:questionId", async (c) => {
    try {
        const body = await c.req.json();
        const params = c.req.param();

        console.log("Body:", body);

        if (!body.answer || !body.id) {
            return c.json({
                status: "error",
                message: "Answer text and user ID are required"
            }, 400);
        }

        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate());

        const answer = await prisma.answers.create({
            data: {
                questionsId: parseInt(params.questionId),
                answer_description: body.answer,
                answered_user_id: body.id
            }
        });

        return c.json({
            status: "success",
            data: answer
        }, 201);

    } catch (e) {
        console.error("Error creating answer:", e);
        return c.json({
            status: "error",
            message: "Failed to create answer"
        }, 500);
    }
});


export default answers



