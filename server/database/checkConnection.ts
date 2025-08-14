import client from "./client";

// Try to get a connection to the database
client
  .getConnection()
  .then(async (connection) => {
    console.info(`Using database ${process.env.DB_NAME || "railway"}`);

    // Créer automatiquement les tables si elles n'existent pas
    try {
      console.info("Creating database tables if they don't exist...");

      // Table admin
      await client.query(`
        CREATE TABLE IF NOT EXISTS admin (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.info("✅ Admin table ready");

      // Table event
      await client.query(`
        CREATE TABLE IF NOT EXISTS event (
          id INT PRIMARY KEY AUTO_INCREMENT,
          title VARCHAR(100) NOT NULL,
          description TEXT NOT NULL,
          date DATETIME NOT NULL,
          endTime DATETIME NOT NULL,
          location VARCHAR(255),
          max_participants INT DEFAULT NULL,
          image_url VARCHAR(500),
          status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'published',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);
      console.info("✅ Event table ready");

      // Table newsletter
      await client.query(`
        CREATE TABLE IF NOT EXISTS newsletter (
          id INT PRIMARY KEY AUTO_INCREMENT,
          email VARCHAR(255) UNIQUE NOT NULL,
          date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      console.info("✅ Newsletter table ready");

      // Table user_event
      await client.query(`
        CREATE TABLE IF NOT EXISTS user_event (
          id INT PRIMARY KEY AUTO_INCREMENT,
          firstName VARCHAR(100) NOT NULL,
          lastName VARCHAR(100) NOT NULL,
          email VARCHAR(255) NOT NULL,
          event_id INT NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
          UNIQUE (email, event_id)
        )
      `);
      console.info("✅ User_event table ready");

      console.info("🎉 All database tables initialized successfully!");
    } catch (tableError) {
      console.warn("⚠️ Error creating tables:", tableError);
    }

    connection.release();
  })
  .catch((error: Error) => {
    console.warn(
      "Warning:",
      "Failed to establish a database connection.",
      "Please check your database credentials in the .env file if you need a database access.",
    );
    console.warn(error.message);
  });
