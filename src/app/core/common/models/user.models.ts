import { UserState } from "../../../shared/models/common/enums";

export interface UserData {
    id: string;
    email: string;
    status: UserState;
}

export enum GachiType {
    none = "none",
    van = "van",
    billy = "billy",
    danny = "danny",
    steve = "steve",
} 