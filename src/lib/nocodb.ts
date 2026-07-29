import axios from "axios";
import type { Besoin, User, Conversation, Message } from "@/types";

const client = axios.create({
  baseURL: process.env.NOCODB_URL,
  headers: {
    "xc-token": process.env.NOCODB_TOKEN,
    "Content-Type": "application/json",
  },
});

const url = (table: string | undefined) =>
  `/api/v1/db/data/noco/${process.env.NOCODB_PROJECT_ID}/${table}`;

export const besoins = {
  list: async (params?: { category?: string; status?: string; limit?: number }) => {
    const where = [];
    if (params?.category) where.push(`(category,eq,${params.category})`);
    if (params?.status) where.push(`(status,eq,${params.status})`);
    const res = await client.get(url(process.env.NOCODB_TABLE_BESOINS), {
      params: {
        where: where.length ? where.join("~and") : undefined,
        limit: params?.limit ?? 50,
        sort: "-CreatedAt",
      },
    });
    return res.data.list as Besoin[];
  },

  getById: async (id: string) => {
    const res = await client.get(`${url(process.env.NOCODB_TABLE_BESOINS)}/${id}`);
    return res.data as Besoin;
  },

  create: async (data: Omit<Besoin, "id" | "created_at" | "responses_count">) => {
    const res = await client.post(url(process.env.NOCODB_TABLE_BESOINS), {
      ...data,
      responses_count: 0,
      status: "ouvert",
    });
    return res.data as Besoin;
  },

  updateStatus: async (id: string, status: Besoin["status"]) => {
    await client.patch(`${url(process.env.NOCODB_TABLE_BESOINS)}/${id}`, { status });
  },

  incrementResponses: async (id: string) => {
    const besoin = await besoins.getById(id);
    await client.patch(`${url(process.env.NOCODB_TABLE_BESOINS)}/${id}`, {
      responses_count: besoin.responses_count + 1,
    });
  },
};

export const users = {
  getById: async (id: string) => {
    const res = await client.get(`${url(process.env.NOCODB_TABLE_USERS)}/${id}`);
    return res.data as User;
  },

  getByEmail: async (email: string) => {
    const res = await client.get(url(process.env.NOCODB_TABLE_USERS), {
      params: { where: `(email,eq,${email})`, limit: 1 },
    });
    return res.data.list[0] as User | undefined;
  },

  create: async (data: Omit<User, "id" | "created_at">) => {
    const res = await client.post(url(process.env.NOCODB_TABLE_USERS), data);
    return res.data as User;
  },

  updateTelegramId: async (id: string, telegram_id: string) => {
    await client.patch(`${url(process.env.NOCODB_TABLE_USERS)}/${id}`, { telegram_id });
  },
};

export const conversations = {
  create: async (data: Omit<Conversation, "id" | "created_at">) => {
    const res = await client.post(url(process.env.NOCODB_TABLE_CONVERSATIONS), data);
    return res.data as Conversation;
  },

  getByUser: async (user_id: string) => {
    const res = await client.get(url(process.env.NOCODB_TABLE_CONVERSATIONS), {
      params: {
        where: `(donateur_id,eq,${user_id})~or(beneficiaire_id,eq,${user_id})`,
        sort: "-CreatedAt",
      },
    });
    return res.data.list as Conversation[];
  },
};

export const messages = {
  list: async (conversation_id: string) => {
    const res = await client.get(url(process.env.NOCODB_TABLE_MESSAGES), {
      params: {
        where: `(conversation_id,eq,${conversation_id})`,
        sort: "CreatedAt",
        limit: 100,
      },
    });
    return res.data.list as Message[];
  },

  create: async (data: Omit<Message, "id" | "created_at">) => {
    const res = await client.post(url(process.env.NOCODB_TABLE_MESSAGES), data);
    return res.data as Message;
  },
};
