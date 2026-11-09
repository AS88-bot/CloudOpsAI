
import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini on the server.
// Add GEMINI_API_KEY in Vercel → Settings → Environment Variables.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "CloudOps AI server is running",
  });
});

// Shared Gemini request handler
async function runGemini(
  prompt: string,
  res: express.Response
) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return res.json({
      result: response.text || "",
    });
  } catch (error) {
    console.error("Gemini API error:", error);

    return res.status(500).json({
      error: "AI request failed",
    });
  }
}

// Infrastructure analyzer
app.post("/api/ai/analyze", async (req, res) => {
  const { prompt, infrastructure, data } = req.body ?? {};

  return runGemini(
    `Analyze this infrastructure and provide findings, risks, and recommendations:\n${prompt || infrastructure || data || JSON.stringify(req.body)}`,
    res
  );
});

// Security auditor
app.post("/api/ai/security-audit", async (req, res) => {
  const { prompt, infrastructure, data } = req.body ?? {};

  return runGemini(
    `Perform a detailed cloud infrastructure security audit. Identify vulnerabilities, severity, and remediation steps:\n${prompt || infrastructure || data || JSON.stringify(req.body)}`,
    res
  );
});

// Cost optimizer
app.post("/api/ai/cost-optimize", async (req, res) => {
  const { prompt, infrastructure, data } = req.body ?? {};

  return runGemini(
    `Analyze this cloud infrastructure for cost optimization opportunities. Include estimated savings and recommendations:\n${prompt || infrastructure || data || JSON.stringify(req.body)}`,
    res
  );
});

// Log analyzer
app.post("/api/ai/analyze-logs", async (req, res) => {
  const { prompt, logs, data } = req.body ?? {};

  return runGemini(
    `Analyze these infrastructure logs. Identify errors, root causes, and recommended fixes:\n${prompt || logs || data || JSON.stringify(req.body)}`,
    res
  );
});

// Architecture generator
app.post("/api/ai/generate-architecture", async (req, res) => {
  const { prompt, requirements, data } = req.body ?? {};

  return runGemini(
    `Design a cloud architecture for these requirements. Explain components, connections, scalability, and security:\n${prompt || requirements || data || JSON.stringify(req.body)}`,
    res
  );
});

// Documentation generator
app.post("/api/ai/generate-docs", async (req, res) => {
  const { prompt, project, data } = req.body ?? {};

  return runGemini(
    `Generate clear technical documentation for this project:\n${prompt || project || data || JSON.stringify(req.body)}`,
    res
  );
});

// Interview coach
app.post("/api/ai/interview-coach", async (req, res) => {
  const { prompt, question, data } = req.body ?? {};

  return runGemini(
    `Act as a cloud and DevOps interview coach. Help with this question and provide a clear explanation:\n${prompt || question || data || JSON.stringify(req.body)}`,
    res
  );
});

// Vercel detects this exported Express app.
export default app;
