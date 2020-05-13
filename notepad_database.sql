-- Reset admin password, if needed
-- ALTER USER 'admin' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd'

-- Create the database schema
DROP DATABASE IF EXISTS notepad;
CREATE DATABASE notepad DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

-- Create the database table
DROP TABLE IF EXISTS notepad.notes;
CREATE TABLE notepad.notes (
  _id int NOT NULL AUTO_INCREMENT,
  title varchar(100) NOT NULL DEFAULT '',
  body varchar(1000) NOT NULL DEFAULT '',
  PRIMARY KEY (_id)
);

-- Populate the table with some data
TRUNCATE TABLE notepad.notes;
INSERT notepad.notes (title, body) 
VALUES 
('Note 1', 'My note text'),
('Note 2', 'My note text'),
('Note 3', 'My note text'),
('Note 4', 'My note text'),
('Note 5', 'My note text'),
('Note 6', 'My note text');