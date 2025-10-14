import { decode, verify } from "jsonwebtoken";
import { prisma } from "../../../init";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    const following = await prisma.user.findUnique({
      where: {
        id,
      },
      include: {
        following: true,
      },
    });

    if (!following) return new Response("User not found", { status: 404 });

    const decoded: any = await decode(authHeader);

    if (decoded.id == id)
      return new Response("You can't follow yourself", { status: 400 });

    const follower = await prisma.user.findUnique({
      where: {
        id: decoded.id,
        banned: false,
      },
      include: {
        followers: true,
        following: true,
      },
    });

    if (!follower) return new Response("Please LogIn Again", { status: 404 });

    if (!follower.following.some((u) => u.id == id)) {
      return new Response("You are not following this user", {
        status: 400,
      });
    }
    const user = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        following: {
          disconnect: {
            id,
          },
        },
      },
      include: {
        followers: true,
        following: true,
        likedPosts: true,
      },
    });
    await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        followers: {
          disconnect: {
            id: decoded.id,
          },
        },
      },
    });

    return Response.json(user);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
