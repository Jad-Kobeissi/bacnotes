import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: String }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const postId = (await params).id;

    const decoded: any = await decode(authHeader);

    const post = await prisma.post.findUnique({
      where: {
        id: postId as string,
        author: {
          banned: false,
        },
      },
      include: {
        author: true,
        likedUsers: true,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    if (!post.approved)
      return new Response("Post not approved", { status: 403 });
    if (!post.likedUsers.some((user) => user.id === decoded.id))
      return new Response("Post not liked", { status: 400 });
    await prisma.post.update({
      where: {
        id: postId as string,
      },
      data: {
        likedUsers: {
          disconnect: {
            id: decoded.id,
          },
        },
        likes: {
          decrement: 1,
        },
      },
    });

    await prisma.user.update({
      where: {
        id: post.authorId,
      },
      data: {
        rating: {
          decrement: 5,
        },
        points: {
          decrement: 1,
        },
      },
    });

    return Response.json(post);
  } catch (error: any) {
    console.log(error);

    return new Response(error, { status: 500 });
  }
}
