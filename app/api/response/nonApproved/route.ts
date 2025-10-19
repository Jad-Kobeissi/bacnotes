import { verify } from "jsonwebtoken";
import { prisma } from "../../init";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const skip = (page - 1) * 5;
    const responses = await prisma.response.findMany({
      where: {
        approved: false,
      },
      include: {
        request: true,
        author: true,
      },
      take: 5,
      skip: skip,
    });

    if (responses.length == 0)
      return new Response("No responses found", { status: 404 });

    return Response.json(responses);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
