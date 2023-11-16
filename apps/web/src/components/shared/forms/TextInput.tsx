import { Ref } from "react";
import { Input, InputProps } from "./Input";

export type TextInputProps = InputProps & { inputRef?: Ref<HTMLInputElement> };

export function TextInput(props: TextInputProps) {
  return <Input {...props} type="text" />;
}
