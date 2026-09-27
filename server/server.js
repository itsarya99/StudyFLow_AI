require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { GoogleGenAI } = require("@google/genai");

const app = express();

const PORT = 3000;

app.use(cors());
app.use(express.json());

// Gemini AI setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "StudyFlow AI server is running 🚀",
  });
});

// AI Study Plan route
app.post("/api/study-plan", async (req, res) => {
  try {
    const { subjects, hours, examDate, weakSubjects } = req.body;

    const prompt = `
You are an expert study planner.

Create a realistic daily study plan for a college student.

Student information:

Subjects: ${subjects.join(", ")}
Available study time: ${hours} hours per day
Exam date: ${examDate}
Weak subjects: ${weakSubjects.join(", ")}

Give the student:
1. A clear daily study schedule.
2. More time to weak subjects.
3. Short breaks between study sessions.
4. Revision time.
5. Practical and realistic tasks.

Keep the response concise and easy to follow.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const studyPlan = response.text;

    res.json({
      success: true,
      studyPlan: studyPlan,
    });
  } catch (error) {
    console.error("AI Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate AI study plan.",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
