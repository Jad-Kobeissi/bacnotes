import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../../init";

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

    const bannedUser = await prisma.user.findUnique({
      where: {
        id: id,
        banned: false,
      },
    });

    if (!bannedUser) return new Response("User not found", { status: 404 });

    const report = await prisma.report.findFirst({
      where: {
        userId: id,
      },
    });

    if (report) {
      await prisma.report.delete({
        where: {
          userId: id,
        },
      });
    }
    const updatedUser = await prisma.user.update({
      where: {
        id,
      },
      data: {
        banned: true,
      },
    });

    return Response.json(updatedUser);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
