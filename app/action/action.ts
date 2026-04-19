"use server";

import { getAuthServer } from "@/lib/inforge-server";
import { UIMessage } from "ai";

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

export async function convertModelMessages(messages: UIMessage[]) {
  const modelMessages = messages.map((message) => {
    const contentParts: any[] = [];

    for (const part of message.parts) {
      if (part.type === "text" && typeof part.text === "string") {
        contentParts.push({
          type: "text",
          part: part.text,
        });
      } else if (part.type === "file") {
        if (part.mediaType?.startsWith("image/") && part.url) {
          contentParts.push({
            type: "image",
            image: part.url,
          });
        }
      }
    }

    const content =
      contentParts.length === 1 && contentParts?.[0].type === "text"
        ? contentParts[0].text
        : contentParts;

    return {
      role: message.role,
      content,
    };
  });

  return modelMessages;
}
