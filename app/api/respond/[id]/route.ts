import { decode, verify } from "jsonwebtoken";
import { prisma, storage } from "../../init";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = req.headers.get("Authorization")?.split(" ")[1];

    if (!authHeader || !verify(authHeader, process.env.JWT_TOKEN as string))
      return new Response("Unauthorized", { status: 401 });

    const { id } = await params;
    const decoded: any = await decode(authHeader);

    console.log(decoded.id);

    const formData = await req.formData();
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const images = formData.getAll("images") as Blob[];

    const response = await prisma.response.create({
      data: {
        title,
        description,
        authorId: decoded.id,
        requestId: id,
      },
    });

    const filesArray = await Promise.all(
      images.map(async (image) => {
        const postRef = ref(
          storage,
          `${process.env.RESPONSES_BUCKET}/${
            response.id
          }-${crypto.randomUUID()}`
        );
        await uploadBytes(postRef, image);
        const url = await getDownloadURL(postRef);
        return url;
      })
    );

    await prisma.response.update({
      where: {
        id: response.id,
      },
      data: {
        imageUrls: filesArray,
      },
    });

    return new Response("Response created");
  } catch (error: any) {
    return new Response(error, { status: 500 });
  }
}
