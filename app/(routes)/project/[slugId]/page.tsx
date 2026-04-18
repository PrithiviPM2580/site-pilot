import ChatInterface from "@/components/chat";
import React from "react";

function Page() {
  return (
    <div>
      <ChatInterface isProjectPage={true} />
    </div>
  );
}

export default Page;
