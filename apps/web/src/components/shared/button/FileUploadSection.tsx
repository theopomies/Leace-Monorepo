/* eslint-disable @next/next/no-img-element */
import React, { ChangeEvent, useState } from "react";
import { FileInput } from "../forms/FileInput";
import { InputProps } from "../forms/Input";

export interface FileUploadSectionProps extends InputProps {
  selectedFiles: File[];
  setSelectedFiles: (files: File[]) => void;
}

export const FileUploadSection = ({
  selectedFiles,
  setSelectedFiles,
  ...inputProps
}: FileUploadSectionProps) => {
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleFile = (event: ChangeEvent<HTMLInputElement>): void => {
    if (event.target.files) {
      const files: File[] = Array.from(event.target.files);
      setSelectedFiles(files);

      // Read and display image previews
      const previews: string[] = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target && e.target.result) {
            previews.push(e.target.result as string);
            setImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <section className="flex flex-col items-center justify-center gap-5 rounded-lg border-2 border-dashed p-5">
      <div className="flex flex-wrap">
        {selectedFiles.map((file, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center p-3"
          >
            {imagePreviews[index] && (
              <img
                src={
                  file.type === "application/pdf"
                    ? "/pdfLogo.jpg"
                    : imagePreviews[index]
                }
                alt={`Preview of ${file.name}`}
                className="w-32"
              />
            )}
            {file.name.length > 15
              ? file.name.substring(0, 15) + "..."
              : file.name}
          </div>
        ))}
      </div>
      <div className="self-center">
        <FileInput multiple onChange={handleFile} {...inputProps}>
          Choose file
        </FileInput>
      </div>
    </section>
  );
};
