import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchStudents, createStudent } from "../../app/slices/studentSlice";
import { fetchDepartments } from "../../app/slices/departmentSlice";
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

export default function StudentList() {
  const dispatch = useDispatch<AppDispatch>();
  const { students, isLoading } = useSelector(
    (state: RootState) => state.student
  );
  const { departments, isLoading: deptLoading } = useSelector(
    (state: RootState) => state.department
  );

  const [formData, setFormData] = React.useState({
    name: "",
    rollNumber: "",
    department: "",
    contactDetails: { email: "", phone: "" },
    dateOfJoining: "",
  });

  React.useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createStudent(formData));
    setFormData({
      name: "",
      rollNumber: "",
      department: "",
      contactDetails: { email: "", phone: "" },
      dateOfJoining: "",
    });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography level="h4" sx={{ mb: 2 }}>
        Student List
      </Typography>

      {isLoading && <CircularProgress />}

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
          name="department"
          value={formData.department}
          onChange={(_, value) =>
            setFormData((prev) => ({ ...prev, department: value || "" }))
          }
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

      <Table borderAxis="bothBetween" size="sm" sx={{ minWidth: 800 }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Roll Number</th>
            <th>Department</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of Joining</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(students) && students.length > 0 ? (
            students.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.rollNumber}</td>
                <td>{student.department}</td>
                <td>{student.contactDetails.email}</td>
                <td>{student.contactDetails.phone}</td>
                <td>{new Date(student.dateOfJoining).toLocaleDateString()}</td>
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
