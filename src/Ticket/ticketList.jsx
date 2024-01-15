/* eslint-disable react-hooks/exhaustive-deps */
import { SearchIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Tag,
} from "@chakra-ui/react";
import CustomTable from "./Components/customTableTicket";
import axios from "axios";
import { search } from "ss-search";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { AiOutlineReload } from "react-icons/ai";
import { useTicketContext } from "./TicketContext/TicketContext";
import { useAppContext } from "../Context/AppContext";
import { useNavigate } from "react-router-dom";
import { BsFillArchiveFill } from "react-icons/bs";
import AlertArchive from "./Components/alertArchive";

function TicketList() {
  const [refresh, setRefresh] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filterProject, setFilterProject] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [isArchive, setIsArchive] = useState(false);
  const { control, watch } = useForm();
  const { firebaseId,setReport } = useTicketContext();
  const navigate = useNavigate();
  const columnsHeader = [
    {
      Header: "No.",
      accessor: "ref",
    },
    {
      Header: "ปัญหา",
      accessor: "title",
    },
    {
      Header: "วันที่แจ้ง",
      accessor: "createAt",
    },
    { Header: "รายละเอียด", accessor: "detail" },
    {
      Header: "สถานะ",
      accessor: "RepStatus",
    },
    {
      Header: "จัดการ",
      // accessor: 'RepStatus',
      extra: (data, row) => (
        <Center>
          <Menu placement={"bottom-end"}>
            <MenuButton as={Button} borderRadius={"16px"}>
              ...
            </MenuButton>
            <MenuList minW={"5rem"}>
              <MenuItem>
                <AlertArchive
                  isArchive={isArchive}
                  fetchProject={fetchProject}
                  docId={row.docId}
                />
              </MenuItem>
            </MenuList>
          </Menu>
        </Center>
      ),
    },
  ];
  const filterReport = (sortData) => {
    const archiveData = sortData.filter((data) => {
      return data.isArchive == true;
    });
    const notArchiveData = sortData.filter((data) => {
      return data.isArchive == false || data.isArchive == undefined;
    });

    if (isArchive === false) {
      setFilterProject(notArchiveData);
    } else {
      setFilterProject(archiveData);
    }
  };

  const fetchProject = async () => {
    setIsFetching(true);
    if (firebaseId !== undefined) {
      await axios
        .post(
          // "https://us-central1-crafting-ticket-dev.cloudfunctions.net/getReport_v2",
          // "https://us-central1-craftinglab-dev.cloudfunctions.net/getReport_v2", //prod
          "http://127.0.0.1:5001/final-project-661cd/us-central1/getReport_v2",
          { firebaseID: firebaseId }
        )
        .then((res) => {
          const allReport = res.data;
          const sortData = allReport.sort((a, b) => {
            const dateA = new Date(a.createAt);
            const dateB = new Date(b.createAt);
            return dateB - dateA;
          });
          setProjects(sortData);
          filterReport(sortData);
        });
    }
    setIsFetching(false);
  };
  useEffect(() => {
    fetchProject();
  }, [refresh, firebaseId, isArchive]);
  const statusFilter = watch("statusFilter") || "";
  const searchRef = watch("searchRef") || "";

  useEffect(() => {
    onSearch();
  }, [statusFilter, searchRef]);

  const onSearch = () => {
    const searchField = ["ref", "title", "RepStatus"];
    const value = searchRef + " " + statusFilter;
    const result = search(projects, searchField, value);
    setFilterProject(result);
  };
  const { user } = useAppContext();

  return (
    <Box p="1rem" maxW="100%">
      <Heading fontFamily={"inherit"} textAlign={"center"}>
        การแจ้งปัญหา
      </Heading>
      <HStack
        my="1em"
        alignItems={"center"}
        spacing={{ base: "0px", sm: "0px", md: "10px" }}
        p={{ sm: "0px", md: "20px 20px 30px 20px" }}
        background={{ sm: "none", md: "#FFFFFF" }}
        boxShadow={{
          sm: "0px",
          md: "14px 17px 40px 4px rgba(112, 144, 176, 0.08)",
        }}
        justifyContent="space-between"
        flexDirection={{
          base: "column",
          sm: "column",
          md: "row",
          lg: "row",
        }}
        maxW="100%"
      >
        <Flex alignItems={"center"} mt={2}>
          <Controller
            name="searchRef"
            control={control}
            defaultValue={""}
            render={({ field }) => (
              <InputGroup w={{ base: "100%", md: "220px", lg: "250px" }}>
                <InputLeftElement>
                  <IconButton
                    bg="inherit"
                    borderRadius="inherit"
                    _hover="none"
                    _active={{
                      bg: "inherit",
                      transform: "none",
                      borderColor: "transparent",
                    }}
                    _focus={{
                      boxShadow: "none",
                    }}
                    icon={<SearchIcon color={"gray.700"} w="15px" h="15px" />}
                  ></IconButton>
                </InputLeftElement>
                <Input
                  variant="search"
                  fontSize="sm"
                  border="1px solid rgb(0,0,0,0.2)"
                  bg={"secondaryGray.300"}
                  color={"gray.700"}
                  fontWeight="500"
                  _placeholder={{
                    color: "gray.400",
                    fontSize: "14px",
                    opacity: 1,
                  }}
                  borderRadius={"30px"}
                  placeholder={"ค้นหาจากรหัสอ้างอิง, ชื่อปัญหา"}
                  {...field}
                />
              </InputGroup>
            )}
          />
          <Controller
            name="statusFilter"
            defaultValue={""}
            control={control}
            render={({ field }) => (
              <Box w={{ base: "100%", md: "fit-content" }} ml="2">
                <Select
                  {...field}
                  w={{ base: "100%", md: "250px" }}
                  variant="search"
                  border="1px solid rgb(0,0,0,0.2)"
                  bg={{
                    base: "white",
                    sm: "white",
                    md: "secondaryGray.300",
                  }}
                  fontSize="sm"
                  color={"gray.700"}
                  fontWeight="500"
                  _placeholder={{
                    color: "gray.400",
                    fontSize: "14px",
                    opacity: 1,
                  }}
                  borderRadius={"20px"}
                >
                  <option value="">สถานะทั้งหมด</option>
                  <option value="รอรับเรื่อง">รอรับเรื่อง</option>
                  <option value="กำลังดำเนินการ">กำลังดำเนินการ</option>
                  <option value="เสร็จสิ้น">เสร็จสิ้น</option>
                  <option value="ยกเลิก">ยกเลิก</option>
                </Select>
              </Box>
            )}
          />
          <Button
            borderRadius={"16px"}
            ml="2"
            onClick={() => setRefresh(!refresh)}
            bg="#4C7BF4"
            color="#fff"
            _hover={{ opacity: "0.8" }}
            isLoading={isFetching}
          >
            <AiOutlineReload />
          </Button>
        </Flex>
        <Flex justifyContent="flex-end" alignItems={"center"} mt={2} w={"100%"}>
          <Button
            mx={2}
            onClick={() => setIsArchive(!isArchive)}
            bg={isArchive === false ? "#4C7BF4" : "#fff"}
            color={isArchive === false ? "#fff" : "#4C7BF4"}
            border={`1px`}
            borderRadius={"16px"}
            _hover={{ opacity: 1 }}
          >
            <BsFillArchiveFill />
          </Button>
          {user && (
            <Button
              borderRadius={"16px"}
              onClick={() => navigate("/form")}
              bg="#4C7BF4"
              color="#fff"
              _hover={{ opacity: "0.8" }}
              w="max-content"
            >
              แจ้งปัญหาการใช้งาน
            </Button>
          )}
        </Flex>
      </HStack>
      {isArchive && (
        <Tag
          size={"md"}
          borderRadius="full"
          variant="solid"
          my={3}
          bg="#4C7BF4"
          color="#fff"
        >
          รายการจัดเก็บ
        </Tag>
      )}
      <Box>
        <CustomTable
          columnsData={columnsHeader}
          tableData={filterProject}
          disabledSearch={true}
          isFetching={isFetching}
          isArchive={isArchive}
        />
      </Box>
    </Box>
  );
}

export default TicketList;
