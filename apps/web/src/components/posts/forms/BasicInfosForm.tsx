import { Button } from "../../shared/button/Button";
import { AddressAutocomplete } from "../../shared/forms/AddressAutocomplete";
import { TextArea } from "../../shared/forms/TextArea";
import { TextInput } from "../../shared/forms/TextInput";

export interface BasicInfosFormProps {
  title: string;
  description: string;
  location: string;
  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onLocationChange: (location: string) => void;
  onSubmit: () => void;
  isValid: boolean;
}

export function BasicInfosForm({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  location,
  onLocationChange,
  onSubmit,
  isValid,
}: BasicInfosFormProps) {
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <label className="flex flex-col gap-2">
        <p>Property Title</p>
        <TextInput
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          placeholder="Enter a title for your property"
          required
        />
      </label>
      <label className="flex flex-col gap-2">
        <p>Property Description</p>
        <TextArea
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          placeholder="Enter a description for your property"
          required
        />
      </label>
      <label className="flex flex-col gap-2">
        <p>Property Location</p>
        <AddressAutocomplete
          location={location}
          handleLocationChange={(e) => onLocationChange(e.target.value)}
          required
        />
      </label>
      <Button theme="primary" disabled={!isValid}>
        Next
      </Button>
    </form>
  );
}
