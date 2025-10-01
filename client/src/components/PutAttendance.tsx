import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { fetchStudents } from "../app/slices/studentSlice";
import { fetchCourses } from "../app/slices/courseSlice";
import { createAttendance } from "../app/slices/attendanceSlice";
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

  const { students } = useSelector(
    (state: RootState) => state.student
  ) as RootState["student"];
  const { courses, isLoading: courseLoading } = useSelector(
    (state: RootState) => state.course
  ) as RootState["course"];

  const [selectedCourse, setSelectedCourse] = React.useState<string>("");
  const [attendanceDate, setAttendanceDate] = React.useState<Date>(new Date());
  const [attendanceRecords, setAttendanceRecords] = React.useState<
    { student: string; status: AttendanceStatus }[]
  >([]);

  // Fetch students and courses on mount
  React.useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchCourses());
  }, [dispatch]);

  // Update attendance records when course or students change
  React.useEffect(() => {
    if (selectedCourse && students.length) {
      // Filter students enrolled in the selected course
      const courseStudents = students.filter(
        (s) => s.courses?.includes(selectedCourse)
      );

      setAttendanceRecords(
        courseStudents.map((s) => ({
          student: s._id as string,
          status: "absent",
        }))
      );
    } else {
      setAttendanceRecords([]);
    }
  }, [selectedCourse, students]);

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
    if (!selectedCourse) return toast.error("Select a course");

    try {
      await dispatch(
        createAttendance({
          course: selectedCourse,
          date: attendanceDate.toISOString().slice(0, 10),
          records: attendanceRecords,
        })
      ).unwrap();
      toast.success("Attendance submitted successfully");
    } catch (err) {
      toast.error("Failed to submit attendance");
    }
  };

  const presentCount = attendanceRecords.filter((r) => r.status === "present").length;
  const absentCount = attendanceRecords.filter((r) => r.status === "absent").length;
  const lateCount = attendanceRecords.filter((r) => r.status === "late").length;

  return (
    <Box sx={{ p: 2 }}>
      <Typography level="h4" sx={{ mb: 2 }}>
        Take Attendance
      </Typography>

      <Box component="form" onSubmit={handleSubmit} sx={{ display: "grid", gap: 2 }}>
        {/* Course, Date & Bulk Actions */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "200px 150px 1fr" },
            gap: 2,
            alignItems: "center",
          }}
        >
          <Select
            value={selectedCourse}
            onChange={(_, val) => setSelectedCourse(val ?? "")}
            placeholder={courseLoading ? "Loading courses..." : "Select Course"}
            required
            sx={{ width: "100%" }}
          >
            {courses.map((c) => (
              <Option key={c._id} value={c._id}>
                {c.name}
              </Option>
            ))}
          </Select>

          <Input
            type="date"
            value={attendanceDate.toISOString().slice(0, 10)}
            onChange={(e) => setAttendanceDate(new Date(e.target.value))}
            size="sm"
            sx={{ width: "100%" }}
          />

          <Box sx={{ display: "flex", gap: 1, justifyContent: { xs: "flex-start", md: "flex-end" } }}>
            <Button variant="outlined" size="sm" onClick={() => markAll("present")}>
              Mark All Present
            </Button>
            <Button variant="outlined" size="sm" onClick={() => markAll("absent")}>
              Mark All Absent
            </Button>
            <Button variant="outlined" size="sm" onClick={() => markAll("late")}>
              Mark All Late
            </Button>
          </Box>
        </Box>

        {/* Attendance Table */}
        <Sheet variant="outlined" sx={{ borderRadius: "md", overflow: "hidden", border: "1px solid", borderColor: "neutral.outlinedBorder" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ backgroundColor: "#f5f5f5", textAlign: "left" }}>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Student</th>
                <th style={{ padding: "12px", borderBottom: "1px solid #ddd" }}>Mark Attendance</th>
              </tr>
            </thead>
            <tbody>
              {attendanceRecords.map((rec, index) => {
                const student = students.find((s) => s._id === rec.student);
                return (
                  <tr key={rec.student} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb", borderBottom: "1px solid #eee" }}>
                    <td style={{ padding: "10px" }}>{student?.name}</td>
                    <td style={{ padding: "10px" }}>
                      <RadioGroup
                        orientation="horizontal"
                        value={rec.status}
                        onChange={(event) => updateStatus(rec.student, event.target.value as AttendanceStatus)}
                        sx={{ gap: 2 }}
                      >
                        {/* Present */}
                        <Sheet variant={rec.status === "present" ? "soft" : "outlined"} color={rec.status === "present" ? "success" : "neutral"} sx={{ p: 1, borderRadius: "md", display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <Radio value="present" checked={rec.status === "present"} variant="outlined" overlay disableIcon />
                          <CheckCircleIcon color={rec.status === "present" ? "success" : "disabled"} />
                        </Sheet>

                        {/* Absent */}
                        <Sheet variant={rec.status === "absent" ? "soft" : "outlined"} color={rec.status === "absent" ? "danger" : "neutral"} sx={{ p: 1, borderRadius: "md", display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <Radio value="absent" checked={rec.status === "absent"} variant="outlined" overlay disableIcon />
                          <CancelIcon color={rec.status === "absent" ? "error" : "disabled"} />
                        </Sheet>

                        {/* Late */}
                        <Sheet variant={rec.status === "late" ? "soft" : "outlined"} color={rec.status === "late" ? "warning" : "neutral"} sx={{ p: 1, borderRadius: "md", display: "flex", alignItems: "center", cursor: "pointer" }}>
                          <Radio value="late" checked={rec.status === "late"} variant="outlined" overlay disableIcon />
                          <AccessTimeIcon color={rec.status === "late" ? "warning" : "disabled"} />
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
        <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 1.5, mt: 1, mb: 1 }}>
          <Sheet variant="soft" color="success" sx={{ px: 2, py: 0.5, borderRadius: "md", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography level="body-sm">Present: {presentCount}</Typography>
          </Sheet>

          <Sheet variant="soft" color="danger" sx={{ px: 2, py: 0.5, borderRadius: "md", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CancelIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography level="body-sm">Absent: {absentCount}</Typography>
          </Sheet>

          <Sheet variant="soft" color="warning" sx={{ px: 2, py: 0.5, borderRadius: "md", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
            <Typography level="body-sm">Late: {lateCount}</Typography>
          </Sheet>
        </Box>

        <Button type="submit" sx={{ mt: 2 }}>
          Submit Attendance
        </Button>
      </Box>
    </Box>
  );
}
