import type SelectorModel from "../Custom/Selector/SelectorModel";
import useSelectorParams from "../Custom/Selector/SelectorParams";
import { useMemo } from "react";
import type { InfiniteScrollQueryRequest } from "../../api/base/requests/InfiniteScrollQueryRequest";
import { useSocialGroupsSelectionInfiniteScrollQuery } from "../../api/groups/queries/get-groups-selection-list";
import { useQueryClient } from "@tanstack/react-query";
import { GroupQueryKeys } from "../../api/groups/queries/query-keys";

export default function useGroupSelectorModel(): SelectorModel {
    const selectorParams = useSelectorParams();
    const queryClient = useQueryClient();

    const request = useMemo(() => ({
        search: selectorParams.debouncedSearch,
        pageNumber: 0, 
        pageSize: selectorParams.pageSize,
    } as InfiniteScrollQueryRequest),  [selectorParams.debouncedSearch, selectorParams.pageSize]);

    const { 
        data,
        fetchNextPage, 
        hasNextPage, 
        isFetching,
        isLoading,
        error: queryError
    } = useSocialGroupsSelectionInfiniteScrollQuery(request);
    
    const records = useMemo(() => {
      if (!data?.pages) return [];
  
      const records = data.pages.flatMap(page => page.items ?? []);
      return records.map(record => 
        {
          return {
            value: String(record.id),
            label: String(record.name)
          };
      });
    }, [data]);

    const model: SelectorModel = {
      records: records,
      onBottomReached: () => { fetchNextPage(); },
      onChange: () => 
        { 
          queryClient.invalidateQueries({ queryKey: GroupQueryKeys.selection });
        },
      error: queryError ? queryError.message : undefined,
      hasNextPage: hasNextPage,
      isFetching: isFetching,
      isLoading: isLoading,
      selectorParams: selectorParams,
    };
    return model;
}