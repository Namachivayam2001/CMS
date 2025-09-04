import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import { CssVarsProvider, extendTheme } from '@mui/joy/styles';
import Login from './pages/Login/Login';

// ✅ Define theme without initialColorScheme
const customTheme = extendTheme({
  colorSchemes: {
    light: {},
    dark: {},
  },
});
import './App.css'

function App() {

    return (
        <CssVarsProvider theme={customTheme} defaultMode="light" disableTransitionOnChange>
            <Router>
                <Routes>
                    <Route path="/" element={<h1>HOME</h1>} />
                    <Route path="/login" element={<Login />} />
                </Routes>
            </Router>
        </CssVarsProvider>
    )
}

export default App