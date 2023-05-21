import { Input, InputProps } from "./Input";

export type TextInputProps = InputProps;

export function TextInput(props: TextInputProps) {
  return <Input {...props} type="text" />;
}
