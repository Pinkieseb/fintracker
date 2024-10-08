import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  VStack,
  HStack,
  Text,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { Customer } from '@prisma/client';

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const fetchedCustomers = await window.electronAPI.getCustomers();
        if ('error' in fetchedCustomers) {
          throw new Error(fetchedCustomers.message);
        }
        setCustomers(fetchedCustomers);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch customers',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCustomers();
  }, [toast]);

  return (
    <Box p={5}>
      <VStack spacing={5} align="stretch">
        <HStack justify="space-between">
          <Heading>Customers</Heading>
          <Button as={Link} to="/customer/new" colorScheme="green">
            Add New Customer
          </Button>
        </HStack>

        {customers.length === 0 ? (
          <Text>No customers found. Add a new customer to get started.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Notes</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {customers.map((customer) => (
                <Tr key={customer.id}>
                  <Td>{customer.name}</Td>
                  <Td>{customer.notes}</Td>
                  <Td>
                    <Button
                      as={Link}
                      to={`/customer/${customer.id}`}
                      colorScheme="blue"
                      size="sm"
                    >
                      View
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Box>
  );
};

export default CustomerList;
