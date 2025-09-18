import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];
    const url = new URL(req.url);
    const page = Number(await url.searchParams.get("page")) || 1;
    const skip = (page - 1) * 5;

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN!)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const userId = (await params).id;
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          equals: userId,
        },
      },
      include: {
        author: true,
        likedUsers: true,
      },
      skip: skip,
      take: 5,
    });

    if (posts.length == 0)
      return new Response("No posts found", { status: 404 });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
