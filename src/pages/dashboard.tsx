import React, { useEffect, useState, useCallback, useMemo, Suspense, lazy } from 'react';
import {
  Box,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Button,
  VStack,
  HStack,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useColorModeValue,
  Grid,
  GridItem,
  Spinner,
  Center,
  Select,
  Flex,
  useBreakpointValue,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FinancialCycle, Transaction } from '@prisma/client';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement } from 'chart.js';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ArcElement, BarElement);

const LazyLineChart = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Line })));
const LazyPieChart = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Pie })));
const LazyBarChart = lazy(() => import('react-chartjs-2').then(module => ({ default: module.Bar })));

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('Error caught by error boundary:', error);
      setHasError(true);
    };

    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>An error occurred!</AlertTitle>
        <AlertDescription>Please try refreshing the page.</AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
};

const Dashboard: React.FC = () => {
  const [currentCycle, setCurrentCycle] = useState<FinancialCycle | null>(null);
  const [financialCycles, setFinancialCycles] = useState<FinancialCycle[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [customerDebts, setCustomerDebts] = useState<{ [key: string]: number }>({});
  const [salesData, setSalesData] = useState<{ labels: string[], datasets: any[] }>({ labels: [], datasets: [] });
  const [transactionTypeData, setTransactionTypeData] = useState<{ labels: string[], datasets: any[] }>({ labels: [], datasets: [] });
  const [profitTrendData, setProfitTrendData] = useState<{ labels: string[], datasets: any[] }>({ labels: [], datasets: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const itemsPerPage = 10;

  const fetchTransactions = useCallback(async (cycleId: number, page: number) => {
    try {
      const transactionsResponse = await window.electronAPI.getTransactionsByCycle(cycleId, page, itemsPerPage);
      if ('error' in transactionsResponse) {
        throw new Error(transactionsResponse.message);
      }
      setTransactions(transactionsResponse.transactions);
      setTotalPages(Math.ceil(transactionsResponse.total / itemsPerPage));
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to fetch transactions. Please try again.');
    }
  }, []);

  const updateCharts = useCallback(async (cycleId: number) => {
    try {
      const allTransactionsResponse = await window.electronAPI.getAllTransactionsByCycle(cycleId);
      if ('error' in allTransactionsResponse) {
        throw new Error(allTransactionsResponse.message);
      }

      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const salesByDay = allTransactionsResponse.reduce((acc: { [key: string]: number }, t: Transaction) => {
        if (t.transactionType === 'Sale') {
          const date = new Date(t.timestamp).toISOString().split('T')[0];
          acc[date] = (acc[date] || 0) + t.amtBalance;
        }
        return acc;
      }, {});

      setSalesData({
        labels: last7Days,
        datasets: [{
          label: 'Sales',
          data: last7Days.map(day => salesByDay[day] || 0),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      });

      const transactionTypes = ['Sale', 'Expense', 'Usage'];
      const transactionCounts = transactionTypes.map(type => 
        allTransactionsResponse.filter((t: Transaction) => t.transactionType === type).length
      );

      setTransactionTypeData({
        labels: transactionTypes,
        datasets: [{
          data: transactionCounts,
          backgroundColor: ['#36A2EB', '#FF6384', '#FFCE56'],
          hoverBackgroundColor: ['#36A2EB', '#FF6384', '#FFCE56']
        }]
      });

      const profitByDay = allTransactionsResponse.reduce((acc: { [key: string]: number }, t: Transaction) => {
        const date = new Date(t.timestamp).toISOString().split('T')[0];
        if (t.transactionType === 'Sale') {
          acc[date] = (acc[date] || 0) + t.costProfit;
        } else if (t.transactionType === 'Expense') {
          acc[date] = (acc[date] || 0) - t.amtBalance;
        }
        return acc;
      }, {});

      setProfitTrendData({
        labels: last7Days,
        datasets: [{
          label: 'Profit',
          data: last7Days.map(day => profitByDay[day] || 0),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
        }]
      });
    } catch (error) {
      console.error('Error updating charts:', error);
      setError('Failed to update charts. Please try again.');
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [cyclesResponse, customersResponse] = await Promise.all([
          window.electronAPI.getFinancialCycles(),
          window.electronAPI.getCustomers()
        ]);

        if ('error' in cyclesResponse || 'error' in customersResponse) {
          throw new Error('Error fetching data');
        }

        setFinancialCycles(cyclesResponse);
        setCurrentCycle(cyclesResponse[0] || null);

        await fetchTransactions(cyclesResponse[0]?.id, 1);

        const debts: { [key: string]: number } = {};
        await Promise.all(customersResponse.map(async (customer) => {
          const customerTransactionsResponse = await window.electronAPI.getCustomerTransactions(customer.id);
          if ('error' in customerTransactionsResponse) {
            throw new Error(customerTransactionsResponse.message);
          }
          debts[customer.id] = customerTransactionsResponse.reduce((sum, t) => sum + t.debtBalance, 0);
        }));
        setCustomerDebts(debts);

        await updateCharts(cyclesResponse[0]?.id);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try refreshing the page.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [fetchTransactions, updateCharts]);

  const handleCycleChange = async (event: React.ChangeEvent<HTMLSelectElement>) => {
    const cycleId = parseInt(event.target.value);
    const selectedCycle = financialCycles.find(cycle => cycle.id === cycleId);
    setCurrentCycle(selectedCycle || null);
    await fetchTransactions(cycleId, 1);
    await updateCharts(cycleId);
  };

  const handlePageChange = (newPage: number) => {
    if (currentCycle) {
      fetchTransactions(currentCycle.id, newPage);
    }
  };

  const totalSales = useMemo(() => transactions.reduce((sum, t) => sum + (t.transactionType === 'Sale' ? t.amtBalance : 0), 0), [transactions]);
  const totalExpenses = useMemo(() => transactions.reduce((sum, t) => sum + (t.transactionType === 'Expense' ? t.amtBalance : 0), 0), [transactions]);
  const totalProfit = useMemo(() => totalSales - totalExpenses, [totalSales, totalExpenses]);

  const chartOptions = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: '',
      },
    },
  };

  const gridTemplateColumns = useBreakpointValue({ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" });
  const chartHeight = useBreakpointValue({ base: "200px", md: "300px" });

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertTitle mr={2}>Error!</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const TransactionRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const transaction = transactions[index];
    return (
      <Tr key={transaction.id} style={style}>
        <Td>{transaction.transactionType}</Td>
        <Td>${transaction.amtBalance.toFixed(2)}</Td>
        <Td>{new Date(transaction.timestamp).toLocaleDateString()}</Td>
      </Tr>
    );
  };

  const CustomerDebtRow = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const [customerId, debtAmount] = Object.entries(customerDebts)[index];
    return (
      <Tr key={customerId} style={style}>
        <Td>{customerId}</Td>
        <Td color={debtAmount > 0 ? "red.500" : "green.500"}>${debtAmount.toFixed(2)}</Td>
      </Tr>
    );
  };

  return (
    <ErrorBoundary>
      <Box>
        <Flex justifyContent="space-between" alignItems="center" mb={8} flexWrap="wrap">
          <Heading fontSize={["2xl", "3xl", "4xl"]} mb={[4, 0]}>Dashboard</Heading>
          <Select width="auto" value={currentCycle?.id} onChange={handleCycleChange}>
            {financialCycles.map(cycle => (
              <option key={cycle.id} value={cycle.id}>
                Cycle {cycle.id} - {new Date(cycle.timestamp).toLocaleDateString()}
              </option>
            ))}
          </Select>
        </Flex>
        
        <Grid templateColumns={gridTemplateColumns} gap={8}>
          <GridItem>
            <Stat bg={bgColor} p={6} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
              <StatLabel fontSize="lg">Current Inventory</StatLabel>
              <StatNumber fontSize={["3xl", "4xl", "5xl"]}>{currentCycle?.qtyBought || 0}</StatNumber>
              <StatHelpText fontSize="md">units</StatHelpText>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat bg={bgColor} p={6} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
              <StatLabel fontSize="lg">Total Sales</StatLabel>
              <StatNumber fontSize={["3xl", "4xl", "5xl"]}>${totalSales.toFixed(2)}</StatNumber>
            </Stat>
          </GridItem>
          <GridItem>
            <Stat bg={bgColor} p={6} borderRadius="lg" boxShadow="md" border="1px" borderColor={borderColor}>
              <StatLabel fontSize="lg">Total Profit</StatLabel>
              <StatNumber fontSize={["3xl", "4xl", "5xl"]} color={totalProfit >= 0 ? "green.500" : "red.500"}>
                ${totalProfit.toFixed(2)}
              </StatNumber>
            </Stat>
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }} gap={8} mt={12}>
          <GridItem>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
              height={chartHeight}
            >
              <Heading size="md" mb={4}>Sales Trend (Last 7 Days)</Heading>
              <Suspense fallback={<Spinner />}>
                <LazyLineChart data={salesData} options={chartOptions} />
              </Suspense>
            </Box>
          </GridItem>
          <GridItem>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
              height={chartHeight}
            >
              <Heading size="md" mb={4}>Transaction Types</Heading>
              <Suspense fallback={<Spinner />}>
                <LazyPieChart data={transactionTypeData} options={chartOptions} />
              </Suspense>
            </Box>
          </GridItem>
          <GridItem colSpan={{ base: 1, lg: 2 }}>
            <Box
              bg={bgColor}
              p={6}
              borderRadius="lg"
              boxShadow="md"
              border="1px"
              borderColor={borderColor}
              height={chartHeight}
            >
              <Heading size="md" mb={4}>Profit Trend (Last 7 Days)</Heading>
              <Suspense fallback={<Spinner />}>
                <LazyBarChart data={profitTrendData} options={chartOptions} />
              </Suspense>
            </Box>
          </GridItem>
        </Grid>

        <Grid templateColumns={{ base: "repeat(1, 1fr)", lg: "repeat(2, 1fr)" }} gap={8} mt={12}>
          <GridItem>
            <VStack spacing={6} align="stretch">
              <Heading size="lg">Transactions</Heading>
              <Box
                bg={bgColor}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                border="1px"
                borderColor={borderColor}
                height="400px"
              >
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Type</Th>
                      <Th>Amount</Th>
                      <Th>Date</Th>
                    </Tr>
                  </Thead>
                </Table>
                <Box height="300px">
                  <AutoSizer>
                    {({ height, width }: { height: number; width: number }) => (
                      <List
                        height={height}
                        itemCount={transactions.length}
                        itemSize={35}
                        width={width}
                      >
                        {TransactionRow}
                      </List>
                    )}
                  </AutoSizer>
                </Box>
                <Flex justifyContent="space-between" mt={4}>
                  <Button onClick={() => handlePageChange(currentPage - 1)} isDisabled={currentPage === 1} size="sm">
                    Previous
                  </Button>
                  <Box>Page {currentPage} of {totalPages}</Box>
                  <Button onClick={() => handlePageChange(currentPage + 1)} isDisabled={currentPage === totalPages} size="sm">
                    Next
                  </Button>
                </Flex>
              </Box>
              <HStack spacing={4} flexWrap="wrap">
                <Button as={Link} to="/transaction/sale" colorScheme="blue" size="sm">New Sale</Button>
                <Button as={Link} to="/transaction/expense" colorScheme="red" size="sm">New Expense</Button>
                <Button as={Link} to="/transaction/usage" colorScheme="green" size="sm">New Usage</Button>
              </HStack>
            </VStack>
          </GridItem>
          <GridItem>
            <VStack spacing={6} align="stretch">
              <Heading size="lg">Customer Debts Summary</Heading>
              <Box
                bg={bgColor}
                p={6}
                borderRadius="lg"
                boxShadow="md"
                border="1px"
                borderColor={borderColor}
                height="400px"
              >
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr>
                      <Th>Customer ID</Th>
                      <Th>Debt Amount</Th>
                    </Tr>
                  </Thead>
                </Table>
                <Box height="300px">
                  <AutoSizer>
                    {({ height, width }: { height: number; width: number }) => (
                      <List
                        height={height}
                        itemCount={Object.keys(customerDebts).length}
                        itemSize={35}
                        width={width}
                      >
                        {CustomerDebtRow}
                      </List>
                    )}
                  </AutoSizer>
                </Box>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </ErrorBoundary>
  );
};

export default React.memo(Dashboard);
