/* eslint-disable react/prop-types */
import {
  Box,
  Button,
  Image,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
  ModalContent,
} from '@chakra-ui/react'

export default function ImageEditModal(props) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box>
      <Box
        position='relative'
        // w='fit-content'
        h={props.size || '200px'}
        w={props.size || '200px'}
        borderRadius={'15px'}
        border='1px solid rgb(0,0,0,0.3)'
        display='flex'
        justifyContent={'center'}
        alignItems={'center'}
        p="0.25rem"
      >
        <Image
          m='auto'
          maxH={'100%'}
          maxW={'100%'}
          src={props.src}
          onClick={onOpen}
          cursor={'pointer'}
        />
        <Button
          position='absolute'
          top='-1rem'
          right='-1rem'
          colorScheme='red'
          size='sm'
          onClick={() => {
            props.removeHandle(props.index)
          }}
        >
          X
        </Button>
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
