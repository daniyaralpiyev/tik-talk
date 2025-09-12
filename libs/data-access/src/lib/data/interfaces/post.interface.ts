import { Profile } from '../index';

export interface PostCreateDto {
  title: string;
  content: string;
  authorId: number;
}

export interface Post {
  "id": number,
  "title": string,
  "content": string,
  "author": Profile,
  "images": string[],
  "createdAt": string,
  "updatedAt": string,
  "comments": PostComment[],
  "communityId": number,
  "likes": number,
  "likesUsers": string[],
}

export interface PostComment {
  "id": number,
  "text": string,
  "author": {
    "id": 0,
    "username": string,
    "avatarUrl": string,
    "subscribersAmount": 0,
    "firstName": string,
    "lastName": string,
    "isActive": true,
    "stack": [],
    "city": string,
    "description": string
},
  "postId": number,
  "commentId": number,
  "createdAt": string,
  "updatedAt": string
}

export interface CommentCreateDto {
  text: string,
  authorId: number,
  postId: number,
}
