import * as React from "react";
import {
    Box,
    Button,
    Input,
    Select,
    Option,
    Table,
    Typography,
    CircularProgress,
} from "@mui/joy";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../app/store";
import { fetchDepartments } from "../../app/slices/departmentSlice";
import { fetchTeachers } from "../../app/slices/teacherSlice";
import {
    fetchClasses,
    createClass, 
} from "../../app/slices/classSlice";
import { toast } from "react-toastify";
import { fetchAcademicYears } from "../../app/slices/academicYearSlice";

export default function ClassList() {
    const dispatch = useDispatch<AppDispatch>();

    const { departments, isLoading: depLoading } = useSelector(
        (state: RootState) => state.department
    ) as RootState["department"];

    const { teachers, isLoading: teacherLoading } = useSelector(
        (state: RootState) => state.teacher
    ) as RootState["teacher"];

    const { academicYears, isLoading: academicYearLoading } = useSelector(
        (state: RootState) => state.academicYear
    ) as RootState["academicYear"];

    const { classes, isLoading } = useSelector(
        (state: RootState) => state.class
    );

    const [formData, setFormData] = React.useState({
        department: "",
        academicYear: "",
        semester: 1,
        section: "",
        classAdvisor: "",
    }); 

    React.useEffect(() => {
        dispatch(fetchDepartments());
        dispatch(fetchTeachers());
        dispatch(fetchClasses());
        dispatch(fetchAcademicYears())
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.department || !formData.academicYear) {
            toast.error("Please fill all required fields");
            return;
        }

        try {
            const result = await dispatch(createClass(formData)).unwrap();
            if (result?.success) {
                toast.success("Class created successfully");
                setFormData({
                    department: "",
                    academicYear: "",
                    semester: 1,
                    section: "",
                    classAdvisor: "",
                });
            }
        } catch (err) {
            toast.error((err as string) || "Failed to create class");
            toast.error(err as string || 'Create Class failed. Please try again.');
        }
    };

    // 🔽 Filter teachers by department selected
    const filteredTeachers = teachers.filter(
        (t) => t.department === formData.department
    );

    return (
        <Box sx={{ position: "relative", p: 2 }}>
            {(isLoading) && (
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
                Class List
            </Typography>

            {/* Form */}
            <Box
                component="form"
                onSubmit={handleSubmit}
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(6, 1fr)",
                    gap: 1,
                    mb: 2,
                }}
            >
                {/* Department */}
                <Select
                    name="department"
                    value={formData.department}
                    onChange={(_, value) =>
                        setFormData((prev) => ({ ...prev, department: value || "" }))
                    }
                    placeholder={depLoading ? "Loading..." : "Department"}
                    size="sm"
                >
                    {
                        Array.isArray(departments) && departments.length > 0
                        ? departments.map((dept) => (
                            <Option key={dept._id} value={dept._id}>
                                {dept.code}
                            </Option>
                        ))
                        : <Option value="">Department</Option>
                    }
                </Select>

                {/* Academic Year */}
                <Select
                    name="academicYear"
                    value={formData.academicYear}
                    onChange={(_, value) =>
                        setFormData((prev) => ({ ...prev, academicYear: value || "" }))
                    }
                    placeholder={academicYearLoading ? "Loading..." : "Academic Year"}
                    size="sm"
                >
                    {
                        Array.isArray(academicYears) && academicYears.length > 0
                        ? academicYears.map((year) => (
                            <Option key={year._id} value={year._id}>
                                {year.year}
                            </Option>
                        ))
                        : <Option value="">Academic Year</Option>
                    }
                </Select>

                {/* Semester */}
                <Input
                    type="number"
                    name="semester"
                    value={formData.semester}
                    onChange={(e) =>
                        setFormData((prev) => ({
                            ...prev,
                            semester: Number(e.target.value),
                        }))
                    }
                    placeholder="Semester"
                    size="sm" 
                />

                {/* Section */}
                <Input
                    name="section"
                    value={formData.section}
                    onChange={(e) =>
                        setFormData((prev) => ({ ...prev, section: e.target.value }))
                    }
                    placeholder="Section"
                    size="sm"
                />

                {/* Class Advisor Dropdown */}
                <Select
                    name="classAdvisor"
                    value={formData.classAdvisor}
                    onChange={(_, value) =>
                        setFormData((prev) => ({ ...prev, classAdvisor: value || "" }))
                    }
                    placeholder={teacherLoading ? "Loading..." : "Class Advisor"}
                    size="sm"
                >
                    {
                        Array.isArray(filteredTeachers) && filteredTeachers.length > 0
                        ? filteredTeachers.map((teacher) => (
                            <Option key={teacher._id} value={teacher._id}>
                                {teacher.name}
                            </Option>
                        ))
                        : <Option value="">Class Advisor</Option>
                    }
                </Select>

                {/* Submit */}
                <Button type="submit" size="sm">
                    Add
                </Button>
            </Box>

            {/* Table */}
            <Table borderAxis="bothBetween" size="sm" sx={{ minWidth: 800 }}>
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Academic Year</th>
                        <th>Semester</th>
                        <th>Section</th>
                        <th>Class Advisor</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(classes) && classes.length > 0 ? (
                        classes.map((cls) => (
                        <tr key={cls._id}>
                            <td>
                                {departments.find((d) => d._id === cls.department)?.code || cls.department}
                            </td>
                            <td>{academicYears.find((y) => y._id === cls.academicYear)?.year || cls.academicYear}</td>
                            <td>{cls.semester}</td>
                            <td>{cls.section}</td>
                            <td>
                                {teachers.find((t) => t._id === cls.classAdvisor)?.name || "—"}
                            </td>
                            <td>-</td>
                        </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={5} style={{ textAlign: "center" }}>
                                No classes found
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>
        </Box>
    );
}
