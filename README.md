# Streaming Service API

## Overview

The **Streaming Service API** is a powerful backend platform designed to handle all aspects of a video streaming service. This API provides core functionality to manage user accounts, videos, viewing history, subscriptions, and user interactions. It serves as the foundation for building robust and scalable media streaming applications, enabling developers to integrate the backend with custom front-end applications or other services.

**Note**: This project is still in development. New features are being added, and improvements are continuously being made.

## Project Setup

```bash
$ npm install
```

## Compile and Run the Project

```bash
# development mode
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run Tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

---

## **API Endpoints**

### **Authentication Routes**

#### **1. User Signup**

**Endpoint:** `POST /auth/signup`  
**Description:** Creates a new user account.

**Request Body:**

```json
{
  "firstName": "Amr",
  "lastName": "Mubarak",
  "email": "amrrdev@gmail.com",
  "password": "password"
}
```

**Response:**

- `201 Created` – User successfully registered.
- `400 Bad Request` – Email already in use or validation failed.

---

Here’s the updated **login endpoint** with the JWT being set in an **HTTP-only cookie** instead of returning it in the response body:

---

### **2. User Login**

**Endpoint:** `POST /auth/login`  
**Description:** Authenticates a user and sets a JWT in an **HTTP-only cookie** for secure authentication.

**Request Body:**

```json
{
  "email": "aamr46095@gmail.com",
  "password": "password"
}
```

**Response Headers:**

```http
Set-Cookie: accessToken=your-jwt-token; HttpOnly; Secure; SameSite=Strict; Path=/
```

**Response Body:**

```json
{
  "message": "Login successful"
}
```

### **Security Details:**

- **HttpOnly** – Prevents JavaScript access, reducing XSS risks.
- **Secure** – Ensures the cookie is only sent over HTTPS.

**Response Codes:**

- `200 OK` – Login successful, JWT stored in the cookie.
- `401 Unauthorized` – Invalid credentials.

---

#### **3. Request Password Reset**

**Endpoint:** `POST /auth/reset-password`  
**Description:** Sends a password reset link to the user's email.

**Request Body:**

```json
{
  "email": "aamr46095@gmail.com"
}
```

**Response:**

- `200 OK` – Reset email sent successfully.
- `404 Not Found` – No account associated with this email.

---

#### **4. Change Password Using Reset Token**

**Endpoint:** `POST /auth/change-password?token=yourtoken`  
**Description:** Allows a user to set a new password using a reset token sent via email.

**Request Body:**

```json
{
  "password": "new password"
}
```

**Response:**

- `200 OK` – Password successfully changed.
- `400 Bad Request` – Invalid or expired token.

---

#### **Upload Video**

##### 1) Request Presigned URL

**Endpoint:** `GET /video/signed-url?tags=nestjs course from nestjs website|Learn NestJS from the official website`

**Note**: The tags consist of the title and description of the video, separated by a `|`.

**Response:**

```json
{
  "cloud_name": "dgfagvqwo",
  "api_key": "576485119445155",
  "signature": "dac9c8cec85e48cf8c6d49f70ced2b72930a6a2c",
  "timestamp": 1738584921000,
  "tags": [
    "nestjs course from nestjs website|Learn NestJS from the official website"
  ],
  "folder": "videos"
}
```

##### 2) Upload Video to Cloudinary

**Endpoint:** `POST https://api.cloudinary.com/v1_1/dgfagvqwo/video/upload`

```form-data
// form-data not JSON

"file": The Video
"cloud_name": "dgfagvqwo",
"api_key": "576485119445155",
"signature": "dac9c8cec85e48cf8c6d49f70ced2b72930a6a2c",
"timestamp": 1738584921000,
"tags": [
  "nestjs course from nestjs website|Learn NestJS from the official website"
],
"folder": "videos"
```

**Response:**

```json
{
  ...
  "url": "http://res.cloudinary.com/dgfagvqwo/video/upload/v1738584936/videos/xtdwilpdrikmrvwcmjsj.mp4",
  "secure_url": "https://res.cloudinary.com/dgfagvqwo/video/upload/v1738584936/videos/xtdwilpdrikmrvwcmjsj.mp4"
  ...
}
```

**Note**: The backend will trigger the uploaded file and automatically store the link in the database.

---

### TODO

- **Movie & TV Show Categories** – Consider adding genres (e.g., Action, Comedy).
- **Profiles for Multiple Users** – Allows multiple profiles under one account.
- **Watchlist (Favorites)** – Users should be able to save videos for later.
- **Streaming vs. Download** – Will users be able to download for offline viewing

---
