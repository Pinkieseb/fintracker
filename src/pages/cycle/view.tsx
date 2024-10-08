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
  HStack,
  VStack,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { FinancialCycle, Transaction } from '@prisma/client';

const FinancialCycleView: React.FC = () => {
  const [cycles, setCycles] = useState<FinancialCycle[]>([]);
  const [currentCycleIndex, setCurrentCycleIndex] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const fetchedCycles = await window.electronAPI.getFinancialCycles();
      if ('error' in fetchedCycles) {
        throw new Error(fetchedCycles.message);
      }
      setCycles(fetchedCycles);
      if (fetchedCycles.length > 0) {
        const fetchedTransactions = await window.electronAPI.getTransactions();
        if ('error' in fetchedTransactions) {
          throw new Error(fetchedTransactions.message);
        }
        setTransactions(fetchedTransactions.filter(t => t.financialCycleId === fetchedCycles[currentCycleIndex].id));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentCycleIndex]);

  const currentCycle = cycles[currentCycleIndex];

  const handlePrevious = () => {
    setCurrentCycleIndex(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentCycleIndex(prev => Math.min(cycles.length - 1, prev + 1));
  };

  if (loading) {
    return <Box>Loading...</Box>;
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Error!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <Button onClick={fetchData} ml={3}>
          Retry
        </Button>
      </Alert>
    );
  }

  if (!currentCycle) {
    return <Box>No financial cycles found.</Box>;
  }

  return (
    <Box p={5}>
      <Heading mb={5}>Financial Cycle View</Heading>
      <VStack spacing={5} align="stretch">
        <Box>
          <Text fontWeight="bold">Cycle ID: {currentCycle.id}</Text>
          <Text>Supplier Debt: ${currentCycle.supplierDebt.toFixed(2)}</Text>
          <Text>Quantity Bought: {currentCycle.qtyBought}</Text>
          <Text>Total Cost: ${currentCycle.totalCost.toFixed(2)}</Text>
          <Text>Unit Cost: ${currentCycle.unitCost.toFixed(2)}</Text>
          <Text>Date: {new Date(currentCycle.timestamp).toLocaleDateString()}</Text>
        </Box>

        <HStack>
          <Button onClick={handlePrevious} isDisabled={currentCycleIndex === 0}>Previous Cycle</Button>
          <Button onClick={handleNext} isDisabled={currentCycleIndex === cycles.length - 1}>Next Cycle</Button>
        </HStack>

        <Heading size="md">Transactions</Heading>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Type</Th>
              <Th>Amount</Th>
              <Th>Quantity</Th>
              <Th>Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            {transactions.map((transaction) => (
              <Tr key={transaction.id}>
                <Td>{transaction.transactionType}</Td>
                <Td>${transaction.amtBalance.toFixed(2)}</Td>
                <Td>{transaction.qtyBalance}</Td>
                <Td>{new Date(transaction.timestamp).toLocaleDateString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </VStack>
    </Box>
  );
};

export default FinancialCycleView;
