# 🛤️ RailTracer

**RailTracer** is a next-generation Railway Asset Tracking and Management System built with Next.js, Firebase, and Google Genkit. It provides an intuitive, industrial-grade interface for field technicians, inspectors, and railway admins to manage, scan, inspect, and analyze railway infrastructure components.

---

## ✨ Features

- 🔍 **QR Code Scanning**: Scan laser-engraved QR tags on railway assets directly via the device camera to immediately identify components.
- 📜 **Component History Viewer**: Access complete historical records of any component, including past inspections, maintenance reports, repairs, and replacements.
- 🤖 **AI-Assisted Action Recommendations**: Generative AI analyzes inspection logs and defect severity to suggest immediate next actions (e.g., schedule replacement, immediate repairs, routine check).
- 👤 **Role-Based Access Control**:
  - **Public View**: Access general component details and safety status.
  - **Authorized Staff**: Secure login to access complete management controls, update inspection logs, and interact with AI features.
- 📊 **Data-Rich Admin Dashboard**: Visualize asset distribution, track health metrics, and view real-time state statistics (Verified, Unverified, Damaged).
- 👁️ **AI Material Status Detection**: Use computer vision/multimodal AI analysis to determine material conditions (like corrosion, structural wear) directly via the device camera.
- 📴 **Offline Sync Indicator**: Clear, real-time visual indicator showing offline queuing and synchronization status with the central server.
- 💬 **Interactive AI Assistant**: A dedicated AI chatbot helper trained to answer procedures, maintenance manuals, and component safety standards.

---

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router, TypeScript)
- **Styling**: Tailwind CSS & Radix UI (Shadcn)
- **Database / Backend**: Firebase Firestore
- **AI Integration**: Firebase Genkit with Google Gemini AI (`@genkit-ai/googleai`)
- **Icons**: Lucide React

---

## 🚀 Getting Started

### 📋 Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v18.x or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A Firebase project
- A Gemini API Key from Google AI Studio

### 🔧 Installation & Configuration

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd RailTracer
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory and add your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:9002](http://localhost:9002) in your browser to view the application.

---

## 📦 Production Build

To compile the application for production deployment:

```bash
npm run build
```

This compiles a highly optimized production bundle using Next.js. To test the production build locally:

```bash
npm start
```

---

## ☁️ Vercel Deployment

RailTracer is fully optimized for one-click deployment on **Vercel**.

### Step-by-Step Deployment

1. **Push your code** to a GitHub, GitLab, or Bitbucket repository.
2. Go to the [Vercel Dashboard](https://vercel.com/) and click **Add New > Project**.
3. **Import** your RailTracer repository.
4. **Environment Variables**: In the project configuration, add your environment variables:
   - Key: `GEMINI_API_KEY`
   - Value: `your_actual_gemini_api_key`
5. Click **Deploy**. Vercel will automatically detect Next.js, build the project, and serve it on a secure global CDN.

---

## 📂 Project Structure

```
├── .idx/              # Project IDX configuration
├── docs/              # Documentation and blueprinted features
├── src/
│   ├── ai/            # Genkit flows, models, and AI config
│   ├── app/           # Next.js App Router (pages and layouts)
│   ├── components/    # Reusable UI components (Shadcn and custom)
│   ├── contexts/      # React Contexts (auth, offline state, etc.)
│   ├── hooks/         # Custom React hooks
│   └── lib/           # Utility functions, type definitions, and Firebase init
├── tailwind.config.ts # Tailwind CSS configuration
└── next.config.ts     # Next.js configuration
```

---

## 📄 License

This project is licensed under the MIT License.
