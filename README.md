# Primo Pretest Encryption API

A sample REST API for hybrid encryption using RSA and AES,  
built with [NestJS](https://nestjs.com) and featuring unit tests and Swagger API documentation.

---

## Features

- Hybrid encryption API endpoints:  
  - `POST /get-encrypt-data` — Encrypts a payload using an AES key encrypted by RSA private key  
  - `POST /get-decrypt-data` — Decrypts data using the provided RSA-encrypted AES key  
- Uses RSA (private/public key) and AES-256-CBC  
- Unit testing with Jest  
- Swagger UI available at `/api-docs`  

---

## Project Structure

```
├── src/
│   ├── app.controller.ts
│   ├── app.service.ts
│   ├── crypto/
│   │   └── crypto.service.ts
│   ├── dto/
│   │   ├── decrypt-data.dto.ts
│   │   └── encrypt-data.dto.ts
│   └── main.ts
├── test/
│   └── app.e2e-spec.ts
├── keys/
│   ├── private.pem
│   └── public.pem
├── package.json
├── jest.config.ts
└── README.md
```


---

## Installation and Running

```bash
# Install dependencies
npm install

# Run the server in development mode
npm run start:dev

```

---

## Using the API

Open Swagger UI at:
```
http://localhost:3000/api-docs
```
---

## Running Tests

```bash
# Run unit tests
npm run test
```
---
