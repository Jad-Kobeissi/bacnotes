import { decode, verify } from "jsonwebtoken";
import { prisma, storage } from "../../init";
import { deleteObject, ref } from "firebase/storage";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: { id, author: { banned: false } },
      include: {
        author: {
          include: {
            followers: true,
            following: true,
            likedPosts: true,
            posts: true,
          },
        },
        likedUsers: true,
      },
    });

    if (!post) return new Response("No Posts Found", { status: 404 });

    if (!post.approved)
      return new Response("Post not approved", { status: 403 });
    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const decoded: any = await decode(authHeader);

    const post = await prisma.post.findUnique({
      where: {
        id,
        author: {
          banned: false,
        },
      },
    });
    if (!post) return new Response("No Posts Found", { status: 404 });
    if (decoded.id != post.authorId)
      return new Response("Unauthorized User", { status: 401 });
    let imageUrls = post.imageUrls;
    await prisma.post.delete({
      where: { id },
    });

    imageUrls.map(async (url) => {
      const imageUrl = ref(storage, url);
      await deleteObject(imageUrl);
    });
    const pointsToSubtract = 1 + post.likes;
    const ratingToSubtract = 2 + post.likes * 5;
    const updatedUser = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        points: {
          decrement: pointsToSubtract,
        },
        rating: {
          decrement: ratingToSubtract,
        },
      },
      include: {
        followers: true,
        following: true,
        likedPosts: true,
        posts: true,
      },
    });

    return Response.json(updatedUser);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
