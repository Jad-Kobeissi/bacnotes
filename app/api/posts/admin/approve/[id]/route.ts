import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: { id: string; username: string } = (await decode(
      authHeader
    )) as { id: string; username: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id, banned: false },
      select: { admin: true },
    });
    if (!user?.admin) return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id,
        author: {
          banned: false,
        },
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    if (post.approved)
      return new Response("Post already approved", { status: 409 });

    await prisma.post.update({
      where: {
        id,
      },
      data: {
        approved: true,
      },
    });

    await prisma.user.update({
      where: {
        id: post.authorId,
      },
      data: {
        points: {
          increment: 1,
        },
        rating: {
          increment: 2,
        },
      },
      include: {
        posts: true,
        followers: true,
        following: true,
        likedPosts: true,
      },
    });
    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
