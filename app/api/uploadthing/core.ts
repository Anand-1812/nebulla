import { createUploadthing, FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const authenticate = async () => {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");
  return { userId };
}

export const OurFileRouter = {
  subaccountLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(authenticate)
  .onUploadComplete(() => {}),

  avatar: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(authenticate)
  .onUploadComplete(() => {}),

  agencyLogo: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(authenticate)
  .onUploadComplete(() => {}),

  media: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
  .middleware(authenticate)
  .onUploadComplete(() => {}),
} satisfies FileRouter

export type OurFileRouter = typeof OurFileRouter
