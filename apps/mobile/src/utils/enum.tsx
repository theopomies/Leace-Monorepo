import { PostType, ReportReason } from "@prisma/client";

type Enum<T extends string> = Record<T, T>;

export const Type: Enum<PostType> = {
    RENTED: "RENTED",
    TO_BE_RENTED: "TO_BE_RENTED"
}

export type Type = PostType;

export const Reason: Enum<ReportReason> = {
    SPAM: "SPAM",
    INAPPROPRIATE: "INAPPROPRIATE",
    SCAM: "SCAM",
    OTHER: "OTHER"
}

export type Reason = ReportReason