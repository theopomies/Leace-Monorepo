import { Input, InputProps } from "./Input";

export type FileInputProps = InputProps;

export function FileInput({ children, ...props }: FileInputProps) {
  return (
    <label className="focus:shadow-outline-blue relative inline-flex cursor-pointer items-center  rounded-lg  border-2  border-gray-300 bg-gray-50 p-2.5 px-4  py-2 text-sm font-medium leading-5 text-gray-900  hover:text-gray-500  focus:border-blue-600 focus:outline-none active:bg-gray-50 active:text-gray-800">
      {children}
      <Input
        {...props}
        hidden
        accept={`.pdf,.png,.jpeg,${props.accept}`}
        type="file"
      />
    </label>
  );
}
