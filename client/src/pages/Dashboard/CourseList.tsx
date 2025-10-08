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
import { fetchClasses } from '../../app/slices/classSlice';
import { fetchAcademicYears } from '../../app/slices/academicYearSlice';

export default function CourseList() {
    const dispatch = useDispatch<AppDispatch>();
    const { courses, isLoading } = useSelector(
        (state: RootState) => state.course
    );
    
    const { teachers, isLoading: teacherLoading } = useSelector(
        (state: RootState) => state.teacher
    ) as RootState['teacher'];

    const { classes, isLoading: classLoading } = useSelector(
        (state: RootState) => state.class
    ) as RootState['class'];

    const { departments } = useSelector((state: RootState) => state.department);
    const { academicYears } = useSelector((state: RootState) => state.academicYear);
    
    const [formData, setFormData] = React.useState({
        name: '',
        code: '',
        class: '',
        teacher: '',
        credits: 3,
    });

    React.useEffect(() => {
        dispatch(fetchCourses());
        dispatch(fetchTeachers());
        dispatch(fetchClasses());
        dispatch(fetchDepartments());
        dispatch(fetchAcademicYears());
    }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.code || !formData.class || !formData.teacher) {
            toast.error('Please fill in all fields');
            return;
        }
        if (!/^[A-Za-z0-9-_]+$/.test(formData.code)) {
            toast.error("Course code must be alphanumeric (letters, numbers, - or _)");
            return;
        }

        if (!formData.class) {
            toast.error("Please select a Class");
            return;
        }
        if (!formData.teacher) {
            toast.error("Please select a teacher");
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
                console.log(`Course ${result.data.course.name} created successfully!`);
                toast.success(`Course created successfully!`);
                setFormData({ name: '', code: '', class: '', teacher: '', credits: 3 });
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
                gridTemplateColumns: 'repeat(6, 1fr)',
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
                name="class"
                value={formData.class}
                onChange={((_, value) => 
                    setFormData((prev) => ({ ...prev, class: value || '' }))
                )}
                placeholder={(classLoading ? "Loading..." : "Class")}
                required
                size="sm"
                sx={{
                    "--Select-placeholderColor": "#bfc5cb", // gray-400
                    "width": "250px"
                }}
            >
                {
                    Array.isArray(classes) && classes.length > 0
                    ? classes.map((c) => (
                        <Option key={c._id} value={c._id}>
                            {departments.find((dept) => dept._id === c.department)?.code} - ({academicYears.find((year) => year._id === c.academicYear)?.year}) - Sec {c.section}
                        </Option>
                    ))
                    : <Option value="">Class</Option>
                }
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
                {classes.find((c) => c._id === formData.class)?.department
                ? (
                    () => {
                        const filtered = teachers.filter((t) => t.department === classes.find((c) => c._id === formData.class)?.department);
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
                    <th style={{width: "250px"}}>Class</th>
                    <th>Teacher</th>
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
                            <td style={tableDataStyle}>{departments.find((dept) => dept._id === classes.find((classItem) => classItem._id === c.class)?.department)?.code} - ({academicYears.find((year) => year._id === classes.find((classItem) => classItem._id === c.class)?.academicYear)?.year}) - Sec {classes.find((classItem) => classItem._id === c.class)?.section}</td>
                            <td style={{...tableDataStyle, whiteSpace: "wrap"}}>{teachers.find((t) => t._id === c.teacher)?.name}</td> 
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
