/* eslint-disable react-hooks/exhaustive-deps */
import { SearchIcon } from '@chakra-ui/icons'
import {
  Box,
  Button,
  Center,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Spinner,
} from '@chakra-ui/react'
import CustomTable from './Components/customTableTicket'
import axios from 'axios'
import { search } from 'ss-search'
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AiOutlineReload } from 'react-icons/ai'
import { useTicketContext } from './TicketContext/TicketContext'

function TicketList() {
  const [refresh, setRefresh] = useState(false)
  const [projects, setProjects] = useState([])
  const [filterProject, setFilterProject] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const { control, watch } = useForm()
  const { firebaseId } = useTicketContext()
  const columnsHeader = [
    {
      Header: 'No.',
      accessor: 'ref',
    },
    {
      Header: 'ปัญหา',
      accessor: 'title',
    },
    {
      Header:"วันที่แจ้ง",
      accessor:"createAt",
    },
    { Header: 'รายละเอียด', accessor: 'detail' },
    {
      Header: 'สถานะ',
      accessor: 'RepStatus',
    },
  ]
  const fetchProject = async () => {
    setIsFetching(true)
    if (firebaseId !== undefined) {

      await axios
        .post(
          'https://us-central1-crafting-ticket-dev.cloudfunctions.net/getReport_v2',
          { firebaseID: firebaseId }
        )
        .then((res) => {

          // console.clear()
          // // console.log(firebaseId)
          // console.log(res.data)
          setProjects(res.data)
          setFilterProject(res.data)
        })
    }
    setIsFetching(false)

  }

  useEffect(() => {
    fetchProject()
  }, [refresh, firebaseId])

  const statusFilter = watch('statusFilter') || ''
  const searchRef = watch('searchRef') || ''

  useEffect(() => {
    onSearch()
  }, [statusFilter, searchRef])

  const onSearch = () => {
    const searchField = ['ref', 'title', 'RepStatus']
    const value = searchRef + ' ' + statusFilter
    const result = search(projects, searchField, value)
    setFilterProject(result)
  }

  return (
    <Box p='1rem'>
      <Heading fontFamily={'inherit'} textAlign={'center'}>
        การแจ้งปัญหา
      </Heading>
      <HStack
        my='1em'
        alignItems={'center'}
        spacing={{ base: '0px', sm: '0px', md: '10px' }}
        p={{ sm: '0px', md: '20px 20px 30px 20px' }}
        background={{ sm: 'none', md: '#FFFFFF' }}
        // border='1px solid black'
        boxShadow={{
          sm: '0px',
          md: '14px 17px 40px 4px rgba(112, 144, 176, 0.08)',
        }}
        borderRadius={{ sm: '10px', md: '30px' }}
        justifyContent='flex-start'
        flexDirection={{
          base: 'column',
          sm: 'column',
          md: 'row',
          lg: 'row',
        }}
        w='100%'
      >
        <Controller
          name='searchRef'
          control={control}
          defaultValue={''}
          render={({ field }) => (
            <InputGroup w={{ base: '100%', md: '220px', lg: '250px' }} >
              <InputLeftElement>
                <IconButton
                  bg='inherit'
                  borderRadius='inherit'
                  _hover='none'
                  _active={{
                    bg: 'inherit',
                    transform: 'none',
                    borderColor: 'transparent',
                  }}
                  _focus={{
                    boxShadow: 'none',
                  }}
                  icon={<SearchIcon color={'gray.700'} w='15px' h='15px' />}
                ></IconButton>
              </InputLeftElement>
              <Input
                variant='search'
                fontSize='sm'
                border="1px solid rgb(0,0,0,0.2)"
                bg={'secondaryGray.300'}
                color={'gray.700'}
                fontWeight='500'
                _placeholder={{
                  color: 'gray.400',
                  fontSize: '14px',
                  opacity: 1,
                }}
                borderRadius={'30px'}
                placeholder={'ค้นหาจากรหัสอ้างอิง, ชื่อปัญหา'}
                {...field}
              />
            </InputGroup>
          )}
        />
        <Controller
          name='statusFilter'
          defaultValue={''}
          control={control}
          render={({ field }) => (
            <Box w={{ base: '100%', md: 'fit-content' }}>
              <Select
                {...field}
                pt={{ base: '15px', sm: '15px', md: '0rem' }}
                w={{ base: '100%', md: '250px' }}
                // h='44px'
                // maxh='44px'
                variant='search'
                // border={{
                //   base: '1px solid #E8E9E9',
                //   sm: '1px solid #E8E9E9',
                //   md: '0px',
                // }}
                border="1px solid rgb(0,0,0,0.2)"
                bg={{
                  base: 'white',
                  sm: 'white',
                  md: 'secondaryGray.300',
                }}
                fontSize='sm'
                color={'gray.700'}
                fontWeight='500'
                _placeholder={{
                  color: 'gray.400',
                  fontSize: '14px',
                  opacity: 1,
                }}
                borderRadius={{
                  base: '10px',
                  sm: '10px',
                  md: '30px',
                  lg: '30px',
                }}
              >
                <option value=''>สถานะทั้งหมด</option>
                <option value='รอรับเรื่อง'>รอรับเรื่อง</option>
                <option value='กำลังดำเนินการ'>กำลังดำเนินการ</option>
                <option value='เสร็จสิ้น'>เสร็จสิ้น</option>
                <option value='ยกเลิก'>ยกเลิก</option>
              </Select>
            </Box>
          )}
        />
        <Button
          onClick={() => setRefresh(!refresh)}
          bg='#4C7BF4'
          color='#fff'
          isLoading={isFetching}
        >
          <AiOutlineReload />
        </Button>
      </HStack>
      {!isFetching ? (
        <Box>
          <CustomTable
            columnsData={columnsHeader}
            tableData={filterProject}
            disabledSearch={true}
          />
        </Box>
      ) : (
        <Center>
          <Spinner size={'lg'} />
        </Center>
      )}
    </Box>
  )
}

export default TicketList
