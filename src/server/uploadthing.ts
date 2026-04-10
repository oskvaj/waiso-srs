import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "./auth";
import { db } from "@/server/db";

const f = createUploadthing();

export const uploadRouter = {
  moduleImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();
      if (!session?.user) throw new Error("Unauthorized");

      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { teacher: { select: { userId: true } } },
      });

      if (!user?.teacher) throw new Error("Only teachers can upload");

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, url: file.ufsUrl };
    }),
} satisfies FileRouter;

export type UploadRouter = typeof uploadRouter;
