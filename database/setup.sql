-- Créer l'utilisateur africar_user avec le mot de passe
CREATE USER IF NOT EXISTS 'africar_user'@'localhost' IDENTIFIED BY 'africar2024';

-- Créer la base de données
CREATE DATABASE IF NOT EXISTS africar_db;

-- Donner tous les privilèges à l'utilisateur sur la base de données
GRANT ALL PRIVILEGES ON africar_db.* TO 'africar_user'@'localhost';

-- Appliquer les changements
FLUSH PRIVILEGES;
