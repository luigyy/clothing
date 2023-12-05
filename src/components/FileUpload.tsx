// Don't forget the CSS: core and the UI components + plugins you are using.
import Uppy from "@uppy/core";
import { Dashboard } from "@uppy/react";
import XHR from "@uppy/xhr-upload";

// Don't forget the CSS: core and the UI components + plugins you are using.
import "@uppy/core/dist/style.min.css";
import "@uppy/dashboard/dist/style.min.css";
import { useEffect } from "react";
//
const uppy = new Uppy().use(XHR, {
  endpoint: "https://api.cloudinary.com/v1_1/dyjoitdy2/image/upload",
  allowedMetaFields: ["upload_preset", "tags"],
});

export default function FileUpload({
  preset,
  userEmail,
  imagesUrls,
  setImagesFunction,
  minNumberOfFilesAllowed,
  maxNumberOfFilesAllowed,
}: {
  preset: string;
  userEmail: string;
  imagesUrls: string[];
  setImagesFunction: (images: string[]) => void;
  minNumberOfFilesAllowed: number;
  maxNumberOfFilesAllowed: number;
}) {
  useEffect(() => {
    uppy.setOptions({
      id: "uppy",
      restrictions: {
        maxNumberOfFiles: maxNumberOfFilesAllowed,
        minNumberOfFiles: minNumberOfFilesAllowed,
        maxFileSize: 15 * 1000000,
        allowedFileTypes: [
          "image/png",
          "image/jpeg",
          "image/webp",
          "image/heif",
          "image/heic",
        ],
      },
    });
  });

  uppy.on("file-added", (file) => {
    uppy.setFileMeta(file.id, {
      upload_preset: preset,
      tags: userEmail,
    });
  });

  uppy.on("upload-error", (_, response) => {
    console.log(response);
  });

  uppy.on("upload-success", (_, response) => {
    setImagesFunction([...imagesUrls, response.body.secure_url]);
  });
  //
  return (
    <Dashboard
      width={500}
      height={250}
      uppy={uppy}
      className="mx-auto flex justify-center py-10 "
    />
  );
}
