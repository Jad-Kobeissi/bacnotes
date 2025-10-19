export interface TUser {
  id: String;
  username: String;
  password: String;
  followers: TUser[];
  following: TUser[];
  posts: TPost[];
  admin: Boolean;
  grade: Number;
  points: Number;
  rating: Number;
  likedPosts: TPost[];
  createdAt: Date;
}
export interface TPost {
  id: String;
  authorId: String;
  title: String;
  description: String;
  subject: String;
  imageUrls: String[];
  author: TUser;
  likes: Number;
  likedUsers: TUser[];
  createdAt: Date;
}
export interface TReport {
  id: String;
  user: TUser;
  userId: String;
}
export interface TRequest {
  id: String;
  author: TUser;
  authorId: String;
  title: String;
  description: String;
  subject: String;
  responses: TResponse[];
  createdAt: Date;
}
export interface TResponse {
  id: String;
  request: TRequest;
  requestId: String;
  author: TUser;
  authorId: String;
  title: String;
  description: String;
  subject: String;
  imageUrls: String[];
  createdAt: Date;
}
