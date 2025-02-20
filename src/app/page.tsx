"use client";

export const dynamic = "force-static";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";

import Particles from "@/ui/particles";

interface FormValues {
  username: string;
  password: string;
}

export default function Page() {
  const { push } = useRouter();
  const { register, handleSubmit } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormValues) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      push("/chat");
    }, 3000);

    console.log(data, "data");
  };

  return (
    <div className="overflow space-y-6">
      <div className="flex h-screen w-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-tl from-black via-zinc-600/20 to-black">
        <Particles className="absolute inset-0 -z-10" quantity={100} />
        <div className="flex flex-col items-center gap-4 pb-32">
          <h1 className="text-edge-outline font-display z-10 cursor-default whitespace-nowrap bg-white bg-clip-text px-0.5 py-3.5 text-4xl text-transparent duration-1000 sm:text-6xl md:text-9xl ">
            Emil IA
          </h1>

          <form
            className="w-full max-w-screen-lg"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-4">
              <div className="flex-1 flex items-center rounded-lg bg-black">
                <input
                  className="p-4 h-14 w-full border-none bg-transparent text-gray-400 placeholder-gray-600 focus:outline-none focus:ring-0"
                  id="message"
                  type="text"
                  required
                  {...register("username")}
                  placeholder="Nome de usuário"
                />
              </div>
              <div className="flex-1 flex items-center rounded-lg bg-black">
                <input
                  className="p-4 h-14 w-full border-none bg-transparent text-gray-400 placeholder-gray-600 focus:outline-none focus:ring-0"
                  id="message"
                  type="password"
                  placeholder="Senha"
                  required
                  {...register("password")}
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="p-4 h-14 rounded-lg text-sm bg-orange-400 disabled:cursor-not-allowed disabled:bg-gray-500 text-white hover:opacity-80 transition-opacity"
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
                  "Entrar"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
