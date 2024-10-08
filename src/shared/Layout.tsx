import React, { useEffect, ErrorInfo } from 'react';
import { Box, Container, useColorModeValue, VisuallyHidden, Link, Text, Flex, VStack, Image } from '@chakra-ui/react';
import { useLocation, Link as RouterLink } from 'react-router-dom';
import MotionBox from '../components/MotionBox';
import Navbar from './Navbar';

interface LayoutProps {
  children: React.ReactNode;
}

declare global {
  interface Window {
    electron?: {
      getVersion: () => string;
    };
  }
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <VStack spacing={4} align="center" justify="center" height="100vh">
          <Text fontSize="2xl">Oops! Something went wrong.</Text>
          <Link as={RouterLink} to="/" color="blue.500">
            Go back to homepage
          </Link>
        </VStack>
      );
    }

    return this.props.children;
  }
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const location = useLocation();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        // Handle Escape key (e.g., close modals, menus)
        console.log('Escape key pressed');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <VisuallyHidden>
          <Link
            href="#main-content"
            position="absolute"
            top={0}
            left={0}
            p={2}
            bg="blue.500"
            color="white"
            fontWeight="bold"
            _focus={{
              clip: 'auto',
              width: 'auto',
              height: 'auto',
            }}
          >
            Skip to main content
          </Link>
        </VisuallyHidden>
        <Navbar />
        <Box flex="1" bg={bgColor}>
          <Container 
            as="main" 
            id="main-content"
            maxW={["container.sm", "container.md", "container.lg", "container.xl"]} 
            py={[4, 6, 8]} 
            px={[4, 6, 8]}
          >
            <MotionBox
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ tension: 300, friction: 20 }}
            >
              {children}
            </MotionBox>
          </Container>
        </Box>
        <Box as="footer" bg={useColorModeValue('gray.100', 'gray.800')} py={4}>
          <Container maxW="container.xl">
            <Flex justifyContent="space-between" alignItems="center" flexWrap="wrap">
              <Flex alignItems="center">
                <Image src="/assets/logo.svg" alt="FinTracker Logo" boxSize="24px" mr={2} />
                <Text>&copy; 2023 FinTracker. All rights reserved.</Text>
              </Flex>
              <Flex mt={[4, 4, 0]}>
                <Link as={RouterLink} to="/about" mr={4}>About</Link>
                <Link as={RouterLink} to="/privacy" mr={4}>Privacy Policy</Link>
                <Text>Version: {window.electron?.getVersion?.() || '0.10.0'}</Text>
              </Flex>
            </Flex>
          </Container>
        </Box>
      </Box>
    </ErrorBoundary>
  );
};

export default Layout;