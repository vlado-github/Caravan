import { useDebouncedValue } from "@mantine/hooks";
import { useState } from "react";

export interface SelectorParams {
    pageSize: number;
    search: string;
    setSearch: React.Dispatch<React.SetStateAction<string>>;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    label: string;
    setLabel: React.Dispatch<React.SetStateAction<string>>;
    debouncedSearch: string;
    isSearching: boolean;
}

export default function useSelectorParams() {
    const [search, setSearch] = useState('');
    const [value, setValue] = useState('');
    const [label, setLabel] = useState('');
    const [debouncedSearch] = useDebouncedValue(search, 500);

    const params: SelectorParams = {
        pageSize: 10, // Default page size, can be adjusted as needed
        search, setSearch, 
        value, setValue, 
        label, setLabel,
        debouncedSearch, 
        isSearching: search.length > 0,
    };
    return params;
}