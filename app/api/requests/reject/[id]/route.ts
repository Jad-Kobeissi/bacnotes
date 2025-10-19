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

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user?.admin) return new Response("Forbidden", { status: 403 });
    const { id } = await params;

    const request = await prisma.request.findUnique({ where: { id } });

    if (!request) return new Response("Request not found", { status: 404 });

    await prisma.request.update({
      where: {
        id,
      },
      data: {
        approved: false,
      },
    });

    return new Response("Request Rejected", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
