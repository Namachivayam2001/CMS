// SidebarItems.tsx
import List from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListItemButton from "@mui/joy/ListItemButton";
import { Link } from "react-router-dom";

export default function SidebarItems({ Role, onItemClick, }: { Role?: string; onItemClick?: () => void; }) {
    let items: { name: string; path: string }[] = [];

    switch (Role) {
        case "Admin":
        items = [
            { name: "Dashboard", path: "/dashboard/admin" },
            { name: "Manage Students", path: "/dashboard/admin/student-list" },
            { name: "Manage Teachers", path: "/dashboard/admin/teacher-list" },
            { name: "Manage HODs", path: "/dashboard/admin/hod-list" },
            { name: "Manage Departments", path: "/dashboard/admin/department-list" },
            { name: "Manage Courses", path: "/dashboard/admin/course-list" },
            { name: "Manage Enrollments", path: "/dashboard/admin/enrollment-list" },
            { name: "Fees Management", path: "/dashboard/admin/fees" },
            { name: "Attendance", path: "/dashboard/admin/attendance" },
            { name: "Exams", path: "/dashboard/admin/exams" },
        ];
        break;

        case "HOD":
        items = [
            { name: "Dashboard", path: "/dashboard/hod" },
            { name: "Department Students", path: "/dashboard/hod/student-list" },
            { name: "Department Teachers", path: "/dashboard/hod/teacher-list" },
            { name: "Attendance", path: "/dashboard/hod/attendance" },
        ];
        break;

        case "Teacher":
        items = [
            { name: "Dashboard", path: "/dashboard/teacher" },
            { name: "My Classes", path: "/dashboard/teacher/classes" },
            { name: "Exam Duties", path: "/dashboard/teacher/exams" },
        ];
        break;

        case "Student":
        default:
        items = [
            { name: "Dashboard", path: "/dashboard/student" },
            { name: "My Attendance", path: "/dashboard/student/attendance" },
            { name: "My Fees", path: "/dashboard/student/fees" },
            { name: "Exams", path: "/dashboard/student/exams" },
        ];
        break;
    }

    return (
        <List>
        {items.map((item) => (
            <ListItem key={item.name}>
            <ListItemButton
                component={Link}
                to={item.path}
                onClick={onItemClick}
            >
                {item.name}
            </ListItemButton>
            </ListItem>
        ))}
        </List>
    );
}
