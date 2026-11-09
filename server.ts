import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini Initialization
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "CloudOps AI Backend is live." });
  });

  // Generic Analysis Endpoint
  app.post("/api/ai/analyze", async (req, res) => {
    try {
      const { type, content, prompt } = req.body;
      
      // Use standard model for analysis
      const model = "gemini-3.5-flash";
      
      const customPrompt = prompt || `Analyze this ${type} file for errors, security vulnerabilities, and performance optimizations. Provide a structured response.`;

      const interaction = await ai.interactions.create({
        model: model,
        input: `${customPrompt}\n\nFILE CONTENT:\n${content}`
      });

      let fullOutput = "";
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent && textContent.text) {
            fullOutput += textContent.text;
          }
        }
      }

      res.json({ result: fullOutput });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Security Audit Endpoint
  app.post("/api/ai/security-audit", async (req, res) => {
    try {
      const { content } = req.body;
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: `Perform a deep security audit on the following cloud configuration or code. Identify secrets, insecure ports, and weak IAM policies.\n\nCONTENT:\n${content}`
      });

      let fullOutput = "";
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent && textContent.text) {
            fullOutput += textContent.text;
          }
        }
      }
      res.json({ result: fullOutput });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Cost Optimization Endpoint
  app.post("/api/ai/cost-optimize", async (req, res) => {
    try {
      const { content } = req.body;
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: `Analyze the following cloud infrastructure for cost optimization. Identify idle services, expensive configurations, and wasted resources. Provide specific dollar-saving recommendations.\n\nCONTENT:\n${content}`
      });

      let fullOutput = "";
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent && textContent.text) {
            fullOutput += textContent.text;
          }
        }
      }
      res.json({ result: fullOutput });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Log Analyzer Endpoint
  app.post("/api/ai/analyze-logs", async (req, res) => {
    try {
      const { content } = req.body;
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: `You are an expert DevOps SRE. Analyze these logs to identify failures, root causes, and severity. Generate a brief incident report with debugging steps.\n\nLOGS:\n${content}`
      });

      let fullOutput = "";
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent && textContent.text) {
            fullOutput += textContent.text;
          }
        }
      }
      res.json({ result: fullOutput });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Architecture Generator Endpoint
  app.post("/api/ai/generate-architecture", async (req, res) => {
    try {
      const { prompt } = req.body;
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: `Based on the following request, generate a professional Google Cloud Architecture blueprint. Include: 
        1. Recommended services 
        2. Technology stack 
        3. Estimated monthly cost 
        4. Scaling strategy 
        5. Mermaid.js diagram code for the architecture.
        
        REQUEST: ${prompt}`
      });

      let fullOutput = "";
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent && textContent.text) {
            fullOutput += textContent.text;
          }
        }
      }
      res.json({ result: fullOutput });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Documentation Generator Endpoint
  app.post("/api/ai/generate-docs", async (req, res) => {
    try {
      const { content } = req.body;
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: `You are a technical writer. Generate professional documentation (README, Architecture, Deployment Guide) for the following project code/configuration:\n\nCONTENT:\n${content}`
      });

      let fullOutput = "";
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent && textContent.text) {
            fullOutput += textContent.text;
          }
        }
      }
      res.json({ result: fullOutput });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Interview Coach Endpoint
  app.post("/api/ai/interview-coach", async (req, res) => {
    try {
      const { topic } = req.body;
      const interaction = await ai.interactions.create({
        model: "gemini-3.5-flash",
        input: `Generate 5 high-level cloud engineering/DevOps interview questions about ${topic}. Include system design and troubleshooting scenarios.`
      });

      let fullOutput = "";
      for (const step of interaction.steps) {
        if (step.type === 'model_output') {
          const textContent = step.content?.find(c => c.type === 'text');
          if (textContent && textContent.text) {
            fullOutput += textContent.text;
          }
        }
      }
      res.json({ result: fullOutput });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CloudOps AI Server running at http://localhost:${PORT}`);
  });
}

startServer();
