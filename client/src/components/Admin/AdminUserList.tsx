import { Box, Typography } from "@mui/material";
import type React from "react";
import type { User } from "../../types/admin";
import "../../styles/adminUserList.css";

interface AdminUserListProps {
  users: User[];
  title?: string;
}

const AdminUserList: React.FC<AdminUserListProps> = ({ users, title }) => (
  <Box className="admin-user-list">
    {title && <Typography variant="h6">{title}</Typography>}
    {users.length === 0 ? (
      <Typography>Aucun utilisateur.</Typography>
    ) : (
      <table className="admin-user-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.lastName}</td>
              <td>{user.firstName}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    )}
  </Box>
);

export default AdminUserList;
