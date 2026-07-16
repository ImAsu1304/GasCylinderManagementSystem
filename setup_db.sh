#!/bin/bash
# QuickCylinder Database Setup Script
# Run this with: sudo bash setup_db.sh

mariadb -e "
CREATE DATABASE IF NOT EXISTS quickcylinder CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'quickcylinder'@'localhost' IDENTIFIED BY 'QuickCyl2025!';
GRANT ALL PRIVILEGES ON quickcylinder.* TO 'quickcylinder'@'localhost';
FLUSH PRIVILEGES;
SELECT 'QuickCylinder database setup complete!' AS status;
"
