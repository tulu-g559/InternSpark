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
5. Firebase Firestore
```

Preparation Phase
----------
![image](https://github.com/user-attachments/assets/aedfc61a-8d59-4aa6-b08d-6d78200cf671)


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

| 🔍 Resume Review | 🎤 Mock HR Questions | 📊 Readiness Tracker |
|------------------|----------------------|------------------------|
| ![Resume Review](https://github.com/user-attachments/assets/7c2759f2-996c-484a-be71-97fb8ea03c76) | ![Mock HR](https://github.com/user-attachments/assets/718e40d5-f1b1-4ffe-ab9c-76679e6f7cbd) | ![Readiness Tracker](https://github.com/user-attachments/assets/cd55f0aa-1bff-458e-a302-cfb389a9701e) |

| 📝 Cover Letter Generator | 📄 JD Simplifier |
|----------------------------|-------------------|
| ![Cover Letter](https://github.com/user-attachments/assets/14f7054b-3fae-47fc-b978-24f2e18be5ae) | ![JD Simplifier](https://github.com/user-attachments/assets/c2a46ec8-2e9c-40f7-ad05-2d9a8323b0ce) |





🛠️ Tech Stack
--------------
* **Frontend**: `Next.js` with **Firebase Studio** UI (dark themed, responsive)
* **Backend**: `Genkit` (TypeScript) powered flows for Gemini-based AI endpoints
* **AI**: `Gemini 2.0 Flash` API — prompt-driven text, resume and cover letter generation
* **Database**: Firebase Firestore logs user inputs & AI outputs (`internspark_logs`)
* **IDE & Hosting**: Built and deployed via Google IDX & Firebase Hosting


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
git clone https://github.com/tulu-g559/GDG-Assessment-Arnab-Ghosh.git

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
