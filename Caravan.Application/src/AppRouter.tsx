import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import type { AuthContextProps } from "react-oidc-context";
import Layout from "./layouts/Layout";
import { socialEventsRoute } from "./pages/SocialEvents/SocialEvents";
import { DefaultConsts } from "./consts/DefaultConsts";
import { socialEventDetailsRoute } from "./pages/SocialEventDetails/SocialEventDetails";

export interface RoutingContext {
  auth: AuthContextProps;
}

export const rootRoute = createRootRoute({
  component: Layout,
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async () => {
    throw redirect({ to: "/events", search: {start: DefaultConsts.FirstPageIndex, size: DefaultConsts.RowsPerPage} });
  }
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  socialEventsRoute,
  socialEventDetailsRoute,
]);

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!,
  },
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}