import React from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  VStack,
  Heading,
} from '@chakra-ui/react';
import { useForm, Controller } from 'react-hook-form';

interface TransactionFormProps {
  transactionType: 'Sale' | 'Expense' | 'Usage';
  onSubmit: (data: any) => void;
  customers?: { id: number; name: string }[];
}

interface TransactionFormData {
  customerId?: number;
  amount: number;
  quantity?: number;
  unitPrice?: number;
  description: string;
  isDebt?: boolean;
  isSupplierDebt?: boolean;
  notes: string;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ transactionType, onSubmit, customers }) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<TransactionFormData>();

  return (
    <Box maxWidth="500px" margin="auto" mt={5}>
      <Heading mb={5}>{transactionType} Transaction</Heading>
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4}>
          {transactionType === 'Sale' && (
            <FormControl isInvalid={!!errors.customerId}>
              <FormLabel>Customer</FormLabel>
              <Select {...register('customerId', { required: 'This field is required' })}>
                <option value="">Select a customer</option>
                {customers?.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </Select>
            </FormControl>
          )}

          {(transactionType === 'Sale' || transactionType === 'Usage') && (
            <FormControl isInvalid={!!errors.quantity}>
              <FormLabel>Quantity</FormLabel>
              <Input
                type="number"
                step="0.01"
                {...register('quantity', { required: 'This field is required', min: 0.01 })}
              />
            </FormControl>
          )}

          {transactionType === 'Sale' && (
            <FormControl isInvalid={!!errors.unitPrice}>
              <FormLabel>Unit Price</FormLabel>
              <Input
                type="number"
                step="0.01"
                {...register('unitPrice', { required: 'This field is required', min: 0.01 })}
              />
            </FormControl>
          )}

          {transactionType === 'Expense' && (
            <FormControl isInvalid={!!errors.amount}>
              <FormLabel>Amount</FormLabel>
              <Input
                type="number"
                step="0.01"
                {...register('amount', { required: 'This field is required', min: 0.01 })}
              />
            </FormControl>
          )}

          <FormControl isInvalid={!!errors.description}>
            <FormLabel>Description</FormLabel>
            <Input {...register('description', { required: 'This field is required' })} />
          </FormControl>

          {transactionType === 'Sale' && (
            <Controller
              name="isDebt"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <Checkbox 
                  {...rest}
                  isChecked={value}
                  onChange={(e) => onChange(e.target.checked)}
                >
                  Is this sale on credit?
                </Checkbox>
              )}
            />
          )}

          {transactionType === 'Expense' && (
            <Controller
              name="isSupplierDebt"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <Checkbox 
                  {...rest}
                  isChecked={value}
                  onChange={(e) => onChange(e.target.checked)}
                >
                  Does this expense add to supplier debt?
                </Checkbox>
              )}
            />
          )}

          <FormControl>
            <FormLabel>Notes (Optional)</FormLabel>
            <Input {...register('notes')} />
          </FormControl>

          <Button type="submit" colorScheme="blue" width="full">
            Submit {transactionType} Transaction
          </Button>
        </VStack>
      </form>
    </Box>
  );
};

export default TransactionForm;
