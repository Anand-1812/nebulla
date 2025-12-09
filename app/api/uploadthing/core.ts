import { createUploadthing, FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const authenticate = () => {
  const user = auth();
  if (!user) throw new Error("Unauthorized");
  return user;
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
