import { useEffect, useRef, useState } from "react";
import { trpc } from "../../../utils/trpc";
import React from "react";

interface GeocodeResult {
  id: number;
  name: string;
}

export interface AddressAutocompleteProps {
  location: string;
  handleLocationChange: React.ChangeEventHandler<HTMLInputElement>;
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
    <div className="relative">
      <div className="sticky flex w-full items-center justify-between rounded-full bg-white p-2 shadow">
        <input
          ref={inputRef}
          className="focus:shadow-outline ml-2 w-full rounded-full bg-gray-100 py-4 pl-4 text-xs font-bold leading-tight text-gray-700 focus:outline-none lg:text-sm"
          type="text"
          placeholder="Search"
          name="location"
          autoComplete="off"
          required
          onChange={(event) => {
            props.handleLocationChange(event);
            setShowList(true);
          }}
          value={props.location}
        />
        <div className="mx-2 cursor-pointer rounded-full bg-gray-600 p-2 hover:bg-blue-400">
          <svg
            className="h-6 w-6 text-white"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
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
