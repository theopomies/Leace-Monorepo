export interface IDefaultPost {
  title: string;
  desc: string;
  content?: string;
  energyClass?: "A" | "B" | "C" | "D";
  ges?: "A" | "B" | "C" | "D";
  constructionDate?: Date;
  estimatedCost?: string;
  nearestShops?: string;
  securityAlarm?: boolean;
  internetFiber?: boolean;
}

export interface IDefaultAttributes {
  postId: string;
  location?: string;
  price?: number;
  size?: number;
  rentStartDate?: Date;
  rentEndDate?: Date;
  homeType?: "HOUSE" | "APARTMENT" | "";
  furnished?: boolean;
  house?: boolean;
  terrace?: boolean;
  pets?: boolean;
  smoker?: boolean;
  disability?: boolean;
  garden?: boolean;
  parking?: boolean;
  elevator?: boolean;
  pool?: boolean;
  securityAlarm?: boolean;
  internetFiber?: boolean;
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
