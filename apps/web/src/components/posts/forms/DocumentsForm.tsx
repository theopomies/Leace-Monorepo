import { Button } from "../../shared/button/Button";
import { FileUploadSection } from "../../shared/button/FileUploadSection";

export interface DocumentsFormProps {
  documents: File[];
  onDocumentsChange: (images: File[]) => void;
  onSubmit: () => void;
  isValid: boolean;
}

export function DocumentsForm({
  documents,
  onDocumentsChange,
  onSubmit,
  isValid,
}: DocumentsFormProps) {
  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <h2 className="text-lg font-medium">
        Upload proof of ownership (i.e. property title)
      </h2>
      <p className="text-sm font-light text-slate-600">
        For the safety of our community, we need to ensure that you have the
        right to rent this property
      </p>
      <FileUploadSection
        selectedFiles={documents}
        setSelectedFiles={onDocumentsChange}
      />
      <Button theme="primary" disabled={!isValid}>
        Submit property listing
      </Button>
    </form>
  );
}
