import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from "react-router-dom";
import { TicketContextProvider } from './Ticket/TicketContext/TicketContext.jsx';
import "./main.css"
import { ContextProvider } from './Context/AppContext.jsx';
ReactDOM.createRoot(document.getElementById('root')).render(
  <ChakraProvider>
    <ContextProvider>
      <TicketContextProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </TicketContextProvider>
    </ContextProvider>
  </ChakraProvider>
)
