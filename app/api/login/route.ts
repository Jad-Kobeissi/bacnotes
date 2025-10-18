import { compare } from "bcrypt";
import { isEmpty } from "../isEmpty";
import { prisma } from "../init";
import { sign } from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password || isEmpty([username, password])) {
      return new Response("Missing username or password", { status: 400 });
    }
    const lowercaseUsername = username.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { username: lowercaseUsername, banned: false },
      include: {
        followers: true,
        following: true,
        posts: true,
        likedPosts: true,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const passMatches = await compare(password, user.password);

    if (!passMatches) {
      return new Response("Incorrect password", { status: 401 });
    }

    const token = await sign({ id: user.id, username }, process.env.JWT_TOKEN!);

    return Response.json({ token, user });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
