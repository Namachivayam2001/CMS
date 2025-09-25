import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchEnrollments, createEnrollment } from "../../app/slices/enrollmentSlice";
import { fetchStudents } from "../../app/slices/studentSlice";
import { fetchCourses } from "../../app/slices/courseSlice";
import { toast } from "react-toastify";
import JoyAutocomplete from "../../components/JoyAutocomplete";
import { Box, Input, Button, Table, CircularProgress, Typography } from "@mui/joy";

export default function EnrollmentList() {
    const dispatch = useDispatch<AppDispatch>();
    const { enrollments, isLoading } = useSelector((state: RootState) => state.enrollment);
    const { students, isLoading: stdLoading } = useSelector(
        (state: RootState) => state.student
    ) as RootState['student'];
    const { courses, isLoading: courseLoading } = useSelector(
        (state: RootState) => state.course
    ) as RootState['course'];

    const [formData, setFormData] = React.useState({
        student: "",
        course: "",
        academicYear: "",
        semester: 1,
    });

    React.useEffect(() => {
        dispatch(fetchEnrollments());
        dispatch(fetchStudents());
        dispatch(fetchCourses());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { student, course, academicYear, semester } = formData;

        if (!student || !course || !academicYear || !semester) {
            toast.error("Please fill all fields");
            return;
        }

        try {
            const result = await dispatch(createEnrollment(formData)).unwrap();
            if (result?.success) toast.success("Enrollment created successfully");
            setFormData({ student: "", course: "", academicYear: "", semester: 1 });
        } catch (error) {
            toast.error((error as string) || "Failed to create enrollment");
        }
    };

    const tableDataStyle = { maxWidth: "150px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };

    return (
        <Box sx={{ position: "relative", p: 2 }}>
        {isLoading && (
            <Box sx={{ 
                position: "absolute", 
                top: 0, 
                left: 0, 
                width: "100%", 
                height: "80vh", 
                backgroundColor: "rgba(255,255,255,0.9)", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                zIndex: 10 
            }}>
                <CircularProgress size="lg" color="neutral" />
            </Box>
        )}

        <Typography 
            level="h4" 
            sx={{ mb: 2 }}
        >
            Enrollments
        </Typography>

        <Box 
            component="form" 
            onSubmit={handleSubmit} 
            sx={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(5, 1fr)", 
                gap: 0.5, mb: 2 
            }}
        >
            <JoyAutocomplete
                options={students.map((s) => ({
                    label: `${s.name} (${s.rollNumber || s.contactDetails?.email || s._id})`,
                    value: s._id ?? "",
                }))}
                value={formData.student}
                onChange={(val) => setFormData((prev) => ({ ...prev, student: val }))}
                placeholder="Student"
                loading={stdLoading}
                sx={{ width: "100%", minWidth: 160 }}   // ✅ keep consistent with Input
            />
            <JoyAutocomplete
                options={courses.map((c) => ({
                    label: `${c.name} (${c.code || c._id})`,
                    value: c._id,
                }))}
                value={formData.course}
                onChange={(val) => setFormData((prev) => ({ ...prev, course: val }))}
                placeholder="Course"
                loading={courseLoading}
                sx={{ width: "100%", minWidth: 160 }}   // ✅ keep consistent with Input
            />
            <Input 
                name="academicYear" 
                placeholder="Academic Year" 
                value={formData.academicYear} 
                onChange={handleChange} 
                required 
                size="sm" 
            />
            <Input 
                name="semester" 
                type="number" 
                placeholder="Semester" 
                value={formData.semester} 
                onChange={handleChange} 
                required 
                size="sm" 
            />
            <Button 
                type="submit" 
                size="sm"
            >
                Enroll
            </Button>
        </Box>

        <Table borderAxis="bothBetween" size="sm" sx={{ minWidth: 900 }}>
            <thead>
                <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Academic Year</th>
                    <th>Semester</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(enrollments) && enrollments.length > 0 ? 
                    enrollments.map((e) => (
                    <tr key={e._id}>
                        <td style={tableDataStyle}>{students.find((s) => s._id === e.student)?.name}</td>
                        <td style={tableDataStyle}>{courses.find((c) => c._id === e.course)?.name}</td>
                        <td style={tableDataStyle}>{e.academicYear}</td>
                        <td style={tableDataStyle}>{e.semester}</td>
                        <td style={tableDataStyle}>–</td>
                    </tr>
                )) : (
                    <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>No enrollments found</td>
                    </tr>
                )}
            </tbody>
        </Table>
        </Box>
    );
}
