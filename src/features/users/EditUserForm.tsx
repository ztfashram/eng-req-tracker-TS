import { useState, useEffect } from 'react'
import { useUpdateUserMutation, useDeleteUserMutation, User } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import { SaveOutlined, DeleteOutlineOutlined } from '@mui/icons-material'
import {
    Box,
    Typography,
    Grid,
    TextField,
    FormControlLabel,
    Checkbox,
    Button,
    FormGroup,
    FormLabel,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogActions,
    useTheme,
} from '@mui/material'
import { CustomError } from '../../app/api/apiSlice'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,20}$/
const PWD_REGEX = /^[A-Za-z0-9!@#$%^&*)(+=._-]{3,20}$/

type EditUserFormProps = {
    user: User
}

export interface RolesStatusMap extends Record<typeof ROLES[number], boolean> {}

const EditUserForm = ({ user }: EditUserFormProps) => {
    const [updateUser, { isLoading, isSuccess, isError, error }] = useUpdateUserMutation()
    const [deleteUser, { isSuccess: isDelSuccess, isError: isDelError, error: delError }] = useDeleteUserMutation()

    const navigate = useNavigate()
    const theme = useTheme()

    const [username, setUsername] = useState(user.username)
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)
    const [active, setActive] = useState(user.active)

    const rolesInitialState = ROLES.reduce((obj: RolesStatusMap, role) => {
        obj[role] = user.roles.includes(role)
        return obj
    }, {})
    const [selectRoles, setSelectRoles] = useState(rolesInitialState)
    const { Sales, Engineer, Admin } = selectRoles

    const [open, setOpen] = useState(false)

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess || isDelSuccess) {
            setUsername('')
            setPassword('')
            setSelectRoles(rolesInitialState)
            navigate('/users')
        }
    }, [isSuccess, isDelSuccess, navigate])

    const onActiveChanged = () => setActive((prev) => !prev)

    const roles = Object.keys(selectRoles).filter((key) => selectRoles[key] === true)

    let canSave: boolean
    if (password) {
        canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading
    } else {
        canSave = [roles.length, validUsername].every(Boolean) && !isLoading
    }

    const onRolesChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSelectRoles({
            ...selectRoles,
            [e.target.name]: e.target.checked,
        })
    }

    const onSaveUserClicked = async (
        e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()

        if (password) {
            await updateUser({
                id: user.id,
                username,
                password,
                roles,
                active,
            })
        } else {
            await updateUser({ id: user.id, username, roles, active })
        }
    }

    const onDeleteUserConfirmed = async () => {
        setOpen(false)
        await deleteUser({ id: user.id })
    }

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
                    sx={{
                        fontWeight: 'bold',
                        mb: '0.5rem',
                        fontSize: '1.5rem',
                    }}
                >
                    {((error as CustomError)?.data?.message ||
                        (delError as CustomError)?.data?.message ||
                        (error as CustomError)?.status) ??
                        ''}
                </Typography>
                <Typography component='h3' variant='h3' mb='20px'>
                    Edit User
                </Typography>
                <Box
                    component='form'
                    onSubmit={onSaveUserClicked}
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
                            <TextField
                                required
                                fullWidth
                                error={!validUsername}
                                helperText=''
                                id='username'
                                label='Username'
                                name='username'
                                sx={{
                                    '& fieldset': {
                                        borderRadius: '25px',
                                    },
                                }}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                required
                                fullWidth
                                error={!validPassword}
                                name='password'
                                label='Password'
                                type='password'
                                id='password'
                                sx={{
                                    '& fieldset': {
                                        borderRadius: '25px',
                                    },
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={active}
                                        onChange={onActiveChanged}
                                        name='Active'
                                        sx={{
                                            '& .MuiSvgIcon-root': {
                                                fontSize: 28,
                                                color: theme.palette.primary.main,
                                            },
                                        }}
                                    />
                                }
                                label={<Typography variant='h4'>Active</Typography>}
                            />
                        </Grid>
                        <Grid item xs={12} container direction='column' justifyContent='center' alignItems='center'>
                            <FormLabel component='legend' sx={{ fontSize: '1.25rem' }}>
                                ASSIGNED ROLES
                            </FormLabel>
                            <FormGroup>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={Sales}
                                            onChange={onRolesChanged}
                                            name='Sales'
                                            sx={{
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 28,
                                                    color: theme.palette.primary.main,
                                                },
                                            }}
                                        />
                                    }
                                    label={<Typography variant='h4'>Sales</Typography>}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={Engineer}
                                            onChange={onRolesChanged}
                                            name='Engineer'
                                            sx={{
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 28,
                                                    color: theme.palette.primary.main,
                                                },
                                            }}
                                        />
                                    }
                                    label={<Typography variant='h4'>Engineer</Typography>}
                                />
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={Admin}
                                            onChange={onRolesChanged}
                                            name='Admin'
                                            sx={{
                                                '& .MuiSvgIcon-root': {
                                                    fontSize: 28,
                                                    color: theme.palette.primary.main,
                                                },
                                            }}
                                        />
                                    }
                                    label={<Typography variant='h4'>Admin</Typography>}
                                />
                            </FormGroup>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} container direction='row' justifyContent='center' alignItems='center'>
                        <Button
                            type='submit'
                            variant='contained'
                            color='secondary'
                            disabled={!canSave}
                            onClick={onSaveUserClicked}
                            sx={{
                                paddingRight: '1.5rem',
                                m: 'auto',
                                height: '50px',
                                fontSize: '1rem',
                                borderRadius: '25px',
                            }}
                        >
                            <SaveOutlined sx={{ m: 1 }} />
                            Save User
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
                            Delete User
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
                                <DialogContentText id='alert-dialog-description'>Delete this user?</DialogContentText>
                            </DialogContent>
                            <DialogActions>
                                <Button onClick={() => setOpen(false)}>No</Button>
                                <Button onClick={onDeleteUserConfirmed} autoFocus>
                                    Yes
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Grid>
                </Box>
            </Box>
        </Box>
    )
}

export default EditUserForm
