import Groq from "groq-sdk";
import { AppError } from "../app/errors/AppErrors";

let groqClient: Groq | null = null;

export const getGroqClient = () => {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new AppError(500, "GROQ_API_KEY is not configured");
  }

  if (!groqClient) {
    groqClient = new Groq({ apiKey });
  }

  return groqClient;
};
