import { TokenResponse } from "./interfaces/auth.interface";
import { Chat, LastMessageRes, Message } from "./interfaces/chats.interface";
import { Pageble } from "./interfaces/pageble.interface";
import { CommentCreateDto, Post, PostComment, PostCreateDto } from "./interfaces/post.interface";
import { Profile } from "./interfaces/profile.interface";
import { AboutMyselfService } from "./services/about-myself.service";
import { AuthService } from "./services/auth.service";
import { ChatsService } from './services/chats.service';
import { GlobalStoreService } from "./services/global-store.service";
import { MockService } from "./services/mock.service";
import { PostService } from "./services/post.service";
import { ProfileService } from "./services/profile-service";
import { SignalStoreService } from "./services/signal-store";

export {
  AuthService,
  AboutMyselfService,
  ChatsService,
  MockService,
  PostService,
  ProfileService,
  GlobalStoreService,
  SignalStoreService
}

export type {
  TokenResponse,
  Chat,
  Message,
  LastMessageRes,
  Pageble,
  PostCreateDto,
  Post,
  PostComment,
  CommentCreateDto,
  Profile
}
