import mongoose from "mongoose";

type UserDoc = {
  email: string;
  passwordHash: string;
  refreshTokenHash:string | null;
  createdAt: Date;
  updatedAt: Date;
};

const userSchema = new mongoose.Schema<UserDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    refreshTokenHash: { type: String, default: null },
  },
  { timestamps: true }
);



export const User = mongoose.model<UserDoc>("User", userSchema);
