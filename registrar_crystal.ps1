# ===============================
# CONFIGURAÇÕES
# ===============================
$protocol   = "crystal"
$crystalExe = "C:\Program Files (x86)\Crystal Decisions\Crystal Reports 10\crw32.exe"
$baseFolder = "C:\Sucata Platomix\RELATORIOS"

$baseKey = "HKLM:\Software\Classes\$protocol"

# ===============================
# REGISTRO DO PROTOCOLO
# ===============================
New-Item -Path $baseKey -Force | Out-Null
Set-ItemProperty -Path $baseKey -Name "(Default)" -Value "URL:Crystal Protocol"
Set-ItemProperty -Path $baseKey -Name "URL Protocol" -Value ""

# ===============================
# COMANDO (CMD INLINE)
# ===============================
$cmdKey = "$baseKey\shell\open\command"
New-Item -Path $cmdKey -Force | Out-Null

$command = @"
cmd.exe /C ""set u=%1 & set u=%u:crystal://=% & ""$crystalExe"" ""$baseFolder\%u%.rpt"""
"@

Set-ItemProperty -Path $cmdKey -Name "(Default)" -Value $command

Write-Host "Protocolo crystal:// registrado com sucesso."
Pause
