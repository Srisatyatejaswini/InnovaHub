@echo off
setlocal
cd /d "%~dp0"
echo ========================================
echo InnovaHub - Dependency Setup
echo ========================================
echo.

echo [1/2] Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
  echo.
  echo Backend installation failed.
  pause
  exit /b 1
)
cd ..

echo.
echo [2/2] Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
  echo.
  echo Frontend installation failed.
  pause
  exit /b 1
)
cd ..

echo.
echo ========================================
echo Setup completed successfully!
echo ========================================
echo.
echo To start the backend:
echo   cd backend
echo   npm start
echo.
echo To start the frontend in another terminal:
echo   cd frontend
echo   npm run dev
echo.
pause
