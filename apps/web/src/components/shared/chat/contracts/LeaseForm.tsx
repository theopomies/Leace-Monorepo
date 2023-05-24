import { useState } from "react";
import { NumberInput } from "../../forms/NumberInput";
import { DateInput } from "../../forms/DateInput";
import { Button } from "../../button/Button";

interface LeaseFormData {
  rentCost: number;
  utilitiesCost: number;
  startDate: Date;
  endDate: Date;
}

export interface LeaseFormProps {
  onSubmit: (data: LeaseFormData) => void;
  defaultValues?: LeaseFormData;
  submitLabel?: string;
  onDeleted?: () => void;
}

export function LeaseForm({
  onSubmit,
  defaultValues = {
    rentCost: 0,
    utilitiesCost: 0,
    startDate: new Date(),
    endDate: new Date(),
  },
  submitLabel = "Send",
  onDeleted,
}: LeaseFormProps) {
  const [rentCost, setRentCost] = useState(defaultValues.rentCost);
  const [utilitiesCost, setUtilitiesCost] = useState(
    defaultValues.utilitiesCost,
  );
  const [startDate, setStartDate] = useState(defaultValues.startDate);
  const [endDate, setEndDate] = useState(defaultValues.endDate);

  const submitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({
      rentCost,
      utilitiesCost,
      startDate,
      endDate,
    });
  };

  return (
    <form
      onSubmit={submitHandler}
      className="flex flex-col gap-4 rounded-md bg-white p-4 drop-shadow-2xl"
    >
      <div className="flex gap-4">
        <label>
          <div className="text-lg font-medium">Rent Cost</div>
          <NumberInput
            required
            aria-valuemin={10}
            name="rentCost"
            value={rentCost}
            onChange={(e) => setRentCost(e.target.valueAsNumber)}
          />
        </label>
        <label>
          <div className="text-lg font-medium">Utilities Cost</div>
          <NumberInput
            required
            name="utilitiesCost"
            value={utilitiesCost}
            onChange={(e) => setUtilitiesCost(e.target.valueAsNumber)}
          />
        </label>
      </div>
      <div className="flex justify-around gap-4">
        <label className="flex flex-grow flex-col">
          <div className="text-lg font-medium">Start Date</div>
          <DateInput
            required
            name="startDate"
            value={startDate.toISOString().substring(0, 10)}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </label>
        <label className="flex flex-grow flex-col">
          <div className="text-lg font-medium">End Date</div>
          <DateInput
            required
            name="endDate"
            value={endDate.toISOString().substring(0, 10)}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </label>
      </div>
      <div className="flex justify-center gap-4">
        <Button type="submit" className="flex-grow">
          {submitLabel}
        </Button>
        {onDeleted && (
          <Button theme="danger" onClick={onDeleted} className="flex-grow">
            Delete
          </Button>
        )}
      </div>
    </form>
  );
}
