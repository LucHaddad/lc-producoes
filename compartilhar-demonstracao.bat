@echo off
echo ==============================================
echo   LC Producoes - Gerando Link de Demonstracao
echo ==============================================
echo.
echo Certifique-se de que o "npm run dev" esteja rodando no terminal do projeto.
echo.
echo Conectando ao tunel seguro...
echo.
cd /d "%~dp0"
.\.tools\cloudflared.exe tunnel --url http://localhost:5173
pause
