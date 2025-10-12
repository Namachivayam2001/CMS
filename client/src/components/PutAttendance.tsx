import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { fetchStudents } from "../app/slices/studentSlice";
import { fetchCourses } from "../app/slices/courseSlice";
import { fetchClasses } from "../app/slices/classSlice";
import { createAttendance, fetchAttendances } from "../app/slices/attendanceSlice";
import { fetchDepartments } from "../app/slices/departmentSlice";
import { fetchAcademicYears } from "../app/slices/academicYearSlice";
import { fetchPeriods } from "../app/slices/periodSlice";
import { toast } from "react-toastify";

// Icons
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

// Joy UI
import {
    Box,
    Button,
    Typography,
    Select,
    Option,
    Sheet,
    Input,
    RadioGroup,
    Radio,
} from "@mui/joy";

type AttendanceStatus = "present" | "absent" | "late";

export default function PutAttendance() {
    const dispatch = useDispatch<AppDispatch>();

    const { students } = useSelector((state: RootState) => state.student);
    const { departments } = useSelector((state: RootState) => state.department);
    const { academicYears } = useSelector((state: RootState) => state.academicYear);
    const { periods } = useSelector((state: RootState) => state.period);
    const { attendances } = useSelector((state: RootState) => state.attendance);

    const { courses, isLoading: courseLoading } = useSelector(
        (state: RootState) => state.course
    ) as RootState["course"];
    const { classes } = useSelector((state: RootState) => state.class);

    const [selectedCourseName, setSelectedCourseName] = React.useState<string>("");
    const [selectedClass, setSelectedClass] = React.useState<string>("");
    const [attendanceDate, setAttendanceDate] = React.useState<Date>(new Date());
    const [selectedPeriod, setSelectedPeriod] = React.useState<string>("");
    const [attendanceRecords, setAttendanceRecords] = React.useState<
        { student: string; status: AttendanceStatus }[]
    >([]);

    // ✅ Remove duplicate courses by name
    const uniqueCourses = React.useMemo(() => {
        return [...new Set(courses.map((c) => c.name))];
    }, [courses]);

    // ✅ Fetch all required data on mount
    React.useEffect(() => {
        dispatch(fetchStudents());
        dispatch(fetchCourses());
        dispatch(fetchClasses());
        dispatch(fetchDepartments());
        dispatch(fetchAcademicYears());
        dispatch(fetchPeriods());
        dispatch(fetchAttendances());
    }, [dispatch]);

    // ✅ Filter classes related to the selected course name
    const filteredClasses = React.useMemo(() => {
        if (!selectedCourseName) return [];
        return courses
            .filter((c) => c.name === selectedCourseName)
            .map((c) => c.class)
            .map((classId) => classes.find((cl) => cl._id === classId))
            .filter(Boolean);
    }, [selectedCourseName, courses, classes]);

     // ✅ Prefill existing attendance or initialize default
    React.useEffect(() => {
        if (
            selectedCourseName &&
            selectedClass &&
            selectedPeriod &&
            students.length &&
            attendances.length
        ) {
            const selectedCourse = courses.find(
                (c) => c.name === selectedCourseName && c.class === selectedClass
            );
            if (!selectedCourse) return;

            const existingAttendance = attendances.find((a) => {
                const dbDate = new Date(a.date).toISOString().slice(0, 10);
                const selectedDate = attendanceDate.toISOString().slice(0, 10);

                return (
                    a.course === selectedCourse._id &&
                    a.class === selectedClass &&
                    a.period === selectedPeriod &&
                    dbDate === selectedDate
                );
            });


            if (existingAttendance) {
                // ✅ Pre-fill existing attendance
                setAttendanceRecords(existingAttendance.records);
                toast.info("Attendance already exists. Records pre-filled.");
            } else {
                // ✅ Default absent if no existing record
                const classStudents = students.filter((s) => s.class === selectedClass);
                setAttendanceRecords(
                    classStudents.map((s) => ({
                        student: s._id as string,
                        status: "absent",
                    }))
                );
            }
        } else if (selectedCourseName && selectedClass && students.length) {
            const classStudents = students.filter((s) => s.class === selectedClass);
            setAttendanceRecords(
                classStudents.map((s) => ({
                    student: s._id as string,
                    status: "absent",
                }))
            );
        } else {
            setAttendanceRecords([]);
        }
    }, [
        selectedCourseName,
        selectedClass,
        selectedPeriod,
        attendanceDate,
        students,
        attendances,
    ]);

    const updateStatus = (studentId: string, status: AttendanceStatus) => {
        setAttendanceRecords((prev) =>
            prev.map((r) => (r.student === studentId ? { ...r, status } : r))
        );
    };

    const markAll = (status: AttendanceStatus) => {
        setAttendanceRecords((prev) => prev.map((r) => ({ ...r, status })));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedCourseName || !selectedClass)
            return toast.error("Please select course and class");

        const selectedCourse = courses.find(
            (c) => c.name === selectedCourseName && c.class === selectedClass
        );

        if (!selectedCourse) return toast.error("Invalid course/class selection");

        try {
            await dispatch(
                createAttendance({
                    course: selectedCourse._id,
                    class: selectedClass,
                    period: selectedPeriod,
                    date: attendanceDate.toISOString().slice(0, 10),
                    records: attendanceRecords,
                })
            ).unwrap();
            toast.success("Attendance submitted successfully");
        } catch (error) {
            console.log("error on PutAttendance Submit: ", error);
            toast.error("Failed to submit attendance");
        }
    };

    const presentCount = attendanceRecords.filter( (r) => r.status === "present" ).length;
    const absentCount = attendanceRecords.filter( (r) => r.status === "absent" ).length;
    const lateCount = attendanceRecords.filter( (r) => r.status === "late" ).length;

    return (
        <Box sx={{ p: 2 }}>
        <Typography level="h4" sx={{ mb: 2 }}>
            Take Attendance
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
            {/* Course, Class, Date, Bulk Actions */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "repeat(4, 1fr)" },
                    gap: 2,
                    alignItems: "center",
                }}
            >
                {/* Course Select */}
                <Select
                    value={selectedCourseName}
                    onChange={(_, val) => {
                        setSelectedCourseName(val ?? "");
                        setSelectedClass(""); // reset class when course changes
                    }}
                    placeholder={courseLoading ? "Loading courses..." : "Select Course"}
                    required
                >
                    {uniqueCourses.length > 0 ? (
                        uniqueCourses.map((name) => (
                            <Option key={name} value={name}>
                                {name}
                            </Option>
                        ))
                    ) : (
                        <Option value="">Select Course</Option>
                    )}
                </Select>

                {/* Class Select */}
                <Select
                    value={selectedClass}
                    onChange={(_, val) => setSelectedClass(val ?? "")}
                    placeholder="Select Class"
                    required
                    disabled={!selectedCourseName}
                >
                    {filteredClasses.length > 0 ? (
                        filteredClasses.map((cl) => (
                            <Option key={cl?._id} value={cl?._id}>
                                {departments.find((dept) => dept._id === classes.find((classItem) => classItem._id === cl?._id)?.department)?.code} - ({academicYears.find((year) => year._id === classes.find((classItem) => classItem._id === cl?._id)?.academicYear)?.year}) - Sec {classes.find((classItem) => classItem._id === cl?._id)?.section}
                            </Option>
                        ))
                        ) : (
                            <Option value="">No class available</Option>
                        )
                    }

                </Select>

                {/* Date */}
                <Input
                    type="date"
                    value={attendanceDate.toISOString().slice(0, 10)}
                    onChange={(e) => setAttendanceDate(new Date(e.target.value))}
                    size="sm"
                />

                <Select
                    value={selectedPeriod}
                    onChange={(_, val) => setSelectedPeriod(val ?? "")}
                    placeholder="Select Period"
                    required
                >
                    {periods.map((p) => (
                        <Option key={p._id} value={p._id}>
                            {p.name} ({p.startTime} - {p.endTime})
                        </Option>
                    ))}
                </Select>

                {/* Bulk Mark Buttons */}
                <Box sx={{ display: "grid", gap: 1, gridTemplateColumns: "repeat(3, 1fr)" }}>
                    <Button size="sm" variant="outlined" onClick={() => markAll("present")}>
                        All Present
                    </Button>
                    <Button size="sm" variant="outlined" onClick={() => markAll("absent")}>
                        All Absent
                    </Button>
                    <Button size="sm" variant="outlined" onClick={() => markAll("late")}>
                        All Late
                    </Button>
                </Box>
            </Box>

            {/* Attendance Table */}
            <Sheet
                variant="outlined"
                sx={{
                    borderRadius: "md",
                    overflow: "hidden",
                    border: "1px solid",
                    borderColor: "neutral.outlinedBorder",
                }}
            >
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                    <tr style={{ backgroundColor: "#f5f5f5", textAlign: "left"}}>
                        <th style={{ padding: "12px" }}>Student</th>
                        <th style={{ padding: "12px" }}>Mark Attendance</th>
                    </tr>
                </thead>
                <tbody>
                    {attendanceRecords.map((rec, i) => {
                        const student = students.find((s) => s._id === rec.student);
                        return (
                            <tr
                                key={rec.student}
                                style={{
                                    backgroundColor: i % 2 === 0 ? "#ffffff" : "#f9fafb",
                                    borderBottom: "1px solid #eee",
                                }}
                            >
                                <td style={{ padding: "10px" }}>{student?.name}</td>
                                <td style={{ padding: "10px" }}>
                                    <RadioGroup
                                        orientation="horizontal"
                                        value={rec.status}
                                        onChange={(e) =>
                                            updateStatus(rec.student, e.target.value as AttendanceStatus)
                                        }
                                        sx={{ gap: 2 }}
                                    >
                                        {/* Present */}
                                        <Sheet
                                            variant={rec.status === "present" ? "soft" : "outlined"}
                                            color="success"
                                            sx={{
                                                p: 1,
                                                borderRadius: "md",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Radio value="present" disableIcon overlay />
                                            <CheckCircleIcon
                                                color={rec.status === "present" ? "success" : "disabled"}
                                            />
                                        </Sheet>

                                        {/* Absent */}
                                        <Sheet
                                            variant={rec.status === "absent" ? "soft" : "outlined"}
                                            color="danger"
                                            sx={{
                                                p: 1,
                                                borderRadius: "md",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Radio value="absent" disableIcon overlay />
                                            <CancelIcon
                                                color={rec.status === "absent" ? "error" : "disabled"}
                                            />
                                        </Sheet>

                                        {/* Late */}
                                        <Sheet
                                            variant={rec.status === "late" ? "soft" : "outlined"}
                                            color="warning"
                                            sx={{
                                                p: 1,
                                                borderRadius: "md",
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <Radio value="late" disableIcon overlay />
                                            <AccessTimeIcon
                                                color={rec.status === "late" ? "warning" : "disabled"}
                                            />
                                        </Sheet>
                                    </RadioGroup>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            </Sheet>

            {/* Summary */}
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                    gap: 1.5,
                    mt: 1,
                    mb: 1,
                }}
            >
                <Sheet variant="soft" color="success" sx={{ p: 1, borderRadius: "md", textAlign: "center" }}>
                    <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Present: {presentCount}
                </Sheet>

                <Sheet variant="soft" color="danger" sx={{ p: 1, borderRadius: "md", textAlign: "center" }}>
                    <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Absent: {absentCount}
                </Sheet>

                <Sheet variant="soft" color="warning" sx={{ p: 1, borderRadius: "md", textAlign: "center" }}>
                    <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                    Late: {lateCount}
                </Sheet>
            </Box>

            <Button type="submit" sx={{ mt: 2 }}>
                Submit Attendance
            </Button>
        </Box>
        </Box>
    );
}
