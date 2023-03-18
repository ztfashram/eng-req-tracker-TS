import { useState } from 'react'
import { useGetRequestsQuery } from './requestsApiSlice'
import { Box, IconButton, Typography, useTheme, CircularProgress } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { EditOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import { CustomError } from '../../app/api/apiSlice'
import { Request } from './requestsApiSlice'

const RequestsList = () => {
    const { username, isAdmin, isEngineer } = useAuth()
    const { data, isLoading, isSuccess, isError, error } = useGetRequestsQuery('requestsList', {
        pollingInterval: 15000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })

    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState(20)
    const theme = useTheme()

    const columns: GridColDef[] = [
        {
            field: 'completed',
            headerName: 'completed',
            type: 'boolean',
            flex: 0.4,
        },
        {
            field: 'created',
            headerName: 'Created',
            flex: 0.7,
            renderCell: (params) =>
                new Date(params.row.createdAt).toLocaleString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }),
        },
        {
            field: 'updated',
            headerName: 'Updated',
            flex: 0.7,
            renderCell: (params) =>
                new Date(params.row.updatedAt).toLocaleString('en-AU', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                }),
        },
        {
            field: 'title',
            headerName: 'Title',
            flex: 1,
            sortable: false,
        },
        {
            field: 'ownername',
            headerName: 'Owner',
            flex: 0.5,
        },
        {
            field: 'customer',
            headerName: 'Customer',
            flex: 1,
        },
        {
            field: 'edit',
            headerName: 'Edit',
            flex: 0.5,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {
                        navigate(`/requests/${params.row._id}`)
                    }}
                >
                    <EditOutlined />
                </IconButton>
            ),
        },
    ]

    let content
    if (isLoading) {
        content = (
            <CircularProgress
                sx={{
                    margin: 'auto',
                    align: 'center',
                    width: '100%',
                }}
            />
        )
    }
    if (isError) {
        content = (
            <Typography className='errMsg' variant='h4'>
                {(error as CustomError)?.data?.message || (error as CustomError)?.status}
            </Typography>
        )
    }
    if (isSuccess) {
        const { ids, entities } = data
        // provide sorted requests because Object.values doesn't gurantee the result has the original order
        const requests = (Object.values(entities) as Request[])
            .filter((request) => request != undefined)
            .sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1))

        let filteredRequests
        if (isAdmin) {
            filteredRequests = [...requests]
        } else if (isEngineer) {
            filteredRequests = requests.filter((request) => request.ownername === username)
        } else {
            filteredRequests = requests.filter((request) => request.requestername === username)
        }

        const tableContent = ids?.length ? filteredRequests : []
        content = (
            <Box
                m='20px 10px 0 10px'
                height='80vh'
                width='100%'
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        borderBottom: 'solid 2px',
                    },
                }}
            >
                <DataGrid
                    rows={tableContent}
                    columns={columns}
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 20]}
                    onPageSizeChange={(pageSize) => setPageSize(pageSize)}
                    sx={{
                        '& .MuiDataGrid-booleanCell': {
                            color: `${theme.palette.text.primary} !important`,
                        },
                    }}
                />
            </Box>
        )
    }
    return (
        <Box
            sx={{
                background: theme.palette.background.paper,
                margin: '10px 10px 0 10px',
                paddingBottom: '20px',
                borderRadius: '20px',
            }}
        >
            <Typography variant='h4' component='h4' pt='15px' align='center'>
                Requests List
            </Typography>
            <Box display='flex' justifyContent='center' alignItems='center'>
                {content}
            </Box>
        </Box>
    )
}

export default RequestsList
