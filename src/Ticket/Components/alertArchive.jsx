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

function AlertArchive({ isArchive,docId ,fetchProject}) {
  const cancelRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const Archive = (docId) => {
    axios
      .post(
        "https://us-central1-crafting-ticket-dev.cloudfunctions.net/updateReport",
        {
          reportId: docId,
          isArchive: isArchive === false? true: false,
        }
      )
      .then(() => {
        onClose();
        toast({
          position: "top",
          title: isArchive === false? "จัดเก็บ": "ยกเลิกจัดเก็บ",
          description: isArchive === false? "ปัญหารายการนี้ถูกจัดเก็บเรียบร้อยแล้ว": "ปัญหารายการนี้ถูกยกเลิกจัดเก็บแล้ว",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }).catch((e) => {
        toast({
          position: "top",
          title: "จัดเก็บ",
          description: "เกิดข้อผิดพลาด",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      })
      fetchProject()
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
        {isArchive === false?"จัดเก็บ": "ยกเลิกจัดเก็บ"}
      </Flex>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              จัดเก็บปัญหา
            </AlertDialogHeader>

            <AlertDialogBody>{isArchive === false ? "ต้องการจัดเก็บปัญหานี้ใช่หรือไม่":"ต้องการยกเลิกจัดเก็บปัญหานี้ใช่หรือไม่"}</AlertDialogBody>

            <AlertDialogFooter>
              <Button bg={"#fff"} ref={cancelRef} onClick={onClose}>
                ยกเลิก
              </Button>
              <Button
                colorScheme="orange"
                onClick={() => Archive(docId)}
                ml={3}
              >
                {isArchive === false? "จัดเก็บ":"ยกเลิกจัดเก็บ"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

export default AlertArchive;
