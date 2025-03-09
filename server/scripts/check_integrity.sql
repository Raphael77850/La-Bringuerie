-- Fichier: check_integrity.sql
-- Description: Vérification de l'intégrité référentielle de la base de données La Bringuerie
-- Date: 9 mars 2025

-- Sélectionner la base de données
USE bringuerie;

-- Section 1: Vérification des clés étrangères orphelines

-- 1.1 Vérifier les enregistrements user_event référençant des événements inexistants
SELECT 
    ue.id AS user_event_id, 
    ue.firstName, 
    ue.lastName, 
    ue.email, 
    ue.event_id,
    'Événement inexistant' AS problème
FROM 
    user_event ue
LEFT JOIN 
    event e ON ue.event_id = e.id
WHERE 
    e.id IS NULL;

-- 1.2 Vérifier les enregistrements admin_event référençant des événements inexistants
SELECT 
    ae.admin_id, 
    ae.event_id,
    'Événement inexistant' AS problème
FROM 
    admin_event ae
LEFT JOIN 
    event e ON ae.event_id = e.id
WHERE 
    e.id IS NULL;

-- 1.3 Vérifier les enregistrements admin_event référençant des administrateurs inexistants
SELECT 
    ae.admin_id, 
    ae.event_id,
    'Administrateur inexistant' AS problème
FROM 
    admin_event ae
LEFT JOIN 
    admin a ON ae.admin_id = a.id
WHERE 
    a.id IS NULL;

-- Section 2: Vérification de la cohérence des données

-- 2.1 Événements avec dates incohérentes (fin avant début)
SELECT 
    id, 
    title,
    date AS date_début,
    endTime AS date_fin,
    'Date de fin avant date de début' AS problème
FROM 
    event
WHERE 
    endTime < date;

-- 2.2 Événements sans inscriptions
SELECT 
    e.id, 
    e.title,
    'Aucune inscription' AS remarque
FROM 
    event e
LEFT JOIN 
    user_event ue ON e.id = ue.event_id
WHERE 
    ue.id IS NULL;

-- 2.3 Adresses email dupliquées dans la newsletter
SELECT 
    email, 
    COUNT(*) AS occurrences,
    'Email dupliqué dans newsletter' AS problème
FROM 
    newsletter
GROUP BY 
    email
HAVING 
    COUNT(*) > 1;

-- Section 3: Vérification des contraintes d'intégrité

-- 3.1 Résumé des tables et nombre d'enregistrements
SELECT 
    'event' AS table_name, 
    COUNT(*) AS record_count 
FROM 
    event
UNION
SELECT 
    'user_event' AS table_name, 
    COUNT(*) AS record_count 
FROM 
    user_event
UNION
SELECT 
    'admin' AS table_name, 
    COUNT(*) AS record_count 
FROM 
    admin
UNION
SELECT 
    'admin_event' AS table_name, 
    COUNT(*) AS record_count 
FROM 
    admin_event
UNION
SELECT 
    'newsletter' AS table_name, 
    COUNT(*) AS record_count 
FROM 
    newsletter;

-- 3.2 Vérifier si les statuts des événements sont valides
SELECT 
    id, 
    title, 
    status,
    'Statut invalide' AS problème
FROM 
    event 
WHERE 
    status NOT IN ('draft', 'published', 'cancelled', 'completed');
