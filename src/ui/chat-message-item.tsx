export default function ChatMessageItem({
  message,
  isUser,
}: {
  message: string;
  isUser: boolean;
}) {
  return (
    <div
      style={
        isUser
          ? { width: "60%", justifySelf: "flex-end", marginBottom: "2rem" }
          : { width: "80%", justifySelf: "flex-start", marginBottom: "2rem" }
      }
      className="bg-black p-4 flex  rounded-lg bg-vc-border-gradient shadow-lg shadow-black/20"
    >
      <p className="p-2 m-2">{message}</p>
    </div>
  );
}
