# PowerShell script para Windows
# File: scripts/setup-services.ps1

Write-Host "Starting FixIt microservices..." -ForegroundColor Green

# Iniciar API Gateway
Write-Host "Starting API Gateway..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "npm run start:dev:gateway"

# Iniciar microservicios
$services = @("auth", "geo", "technician", "request", "payment", "notification")

foreach ($service in $services) {
    Write-Host "Starting microservice: $service..." -ForegroundColor Cyan
    Start-Process powershell -ArgumentList "npm run start:dev:$service"
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "✅ All microservices started in separate terminals!" -ForegroundColor Green
Write-Host "👉 Use Ctrl+C in each terminal to stop them" -ForegroundColor Yellow
