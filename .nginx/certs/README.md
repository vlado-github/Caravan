# Renew SSL Cert

```bash
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -sha256 -days 3650 -nodes -subj "/CN=caravan-app.local"
```

NOTE: For Common Name (CN) enter 'caravan-app.local'

NOTE: After generating replace
```
-----BEGIN CERTIFICATE-----
...
-----END CERTIFICATE-----
```
with
```
-----BEGIN TRUSTED CERTIFICATE-----
...
-----END TRUSTED CERTIFICATE-----
```

¯\\\_(ツ)_/¯