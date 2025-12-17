import type { GalleryViewModel } from "./GalleryViewModel";
import type { SocialEventResponse } from "../../api/socialevents/responses/SocialEventResponse";
import { Grid } from "@mantine/core";
import GalleryTile from "./GalleryTile";
import { DefaultConsts } from "../../consts/DefaultConsts";

interface GalleryLayoutProps {
  viewModel: GalleryViewModel<SocialEventResponse>;
}

const GalleryLayout: React.FC<GalleryLayoutProps> = ({viewModel}) => {
  
  if (viewModel.isLoading) {
    return <div>Loading...</div>;
  }

  if (viewModel.items.length === 0) {
    return <div>No items found.</div>;
  }

  return(
    <Grid>
      {viewModel.items.map(item => (
        <Grid.Col key={item.id} span={{ base : 12, sm: 6, md: 4, lg: 3 }}>
          <GalleryTile 
            imageSrc={item.imageUrl == '' ? DefaultConsts.PlaceholderImage : item.imageUrl} 
            title={item.title} 
            description={item.description} />
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default GalleryLayout;