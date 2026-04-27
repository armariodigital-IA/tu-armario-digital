import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { User } from "@/models/User";
import { normalizeGender } from "@/lib/style-system";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { name, email, password, gender } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Faltan campos" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "Usuario ya existe" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      gender: normalizeGender(gender),
      styles: [],
      styleMemory: {
        styleWeights: {},
        colorWeights: {},
        silhouetteWeights: {},
        lastGeneratedOutfits: [],
      },
    });

    return NextResponse.json({
      message: "Usuario creado",
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        gender: newUser.gender,
        styles: newUser.styles,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error en el servidor" },
      { status: 500 }
    );
  }
}
