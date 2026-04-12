import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Garment } from "@/models/Garment";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  await connectDB();

  const token = req.headers.get("cookie")?.split("token=")[1];
  if (!token)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 });

  const decoded = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as { id: string };

  const body = await req.json();

  const garment = await Garment.create({
    userId: decoded.id,
    ...body,
  });

  return NextResponse.json(garment);
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const token = req.headers.get("cookie")?.split("token=")[1];

    if (!token) {
      return NextResponse.json([], { status: 200 });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { id: string };

    const garments = await Garment.find({ userId: decoded.id });

    return NextResponse.json(garments);

  } catch (error) {
    console.error(error);
    return NextResponse.json([], { status: 200 });
  }
}