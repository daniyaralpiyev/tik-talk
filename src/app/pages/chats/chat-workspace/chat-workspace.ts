import { Component } from '@angular/core';
import {ChatWorkspaceHeader} from "./chat-workspace-header/chat-workspace-header";
import {ChatWorkspaceMessagesWrapper} from "./chat-workspace-messages-wrapper/chat-workspace-messages-wrapper";
import {MessageInput} from "../../../common-ui/message-input/message-input";

@Component({
  selector: 'app-chat-workspace',
  imports: [
    ChatWorkspaceHeader,
    ChatWorkspaceMessagesWrapper,
    MessageInput
  ],
  templateUrl: './chat-workspace.html',
  styleUrl: './chat-workspace.scss'
})
export class ChatWorkspace {

}
