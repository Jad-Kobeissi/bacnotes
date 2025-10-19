import { prisma } from "@/app/api/init";
import { decode, verify } from "jsonwebtoken";
import Fuse from "fuse.js";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN!)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const decoded: any = await decode(authHeader);
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;

    const { username } = await params;

    const skip = (page - 1) * 5;
    const users = await prisma.user.findMany({
      where: {
        banned: false,
        username: {
          not: decoded.username,
        },
      },
      skip: skip,
      take: 5,
    });

    const fuse = new Fuse(users, {
      keys: ["username"],
      threshold: 0.3,
    });

    const filteredUsers = fuse.search(username).map((item) => item.item);
    if (filteredUsers.length === 0) {
      return new Response("No users found", { status: 404 });
    }

    return Response.json(filteredUsers);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
