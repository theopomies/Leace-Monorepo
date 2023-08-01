import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/http";
import { appRouter, createContext } from "../../../../../packages/api";
import type { NextApiRequest, NextApiResponse } from "next";

const checkInactivity = async (req: NextApiRequest, res: NextApiResponse) => {
  const ctx = await createContext({ req, res });
  const caller = appRouter.createCaller(ctx);

  if (req.headers.authorization !== process.env.MERGENT_KEY) {
    res.status(401).json({
      error: { message: `Unauthorized` },
    });
    return;
  }
  try {
    const result = await caller.cron.checkInactivity();
    res.status(200).json(result);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const httpStatusCode = getHTTPStatusCodeFromError(cause);
      res.status(httpStatusCode).json({ error: { message: cause.message } });
      return;
    }
    res.status(500).json({
      error: { message: `Error while trying to launch the job` },
    });
  }
};

export default checkInactivity;
