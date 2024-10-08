import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from "@chakra-ui/react";
import theme from "./theme";
import App from './App';  // Assuming App.tsx is in the src folder

console.log('Renderer script started');

const rootElement = document.getElementById('root');
console.log('Root element:', rootElement);

if (rootElement) {
  try {
    console.log('Creating React root');
    const root = ReactDOM.createRoot(rootElement);

    console.log('Rendering App component');
    root.render(
      <React.StrictMode>
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </React.StrictMode>
    );
    console.log('App component rendered successfully');
  } catch (error) {
    console.error('Error during React initialization or rendering:', error);
  }
} else {
  console.error('Root element not found');
}

console.log('👋 This message is being logged by "renderer.tsx", included via Vite');
