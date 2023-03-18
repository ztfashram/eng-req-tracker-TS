import { store } from '../../app/store'
import { usersApiSlice } from '../users/usersApiSlice'
import { requestsApiSlice } from '../requests/requestsApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
	useEffect(() => {
		store.dispatch(requestsApiSlice.util.prefetch('getRequests', 'requestsList', { force: true }))
		store.dispatch(usersApiSlice.util.prefetch('getUsers', 'usersList', { force: true }))
	}, [])

	return <Outlet />
}

export default Prefetch
