import { NextResponse } from "next/server";
import { runWorkflow } from "@/lib/runner";
import {
  compiledWorkflowSchema,
  type CompiledWorkflow,
} from "@/lib/compiler-schema";

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

  const compiledWorkflow = parseCompiledWorkflow(body);

  if (compiledWorkflow.status === "invalid") {
    return NextResponse.json(
      {
        error:
          "Invalid compiled workflow. Recompile the workflow and try again.",
      },
      { status: 400 },
    );
  }

  try {
    return NextResponse.json(
      runWorkflow(workflowRequest, compiledWorkflow.workflow),
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to run seeded workflow." },
      { status: 500 },
    );
  }
}

function isRunRequest(body: unknown): body is {
  request: string;
  compiledWorkflow?: unknown;
} {
  return (
    typeof body === "object" &&
    body !== null &&
    "request" in body &&
    typeof (body as { request?: unknown }).request === "string"
  );
}

function parseCompiledWorkflow(
  body: { compiledWorkflow?: unknown },
):
  | { status: "absent"; workflow?: undefined }
  | { status: "valid"; workflow: CompiledWorkflow }
  | { status: "invalid"; workflow?: undefined } {
  if (!("compiledWorkflow" in body)) {
    return { status: "absent" };
  }

  const result = compiledWorkflowSchema.safeParse(body.compiledWorkflow);

  if (!result.success) {
    return { status: "invalid" };
  }

  return { status: "valid", workflow: result.data };
}
