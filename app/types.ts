export interface TUser {
  id: String;
  username: String;
  password: String;
  followers: TUser[];
  following: TUser[];
  posts: TPost[];
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
