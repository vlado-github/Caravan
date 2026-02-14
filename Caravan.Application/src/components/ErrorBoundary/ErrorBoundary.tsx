import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import { Button, Container, Stack, Text, Title } from '@mantine/core';
import i18next from 'i18next';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container size="sm" py="xl">
          <Stack align="center" gap="md">
            <Title order={3}>
              {i18next.t('errorBoundary.title', 'Something went wrong')}
            </Title>
            <Text c="dimmed">
              {i18next.t('errorBoundary.message', 'An unexpected error occurred. Please try again.')}
            </Text>
            <Button onClick={this.handleReset}>
              {i18next.t('errorBoundary.tryAgain', 'Try again')}
            </Button>
          </Stack>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
