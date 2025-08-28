import { ulid } from "ulid";

export class User {
  userId: string;
  phone: string;
  createdAt: string;
  name?: string;
  photoUrl?: string;

  constructor(phone: string) {
    this.userId = ulid();
    this.phone = phone;
    this.createdAt = new Date().toISOString();
  }
}
