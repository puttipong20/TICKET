import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  Flex,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React from "react";
import { BsFillArchiveFill } from "react-icons/bs";

function AlertArchive({ isArchive, docId, fetchProject }) {
  const cancelRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const Archive = (docId) => {
    onClose();
    axios
      .post(
        // "https://us-central1-crafting-ticket-dev.cloudfunctions.net/updateReport",
        // "https://us-central1-craftinglab-dev.cloudfunctions.net/updateReport", //prod
        "http://127.0.0.1:5001/present-project-cecd4/us-central1/updateReport",
        {
          reportId: docId,
          isArchive: isArchive === false ? true : false,
        }
      )
      .then(() => {
        toast({
          position: "top",
          title: isArchive === false ? "จัดเก็บ" : "ยกเลิกจัดเก็บ",
          description:
            isArchive === false
              ? "ปัญหารายการนี้ถูกจัดเก็บเรียบร้อยแล้ว"
              : "ปัญหารายการนี้ถูกยกเลิกจัดเก็บแล้ว",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        fetchProject();
      })
      .catch((e) => {
        toast({
          position: "top",
          title: "จัดเก็บ",
          description: "เกิดข้อผิดพลาด",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      });
  };
  return (
    <>
      <Flex
        onClick={onOpen}
        w={"100%"}
        alignItems={"center"}
        justifyContent={"space-between"}
      >
        <BsFillArchiveFill />
        {isArchive === false ? "จัดเก็บ" : "ยกเลิกจัดเก็บ"}
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent borderRadius={"16px"}>
            <AlertDialogHeader
              fontSize="lg"
              fontWeight="bold"
              color={"#fff"}
              borderTopRadius={"16px"}
              bg={"#4C7BF4"}
            >
              จัดเก็บปัญหา
            </AlertDialogHeader>

            <AlertDialogBody>
              {isArchive === false
                ? "ต้องการจัดเก็บปัญหานี้ใช่หรือไม่"
                : "ต้องการยกเลิกจัดเก็บปัญหานี้ใช่หรือไม่"}
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button
                bg={"#fff"}
                ref={cancelRef}
                onClick={onClose}
                borderRadius={"10px"}
                _hover={{ opacity: 1 }}
              >
                ยกเลิก
              </Button>
              <Button
                onClick={() => Archive(docId)}
                ml={3}
                bg={"#4C7BF4"}
                color={"#fff"}
                borderRadius={"10px"}
                _hover={{ opacity: 1 }}
              >
                {isArchive === false ? "จัดเก็บ" : "ยกเลิกจัดเก็บ"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default AlertArchive;
