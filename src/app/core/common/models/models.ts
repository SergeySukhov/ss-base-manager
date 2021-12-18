import { UserState } from "../../../shared/models/common/enums";

export interface UserData {
    id: string;
    email: string;
    status: UserState;
}