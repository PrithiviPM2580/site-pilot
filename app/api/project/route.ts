import { generateProjectTitle } from "@/app/action/action";
import { getAuthServer } from "@/lib/inforge-server";
import { UIMessage } from "ai";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { messages, slugId, selectedPageId } = (await request.json()) as {
      messages: UIMessage[];
      slugId: string;
      selectedPageId: string;
    };

    const { user, insforge } = await getAuthServer();

    if (!user?.id)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let { data: project, error: projectError } = await insforge.database
      .from("projects")
      .select("id,title")
      .eq("slugId", slugId)
      .single();

    if (!project) {
      console.log("Creating new project");
      const lastMessage = messages[messages.length - 1];
      const messageText = lastMessage?.parts.find(
        (part) => part.type === "text",
      )?.text as string;
      const title = await generateProjectTitle(messageText);
      const { data: newProject, error } = await insforge.database
        .from("projects")
        .insert([
          {
            title,
            slugId,
            userId: user.id,
          },
        ])
        .select()
        .single();

      if (error) throw error;
      if (!newProject) throw new Error("Failed to create project");
      project = newProject;
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
