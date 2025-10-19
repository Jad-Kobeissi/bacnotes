import { verify } from "jsonwebtoken";
import { prisma } from "../../init";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;

    const response = await prisma.response.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });

    if (!response) return new Response("Response not found", { status: 404 });

    return Response.json(response);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
