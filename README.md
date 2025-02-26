# Sabai Chat

Sabai Chat is a modern real-time messaging application built with Nuxt3, WebSockets, and a clean, user-friendly interface. It supports both Lao and English languages, offering a seamless communication experience.

## Features

- **Real-time Messaging**: Instant message delivery using WebSockets
- **File Sharing**: Upload and share images with other users
- **Emoji Support**: Built-in emoji picker for expressive communication
- **User Presence**: See when users are online or offline
- **Typing Indicators**: Know when someone is typing a message
- **Dark/Light Mode**: Toggle between dark and light themes for comfortable viewing
- **Message Timestamps**: All messages show accurate local time (Laos/Bangkok timezone)
- **Responsive Design**: Works on both desktop and mobile devices
- **Sound Notifications**: Audio alerts for incoming messages

## Technologies

- **Frontend**: Nuxt3, TailwindCSS
- **Communication**: Socket.io for real-time messaging
- **File Storage**: Integrated file upload system with preview capabilities
- **UI/UX**: Modern glassmorphism design with responsive components

## Setup and Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository
   ```bash
   git clone https://github.com/PitiDev/sabai_chat
   cd sabai-chat
   ```

2. Install dependencies
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables
   ```bash
   cp .env.example .env
   ```
   Then edit `.env` with your configuration settings.

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

## Usage

1. Register or log in to your account
2. Select a user from the contacts list
3. Start chatting with real-time message delivery
4. Share files by clicking the attachment button
5. Add emojis to your messages using the emoji picker
6. Toggle between dark and light mode with the theme switcher

## Project Structure

```
sabai-chat/
├── public/
│   ├── sounds/
│   │   └── message-sent.mp3
│   └── ...
├── src/
│   ├── components/
│   │   ├── ThemeToggle.vue
│   │   └── ...
│   ├── models/
│   │   └── message.model.ts
│   ├── pages/
│   │   ├── chat/
│   │   │   └── index.vue
│   │   └── login/
│   │       └── index.vue
│   ├── stores/
│   │   └── auth.ts
│   └── ...
└── ...
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Vue.js](https://vuejs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Socket.io](https://socket.io/)
- [Vite](https://vitejs.dev/)