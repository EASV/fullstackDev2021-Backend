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

  async addClient(chatClient: ChatClient): Promise<ChatClient> {
    const chatClientFoundById = await this.clientRepository.findOne({id: chatClient.id});
    if(chatClientFoundById) {
      return JSON.parse(JSON.stringify(chatClientFoundById));
    }
    const chatClientFoundByNickname = await this.clientRepository.findOne({nickname: chatClient.nickname});
    if(chatClientFoundByNickname) {
      throw new Error('Nickname already used!');
    }
    let client = this.clientRepository.create();
    client.nickname = chatClient.nickname;
    client = await this.clientRepository.save(client);
    const newChatClient = JSON.parse(JSON.stringify(client));
    this.clients.push(newChatClient);
    return newChatClient;
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
