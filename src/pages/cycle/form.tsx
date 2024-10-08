import React from 'react';
import { Box, Button, FormControl, FormLabel, Input, VStack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

interface FinancialCycleFormData {
  supplierDebt: number;
  qtyBought: number;
  totalCost: number;
}

const FinancialCycleForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FinancialCycleFormData>();
  const toast = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data: FinancialCycleFormData) => {
    try {
      // Calculate unitCost
      const unitCost = data.totalCost / data.qtyBought;

      const newCycle = {
        ...data,
        unitCost,
      };

      const response = await window.electronAPI.saveFinancialCycle(newCycle);
      if ('error' in response) {
        throw new Error(response.message);
      }

      toast({
        title: 'Financial cycle created.',
        description: "We've created your new financial cycle for you.",
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate('/'); // Redirect to the dashboard
    } catch (error) {
      toast({
        title: 'An error occurred.',
        description: 'Unable to create the financial cycle.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="500px" margin="auto" mt={8}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.supplierDebt}>
            <FormLabel htmlFor="supplierDebt">Supplier Debt</FormLabel>
            <Input
              id="supplierDebt"
              type="number"
              step="0.01"
              {...register('supplierDebt', { required: 'Supplier debt is required', min: 0 })}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.qtyBought}>
            <FormLabel htmlFor="qtyBought">Quantity Bought</FormLabel>
            <Input
              id="qtyBought"
              type="number"
              step="0.01"
              {...register('qtyBought', { required: 'Quantity bought is required', min: 0 })}
            />
          </FormControl>

          <FormControl isInvalid={!!errors.totalCost}>
            <FormLabel htmlFor="totalCost">Total Cost</FormLabel>
            <Input
              id="totalCost"
              type="number"
              step="0.01"
              {...register('totalCost', { required: 'Total cost is required', min: 0 })}
            />
          </FormControl>

          <Button type="submit" colorScheme="blue">
            Create Financial Cycle
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default FinancialCycleForm;
