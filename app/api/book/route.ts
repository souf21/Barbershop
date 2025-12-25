// app/api/book/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import redis from "@/lib/redis";
import Booking from "@/models/Booking";
import twilio from "twilio";

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

export async function POST(req: NextRequest) {
  await connectDB();

  const { phone, date, timeSlot } = await req.json();

  // 1. Check phone verification
  const verified = await redis.get(`verified:${phone}`);
  if (!verified) {
    return NextResponse.json({ success: false, message: "Phone not verified" });
  }

  // 2. Distributed lock
  const lockKey = `lock:${date}:${timeSlot}`;
  const lock = await redis.set(lockKey, "locked", "NX", "EX", 120);

  if (!lock) {
    return NextResponse.json({
      success: false,
      message: "Slot is being booked by someone else",
    });
  }

  // 3. Check if already booked
  const exists = await Booking.findOne({ date, timeSlot });
  if (exists) {
    return NextResponse.json({
      success: false,
      message: "Slot already booked",
    });
  }

  // 4. Create booking
  const booking = await Booking.create({ phone, date, timeSlot });

  // 5. Send confirmation SMS
  try {
    await client.messages.create({
      body: `Your appointment is confirmed for ${date} at ${timeSlot}.`,
      from: process.env.TWILIO_PHONE,
      to: phone,
    });
  } catch (error) {
    console.error("Twilio SMS error:", error);
    // We still return success because the booking is saved
  }

  return NextResponse.json({ success: true, booking });
}