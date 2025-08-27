# Revolt Motors Voice Assistant

![Revolt Motors Logo](https://revoltmotors.com/wp-content/uploads/2022/05/Revolt-Logo.svg)  
*A voice-controlled AI assistant for Revolt Motors customers*

## 🚀 Features
- **Natural Voice Interaction** - Speak naturally to get Revolt-specific information
- **Multi-language Support** - Works in English, Hindi, Marathi, and more
- **Instant Responses** - Low-latency AI-powered answers
- **Interruption Handling** - Speak while the bot is responding
- **Dark Mode UI** - Sleek, modern interface

## 🛠 Tech Stack
| Component       | Technology |
|----------------|------------|
| Frontend       | React, Material-UI, Framer Motion |
| Backend        | Node.js, Express |
| AI Service     | Google Gemini API |
| Speech         | Web Speech API |

## 📦 Installation

### Prerequisites
- Node.js v18+
- Google Gemini API key

### Project Structure
revolt-voice-bot/
├── backend/
│   ├── controllers/     # Route handlers
│   ├── routes/          # API endpoints  
│   ├── services/        # Gemini integration
│   └── app.js           # Express server
└── frontend/
    ├── src/
    │   ├── components/  # React components
    │   └── assets/      # Images/audio
    └── vite.config.js   # Frontend config

Developed with ❤️ for Revolt Motors