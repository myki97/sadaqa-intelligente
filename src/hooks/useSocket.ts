import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import type { Message } from "@/types";

export function useSocket(conversationId: string | null) {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping]  = useState(false);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!conversationId) return;

    // Connexion au serveur Socket.io sur myki
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
      transports: ["websocket"],
    });

    const socket = socketRef.current;

    socket.on("connect", () => {
      setConnected(true);
      socket.emit("join_conversation", conversationId);
    });

    socket.on("disconnect", () => setConnected(false));

    socket.on("new_message", (msg: Message) => {
      setMessages(prev => [...prev, msg]);
    });

    socket.on("user_typing", () => {
      setIsTyping(true);
      setTimeout(() => setIsTyping(false), 3000);
    });

    socket.on("user_stop_typing", () => setIsTyping(false));

    return () => {
      socket.disconnect();
    };
  }, [conversationId]);

  const sendMessage = (data: {
    senderId: string;
    senderAlias: string;
    content: string;
  }) => {
    if (!socketRef.current || !conversationId) return;
    socketRef.current.emit("send_message", {
      conversationId,
      ...data,
    });
  };

  const emitTyping = () => {
    if (!socketRef.current || !conversationId) return;
    socketRef.current.emit("typing", { conversationId });
  };

  const confirmDon = (besoinId: string) => {
    if (!socketRef.current || !conversationId) return;
    socketRef.current.emit("confirm_don", { conversationId, besoinId });
  };

  return { messages, setMessages, isTyping, connected, sendMessage, emitTyping, confirmDon };
}
