/* eslint-disable react/prop-types */
import {
  Box,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
} from '@chakra-ui/react'

export default function ImageModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <Box>
      <Box
        h={props.size || '200px'}
        w={props.size || '200px'}
        borderRadius={'15px'}
        border='1px solid rgb(0,0,0,0.3)'
        display='flex'
        justifyContent={'center'}
        alignItems={'center'}
        p='0.25rem'
        onClick={onOpen}
        cursor={'pointer'}
      >
        <Image m='auto' maxH={'100%'} maxW={'100%'} src={props.src} />
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalBody>
            <ModalCloseButton />
            <Image src={props.src} m='auto' />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
