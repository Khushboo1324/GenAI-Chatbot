# PersonaChat: Interactive AI Mentorship 🤖

## 📖 Project Overview
PersonaChat is a robust, full-stack Next.js application that provides an interactive AI mentorship experience. Built with the **Gemini API** and styled with a strict, minimalist "Academic Prestige" design system, this platform allows users to chat with three distinct personas, each representing the highly-specialized co-founders and instructors of a premier ed-tech platform (Scaler).

Instead of a generic chatbot, PersonaChat utilizes highly-engineered system prompts with "Pedagogical Directives" and "Hard Constraints," transforming the AI into fierce Socratic mentors who focus on first principles, business value, and rigorous fundamental logic.

![Screenshot Placeholder](https://via.placeholder.com/1200x600?text=App+Screenshot+Here)

## ✨ Features
- **Dynamic Persona Switcher**: Instantly toggle between 3 expert personas (Anshuman, Abhimanyu, Kshitij), automatically swapping system instructions and conversation state.
- **Socratic AI Pedagogy**: Custom-engineered Gemini prompts ensure the AI guides students through Socratic questioning rather than just handing out code snippets.
- **Academic Prestige UI**: A clean, minimalist interface utilizing `Noto Serif` and `Manrope` fonts, coupled with a `Deep Navy` and `Academic Gold` palette.
- **Secure Backend API**: Communication with the Gemini model is handled securely server-side via Next.js API Routes, ensuring the API key is never exposed to the client.
- **Markdown Parsing**: Integrated `react-markdown` and `@tailwindcss/typography` to elegantly render AI outputs including code blocks, bold text, and lists.
- **Suggestion Chips**: Quick-start prompts contextualized for each specific persona.

## 🚀 Setup Steps

### Prerequisites
- Node.js 18.x or later installed on your machine.
- A Gemini API Key from Google AI Studio.

### 1. Clone the repository
\`\`\`bash
git clone <repository-url>
cd persona-chatbot
\`\`\`

### 2. Install dependencies
\`\`\`bash
npm install
\`\`\`

## 🔐 Environment Variables
You need to configure your environment variables before running the application.
1. Copy the provided `.env.example` file and rename it to `.env.local` (or just `.env`).
2. Add your Gemini API key:
\`\`\`env
GEMINI_API_KEY=your_gemini_api_key_here
\`\`\`

## 💻 Local Run Steps
Once dependencies are installed and your environment is configured, start the development server:
\`\`\`bash
npm run dev
\`\`\`
Open [http://localhost:3000](http://localhost:3000) in your browser to interact with the personas!

## 🌍 Deployment
*Deployed Link Placeholder: [Your Vercel/Netlify Link Here]*

This application is fully optimized for zero-config deployment on Vercel. 
1. Push your code to GitHub.
2. Import the project in Vercel.
3. Add `GEMINI_API_KEY` to the Vercel Environment Variables.
4. Deploy!
