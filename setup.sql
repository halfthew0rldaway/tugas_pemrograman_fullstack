-- Setup database untuk tugas fullstack
-- Jalankan di phpMyAdmin atau MySQL CLI

CREATE DATABASE IF NOT EXISTS fullstack;

USE fullstack;

CREATE TABLE IF NOT EXISTS users (
    id       INT AUTO_INCREMENT PRIMARY KEY,
    name     VARCHAR(100) NOT NULL,
    email    VARCHAR(100) NOT NULL UNIQUE,
    phone    VARCHAR(20),
    password VARCHAR(255) NOT NULL
);

-- Contoh data dummy (opsional)
-- Password semua: "password123" (sudah di-hash via bcrypt, generate manual)
