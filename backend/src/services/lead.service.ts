import { FilterQuery } from 'mongoose';
import { Lead } from '../models/Lead';
import { AppError } from '../utils/AppError';
import { ILead, PaginationMeta } from '../interfaces';
import { CreateLeadInput, UpdateLeadInput, LeadQueryInput } from '../validations';
import { PAGINATION } from '../constants';

export const getLeads = async (
  query: LeadQueryInput
): Promise<{ leads: ILead[]; meta: PaginationMeta }> => {
  const { status, source, search, sort, page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = query;

  const filter: FilterQuery<ILead> = {};
  if (status) filter.status = status;
  if (source) filter.source = source;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const sortOrder = sort === 'oldest' ? 1 : -1;
  const skip = (page - 1) * limit;

  const [leads, totalRecords] = await Promise.all([
    Lead.find(filter).sort({ createdAt: sortOrder }).skip(skip).limit(limit),
    Lead.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(totalRecords / limit);
  return {
    leads,
    meta: {
      currentPage: page,
      totalPages,
      totalRecords,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

export const getLeadById = async (id: string): Promise<ILead> => {
  const lead = await Lead.findById(id);
  if (!lead) throw new AppError('Lead not found', 404);
  return lead;
};

export const createLead = async (input: CreateLeadInput): Promise<ILead> => {
  return Lead.create(input);
};

export const updateLead = async (id: string, input: UpdateLeadInput): Promise<ILead> => {
  const lead = await Lead.findByIdAndUpdate(id, input, { new: true, runValidators: true });
  if (!lead) throw new AppError('Lead not found', 404);
  return lead;
};

export const deleteLead = async (id: string): Promise<void> => {
  const lead = await Lead.findByIdAndDelete(id);
  if (!lead) throw new AppError('Lead not found', 404);
};

export const getLeadStats = async (): Promise<{
  total: number;
  new: number;
  contacted: number;
  qualified: number;
  lost: number;
}> => {
  const [total, newCount, contacted, qualified, lost] = await Promise.all([
    Lead.countDocuments(),
    Lead.countDocuments({ status: 'New' }),
    Lead.countDocuments({ status: 'Contacted' }),
    Lead.countDocuments({ status: 'Qualified' }),
    Lead.countDocuments({ status: 'Lost' }),
  ]);
  return { total, new: newCount, contacted, qualified, lost };
};

export const exportLeads = async (query: Omit<LeadQueryInput, 'page' | 'limit'>): Promise<ILead[]> => {
  const filter: FilterQuery<ILead> = {};
  if (query.status) filter.status = query.status;
  if (query.source) filter.source = query.source;
  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { email: { $regex: query.search, $options: 'i' } },
    ];
  }
  const sortOrder = query.sort === 'oldest' ? 1 : -1;
  return Lead.find(filter).sort({ createdAt: sortOrder });
};
