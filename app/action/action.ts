"use server";

import { getAuthServer } from "@/lib/inforge-server";

export async function generateProjectTitle(messageText: string) {
  try {
    const { insforge } = await getAuthServer();
    const result = await insforge.ai.chat.completions.create({
      model: "google/gemini-2.5-flash-lite",
      messages: [
        {
          role: "system",
          content: `
                    You are an AI assistant that generates very short project names based on the user's prompt.
                    - Keep it under 5 words.
                    - Capitalize words appropriately.
                    - Do not include special characters.
                    - Return ONLY the name, nothing else.`,
        },
        {
          role: "user",
          content: messageText,
        },
      ],
    });
    const text = result.choices[0]?.message?.content;
    return text?.trim() || "Untitled Project";
  } catch (error) {
    console.log("Project Title Error");
    return "Untitled Project";
  }
}
