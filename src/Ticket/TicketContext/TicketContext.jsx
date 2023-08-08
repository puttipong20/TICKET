/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { useState, useContext, createContext } from 'react'

const TicketContext = createContext()

const TicketContextProvider = ({ children }) => {
    const [user, setUser] = useState()
    const [report, setReport] = useState()
    const [firebaseId, setFirebaseId] = useState()
    const { Provider } = TicketContext

    const value = {
        user,
        setUser,
        firebaseId,
        setFirebaseId,
        report,
        setReport
    }

    return <Provider value={value}>{children}</Provider>
}

const useTicketContext = () => useContext(TicketContext)

export { TicketContextProvider, TicketContext, useTicketContext }
