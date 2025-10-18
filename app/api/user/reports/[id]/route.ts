import { prisma } from "@/app/api/init";
import { verify } from "jsonwebtoken";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const user = await prisma.user.findUnique({
      where: {
        id,
        banned: false,
      },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!user) return new Response("User not found", { status: 404 });

    const reportCheck = await prisma.report.findFirst({
      where: {
        userId: id,
      },
    });

    if (reportCheck)
      return new Response("User already reported", { status: 400 });
    const report = await prisma.report.create({
      data: {
        userId: id,
      },
    });

    return Response.json(report);
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

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const report = await prisma.report.findUnique({ where: { id } });

    if (!report) return new Response("Report not found", { status: 404 });

    await prisma.report.delete({ where: { id } });

    return new Response("Report deleted", { status: 200 });
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
