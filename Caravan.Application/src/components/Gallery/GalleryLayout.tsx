import type { GalleryViewModel } from "./GalleryViewModel";
import type { SocialEventResponse } from "../../api/socialevents/responses/SocialEventResponse";
import { Grid } from "@mantine/core";
import GalleryTile from "./GalleryTile";
import { DefaultConsts } from "../../consts/DefaultConsts";
import { useNavigate } from "@tanstack/react-router";

interface GalleryLayoutProps {
  viewModel: GalleryViewModel<SocialEventResponse>;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({viewModel}) => {
  const navigate = useNavigate();

  if (viewModel.isLoading) {
    return <div>Loading...</div>;
  }

  if (viewModel.items.length === 0) {
    return <div>No items found.</div>;
  }

  const onClickAction = (itemId: string) => {
    navigate({ to: `/event/${itemId}`, replace: false });
  };

  return(
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
  );
}

export default GalleryLayout;