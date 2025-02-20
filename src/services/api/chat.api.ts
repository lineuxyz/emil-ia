export const handleChatFile = async (file: File) => {
  const formData = new FormData();
  formData.append("pdf", file);

  return await fetch("/api/chat", {
    method: "POST",
    body: formData,
  });
};

export const handleChat = async (message?: string) => {
  return await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });
};
