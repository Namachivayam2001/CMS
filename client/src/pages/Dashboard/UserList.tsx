import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchUsers } from "../../app/slices/userSlice";
import { toast } from "react-toastify";
import {
  Table,
  Box,
  Typography,
  CircularProgress,
} from "@mui/joy";

export default function UserList() {
  const dispatch = useDispatch<AppDispatch>();
  const { users, isLoading, isError, message } = useSelector((state: RootState) => state.user);

  React.useEffect(() => {
    dispatch(fetchUsers());
    isError && toast.error(message);
  }, [dispatch]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography level="h4" sx={{ mb: 2 }}>
        User List
      </Typography>

      {isLoading && <CircularProgress />}

      <Table 
        borderAxis="bothBetween" 
        size="sm" 
        sx={{ minWidth: 800 }}
      >
        <thead>
          <tr>
            <th>Username</th>
            <th>Role</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(users) && users.length > 0 ? (
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.role}</td>
                <td>{(user.lastLogin) ? new Date(user.lastLogin).toLocaleDateString() : "Not Login Yet"}</td>
                <td>–</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </Box>
  );
}
