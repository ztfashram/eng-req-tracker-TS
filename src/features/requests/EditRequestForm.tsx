import { useState, useEffect } from 'react'
import { useUpdateRequestMutation, useDeleteRequestMutation } from './requestsApiSlice'
import { useNavigate } from 'react-router-dom'
import { REQTYPES } from '../../config/requestTypes'
import { SaveOutlined, DeleteOutlineOutlined } from '@mui/icons-material'
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    MenuItem,
    InputLabel,
    Select,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    FormControlLabel,
    Checkbox,
    useTheme,
} from '@mui/material'
import { User } from '../users/usersApiSlice'
import { Request } from './requestsApiSlice'
import { CustomError } from '../../app/api/apiSlice'

type EditRequestFormProps = {
    request: Request
    users: User[]
}

const EditRequestForm = ({ request, users }: EditRequestFormProps) => {
    const [updateRequest, { isLoading, isSuccess, isError, error }] = useUpdateRequestMutation()
    const [deleteRequest, { isSuccess: isDelSuccess, isError: isDelError, error: delError }] =
        useDeleteRequestMutation()
    const navigate = useNavigate()
    const theme = useTheme()

    const [title, setTitle] = useState(request.title)
    const [text, setText] = useState(request.text)
    const [owner, setOwner] = useState(request.owner)
    const [type, setType] = useState(request.type)
    const [customer, setCustomer] = useState(request.customer)
    const [completed, setCompleted] = useState(request.completed)

    const [open, setOpen] = useState(false)

    const created = new Date(request.createdAt).toLocaleString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    })
    const updated = new Date(request.updatedAt).toLocaleString('en-AU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
    })

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setOwner('')
            setType('')
            setCustomer('')
            setTitle('')
            setText('')
            navigate('/requests')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const canSave = [title, owner, type, customer].every(Boolean) && !isLoading

    const onSaveRequestClicked = async (
        e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        if (canSave) {
            await updateRequest({ id: request.id, owner: owner, type, customer, title, text, completed })
        }
    }

    const onDeleteRequestConfirmed = async () => {
        await deleteRequest({ id: request.id })
    }

    const typeOptions = REQTYPES.map((type) => {
        return (
            <MenuItem value={type} key={type}>
                {type}
            </MenuItem>
        )
    })

    const userOptions = users.map((user) => {
        // console.log(user)
        return (
            <MenuItem value={user.id} key={user.username}>
                {user.username}
            </MenuItem>
        )
    })

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    background: theme.palette.background.paper,
                    width: '80%',
                    maxWidth: '600px',
                    margin: '10px 10px 0 10px',
                    padding: '20px 50px',
                    borderRadius: '20px',
                    alignContent: 'center',
                }}
            >
                <Typography
                    className={isError || isDelError ? 'errMsg' : 'offscreen'}
                    sx={{ fontWeight: 'bold', mb: '0.5rem', fontSize: '1.5rem' }}
                >
                    {((error as CustomError)?.data?.message ||
                        (delError as CustomError)?.data?.message ||
                        (error as CustomError)?.status) ??
                        ''}
                </Typography>
                <Typography component='h3' variant='h3' mb='20px'>
                    Edit Request
                </Typography>
                <Box
                    component='form'
                    onSubmit={onSaveRequestClicked}
                    sx={{
                        '& .MuiFormLabel-root': {
                            color: theme.palette.text.primary,
                        },
                        '& .Mui-focused': {
                            color: `${theme.palette.text.primary} !important`,
                        },
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <InputLabel id='request-type-label' required>
                                Request Type
                            </InputLabel>
                            <Select
                                required
                                fullWidth
                                id='request-type'
                                value={type}
                                label='Request Type'
                                onChange={(e) => setType(e.target.value)}
                                sx={{
                                    '& fieldset': {
                                        borderRadius: '25px',
                                    },
                                }}
                            >
                                {typeOptions}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                helperText=''
                                id='title'
                                label='Title'
                                name='title'
                                sx={{
                                    '& fieldset': {
                                        borderRadius: '25px',
                                    },
                                }}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name='text'
                                label='Text'
                                id='text'
                                multiline
                                rows={4}
                                sx={{
                                    '& fieldset': {
                                        borderRadius: '25px',
                                    },
                                }}
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                helperText=''
                                id='customer'
                                label='Customer'
                                name='customer'
                                sx={{
                                    '& fieldset': {
                                        borderRadius: '25px',
                                    },
                                }}
                                value={customer}
                                onChange={(e) => setCustomer(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <InputLabel id='user-label'>ASSIGNED TO: </InputLabel>
                            <Select
                                required
                                fullWidth
                                id='owner'
                                // defaultValue={request.owner}
                                value={owner}
                                label='Assigned to'
                                onChange={(e) => setOwner(e.target.value)}
                                sx={{
                                    '& fieldset': {
                                        borderRadius: '25px',
                                    },
                                }}
                            >
                                {userOptions}
                            </Select>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={completed}
                                    onChange={() => setCompleted(!completed)}
                                    name='completed'
                                    sx={{
                                        '& .MuiSvgIcon-root': {
                                            fontSize: 28,
                                            color: theme.palette.primary.main,
                                        },
                                    }}
                                />
                            }
                            label={
                                <Typography variant='h4' ml='0.25rem'>
                                    REQUEST COMPLETED
                                </Typography>
                            }
                        />
                    </Grid>
                    <Grid item xs={12} container direction='row' justifyContent='center' alignItems='center' mt='1rem'>
                        <Button
                            variant='contained'
                            color='secondary'
                            disabled={!canSave}
                            onClick={onSaveRequestClicked}
                            sx={{
                                paddingRight: '1.5rem',
                                m: 'auto',
                                height: '50px',
                                fontSize: '1rem',
                                borderRadius: '25px',
                            }}
                        >
                            <SaveOutlined sx={{ m: 1 }} />
                            Save Request
                        </Button>
                        <Button
                            variant='contained'
                            color='warning'
                            onClick={() => setOpen(true)}
                            sx={{
                                paddingRight: '1.5rem',
                                m: 'auto',
                                height: '50px',
                                fontSize: '1rem',
                                borderRadius: '25px',
                            }}
                        >
                            <DeleteOutlineOutlined sx={{ m: 0.5 }} />
                            Delete Request
                        </Button>
                        <Dialog
                            open={open}
                            onClose={() => setOpen(true)}
                            sx={{
                                '& .MuiDialogContentText-root': {
                                    color: theme.palette.text.primary,
                                },
                            }}
                        >
                            <DialogContent>
                                <DialogContentText id='alert-dialog-description'>
                                    Delete this request?
                                </DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpen(false)}>No</Button>
                                <Button onClick={onDeleteRequestConfirmed} autoFocus>
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                    <Grid
                        item
                        xs={12}
                        container
                        direction='column'
                        justifyContent='center'
                        alignItems='center'
                        mt='1rem'
                    >
                        <Typography>Created: {created}</Typography>
                        <Typography>Updated: {updated}</Typography>
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default EditRequestForm
