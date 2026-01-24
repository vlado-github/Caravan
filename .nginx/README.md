# Renew SSL Cert

```bash
openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.key -out cert.cert
```

NOTE: For Common Name (CN) enter 'caravan-app.local'