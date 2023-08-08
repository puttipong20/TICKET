/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const AppContext = createContext()

const ContextProvider = ({ children }) => {
    const [user, setUser] = useState()

    const { Provider } = AppContext

    const context = {
        user,
        setUser,
    }

    return <Provider value={context}>{children}</Provider>
}

const useAppContext = () => useContext(AppContext)

export { AppContext, useAppContext, ContextProvider };