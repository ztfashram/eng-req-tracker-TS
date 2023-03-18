import { useGetUsersQuery } from './usersApiSlice'
import { useState } from 'react'
import { Box, IconButton, Typography, useTheme, Button, CircularProgress } from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { EditOutlined } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { CustomError } from '../../app/api/apiSlice'

const UsersList = () => {
    const { data, isLoading, isSuccess, isError, error } = useGetUsersQuery('usersList', {
        pollingInterval: 600000,
        refetchOnFocus: true,
        refetchOnMountOrArgChange: true,
    })
    const navigate = useNavigate()
    const [pageSize, setPageSize] = useState(20)
    const theme = useTheme()

    const columns: GridColDef[] = [
        {
            field: '_id',
            headerName: 'Id',
            flex: 1,
        },
        {
            field: 'username',
            headerName: 'Username',
            flex: 0.5,
        },
        {
            field: 'roles',
            headerName: 'Roles',
            flex: 1,
            renderCell: (params) => {
                const formatedRoles = params.row.roles.toString().replaceAll(',', ', ')
                return formatedRoles
            },
        },
        {
            field: 'active',
            headerName: 'Active',
            flex: 0.25,
            type: 'boolean',
        },
        {
            field: 'edit',
            headerName: 'Edit',
            flex: 0.5,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    onClick={() => {
                        navigate(`/users/${params.row._id}`)
                    }}
                >
                    <EditOutlined />
                </IconButton>
            ),
        },
    ]

    let content
    if (isLoading) content = <CircularProgress />
    if (isError) {
        content = (
            <Typography className='errMsg' variant='h4'>
                {(error as CustomError)?.data?.message || (error as CustomError)?.status}
            </Typography>
        )
    }
    if (isSuccess) {
        const { ids, entities } = data
        const tableContent = ids?.length ? Object.values(entities) : []
        content = (
            <Box
                m='30px 10px 0 10px'
                height='75vh'
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
                paddingTop: '20px',
                paddingBottom: '20px',
                borderRadius: '20px',
                alignContent: 'center',
            }}
        >
            <Box display='flex' justifyContent='space-between' alignItems='center'>
                <Box sx={{ width: '85px', Visibility: 'hidden', ml: '2rem' }} />
                <Typography variant='h4' component='h4' sx={{ align: 'center' }}>
                    Users List
                </Typography>
                <Button
                    size='large'
                    sx={{
                        backgroundColor: theme.palette.primary.main,
                        color: theme.palette.primary.contrastText,
                        align: 'center',
                        mr: '2rem',
                        '&:hover': {
                            backgroundColor: theme.palette.primary.light,
                        },
                    }}
                    onClick={() => navigate('/users/new')}
                >
                    Add Users
                </Button>
            </Box>
            <Box display='flex' justifyContent='center' alignItems='center'>
                {content}
            </Box>
        </Box>
    )
}

export default UsersList
