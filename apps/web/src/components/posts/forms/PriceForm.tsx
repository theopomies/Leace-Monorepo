import { Button } from "../../shared/button/Button";
import { NumberInput } from "../../shared/forms/NumberInput";

export interface PriceFormProps {
  price: number | undefined;
  onPriceChange: (price: number) => void;
  size: number | undefined;
  onSizeChange: (size: number) => void;
  bedrooms: number | undefined;
  onBedroomsChange: (bedrooms: number) => void;
  bathrooms: number | undefined;
  onBathroomsChange: (bathrooms: number) => void;
  charges: number | undefined;
  onChargesChange: (charges: number) => void;
  onSubmit: () => void;
  isValid: boolean;
}

export function PriceForm({
  price,
  onPriceChange,
  size,
  onSizeChange,
  bedrooms,
  onBedroomsChange,
  charges,
  onChargesChange,
  bathrooms,
  onBathroomsChange,
  onSubmit,
  isValid,
}: PriceFormProps) {
  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="flex gap-3">
        <label className="flex flex-grow flex-col gap-2">
          <p>Price</p>
          <NumberInput
            value={price}
            onChange={(e) => onPriceChange(+(e.target.value ?? 0))}
            placeholder="Enter a price"
            className="w-full"
            unit="€"
            required
          />
        </label>
        <label className="flex flex-grow flex-col gap-2">
          <p>Charges</p>
          <NumberInput
            value={charges}
            onChange={(e) => onChargesChange(+(e.target.value ?? 0))}
            placeholder="Enter an amount of charges"
            className="w-full"
            unit="m²"
            required
          />
        </label>
      </div>
      <div className="flex gap-3">
        <label className="flex flex-grow flex-col gap-2">
          <p>Size</p>
          <NumberInput
            value={size}
            onChange={(e) => onSizeChange(+(e.target.value ?? 0))}
            placeholder="Enter a size"
            className="w-full"
            unit="m²"
            required
          />
        </label>
      </div>
      <div className="flex gap-3">
        <label className="flex flex-grow flex-col gap-2">
          <p>Number of bedrooms</p>
          <NumberInput
            value={bedrooms}
            onChange={(e) => onBedroomsChange(+(e.target.value ?? 0))}
            placeholder="Enter a number of bedrooms"
            className="w-full"
            required
          />
        </label>
        <label className="flex flex-grow flex-col gap-2">
          <p>Number of bathrooms</p>
          <NumberInput
            value={bathrooms}
            onChange={(e) => onBathroomsChange(+(e.target.value ?? 0))}
            placeholder="Enter a number of bathrooms"
            className="w-full"
            required
          />
        </label>
      </div>
      <Button theme="primary" disabled={!isValid}>
        Next
      </Button>
    </form>
  );
}
