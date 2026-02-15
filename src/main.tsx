import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
const queryClient = new QueryClient()
import { ToastProvider } from './context/ToastContext'; 

createRoot(document.getElementById('root')!).render(
  <StrictMode>{/* 3. ENVOLVER TODA TU APP CON EL PROVIDER */}
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
         <App />
      </ToastProvider>
    </QueryClientProvider>
  </StrictMode>,
)
