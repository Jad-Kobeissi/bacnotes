import { decode, verify } from "jsonwebtoken";
import { prisma, storage } from "../init";
import { isEmpty } from "../isEmpty";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];
    const url = new URL(req.url);
    const page = Number(await url.searchParams.get("page")) || 1;
    const skip = (page - 1) * 5;

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN!)) {
      return new Response("Unauthorized", { status: 401 });
    }

    const decoded: any = await decode(authHeader);
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { grade: true },
    });
    const posts = await prisma.post.findMany({
      where: {
        authorId: {
          not: decoded.id,
        },
        author: {
          grade: user?.grade,
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
          },
        },
        likedUsers: true,
      },
      skip: skip,
      take: 5,
    });

    if (posts.length == 0)
      return new Response("No posts found", { status: 404 });

    return Response.json(posts);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN!)) {
      return new Response("Unauthorized", { status: 401 });
    }
    const decoded: any = await decode(authHeader);

    const formData = await req.formData();

    const title = formData.get("title")?.toString();
    const description = formData.get("description")?.toString();
    const subject = formData.get("subject")?.toString();
    const files = formData.getAll("files") as File[] | null;
    let filesArray: File[] | String[] = Array.from(files as File[]);

    if (filesArray.length == 0)
      return new Response("No files uploaded", { status: 400 });
    if (
      !title ||
      !description ||
      !subject ||
      isEmpty([title, description, subject])
    )
      return new Response("Missing required fields", { status: 400 });

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
      ].includes(subject)
    ) {
      return new Response("Invalid subject", { status: 400 });
    }
    const post = await prisma.post.create({
      data: {
        title,
        description,
        subject,
        author: {
          connect: {
            id: decoded.id,
          },
        },
        likes: 0,
      },
    });

    filesArray = await Promise.all(
      filesArray.map(async (file) => {
        const postRef = ref(
          storage,
          `${process.env.IMAGES_BUCKET}/${post.id}- ${crypto.randomUUID()}`
        );
        await uploadBytes(postRef, file);
        console.log(file.name);

        return getDownloadURL(postRef);
      })
    );

    await prisma.post.update({
      where: {
        id: post.id,
      },
      data: {
        imageUrls: filesArray as string[],
      },
    });
    const updatedUser = await prisma.user.update({
      where: {
        id: decoded.id,
      },
      data: {
        points: {
          increment: 1,
        },
        rating: {
          increment: 2,
        },
      },
      include: {
        posts: true,
        followers: true,
        following: true,
        likedPosts: true,
      },
    });

    return Response.json(updatedUser);
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
