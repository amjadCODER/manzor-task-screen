import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ready",
    message: "Microsoft Graph connection layer is prepared. Add OAuth credentials to enable live To Do data.",
  });
}
