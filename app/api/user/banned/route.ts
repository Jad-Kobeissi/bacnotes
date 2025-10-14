import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../init";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user?.admin) return new Response("Forbidden", { status: 403 });

    const users = await prisma.user.findMany({
      where: {
        banned: true,
      },
      include: {
        followers: true,
        likedPosts: true,
        following: true,
        posts: true,
      },
    });

    if (users.length == 0)
      return new Response("Users not found", { status: 404 });

    return Response.json(users);
  } catch (error: any) {
    return new Response(error.response.data);
  }
}
