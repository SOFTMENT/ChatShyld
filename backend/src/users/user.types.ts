import { ulid } from "ulid";

export class User {
  userId: string;
  phone: string;
  countryCode: string;
  createdAt: string;
  updatedAt?: string;
  name?: string;
  photoKey?: string;

  constructor(countryCode: string, phone: string) {
    this.userId = ulid();
    this.phone = phone;
    this.countryCode = countryCode;
    this.createdAt = new Date().toISOString();
  }
}
