import { createRequestHandler } from "@tanstack/react-start/server";
import { getRouter } from "../src/router";

export const config = {
  runtime: 'edge',
};

export default async function handler(request: Request) {
  const handler = createRequestHandler({
    getRouter,
  });
  return handler(request);
}
