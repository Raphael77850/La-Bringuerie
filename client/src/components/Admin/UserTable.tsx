import { Box, Typography } from "@mui/material";
import type { User } from "../../types/admin";

interface Props {
  title: string;
  users: User[];
  showEventName?: boolean;
}

export function UserTable({ title, users, showEventName }: Props) {
  return (
    <Box sx={{ marginBottom: 4 }}>
      <Typography
        variant="h5"
        sx={{ marginBottom: 1, fontFamily: "'Francois One', serif" }}
      >
        {title}
      </Typography>
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 2 }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            <th
              style={{
                padding: 8,
                textAlign: "left",
                borderBottom: "1px solid #ddd",
              }}
            >
              Prénom
            </th>
            <th
              style={{
                padding: 8,
                textAlign: "left",
                borderBottom: "1px solid #ddd",
              }}
            >
              Nom
            </th>
            <th
              style={{
                padding: 8,
                textAlign: "left",
                borderBottom: "1px solid #ddd",
              }}
            >
              Email
            </th>
            {showEventName && (
              <th
                style={{
                  padding: 8,
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Événement
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.email + (user.eventName || "")}
              style={{
                background: users.indexOf(user) % 2 === 0 ? "white" : "#fafafa",
              }}
            >
              <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                {user.firstName}
              </td>
              <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                {user.lastName}
              </td>
              <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                {user.email}
              </td>
              {showEventName && (
                <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  {user.eventName}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
