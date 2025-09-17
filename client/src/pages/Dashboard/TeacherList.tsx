import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchTeachers, createTeacher } from "../../app/slices/teacherSlice";
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

export default function TeacherList() {
    const dispatch = useDispatch<AppDispatch>();
    const { teachers, isLoading } = useSelector(
        (state: RootState) => state.teacher
    );
    const { departments, isLoading: deptLoading, isError, message } = useSelector(
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
        dispatch(fetchTeachers());
        dispatch(fetchDepartments());
        isError && toast.error(message);
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

        // Basic validations
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

        // Name
        if (name.length < 3 || name.length > 100) {
            toast.error("Name must be between 3 and 100 characters");
            return;
        }

        // Employee ID
        const empIdRegex = /^[A-Za-z0-9_-]+$/;
        if (!empIdRegex.test(employeeId)) {
            toast.error("Employee ID must be alphanumeric (letters, numbers, _ or -)");
            return;
        }

        // Department
        if (!department.trim()) {
            toast.error("Please select a department");
            return;
        }

        // Email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!emailRegex.test(contactDetails.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Phone
        const phoneRegex = /^[0-9]{10}$/;
        if (!phoneRegex.test(contactDetails.phone)) {
            toast.error("Phone number must be 10 digits");
            return;
        }

        // Date of Joining
        if (!dateOfJoining.trim() || new Date(dateOfJoining) > new Date()) {
            toast.error("Please select a valid Date of Joining");
            return;
        }

        try {
            const result = await dispatch(createTeacher(formData)).unwrap();
            console.log("createTeacher Response:", result);

            if (result?.success) {
                const newTeacherName = result?.data?.teacher?.name;
                toast.success(`${newTeacherName} created successfully`);
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
            console.error("Create Teacher submission error:", error);
            toast.error((error as string) || "Create Teacher failed. Please try again.");
        }
    };

    const tableDataStyle = { 
        maxWidth: "150px", 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis" 
    }

    return (
        <Box sx={{ p: 2 }}>
        <Typography level="h4" sx={{ mb: 2 }}>
            Teacher List
        </Typography>

        {isLoading && <CircularProgress />}

        {/* Form grid for adding Teacher */}
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
                placeholder={deptLoading ? "Loading..." : "Select Department"}
                required
                size="sm"
                sx={{
                    "--Select-placeholderColor": "#bfc5cb", // gray-400
                }}
            >
            {departments.map((dept) => (
                <Option key={dept._id} value={dept._id}>
                    {dept.code} 
                </Option>
            ))}
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

        {/* Teacher Table */}
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
            {Array.isArray(teachers) && teachers.length > 0 ? (
            teachers.map((teacher) => (
                <tr key={teacher._id}>
                    <td style={tableDataStyle}>{teacher.name}</td>
                    <td style={tableDataStyle}>{teacher.employeeId}</td>
                    <td style={tableDataStyle}>{teacher.department}</td>
                    <td style={tableDataStyle}>{teacher.contactDetails.email}</td>
                    <td style={tableDataStyle}>{teacher.contactDetails.phone}</td>
                    <td style={tableDataStyle}>{new Date(teacher.dateOfJoining).toLocaleDateString()}</td>
                    <td>–</td>
                </tr>
            )) ): (
                <tr>
                    <td colSpan={7} style={{ textAlign: "center" }}>
                        No teachers found
                    </td>
                </tr>
            )}
            </tbody>
        </Table>
        </Box>
    );
}
