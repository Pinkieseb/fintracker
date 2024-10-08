import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
} from '@chakra-ui/react';
import { useParams, Link } from 'react-router-dom';
import { Customer, Transaction } from '@prisma/client';

const CustomerView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const toast = useToast();

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        const customerData = await window.electronAPI.getCustomer(parseInt(id!));
        if (customerData && !('error' in customerData)) {
          setCustomer(customerData);
          const customerTransactions = await window.electronAPI.getCustomerTransactions(customerData.id);
          if (!('error' in customerTransactions)) {
            setTransactions(customerTransactions);
          }
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to fetch customer data',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCustomerData();
  }, [id, toast]);

  const calculateTotalDebt = () => {
    return transactions.reduce((sum, transaction) => sum + transaction.debtBalance, 0);
  };

  if (!customer) {
    return <Box>Loading...</Box>;
  }

  return (
    <Box p={5}>
      <Heading mb={5}>{customer.name}</Heading>
      <Text mb={3}>Total Debt: ${calculateTotalDebt().toFixed(2)}</Text>
      <Text mb={5}>{customer.notes}</Text>

      <VStack spacing={4} align="stretch">
        <Heading size="md">Transactions</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Type</Th>
              <Th>Amount</Th>
              <Th>Debt Balance</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>{new Date(transaction.timestamp).toLocaleDateString()}</Td>
                <Td>{transaction.transactionType}</Td>
                <Td>${transaction.amtBalance.toFixed(2)}</Td>
                <Td>${transaction.debtBalance.toFixed(2)}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>

        <Button as={Link} to={`/customer/${id}/edit`} colorScheme="blue">
          Edit Customer
        </Button>
        <Button as={Link} to={`/customer/${id}/debt-increase`} colorScheme="green">
          Increase Debt
        </Button>
        <Button as={Link} to={`/customer/${id}/repayment`} colorScheme="orange">
          Record Repayment
        </Button>
      </VStack>
    </Box>
  );
};

export default CustomerView;
