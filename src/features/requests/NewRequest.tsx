import { CircularProgress } from '@mui/material'
import NewRequestForm from './NewRequestForm'
import { useGetUsersQuery, User } from '../users/usersApiSlice'

const NewRequest = () => {
	const { users } = useGetUsersQuery('usersList', {
		selectFromResult: ({ data }) => ({
			users: data?.ids.reduce((list: User[], id) => {
				const user = data?.entities[id]
				if (user && user.roles.includes('Engineer')) list.push(user)
				return list
			}, [])
		})
	})
	return users ? <NewRequestForm users={users} /> : <CircularProgress />
}

export default NewRequest
