import React, { useState } from 'react';
import { useToast, Box, VStack, FormControl, FormLabel, Input, Select, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { FinancialCycle } from '@prisma/client';

const AnimatedBox = animated(Box);

const ExpenseTransaction: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: 0,
    notes: '',
    expenseType: '',
  });

  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const latestCycleResponse = await window.electronAPI.getLatestFinancialCycle();
      if (!latestCycleResponse || 'error' in latestCycleResponse) {
        throw new Error('No active financial cycle found');
      }
      const latestCycle = latestCycleResponse as FinancialCycle;

      const transaction = {
        financialCycleId: latestCycle.id,
        customerId: null,
        transactionType: 'EXPENSE',
        isDebt: false, // Set to false for all expense transactions
        amtBalance: -formData.amount,
        qtyBalance: 0,
        debtBalance: 0,
        costProfit: -formData.amount,
        notes: formData.notes,
        description: `Expense: ${formData.expenseType}`,
      };

      const result = await window.electronAPI.saveTransaction(transaction);
      if ('error' in result) {
        throw new Error(result.message);
      }

      toast({
        title: 'Success',
        description: 'Expense transaction recorded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record expense transaction',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <AnimatedBox style={formAnimation}>
      <Box maxWidth="500px" margin="auto" padding={5}>
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl isRequired>
              <FormLabel>Expense Type</FormLabel>
              <Select name="expenseType" value={formData.expenseType} onChange={handleInputChange} placeholder="Select expense type">
                <option value="Rent">Rent</option>
                <option value="Utilities">Utilities</option>
                <option value="Salaries">Salaries</option>
                <option value="Supplies">Supplies</option>
                <option value="Other">Other</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Amount</FormLabel>
              <Input type="number" name="amount" value={formData.amount} onChange={handleInputChange} min={0} />
            </FormControl>
            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Input type="text" name="notes" value={formData.notes} onChange={handleInputChange} />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="100%">
              Record Expense
            </Button>
          </VStack>
        </form>
      </Box>
    </AnimatedBox>
  );
};

export default ExpenseTransaction;
