CREATE TABLE user (
<<<<<<< HEAD
  id int primary key auto_increment,
  firstName varchar(255) not null,
  lastName varchar(255) not null,
  email varchar(255) not null
);

CREATE TABLE event (
  id int primary key auto_increment,
  image varchar(255) not null,
  title varchar(255) not null,
  description text not null,
  date datetime not null
);

CREATE TABLE user_event (
  id int primary key auto_increment,
  firstName varchar(255) not null,
  lastName varchar(255) not null,
  email varchar(255) not null,
  event_id int not null,
  created_at timestamp default current_timestamp,
  foreign key (event_id) references event(id)
);

CREATE TABLE admin (
  id int primary key auto_increment,
  name varchar(255) not null,
  role varchar(255) not null,
  biographie text not null,
  photo varchar(255) not null
);

CREATE TABLE admin_event (
  admin_id int not null,
  event_id int not null,
  primary key (admin_id, event_id),
  foreign key (admin_id) references admin(id),
  foreign key (event_id) references event(id)
);

CREATE TABLE newsletter (
  id int primary key auto_increment,
  firstName varchar(255) not null,
  lastName varchar(255) not null,
  email varchar(255) not null
);
=======
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE event (
  id INT PRIMARY KEY AUTO_INCREMENT,
  image VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  date DATETIME NOT NULL
);

CREATE TABLE user_event (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  event_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES event(id)
);

CREATE TABLE admin (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  biographie TEXT NOT NULL,
  photo VARCHAR(255) NOT NULL
);

CREATE TABLE admin_event (
  admin_id INT NOT NULL,
  event_id INT NOT NULL,
  PRIMARY KEY (admin_id, event_id),
  FOREIGN KEY (admin_id) REFERENCES admin(id),
  FOREIGN KEY (event_id) REFERENCES event(id)
);

CREATE TABLE newsletter (
  id INT PRIMARY KEY AUTO_INCREMENT,
  firstName VARCHAR(255) NOT NULL,
  lastName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  date_inscription DATETIME DEFAULT CURRENT_TIMESTAMP
);
>>>>>>> 68c12957948efd9e2c39e50613409a6a19efb773
