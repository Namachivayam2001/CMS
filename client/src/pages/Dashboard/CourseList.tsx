import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchCourses, createCourse } from '../../app/slices/courseSlice';
import { fetchDepartments } from '../../app/slices/departmentSlice';
import { fetchTeachers } from '../../app/slices/teacherSlice'; // you’ll need teacherSlice like dept
import { toast } from 'react-toastify';
import {
    Table,
    Box,
    Input,
    Button,
    Typography,
    CircularProgress,
    Select,
    Option,
} from '@mui/joy';

export default function CourseList() {
    const dispatch = useDispatch<AppDispatch>();
    const { courses, isLoading } = useSelector(
        (state: RootState) => state.course
    );
    const { departments, isLoading: deptLoading } = useSelector(
        (state: RootState) => state.department
    ) as RootState['department'];
    const { teachers, isLoading: teacherLoading } = useSelector(
        (state: RootState) => state.teacher
    ) as RootState['teacher'];

    const [formData, setFormData] = React.useState({
        name: '',
        code: '',
        department: '',
        teacher: '',
        semester: 1,
        credits: 3,
    });

    React.useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchDepartments());
        dispatch(fetchTeachers());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.code || !formData.department || !formData.teacher) {
            toast.error('Please fill in all fields');
            return;
        }
        if (!/^[A-Za-z0-9-_]+$/.test(formData.code)) {
            toast.error("Course code must be alphanumeric (letters, numbers, - or _)");
            return;
        }

        if (!formData.department) {
            toast.error("Please select a department");
            return;
        }
        if (!formData.teacher) {
            toast.error("Please select a teacher");
            return;
        }

        // Semester validation
        if (formData.semester < 1 || formData.semester > 12) {
            toast.error("Semester must be between 1 and 12");
            return;
        }

        // Credits validation
        if (formData.credits < 1 || formData.credits > 10) {
            toast.error("Credits must be between 1 and 10");
            return;
        }
        try {
            const result = await dispatch(createCourse(formData)).unwrap();
            if (result?.success) {
                toast.success(`Course ${result.data.course.name} created successfully!`);
                setFormData({ name: '', code: '', department: '', teacher: '', semester: 1, credits: 3 });
            }
        } catch (error) {
            console.error("Create Course submission error:", error);
            toast.error(error as string || 'Create Course failed. Please try again.');
        }
    };

    const tableDataStyle = { 
        maxWidth: "150px", 
        whiteSpace: "nowrap", 
        overflow: "hidden", 
        textOverflow: "ellipsis" 
    }

    return (
        <Box sx={{ position: 'relative', p: 2 }}>
        {isLoading && (
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '80vh',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10,
                }}
            >
                <CircularProgress size="lg" color="neutral" />
            </Box>
        )}
        <Typography level="h4" sx={{ mb: 2 }}>
            Course List
        </Typography>

        <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: 0.5,
                mb: 2,
            }}
        >
            <Input
                placeholder="Course Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                size="sm"
                required
                fullWidth
            />
            <Input
                placeholder="Course Code"
                name="code"
                value={formData.code}
                onChange={handleChange}
                size="sm"
                required
                fullWidth
            />
            <Select
                name="department"
                value={formData.department}
                onChange={((_, value) => 
                    setFormData((prev) => ({ ...prev, department: value || '' }))
                )}
                placeholder={(deptLoading ? "Loading..." : "Department")}
                required
                size="sm"
                sx={{
                    "--Select-placeholderColor": "#bfc5cb", // gray-400
                }}
            >
                {departments.map((d) => (
                    <Option key={d._id} value={d._id}>
                        {d.code}
                    </Option>
                ))}
            </Select>
            <Select
                name="teacher"
                value={formData.teacher}
                onChange={((_, value) => 
                    setFormData((prev) => ({ ...prev, teacher: value || '' }))
                )}
                placeholder={teacherLoading ? "Loading..." : "Teacher"}
                required
                size="sm"
                sx={{
                    "--Select-placeholderColor": "#bfc5cb", // gray-400
                }}
            >
                {formData.department
                ? (
                    () => {
                        const filtered = teachers.filter((t) => t.department === formData.department);
                        return filtered.length > 0 ? (
                            filtered.map((t) => (
                                <Option key={t._id} value={t._id}>
                                    {t.name}
                                </Option>
                            ))
                        ) : (
                            <Option value="">Teacher</Option> // ✅ fallback
                        );
                    })()
                : (
                    <Option value="">Teacher</Option>
                )}
            </Select>
            <Input
                placeholder="Semester"
                name="semester"
                type="number"
                value={formData.semester}
                onChange={handleChange}
                size="sm"
                required
            />
            <Input
                placeholder="Credits"
                name="credits"
                type="number"
                value={formData.credits}
                onChange={handleChange}
                size="sm"
                required
            />
            <Button type="submit" size="sm">
                Add
            </Button>
        </Box>

        <Table borderAxis="bothBetween" size="sm" sx={{ minWidth: 800 }}>
            <thead>
                <tr>
                    <th>Name</th>
                    <th>Code</th>
                    <th>Department</th>
                    <th>Teacher</th>
                    <th>Semester</th>
                    <th>Credits</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(courses) && courses.length > 0 ? (
                    courses.map((c) => (
                        <tr key={c._id}>
                            <td style={tableDataStyle}>{c.name}</td>
                            <td style={tableDataStyle}>{c.code}</td>
                            <td style={tableDataStyle}>{departments.find((dept) => dept._id === c.department)?.code}</td>
                            <td style={tableDataStyle}>{teachers.find((t) => t._id === c.teacher)?.name}</td>
                            <td style={tableDataStyle}>{c.semester}</td>
                            <td style={tableDataStyle}>{c.credits}</td>
                            <td style={tableDataStyle}>–</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={6} style={{ textAlign: 'center' }}>
                            No courses found
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
        </Box>
    );
}
