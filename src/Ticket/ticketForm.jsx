/* eslint-disable react-hooks/exhaustive-deps */
import {
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Input,
  Stack,
  Text,
  Textarea,
  useToast,
  Image,
  VStack,
  Heading,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import moment from "moment/moment";
import { useNavigate } from "react-router-dom";
import { MdUpload } from "react-icons/md";
import axios from "axios";
import { useTicketContext } from "./TicketContext/TicketContext";
import { useAppContext } from "../Context/AppContext";
function TicketForm() {
  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
    setValue,
  } = useForm();
  const { user } = useAppContext();

  const [allImgUpload, setAllImgUpload] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { firebaseId,report } = useTicketContext();
  const formattedDate = moment().format("YYYY-MM-DD HH:mm:ss");

  const handleClose = () => {
    navigate(-1);
  };
  useEffect(() => {
    setValue(
      "ticketsName",
      user.username || user.displayName || user.name || user.email
    );
    setValue("ticketsEmail", user.email);
  }, []);
  const onSubmit = async (data) => {
    setIsLoading(true);
    const datas = {
      title:
        data.ticketsProblems === "other"
          ? data.otherProblem
          : data.ticketsProblems,
      detail: data.ticketsDetails,
      phone: data.ticketsPhone,
      line: data.ticketsLine,
      email: data.ticketsEmail,
      createAt: data.ticketsDate,
      name: data.ticketsName,
      createBy: {
        username: user.username || user.displayName || user.name || user.email,
        uid: user.uid || "-",
      },
      RepImg: allImgUpload,
      firebaseId: firebaseId,
      projectId: report[0].projectId
    };
    try {
      await axios
        .post(
          "https://us-central1-crafting-ticket-dev.cloudfunctions.net/addReport_v2",
          // "https://us-central1-craftinglab-dev.cloudfunctions.net/addReport_v2",// prod
          datas
        )
        .then((res) => {
          if (res.data === true) {
            toast({
              title: "ส่งปัญหาเสร็จสิ้น",
              description: "ปัญหาถูกส่งไปยังผู้พัฒนาแล้ว",
              status: "success",
              position: "top",
              duration: 3000,
              isClosable: true,
            });
          } else {
            toast({
              title: "เกิดข้อผิดพลาด",
              description: res.data,
              status: "error",
              position: "top",
              duration: 5000,
              isClosable: true,
            });
          }
        });
    } catch (e) {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: e,
        status: "error",
        position: "top",
        duration: 5000,
        isClosable: true,
      });
    }
    reset();
    setIsLoading(false);
    navigate(-1);
  };

  const uploadFile = (event) => {
    const files = event.target.files;
    const temp = allImgUpload;

    const promises = [];

    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      const promise = new Promise((resolve) => {
        reader.onload = (e) => {
          resolve(e.target.result);
        };
      });
      reader.readAsDataURL(files[i]);
      promises.push(promise);
    }

    Promise.all(promises).then((results) => {
      setAllImgUpload([...temp, ...results]);
    });
  };

  const removeFile = (index) => {
    setAllImgUpload(allImgUpload.filter((i) => i !== allImgUpload[index]));
  };
  return (
    <Flex direction="column" minH="100vh" align="center" w="100%" pb="3">
      <Heading
        fontFamily={"inherit"}
        textAlign={"center"}
        w="100%"
        h="15vh"
        color="#fff"
        bg={"#4C7BF4"}
        display="flex"
        alignItems={"center"}
        justifyContent={"center"}
      >
        แจ้งปัญหาการใช้งาน
      </Heading>
      <Box w={{ base: "90%", md: "50%" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Container
            pb="10px"
            position="sticky"
            bg="white"
            borderRadius="20px"
            boxShadow="xl"
          >
            <Grid my={4}>
              <Text color="#A3AED0">กรุณาระบุปัญหา และรายละเอียดเพิ่มเติม</Text>
            </Grid>
            <Box>
              <Stack mb="5">
                <Box>
                  <Controller
                    name="ticketsDate"
                    control={control}
                    defaultValue={formattedDate}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      <FormControl isReadOnly display={"none"}>
                        <FormLabel>วันที่</FormLabel>
                        <Input
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          borderRadius="12px"
                          type="datetime-local"
                        />
                      </FormControl>
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    name="ticketsProblems"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field: { name, value, onChange, onBlur } }) => (
                      <FormControl isInvalid={Boolean(errors[name])}>
                        <FormLabel>
                          <Flex>
                            <Box>ปัญหาที่พบ</Box>
                            <Text color={"red"}>*</Text>
                          </Flex>
                        </FormLabel>
                        <Input
                          placeholder="ระบุปัญหาที่พบ"
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          borderRadius="12px"
                        />
                      </FormControl>
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    name="ticketsDetails"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field: { name, value, onChange, onBlur } }) => (
                      <FormControl isInvalid={Boolean(errors[name])}>
                        <FormLabel>
                          <Flex>
                            <Box>รายละเอียด</Box>
                            <Text color={"red"}>*</Text>
                          </Flex>
                        </FormLabel>
                        <Textarea
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          placeholder="ใส่รายละเอียดเพิ่มเติม..."
                          borderRadius="12px"
                        />
                      </FormControl>
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    name="ticketsName"
                    control={control}
                    defaultValue=""
                    rules={{ required: true }}
                    render={({ field: { name, value, onChange, onBlur } }) => (
                      <FormControl isInvalid={Boolean(errors[name])}>
                        <FormLabel>ผู้แจ้งปัญหา</FormLabel>
                        <Input
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          borderRadius="12px"
                          isReadOnly
                        />
                      </FormControl>
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    name="ticketsPhone"
                    control={control}
                    defaultValue=""
                    render={({ field: { value, onChange, onBlur } }) => (
                      <FormControl>
                        <FormLabel>เบอร์โทร</FormLabel>
                        <Input
                          type="tel"
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          placeholder="ระบุเบอร์โทรที่ใช้ในการติดต่อ"
                          borderRadius="12px"
                        />
                      </FormControl>
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    name="ticketsLine"
                    control={control}
                    defaultValue=""
                    render={({ field: { value, onChange, onBlur } }) => (
                      <FormControl>
                        <FormLabel>ไลน์</FormLabel>
                        <Input
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          placeholder="ระบุไลน์ ID ที่ใช้ในการติดต่อ"
                          borderRadius="12px"
                        />
                      </FormControl>
                    )}
                  />
                </Box>
                <Box>
                  <Controller
                    name="ticketsEmail"
                    control={control}
                    defaultValue=""
                    render={({ field: { value, onChange, onBlur } }) => (
                      <FormControl>
                        <FormLabel>อีเมล</FormLabel>
                        <Input
                          type="email"
                          value={value}
                          onChange={onChange}
                          onBlur={onBlur}
                          placeholder="ระบุอีเมลที่ใช้ในการติดต่อ"
                          borderRadius="12px"
                          isReadOnly
                        />
                      </FormControl>
                    )}
                  />
                </Box>
                <Box>
                  <Text pb="3">อัพโหลดไฟล์รูปเพิ่มเติม</Text>
                  <Grid w="100%" templateColumns={"repeat(3,1fr)"} gap="10px">
                    {allImgUpload.map((i, index) => {
                      return (
                        <Flex
                          alignItems={"center"}
                          justifyContent={"center"}
                          position="relative"
                          h="165px"
                          w="100%"
                          border="1px solid black"
                          key={index}
                        >
                          <Button
                            position="absolute"
                            borderRadius={"50%"}
                            right="-10px"
                            top="-10px"
                            size={"xs"}
                            colorScheme="red"
                            onClick={() => {
                              removeFile(index);
                            }}
                          >
                            X
                          </Button>
                          <Image src={i} maxH="100%" />
                        </Flex>
                      );
                    })}
                    <Box>
                      <label htmlFor="imageInput">
                        <VStack
                          textAlign={"center"}
                          border="1px dashed gray"
                          justifyContent={"center"}
                          p={4}
                          h="165PX"
                          w="100%"
                          borderRadius="10px"
                          cursor={"pointer"}
                          userSelect={"none"}
                          bg="#FAFCFE"
                          _hover={{ opacity: "0.9" }}
                        >
                          <Flex
                            color="#4C7BF4"
                            fontSize={{ base: "2.5rem", md: "3rem" }}
                          >
                            <MdUpload />
                          </Flex>
                          <Text
                            color="#4C7BF4"
                            fontWeight="bold"
                            fontSize={{ base: "12px", md: "16px" }}
                          >
                            คลิกเพื่ออัพโหลดไฟล์
                          </Text>
                          <Text
                            color="#8F9BBA"
                            fontSize={{ base: "0.5rem", md: "0.7rem" }}
                          >
                            PNG,JPG are allowed
                          </Text>
                        </VStack>
                      </label>

                      <Input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={uploadFile}
                        display={"none"}
                        bg="white"
                        color="gray.600"
                      />
                    </Box>
                  </Grid>
                </Box>
              </Stack>
              <Flex justify="center" gap="5rem">
                <Button
                  onClick={handleClose}
                  _hover={{ bg: "#ccc" }}
                  bg={"#fff"}
                  color={"#000"}
                  w="25%"
                >
                  ปิด
                </Button>
                <Button
                  isLoading={isLoading}
                  type="submit"
                  bg="#4C7BF4"
                  color="#fff"
                  _hover={{ opacity: "0.75" }}
                  w="25%"
                >
                  บันทึก
                </Button>
              </Flex>
            </Box>
          </Container>
        </form>
      </Box>
    </Flex>
  );
}

export default TicketForm;
