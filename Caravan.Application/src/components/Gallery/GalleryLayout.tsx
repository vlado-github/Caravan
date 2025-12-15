import type { GalleryViewModel } from "./GalleryViewModel";
import type { SocialEventResponse } from "../../api/responses/SocialEventResponse";
import { Grid } from "@mantine/core";

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
        <Grid.Col key={item.id} span={4}>
          <div>{item.title}</div>
        </Grid.Col>
      ))}
    </Grid>
  );
}

export default GalleryLayout;