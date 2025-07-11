⚡ InternSpark ⚡
===============
### 🎯 **Problem Statement:**
Most college students struggle to find tech internships due to poor resume quality, lack of interview preparation, and unclear understanding of job requirements.

-----
**InternSpark** is a modern, AI-powered web application built to guide college students toward internship success by automating and simplifying key stages of the preparation process.

It leverages cutting-edge technologies like Google Gemini and Firebase to provide tailored support in crafting high-quality resumes, generating realistic HR interview questions, and evaluating internship readiness. By offering a personalized, interactive experience, InternSpark helps students not only assess where they stand but also improve systematically with AI-driven suggestions. 

_The platform is designed to be **beginner-friendly, accessible, and practical—making** it an ideal companion for students who want to confidently navigate the competitive internship landscape_.


Core Google Tech used:
------------
```
1. Project IDX 
2. Firebase Studio
3. Gemini 2.0 Flash API
4. GenKit
5. Firebase Authentication
6. Firestore Database
```

Preparation Phase
----------
![image](https://github.com/user-attachments/assets/3f3edd51-caa6-4be8-bbaf-faf3685f2a9b)


🚀 Features
-----------

1.  **Resume Reviewer**
    
    *   Upload your **PDF** or text resume (Gemini Vision)
    *   Powered by Gemini:
        *   ✅ Summarizes skills, education, and key projects
        *   ✅ Provides actionable improvement suggestions
            
2.  **Mock HR Questions Generator**
    *   Input a desired internship role (e.g., AIML Intern)
    *   Gemini generates 5 contextually relevant HR interview questions
        
3.  **Internship Readiness Tracker**
    
    *   Upload resume for evaluation    
    *   Receive a readiness score (0–100) plus 3 tailored improvement tips
        
4.  **Cover Letter Generator**
    
    *   Provide role and company—based on your resume, Gemini crafts a professional cover letter
        
5.  **Job Description Simplifier**
    
    *   Paste a job description (via LinkedIn, or any careers page)
    *   Gemini transforms it into clear summary, key skills, and preparation guidelines
        
Snapshots:
----------

| 🖥️ Landing Page Preview                                                                 | 🔍 Resume Review                                                                 | 🎤 Mock HR Questions                                                                   |
|------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| ![Landing Page](https://github.com/user-attachments/assets/ae9189b6-e3c0-4298-b8c0-05526ea2cc5d) | ![Resume Review](https://github.com/user-attachments/assets/42776235-d7f6-4bba-b950-6295a11e872c) | ![Mock HR](https://github.com/user-attachments/assets/8c23f004-96ec-4708-ae8b-ea04779a32fd) |

| 📊 Readiness Tracker                                                                   | 📝 Cover Letter Generator                                                             | 📄 JD Simplifier                                                                       |
|----------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
| ![Readiness Tracker](https://github.com/user-attachments/assets/7e263c18-e226-4f76-9097-2216027fb8fb) | ![Cover Letter](https://github.com/user-attachments/assets/d7e3410a-4220-4cd0-b9ec-8b186bc63b5d) | ![JD Simplifier](https://github.com/user-attachments/assets/90c9a7e6-1626-452a-915f-9a5ba0dc1b92) |






🛠️ Tech Stack
--------------
* **Frontend**: `Next.js` with **Firebase Studio** UI (dark themed, responsive)
* **Backend**: `Genkit` (TypeScript) powered flows for Gemini-based AI endpoints
* **AI**: `Gemini 2.0 Flash` API — prompt-driven text, resume and cover letter generation
* **Database**: `Firestore Database` logs user inputs & AI outputs (`internspark_logs`)
* **Auth**: `Firebase Authentication` for safe input/output
* **IDE & Hosting**: Built via `Google IDX` & Firebase Hosting
* **Deployment**: `Vercel`


Firestore Schema:
----------------
```
internspark_logs:
[
  {
    timestamp,
    resumeText,
    resumeSummary,
    resumeSuggestions,
    mockHRQuestions,
    readinessScore,
    readinessTips,
    coverLetter,
    jobDescriptionSimplified
  }
]
```

📁 Repository Structure
-------------
```
/src
  /app
    /resume-review
    /mock-interview
    /readiness-tracker
    /cover-letter
    /job-description-simplifier
  /components  → shared UI elements (Tabs, Buttons, Cards)
  /lib         → utility functions (prompt builders, Firestore client)
  /ai          → FastAPI endpoints handling AI calls
.env          → Gemini API key, Firebase config
```

Getting Started
---------------

1.  **Clone the repo**: 
```
git clone https://github.com/tulu-g559/InternSpark-GDG.git

```
    
2.  **Create** a .env file or use .env.example with your Gemini API key and Firebase credentials in the given way
```
GEMINI_API_KEY=

NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```
    
3.  `uvicorn src.ai.main:app --reload`
_Skip this if you're only using Genkit-based flows hosted on Firebase Studio._
    
4.  **Run:**
```
npm install
npm run dev
```
        

🌟 Why InternSpark?
-------------------

InternSpark empowers students with AI-driven feedback to:

*   Polish resumes with data-backed improvements
*   Practice HR interviews
*   Automate cover letter creation
*   Decode job descriptions
*   Gauge readiness — all in one sleek, dark-mode platform

#

* ### [**Arnab Ghosh**](https://github.com/tulu-g559)
* ### [**LinkedIn**](https://linkedin.com/in/tulug559)
