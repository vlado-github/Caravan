import type { GalleryViewModel } from "./GalleryViewModel";
import type { SocialEventResponse } from "../../api/socialevents/responses/SocialEventResponse";
import { Grid } from "@mantine/core";
import GalleryTile from "./GalleryTile";
import { DefaultConsts } from "../../consts/DefaultConsts";
import { useNavigate } from "@tanstack/react-router";
import type { ReactElement } from "react";
import { useTranslation } from "react-i18next";

interface GalleryLayoutProps {
  viewModel: GalleryViewModel<SocialEventResponse>;
  actions?: ReactElement;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({viewModel, actions}) => {
  const navigate = useNavigate();
  const {t} = useTranslation();

  if (viewModel.isLoading) {
    return <div>Loading...</div>;
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
      <Grid>
        {viewModel.items.map(item => (
          <Grid.Col key={item.id} span={{ base : 12, sm: 6, md: 4, lg: 3 }}>
            <GalleryTile 
              imageSrc={item.imageUrl == '' ? DefaultConsts.PlaceholderImage : item.imageUrl} 
              title={item.title} 
              onClick={() => onClickAction(item.id)}
              description={item.description} />
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
}

export default GalleryLayout;