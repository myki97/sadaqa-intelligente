import axios from "axios";
import type { Besoin, User, Conversation, Message } from "@/types";

const client = axios.create({
  baseURL: process.env.NOCODB_URL,      // ex: http://myki:8080
  headers: {
    "xc-auth": process.env.NOCODB_TOKEN, // token API NocoDB
    "Content-Type": "application/json",
  },
});

// ─── Tables IDs ───────────────────────────────────────────────
// À renseigner après création des tables dans NocoDB
const TABLES = {
  besoins:       process.env.NOCODB_TABLE_BESOINS,
  users:         process.env.NOCODB_TABLE_USERS,
  conversations: process.env.NOCODB_TABLE_CONVERSATIONS,
  messages:      process.env.NOCODB_TABLE_MESSAGES,
};

const url = (table: string | undefined) =>
  `/api/v1/db/data/noco/${process.env.NOCODB_PROJECT_ID}/${table}`;

// ─── BESOINS ──────────────────────────────────────────────────
export const besoins = {
  list: async (params?: { category?: string; status?: string; limit?: number }) => {
    const where = [];
    if (params?.category) where.push(`(category,eq,${params.category})`);
    if (params?.status) where.push(`(status,eq,${params.status})`);
    const res = await client.get(url(TABLES.besoins), {
      params: {
        where: where.length ? where.join("~and") : undefined,
        limit: params?.limit ?? 50,
        sort: "-created_at",
      },
    });
    return res.data.list as Besoin[];
  },

  getById: async (id: string) => {
    const res = await client.get(`${url(TABLES.besoins)}/${id}`);
    return res.data as Besoin;
  },

  create: async (data: Omit<Besoin, "id" | "created_at" | "responses_count">) => {
    const res = await client.post(url(TABLES.besoins), {
      ...data,
      responses_count: 0,
      status: "ouvert",
    });
    return res.data as Besoin;
  },

  updateStatus: async (id: string, status: Besoin["status"]) => {
    await client.patch(`${url(TABLES.besoins)}/${id}`, { status });
  },

  incrementResponses: async (id: string) => {
    const besoin = await besoins.getById(id);
    await client.patch(`${url(TABLES.besoins)}/${id}`, {
      responses_count: besoin.responses_count + 1,
    });
  },
};

// ─── USERS ────────────────────────────────────────────────────
export const users = {
  getById: async (id: string) => {
    const res = await client.get(`${url(TABLES.users)}/${id}`);
    return res.data as User;
  },

  getByEmail: async (email: string) => {
    const res = await client.get(url(TABLES.users), {
      params: { where: `(email,eq,${email})`, limit: 1 },
    });
    return res.data.list[0] as User | undefined;
  },

  create: async (data: Omit<User, "id" | "created_at">) => {
    const res = await client.post(url(TABLES.users), data);
    return res.data as User;
  },

  updateTelegramId: async (id: string, telegram_id: string) => {
    await client.patch(`${url(TABLES.users)}/${id}`, { telegram_id });
  },
};

// ─── CONVERSATIONS ────────────────────────────────────────────
export const conversations = {
  create: async (data: Omit<Conversation, "id" | "created_at">) => {
    const res = await client.post(url(TABLES.conversations), data);
    return res.data as Conversation;
  },

  getByBesoin: async (besoin_id: string) => {
    const res = await client.get(url(TABLES.conversations), {
      params: { where: `(besoin_id,eq,${besoin_id})` },
    });
    return res.data.list as Conversation[];
  },

  getByUser: async (user_id: string) => {
    const res = await client.get(url(TABLES.conversations), {
      params: {
        where: `(donateur_id,eq,${user_id})~or(beneficiaire_id,eq,${user_id})`,
        sort: "-created_at",
      },
    });
    return res.data.list as Conversation[];
  },
};

// ─── MESSAGES ─────────────────────────────────────────────────
export const messages = {
  list: async (conversation_id: string) => {
    const res = await client.get(url(TABLES.messages), {
      params: {
        where: `(conversation_id,eq,${conversation_id})`,
        sort: "created_at",
        limit: 100,
      },
    });
    return res.data.list as Message[];
  },

  create: async (data: Omit<Message, "id" | "created_at">) => {
    const res = await client.post(url(TABLES.messages), data);
    return res.data as Message;
  },
};
