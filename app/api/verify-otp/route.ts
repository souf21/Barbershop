// app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import redis from "@/lib/redis";

export async function POST(req: NextRequest) {
  const { phone, otp } = await req.json();

  const stored = await redis.get(`otp:${phone}`);

  if (!stored) {
    return NextResponse.json({ success: false, message: "OTP expired" });
  }

  if (stored !== otp) {
    return NextResponse.json({ success: false, message: "Wrong code" });
  }

  await redis.set(`verified:${phone}`, "true", "EX", 3600);

  return NextResponse.json({ success: true });
}
