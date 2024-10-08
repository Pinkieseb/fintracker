import React, { useEffect, useState } from 'react';
import { useToast, Box, VStack, HStack, FormControl, FormLabel, Input, Select, Button, Text } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSpring, animated } from 'react-spring';
import { Customer } from '@prisma/client';

const AnimatedBox = animated(Box);

const SaleTransaction: React.FC = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [formData, setFormData] = useState({
    customerId: '',
    quantitySold: 0,
    amountPaid: 0,
    amountCharged: 0,
  });

  const formAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(50px)' },
    to: { opacity: 1, transform: 'translateY(0px)' },
  });

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customerData = await window.electronAPI.getCustomers();
        if ('error' in customerData) {
          throw new Error(customerData.message);
        }
        setCustomers(customerData);
      } catch (error) {
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to fetch customers',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchCustomers();
  }, [toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const latestCycle = await window.electronAPI.getLatestFinancialCycle();
      if (!latestCycle || 'error' in latestCycle) {
        throw new Error('No active financial cycle found');
      }

      const isDebt = formData.amountCharged > formData.amountPaid;
      const debtBalance = isDebt ? formData.amountCharged - formData.amountPaid : 0;

      const transaction = {
        customerId: parseInt(formData.customerId),
        financialCycleId: latestCycle.id,
        transactionType: 'SALE',
        isDebt,
        amtBalance: formData.amountCharged,
        qtyBalance: -formData.quantitySold,
        debtBalance,
        costProfit: formData.amountCharged - (formData.quantitySold * latestCycle.unitCost),
        notes: '',
        description: `Sale of ${formData.quantitySold} units`,
      };

      const result = await window.electronAPI.saveTransaction(transaction);
      if ('error' in result) {
        throw new Error(result.message);
      }

      toast({
        title: 'Success',
        description: 'Sale transaction recorded successfully',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to record sale transaction',
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
              <FormLabel>Linked Customer</FormLabel>
              <Select name="customerId" value={formData.customerId} onChange={handleInputChange} placeholder="Select customer">
                {customers.map(customer => (
                  <option key={customer.id} value={customer.id}>{customer.name}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Quantity Sold</FormLabel>
              <Input type="number" name="quantitySold" value={formData.quantitySold} onChange={handleInputChange} min={0} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Amount Paid</FormLabel>
              <Input type="number" name="amountPaid" value={formData.amountPaid} onChange={handleInputChange} min={0} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Amount Charged</FormLabel>
              <Input type="number" name="amountCharged" value={formData.amountCharged} onChange={handleInputChange} min={0} />
            </FormControl>
            <HStack width="100%" justify="space-between">
              <Text>Is Debt: {formData.amountCharged > formData.amountPaid ? 'Yes' : 'No'}</Text>
              <Text>Debt Balance: {Math.max(formData.amountCharged - formData.amountPaid, 0)}</Text>
            </HStack>
            <Button type="submit" colorScheme="blue" width="100%">
              Record Sale
            </Button>
          </VStack>
        </form>
      </Box>
    </AnimatedBox>
  );
};

export default SaleTransaction;
