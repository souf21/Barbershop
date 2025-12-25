// models/Booking.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export interface IBooking extends Document {
  phone: string;
  date: string; // "YYYY-MM-DD"
  timeSlot: string; // "HH:mm"
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  phone: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
    index: true,
  },
  timeSlot: {
    type: String,
    required: true,
    index: true,
  },
  createdAt: { type: Date, default: Date.now },
});

// Prevent duplicate bookings at DB level
bookingSchema.index({ date: 1, timeSlot: 1 }, { unique: true });

const Booking: Model<IBooking> =
  (mongoose.models.Booking as Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", bookingSchema);

export default Booking;
