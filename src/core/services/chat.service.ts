import { Injectable } from '@nestjs/common';
import { ChatClient } from '../models/chat-client.model';
import { ChatMessage } from '../models/chat-message.model';
import { IChatService } from '../primary-ports/chat.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from '../../infrastructure/client.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ChatService implements IChatService {
  allMessages: ChatMessage[] = [];
  clients: ChatClient[] = [];

  constructor(@InjectRepository(Client)
              private clientRepository: Repository<Client>) {
  }

  addMessage(message: string, clientId: string): ChatMessage {
    const client = this.clients.find((c) => c.id === clientId);
    const chatMessage: ChatMessage = { message: message, sender: client };
    this.allMessages.push(chatMessage);
    return chatMessage;
  }

  async addClient(id: string, nickname: string): Promise<ChatClient> {
    const clientDb = await this.clientRepository.findOne({nickname: nickname})
    if(!clientDb) {
      let client = this.clientRepository.create();
      client.nickname = nickname;
      client = await this.clientRepository.save(client);
      const chatClient = JSON.parse(JSON.stringify(client));
      this.clients.push(chatClient);
      return chatClient;
    }
    if(clientDb.id === id) {
      return {id: clientDb.id, nickname: clientDb.nickname};
    } else {
      throw new Error('Nickname already used!');
    }
  }

  async getClients(): Promise<ChatClient[]> {
    const clients = await this.clientRepository.find();
    const chatClients: ChatClient[] = JSON.parse(JSON.stringify(clients));
    return chatClients;
  }

  getMessages(): ChatMessage[] {
    return this.allMessages;
  }

  async deleteClient(id: string): Promise<void> {
    await this.clientRepository.delete({id: id});
  }

  updateTyping(typing: boolean, id: string): ChatClient {
    const chatClient = this.clients.find((c) => c.id === id);
    if (chatClient && chatClient.typing !== typing) {
      chatClient.typing = typing;
      return chatClient;
    }
  }
}
