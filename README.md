# Caravan

Social event platform for groups and communities.

## Getting Started

### Prerequisite

Download and install [docker compose](https://docs.docker.com/compose/install/)

### Run containers

From the repository's root directory, run command in terminal:

```bash
docker compose up -d
```

Edit Hosts file in elevated mode and add following:
```
## Windows (C:\Windows\System32\drivers\etc)

127.0.0.1 keycloak.local
127.0.0.1 caravan-api.local
127.0.0.1 caravan-app.local

## Mac and Linux (/etc/hosts)
127.0.0.1 keycloak.local caravan-api.local caravan-app.local
```

Via browser access the application: [https://caravan-app.local](http://caravan-app.local)


## Local Setup

### Prerequisite

1. Download and install **.NET** SDK 8
2. Clone repository

### Build and run

#### Backend API
From the repository's root directory, run command in terminal:

```bash
 dotnet run --project .\Caravan.API\
```

#### Frontend App

Setup _.env.local_ in _Caravan.Application_ directory:
```
VITE_KEYCLOAK_AUTH_TYPE=code
VITE_KEYCLOAK_REALM_URL=http://keycloak.local:8888/realms/caravan
VITE_KEYCLOAK_CLIENT_ID=caravan-client
VITE_KEYCLOAK_CLIENT_SECRET=<place_keycloak_client_secret_here>
VITE_CARAVAN_API_URL=http://localhost:5012 #http://localhost:5259 #http://caravan-api.local:5002
VITE_APP_VERSION=0.1.0
```

From the _Caravan.Application_ directory, run command in terminal:
```bash
npm run dev
```


### Access Open API docs

- Local Setup: [http://localhost:5259/swagger/index.html](http://localhost:5259/swagger/index.html)
- Running containers: [http://caravan-api.local/swagger/index.html](http://caravan-api.local/swagger/index.html)
