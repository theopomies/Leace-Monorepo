import { HomeType, EnergyClass } from "@prisma/client";
import { Button } from "../../shared/button/Button";
import { Checkbox } from "../../shared/forms/Checkbox";
import { TextInput } from "../../shared/forms/TextInput";
import { NumberInput } from "../../shared/forms/NumberInput";

export interface DetailsFormProps {
  onSubmit: () => void;
  isValid: boolean;
  furnished: boolean;
  onFurnishedChange: (newValue: boolean) => void;
  terrace: boolean;
  onTerraceChange: (newValue: boolean) => void;
  pets: boolean;
  onPetsChange: (newValue: boolean) => void;
  smoker: boolean;
  onSmokerChange: (newValue: boolean) => void;
  disability: boolean;
  onDisabilityChange: (newValue: boolean) => void;
  garden: boolean;
  onGardenChange: (newValue: boolean) => void;
  parking: boolean;
  onParkingChange: (newValue: boolean) => void;
  elevator: boolean;
  onElevatorChange: (newValue: boolean) => void;
  pool: boolean;
  onPoolChange: (newValue: boolean) => void;
  securityAlarm: boolean;
  onSecurityAlarmChange: (newValue: boolean) => void;
  internetFiber: boolean;
  onInternetFiberChange: (newValue: boolean) => void;
  homeType: HomeType | undefined;
  onHomeTypeChange: (newValue: HomeType) => void;
  energyClass: EnergyClass | undefined;
  onEnergyClassChange: (newValue: EnergyClass) => void;
  nearestShops: number | undefined;
  onNearestShopsChange: (newValue: number) => void;
  constructionDate: string | undefined;
  onConstructionDateChange: (newValue: string) => void;
}

export function DetailsForm({
  onSubmit,
  isValid,
  furnished,
  onFurnishedChange,
  terrace,
  onTerraceChange,
  pets,
  onPetsChange,
  smoker,
  onSmokerChange,
  disability,
  onDisabilityChange,
  garden,
  onGardenChange,
  parking,
  onParkingChange,
  elevator,
  onElevatorChange,
  pool,
  onPoolChange,
  securityAlarm,
  onSecurityAlarmChange,
  internetFiber,
  onInternetFiberChange,
  homeType,
  onHomeTypeChange,
  energyClass,
  onEnergyClassChange,
  nearestShops,
  onNearestShopsChange,
  constructionDate,
  onConstructionDateChange,
}: DetailsFormProps) {
  const attributesList: {
    value: boolean;
    label: string;
    handleChange: (newValue: boolean) => void;
  }[] = [
    {
      value: furnished,
      label: "Furnished",
      handleChange: onFurnishedChange,
    },
    {
      value: terrace,
      label: "Terrace",
      handleChange: onTerraceChange,
    },
    {
      value: pets,
      label: "Pets",
      handleChange: onPetsChange,
    },
    {
      value: smoker,
      label: "Smoker",
      handleChange: onSmokerChange,
    },
    {
      value: disability,
      label: "Disability",
      handleChange: onDisabilityChange,
    },
    {
      value: garden,
      label: "Garden",
      handleChange: onGardenChange,
    },
    {
      value: parking,
      label: "Parking",
      handleChange: onParkingChange,
    },
    {
      value: elevator,
      label: "Elevator",
      handleChange: onElevatorChange,
    },
    {
      value: pool,
      label: "Pool",
      handleChange: onPoolChange,
    },
    {
      value: securityAlarm,
      label: "Security alarm",
      handleChange: onSecurityAlarmChange,
    },
    {
      value: internetFiber,
      label: "Internet fiber",
      handleChange: onInternetFiberChange,
    },
  ];

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <h2 className="text-xl font-bold">
          What do we have here?<span className="text-indigo-600">*</span>
        </h2>
        <div className="flex justify-center gap-4 py-4">
          <Checkbox
            type="radio"
            name="homeType"
            value="APARTMENT"
            checked={homeType === "APARTMENT"}
            onChange={() => onHomeTypeChange("APARTMENT")}
          >
            Apartment
          </Checkbox>
          <Checkbox
            type="radio"
            name="homeType"
            value="HOUSE"
            checked={homeType === "HOUSE"}
            onChange={() => onHomeTypeChange("HOUSE")}
          >
            House
          </Checkbox>
        </div>
        <div className="gap-2 py-6">
          <h2 className="text-xl font-bold">
            Legal informations<span className="text-indigo-600">*</span>
          </h2>
          <div className="flex gap-4">
            <label className="flex flex-grow flex-col gap-1">
              Energy class
              <TextInput
                value={energyClass}
                onChange={(e) => {
                  if (e.target.value.length > 1) {
                    return;
                  }
                  if (!"ABCDEF".includes(e.target.value.toUpperCase())) {
                    return;
                  }
                  onEnergyClassChange(
                    e.target.value.toUpperCase() as EnergyClass,
                  );
                }}
                maxLength={1}
                placeholder="A"
                required
              />
            </label>
            <label className="flex flex-grow flex-col gap-1">
              Construction date
              <TextInput
                value={constructionDate}
                onChange={(e) => onConstructionDateChange(e.target.value)}
                maxLength={4}
                minLength={4}
                placeholder="2001"
                required
                type="number"
              />
            </label>
          </div>
          <div className="flex gap-4">
            <label className="flex flex-col gap-1">
              Nearest shops
              <NumberInput
                value={nearestShops}
                onChange={(e) => onNearestShopsChange(e.target.valueAsNumber)}
                placeholder="5"
                unit="km"
                required
              />
            </label>
          </div>
        </div>
        <div>
          <div>
            <h2 className="text-xl font-bold">Characteristics</h2>
            <p className="text-sm font-light text-slate-600">
              Please select all that apply
            </p>
          </div>
          <div className="grid grid-cols-4 gap-1 py-4">
            {attributesList.map((att) => (
              <Checkbox
                key={att.label}
                name={att.label}
                onChange={(e) => att.handleChange(e.target.checked)}
                checked={att.value}
              >
                {att.label}
              </Checkbox>
            ))}
          </div>
        </div>
      </div>
      <Button theme="primary" disabled={!isValid}>
        Next
      </Button>
    </form>
  );
}
