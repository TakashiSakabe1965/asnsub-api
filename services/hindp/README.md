# HINDP API

- Endpoint: `/api/hindp?pn=...` (alias: `/hindp`, `/asnsub-api/hindp`)
- Health: `/health`

## Local run
```bash
cd services/hindp
npm install
npm test
npm start
```

## Curl
```bash
curl "http://localhost:3000/health"
curl "http://localhost:3000/api/hindp?pn=01234567890123456789"
```
