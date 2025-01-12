import { Langfuse } from "langfuse"
import { CallbackHandler } from "langfuse-langchain"

let langfuseHandler = null
export const getLangfuseHandler = () => {
  if (!langfuseHandler) {
    langfuseHandler = new CallbackHandler({
      publicKey: "pk-lf-8e12135e-2d38-4bd5-9de9-0197b1b86c8b",
      secretKey: "sk-lf-18236683-ecd2-4aeb-b9f0-15a74a6c2864",
      baseUrl: "http://localhost:3000"
    })
  }

  return langfuseHandler
}
