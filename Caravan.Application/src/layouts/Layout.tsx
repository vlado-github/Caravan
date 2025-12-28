import React from "react";
import { AppShell } from '@mantine/core';
import { Outlet } from "@tanstack/react-router";
import Footer from "./Footer";
import Header from "./Header";

const Layout: React.FC = () => {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <AppShell.Header>
        <Header />
      </AppShell.Header>

      <AppShell.Main> 
        <Outlet />
      </AppShell.Main>
      
      <AppShell.Footer>
        <Footer />
      </AppShell.Footer>
    </AppShell>
  );
}

export default Layout;