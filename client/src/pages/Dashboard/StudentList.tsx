import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchStudents, createStudent } from "../../app/slices/studentSlice"; 
import { toast } from "react-toastify";
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
import { fetchClasses } from "../../app/slices/classSlice";
import { fetchAcademicYears } from "../../app/slices/academicYearSlice";
import { fetchDepartments } from "../../app/slices/departmentSlice";

export default function StudentList() {
    const dispatch = useDispatch<AppDispatch>();
    const { students, isLoading } = useSelector(
        (state: RootState) => state.student
    );
    const { academicYears } = useSelector( (state: RootState) => state.academicYear );
    const { departments } = useSelector( (state: RootState) => state.department );
    const { classes, isLoading: classLoading } = useSelector(
        (state: RootState) => state.class
    ) as RootState['class'];

    const [formData, setFormData] = React.useState({
        name: "",
        rollNumber: "",
        class: "",
        contactDetails: { email: "", phone: "" },
        dateOfJoining: "",
    });

    React.useEffect(() => {
        dispatch(fetchStudents());
        dispatch(fetchClasses());
        dispatch(fetchAcademicYears());
        dispatch(fetchDepartments())
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
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
        const {name, rollNumber, class: classId, contactDetails, dateOfJoining} = formData;

        if (!name.trim() || !rollNumber.trim() || !classId.trim() || !contactDetails.email.trim() || !contactDetails.phone.trim() || !dateOfJoining.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        // Name
        if (!name.trim() || name.length < 3 || name.length > 100) {
            toast.error("Name must be between 3 and 100 characters");
            return;
        }

        // Roll Number
        const rollRegex = /^[A-Za-z0-9_-]+$/;
        if (!rollNumber.trim() || !rollRegex.test(rollNumber)) {
            toast.error("Roll Number must be alphanumeric (letters, numbers, _ or -)");
            return;
        }

        // Class
        if (!classId.trim()) {
            toast.error("Please select a class");
            return;
        }

        // Email
        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!contactDetails.email.trim() || !emailRegex.test(contactDetails.email)) {
            toast.error("Please enter a valid email address");
            return;
        }

        // Phone
        const phoneRegex = /^[0-9]{10}$/;
        if (!contactDetails.phone.trim() || !phoneRegex.test(contactDetails.phone)) {
            toast.error("Phone number must be 10 digits");
            return;
        }

        // Date of Joining
        if (!dateOfJoining.trim()) {
            toast.error("Please select Date of Joining");
            return;
        }

        try {
            const result = await dispatch(createStudent(formData)).unwrap();
            if (result?.success) {
                console.log(`Student ${result.data.student.name} created successfully`);
                toast.success(`Student created successfully`);
            }
            setFormData({
                name: "",
                rollNumber: "",
                class: "",
                contactDetails: { email: "", phone: "" },
                dateOfJoining: "",
            });
        } catch (error) {
            console.error('Create Student submission error:', error);
            toast.error(error as string || 'Create Student failed. Please try again.');
        }
    };

    const tableDataStyle = { 
        maxWidth: "150px", 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis" 
    }

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
            <Typography level="h4" sx={{ mb: 2 }}>
                Student List
            </Typography>

            {/* Define a grid template for 7 columns */}
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
                    placeholder="Roll Number"
                    name="rollNumber"
                    value={formData.rollNumber}
                    onChange={handleChange}
                    required
                    size="sm"
                />
                {/* 🔽 Department Dropdown */}
                <Select
                    name="class"
                    value={formData.class}
                    onChange={(_, value) =>
                        setFormData((prev) => ({ ...prev, class: value || "" }))
                    }
                    placeholder={classLoading ? "Loading..." : "Class"}
                    required
                    size="sm"
                    sx={{
                        "--Select-placeholderColor": "#bfc5cb", // gray-400,
                        "width": "249px"
                    }}
                >
                    {
                        Array.isArray(classes) && classes.length > 0
                        ? classes.map((classItem) => (
                            <Option key={classItem._id} value={classItem._id}>
                                {departments.find((dept) => dept._id === classItem.department)?.code} - ({academicYears.find((year) => year._id === classItem.academicYear)?.year}) - Sec {classItem.section}
                            </Option>
                        ))
                        : <Option value="">Class</Option>
                    }
                </Select>
                <Input
                    placeholder="Email"
                    name="email"
                    value={formData.contactDetails.email}
                    onChange={handleChange}
                    required
                    style={{width: "245px"}}
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

            <Table borderAxis="bothBetween" size="sm" sx={{ minWidth: 800 }}>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th style={{width: "250px"}}>Class</th>
                        <th style={{width: "250px"}}>Email</th>
                        <th>Phone</th>
                        <th>Date of Joining</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                
                {Array.isArray(students) && students.length > 0 ? (
                    students.map((student) => (
                    <tr key={student._id}>
                        <td style={tableDataStyle}>{student.name}</td>
                        <td style={tableDataStyle}>{student.rollNumber}</td>
                        <td style={tableDataStyle}>{departments.find((dept) => dept._id === classes.find((classItem) => classItem._id === student.class)?.department)?.code} - ({academicYears.find((year) => year._id === classes.find((classItem) => classItem._id === student.class)?.academicYear)?.year}) - Sec {classes.find((classItem) => classItem._id === student.class)?.section}</td>
                        <td style={tableDataStyle}>{student.contactDetails.email}</td>
                        <td style={tableDataStyle}>{student.contactDetails.phone}</td>
                        <td style={tableDataStyle}>{new Date(student.dateOfJoining).toLocaleDateString()}</td>
                        <td>–</td>
                    </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={7} style={{ textAlign: "center" }}>
                            No students found
                        </td>
                    </tr>
                )}
                </tbody>
            </Table>
        </Box>
    );
}
