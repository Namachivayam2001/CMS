import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import {
  fetchAcademicYears,
  createAcademicYear,
} from "../../app/slices/academicYearSlice";
import { toast } from "react-toastify";
import {
  Table,
  Box,
  Input,
  Button,
  Typography,
  CircularProgress,
  Checkbox,
} from "@mui/joy";

export default function AcademicYearList() {
  const dispatch = useDispatch<AppDispatch>();
  const { academicYears, isLoading, message, isError } = useSelector(
    (state: RootState) => state.academicYear
  ) as RootState["academicYear"];

  const [formData, setFormData] = React.useState({
    year: "",
    isActive: true,
  });

  React.useEffect(() => {
    dispatch(fetchAcademicYears());
    if (isError) toast.error(message);
  }, [dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.year.trim()) {
      toast.error("Year is required (e.g., 2024-2025)");
      return;
    }
    try {
      const result = await dispatch(createAcademicYear(formData)).unwrap();
      if (result?.success) {
        toast.success(`Academic Year ${result.data.academicYear.year} created`);
      }
      setFormData({ year: "", isActive: true });
    } catch (err) {
      toast.error((err as string) || "Failed to create academic year");
    }
  };

  return (
    <Box sx={{ position: "relative", p: 2 }}>
      {isLoading && (
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
        Academic Year List
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 1,
          mb: 2,
        }}
      >
        <Input
          name="year"
          placeholder="2024-2025"
          value={formData.year}
          onChange={handleChange}
          required
          size="sm"
        />
        <Checkbox
          name="isActive"
          checked={formData.isActive}
          onChange={handleChange}
          label="Active"
          size="sm"
        />
        <Button type="submit" size="sm">
          Add
        </Button>
      </Box>

      <Table borderAxis="bothBetween" size="sm" sx={{ minWidth: 600 }}>
        <thead>
          <tr>
            <th>Year</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(academicYears) && academicYears.length > 0 ? (
            academicYears.map((year) => (
              <tr key={year._id}>
                <td>{year.year}</td>
                <td>{year.isActive ? "Yes" : "No"}</td>
                <td>–</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                No academic years found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Box>
  );
}
