-- Create the schema named ppl
CREATE SCHEMA IF NOT EXISTS ppl DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Use the ppl schema
USE ppl;

-- Drop tables if they already exist to avoid duplication errors
DROP TABLE IF EXISTS ppl.tasks;
DROP TABLE IF EXISTS ppl.users;

-- Create the users table
CREATE TABLE ppl.users (
    id VARCHAR(255) PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    hashed_password VARCHAR(255),
    INDEX idx_username (username)
);

-- Create the tasks table
CREATE TABLE ppl.tasks (
    id VARCHAR(36) NOT NULL PRIMARY KEY,
    owner_id VARCHAR(36),
    title VARCHAR(255) NOT NULL,
    task_date DATE,
    task_time TIME,
    rrule VARCHAR(255),
    status ENUM('pending','done') DEFAULT 'pending',
    FOREIGN KEY (owner_id) REFERENCES ppl.users(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4; 