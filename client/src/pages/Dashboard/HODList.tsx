import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchHODs, createHOD } from "../../app/slices/hodSlice";
import { fetchDepartments } from "../../app/slices/departmentSlice";
import {toast} from "react-toastify";
import {
    Table,
    Box,
    Input,
    Button,
    Typography,
    CircularProgress,
    Select,
    Option
} from "@mui/joy";

export default function HODList() {
    const dispatch = useDispatch<AppDispatch>();
    const { hods, isLoading } = useSelector(
        (state: RootState) => state.hod
    );
    const { departments, isLoading: deptLoading } = useSelector(
        (state: RootState) => state.department
    ) as RootState['department'];

    const [formData, setFormData] = React.useState({
        name: "",
        employeeId: "",
        department: "",
        contactDetails: { email: "", phone: "" },
        dateOfJoining: "",
    });

    React.useEffect(() => {
        dispatch(fetchHODs());
        dispatch(fetchDepartments());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === "email" || name === "phone") {
            setFormData((prev) => ({
                ...prev,
                contactDetails: { ...prev.contactDetails, [name]: value },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { name, employeeId, department, contactDetails, dateOfJoining } = formData;

        // 🔹 Required field validation
        if (
            !name.trim() ||
            !employeeId.trim() ||
            !department.trim() ||
            !contactDetails.email.trim() ||
            !contactDetails.phone.trim() ||
            !dateOfJoining.trim()
        ) {
            toast.error("Please fill in all fields");
            return;
        }

        // 🔹 Name validation
        if (name.length < 3 || name.length > 100) {
            toast.error("Name must be between 3 and 100 characters");
            return;
        }

        // 🔹 Employee ID validation
        const employeeIdRegex = /^[A-Za-z0-9_-]+$/;
        if (!employeeIdRegex.test(employeeId)) {
            toast.error("Employee ID must be alphanumeric (letters, numbers, _ or -)");
            return;
        }

        // 🔹 Department validation
        if (!department.trim()) {
            toast.error("Please select a department");
            return;
        }

        // 🔹 Email validation
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(contactDetails.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // 🔹 Phone validation
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(contactDetails.phone)) {
            toast.error("Phone number must be 10 digits");
            return;
        }

        // 🔹 Date of Joining validation
        if (new Date(dateOfJoining) > new Date()) {
            toast.error("Date of Joining cannot be in the future");
            return;
        }

        try {
            const result = await dispatch(createHOD(formData)).unwrap();
            if (result?.success) {
                const newHOD = result.data.hod.name;
                toast.success(`HOD ${newHOD} created successfully`);
            }

            // Reset form
            setFormData({
                name: "",
                employeeId: "",
                department: "",
                contactDetails: { email: "", phone: "" },
                dateOfJoining: "",
            });
        } catch (error) {
            console.error("Create HOD submission error:", error);
            toast.error((error as string) || "Create HOD failed. Please try again.");
        }
    };

    const tableDataStyle = { 
        maxWidth: "150px", 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis" 
    }


    return (
        <Box sx={{ position: "relative", p: 2 }}>
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

        {/* form + table content here */}
        <Typography level="h4" sx={{ mb: 2 }}>
            HOD List
        </Typography>

        {/* Form with 6 columns + button */}
        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 0.5,
                mb: 2,
            }}
        >
            <Input
                placeholder="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                size="sm"
            />
            <Input
                placeholder="Employee ID"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
                required
                size="sm"
            />
            {/* 🔽 Department Dropdown */}
            <Select
                name="department"
                value={formData.department}
                onChange={((_, value) =>
                    setFormData((prev) => ({ ...prev, department: value || "" }))
                )}
                placeholder={deptLoading ? "Loading..." : "Department"}
                required
                size="sm"
                sx={{
                    "--Select-placeholderColor": "#bfc5cb", // gray-400
                }}
            >
                {
                    Array.isArray(departments) && departments.length > 0
                    ? departments.map((dept) => (
                        <Option key={dept._id} value={dept._id}>
                            {dept.code} 
                        </Option>
                    ))
                    : <Option value=""></Option>
                }
            </Select>
            <Input
                placeholder="Email"
                name="email"
                value={formData.contactDetails.email}
                onChange={handleChange}
                required
                size="sm"
            />
            <Input
                placeholder="Phone"
                name="phone"
                value={formData.contactDetails.phone}
                onChange={handleChange}
                required
                size="sm"
            />
            <Input
                type="date"
                name="dateOfJoining"
                value={formData.dateOfJoining}
                onChange={handleChange}
                required
                size="sm"
            />
            <Button type="submit" size="sm">
                Add
            </Button>
        </Box>

        <Table borderAxis="bothBetween" size="sm" sx={{ minWidth: 900 }}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Employee ID</th>
                    <th>Department</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Date of Joining</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
            {Array.isArray(hods) && hods.length > 0 ? (
                hods.map((hod) => (
                <tr key={hod._id}>
                    <td style={tableDataStyle}>{hod.name}</td>
                    <td style={tableDataStyle}>{hod.employeeId}</td>
                    <td style={tableDataStyle}>{departments.find((dept) => dept._id === hod.department)?.code}</td>
                    <td style={tableDataStyle}>{hod.contactDetails.email}</td>
                    <td style={tableDataStyle}>{hod.contactDetails.phone}</td>
                    <td style={tableDataStyle}>{new Date(hod.dateOfJoining).toLocaleDateString()}</td>
                    <td>–</td>
                </tr>
                ))
            ) : (
                <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                        No HODs found
                    </td>
                </tr>
            )}
            </tbody>
        </Table>
        </Box>
    );
}
