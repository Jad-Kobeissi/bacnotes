import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../init";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = decode(authHeader);

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;

    const skip = (page - 1) * 5;
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { admin: true },
    });
    if (!user?.admin) return new Response("Frobidden", { status: 403 });

    const reports = await prisma.report.findMany({
      take: 5,
      skip: skip,
      include: {
        user: true,
      },
    });

    if (!reports) return new Response("No reports found", { status: 404 });
    return Response.json(reports);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
