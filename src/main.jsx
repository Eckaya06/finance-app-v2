import { StrictMode } from 'react'
import './index.css'
import App from './App.jsx'
import ReactDOM from "react-dom/client";
import React from 'react';
import { TransactionProvider } from './context/TransactionContext.jsx'

// Bu import satırı çok önemli
import { BrowserRouter } from 'react-router-dom'


ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TransactionProvider> {/* SARMALADIK */}
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </TransactionProvider>
  </React.StrictMode>,
)