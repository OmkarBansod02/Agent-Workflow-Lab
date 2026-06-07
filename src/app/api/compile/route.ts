import { NextResponse } from "next/server";
import { compileWorkflow } from "@/lib/compiler";

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

  if (!isCompileRequest(body)) {
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
    const compiledWorkflow = await compileWorkflow(workflowRequest);

    return NextResponse.json({ compiledWorkflow });
  } catch {
    return NextResponse.json(
      { error: "Unable to compile workflow." },
      { status: 500 },
    );
  }
}

function isCompileRequest(body: unknown): body is { request: string } {
  return (
    typeof body === "object" &&
    body !== null &&
    "request" in body &&
    typeof (body as { request?: unknown }).request === "string"
  );
}
