export interface IDefaulAttributes {
  postId: string;
  location?: string;
  price?: number;
  size?: number;
  rentStartDate?: Date;
  rentEndDate?: Date;
  furnished?: boolean;
  house?: boolean;
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
