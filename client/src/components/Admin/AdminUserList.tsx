import { Box, Button, Typography } from "@mui/material";
import type { User } from "../../types/admin";
import "../../styles/adminUserList.css";

interface AdminUserListProps {
  users: User[];
  title?: string;
  onDelete?: (id: number) => void;
  onlyEmail?: boolean;
  showEventName?: boolean;
}

export default function AdminUserList({
  users,
  title,
  onDelete,
  onlyEmail = false,
  showEventName = false,
}: AdminUserListProps) {
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
              {onlyEmail ? (
                <th>Email</th>
              ) : (
                <>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  {showEventName && <th>Événement</th>}
                </>
              )}
              {onDelete && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {safeUsers.map((user, index) => (
              <tr
                key={`${user.email}-${user.eventName || "newsletter"}-${index}`}
              >
                {onlyEmail ? (
                  <td>{user.email}</td>
                ) : (
                  <>
                    <td>{user.lastName}</td>
                    <td>{user.firstName}</td>
                    <td>{user.email}</td>
                    {showEventName && <td>{user.eventName || "N/A"}</td>}
                  </>
                )}
                {onDelete && (
                  <td>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => {
                        if (user.id !== undefined) {
                          onDelete(user.id as number);
                        } else {
                          console.error(
                            "ID utilisateur manquant pour suppression",
                            user,
                          );
                        }
                      }}
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
}
