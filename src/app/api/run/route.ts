import { NextResponse } from "next/server";
import { runWorkflow } from "@/lib/runner";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON request body." },
      { status: 400 },
    );
  }

  if (!isRunRequest(body)) {
    return NextResponse.json(
      { error: "Request body must include a non-empty string request." },
      { status: 400 },
    );
  }

  const workflowRequest = body.request.trim();

  if (!workflowRequest) {
    return NextResponse.json(
      { error: "Request body must include a non-empty string request." },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(runWorkflow(workflowRequest));
  } catch {
    return NextResponse.json(
      { error: "Unable to run seeded workflow." },
      { status: 500 },
    );
  }
}

function isRunRequest(body: unknown): body is { request: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    "request" in body &&
    typeof (body as { request?: unknown }).request === "string"
  );
}
