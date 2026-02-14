import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
  redirect,
} from "@tanstack/react-router";
import type { AuthContextProps } from "react-oidc-context";
import Layout from "./layouts/Layout";
import { socialEventsRoute } from "./pages/SocialEvents/SocialEvents";
import { socialEventDetailsRoute } from "./pages/SocialEventDetails/SocialEventDetails";
import { draftedSocialEventsRoute } from "./pages/DraftedSocialEvents/DraftedSocialEvents";
import { groupsRoute } from "./pages/Groups/Groups";
import { attendanceRoute } from "./pages/Attendance/Attendance";

export interface RoutingContext {
  auth: AuthContextProps;
}

export const rootRoute = createRootRouteWithContext<RoutingContext>()({
  component: Layout,
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  beforeLoad: async () => {
    throw redirect({ to: "/events" });
  }
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  socialEventsRoute,
  socialEventDetailsRoute,
  draftedSocialEventsRoute,
  groupsRoute,
  attendanceRoute
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