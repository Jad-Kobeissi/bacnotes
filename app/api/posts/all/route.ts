import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../init";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const skip = (page - 1) * 5;
    const decoded: any = await decode(authHeader);
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          not: decoded.id,
        },
      },
      include: {
        author: {
          include: {
            followers: true,
            following: true,
          },
        },
        likedUsers: true,
      },
      take: 5,
      skip: skip,
    });

    if (posts.length == 0)
      return new Response("No posts found", { status: 404 });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
