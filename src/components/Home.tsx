import { Box, Typography } from '@mui/material'
import useAuth from '../hooks/useAuth'

const Home = () => {
	const { username, status } = useAuth()
	const formatUsername = username ? username.charAt(0).toUpperCase() + username.slice(1) : ''

	return (
		<Box
			sx={{
				// background: theme.palette.background.paper,
				margin: '2rem'
			}}
		>
			<Typography variant='h2' component='h2' align='left'>
				Welcome {formatUsername}
			</Typography>
		</Box>
	)
}

export default Home
