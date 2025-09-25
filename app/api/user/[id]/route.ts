import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";

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
