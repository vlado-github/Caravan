import React, { useEffect, useState } from 'react';
import { createRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { rootRoute } from '../../AppRouter';
import { DefaultConsts } from '../../consts/DefaultConsts';
import { useQueryResult } from './useQueryResult';
import GalleryLayout from '../../components/Gallery/GalleryLayout';
import { Loader, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { useDebouncedValue } from '@mantine/hooks';
import type { SearchParam } from '../../components/Paging/SearchParam';
import { useQueryClient } from '@tanstack/react-query';
import { SocialEventQueryKeys } from '../../api/socialevents/queries/query-keys';


const SocialEvents: React.FC = () => {
  const searchParams = useSearch({from: socialEventsRoute.id});
  const result = useQueryResult(searchParams.searchTerm);
  const { t } = useTranslation();
  const [searchValue, setSearchValue] = useState("");
  const [debouncedValue] = useDebouncedValue(searchValue, 300);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  useEffect(() => {
    navigate({
      to: '.', 
      search: {
        ...searchParams,
        searchTerm: debouncedValue,
      }
    });
    queryClient.invalidateQueries({ queryKey: SocialEventQueryKeys.list });
  }, [debouncedValue, queryClient, searchParams, navigate])

  return (
    <>
      <TextInput 
        placeholder={t("Search...")} 
        value={searchValue} 
        onChange={(e) => {setSearchValue(e.currentTarget.value)}} 
        rightSection={result.isLoading ? <Loader size='xs'/> : null}/>
      <GalleryLayout viewModel={result} maxItemDescriptionLength={DefaultConsts.MaxDescriptionLengthInGallery} />
    </>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const socialEventsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/events",
  component: SocialEvents,
  validateSearch: (search: Record<string, unknown>): SearchParam => {
    if (Object.keys(search).length === 0)
    {
        return {
          searchTerm: "",
        };
    }
    return {
      searchTerm: String(search?.searchTerm || ""),
    };
  },
});

export default SocialEvents;
