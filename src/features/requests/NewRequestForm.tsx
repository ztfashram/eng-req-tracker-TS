import { useState, useEffect } from 'react'
import { useAddNewRequestMutation } from './requestsApiSlice'
import { useNavigate } from 'react-router-dom'
import { REQTYPES } from '../../config/requestTypes'
import { SaveOutlined } from '@mui/icons-material'
import { Box, Typography, Grid, TextField, Button, MenuItem, InputLabel, Select, useTheme } from '@mui/material'
import useAuth from '../../hooks/useAuth'
import { User } from '../users/usersApiSlice'
import { CustomError } from '../../app/api/apiSlice'

type NewRequestFormProps = {
	users: User[]
}

const NewRequestForm = ({ users }: NewRequestFormProps) => {
	const { userId } = useAuth()
	const [addNewRequest, { isLoading, isSuccess, isError, error }] = useAddNewRequestMutation()
	const navigate = useNavigate()
	const theme = useTheme()

	const [title, setTitle] = useState('')
	const [text, setText] = useState('')
	const [ownerId, setOwnerId] = useState('')
	const [type, setType] = useState('')
	const [customer, setCustomer] = useState('')

	useEffect(() => {
		if (isSuccess) {
			setOwnerId('')
			setType('')
			setCustomer('')
			setTitle('')
			setText('')
			navigate('/requests')
		}
	}, [isSuccess, navigate])

	const canSave = [title, ownerId, type, customer].every(Boolean) && !isLoading

	const onSaveRequestClicked = async (
		e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		e.preventDefault()
		if (canSave) {
			console.log(userId, ownerId, type, customer, title, text)
			await addNewRequest({ requester: userId, owner: ownerId, type, customer, title, text })
		}
	}

	const typeOptions = REQTYPES.map((type) => {
		return (
			<MenuItem value={type} key={type}>
				{type}
			</MenuItem>
		)
	})

	const userOptions = users.map((user) => {
		return (
			<MenuItem value={user.id} key={user.id}>
				{user.username}
			</MenuItem>
		)
	})

	return (
		<Box
			sx={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center'
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
					alignContent: 'center'
				}}
			>
				<Typography
					className={isError ? 'errMsg' : 'offscreen'}
					sx={{ fontWeight: 'bold', mb: '0.5rem', fontSize: '1.5rem' }}
				>
					{((error as CustomError)?.data?.message || (error as CustomError)?.status) ?? ''}
				</Typography>
				<Typography component='h3' variant='h3' mb='20px'>
					New Request
				</Typography>
				<Box
					component='form'
					onSubmit={onSaveRequestClicked}
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
										borderRadius: '25px'
									}
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
										borderRadius: '25px'
									}
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
										borderRadius: '25px'
									}
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
										borderRadius: '25px'
									}
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
								value={ownerId}
								label='Assigned to'
								onChange={(e) => setOwnerId(e.target.value)}
								sx={{
									'& fieldset': {
										borderRadius: '25px'
									}
								}}
							>
								{userOptions}
							</Select>
						</Grid>
					</Grid>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						color='secondary'
						disabled={!canSave}
						onClick={onSaveRequestClicked}
						sx={{
							mt: 3,
							mb: 2,
							height: '50px',
							fontSize: '1rem',
							borderRadius: '25px'
						}}
					>
						<SaveOutlined sx={{ m: 1 }} />
						Submit
					</Button>
				</Box>
			</Box>
		</Box>
	)
}

export default NewRequestForm
