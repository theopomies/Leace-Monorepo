import { Input, InputProps } from "./Input";

export type DateInputProps = InputProps;

export function DateInput(props: DateInputProps) {
  return <Input {...props} type="date" />;
}
