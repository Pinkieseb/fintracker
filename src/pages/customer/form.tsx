import React, { useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  FormErrorMessage,
  Textarea,
  useColorModeValue,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import MotionBox from '../../components/MotionBox';

interface NewCustomerFormData {
  name: string;
  initialDebt: number;
  notes: string;
}

const NewCustomerForm: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<NewCustomerFormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const hoverBgColor = useColorModeValue('gray.50', 'gray.700');

  const onSubmit = async (data: NewCustomerFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const latestCycleResponse = await window.electronAPI.getLatestFinancialCycle();
      if (!latestCycleResponse || 'error' in latestCycleResponse) {
        throw new Error('No active financial cycle found');
      }

      const newCustomerResponse = await window.electronAPI.saveCustomer({
        name: data.name,
        notes: data.notes,
      });
      if ('error' in newCustomerResponse) {
        throw new Error(newCustomerResponse.message);
      }

      if (data.initialDebt > 0) {
        const transaction = {
          customerId: newCustomerResponse.id,
          financialCycleId: latestCycleResponse.id,
          transactionType: 'DebtIncrease',
          isDebt: true,
          amtBalance: data.initialDebt,
          debtBalance: data.initialDebt,
          qtyBalance: 0,
          costProfit: 0,
          notes: 'Initial debt',
        };

        const transactionResponse = await window.electronAPI.saveTransaction(transaction);
        if ('error' in transactionResponse) {
          throw new Error(transactionResponse.message);
        }
      }

      toast({
        title: 'Success',
        description: 'New customer created successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/customers');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  return (
    <MotionBox
      maxWidth="500px"
      margin="auto"
      mt={5}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ tension: 300, friction: 10 }}
    >
      <Heading mb={5}>New Customer</Heading>
      {error && (
        <Alert status="error" mb={5}>
          <AlertIcon />
          <AlertTitle mr={2}>Error!</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <VStack spacing={4} align="stretch">
          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ tension: 300, friction: 10, delay: 100 }}
          >
            <FormControl isInvalid={!!errors.name}>
              <FormLabel htmlFor="name">Customer Name</FormLabel>
              <Input
                id="name"
                {...register('name', { required: 'This field is required' })}
                autoFocus
                bg={bgColor}
                borderColor={borderColor}
                _hover={{ bg: hoverBgColor }}
                _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
              />
              <FormErrorMessage>
                {errors.name && errors.name.message}
              </FormErrorMessage>
            </FormControl>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ tension: 300, friction: 10, delay: 200 }}
          >
            <FormControl isInvalid={!!errors.initialDebt}>
              <FormLabel htmlFor="initialDebt">Initial Debt (Optional)</FormLabel>
              <Input
                id="initialDebt"
                type="number"
                step="0.01"
                {...register('initialDebt', { 
                  min: { value: 0, message: 'Initial debt cannot be negative' },
                  setValueAs: (v) => v === '' ? 0 : parseFloat(v)
                })}
                bg={bgColor}
                borderColor={borderColor}
                _hover={{ bg: hoverBgColor }}
                _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
              />
              <FormErrorMessage>
                {errors.initialDebt && errors.initialDebt.message}
              </FormErrorMessage>
            </FormControl>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ tension: 300, friction: 10, delay: 300 }}
          >
            <FormControl>
              <FormLabel htmlFor="notes">Notes (Optional)</FormLabel>
              <Textarea
                id="notes"
                {...register('notes')}
                rows={3}
                bg={bgColor}
                borderColor={borderColor}
                _hover={{ bg: hoverBgColor }}
                _focus={{ borderColor: 'blue.500', boxShadow: 'outline' }}
              />
            </FormControl>
          </MotionBox>

          <MotionBox
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ tension: 300, friction: 10, delay: 400 }}
          >
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={isSubmitting}
              loadingText="Creating..."
              _focus={{ boxShadow: 'outline' }}
              _hover={{ transform: 'translateY(-2px)', boxShadow: 'lg' }}
              _active={{ transform: 'translateY(0)', boxShadow: 'md' }}
            >
              Create Customer
            </Button>
          </MotionBox>
        </VStack>
      </form>
    </MotionBox>
  );
};

export default NewCustomerForm;
