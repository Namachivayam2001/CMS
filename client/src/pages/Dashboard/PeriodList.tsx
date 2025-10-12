import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchPeriods, createPeriod } from "../../app/slices/periodSlice";
import { toast } from "react-toastify";
import {
    Table,
    Box,
    Input,
    Button,
    Typography,
    CircularProgress,
} from "@mui/joy";

export default function PeriodList() {
    const dispatch = useDispatch<AppDispatch>();

    const { periods, isLoading } = useSelector(
        (state: RootState) => state.period
    ) as RootState["period"];

    const [formData, setFormData] = React.useState({
        name: "",
        startTime: "",
        endTime: "",
    });

    // Fetch all periods on mount
    React.useEffect(() => {
        dispatch(fetchPeriods());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name.trim() || !formData.startTime || !formData.endTime) {
            toast.error("Please fill all fields");
            return;
        }

        console.log("period inputs: ", formData)

        try {
            const result = await dispatch(createPeriod(formData)).unwrap();
            if (result?.success) {
                console.log(`Period "${result.data.period.name}" created`);
                toast.success(`Period Created Successfully`);
            }
            setFormData({ name: "", startTime: "", endTime: "" });
        } catch (err) {
            console.error(`Error @PeriodList.tsx: ${err}`);
            toast.error("Failed to create period");
        }
    };

    return (
        <Box sx={{ position: "relative", p: 2 }}>
            {/* Loading Overlay */}
            {isLoading && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "80vh",
                        backgroundColor: "rgba(255,255,255,0.9)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 10,
                    }}
                >
                    <CircularProgress size="lg" color="neutral" />
                </Box>
            )}

            <Typography level="h4" sx={{ mb: 2 }}>
                Period List
            </Typography>

            {/* Create Form */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: 1,
                    mb: 2,
                }}
            >
                <Input
                    name="name"
                    placeholder="P1"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    size="sm"
                />
                <Input
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                    size="sm"
                />
                <Input
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                    size="sm"
                />
                <Button type="submit" size="sm">
                    Add
                </Button>
            </Box>

            {/* Table */}
            <Table borderAxis="bothBetween" size="sm" sx={{ minWidth: 600 }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(periods) && periods.length > 0 ? (
                        periods.map((period) => (
                        <tr key={period._id}>
                            <td>{period.name}</td>
                            <td>{period.startTime}</td>
                            <td>{period.endTime}</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} style={{ textAlign: "center" }}>
                                No periods found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Box>
    );
}
