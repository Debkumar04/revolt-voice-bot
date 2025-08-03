# Revolt Motors Voice Assistant 🔊⚡

A real-time, voice-controlled AI assistant built for **Revolt Motors** customers. It provides seamless, multilingual, and low-latency voice interaction using the **Gemini Live API**.

---

## 🚀 Features

- 🎙️ **Natural Voice Interaction** — Ask questions conversationally about Revolt bikes and services.
- 🌐 **Multi-language Support** — Supports English, Hindi, Marathi, and more.
- ⚡ **Instant Responses** — AI replies within ~1–2 seconds for a smooth experience.
- ✋ **Interruption Handling** — You can interrupt the bot while it's speaking, and it will respond to the new query.
- 🌙 **Dark Mode UI** — Sleek and modern front-end interface.

---

## 🛠 Tech Stack

| Component     | Technology                |
|---------------|---------------------------|
| Frontend      | React, Material-UI, Framer Motion |
| Backend       | Node.js, Express          |
| AI Service    | Google Gemini Live API    |
| Speech        | Web Speech API (Browser)  |

---

## 📦 Installation & Setup Instructions

### **Clone the repository**
```bash
git clone https://github.com/Debkumar04/revolt-voice-bot.git
cd revolt-voice-bot
2. Install dependencies


Backend

cd backend
npm install


Frontend

cd ../frontend
npm install


3. Set up your environment variables
In the backend/ directory, create a .env file and add your Gemini API key:

GEMINI_API_KEY=your_gemini_api_key_here
🔑 You can get your free API key from: https://aistudio.google.com/app/apikey


4. Run the backend server
cd backend
npm run dev


5. Run the frontend development server
cd ../frontend
npm run dev
The frontend will typically run on http://localhost:5173
The backend will run on http://localhost:5000

💡 Notes
Use the model gemini-2.5-flash-preview-native-audio-dialog for production.

If you exceed free tier limits during testing, you may temporarily switch to gemini-2.0-flash-live-001.

🧠 AI Configuration
The AI assistant is programmed to respond only to Revolt Motors–related queries. Any off-topic inputs are redirected or gracefully declined.

🤝 Contribution
This project was developed with ❤️ for the RattanIndia assessment, aiming to replicate the functionality of the existing Rev chatbot on revoltmotors.com.

📧 Contact
For any queries, please reach out to:
📬 Debkumar Shit – [shitdebkumar2003@gmail.com]

