import { useState, useEffect } from 'react'
import { useAddNewUserMutation } from './usersApiSlice'
import { useNavigate } from 'react-router-dom'
import { ROLES } from '../../config/roles'
import { SaveOutlined } from '@mui/icons-material'
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
    useTheme,
} from '@mui/material'
import { RolesStatusMap } from './EditUserForm'
import { CustomError } from '../../app/api/apiSlice'

const USER_REGEX = /^[A-z][A-z0-9-_]{3,20}$/
const PWD_REGEX = /^[A-Za-z0-9!@#$%^&*)(+=._-]{3,20}$/

const NewUserForm = () => {
    const [addNewUser, { isLoading, isSuccess, isError, error }] = useAddNewUserMutation()
    const navigate = useNavigate()
    const theme = useTheme()

    const [username, setUsername] = useState('')
    const [validUsername, setValidUsername] = useState(false)
    const [password, setPassword] = useState('')
    const [validPassword, setValidPassword] = useState(false)

    const rolesInitialState = ROLES.reduce((obj: RolesStatusMap, role) => {
        obj[role] = false
        return obj
    }, {})

    const [selectRoles, setSelectRoles] = useState(rolesInitialState)
    const { Sales, Engineer, Admin } = selectRoles

    useEffect(() => {
        setValidUsername(USER_REGEX.test(username))
    }, [username])

    useEffect(() => {
        setValidPassword(PWD_REGEX.test(password))
    }, [password])

    useEffect(() => {
        if (isSuccess) {
            setUsername('')
            setPassword('')
            setSelectRoles(rolesInitialState)
            navigate('/users')
        }
    }, [isSuccess, navigate])

    const roles = Object.keys(selectRoles).filter((key) => selectRoles[key] === true)
    const canSave = [roles.length, validUsername, validPassword].every(Boolean) && !isLoading

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

        if (canSave) {
            await addNewUser({ username, password, roles })
        }
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
                    className={isError ? 'errMsg' : 'offscreen'}
                    sx={{ fontWeight: 'bold', mb: '0.5rem', fontSize: '1.5rem' }}
                >
                    {((error as CustomError)?.data?.message || (error as CustomError)?.status) ?? ''}
                </Typography>
                <Typography component='h3' variant='h3' mb='20px'>
                    New User
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
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
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
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
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
                                            sx={{ '& .MuiSvgIcon-root': { fontSize: 28 } }}
                                        />
                                    }
                                    label={<Typography variant='h4'>Admin</Typography>}
                                />
                            </FormGroup>
                        </Grid>
                    </Grid>
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='secondary'
                        disabled={!canSave}
                        onClick={onSaveUserClicked}
                        sx={{
                            mt: 3,
                            mb: 2,
                            height: '50px',
                            fontSize: '1rem',
                            borderRadius: '25px',
                        }}
                    >
                        <SaveOutlined sx={{ m: 1 }} />
                        Save User
                    </Button>
                </Box>
            </Box>
        </Box>
    )
}

export default NewUserForm
