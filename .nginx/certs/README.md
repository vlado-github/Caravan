# Renew SSL Cert

```bash
openssl req -trustout -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.key -out cert.cert
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