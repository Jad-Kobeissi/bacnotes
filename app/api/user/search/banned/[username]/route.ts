import { prisma } from "@/app/api/init";
import Fuse from "fuse.js";
import { decode, verify } from "jsonwebtoken";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const decoded: any = await decode(authHeader);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user?.admin) return new Response("Forbidden", { status: 403 });
    const { username } = await params;

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") as string) || 1;
    const skip = (page - 1) * 5;
    const users = await prisma.user.findMany({
      where: { banned: true },
      take: 5,
      skip,
      orderBy: { createdAt: "desc" },
    });

    const fuse = new Fuse(users, {
      keys: ["username"],
      threshold: 0.3,
    });

    const filteredUsers = fuse.search(username).map((item) => item.item);

    if (filteredUsers.length === 0)
      return new Response("No users found", { status: 404 });

    return Response.json(filteredUsers);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
