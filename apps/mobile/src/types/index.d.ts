export interface IDefaulAttributes {
  postId: string;
  location: string | undefined;
  price: number | undefined;
  size: number | undefined;
  rentStartDate: Date | undefined;
  rentEndDate: Date | undefined;
  furnished: boolean | undefined;
  house: boolean | undefined;
  appartment: boolean | undefined;
  terrace: boolean | undefined;
  pets: boolean | undefined;
  smoker: boolean | undefined;
  disability: boolean | undefined;
  garden: boolean | undefined;
  parking: boolean | undefined;
  elevator: boolean | undefined;
  pool: boolean | undefined;
}

export interface IUserAttrs {
  userId: string;
  location?: string;
  range?: number;
  maxPrice?: number;
  minPrice?: number;
  maxSize?: number;
  minSize?: number;
  rentStartDate?: Date;
  rentEndDate?: Date;
  furnished?: boolean;
  homeType?: "HOUSE" | "APARTMENT" | "";
  terrace?: boolean;
  pets?: boolean;
  smoker?: boolean;
  disability?: boolean;
  garden?: boolean;
  parking?: boolean;
  elevator?: boolean;
  pool?: boolean;
}
