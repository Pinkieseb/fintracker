import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  Grid,
  GridItem,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react';

interface ConsolidationData {
  actualInventory: number;
  actualBalance: number;
  databaseInventory: number;
  databaseBalance: number;
  unitCost: number;
}

interface ApiResponse<T> {
  data?: T;
  error?: boolean;
}

const ConsolidationForm: React.FC = () => {
  const [data, setData] = useState<ConsolidationData>({
    actualInventory: 0,
    actualBalance: 0,
    databaseInventory: 0,
    databaseBalance: 0,
    unitCost: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await window.electronAPI.getConsolidationData() as ApiResponse<{ inventory: number; balance: number; unitCost: number }>;
      if (result.error) {
        throw new Error('Failed to fetch data');
      }
      if (result.data) {
        const { inventory, balance, unitCost } = result.data;
        setData(prevData => ({
          ...prevData,
          databaseInventory: inventory,
          databaseBalance: balance,
          unitCost: unitCost,
        }));
      } else {
        throw new Error('No data received');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData(prevData => ({
      ...prevData,
      [name]: parseFloat(value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const result = await window.electronAPI.updateConsolidationData({
        inventory: data.actualInventory,
        balance: data.actualBalance,
      }) as ApiResponse<void>;
      if (result.error) {
        throw new Error('Failed to update data');
      }
      alert('Data consolidated successfully!');
      fetchData(); // Refresh data after successful submission
    } catch (error) {
      console.error('Error updating data:', error);
      setError('Failed to consolidate data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setData(prevData => ({
      ...prevData,
      actualInventory: prevData.databaseInventory,
      actualBalance: prevData.databaseBalance,
    }));
  };

  const inventorySold = data.databaseInventory - data.actualInventory;
  const targetBalance = data.databaseBalance + (inventorySold * data.unitCost);
  const balanceDifference = data.actualBalance - targetBalance;
  const inventoryDifference = data.actualInventory - data.databaseInventory;
  const balanceDiscrepancy = data.actualBalance - data.databaseBalance;

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  return (
    <Box maxWidth="800px" margin="auto" padding={4}>
      <Heading as="h1" size="xl" marginBottom={6}>Consolidation Form</Heading>
      {error && (
        <Alert status="error" marginBottom={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <form onSubmit={handleSubmit}>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <FormControl>
              <FormLabel>Actual Remaining Inventory</FormLabel>
              <Input
                type="number"
                name="actualInventory"
                value={data.actualInventory}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
          <GridItem>
            <FormControl>
              <FormLabel>Actual Current Balance</FormLabel>
              <Input
                type="number"
                name="actualBalance"
                value={data.actualBalance}
                onChange={handleInputChange}
              />
            </FormControl>
          </GridItem>
        </Grid>
        <Box marginTop={4}>
          <Button type="submit" colorScheme="blue" isLoading={isSubmitting} marginRight={2}>
            Consolidate Data
          </Button>
          <Button onClick={handleReset} variant="outline">
            Reset
          </Button>
        </Box>
      </form>

      <Box marginTop={8}>
        <Heading as="h2" size="lg" marginBottom={4}>Analysis</Heading>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          <GridItem>
            <Stat>
              <StatLabel>Target Balance</StatLabel>
              <StatNumber>${targetBalance.toFixed(2)}</StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Balance Difference</StatLabel>
              <StatNumber>${Math.abs(balanceDifference).toFixed(2)}</StatNumber>
              <StatHelpText>
                <StatArrow type={balanceDifference > 0 ? 'increase' : 'decrease'} />
                {balanceDifference > 0 ? 'Above' : 'Below'} target
              </StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Inventory Discrepancy</StatLabel>
              <StatNumber>{inventoryDifference} units</StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat>
              <StatLabel>Balance Discrepancy</StatLabel>
              <StatNumber>${balanceDiscrepancy.toFixed(2)}</StatNumber>
            </Stat>
          </GridItem>
        </Grid>
        <Box marginTop={4} backgroundColor={balanceDifference !== 0 || inventoryDifference !== 0 ? 'yellow.100' : 'green.100'} padding={4} borderRadius="md">
          <Text fontWeight="bold">
            {balanceDifference !== 0 || inventoryDifference !== 0
              ? 'Discrepancies Detected:'
              : 'No Discrepancies Detected'}
          </Text>
          {balanceDifference !== 0 && (
            <Text>
              {balanceDifference > 0
                ? "Your actual balance is higher than expected. This could indicate unrecorded expenses or usage."
                : "Your actual balance is lower than expected. This could indicate unrecorded sales or income."}
            </Text>
          )}
          {inventoryDifference !== 0 && (
            <Text>
              There is a discrepancy in inventory. {Math.abs(inventoryDifference)} units {inventoryDifference > 0 ? 'more' : 'less'} than expected.
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ConsolidationForm;