@echo off
chcp 65001 > nul
TITLE PUBLICATION GITHUB & VERCEL - HIMALAYA WEBSITE
COLOR 0B

echo.
echo  ================================================================
echo    PUBLICATION GITHUB ^& VERCEL - HIMALAYA WEBSITE (PORTAIL 2.0)
echo  ================================================================
echo.

:: Ajout des chemins possibles pour Git et Node.js
set "PATH=%PATH%;C:\Program Files\nodejs;C:\Program Files\Git\cmd;C:\Program Files\Git\bin;%LOCALAPPDATA%\Programs\Git\cmd"

:: Recherche de GitHub Desktop git si git standard absent
for /d %%i in ("%LOCALAPPDATA%\GitHubDesktop\app-*") do (
    if exist "%%i\resources\app\git\cmd\git.exe" (
        set "PATH=%PATH%;%%i\resources\app\git\cmd"
    )
)

where git >nul 2>nul
if errorlevel 1 (
    echo [ATTENTION] L'outil 'git' n'est pas detecte dans le PATH Windows.
    echo Vous pouvez glisser-deposer ce dossier directement dans GitHub Desktop
    echo ou sur https://github.com/new ^(depot : himalaya-website^).
    echo.
    pause
    exit /b 1
)

if not exist ".git" (
    echo [1/4] Initialisation du depot Git local...
    git init
    git branch -M main
    git config user.name "Evan Patruno"
    git config user.email "info@evanpatruno.ca"
    git remote add origin https://github.com/evanpatruno-spec/himalaya-website.git
)

echo [2/4] Verification de la compilation de production (Vite Build)...
call "C:\Program Files\nodejs\npm.cmd" run build
if errorlevel 1 (
    echo [ERREUR] La compilation a echoue. Corrigez les erreurs avant de publier.
    pause
    exit /b 1
)

echo [3/4] Ajout et sauvegarde des fichiers (Commit)...
git add .
git commit -m "Refonte structuree Portail Web Officiel Himalaya Corp 2.0"

echo [4/4] Envoi vers GitHub (evanpatruno-spec/himalaya-website)...
git push -u origin main

echo.
echo  ================================================================
echo    SUCCES ! VOTRE CODE EST SUR GITHUB.
echo    Si Vercel est connecte a ce depot, la mise en ligne est
echo    automatique en moins de 30 secondes !
echo  ================================================================
echo.
pause
