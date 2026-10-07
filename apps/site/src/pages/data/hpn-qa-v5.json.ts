import type { APIRoute } from "astro";
import data from "../../data/hpn-qa-v5.json";

/** HPN-QA v5.0 without its evidence quotes, served for the NetBench explorer. */
export const GET: APIRoute = () =>
  new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json; charset=utf-8" },
  });
