@echo off
:: Script d'exécution de la vérification d'intégrité

:: Chemin vers le fichier .env
set ENV_FILE=C:\Users\rapha\Documents\Projet-Dev\Projet_Bringuerie\La-Bringuerie\server\.env

:: Lecture des paramètres de connexion depuis le fichier .env
for /f "tokens=1,2 delims==" %%a in ('type "%ENV_FILE%" ^| findstr /r "^DB_"') do (
    set %%a=%%b
)

:: Chemin vers le fichier SQL
set SQL_FILE=C:\Users\rapha\Documents\Projet-Dev\Projet_Bringuerie\La-Bringuerie\server\scripts\check_integrity.sql

:: Chemin du fichier de sortie
set OUTPUT_DIR=C:\Users\rapha\Documents\Projet-Dev\Projet_Bringuerie\La-Bringuerie\server\reports
set OUTPUT_FILE=%OUTPUT_DIR%\integrity_check.txt

:: Créer le répertoire de rapport s'il n'existe pas
if not exist "%OUTPUT_DIR%" mkdir "%OUTPUT_DIR%"

:: Afficher le message de début
echo Exécution de la vérification d'intégrité de la base de données %DB_NAME%...

:: Exécuter la vérification et enregistrer les résultats dans un fichier
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% -e "source %SQL_FILE%" > "%OUTPUT_FILE%" 2>&1

:: Vérifier si la vérification a réussi
IF %ERRORLEVEL% EQU 0 (
    echo Vérification d'intégrité terminée avec succès.
    echo Les résultats ont été enregistrés dans: %OUTPUT_FILE%
    
    :: Ouvrir le fichier de résultats
    start notepad "%OUTPUT_FILE%"
) ELSE (
    echo Échec de la vérification d'intégrité! Vérifiez les paramètres et les permissions.
)

echo Opération terminée.
pause