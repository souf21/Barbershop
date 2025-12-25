// app/api/send-otp/route.js
import { NextResponse } from "next/server";
import twilio from "twilio";
import redis from "@/lib/redis";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export async function POST(req) {
  const { phone } = await req.json();
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await redis.set(`otp:${phone}`, otp, "EX", 300);

  await client.messages.create({
    body: `Your verification code is ${otp}`,
    from: process.env.TWILIO_PHONE,
    to: phone,
  });

  return NextResponse.json({ success: true });
}
