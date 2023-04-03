/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import { RouterInputs } from "../../../utils/trpc";
import { Checkbox } from "../../shared/forms/Checkbox";

interface TenantProfileFormProps {
  userId: string;
}

export function TenantProfileForm({ userId }: TenantProfileFormProps) {
  const updateAtt = trpc.attribute.updateUserAttributes.useMutation();
  const [attData, setAttData] = useState<
    RouterInputs["attribute"]["updateUserAttributes"]
  >({
    userId: "",
    location: "",
    maxPrice: 0,
    minPrice: 0,
    maxSize: 0,
    minSize: 0,
    rentStartDate: new Date(),
    rentEndDate: new Date(),
    furnished: false,
    house: false,
    appartment: false,
    terrace: false,
    pets: false,
    smoker: false,
    disability: false,
    garden: false,
    parking: false,
    elevator: false,
    pool: false,
  });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value: string | number | boolean;

    if (event.target.type === "checkbox") {
      value = event.target.checked;
    } else if (event.target.type === "number") {
      value = event.target.value ? parseInt(event.target.value) : 0;
    } else if (event.target.type === "text") {
      value = event.target.value;
    } else {
      value = event.target.value;
    }
    setAttData({
      ...attData,
      [event.target.name]: value,
    });
  };

  useEffect(() => {
    if (userAtt) {
      setAttData({
        ...attData,
        location: userAtt.location || "",
        maxPrice: userAtt.maxPrice || 0,
        minPrice: userAtt.minPrice || 0,
        maxSize: userAtt.maxSize || 0,
        minSize: userAtt.minSize || 0,
        house: userAtt.house || false,
        appartment: userAtt.appartment || false,
        furnished: userAtt.furnished || false,
        terrace: userAtt.terrace || false,
        pets: userAtt.pets || false,
        smoker: userAtt.smoker || false,
        disability: userAtt.disability || false,
        garden: userAtt.garden || false,
        parking: userAtt.parking || false,
        elevator: userAtt.elevator || false,
        pool: userAtt.pool || false,
      });
    }
  }, [userAtt, setAttData]);

  const attributes: {
    label: string;
    name: string;
  }[] = [
    {
      name: "furnished",
      label: "Furnished",
    },
    {
      name: "terrace",
      label: "Terrace",
    },
    {
      name: "pets",
      label: "Pets",
    },
    {
      name: "smoker",
      label: "Smoker",
    },
    {
      name: "disability",
      label: "Disability",
    },
    {
      name: "garden",
      label: "Garden",
    },
    {
      name: "parking",
      label: "Parking",
    },
    {
      name: "elevator",
      label: "Elevator",
    },
    {
      name: "pool",
      label: "Pool",
    },
  ];

  return (
    <div className="flex justify-center">
      <div className="border-blueGray-200 mt-5 h-auto w-full border-t text-center">
        <div className="sticky mt-5 flex w-full items-center justify-between rounded-full bg-white p-2 shadow-lg">
          <input
            className="focus:shadow-outline ml-2 w-full rounded-full bg-gray-100 py-4 pl-4 text-xs font-bold uppercase leading-tight text-gray-700 focus:outline-none lg:text-sm"
            type="text"
            placeholder="Search"
            name="location"
            onChange={handleChange}
            value={attData.location}
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
        <div className="mt-5 px-16">
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">
            What are you looking for ?
          </h2>
          <Checkbox
            name="house"
            onChange={handleChange}
            checked={attData.house}
          >
            House
          </Checkbox>
          <Checkbox
            name="appartment"
            onChange={handleChange}
            checked={attData.appartment}
          >
            Appartment
          </Checkbox>
          <h2 className="pb-2 pt-4 text-xl font-bold text-gray-700">
            Additionnal filters
          </h2>
          {attributes.map((att) => (
            <Checkbox
              key={att.name}
              name={att.name}
              onChange={handleChange}
              checked={!!attData[att.name as keyof typeof attData]}
            >
              {att.label}
            </Checkbox>
          ))}
        </div>
      </div>
    </div>
  );
}
