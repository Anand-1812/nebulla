import Image from "next/image";
import { Button } from "../ui/button";
import { FileIcon, X } from "lucide-react";
import { UploadDropzone } from "@/lib/uploadthing";

type Props = {
  apiEndpoint: "agencyLogo" | "avatar" | "subaccountLogo";
  onChange: (url?: string) => void;
  value?: string;
};

const FileUpload = ({ apiEndpoint, onChange, value }: Props) => {
  const type = value?.split(".").pop();

  if (value) {
    return (
      <div className="flex flex-col justify-center items-center">
        {type !== "pdf" ? (
          <div className="relative w-40 h-40">
            <Image
              src={value}
              alt="uploaded image"
              fill
              className="object-contain"
            />
          </div>
        ) : (
          <div className="relative flex items-center p-2 rounded-md bg-background/10">
            <FileIcon />
            <a
              href={value}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-2 text-sm text-indigo-500 hover:underline"
            >
              View Pdf
            </a>
          </div>
        )}

        <Button variant="ghost" type="button" onClick={() => onChange("")}>
          <X className="w-4 h-4" />
          Remove Logo
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full bg-muted/30">
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[1].url)
        }}
        onUploadError={(error) => console.error(error)}
      />
    </div>
  );
};

export default FileUpload;

