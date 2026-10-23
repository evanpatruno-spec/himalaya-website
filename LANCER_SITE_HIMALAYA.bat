@echo off
cd /d "%~dp0"
TITLE SITE WEB OFFICIEL HIMALAYA CORP (NOUVELLE GENERATION)
COLOR 0E

echo.
echo  ==========================================================
echo    IMMOBILIER HIMALAYA REAL ESTATE CORP - PORTAIL WEB 2.0
echo  ==========================================================
echo.

set "PATH=%PATH%;C:\Program Files\nodejs"

if not exist "node_modules" (
    echo [INSTALLATION] Installation des dependances du site web...
    call "C:\Program Files\nodejs\npm.cmd" install
)

echo [DEMARRAGE] Lancement du serveur web sur http://localhost:5178 ...
start "" http://localhost:5178/
call "C:\Program Files\nodejs\npm.cmd" run dev
pause
