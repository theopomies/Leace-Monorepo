import { useEffect, useRef, useState } from "react";
import { trpc } from "../../../utils/trpc";
import React from "react";
import { TextInput } from "./TextInput";

interface GeocodeResult {
  id: number;
  name: string;
}

export interface AddressAutocompleteProps {
  location: string;
  handleLocationChange: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
}

export const AddressAutocomplete = (props: AddressAutocompleteProps) => {
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [showList, setShowList] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const { data, status, refetch } = trpc.geocoder.autocomplete.useQuery(
    {
      text: props.location,
    },
    {
      enabled: false,
    },
  );

  const onSelectHandler: React.MouseEventHandler<HTMLLIElement> = (event) => {
    props.handleLocationChange({
      target: {
        name: "location",
        value: event.currentTarget.textContent,
      },
    } as React.ChangeEvent<HTMLInputElement>);
    setShowList(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        listRef.current &&
        !listRef.current.contains(event.target as Node)
      ) {
        setShowList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (status === "success" && data) {
      setSearchResults(data);
    }
    const timeout = setTimeout(() => {
      if (status === "loading" && props.location) {
        refetch();
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [data, refetch, status, props.location]);

  return (
    <div className="relative flex-grow">
      <TextInput
        className="w-full"
        required={props.required}
        inputRef={inputRef}
        placeholder="Search an address and select in the options"
        name="location"
        autoComplete="off"
        onChange={(event) => {
          props.handleLocationChange(event);
          setShowList(true);
        }}
        value={props.location}
      />
      {searchResults.length > 0 && showList && (
        <div className="absolute z-10 mt-3 flex w-full items-center justify-between rounded-lg bg-white p-2 text-left shadow">
          <ul className="w-full" ref={listRef}>
            {searchResults.map((result, index) => (
              <li
                key={`${result.id}_${index}`}
                className="w-full cursor-pointer px-2 py-1 hover:rounded-lg hover:bg-gray-100"
                onClick={onSelectHandler}
              >
                {result.name}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
