# Streaming Service Backend

The **Streaming Service Backend** is a scalable and secure video streaming backend, designed for a Netflix-like experience. This backend handles video uploads, role-based access control, subscription-based viewing, and Cloudinary integration for optimized streaming.

**Note**: This project is still in development. New features are being added, and improvements are continuously being made.

---

## Features

### Role-Based Access Control (RBAC)

- **Admins** can upload and manage videos.
- **Subscribers** can stream videos based on their subscription plan.
- **Non-subscribers** have limited or no access to premium content.

### Secure & Efficient Video Uploads

- **Pre-Signed URLs** → Admins upload videos **directly** to Cloudinary (no backend overload).
- **Webhook-Driven Processing** → The backend listens for Cloudinary’s **webhook** to track upload status.

### Subscription & Payment Integration

- Supports **subscription plans** for accessing premium videos.
- Uses **Stripe** for secure payment processing.
- Tracks **subscription status** for each user.

### Webhook Integration with Cloudinary

- The backend listens for **Cloudinary's webhook** to receive video upload status.
- Updates the **database automatically** when a video is processed.
- Enables **async processing** for a smooth user experience.

### Secure Authentication & Authorization

- Uses **JWT (JSON Web Token)** for user authentication.
- Protects **video access** based on user roles.
- Integrates **subscription-based access** with a payment gateway.

### User Engagement Features

- **Like/Dislike** videos.
- **Add to Watchlist** for later viewing.
- **Rate & Review** videos.
- **Enable Subtitles** for a better viewing experience.

---

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

---

## **API Endpoints**

### **Upload Video**

#### Request Presigned URL

**Endpoint:** `GET /api/v1/videos/signed-url?tags=nestjs course from nestjs website|Learn NestJS from the official website`

#### Upload Video to Cloudinary

**Endpoint:** `POST https://api.cloudinary.com/v1_1/dgfagvqwo/video/upload`

---

### **Authentication Routes**

#### User Signup

**Endpoint:** `POST /api/v1/auth/signup`

#### User Login

**Endpoint:** `POST /api/v1/auth/login`

#### Request Password Reset

**Endpoint:** `POST /api/v1/auth/reset-password`

#### Change Password Using Reset Token

**Endpoint:** `POST /api/v1/auth/change-password?token=yourtoken`

---

### **Subscription & Payment Routes**

#### Create Subscription

**Endpoint:** `POST /api/v1/subscriptions/create-subscription/:plan`

#### Confirm Payment

**Endpoint:** `POST /api/v1/subscriptions/confirm-payment`

#### Webhook for Stripe Events

**Endpoint:** `POST /api/v1/subscriptions/webhook`

---

### **Comment Routes**

#### Create Comment

**Endpoint:** `POST /api/v1/comments`

**Request Body:**

```json
{
  "videoId": 2,
  "content": "this is comment for amrrdev1@gmail.com"
}
```

**Response:**

```json
{
  "id": 4,
  "content": "this is comment for amrrdev1@gmail.com",
  "createdAt": "2025-02-05T21:02:12.509Z",
  "updatedAt": "2025-02-05T21:02:12.509Z",
  "userId": 57,
  "videoId": 2
}
```

#### Get Comments on Video

**Endpoint:** `GET /api/v1/comments/{videoId}`

**Response:**

```json
[
  {
    "id": 1,
    "content": "this is comment",
    "createdAt": "2025-02-05T20:17:48.178Z",
    "updatedAt": "2025-02-05T20:17:48.178Z",
    "userId": 59,
    "videoId": 3
  }
]
```

#### Delete Comment

**Endpoint:** `DELETE /api/v1/comments`

**Response:**

```json
{
  "commentId": 2,
  "videoId": 3
}
```

---

### **Like/Dislike Routes**

#### Like a Video

**Endpoint:** `POST /api/v1/likes/{videoId}`

**Response:**

```json
{
  "message": "You seem to enjoy this video! 🎥 (4)"
}
```

#### Dislike a Video

**Endpoint:** `DELETE /api/v1/likes/{videoId}`

**Response:**

```json
{
  "message": "You have disliked the video successfully."
}
```

---

## TODO

- **Movie & TV Show Categories** – Consider adding genres (e.g., Action, Comedy).
- **Profiles for Multiple Users** – Allows multiple profiles under one account.
- **Watchlist (Favorites)** – Users should be able to save videos for later.
- **Streaming vs. Download** – Will users be able to download for offline viewing?
