import { NextRequest, NextResponse } from "next/server";
import { besoins } from "@/lib/nocodb";

// GET /api/besoins?category=mobilier&status=ouvert
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const status   = searchParams.get("status")   || "ouvert";

    const data = await besoins.list({ category, status });
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

// POST /api/besoins
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { title, description, category, urgency, city, lat, lng, alias, user_id } = body;

    if (!title || !description || !category || !city || !user_id) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    // Expiration dans 30 jours
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + 30);

    const besoin = await besoins.create({
      title, description, category,
      urgency:    urgency || "normal",
      status:     "ouvert",
      city, lat, lng, alias, user_id,
      expires_at: expires_at.toISOString(),
    });

    return NextResponse.json(besoin, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
