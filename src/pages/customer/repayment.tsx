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

interface RepaymentFormData {
  amountPaid: number;
  notes: string;
}

const CustomerRepayment: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<RepaymentFormData>();

  const onSubmit = async (data: RepaymentFormData) => {
    try {
      const latestCycle = await window.electronAPI.getLatestFinancialCycle();
      if (!latestCycle || 'error' in latestCycle) {
        throw new Error('No active financial cycle found');
      }

      const transaction = {
        customerId: parseInt(id!),
        financialCycleId: latestCycle.id,
        transactionType: 'Repayment',
        isDebt: true,
        amtBalance: data.amountPaid,
        debtBalance: -data.amountPaid,
        qtyBalance: 0,
        costProfit: 0,
        notes: data.notes,
      };

      await window.electronAPI.saveTransaction(transaction);

      toast({
        title: 'Success',
        description: 'Repayment recorded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate(`/customer/${id}`);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to record repayment',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxWidth="500px" margin="auto" mt={5}>
      <Heading mb={5}>Record Customer Repayment</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          <FormControl isInvalid={!!errors.amountPaid}>
            <FormLabel>Amount Paid</FormLabel>
            <Input
              type="number"
              step="0.01"
              {...register('amountPaid', { required: 'This field is required', min: 0.01 })}
            />
          </FormControl>

          <FormControl>
            <FormLabel>Notes (Optional)</FormLabel>
            <Input {...register('notes')} />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Record Repayment
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default CustomerRepayment;
