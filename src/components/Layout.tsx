import { Outlet } from 'react-router-dom'
import Topbar from './Topbar'
import Sidebar from './Sidebar'
import { Box, useMediaQuery } from '@mui/material'
import { useState } from 'react'

const Layout = () => {
    const isNonMobile = useMediaQuery('(min-width: 600px)')
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    return (
        <Box display={isNonMobile ? 'flex' : 'block'} width='100%' height='100%'>
            <Sidebar
                isNonMobile={isNonMobile}
                drawerWidth='220px'
                isSidebarOpen={isSidebarOpen}
                setIsSidebarOpen={setIsSidebarOpen}
            />
            <Box flexGrow={1}>
                <Topbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
                <Outlet />
            </Box>
        </Box>
    )
}

export default Layout
