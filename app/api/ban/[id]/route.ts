import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../init";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);

    const user = await prisma.user.findUnique({ where: { id: decoded.ud } });

    if (!user?.admin) return new Response("Unauthorized", { status: 401 });
    const { id } = await params;

    const bannedUser = await prisma.user.findUnique({
      where: {
        id,
        banned: true,
      },
    });

    if (!bannedUser) return new Response("User not found", { status: 404 });

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
