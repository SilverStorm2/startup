import { NextResponse } from "next/server";
import { analyzePhoto, PhotoAnalysisError, visionModel } from "@/lib/server-photo-analysis";

export const runtime = "nodejs";
export const maxDuration = 120;
const MAX_BYTES = 2 * 1024 * 1024;
const fail = (code: string, status: number) => NextResponse.json({ code }, { status, headers: { "Cache-Control": "no-store" } });

export async function POST(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return fail("INVALID_ORIGIN", 403);
  const type = request.headers.get("content-type")?.split(";")[0];
  if (!type || !["image/jpeg", "image/png", "image/webp"].includes(type)) return fail("INVALID_IMAGE", 415);
  if (Number(request.headers.get("content-length")) > MAX_BYTES) return fail("IMAGE_TOO_LARGE", 413);
  try {
    const reader = request.body?.getReader();
    if (!reader) return fail("INVALID_IMAGE", 400);
    let length = 0;
    const chunks: Uint8Array[] = [];
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > MAX_BYTES) { await reader.cancel(); return fail("IMAGE_TOO_LARGE", 413); }
      chunks.push(value);
    }
    const bytes = Buffer.concat(chunks);
    const valid = type === "image/jpeg" ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff :
      type === "image/png" ? bytes.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10])) :
      bytes.toString("ascii", 0, 4) === "RIFF" && bytes.toString("ascii", 8, 12) === "WEBP";
    if (!valid) return fail("INVALID_IMAGE", 400);
    const suggestion = await analyzePhoto(new Blob([bytes], { type }));
    return NextResponse.json({ suggestion, source: "huggingface", model: visionModel }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    // Never return upstream request headers, token or filesystem paths.
    return fail(error instanceof PhotoAnalysisError ? error.code : "ANALYSIS_UNAVAILABLE", error instanceof PhotoAnalysisError ? error.status : 503);
  }
}
