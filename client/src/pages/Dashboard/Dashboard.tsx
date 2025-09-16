import * as React from "react";
import Sheet from "@mui/joy/Sheet";
import Box from "@mui/joy/Box";
import { useMediaQuery } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import SidebarItems from "./SideNavBarItems";
import { Outlet, useNavigate } from "react-router-dom";
import Drawer from '@mui/joy/Drawer';
import AppBar from '../../components/AppBar';

export default function Dashboard() {
    const { isAuthenticated, currentUser } = useSelector(
        (state: RootState) => state.auth
    );
    
    const [open, setOpen] = React.useState(false); 
    const navigate = useNavigate();

    // breakpoint: 900px (md)
    const isDesktop = useMediaQuery("(min-width:900px)");

    // Redirect if not authenticated
    React.useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate]);

    return (        
        <Box sx={{ display: "flex" }}>
            {/* Sidebar for desktop */}
            {isDesktop && (
                <Sheet
                    sx={{
                        width: 240,
                        height: "100vh",
                        p: 2,
                        borderRight: "1px solid",
                        borderColor: "divider",
                        position: "sticky",
                        top: 0,
                    }}
                >
                    <SidebarItems Role={currentUser?.role} />
                </Sheet>
            )}

            

            {/* Main Content */}
            <Box component="main" sx={{ flex: 1 }}>
                {/* Drawer for mobile (controlled by AppBar MenuIcon) */}
                <Drawer open={open} onClose={() => setOpen(false)}>
                    <SidebarItems Role={currentUser?.role} onItemClick={() => setOpen(false)} />
                </Drawer>            
                <AppBar onMenuClick={() => setOpen(true)} />
                <Box sx={{ p: 2 }}>
                   <Outlet />
                </Box>
            </Box>
        </Box>
    );
}
