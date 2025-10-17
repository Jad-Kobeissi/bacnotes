import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../../init";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ subject: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const decoded: any = (await decode(authHeader)) as {
      id: string;
      username: string;
    };

    const { subject } = await params;
    const url = new URL(req.url);
    const page = Number(await url.searchParams.get("page")) || 1;

    const skip = (page - 1) * 5;

    if (
      ![
        "math",
        "physics",
        "chemistry",
        "biology",
        "economics",
        "history",
        "geography",
        "english",
        "french",
        "arabic",
        "civics",
      ].includes(subject)
    ) {
      return new Response("Invalid subject", { status: 400 });
    }
    const user = await prisma.user.findUnique({
      where: { id: decoded.id, banned: false },
      select: { grade: true },
    });
    const posts = await prisma.post.findMany({
      where: {
        subject: subject,
        NOT: {
          authorId: decoded.id,
        },
        author: {
          grade: user?.grade,
          banned: false,
        },
        approved: {
          equals: true,
        },
      },
      include: {
        author: {
          include: {
            followers: true,
            following: true,
            likedPosts: true,
            posts: true,
          },
        },
        likedUsers: true,
      },
      take: 5,
      skip: skip,
    });

    if (posts.length == 0)
      return new Response("Posts not found", { status: 404 });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
