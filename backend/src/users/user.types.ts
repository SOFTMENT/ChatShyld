import { ulid } from "ulid";

export class User {
  userId: string;
  phone: string;
  createdAt: string;
  updatedAt?: string;
  name?: string;
  photoKey?: string;

  constructor(phone: string) {
    this.userId = ulid();
    this.phone = phone;
    this.createdAt = new Date().toISOString();
  }
}
