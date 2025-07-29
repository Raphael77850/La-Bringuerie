import { Box, Button, Typography } from "@mui/material";
import type React from "react";
import type { User } from "../../types/admin";
import "../../styles/adminUserList.css";

interface AdminUserListProps {
  users: User[];
  title?: string;
  onDelete?: (id: number) => void;
}

const AdminUserList: React.FC<AdminUserListProps> = ({
  users,
  title,
  onDelete,
}) => {
  const safeUsers = Array.isArray(users) ? users : [];
  return (
    <Box className="admin-user-list">
      {title && <Typography variant="h5">{title}</Typography>}
      {safeUsers.length === 0 ? (
        <Typography>Aucun utilisateur.</Typography>
      ) : (
        <table className="admin-user-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Email</th>
              {onDelete && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {safeUsers.map((user) => (
              <tr key={user.email}>
                <td>{user.lastName}</td>
                <td>{user.firstName}</td>
                <td>{user.email}</td>
                {onDelete && user.id !== undefined && (
                  <td>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => onDelete(user.id as number)}
                    >
                      Supprimer
                    </Button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Box>
  );
};

export default AdminUserList;
