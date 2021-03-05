import { ChatMessage } from '../models/chat-message.model';
import { ChatClient } from '../models/chat-client.model';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  addMessage(message: string, clientId: string): ChatMessage;

  addClient(id: string, nickname: string): Promise<ChatClient>;

  getClients(): ChatClient[];

  getMessages(): ChatMessage[];

  deleteClient(id: string): void;

  updateTyping(typing: boolean, id: string): ChatClient;
}
