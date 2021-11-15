import { UUID } from "angular2-uuid";

export class ListSelectorOption {
    guid?= UUID.UUID();
    title = "";
    action? = () => {};
}