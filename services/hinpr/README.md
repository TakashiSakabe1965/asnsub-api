# HINPR (local-first)

## Endpoints
- GET /hinpr?pn=...
- GET /api/hinpr?pn=...
- GET /health
- GET /hinpr/health

## Local
```bash
npm install
npm test
node src/server.js
```

PowerShell uses Invoke-WebRequest for curl. Use curl.exe:
```powershell
curl.exe -i "http://localhost:3000/hinpr/health"
```
