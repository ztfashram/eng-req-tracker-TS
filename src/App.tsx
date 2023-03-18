import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider } from '@mui/material'
import { createTheme, Theme } from '@mui/material/styles'
import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { themeSettings } from './components/theme'
import Layout from './components/Layout'
import Login from './features/auth/Login'
import Home from './components/Home'
import UsersList from './features/users/UsersList'
import EditUser from './features/users/EditUser'
import NewUserForm from './features/users/NewUserForm'
import RequestsList from './features/requests/RequestsList'
import EditRequest from './features/requests/EditRequest'
import NewRequest from './features/requests/NewRequest'
import Prefetch from './features/auth/Prefetch'
import PersistLogin from './features/auth/PersistLogin'
import RequireAuth from './features/auth/RequireAuth'
import { ROLES } from './config/roles'
import { RootState } from './app/store'

function App() {
	const mode = useSelector((state: RootState) => state.colorMode.mode)
	const theme: Theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
	return (
		<div className='app'>
			<Router>
				<ThemeProvider theme={theme}>
					<CssBaseline />
					<Routes>
						<Route index path='login' element={<Login />} />
						<Route path='/' element={<Layout />}>
							{/* Protected Routes */}
							<Route element={<PersistLogin />}>
								<Route element={<RequireAuth allowedRoles={[...ROLES]} />}>
									<Route element={<Prefetch />}>
										<Route index element={<Navigate to='/home' />} />
										<Route path='home' element={<Home />} />
										<Route element={<RequireAuth allowedRoles={['Admin']} />}>
											<Route path='users'>
												<Route index element={<UsersList />} />
												<Route path=':id' element={<EditUser />} />
												<Route path='new' element={<NewUserForm />} />
											</Route>
										</Route>
										<Route path='requests'>
											<Route index element={<RequestsList />} />
											<Route path=':id' element={<EditRequest />} />
											<Route path='new' element={<NewRequest />} />
										</Route>
									</Route>
								</Route>
							</Route>
							{/* End Protected Routes */}
						</Route>
					</Routes>
				</ThemeProvider>
			</Router>
		</div>
	)
}

export default App
