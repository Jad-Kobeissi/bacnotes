import { verify } from "jsonwebtoken";
import { prisma } from "../../init";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("nauthorized", { status: 401 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const skip = (page - 1) * 5;
    const requests = await prisma.request.findMany({
      where: {
        approved: false,
      },
      include: {
        author: true,
      },
      take: 5,
      skip: skip,
    });

    if (requests.length == 0)
      return new Response("No requests found", { status: 404 });

    return Response.json(requests);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
