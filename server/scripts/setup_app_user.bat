@echo off
:: Script de création d'un utilisateur dédié pour l'application

:: Demander les informations pour l'utilisateur root (administrateur MySQL)
set /p ROOT_USER=Entrez l'utilisateur MySQL avec des privilèges administratifs (par défaut: root): 
if "%ROOT_USER%"=="" set ROOT_USER=root

set /p ROOT_PASSWORD=Entrez le mot de passe pour %ROOT_USER%: 

:: Chemin vers le fichier .env
set ENV_FILE=C:\Users\rapha\Documents\Projet-Dev\Projet_Bringuerie\La-Bringuerie\server\.env

:: Lecture du nom de la base de données depuis le fichier .env
for /f "tokens=1,2 delims==" %%a in ('type "%ENV_FILE%" ^| findstr "DB_NAME"') do (
    set DB_NAME=%%b
)

:: Chemin vers le fichier SQL
set SQL_FILE=C:\Users\rapha\Documents\Projet-Dev\Projet_Bringuerie\La-Bringuerie\server\scripts\create_app_user.sql

:: Afficher le message de début
echo Création de l'utilisateur pour l'application La Bringuerie...

:: Exécuter le script SQL
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -h localhost -u %ROOT_USER% -p%ROOT_PASSWORD% < "%SQL_FILE%"

:: Vérifier si l'opération a réussi
IF %ERRORLEVEL% EQU 0 (
    echo Utilisateur créé avec succès!
    echo N'oubliez pas de mettre à jour votre fichier .env avec les nouvelles informations de connexion:
    echo DB_USER=bringuerie_app
    echo DB_PASSWORD=MotDePasseSecurise123!
) ELSE (
    echo Échec de la création de l'utilisateur! Vérifiez les paramètres et les permissions.
)

echo Opération terminée.
pause