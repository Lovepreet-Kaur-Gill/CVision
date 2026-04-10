# 🚀 CVision | Next-Gen Resume Intelligence

[![Deploy with Vercel](https://vercel.com/button)](https://ai-cvision.vercel.app)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![Clerk](https://img.shields.io/badge/Clerk-Auth-6C47FF?style=flat)

*Syncing Talent with Technology*

CVision is a high-performance, full-stack resume builder and career optimization platform designed to bridge the gap between candidates and strict ATS (Applicant Tracking System) algorithms. Built with a modern Next.js architecture, CVision provides real-time AI content generation, professional formatting, and deep job description analysis.

---

## 🌐 Live Demo
🔗 [Visit CVision](https://ai-cvision.vercel.app)

---

## 📸 Screenshots

## 📸 Screenshots

<p align="center">
  <img src="screenshots/home.png" width="45%"/>
  <img src="screenshots/resume-builder.png" width="45%"/>
</p>

<p align="center">
  <img src="screenshots/jd-matcher.png" width="45%"/>
  <img src="screenshots/job-finder.png" width="45%"/>
</p>

<p align="center">
  <img src="screenshots/mobile-view.png" width="30%"/>
</p>

---

## 🌟 Core Features (v2.0)

- **🤖 AI Content Enhancement:** Real-time optimization of bullet points, summaries, and skills using Gemini 2.0-Flash  
- **📊 Smart ATS & JD Mapping:** Automated keyword extraction and alignment with job descriptions  
- **🎨 Custom Templates:** Switch between professional, ATS-friendly resume layouts  
- **📄 PDF Export:** Generate high-quality, ATS-readable PDFs  
- **🔗 Live Sharing:** Unique public resume links (`/r/[id]`) for recruiter access  
- **💼 Job Finder Integration:** Discover jobs tailored to your resume  
- **🔒 Secure Storage:** Data handled with Supabase and Clerk authentication  

---

## 💻 Technical Stack

- **Frontend:** Next.js 16, React, Tailwind CSS, Lucide Icons  
- **Backend:** Next.js API Routes, Server Actions  
- **Database:** Supabase (PostgreSQL)  
- **AI Integration:** Google Generative AI (Gemini SDK)  
- **Authentication:** Clerk  
- **Deployment:** Vercel  

---

## 🎯 Purpose

CVision is built to solve the problem of resume rejection by ATS systems. It helps users align their resumes with job descriptions using AI, improving shortlisting chances.

---

## 🚀 Quick Start & Installation

### 1. Clone the repository

```bash
git clone https://github.com/Lovepreet-Kaur-Gill/CVision.git
cd CVision
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env.local` file in the root directory and add:

```env
# Authentication (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=your_key...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# AI Intelligence
GEMINI_API_KEY=your-api-key
```

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 🤝 Contributing
Contributions, issues, and feature requests are welcome. Feel free to check the issues page.


## 📝 License
This project is open-source and available under the MIT License.