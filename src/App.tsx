import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import Dashboard from './pages/dashboard';
import Layout from './shared/Layout';
import SaleForm from './pages/transaction/type/sale';
import ExpenseForm from './pages/transaction/type/expense';
import UsageForm from './pages/transaction/type/usage';
import CustomerList from './pages/customer/list';
import CustomerView from './pages/customer/customer';
import NewCustomerForm from './pages/customer/form';
import ConsolidationForm from './pages/consolidation';
import FinancialCycleForm from './pages/cycle/form';
import theme from './theme';

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/transaction/sale" element={<SaleForm />} />
            <Route path="/transaction/expense" element={<ExpenseForm />} />
            <Route path="/transaction/usage" element={<UsageForm />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/customer/:id" element={<CustomerView />} />
            <Route path="/customer/new" element={<NewCustomerForm />} />
            <Route path="/consolidation" element={<ConsolidationForm />} />
            <Route path="/cycle/new" element={<FinancialCycleForm />} />
          </Routes>
        </Layout>
      </Router>
    </ChakraProvider>
  );
};

export default App;
