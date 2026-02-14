import type { SocialEventResponse } from "../../api/socialevents/responses/SocialEventResponse";
import { Grid, Loader, ScrollArea } from "@mantine/core";
import GalleryTile from "./GalleryTile";
import { DefaultConsts } from "../../consts/DefaultConsts";
import { useNavigate } from "@tanstack/react-router";
import { useRef, type ReactElement } from "react";
import { useTranslation } from "react-i18next";
import type { InfiniteScrollViewModel } from "../Paging/InfiniteScrollViewModel";

interface GalleryLayoutProps {
  viewModel: InfiniteScrollViewModel<SocialEventResponse>;
  actions?: ReactElement;
  maxItemDescriptionLength: number;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({viewModel, actions, maxItemDescriptionLength}) => {
  const navigate = useNavigate();
  const {t} = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = ({ y }: {y: number}) => {
    const target = scrollRef.current;
    if (target) {
      const offset = 10; 
      if (y + target.clientHeight >= target.scrollHeight - offset) {
        viewModel.onBottomReached();
      }
    }
  };

  if (viewModel.isLoading) {
    return <Loader size="xs"/>;
  }

  const onClickAction = (itemId: string) => {
    navigate({ to: `/event/${itemId}`, replace: false });
  };

  return(
    <>
      <div>
        {actions}
      </div>
      {viewModel.items.length === 0 && (<p>{t("No items to display")}</p>)}
      <ScrollArea  
        h="90vh"
        scrollbars="y"
        onScrollPositionChange={handleScroll} 
        viewportRef={scrollRef}>
          <Grid>
            {viewModel.items.map(item => (
              <Grid.Col key={item.id} span={{ base : 12, sm: 6, md: 4, lg: 3 }}>
                <GalleryTile 
                  imageSrc={item.imageUrl == '' ? DefaultConsts.PlaceholderImage : item.imageUrl} 
                  title={item.title} 
                  onClick={() => onClickAction(item.id)}
                  description={item.description}
                  startTime={item.startTime}
                  maxDescriptionLength={maxItemDescriptionLength} />
              </Grid.Col>
            ))}
          </Grid>
      </ScrollArea>
    </>
  );
}

export default GalleryLayout;