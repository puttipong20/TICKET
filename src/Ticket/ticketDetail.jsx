/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Card,
  CardHeader,
  CardBody,
  Grid,
  HStack,
  Heading,
  Tag,
  Text,
  Center,
} from "@chakra-ui/react";
import { ChevronLeftIcon } from "@chakra-ui/icons";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTicketContext } from "./TicketContext/TicketContext";
import moment from "moment";
import ImageModal from "./Components/ImageModal";
import TicketEdit from "./Components/ticketEdit";
import { useAppContext } from "../Context/AppContext";

export default function TicketDetail() {
  const navigate = useNavigate();
  const { report } = useTicketContext();
  const {user} = useAppContext();
  const goBack = () => {
    navigate(-1);
  };

  const dateFormat = (date) => {
    return moment(date).format("DD/MM/YYYY HH:mm:ss");
  };

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
      <Tag bg={bg} color={color}>
        {status}
      </Tag>
    );
  };

  useEffect(() => {
    if (report === undefined) {
      goBack();
    }
  }, [report]);

  return (
    <Box p="1rem">
      <Button onClick={goBack} borderRadius={"16px"}>
        <Text>
          <ChevronLeftIcon />
          รวมรายการปัญหา
        </Text>
      </Button>
      {/* show {} */}
      {report && (
        <Center>
          <Grid
            templateColumns={{ sm: "repeat(1,1fr)", md: "repeat(2,1fr)" }}
            p="1rem"
            maxW={"100%"}
            w="100%"
            gap="3rem"
          >
            <Card
              maxH="100%"
              overflowY="auto"
              mb="1rem"
              h="100%"
              border="1px solid rgb(0,0,0,0.1)"
            >
              <CardHeader p="0.75rem" bg="#4C7BF4" color="#fff">
                <Heading
                  as="h3"
                  fontFamily={"inherit"}
                  fontSize={"xl"}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  รายละเอียดปัญหาที่แจ้ง{" "}
                  {user && (
                    <TicketEdit data={report} navigate={navigate} user={user} />
                  )}
                </Heading>
              </CardHeader>
              <CardBody p="0.75rem">
                <HStack align={"flex-start"} m="0.25rem">
                  <Text w="10rem" fontWeight="bold">
                    ปัญหา
                  </Text>
                  <Text maxW={"calc(100% - 8.5rem)"}>{report.title}</Text>
                </HStack>
                <HStack align={"flex-start"} m="0.25rem">
                  <Text w="10rem" fontWeight="bold">
                    หมายเลขอ้างอิง
                  </Text>
                  <Text maxW={"calc(100% - 8.5rem)"}>{report.ref}</Text>
                </HStack>
                <HStack align={"flex-start"} m="0.25rem">
                  <Text w="10rem" fontWeight="bold">
                    รายละเอียดของปัญหา
                  </Text>
                  <Text
                    as="pre"
                    maxW={"calc(100% - 8.5rem)"}
                    fontFamily={"inherit"}
                  >
                    {report.detail}
                  </Text>
                </HStack>
                <HStack align={"flex-start"} m="0.25rem">
                  <Text w="10rem" fontWeight="bold">
                    วันที่แจ้ง
                  </Text>
                  <Text maxW={"calc(100% - 8.5rem)"}>
                    {dateFormat(report.createAt)}
                  </Text>
                </HStack>
                <HStack align={"flex-start"} m="0.25rem">
                  <Text w="10rem" fontWeight="bold">
                    สถานะปัจจุบัน
                  </Text>
                  <Text maxW={"calc(100% - 8.5rem)"}>
                    {reportStatus(report.RepStatus)}
                  </Text>
                </HStack>
                <HStack align={"flex-start"} m="0.25rem">
                  <Text w="10rem" fontWeight="bold">
                    ผู้แจ้ง
                  </Text>
                  <Text maxW={"calc(100% - 8.5rem)"}>{report.name}</Text>
                </HStack>
                <HStack align={"flex-start"} m="0.25rem">
                  <Text w="10rem" fontWeight="bold">
                    เบอร์โทร
                  </Text>
                  <Text maxW={"calc(100% - 8.5rem)"}>
                    {report.phone === "" ? "-" : report.phone}
                  </Text>
                </HStack>
                <HStack align={"flex-start"} m="0.25rem">
                  <Text w="10rem" fontWeight="bold">
                    ไลน์
                  </Text>
                  <Text maxW={"calc(100% - 8.5rem)"}>
                    {report.line === "" ? "-" : report.line}
                  </Text>
                </HStack>
                <HStack align={"flex-start"} m="0.25rem">
                  <Text w="10rem" fontWeight="bold">
                    อีเมล
                  </Text>
                  <Text maxW={"calc(100% - 8.5rem)"}>
                    {report.email === "" ? "-" : report.email}
                  </Text>
                </HStack>
                <HStack align={"flex-start"} m="0.25rem">
                  <Text w="10rem" fontWeight="bold">
                    แก้ไขล่าสุด
                  </Text>
                  <Text maxW={"calc(100% - 8.5rem)"}>
                    {report.latestReportUpdate
                      ? `${dateFormat(
                          report.latestReportUpdate.timestamp
                        )} โดย ${report.latestReportUpdate.username}`
                      : "-"}
                  </Text>
                </HStack>
                {report.RepImg.length > 0 && (
                  <Box>
                    <Text fontWeight={"bold"} pl="0.25rem">
                      รูปภาพเพิ่มเติม
                    </Text>
                    <Grid
                    mt={'5'}
                    m={'auto'}
                      templateColumns={{
                        sm: "repeat(1,1fr)",
                        md: "repeat(3,1fr)",
                      }}
                      w="fit-content"
                      gap="1rem"
                    >
                      {report.RepImg.map((i, index) => {
                        return <ImageModal src={i} key={index} />;
                        // return <Image src={i} key={index} borderRadius={"15px"}/>
                      })}
                    </Grid>
                  </Box>
                )}
              </CardBody>
            </Card>

            <Card
              maxH="100%"
              overflowY="auto"
              h="100%"
              border="1px solid rgb(0,0,0,0.1)"
            >
              <CardHeader p="0.75rem" color="#fff" bg="#228B22">
                <Heading as="h3" fontFamily={"inherit"} fontSize={"xl"}>
                  รายละเอียดการแก้ไขปัญหา
                </Heading>
              </CardHeader>
              <CardBody p="0.75rem">
                {report.solution ? (
                  <Box>
                    <HStack align={"flex-start"} m="0.25rem">
                      <Text w="10rem" fontWeight="bold">
                        ผู้รับเรื่อง
                      </Text>
                      <Text maxW={"calc(100% - 8.5rem)"}>
                        {report.solution.accepter}
                      </Text>
                    </HStack>
                    <HStack align={"flex-start"} m="0.25rem">
                      <Text w="10rem" fontWeight="bold">
                        ปัญหาที่พบ
                      </Text>
                      <Text maxW={"calc(100% - 8.5rem)"}>
                        {report.solution.issue}
                      </Text>
                    </HStack>
                    <HStack align={"flex-start"} m="0.25rem">
                      <Text w="10rem" fontWeight="bold">
                        รายละเอียดการแก้ไข
                      </Text>
                      <Text
                        as="pre"
                        maxW={"calc(100% - 8.5rem)"}
                        fontFamily={"inherit"}
                      >
                        {report.solution.solution
                          ? report.solution.solution
                          : "-"}
                      </Text>
                    </HStack>
                    <HStack align={"flex-start"} m="0.25rem">
                      <Text w="10rem" fontWeight="bold">
                        วันที่ดำเนินการ
                      </Text>
                      <Text maxW={"calc(100% - 8.5rem)"}>
                        {report.solution.dateProcess &&
                        report.solution.dateProcess !== ""
                          ? dateFormat(report.solution.dateProcess)
                          : "-"}
                      </Text>
                    </HStack>
                    <HStack align={"flex-start"} m="0.25rem">
                      <Text w="10rem" fontWeight="bold">
                        วันที่เสร็จสิ้น
                      </Text>
                      <Text maxW={"calc(100% - 8.5rem)"}>
                        {report.solution.dateDone &&
                        report.solution.dateDone !== ""
                          ? dateFormat(report.solution.dateDone)
                          : "-"}
                      </Text>
                    </HStack>
                    {report.solution.solutionImg.length > 0 && (
                      <Box>
                        <Text pl="0.25rem" fontWeight={"bold"}>
                          รูปภาพเพิ่มเติม
                        </Text>
                        <Grid
                          templateColumns={{
                            sm: "repeat(1,1fr)",
                            md: "repeat(4,1fr)",
                          }}
                          w="fit-content"
                          gap="1rem"
                        >
                          {report.solution.solutionImg.map((i, index) => {
                            return <ImageModal src={i} key={index} />;
                            // return <Image src={i} key={index} borderRadius={"15px"}/>
                          })}
                        </Grid>
                      </Box>
                    )}
                  </Box>
                ) : (
                  <Box>
                    <Text>ยังไม่มีรายละเอียดการรับเรื่อง/แก้ไข</Text>
                  </Box>
                )}
              </CardBody>
            </Card>
          </Grid>
        </Center>
      )}
    </Box>
  );
}
