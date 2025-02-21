# **Looper - AI-Powered Resume & Job Description Analyzer**

**Looper** is an AI-powered tool that helps job seekers refine their resumes based on specific job descriptions. By uploading your resume and a job description, Looper analyzes the content, identifies gaps in experience, and suggests actionable improvements to enhance your chances of landing the job. It's the ultimate tool to ensure your resume perfectly aligns with job requirements!

---

### **Features**

- **Resume Upload:** Upload your resume in PDF, Word, or text format.
- **Job Description Input:** Paste any job description for analysis.
- **AI Analysis:** Looper's AI analyzes your resume and the job description, identifying areas of improvement.
- **Suggestions:** Receive clear, actionable suggestions to better align your resume with the job.
- **Custom Recommendations:** Looper provides feedback on skills, experience, and formatting to help your resume stand out.

---

### **Tech Stack**

- **Frontend:**
  - **Next.js**: React framework for building the frontend, enabling SSR (Server-Side Rendering) and static generation for a fast and responsive user experience.
- **Authentication:**

  - **Supabase**: Provides easy-to-implement authentication and secure user management.

- **Backend:**
  - **FastAPI**: Fast and efficient backend framework to handle API requests and interactions between the frontend and the AI model.
- **AI Model:**
  - **Gemma2**: A powerful AI model that powers the analysis and suggestions, fine-tuned to process resumes and job descriptions for optimal results.

---

### **How It Works**

1. **Upload Your Resume:** Start by uploading your resume. Looper will extract the key information such as skills, experience, and education.
2. **Input Job Description:** Paste the job description you are applying to, and Looper will analyze the compatibility between the two.
3. **AI Analysis:** Gemma2 processes both inputs to detect mismatches and suggest improvements, such as missing skills or underrepresented experience.
4. **Get Suggestions:** Looper generates easy-to-understand feedback to help you improve your resume, focusing on areas like job relevance, phrasing, and skill optimization.

---

### **User Flow**

1. **Sign Up/Login** via **Supabase** to secure your user data.
2. **Upload Resume** in a supported format (PDF, Word, or Text).
3. **Paste Job Description** to analyze how well your resume matches the job posting.
4. **Get AI-Powered Feedback:** Review the suggestions and update your resume accordingly.

---

### **Contributing**

Looper is open to contributions! Feel free to fork the repository, submit issues, and send pull requests for any improvements or new features you think would be valuable.
