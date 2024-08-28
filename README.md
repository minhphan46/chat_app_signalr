# Web and Mobile Chat Application using SignalR and ASP .NET Core 8.0

This project is a cross-platform chat application for both web and mobile, developed using SignalR and ASP.NET Core 8.0. The application supports real-time messaging with advanced features like public and private chat modes. Additionally, it includes End-to-End Encryption (E2EE) to ensure secure communication by encrypting messages on the client side, making them accessible only to the intended recipients.

## Key Features:

- Real-time Communication: Powered by SignalR for seamless, instant messaging.

- E2EE: Implementing End-to-End Encryption to protect user privacy and data security.

- Public and Private Chats: Users can switch between public rooms or private, encrypted conversations.

- Cross-platform Compatibility: Accessible on both web and mobile platforms.

## Technologies Used:

- Web: React

- Mobile: Fluter

- Backend: ASP.Net Core 8.0

- Real time : SignalR

- Database: MongoDB

- Encryption: E2EE, AES, RSA

> _Note: the E2EE feature is in the Crypto branch_

# Deployed Link

[Chat Web](https://chat-app-signalr.onrender.com/)

## How to Run:

1. Clone the repository:

```bash
git clone
```

2. Navigate to the project directory:

```bash
cd chat_app
```

3. Run the backend server:

```bash
cd chat_app_server
dotnet run
```

4. Run the web client:

```bash
cd chat_app_client_web
npm install
npm start
```

5. Run the mobile client:

```bash
cd chat_app_client_mobile
flutter pub get
flutter run
```

## ❤️ Star the repo to support the project , Thanks 😉
