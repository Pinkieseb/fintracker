import React from 'react';
import { Flex, Heading, Spacer, Button, useColorMode, Menu, MenuButton, MenuList, MenuItem, IconButton, useBreakpointValue, VisuallyHidden, MenuDivider, Image, HStack } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { MoonIcon, SunIcon, ChevronDownIcon, AddIcon } from '@chakra-ui/icons';
import { FaUsers, FaBalanceScale, FaClock } from 'react-icons/fa';
import MotionBox from '../components/MotionBox';

interface NavbarProps {
  financialCycles?: { id: string; name: string }[];
}

const Navbar: React.FC<NavbarProps> = ({ financialCycles = [] }) => {
  const { colorMode, toggleColorMode } = useColorMode();
  const location = useLocation();
  const fontSize = useBreakpointValue({ base: "sm", md: "md", lg: "lg" });
  const buttonSize = useBreakpointValue({ base: "sm", md: "md" });
  const navHeight = useBreakpointValue({ base: "16", md: "20", lg: "24" });

  const isActive = (path: string) => location.pathname === path;

  return (
    <MotionBox
      bg={colorMode === 'dark' ? 'gray.900' : 'white'} 
      px={[2, 4, 6, 8]} 
      py={[2, 3, 4]} 
      boxShadow="md"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ tension: 300, friction: 20 }}
    >
      <Flex h={navHeight} alignItems={'center'} justifyContent={'space-between'}>
        <HStack spacing={2}>
          <Image src="/assets/logo.svg" alt="FinTracker Logo" boxSize={["24px", "32px", "40px"]} />
          <Heading size={useBreakpointValue({ base: "md", md: "lg", lg: "xl" })}>
            <Link to="/">
              FinTracker
              <VisuallyHidden>Home</VisuallyHidden>
            </Link>
          </Heading>
        </HStack>
        <Spacer />
        <Flex alignItems={'center'} gap={[1, 2, 3]}>
          <Button
            as={Link}
            to="/"
            colorScheme="blue"
            size={buttonSize}
            fontSize={fontSize}
            variant={isActive('/') ? 'solid' : 'ghost'}
            aria-current={isActive('/') ? 'page' : undefined}
          >
            Dashboard
          </Button>
          <Button
            as={Link}
            to="/customers"
            colorScheme="teal"
            size={buttonSize}
            fontSize={fontSize}
            variant={isActive('/customers') ? 'solid' : 'ghost'}
            aria-current={isActive('/customers') ? 'page' : undefined}
            leftIcon={<FaUsers />}
          >
            Customers
          </Button>
          <Menu isLazy>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<AddIcon />}
                  colorScheme="green"
                  size={buttonSize}
                  fontSize={fontSize}
                  variant={isOpen ? 'solid' : 'outline'}
                  aria-label="New Transaction"
                >
                  New
                </MenuButton>
                <MenuList>
                  <MenuItem as={Link} to="/transaction/sale" fontSize={fontSize}>New Sale</MenuItem>
                  <MenuItem as={Link} to="/transaction/expense" fontSize={fontSize}>New Expense</MenuItem>
                  <MenuItem as={Link} to="/transaction/usage" fontSize={fontSize}>New Usage</MenuItem>
                  <MenuDivider />
                  <MenuItem as={Link} to="/consolidation" fontSize={fontSize} icon={<FaBalanceScale />}>Consolidation</MenuItem>
                  <MenuItem as={Link} to="/cycle/new" fontSize={fontSize} icon={<FaClock />}>New Financial Cycle</MenuItem>
                </MenuList>
              </>
            )}
          </Menu>
          <Menu isLazy>
            {({ isOpen }) => (
              <>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  leftIcon={<FaClock />}
                  colorScheme="purple"
                  size={buttonSize}
                  fontSize={fontSize}
                  variant={isOpen ? 'solid' : 'outline'}
                  aria-label="Financial Cycles"
                >
                  Cycles
                </MenuButton>
                <MenuList>
                  {financialCycles.map((cycle) => (
                    <MenuItem key={cycle.id} as={Link} to={`/cycle/${cycle.id}`} fontSize={fontSize}>
                      {cycle.name}
                    </MenuItem>
                  ))}
                  {financialCycles.length === 0 && (
                    <MenuItem isDisabled fontSize={fontSize}>No cycles available</MenuItem>
                  )}
                </MenuList>
              </>
            )}
          </Menu>
          <IconButton
            icon={colorMode === 'dark' ? <SunIcon /> : <MoonIcon />}
            onClick={toggleColorMode}
            aria-label={`Toggle ${colorMode === 'dark' ? 'Light' : 'Dark'} Mode`}
            size={buttonSize}
            fontSize={fontSize}
            variant="ghost"
          />
        </Flex>
      </Flex>
    </MotionBox>
  );
};

export default Navbar;
