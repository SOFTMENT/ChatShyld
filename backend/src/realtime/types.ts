export type ConnectionItem = {
  connectionId: string;
  userId: string;
  lastSeen: string;
  ttl: number;
};

export type MessageKind = "text" | "media";

export type MediaInfo = {
  key: string;
  mime: string;
  size?: number;
  width?: number;
  height?: number;
  durationMs?: number;
  filename?: string;
};

export type MessageItem = {
  convoId: string;
  messageId: string;
  fromUser: string;
  toUser: string;
  kind: MessageKind;
  body?: string | null;
  media?: MediaInfo | null;
  createdAt: string;
  status: "sent";
};

export type ConversationItem = {
  convoId: string;
  p1: string;
  p2: string;
  lastMessageAt: string;
  lastPreview: string;
};

export type WsTypingPayload = {
  type: "typing";
  fromUser: string;
  typing: boolean;
};

export type WsNewMessagePayload = {
  type: "message.new";
  convoId: string;
  message: Pick<
    MessageItem,
    "messageId" | "fromUser" | "toUser" | "body" | "media" | "createdAt"
  >;
};
