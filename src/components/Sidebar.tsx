import {
    Box,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography,
    useTheme,
    Divider,
} from '@mui/material'
import {
    HomeOutlined,
    EventNoteOutlined,
    NoteAddOutlined,
    SupervisorAccountOutlined,
    ChevronLeft,
    ChevronRightOutlined,
    LogoutOutlined,
} from '@mui/icons-material'
import { ReactNode, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useSendLogoutMutation } from '../features/auth/authApiSlice'
import useAuth from '../hooks/useAuth'

const navItems = [
    { text: 'Home', icon: <HomeOutlined /> },
    { text: 'New Request', icon: <NoteAddOutlined /> },
    { text: 'Requests', icon: <EventNoteOutlined /> },
    { text: 'Manage Users', icon: <SupervisorAccountOutlined /> },
    // { text: 'User', icon: <PersonOutlineOutlined /> },
]

type SideBarProps = {
    drawerWidth: string
    isSidebarOpen: boolean
    setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>
    isNonMobile: boolean
}

const Sidebar = ({ drawerWidth, isSidebarOpen, setIsSidebarOpen, isNonMobile }: SideBarProps) => {
    const { username, status, isEngineer, isAdmin } = useAuth()

    const { pathname } = useLocation()
    const [active, setActive] = useState('')
    const navigate = useNavigate()
    const theme = useTheme()

    const [sendLogout, { isLoading, isSuccess, isError, error }] = useSendLogoutMutation()

    useEffect(() => {
        if (pathname.substring(1) === 'users') {
            setActive('manage users')
        } else if (pathname.substring(10) === 'new') {
            setActive('new request')
        } else setActive(pathname.substring(1))
    }, [pathname])

    useEffect(() => {
        if (isSuccess) navigate('/login')
    }, [isSuccess, navigate])

    const SidebarListItem = (text: string, icon: ReactNode) => {
        const lcText = text.toLowerCase()
        return (
            <ListItem key={text} disablePadding>
                <ListItemButton
                    onClick={() => {
                        setActive(lcText)
                        if (lcText === 'manage users') {
                            navigate('/users')
                        } else if (lcText === 'new request') {
                            navigate('/requests/new')
                        } else navigate(`/${lcText}`)
                    }}
                    sx={{
                        backgroundColor: active === lcText ? theme.palette.custom.highlight : 'transparent',
                    }}
                >
                    <ListItemIcon
                        sx={{
                            ml: '1rem',
                        }}
                    >
                        {icon}
                    </ListItemIcon>
                    <ListItemText primary={text} />
                    {active === lcText && (
                        <ChevronRightOutlined
                            sx={{
                                ml: 'auto',
                                color: theme.palette.text.primary,
                            }}
                        />
                    )}
                </ListItemButton>
            </ListItem>
        )
    }

    return (
        <Box component='nav'>
            {isSidebarOpen && (
                <Drawer
                    open={isSidebarOpen}
                    anchor='left'
                    onClose={() => setIsSidebarOpen(false)}
                    variant='persistent'
                    sx={{
                        width: drawerWidth,
                        '& .MuiDrawer-paper': {
                            color: theme.palette.text.primary,
                            backgroundColor: theme.palette.background.paper,
                            boxSizing: 'border-box',
                            borderWidth: isNonMobile ? 0 : '2px',
                            width: drawerWidth,
                        },
                    }}
                >
                    <Box width='100%'>
                        <Box m='1.5rem 2rem 2rem 2.5rem'>
                            <Box display='flex' justifyContent='space-between' alignItems='center'>
                                <Typography
                                    variant='h4'
                                    fontWeight='bold'
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color:
                                            theme.palette.mode === 'dark'
                                                ? theme.palette.secondary.light
                                                : theme.palette.secondary.main,
                                    }}
                                >
                                    ER.TRACKER
                                </Typography>
                                {!isNonMobile && (
                                    <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                                        <ChevronLeft />
                                    </IconButton>
                                )}
                            </Box>
                        </Box>
                        <List>
                            {navItems.map(({ text, icon }) => {
                                if (text === 'Manage Users') {
                                    return isAdmin && SidebarListItem(text, icon)
                                } else {
                                    return SidebarListItem(text, icon)
                                }
                            })}
                        </List>

                        <Divider />
                        <List>
                            {/* List pros deleted: position='absolute' bottom='2rem' */}
                            <ListItem key='logout' disablePadding>
                                <ListItemButton onClick={sendLogout}>
                                    <ListItemIcon
                                        sx={{
                                            ml: '1rem',
                                        }}
                                    >
                                        <LogoutOutlined />
                                    </ListItemIcon>
                                    <ListItemText primary={username === '' ? 'Log in' : 'Log out'} />
                                </ListItemButton>
                            </ListItem>
                        </List>
                    </Box>
                </Drawer>
            )}
        </Box>
    )
}

export default Sidebar
