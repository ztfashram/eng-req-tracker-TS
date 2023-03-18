import { AppBar, Box, IconButton, Menu, MenuItem, Toolbar, useTheme, Typography } from '@mui/material'
import { LightModeOutlined, DarkModeOutlined, Menu as MenuIcon, AccountCircleOutlined } from '@mui/icons-material'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { setMode } from '../features/colorModeSlice'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

type TopBarProps = {
    isSidebarOpen: boolean
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const Topbar = ({ isSidebarOpen, setIsSidebarOpen }: TopBarProps) => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const theme = useTheme()

    const { username } = useAuth()
    const formatUsername = username ? username.charAt(0).toUpperCase() + username.slice(1) : ''

    const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()

    useEffect(() => {
        if (isSuccess) navigate('/login')
    }, [isSuccess, navigate])

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)

    const handleOpenUserMenu = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorElUser(event.currentTarget)
    }
    const handleCloseUserMenu = () => {
        setAnchorElUser(null)
    }

    const handleLogout = () => {
        handleCloseUserMenu()
        sendLogout({})
    }

    const userMenuOptions =
        username === '' ? (
            <MenuItem onClick={() => navigate('/login')}>
                <Typography textAlign='center'>Log in</Typography>
            </MenuItem>
        ) : (
            <MenuItem onClick={handleLogout}>
                <Typography textAlign='center'>Logout</Typography>
            </MenuItem>
        )

    return (
        <AppBar
            sx={{
                position: 'static',
                background: theme.palette.background.default,
                boxShadow: 'none',
            }}
        >
            <Toolbar sx={{ justifyContent: 'space-between' }}>
                <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <MenuIcon />
                </IconButton>

                <Box display='flex' justifyContent='space-between' alignItems='center' gap='1.5rem'>
                    <IconButton onClick={() => dispatch(setMode())}>
                        {theme.palette.mode === 'dark' ? (
                            <LightModeOutlined sx={{ fontSize: '28px' }} />
                        ) : (
                            <DarkModeOutlined sx={{ fontSize: '28px' }} />
                        )}
                    </IconButton>
                    <Box sx={{ fontSize: '28px' }}>
                        <IconButton
                            onClick={handleOpenUserMenu}
                            sx={{ color: theme.palette.text.primary, fontSize: '20px' }}
                        >
                            <AccountCircleOutlined sx={{ fontSize: '30px', mr: '0.25rem' }} />
                            {formatUsername}
                        </IconButton>
                        <Menu
                            sx={{ mt: '35px' }}
                            id='menu-appbar'
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {userMenuOptions}
                        </Menu>
                    </Box>
                </Box>
            </Toolbar>
        </AppBar>
    )
}
export default Topbar
