import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchDepartments, createDepartment } from "../../app/slices/departmentSlice";
import { toast } from "react-toastify";
import {
    Table, 
    Box,
    Input,
    Button,
    Typography,
    CircularProgress,
} from "@mui/joy";

export default function DepartmentList() {
    const dispatch = useDispatch<AppDispatch>();
    const { departments, isLoading, isError, message } = useSelector(
        (state: RootState) => state.department
    );

    const [formData, setFormData] = React.useState({
        name: "",
        code: "",
    });

    React.useEffect(() => {
        dispatch(fetchDepartments());
        isError && toast.error(message);
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.code.trim()) {
            toast.error("Please fill in all fields");
            return;
        }
        try{
            const result = await dispatch(createDepartment(formData)).unwrap();
            console.log('createDepartment Respose: ', result)
            if(result?.success){
                const newDepartment = result.data.department.name;
                toast.success(`${newDepartment} created successfully!`);
            }
            setFormData({ name: "", code: "" });
        } catch (error) {
            console.error('Create Department submission error:', error);
            toast.error(error as string || 'Create Department failed. Please try again.');
        }
    };


    return (
        <Box sx={{ p: 2}}>
        <Typography level="h4" sx={{ mb: 2 }}>
            Department List
        </Typography>

        {isLoading && <CircularProgress />}

        {/* Form aligned above the table */}
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
            display: "grid",
            gridTemplateColumns: "49.8% 24.8% 24.8%",
            gap: 0.5,
            mb: 2, // margin bottom = 2
            }}
        >
            <Input
            placeholder="Department Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            size="sm"
            required
            fullWidth
            />
            <Input
            placeholder="Department Code"
            name="code"
            value={formData.code}
            onChange={handleChange}
            size="sm"
            required
            fullWidth
            />
            <Button type="submit" size="sm" sx={{ width: "100%" }}>
            Add
            </Button>
        </Box>

        <Table
            borderAxis="bothBetween"
            size="sm"
            sx={{
            minWidth: 600,
            tableLayout: "fixed", // important for alignment
            }}
        >
            <thead>
            <tr>
                <th style={{ width: "50%" }}>Department Name</th>
                <th style={{ width: "25%" }}>Department Code</th>
                <th style={{ width: "25%" }}>Actions</th>
            </tr>
            </thead>
            <tbody>
            {Array.isArray(departments) && departments.length > 0 ? (
                departments.map((dept) => (
                <tr key={dept._id}>
                    <td>{dept.name}</td>
                    <td>{dept.code}</td>
                    <td>–</td>
                </tr>
                ))
            ) : (
                <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                    No departments found
                </td>
                </tr>
            )}
            </tbody>
        </Table>
        </Box>
    );
}
