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

    const decoded: any = await decode(authHeader);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { admin: true },
    });

    if (!user?.admin) return new Response("Forbidden", { status: 403 });

    const { id } = await params;
    const response = await prisma.response.findUnique({
      where: { id },
      include: {
        author: true,
        request: true,
      },
    });

    if (!response) return new Response("Response not found", { status: 404 });

    await prisma.response.update({
      where: {
        id,
      },
      data: {
        approved: true,
      },
    });

    return new Response("Response approved", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
