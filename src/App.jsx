/* eslint-disable no-empty */
/* eslint-disable react-hooks/exhaustive-deps */
import TicketDetail from "./Ticket/ticketDetail";
import TicketForm from "./Ticket/ticketForm";
import TicketList from "./Ticket/ticketList";
import { Routes, Route } from "react-router-dom";
import { Box, Center, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useTicketContext } from "./Ticket/TicketContext/TicketContext";
import { useAppContext } from "./Context/AppContext";

function App() {
  const { firebaseId, setFirebaseId } = useTicketContext();
  const { setUser } = useAppContext();
  const [noData, setNoData] = useState([]);

  const getPath = () => {
    const homePath = localStorage.getItem("homePath");
    if (homePath !== window.location.href) {
      localStorage.setItem("homePath", String(window.location.href));
    }
    const urlParams = new URLSearchParams(window.location.search);

    const username = urlParams.get("username");
    const email = urlParams.get("email");
    const projectId = urlParams.get("projectId");
    const temp = [];
    if (!username && !email) {
      temp.push("ไม่มีข้อมูล username");
      temp.push("ไม่มีข้อมูล email");
    } else if (username && email) {
      setUser({ username: username, email: email });
    }
    if (!projectId) {
      temp.push("ไม่มีข้อมูล projectId");
    } else {
      setFirebaseId(projectId);
    }

    setNoData(temp);
  };

  useEffect(() => {
    getPath();
  }, []);

  return (
    <Box fontFamily={"inherit"}>
      <Center>
        <Box p={noData.length === 0 ? "0" : "1rem"}>
          {noData.map((t, index) => {
            return (
              <Text key={index} color="red">
                {t}
              </Text>
            );
          })}
        </Box>
      </Center>
      {(firebaseId !== "") | undefined | null && (
        <Routes>
          {/* <Route path="*" element={<><Text>Page not found</Text></>} /> */}
          <Route path={`/`} element={<TicketList />} />
          <Route path={`/:id`} element={<TicketDetail />} />
          <Route path={`/form`} element={<TicketForm />} />
        </Routes>
      )}
    </Box>
  );
}

export default App;
