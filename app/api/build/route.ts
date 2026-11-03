import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST() {
  return NextResponse.json(
    {
      error: "COMPILER_NOT_CONFIGURED",
      message: "AXIN build workers are not connected yet. No protected output was generated.",
    },
    { status: 503 },
  );
}
