import { decode, verify } from "jsonwebtoken";
import { prisma } from "../init";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const skip = (page - 1) * 5;
    const user = await prisma.user.findUnique({
      where: {
        id: decoded.id,
      },
      select: {
        grade: true,
      },
    });
    const requests = await prisma.request.findMany({
      where: {
        authorId: {
          not: decoded.id,
        },
        author: {
          grade: {
            equals: user?.grade,
          },
        },
      },
      take: 5,
      skip: skip,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        author: true,
        responses: true,
      },
    });

    if (requests.length == 0)
      return new Response("No Requests Found", { status: 404 });

    return Response.json(requests);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);

    const { title, description, subject } = await req.json();
    const request = await prisma.request.create({
      data: {
        title: title,
        description: description,
        authorId: decoded.id,
        subject: subject,
      },
    });

    return Response.json(request);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
