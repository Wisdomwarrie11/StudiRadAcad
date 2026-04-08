import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // API Route for sending OTP via Resend
  app.post("/api/send-otp", async (req, res) => {
    const { email, otp, organizationName } = req.body;
    const apiKey = process.env.VITE_RESEND_API_KEY;

    if (!apiKey) {
      console.error("VITE_RESEND_API_KEY is not set in environment.");
      return res.status(500).json({ success: false, error: "Email service not configured on server." });
    }

    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          from: 'StudiRad <onboarding@resend.dev>',
          to: email,
          subject: 'Verify your StudiRad Employer Account',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
              <h2 style="color: #0f172a;">Welcome to StudiRad, ${organizationName}!</h2>
              <p style="color: #64748b; font-size: 16px;">Please use the following One-Time Password (OTP) to verify your employer account:</p>
              <div style="background: #f8fafc; padding: 20px; text-align: center; border-radius: 12px; margin: 30px 0;">
                <span style="font-size: 32px; font-weight: 900; letter-spacing: 10px; color: #3b82f6;">${otp}</span>
              </div>
              <p style="color: #64748b; font-size: 14px;">This code will expire in 10 minutes. If you didn't request this, please ignore this email.</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
              <p style="color: #94a3b8; font-size: 12px; text-align: center;">&copy; 2026 StudiRad. All rights reserved.</p>
            </div>
          `
        })
      });

      const data = await response.json();
      if (response.ok) {
        res.json({ success: true, data });
      } else {
        console.error("Resend API Error:", data);
        res.status(response.status).json({ success: false, error: data.message || "Failed to send email" });
      }
    } catch (error: any) {
      console.error("Server Error sending email:", error);
      res.status(500).json({ success: false, error: error.message || "Internal server error" });
    }
  });

  if (process.env.NODE_ENV !== "production" && !process.env.VERCEL) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else if (process.env.NODE_ENV === "production") {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }

  return app;
}

export const appPromise = startServer();
export default appPromise;
