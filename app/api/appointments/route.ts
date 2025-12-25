// app/api/appointments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Appointment from "@/models/Appointment";

export async function POST(req: NextRequest) {
  await connectDB();

  const body = await req.json();

  const appointment = await Appointment.create(body);

  return NextResponse.json({ success: true, appointment });
}
