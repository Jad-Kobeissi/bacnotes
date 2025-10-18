import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../../init";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id, banned: false },
      select: { admin: true },
    });
    if (!user?.admin) return new Response("Forbidden", { status: 403 });

    const url = new URL(req.url);
    const page = Number(await url.searchParams.get("page")) || 1;
    const skip = (page - 1) * 5;
    const posts = await prisma.post.findMany({
      where: {
        approved: {
          equals: false,
        },
        author: {
          banned: false,
        },
      },
      take: 5,
      skip: skip,
      include: {
        author: true,
        likedUsers: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });

    if (posts.length == 0)
      return new Response("No posts found", { status: 404 });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
