import { Button } from "../../shared/button/Button";
import { FileUploadSection } from "../../shared/button/FileUploadSection";

export interface ImagesFormProps {
  images: File[];
  onImagesChange: (images: File[]) => void;
  onSubmit: () => void;
  isValid: boolean;
}

export function ImagesForm({
  images,
  onImagesChange,
  onSubmit,
  isValid,
}: ImagesFormProps) {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h3 className="text-lg font-medium">Upload Images</h3>
      <FileUploadSection
        selectedFiles={images}
        setSelectedFiles={onImagesChange}
        title="Upload Images"
      />
      <Button theme="primary" disabled={!isValid}>
        Next
      </Button>
    </form>
  );
}
