import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';

interface DebtIncreaseFormData {
  debtIncrease: number;
  notes: string;
}

const CustomerDebtIncrease: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<DebtIncreaseFormData>();

  const onSubmit = async (data: DebtIncreaseFormData) => {
    try {
      const latestCycle = await window.electronAPI.getLatestFinancialCycle();
      if (!latestCycle || 'error' in latestCycle) {
        throw new Error('No active financial cycle found');
      }

      const transaction = {
        customerId: parseInt(id!),
        financialCycleId: latestCycle.id,
        transactionType: 'DebtIncrease',
        isDebt: true,
        amtBalance: data.debtIncrease,
        debtBalance: data.debtIncrease,
        qtyBalance: 0,
        costProfit: 0,
        notes: data.notes,
      };

      await window.electronAPI.saveTransaction(transaction);

      toast({
        title: 'Success',
        description: 'Debt increase recorded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate(`/customer/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record debt increase',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="500px" margin="auto" mt={5}>
      <Heading mb={5}>Increase Customer Debt</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.debtIncrease}>
            <FormLabel>Debt Increase Amount</FormLabel>
            <Input
              type="number"
              step="0.01"
              {...register('debtIncrease', { required: 'This field is required', min: 0.01 })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Notes (Optional)</FormLabel>
            <Input {...register('notes')} />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Record Debt Increase
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CustomerDebtIncrease;
