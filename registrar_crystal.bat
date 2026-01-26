@echo off
:: Define o caminho do executável do Crystal Reports
set "CRYSTAL_PATH=C:\Program Files (x86)\Crystal Decisions\Crystal Reports 10\crw32.exe"

:: Registra o Protocolo "crystal://"
reg add "HKEY_CLASSES_ROOT\crystal" /ve /t REG_SZ /d "URL:Crystal Protocol" /f
reg add "HKEY_CLASSES_ROOT\crystal" /v "URL Protocol" /t REG_SZ /d "" /f

:: O comando abaixo faz a mágica:
:: 1. Recebe a URL completa (ex: crystal://C:\Caminho\Relatorio.rpt)
:: 2. Remove o "crystal://"
:: 3. Abre o crw32.exe com o que sobrou
reg add "HKEY_CLASSES_ROOT\crystal\shell\open\command" /ve /t REG_SZ /d "cmd /V /C \"set \"arg=%%1\" & set \"arg=!arg:crystal://=!\" & \"!CRYSTAL_PATH!\" \"!arg!\"\"" /f

echo.
echo ===========================================
echo  Protocolo Crystal registrado com sucesso!
echo ===========================================
pause
