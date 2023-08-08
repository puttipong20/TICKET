/* eslint-disable react/prop-types */
import { SearchIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Flex,
  Icon,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Stack,
  Tag,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  Box,
  useColorModeValue,
  Select,
  Spinner,
  Menu,
  MenuButton,
} from "@chakra-ui/react";
import { Fragment, useEffect, useMemo } from "react";
import { MdChevronRight, MdChevronLeft } from "react-icons/md";
import { useSearchParams } from "react-router-dom";
import { BsPlus } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useTicketContext } from "../TicketContext/TicketContext";
import moment from "moment";
import { useAppContext } from "../../Context/AppContext";

function SearchBar() {
  // Pass the computed styles into the `__css` prop
  // Chakra Color Mode
  const searchIconColor = useColorModeValue("gray.700", "white");
  const inputBg = useColorModeValue("secondaryGray.300", "navy.900");
  const inputText = useColorModeValue("gray.700", "gray.100");

  return (
    <InputGroup w={{ base: "100%", md: "200px" }}>
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
          icon={<SearchIcon color={searchIconColor} w="15px" h="15px" />}
        ></IconButton>
      </InputLeftElement>
      <Input
        variant="search"
        fontSize="sm"
        bg={inputBg}
        color={inputText}
        fontWeight="500"
        _placeholder={{ color: "gray.400", fontSize: "14px" }}
        borderRadius={{ base: "10px", sm: "10px", md: "10px", lg: "30px" }}
        placeholder={"Search..."}
      />
    </InputGroup>
  );
}

function CustomTable({
  columnsData,
  tableData,
  pages,
  disabledSearch,
  closeSearch,
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const navigate = useNavigate();
  const { setReport } = useTicketContext();
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    gotoPage,
    pageCount,
    prepareRow,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    setGlobalFilter,
    state,
    setPageSize,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: searchParams.get("tbPage")
          ? Number(Number(searchParams.get("tbPage")) - 1) || 0
          : 0,
      },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const getSetParams = (tbPage) => {
    const params = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    setSearchParams({ ...params, tbPage });
  };

  useEffect(() => {
    if (searchParams.get("tbPage")) {
      if (searchParams.get("tbPage") <= pageCount) {
        gotoPage(Number(Number(searchParams.get("tbPage")) - 1) || 0);
      } else {
        gotoPage(0);
        getSetParams(Number(1));
      }
    } else {
      gotoPage(0);
      // getSetParams(Number(1))
    }
    //eslint-disable-next-line
  }, [searchParams, pageCount]);

  const filterPages = (visiblePages, totalPages) => {
    return visiblePages.filter((page) => page <= totalPages);
  };

  const createPages = (page, total) => {
    if (total < 7) {
      return filterPages([1, 2, 3, 4, 5, 6], total);
    } else {
      if (page % 5 >= 0 && page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page % 5 >= 0 && page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  };

  const { pageIndex, pageSize } = state;
  const textColor = useColorModeValue("secondaryGray.900", "white");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.100");
  const brandColor = useColorModeValue("table.100", "table.100");

  const tableShowRowOptions = pages ? pages : [10, 20, 30, 40, 50];
  const { user } = useAppContext();

  const reportStatus = (status) => {
    let bg = "";
    let color = "white";
    switch (status) {
      case "รอรับเรื่อง":
        bg = "yellow.300";
        color = "black";
        break;
      case "กำลังดำเนินการ":
        bg = "gray.400";
        break;
      case "เสร็จสิ้น":
        bg = "green.500";
        break;
      case "ยกเลิก":
        bg = "red.500";
        break;
      default:
        break;
    }
    return (
      <Tag
        bg={bg}
        color={color}
        w="125px"
        textAlign={"center"}
        display="flex"
        justifyContent={"center"}
        alignItems={"center"}
      >
        {status}
      </Tag>
    );
  };

  return (
    <>
      <Flex
        direction="column"
        w="100%"
        overflowX={{ sm: "scroll", lg: "hidden" }}
      >
        {!closeSearch && (
          <Flex
            align={{ sm: "flex-start", lg: "flex-start" }}
            justify={{ sm: "space-between", lg: "space-between" }}
            w="100%"
            mb="36px"
            display={disabledSearch ? "none" : "flex"}
          >
            <Box zIndex="base">
              <SearchBar
                onChange={(e) => setGlobalFilter(e.target.value)}
                h="44px"
                w={{ base: "full", lg: "390px" }}
                borderRadius="16px"
                mr={"10px"}
              />
            </Box>
          </Flex>
        )}
        {headerGroups && page ? (
          <Table
            {...getTableProps()}
            pt="0px"
            mt={closeSearch ? "36px" : "0px"}
          >
            <Thead bg="#4C7BF4" color="#fff">
              {headerGroups.map((headerGroup, index) => (
                <Tr {...headerGroup.getHeaderGroupProps()} key={index}>
                  {headerGroup.headers.map((column, indexkey) => (
                    <Th
                      borderRadius={
                        indexkey == 0
                          ? "15px 0 0 0"
                          : indexkey == headerGroup.headers.length - 1
                          ? "0 15px 0 0 "
                          : "none"
                      }
                      {...column.getHeaderProps(column.getSortByToggleProps())}
                      key={indexkey}
                      borderColor={borderColor}
                      fontFamily={"Prompt"}
                      textAlign="center"
                    >
                      <Text
                        justify="space-between"
                        align="center"
                        fontSize={{ sm: "10px", lg: "12px", xl: "14px" }}
                        color="white"
                      >
                        {column.render("Header")}
                      </Text>
                    </Th>
                  ))}
                </Tr>
              ))}
            </Thead>
            <Tbody {...getTableBodyProps()} bg="white">
              {page.map((row, index) => {
                prepareRow(row);
                return (
                  <Tr
                    {...row.getRowProps()}
                    key={index}
                    cursor={"pointer"}
                    onClick={() => {
                      setReport(row.original);
                      navigate(`/${row.original.ref}`);
                    }}
                  >
                    {row.cells.map((cell, i) => {
                      let data = "";
                      if (cell.column?.extra) {
                        data = cell.column?.extra(
                          cell.value,
                          // tableData[row.getRowProps().key.split('_')[1]],
                          tableData[row.getRowProps().key.split("_")[1]],
                          cell
                        );
                      } else {
                        data = (
                          <Text
                            color={textColor}
                            fontSize="sm"
                            fontWeight="500"
                            key={i}
                          >
                            {cell.value}
                          </Text>
                        );
                      }
                      // console.log(cell.column.header)
                      if (cell.column.Header === "วันที่แจ้ง") {
                        return (
                          <Td
                            {...cell.getCellProps()}
                            key={i}
                            fontSize={{ sm: "12px" }}
                            minW={{
                              sm: "220px",
                              md: "220px",
                              lg: "auto",
                              xl: "auto",
                            }}
                            borderColor={borderColor}
                            textAlign="center"
                          >
                            <Center>
                              {moment(data.props.children).format(
                                "DD/MM/YYYY HH:mm:ss"
                              )}
                            </Center>
                          </Td>
                        );
                      }
                      if (cell.column.Header === "สถานะ") {
                        return (
                          <Td
                            {...cell.getCellProps()}
                            key={i}
                            fontSize={{ sm: "12px" }}
                            minW={{
                              sm: "220px",
                              md: "220px",
                              lg: "auto",
                              xl: "auto",
                            }}
                            borderColor={borderColor}
                            textAlign="center"
                          >
                            <Center>{reportStatus(data.props.children)}</Center>
                          </Td>
                        );
                      } else {
                        return (
                          <Td
                            {...cell.getCellProps()}
                            key={i}
                            fontSize={{ sm: "12px" }}
                            minW={{
                              sm: "220px",
                              md: "220px",
                              lg: "auto",
                              xl: "auto",
                            }}
                            borderColor={borderColor}
                            textAlign="center"
                          >
                            <Center>{data}</Center>
                          </Td>
                        );
                      }
                    })}
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        ) : (
          <Box>
            <Spinner size={"md"} />
          </Box>
        )}
        <Flex
          mt="24px"
          direction={{ sm: "column", md: "row" }}
          justify="space-between"
          align="center"
          w="100%"
          px={{ md: "22px" }}
        >
          <Flex align="center">
            <Text
              me="10px"
              minW="max-content"
              fontSize="sm"
              color="gray.500"
              fontWeight="normal"
            >
              Show rows per page
            </Text>
            <Select
              fontSize="sm"
              variant="main"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {tableShowRowOptions?.map((item, tableShowRowOptionsindex) => {
                return (
                  <option value={item} key={tableShowRowOptionsindex}>
                    {item}
                  </option>
                );
              })}
            </Select>
          </Flex>

          <Text
            fontSize="sm"
            color="gray.500"
            fontWeight="normal"
            mb={{ sm: "24px", md: "0px" }}
            ml={{ sm: "5px", md: "5px" }}
          >
            Showing {pageSize * pageIndex + 1} to{" "}
            {pageSize * (pageIndex + 1) <= tableData.length
              ? pageSize * (pageIndex + 1)
              : tableData.length}{" "}
            of {tableData.length} entries
          </Text>

          <Stack
            direction="row"
            alignSelf={{ base: "unset", md: "flex-end" }}
            spacing="4px"
            ms={{ base: "0px", md: "auto" }}
          >
            <Button
              variant="no-effects"
              onClick={() => previousPage()}
              transition="all .5s ease"
              w="40px"
              h="40px"
              borderRadius="50%"
              bg="transparent"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "white")}
              display={
                pageSize === 0 ? "none" : canPreviousPage ? "flex" : "none"
              }
              _hover={{
                bg: "whiteAlpha.100",
                opacity: "0.7",
              }}
            >
              <Icon as={MdChevronLeft} w="16px" h="16px" color={textColor} />
            </Button>
            {pageSize === 0 ? (
              <NumberInput
                max={pageCount - 1}
                min={1}
                w="75px"
                mx="6px"
                defaultValue="1"
                // onChange={(e) => gotoPage(e)}
                // onChange={(e) => setSearchParams({ tbPage: Number(e) })}
                onChange={(e) => getSetParams(e)}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper onClick={() => nextPage()} />
                  <NumberDecrementStepper onClick={() => previousPage()} />
                </NumberInputStepper>
              </NumberInput>
            ) : (
              createPages(pageIndex + 1, pageCount).map(
                (pageNumber, index, array) => {
                  return (
                    <Fragment key={index}>
                      {array[index - 1] + 2 < pageNumber && (
                        <Button
                          variant="no-effects"
                          transition="all .5s ease"
                          onClick={() => {
                            // gotoPage(pageNumber - 1)
                            // setSearchParams({
                            //   tbPage: Number(pageNumber),
                            // })
                            getSetParams(pageNumber);
                          }}
                          w="40px"
                          h="40px"
                          borderRadius="50%"
                          bg={
                            pageNumber === pageIndex + 1
                              ? brandColor
                              : "transparent"
                          }
                          border={
                            pageNumber === pageIndex + 1
                              ? "none"
                              : "1px solid lightgray"
                          }
                          _hover={
                            pageNumber === pageIndex + 1
                              ? {
                                  opacity: "0.7",
                                }
                              : {
                                  bg: "whiteAlpha.100",
                                }
                          }
                          key={pageNumber + "..."}
                        >
                          <Text
                            key={index}
                            fontSize="sm"
                            color={
                              pageNumber === pageIndex + 1 ? "#fff" : textColor
                            }
                          >
                            ...
                          </Text>
                        </Button>
                      )}
                      <Button
                        variant="no-effects"
                        bg="#4C7BF4"
                        transition="all .5s ease"
                        // onClick={() => gotoPage(pageNumber - 1)}
                        onClick={() => {
                          // gotoPage(pageNumber - 1)
                          // setSearchParams({
                          //   tbPage: Number(pageNumber),
                          // })
                          getSetParams(pageNumber);
                        }}
                        w="40px"
                        h="40px"
                        borderRadius="50%"
                        // bg={
                        //   pageNumber === pageIndex + 1
                        //     ? brandColor
                        //     : 'transparent'
                        // }
                        border={
                          pageNumber === pageIndex + 1
                            ? "none"
                            : "1px solid lightgray"
                        }
                        _hover={
                          pageNumber === pageIndex + 1
                            ? {
                                opacity: "0.7",
                              }
                            : {
                                bg: "whiteAlpha.100",
                              }
                        }
                        key={index}
                      >
                        <Text
                          fontSize="sm"
                          color={
                            pageNumber === pageIndex + 1 ? "#fff" : textColor
                          }
                        >
                          {pageNumber}
                        </Text>
                      </Button>
                    </Fragment>
                  );
                }
              )
            )}
            <Button
              variant="no-effects"
              onClick={() => nextPage()}
              transition="all .5s ease"
              w="40px"
              h="40px"
              borderRadius="50%"
              bg="transparent"
              border="1px solid"
              borderColor={useColorModeValue("gray.200", "white")}
              display={pageSize === 5 ? "none" : canNextPage ? "flex" : "none"}
              _hover={{
                bg: "whiteAlpha.100",
                opacity: "0.7",
              }}
            >
              <Icon as={MdChevronRight} w="16px" h="16px" color={textColor} />
            </Button>
          </Stack>
        </Flex>
      </Flex>
      {user && (
        <Menu>
          <MenuButton
            as={Button}
            bg="#4C7BF4"
            colorScheme="btn"
            borderRadius="full"
            position="fixed"
            right={5}
            bottom={5}
            w={"50px"}
            h={"50px"}
            px="0"
            _hover={{ bg: "#4C7BF4", opacity: "0.75" }}
            onClick={() => navigate("/form")}
          >
            <Center
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Icon as={BsPlus} fontSize={"45px"} />
            </Center>
          </MenuButton>
        </Menu>
      )}
    </>
  );
}

export default CustomTable;
