import { UserState } from "./enums";

export interface UserData {
    id: string;
    email: string;
    status: UserState;
}