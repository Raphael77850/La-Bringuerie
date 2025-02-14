CREATE TABLE user (
  id int primary key auto_increment,
  firstName varchar(255) not null,
  lastName varchar(255) not null,
  email varchar(255) not null
);

CREATE TABLE event (
  id int primary key auto_increment,
  title varchar(255) not null,
  description text not null,
  date datetime not null
);

CREATE TABLE user_event (
  id int primary key auto_increment,
  user_id int not null,
  event_id int not null,
  foreign key (user_id) references user(id),
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