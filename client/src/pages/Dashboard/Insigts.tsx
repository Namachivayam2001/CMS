import UserList from "./UserList";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { CircularProgress, Box } from "@mui/joy";

export default function Insights() {
    const {isLoading} = useSelector((state: RootState) => state.user);
    return (
        <Box sx={{position: "relative", p: 2 }}>
            {/* Overlay only inside component */}
            {(isLoading ) && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "80vh",
                        backgroundColor: "rgba(255, 255, 255, 0.9)", // dim background
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10, // floats above table & form
                    }}
                >
                <CircularProgress size="lg" color="neutral" />
                </Box>
            )}
            <h1>Insights Page</h1>
            <UserList />
        </Box>
    );
}