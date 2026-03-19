import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json(
      { error: "Email required" },
      { status: 400 }
    );
  }

  return NextResponse.json({
    success: true,
    user: {
      email,
      name: email.split("@")[0],
      humanVerified: true,
      leftoverScrews: 5,
    },
  });
}
