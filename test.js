import express from "express";
import cors from "cors";
import { promises as fs } from "fs";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

// Placeholder functions for audio and lipsync
const readJsonTranscript = async (file) => {
  // Replace with your actual file path when ready
  return {}; // return empty object for now
};

const audioFileToBase64 = async (file) => {
  // Replace with your actual file path when ready
  return ""; // return empty string for now
};

// Hardcoded questions and answers
const qaDatabase = [
  {
    question: "What courses does the college offer?",
    answer:
      "Our college offers undergraduate programs in B.Tech with multiple specializations, including Computer Science & Engineering, Artificial Intelligence & Machine Learning, Electronics & Communication Engineering, Mechanical Engineering, and Civil Engineering. We also offer diploma and postgraduate programs depending on the academic year. All courses follow the AICTE guidelines and university curriculum",
    audioPath: "audios/q1.mp3",
    lipsyncPath: "audios/q1.json",
  },
  {
    question: "What is the admission process for B.Tech?",
    answer:
      "Admission to the B.Tech program is based on merit through the state counseling process, following the guidelines issued by the government and the affiliating university. Eligible students must register on the official counseling portal, participate in seat allocation, and complete document verification at the designated centers. Direct admissions, if available, are conducted strictly as per regulatory norms.",
    audioPath: "audios/q2.mp3",
    lipsyncPath: "audios/q2.json",
  },
  {
    question: "Does the college provide hostel and campus facilities?",
    answer:
      "Yes, the college provides well-maintained hostel facilities for both boys and girls, equipped with essential amenities, security, and Wi-Fi. The campus includes modern classrooms, laboratories, a central library, sports facilities, medical assistance, transportation, and a fully Wi-Fi-enabled environment to support academics and student life.",
    audioPath: "audios/q3.mp3",
    lipsyncPath: "audios/q3.json",
  },
  {
    question: "What companies visit the college for placements?",
    answer:
      "The Training & Placement Cell collaborates with leading companies across IT, manufacturing, and core engineering domains. Recruiters include national and multinational organizations offering internships and full-time placements. Each year, companies participate based on industry requirements and student performance, ensuring strong placement opportunities for eligible candidates.",
    audioPath: "audios/q4.mp3",
    lipsyncPath: "audios/q4.json",
  },
  {
    question: "How can I contact the admission or support office?",
    answer:
      "You can contact the admission and student support office through the official college phone number, email address, or by visiting the administrative block during working hours. The staff provides assistance related to admissions, documents, fees, and general inquiries. For urgent matters, students are advised to connect through the official website’s contact section.",
    audioPath: "audios/q5.mp3",
    lipsyncPath: "audios/q5.json",
  },
];

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello! This is the Querya backend.");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message?.trim().toLowerCase();

  if (!userMessage) {
    res.send({
      messages: [
        {
          text: "Hey, this is Querya, your assistant for today",
          audio: await audioFileToBase64("audios/intro_0.wav"),
          lipsync: await readJsonTranscript("audios/intro_0.json"),
          facialExpression: "smile",
          animation: "Talking_1",
        },
      ],
    });
    return;
  }

  // Try to match user input with hardcoded questions
  const matchedQA = qaDatabase.find(
    (qa) => qa.question.toLowerCase() === userMessage
  );

  if (matchedQA) {
    return res.send({
      messages: [
        {
          text: matchedQA.answer,
          audio: await audioFileToBase64(matchedQA.audioPath),
          lipsync: await readJsonTranscript(matchedQA.lipsyncPath),
          facialExpression: "smile",
          animation: "Talking_1",
        },
      ],
    });
  }

  // If no match
  return res.send({
    messages: [
      {
        text: "Sorry, I don't know the answer to that question.",
        audio: await audioFileToBase64("audios/default.mp3"), // optional default audio
        lipsync: await readJsonTranscript("audios/default.json"), // optional default lipsync
        facialExpression: "sad",
        animation: "Idle",
      },
    ],
  });
});

app.listen(port, () => {
  console.log(`Querya backend listening on port ${3000}`);
});
