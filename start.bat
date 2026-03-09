@echo off
echo Starting She Shield Backend...
start cmd /k "cd backend && npm run dev"

echo Starting She Shield Frontend...
start cmd /k "cd frontend && npm run dev"

echo Both servers are starting in separate windows!
echo You can view the app at http://localhost:5173
pause
