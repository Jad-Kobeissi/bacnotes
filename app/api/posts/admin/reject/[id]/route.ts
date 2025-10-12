import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized");

    const decoded: any = await decode(authHeader);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { admin: true },
    });
    if (!user?.admin) return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const post = await prisma.post.findUnique({
      where: {
        id,
      },
    });

    if (!post) return new Response("Post not found", { status: 404 });

    await prisma.post.delete({
      where: {
        id,
      },
    });

    return new Response("Post rejected");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
