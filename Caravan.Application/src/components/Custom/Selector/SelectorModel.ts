import type { SelectorParams } from "./SelectorParams";

export interface SelectionItem {
    value: string;
    label: string;
}

export default interface SelectorModel {
    records: SelectionItem[],
    onBottomReached: () => void;
    onChange?: () => void;
    error?: string;
    hasNextPage?: boolean;
    isFetching?: boolean;
    isLoading?: boolean;
    selectorParams: SelectorParams
}
