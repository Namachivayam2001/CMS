import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import Login from './pages/Login/Login';
import { useSelector } from 'react-redux';
import type { RootState } from './app/store';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './App.css'

// ✅ Define theme without initialColorScheme
const customTheme = extendTheme({
  colorSchemes: {
    light: {},
    dark: {},
  },
});

function App() {
    const { user } = useSelector((state: RootState) => state.auth);
        

    return (
        <CssVarsProvider theme={customTheme} defaultMode="light" disableTransitionOnChange>
            <ToastContainer position="top-right" autoClose={3000} />
            <Router>
                <Routes>
                    <Route path="/" element={<h1>HOME</h1>} />
                    <Route path="/login" element={<Login />} />
                    <Route path={`/${user?.role}/dashboard`} element={<h1>{user?.role} DASHBOARD</h1>} />
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </Router>
        </CssVarsProvider>
    )
}

export default App