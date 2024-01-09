import { IoBed } from "react-icons/io5";
import {
  MdPets,
  MdPool,
  MdSecurity,
  MdOutlineWifi,
  MdPark,
  MdDeck,
} from "react-icons/md";
import { IconType } from "react-icons";
import { TbDisabled } from "react-icons/tb";
import { LuCigarette, LuParkingCircle } from "react-icons/lu";
import { PiElevator } from "react-icons/pi";
import { Attribute } from "@prisma/client";

export const attributesIcons = {
  furnished: IoBed,
  terrace: MdDeck,
  pets: MdPets,
  smoker: LuCigarette,
  disability: TbDisabled,
  garden: MdPark,
  parking: LuParkingCircle,
  elevator: PiElevator,
  pool: MdPool,
  securityAlarm: MdSecurity,
  internetFiber: MdOutlineWifi,
} as const as Record<keyof Attribute, IconType>;
