import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN!))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        followers: true,
        following: true,
        likedPosts: true,
        posts: true,
      },
    });

    if (!user) return new Response("Post not found", { status: 404 });
    return Response.json(user);
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

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN!)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;
    const decoded: any = decode(authHeader);

    if (decoded.id !== id) {
      return new Response("Forbidden", { status: 403 });
    }

    const post = await prisma.user.findUnique({ where: { id } });

    if (!post) {
      return new Response("User not found", { status: 404 });
    }
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return new Response("Post deleted", { status: 200 });
  } catch (error: any) {
    console.log(error);
    return new Response(error, { status: 500 });
  }
}
