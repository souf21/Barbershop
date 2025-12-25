// models/Appointment.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export interface IAppointment extends Document {
  barberId: string;
  date: string;
  time: string;
  clientName: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    barberId: { type: String, required: true },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    time: { type: String, required: true }, // "HH:mm"
    clientName: { type: String, required: true },
  },
  { timestamps: true }
);

const Appointment: Model<IAppointment> =
  (mongoose.models.Appointment as Model<IAppointment>) ||
  mongoose.model<IAppointment>("Appointment", appointmentSchema);

export default Appointment;
