// app/api/availability/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Booking from "@/models/Booking";

const ALL_SLOTS = ["10:00", "10:30", "11:00", "11:30", "12:00"];

export async function GET(req: NextRequest) {
  await connectDB();

  const date = req.nextUrl.searchParams.get("date");
  if (!date) {
    return NextResponse.json({ success: false, message: "Date is required" });
  }

  const booked = await Booking.find({ date }).lean();
  const bookedSlots = booked.map((b) => b.timeSlot);

  const freeSlots = ALL_SLOTS.filter((slot) => !bookedSlots.includes(slot));

  return NextResponse.json({
    success: true,
    freeSlots,
    bookedSlots,
  });
}
