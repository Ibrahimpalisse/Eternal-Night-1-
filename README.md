# Eternal Night - Setup

## Lancer les services MySQL, phpMyAdmin et Mailhog avec Docker

```sh
docker-compose up -d
```

- MySQL : port 3307 (user: user, password: password, database: eternal-night)
- phpMyAdmin : http://localhost:8081 (user: root, password: root)
- Mailhog : http://localhost:8025 (SMTP: localhost:1025)

## Lancer le frontend

```sh
cd frontend
npm install
npm run dev
```

## Lancer le backend

```sh
cd backend
npm install
npm run dev
```

## Configurer le backend pour MySQL

- Host : `localhost`
- Port : `3307`
- User : `user`
- Password : `password`
- Database : `eternal-night`

## Configurer le backend pour Mailhog

- SMTP Host : `localhost`
- SMTP Port : `1025`