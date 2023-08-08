/* eslint-disable react/prop-types */
import { Text, VStack } from '@chakra-ui/react'
import { AiOutlinePlus } from 'react-icons/ai'
import { MdUpload } from 'react-icons/md'

export default function UploadLabel(props) {
  return (
    <VStack
      border='1px solid rgba(0,0,0,0.4)'
      borderRadius={'16px'}
      w={props.size || '200px'}
      h={props.size || '200px'}
      justify={'center'}
      cursor={'pointer'}
      color='#448c46'
    >
      <Text fontSize={'3rem'} fontWeight='bold'>
        {props.count > 0 ? <AiOutlinePlus /> : <MdUpload />}
      </Text>
      <Text fontWeight={'bold'}>คลิกเพื่ออัพโหลดไฟล์</Text>
      <Text color='#8F9BBA' fontSize={'0.7rem'}>
        PNG, JPG are Allowed
      </Text>
    </VStack>
  )
}
