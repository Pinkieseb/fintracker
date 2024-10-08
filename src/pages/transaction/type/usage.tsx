import React, { useState } from 'react';
import { useToast, Box, VStack, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';

const AnimatedBox = animated(Box);

const UsageTransaction: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    quantity: 0,
    notes: '',
  });

  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const latestCycle = await window.electronAPI.getLatestFinancialCycle();
      if (!latestCycle || 'error' in latestCycle) {
        toast({
          title: 'Error',
          description: 'No active financial cycle found',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        return;
      }

      const amtBalance = formData.quantity * latestCycle.unitCost;
      const transaction = {
        financialCycleId: latestCycle.id,
        customerId: null,
        transactionType: 'USAGE',
        isDebt: false,
        amtBalance: -amtBalance,
        qtyBalance: -formData.quantity,
        debtBalance: 0,
        costProfit: -amtBalance,
        notes: formData.notes,
        description: `Usage of ${formData.quantity} units`,
      };

      await window.electronAPI.saveTransaction(transaction);

      toast({
        title: 'Success',
        description: 'Usage transaction recorded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record usage transaction',
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
              <FormLabel>Quantity Used</FormLabel>
              <Input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} min={0} step="0.01" />
            </FormControl>
            <FormControl>
              <FormLabel>Notes</FormLabel>
              <Input type="text" name="notes" value={formData.notes} onChange={handleInputChange} />
            </FormControl>
            <Button type="submit" colorScheme="blue" width="100%">
              Record Usage
            </Button>
          </VStack>
        </form>
      </Box>
    </AnimatedBox>
  );
};

export default UsageTransaction;
