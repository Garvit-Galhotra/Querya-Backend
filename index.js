import express from "express";
import cors from "cors";
import { promises as fs } from "fs";

const app = express();
app.use(express.json());
app.use(cors());
const port = 3000;

// Read JSON lipsync file
const readJsonTranscript = async (file) => {
  try {
    const data = await fs.readFile(file, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error("Error loading JSON:", file, err);
    return {};
  }
};

// Convert audio to Base64
const audioFileToBase64 = async (file) => {
  try {
    const data = await fs.readFile(file);
    return data.toString("base64");
  } catch (err) {
    console.error("Error loading audio:", file, err);
    return "";
  }
};

// Hardcoded Q&A with keywords
const qaDatabase = [
  {
    question: "what courses does the college offer",
    keywords: ["course", "courses", "offer", "b.tech", "specialization"],
    answer:
      "Our college offers undergraduate programs in B.Tech with multiple specializations.",
    audioPath: "audios/q1.mp3",
    lipsyncPath: "audios/q1.json",
  },
  {
    question: "what is the admission process for b.tech",
    keywords: ["admission", "process", "btech", "how to apply", "counseling"],
    answer:
      "Admission to the B.Tech program is based on merit through government counseling.",
    audioPath: "audios/q2.mp3",
    lipsyncPath: "audios/q2.json",
  },
  {
    question: "does the college provide hostel and campus facilities",
    keywords: ["hostel", "facility", "campus", "wifi", "amenities"],
    answer:
      "Yes, the college provides hostels with Wi-Fi and all essential campus facilities.",
    audioPath: "audios/q3.mp3",
    lipsyncPath: "audios/q3.json",
  },
  {
    question: "what companies visit the college for placements",
    keywords: ["placement", "companies", "recruiters", "jobs"],
    answer:
      "Top IT, manufacturing, and engineering companies visit the campus for recruitment.",
    audioPath: "audios/q1.mp3",
    lipsyncPath: "audios/q1.json",
  },
  {
    question: "how can i contact the admission or support office",
    keywords: ["contact", "support", "office", "help"],
    answer:
      "You can contact the support office through phone, email, or the website contact form.",
    audioPath: "audios/q2.mp3",
    lipsyncPath: "audios/q2.json",
  },
];

// Root endpoint
app.get("/", (req, res) => {
  res.send("Hello! This is the Querya backend.");
});

// Chat endpoint
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message?.trim().toLowerCase() || "";

  // Welcome message
  if (!userMessage) {
    return res.send({
      messages: [
        {
          text: "Hey, this is Querya, your assistant for today.",
          audio: await audioFileToBase64("audios/q3.mp3"),
          lipsync: await readJsonTranscript("audios/q3.json"),
          facialExpression: "smile",
          animation: "Talking_0",
          randomTalking: true,
          talkingAnimations: [
            "Talking_0",
            "Talking_1",
            "Talking_2",
            "Talking_3",
          ],
        },
      ],
    });
  }

  // Keyword matching
  const matchedQA = qaDatabase.find((qa) =>
    qa.keywords.some((word) => userMessage.includes(word))
  );

  if (!matchedQA) {
    return res.send({
      messages: [
        {
          text: "Sorry, I couldn't understand that. Can you ask something about college courses, admission, hostel, placement, or contact info?",
          audio: await audioFileToBase64("audios/q1.mp3"),
          lipsync: await readJsonTranscript("audios/q1.json"),
          facialExpression: "sad",
          animation: "Talking_1",
          randomTalking: true,
          talkingAnimations: [
            "Talking_0",
            "Talking_1",
            "Talking_2",
            "Talking_3",
          ],
        },
      ],
    });
  }

  // Prepare response
  const audioBase64 = await audioFileToBase64(matchedQA.audioPath);
  const lipsyncJson = await readJsonTranscript(matchedQA.lipsyncPath);

  return res.send({
    messages: [
      {
        text: matchedQA.answer,
        audio: audioBase64,
        lipsync: lipsyncJson,
        facialExpression: "smile",
        animation: "Talking_1",
        randomTalking: true,
        talkingAnimations: ["Talking_0", "Talking_1", "Talking_2", "Talking_3"],
      },
    ],
  });
});

// Start server
app.listen(port, () =>
  console.log(`⚡ Querya backend running at http://localhost:${3000}`)
);
