/**
 * Sadaqa Intelligente — Serveur Socket.io
 * À déployer sur myki avec PM2 : pm2 start server.js --name sadaqa-socket
 */

const express    = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const axios      = require("axios");

const app    = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.APP_URL || "https://sadaqa-intelligente.com",
    methods: ["GET", "POST"],
  },
});

// ─── NocoDB client ───────────────────────────────────────────
const nocodb = axios.create({
  baseURL: process.env.NOCODB_URL || "http://localhost:8080",
  headers: { "xc-auth": process.env.NOCODB_TOKEN },
});

const saveMessage = async (data) => {
  try {
    await nocodb.post(
      `/api/v1/db/data/noco/${process.env.NOCODB_PROJECT_ID}/${process.env.NOCODB_TABLE_MESSAGES}`,
      data
    );
  } catch (err) {
    console.error("NocoDB save error:", err.message);
  }
};

// ─── Socket logic ─────────────────────────────────────────────
io.on("connection", (socket) => {
  console.log(`[+] Connexion : ${socket.id}`);

  // Rejoindre une conversation
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
    console.log(`[→] ${socket.id} rejoint conversation ${conversationId}`);
  });

  // Nouveau message
  socket.on("send_message", async (data) => {
    const { conversationId, senderId, senderAlias, content } = data;

    const message = {
      conversation_id: conversationId,
      sender_id:       senderId,
      sender_alias:    senderAlias,
      content,
      created_at:      new Date().toISOString(),
    };

    // Diffuser à tous dans la conversation
    io.to(conversationId).emit("new_message", message);

    // Sauvegarder dans NocoDB
    await saveMessage(message);
  });

  // Indicateur de frappe
  socket.on("typing", ({ conversationId, alias }) => {
    socket.to(conversationId).emit("user_typing", { alias });
  });

  socket.on("stop_typing", ({ conversationId }) => {
    socket.to(conversationId).emit("user_stop_typing");
  });

  // Don confirmé
  socket.on("confirm_don", async ({ conversationId, besoinId }) => {
    io.to(conversationId).emit("don_confirme", { besoinId });
    // Mettre à jour le statut du besoin dans NocoDB
    try {
      await nocodb.patch(
        `/api/v1/db/data/noco/${process.env.NOCODB_PROJECT_ID}/${process.env.NOCODB_TABLE_BESOINS}/${besoinId}`,
        { status: "satisfait" }
      );
    } catch (err) {
      console.error("Update besoin error:", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log(`[-] Déconnexion : ${socket.id}`);
  });
});

// ─── Health check ─────────────────────────────────────────────
app.get("/health", (_, res) => res.json({ status: "ok" }));

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`✅ Socket.io server running on port ${PORT}`);
});
