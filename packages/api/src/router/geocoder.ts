import { Role } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "../trpc";
import axios from "axios";
import { z } from "zod";

interface GeocodeResult {
  id: number;
  name: string;
}

export const geocoderRouter = router({
  autocomplete: protectedProcedure([Role.TENANT, Role.AGENCY, Role.OWNER])
    .input(z.object({ text: z.string().optional() }))
    .query(async ({ input }) => {
      if (!input.text) return [];
      if (input.text.length < 3) return [];
      const response = await axios.get(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${input.text}&apiKey=${process.env.GEOAPIFY_KEY}`,
      );
      if (response.data.error)
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      if (response.data.features.length > 0) {
        const result: GeocodeResult[] = [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        response.data.features.map((feature: any) => {
          result.push({
            id: feature.properties.lon * feature.properties.lat,
            name: feature.properties.formatted,
          });
        });
        console.log("success: " + result);
        return result;
      }
      console.log("error");
      return [];
    }),
});
