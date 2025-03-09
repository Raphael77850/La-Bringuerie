@echo off
:: Script de sauvegarde pour MySQL utilisant les infos du fichier .env
setlocal EnableDelayedExpansion

:: Chemin vers le fichier .env
set ENV_FILE=C:\Users\rapha\Documents\Projet-Dev\Projet_Bringuerie\La-Bringuerie\server\.env

:: Lecture des paramètres de connexion depuis le fichier .env
for /f "tokens=1,2 delims==" %%a in ('type "%ENV_FILE%" ^| findstr /r "^DB_"') do (
    set %%a=%%b
)

:: Répertoire de sauvegarde (chemin absolu)
set BACKUP_DIR=C:\Users\rapha\Documents\Projet-Dev\Projet_Bringuerie\La-Bringuerie\server\backups

:: Créer le répertoire de sauvegarde s'il n'existe pas
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

:: Définir le nom du fichier avec la date et l'heure
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
  set DATE=%%d-%%b-%%c
)
for /f "tokens=1,2 delims=: " %%a in ('time /t') do (
  set TIME=%%a%%b
)
set BACKUP_FILE=%BACKUP_DIR%\backup_%DATE%_%TIME%.sql

:: Afficher le message de début
echo Démarrage de la sauvegarde de la base de données %DB_NAME%...

:: Exécuter la sauvegarde
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysqldump.exe" -h %DB_HOST% -u %DB_USER% -p%DB_PASSWORD% --databases %DB_NAME% --routines --events --triggers > "%BACKUP_FILE%"

:: Vérifier si la sauvegarde a réussi
IF %ERRORLEVEL% EQU 0 (
    echo Sauvegarde réussie: %BACKUP_FILE%
    
    :: Compresser le fichier SQL en utilisant 7-Zip si disponible
    if exist "C:\Program Files\7-Zip\7z.exe" (
        echo Compression du fichier de sauvegarde...
        "C:\Program Files\7-Zip\7z.exe" a -tzip "%BACKUP_FILE%.zip" "%BACKUP_FILE%"
        
        :: Supprimer le fichier SQL non compressé si la compression a réussi
        if %ERRORLEVEL% EQU 0 (
            del "%BACKUP_FILE%"
            echo Fichier compressé avec succès: %BACKUP_FILE%.zip
        )
    )
    
    :: Supprimer les sauvegardes anciennes (plus de 30 jours)
    echo Suppression des sauvegardes de plus de 30 jours...
    forfiles /P "%BACKUP_DIR%" /M "*.zip" /D -30 /C "cmd /c del @path" 2>nul
    forfiles /P "%BACKUP_DIR%" /M "*.sql" /D -30 /C "cmd /c del @path" 2>nul
) ELSE (
    echo Échec de la sauvegarde! Vérifiez les paramètres et les permissions.
)

echo Opération terminée.
pause