import { Box, Typography } from "@mui/material";
import type { User } from "../../types/admin";
import "../../styles/admin.css";

interface Props {
  title: string;
  users: User[];
  showEventName?: boolean;
  onlyEmail?: boolean;
}

export function UserTable({ title, users, showEventName, onlyEmail }: Props) {
  // Générer la liste des emails pour le mailto
  const allEmails = users.map((u) => u.email).join(",");
  const mailtoLink = `mailto:?bcc=${encodeURIComponent(allEmails)}&subject=${encodeURIComponent(
    "Newsletter La Bringuerie",
  )}`;

  return (
    <Box className="admin-section">
      <Typography
        variant="h5"
        sx={{ marginBottom: 1, fontFamily: "'Francois One', serif" }}
      >
        {title}
      </Typography>
      {onlyEmail && users.length > 0 && <a href={mailtoLink}>Contacter tous</a>}
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginTop: 2 }}
      >
        <thead>
          <tr style={{ background: "#f5f5f5" }}>
            {onlyEmail ? (
              <th
                style={{
                  padding: 8,
                  textAlign: "left",
                  borderBottom: "1px solid #ddd",
                }}
              >
                Email
              </th>
            ) : (
              <>
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
              </>
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
              {onlyEmail ? (
                <td style={{ padding: 8, borderBottom: "1px solid #ddd" }}>
                  {user.email}
                </td>
              ) : (
                <>
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
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
}
