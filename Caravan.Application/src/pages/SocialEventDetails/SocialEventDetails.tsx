import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../AppRouter";
import { useQueryResult } from "./useQueryResult";
import Preview from "../../components/Preview/Preview";

const SocialEventDetails : React.FC = () => {
  const result = useQueryResult();
  
  return(<Preview event={result}/>);
} 

// eslint-disable-next-line react-refresh/only-export-components
export const socialEventDetailsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/event/$eventId",
  component: SocialEventDetails
});

export default SocialEventDetails;