import { ChatMessage } from '../models/chat-message.model';
import { ChatClient } from '../models/chat-client.model';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  addMessage(message: string, clientId: string): ChatMessage;

  addClient(id: string, nickname: string): Promise<ChatClient>;

  getClients(): Promise<ChatClient[]>;

  getMessages(): ChatMessage[];

  deleteClient(id: string): Promise<void>;

  updateTyping(typing: boolean, id: string): ChatClient;
}
