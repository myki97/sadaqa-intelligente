import { NextRequest, NextResponse } from "next/server";
import { besoins, conversations, users } from "@/lib/nocodb";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const besoin = await besoins.getById(id);
    return NextResponse.json(besoin);
  } catch {
    return NextResponse.json({ error: "Besoin introuvable" }, { status: 404 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { donateur_id } = await req.json();

    const besoin = await besoins.getById(id);
    if (besoin.status !== "ouvert") {
      return NextResponse.json({ error: "Ce besoin n'est plus disponible" }, { status: 409 });
    }

    const conversation = await conversations.create({
      besoin_id: id,
      besoin_title: besoin.title,
      donateur_id,
      beneficiaire_id: besoin.user_id,
      status: "active",
    });

    await besoins.incrementResponses(id);

    return NextResponse.json({ conversation_id: conversation.id }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
