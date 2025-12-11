# PowerShell script para Windows
# File: scripts/setup-infra.ps1

Write-Host "Setting up FixIt infrastructure (Kafka, Redis, Postgres DBs)..." -ForegroundColor Green

# Crear red de Docker si no existe
Write-Host "Creating Docker network..." -ForegroundColor Yellow
docker network create fixit-network 2>$null
if ($LASTEXITCODE -eq 0) {
    Write-Host "Network created successfully" -ForegroundColor Green
} elseif ($LASTEXITCODE -eq 125) {
    Write-Host "Network already exists, continuing..." -ForegroundColor Cyan
} else {
    Write-Host "Failed to create network with unexpected error" -ForegroundColor Red
    exit 1
}

# Levantar infraestructura (sin User DB - Auth maneja usuarios)
Write-Host "Starting infrastructure services..." -ForegroundColor Yellow
docker-compose up -d kafka redis postgres-auth postgres-geo postgres-technician postgres-request postgres-payment postgres-notification

if ($LASTEXITCODE -ne 0) {
    Write-Host "Failed to start infrastructure services" -ForegroundColor Red
    exit 1
}

# Esperar a que los servicios estén listos
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow

# Esperar Redis
Write-Host "Waiting for Redis..." -ForegroundColor Cyan
do {
    Start-Sleep -Seconds 2
    $redisReady = docker exec fixit-redis redis-cli ping 2>$null
} while ($redisReady -ne "PONG")
Write-Host "Redis is ready!" -ForegroundColor Green

# Esperar Kafka
Write-Host "Waiting for Kafka..." -ForegroundColor Cyan
do {
    Start-Sleep -Seconds 2
    docker exec fixit-kafka kafka-topics --bootstrap-server localhost:9092 --list 2>$null
} while ($LASTEXITCODE -ne 0)
Write-Host "Kafka is ready!" -ForegroundColor Green

# Esperar bases de datos (sin User DB)
$databases = @("auth", "geo", "technician", "request", "payment", "notification")
foreach ($db in $databases) {
    Write-Host "Waiting for postgres-$db..." -ForegroundColor Cyan
    do {
        Start-Sleep -Seconds 2
        docker exec "fixit-postgres-$db" pg_isready -U postgres 2>$null
    } while ($LASTEXITCODE -ne 0)
    Write-Host "postgres-$db is ready!" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ All infrastructure services are ready!" -ForegroundColor Green
Write-Host ""
Write-Host "Services available at:" -ForegroundColor White
Write-Host "  Kafka: localhost:9092" -ForegroundColor Gray
Write-Host "  Redis: localhost:6379" -ForegroundColor Gray
Write-Host "  Auth DB (usuarios + auth): localhost:5433" -ForegroundColor Gray
Write-Host "  Geo DB: localhost:5434" -ForegroundColor Gray
Write-Host "  Technician DB: localhost:5436" -ForegroundColor Gray
Write-Host "  Request DB: localhost:5437" -ForegroundColor Gray
Write-Host "  Payment DB: localhost:5438" -ForegroundColor Gray
Write-Host "  Notification DB: localhost:5440" -ForegroundColor Gray
Write-Host ""
Write-Host "💡 Note: Auth Service handles all user management - no separate User DB needed" -ForegroundColor Yellow
Write-Host "👉 Next step: Run 'scripts/setup-services.ps1' to start microservices" -ForegroundColor Cyan