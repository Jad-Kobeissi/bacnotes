import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = decode(authHeader);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user?.admin) return new Response("Forbidden", { status: 403 });
    const { id } = await params;

    const bannedUser = await prisma.user.findUnique({
      where: { id },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!bannedUser) return new Response("User not found", { status: 404 });

    return Response.json(bannedUser);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
