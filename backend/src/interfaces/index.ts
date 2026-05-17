import { Document, Types } from 'mongoose';
import { LEAD_STATUS, LEAD_SOURCE, USER_ROLES } from '../constants';

export type LeadStatus = (typeof LEAD_STATUS)[number];
export type LeadSource = (typeof LEAD_SOURCE)[number];
export type UserRole = (typeof USER_ROLES)[number];

export interface IUser extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface ILead extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalRecords: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
}

export interface LeadFilters {
  status?: string;
  source?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}

export interface JwtPayload {
  id: string;
  role: UserRole;
}
