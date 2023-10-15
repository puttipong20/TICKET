/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  FormControl,
  Grid,
  Input,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  Text,
  useDisclosure,
  useToast,
  Textarea,
  HStack,
} from '@chakra-ui/react'
import axios from 'axios'
import { useForm, Controller } from 'react-hook-form'
import ImageEditModal from './ImageEditModal'
import UploadLabel from './UploadLabel'
import moment from 'moment'
import { useTicketContext } from '../TicketContext/TicketContext'
import { useAppContext } from '../../Context/AppContext'

export default function TicketEdit({ data }) {
  const { setReport } = useTicketContext()
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    handleSubmit,
    control,
    reset,
    setValue,
    formState: errors,
  } = useForm()
  const [oldData, setOldData] = useState()
  const [isLoading, setIsLoading] = useState(false)
  const [uploadImage, setUploadImage] = useState([])
  const { user } = useAppContext()
  // const navigate = props.navigate

  useEffect(() => {
    setOldData(data)
  }, [data])

  useEffect(() => {
    setValue('title', oldData?.title)
    setValue('detail', oldData?.detail)
    setValue('name', oldData?.name)
    setValue('line', oldData?.line)
    setValue('email', oldData?.email)
    setUploadImage(oldData?.RepImg ? oldData?.RepImg : [])
  }, [oldData, setValue])

  const onSubmit = async (dataSubmit) => {
    setIsLoading(true)
    const latestReportUpdate = {
      timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
      uid: user.uid,
      username: user.username || user.displayName || user.name || user.email
    }
    const updateData = {
      title: dataSubmit.title,
      detail: dataSubmit.detail,
      name: dataSubmit.name,
      line: dataSubmit.line,
      email: dataSubmit.email,
      RepImg: uploadImage,
      latestReportUpdate: latestReportUpdate,
    }
    await axios
      .post(
        "https://us-central1-crafting-ticket-dev.cloudfunctions.net/updateReport",
        // 'https://us-central1-craftinglab-dev.cloudfunctions.net/updateReport', //prod
        {
          reportId: oldData.docId,
          title: dataSubmit.title,
          detail: dataSubmit.detail,
          name: dataSubmit.name,
          line: dataSubmit.line,
          email: dataSubmit.email,
          RepImg: uploadImage,
          latestReportUpdate: latestReportUpdate,
        }
      )
      .then(() => {
        setReport({ ...oldData, ...updateData })
        setOldData({ ...oldData, ...updateData })
        toast({
          title: 'อัพเดทสำเร็จ',
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
        onClose()
      })
      .catch(() => {
        toast({
          title: 'อัพเดทล้มเหลว',
          status: 'error',
          duration: 3000,
          isClosable: true,
          position: 'top',
        })
      })
    setIsLoading(false)
  }

  const handleUpload = (event) => {
    const uploadFiles = Array.from(event.target.files || [])
    const promises = []

    for (let i = 0; i < uploadFiles.length; i++) {
      const reader = new FileReader()

      const promise = new Promise((resolve) => {
        reader.onload = (e) => {
          resolve(e.target.result)
        }
      })

      reader.readAsDataURL(uploadFiles[i])
      promises.push(promise)
    }

    Promise.all(promises).then((results) => {
      setUploadImage([...uploadImage, ...results])
    })
  }

  const removeImage = (index) => {
    setUploadImage(uploadImage.filter((i) => i !== uploadImage[index]))
  }

  const handleReset = () => {
    setUploadImage(oldData?.RepImg ? oldData?.RepImg : [])
    reset()
  }

  return (
    <Box>
      <Button
        onClick={onOpen}
        fontWeight='normal'
        h='fit-content'
        bg="#4C7BF4"
        border="none"
        color="#fff"
        _hover={{ color: '#4C7BF4', bg: '#fff' }}
      >
        แก้ไขรายละเอียด
      </Button>

      <Modal
        isOpen={isOpen}
        onClose={() => {
          handleReset()
          onClose()
        }}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontWeight='bold'>แก้ไขรายละเอียดการแจ้งปัญหา</Text>
          </ModalHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <ModalCloseButton />

              <Box>
                <Controller
                  name='title'
                  control={control}
                  render={({ field }) => (
                    <FormControl isRequired isInvalid={errors['title']}>
                      <Text fontWeight='bold'>ปัญหา</Text>
                      <Input type='text' {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name='detail'
                  control={control}
                  render={({ field }) => (
                    <FormControl isRequired>
                      <Text fontWeight='bold'>รายละเอียด</Text>
                      <Textarea {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name='name'
                  control={control}
                  render={({ field }) => (
                    <FormControl isRequired isReadOnly>
                      <Text fontWeight='bold'>ผู้แจ้ง</Text>
                      <Input
                        type='text'
                        {...field}
                        _readOnly={{ color: 'gray', bg: 'gray.100' }}
                      />
                    </FormControl>
                  )}
                />
                <Controller
                  name='line'
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <Text fontWeight='bold'>ไลน์</Text>
                      <Input type='text' {...field} />
                    </FormControl>
                  )}
                />
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <FormControl>
                      <Text fontWeight='bold'>อีเมลล์</Text>
                      <Input type='text' {...field} />
                    </FormControl>
                  )}
                />
              </Box>
              <Box maxH='30vh' overflowY={'auto'}>
                <Text fontWeight='bold'>รูปภาพเพิ่มเติม</Text>
                <Grid
                  templateColumns={'repeat(2,1fr)'}
                  w='fit-content'
                  gap={'1rem'}
                >
                  <label htmlFor='imageInput'>
                    <UploadLabel size={'150px'} count={uploadImage.length} />
                  </label>
                  <Input
                    type='file'
                    display='none'
                    id='imageInput'
                    accept='image/png, image/jpeg'
                    onChange={handleUpload}
                    multiple
                  />
                  {uploadImage.map((i, index) => {
                    return (
                      <ImageEditModal
                        src={i}
                        key={index}
                        index={index}
                        size={'150px'}
                        removeHandle={removeImage}
                      />
                    )
                  })}
                </Grid>
              </Box>
            </ModalBody>
            <ModalFooter>
              <HStack w='100%' justifyContent={'space-between'}>
                <Button
                  colorScheme='red'
                  onClick={() => {
                    handleReset()
                    onClose()
                  }}
                >
                  ยกเลิก
                </Button>
                <Button onClick={handleReset}>เคลียร์</Button>
                <Button colorScheme='green' type='submit' isLoading={isLoading}>
                  บันทึก
                </Button>
                {/* <ButtonResponsive
                  label={'บันทึก'}
                  colorScheme='btn'
                  type='submit'
                  isLoading={isLoading}
                /> */}
              </HStack>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Box>
  )
}
