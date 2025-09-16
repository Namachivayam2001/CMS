import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import Login from './pages/Login/Login';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dashboard from './pages/Dashboard/Dashboard';
import StudentList from './pages/Dashboard/StudentList';
import './App.css'
import Insights from './pages/Dashboard/Insigts';
import DepartmentList from './pages/Dashboard/DepartmentList';
import HODList from './pages/Dashboard/HODList';
import TeacherList from './pages/Dashboard/TeacherList';

// ✅ Define theme without initialColorScheme
const customTheme = extendTheme({
  colorSchemes: {
    light: {},
    dark: {},
  },
});

function App() { 

    return (
        <CssVarsProvider theme={customTheme} defaultMode="light" disableTransitionOnChange>
            <ToastContainer position="top-right" autoClose={3000} />            
            <Router>
                <Routes>                    
                    <Route path="/" element={<h1>HOME</h1>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/dashboard/admin" element={<Dashboard />}>
                        <Route index element={<Insights />} />
                        <Route path={'student-list'} element={<StudentList />} />
                        <Route path={'department-list'} element={<DepartmentList />} />
                        <Route path={'hod-list'} element={<HODList />} />
                        <Route path={'teacher-list'} element={<TeacherList />} />
                    </Route>
                    <Route path="*" element={<h1>404 Not Found</h1>} />
                </Routes>
            </Router>
        </CssVarsProvider>
    )
}

export default App