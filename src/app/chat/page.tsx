"use client";

import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { handleChat, handleChatFile } from "@/services/api/chat.api";
import ChatMessageItem from "@/ui/chat-message-item";
import Particles from "@/ui/particles";

interface FormValues {
  message?: string;
  pdfFile?: FileList;
}

interface MessagesData {
  message: string;
  isUser: boolean;
  id: number;
}

export default function Chat() {
  const { register, handleSubmit, reset, control } = useForm<FormValues>();
  const messageValue = useWatch({
    control,
    name: "message",
  });

  const inputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [messages, setMessages] = useState<MessagesData[]>([]);
  const [incomingMessage, setIncomingMessage] = useState("");

  const isButtonDisabled = isLoading || (!file && !messageValue);

  const handleFileButtonClick = () => {
    inputRef.current?.click();
  };

  const handleChangeFileInput = (selectedFile: File | null) => {
    setFile(selectedFile);
  };

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    let response: Response;
    let messageAccumulator = "";
    if (file) {
      const formData = new FormData();
      formData.append("pdf", file);

      response = await handleChatFile(file);
    } else {
      response = await handleChat(data.message);
    }

    if (!response.body) {
      setIsLoading(false);
      return;
    }

    const reader: ReadableStreamDefaultReader<string> = response.body
      .pipeThrough(new TextDecoderStream())
      .getReader();

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        message: data.message ? data.message : file?.name ?? "",
        isUser: true,
      },
    ]);
    setIsLoading(false);

    while (true) {
      const { done, value } = await reader.read();
      setFile(null);
      reset();

      if (done) {
        setMessages((prev) => [
          ...prev,
          { id: prev.length + 1, message: messageAccumulator, isUser: false },
        ]);
        setIncomingMessage("");
        break;
      }

      if (value) {
        messageAccumulator += value;
        setIncomingMessage(messageAccumulator);
      }
    }
  };

  return (
    <div className="overflow space-y-6">
      <div className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
        <Particles className="absolute inset-0 -z-10" quantity={100} />

        {messages && (
          <div className="w-full max-w-screen-lg overflow-y-auto">
            {messages.map((message) => (
              <ChatMessageItem
                isUser={message.isUser}
                key={message.id}
                message={message.message}
              />
            ))}
          </div>
        )}

        {incomingMessage && (
          <div className="w-full max-w-screen-lg">
            <ChatMessageItem isUser={false} message={incomingMessage} />
          </div>
        )}
        <div className="mt-32" />
        <form
          className="w-full max-w-screen-lg absolute bottom-14"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-4">
            {file && (
              <div className="flex gap-2 w-max h-14 p-4 items-center rounded-lg bg-black">
                <span className="text-white">{file.name}</span>
                <button
                  onClick={() => setFile(null)}
                  className="flex items-center text-white"
                  type="button"
                >
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center rounded-lg bg-black">
                <input
                  className="p-4 h-14 w-full border-none bg-transparent text-gray-400 placeholder-gray-600 focus:outline-none focus:ring-0"
                  id="message"
                  type="text"
                  {...register("message")}
                  disabled={isLoading}
                />

                <input
                  id="pdfFile"
                  type="file"
                  {...register("pdfFile")}
                  className="hidden"
                  onChange={(event) =>
                    handleChangeFileInput(
                      event.target.files ? event.target.files[0] : null
                    )
                  }
                  ref={inputRef}
                  accept="application/pdf"
                />

                <div className="pr-4">
                  <button type="button" onClick={handleFileButtonClick}>
                    <svg
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isButtonDisabled}
                className="p-4 rounded-full text-sm bg-orange-400 disabled:cursor-not-allowed disabled:bg-gray-500 text-white hover:opacity-80 transition-opacity"
              >
                {isLoading ? (
                  <div className="text-center">
                    <svg
                      aria-hidden="true"
                      className="inline w-6 h-6 animate-spin fill-gray-500 text-gray-100 dark:text-gray-600"
                      viewBox="0 0 100 101"
                      fill="none"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <svg
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="size-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
