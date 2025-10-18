import { hash } from "bcrypt";
import { isEmpty } from "../isEmpty";
import { prisma } from "../init";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, password, grade } = await req.json();

    if (!username || !password || !grade || isEmpty([username, password])) {
      return new Response("Username, Password, or grade is missing", {
        status: 400,
      });
    }

    const lowercaseUsername = username.toLowerCase();
    const userCheck = await prisma.user.findUnique({
      where: {
        username: lowercaseUsername,
      },
      include: {
        followers: true,
        following: true,
        posts: true,
        likedPosts: true,
      },
    });

    if (userCheck) return new Response("User already exists", { status: 400 });

    const user = await prisma.user.create({
      data: {
        username: lowercaseUsername,
        password: await hash(password, 10),
        points: 0,
        rating: 0,
        grade: grade,
      },
    });

    const token = await sign({ id: user.id, username }, process.env.JWT_TOKEN!);

    return Response.json({ user, token });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
