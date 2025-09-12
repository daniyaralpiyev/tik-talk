import { Chat, LastMessageRes, Message } from "./interfaces/chats.interface";
import { Pageble } from "./interfaces/pageble.interface";
import { Post } from "./interfaces/post.interface";
import { Profile } from "./interfaces/profile.interface";
import { AboutMyselfService } from "./services/about-myself.service";
import { ChatsService } from "./services/chats.service";
import { GlobalStoreService } from "./services/global-store.service";
import { MockService } from "./services/mock.service";
import { PostService } from "./services/post.service";
import { ProfileService } from "./services/profile-service";

export {
  AboutMyselfService,
  ChatsService,
  MockService,
  PostService,
  ProfileService,
  GlobalStoreService
}

export type {
  Chat,
  Message,
  LastMessageRes,
  Pageble,
  Post,
  Profile
}
