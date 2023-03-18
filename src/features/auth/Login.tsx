import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setCredentials } from './authSlice'
import { useLoginMutation } from './authApiSlice'
import { Box, Typography, Grid, TextField, Button, FormControlLabel, Checkbox, useTheme } from '@mui/material'
import { SaveOutlined } from '@mui/icons-material'
import usePersist from '../../hooks/usePersist'

const Login = () => {
	const theme = useTheme()
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [errMsg, setErrMsg] = useState('')
	const [persist, setPersist] = usePersist() as [boolean, React.Dispatch<React.SetStateAction<boolean>>]

	const [login, { isLoading }] = useLoginMutation()

	useEffect(() => {
		setErrMsg('')
	}, [username, password])

	const handlePersist = () => setPersist((prev) => !prev)

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLElement>) => {
		e.preventDefault()

		try {
			const { accessToken } = await login({ username, password }).unwrap()
			dispatch(setCredentials({ accessToken }))
			// const roles = response?.data?.roles
			setUsername('')
			setPassword('')
			navigate('/home')
		} catch (err: any) {
			if (!err?.status) {
				setErrMsg('No Server Response')
			} else if (err.response?.status === 400) {
				setErrMsg('Missing Username or Password')
			} else if (err.response?.status === 401) {
				setErrMsg('Unauthorized')
			} else {
				setErrMsg(err.data?.message)
			}
		}
	}

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				height: '100vh',
				backgroundImage: 'url(/image/background.webp)',
				backgroundSize: 'cover'
			}}
		>
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					background: theme.palette.background.paper,
					maxWidth: '450px',
					margin: 'auto 20px',
					padding: '50px 50px',
					borderRadius: '20px',
					alignContent: 'center'
				}}
			>
				<Typography
					className={errMsg ? 'errMsg' : 'offscreen'}
					sx={{ fontWeight: 'bold', mb: '0.5rem', fontSize: '1.5rem' }}
				>
					{errMsg ?? ''}
				</Typography>
				<Typography component='h3' variant='h3' mb='20px'>
					Employee Login
				</Typography>
				<Box
					component='form'
					onSubmit={handleSubmit}
					sx={{
						'& .MuiFormLabel-root': {
							color: theme.palette.text.primary
						},
						'& .Mui-focused': {
							color: `${theme.palette.text.primary} !important`
						}
					}}
				>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								helperText=''
								autoFocus
								autoComplete='off'
								id='username'
								label='Username'
								name='username'
								sx={{
									'& fieldset': {
										borderRadius: '25px'
									},
									margin: '1rem 0 1rem 0'
								}}
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								required
								fullWidth
								autoComplete='off'
								name='password'
								label='Password'
								type='password'
								id='password'
								sx={{
									'& fieldset': {
										borderRadius: '25px'
									},
									margin: '1rem 0 1rem 0'
								}}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
						</Grid>
					</Grid>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='secondary'
						onClick={handleSubmit}
						sx={{
							mt: 3,
							mb: 2,
							height: '50px',
							fontSize: '1rem',
							borderRadius: '25px'
						}}
					>
						<SaveOutlined sx={{ m: 1 }} />
						Log in
					</Button>
					<Grid item xs={12}>
						<FormControlLabel
							control={<Checkbox />}
							label='Trust This Device'
							checked={persist}
							onChange={handlePersist}
							sx={{
								'& .MuiSvgIcon-root': {
									fontSize: 28,
									color: theme.palette.primary.main
								}
							}}
						/>
					</Grid>
				</Box>
			</Box>
		</Box>
	)
}

export default Login
