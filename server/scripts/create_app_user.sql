-- Fichier: create_app_user.sql
-- Description: Création d'un utilisateur dédié pour l'application La Bringuerie
-- Date: 9 mars 2025

-- Supprimer l'utilisateur s'il existe déjà (facultatif)
DROP USER IF EXISTS 'bringuerie_app'@'localhost';

-- Créer un nouvel utilisateur avec un mot de passe sécurisé
CREATE USER 'bringuerie_app'@'localhost' IDENTIFIED BY 'MotDePasseSecurise123!';

-- Accorder uniquement les privilèges nécessaires
-- Lecture/écriture sur toutes les tables
GRANT SELECT, INSERT, UPDATE, DELETE ON bringuerie.* TO 'bringuerie_app'@'localhost';

-- Permettre l'utilisation de LOCK TABLES pour les sauvegardes
GRANT LOCK TABLES ON bringuerie.* TO 'bringuerie_app'@'localhost';

-- Ne pas permettre la création ou destruction de tables
REVOKE CREATE, DROP, ALTER, REFERENCES, INDEX, CREATE VIEW, CREATE ROUTINE, 
       ALTER ROUTINE, EVENT, TRIGGER, EXECUTE
ON bringuerie.* FROM 'bringuerie_app'@'localhost';

-- Appliquer les modifications de privilèges
FLUSH PRIVILEGES;

-- Afficher les privilèges accordés pour vérification
SHOW GRANTS FOR 'bringuerie_app'@'localhost';