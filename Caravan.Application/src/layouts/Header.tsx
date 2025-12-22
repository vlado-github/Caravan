import { Anchor, Burger, Divider, Drawer, Group, Stack } from "@mantine/core";
import LanguageSelector from "../components/Selectors/LanguageSelector";
import SigninButton from "../components/Actions/SigninButton";
import SignoutButton from "../components/Actions/SignoutButton";
import { useAuth } from "react-oidc-context";
import { useDisclosure } from "@mantine/hooks";

const Header: React.FC = () => {
  const auth = useAuth();
  const [opened, { toggle }] = useDisclosure();

  return (
    <>
      <Group h="100%" px="md" justify="space-between">
        <Anchor href="/">Caravan Logo</Anchor>
        
        {/* Desktop Navigation */}
        <Group visibleFrom="sm">
          <Anchor href="/groups">Groups</Anchor>
          {auth.isAuthenticated ? <Anchor href="/drafts">Drafts</Anchor> : null}
          {auth.isAuthenticated ? <Anchor href="/attending">Attending</Anchor> : null}
          <Anchor><LanguageSelector /></Anchor>
          <Anchor>
            {auth.isAuthenticated ? <SignoutButton /> : <SigninButton /> }
          </Anchor>
        </Group>

        {/* Mobile Burger Navigation */}
        <Burger
          opened={opened}
          onClick={toggle}
          hiddenFrom="sm"
          size="sm"
        />
      </Group>

      {/* Mobile Navigation Items */}
      <Drawer
        opened={opened}
        onClose={toggle}
        hiddenFrom="sm"
        size="100%"
        padding="md"
        title="Menu"
      >
        <Stack gap="md">
          <Anchor href="/groups">Groups</Anchor>
          {auth.isAuthenticated ? <Anchor href="/drafts">Drafts</Anchor> : null}
          {auth.isAuthenticated ? <Anchor href="/attending">Attending</Anchor> : null}
          <LanguageSelector onClose={toggle} />

          <Divider />

          {auth.isAuthenticated ? (
            <SignoutButton onClose={toggle} />
          ) : (
            <SigninButton onClose={toggle} />
          )}
        </Stack>
      </Drawer>
    </>);
}

export default Header;