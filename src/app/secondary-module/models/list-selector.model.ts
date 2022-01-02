export class TreeSelectorOption {
    name = "";
    available? = false;
    isDivider? = false;
    children?: TreeSelectorOption[] = [];
    expandable: boolean = false;
    level = 0;
    action: () => void = () => {};
}