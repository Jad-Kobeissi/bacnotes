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
      where: { id },
      include: {
        author: true,
        likedUsers: true,
      },
    });

    if (!post) return new Response("No Posts Found", { status: 404 });

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
      where: { id },
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

    return Response.json(post);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
