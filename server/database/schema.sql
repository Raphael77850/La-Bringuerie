CREATE TABLE event (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image_url VARCHAR(500),
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  date DATETIME NOT NULL,
  endTime DATETIME NOT NULL,
  location VARCHAR(255),
  max_participants INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  status ENUM('draft', 'published', 'cancelled', 'completed') DEFAULT 'published',
  CHECK (endTime > date)
);

CREATE TABLE user_event (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(100) NOT NULL,
  lastName VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  event_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE,
  UNIQUE (email, event_id),
  CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

CREATE TABLE admin_event (
  admin_id INT NOT NULL,
  event_id INT NOT NULL,
  PRIMARY KEY (admin_id, event_id),
  FOREIGN KEY (admin_id) REFERENCES admin(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES event(id) ON DELETE CASCADE
);

CREATE TABLE newsletter (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP,
  CHECK (email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);
