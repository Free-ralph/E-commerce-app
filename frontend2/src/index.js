import React from "react";
import * as ReactDOMClient from 'react-dom/client';
import App from './App'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import { ContextProvider } from "./context/ContextProvider";
const root = ReactDOMClient.createRoot(document.getElementById('root'))

root.render(

    <BrowserRouter>
        <ContextProvider>
            <App />
        </ContextProvider>
    </BrowserRouter>
)