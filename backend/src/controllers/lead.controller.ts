import { Request, Response } from 'express';
import { asyncHandler, sendSuccess } from '../utils/response';
import * as leadService from '../services/lead.service';
import { LeadQueryInput } from '../validations';

export const getLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = req.query as unknown as LeadQueryInput;
  const { leads, meta } = await leadService.getLeads(query);
  sendSuccess(res, 'Leads fetched successfully', leads, 200, meta);
});

export const getLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const lead = await leadService.getLeadById(req.params.id);
  sendSuccess(res, 'Lead fetched successfully', lead);
});

export const createLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const lead = await leadService.createLead(req.body);
  sendSuccess(res, 'Lead created successfully', lead, 201);
});

export const updateLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const lead = await leadService.updateLead(req.params.id, req.body);
  sendSuccess(res, 'Lead updated successfully', lead);
});

export const deleteLead = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  await leadService.deleteLead(req.params.id);
  sendSuccess(res, 'Lead deleted successfully');
});

export const getLeadStats = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const stats = await leadService.getLeadStats();
  sendSuccess(res, 'Stats fetched successfully', stats);
});

export const exportLeads = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const query = req.query as unknown as Omit<LeadQueryInput, 'page' | 'limit'>;
  const leads = await leadService.exportLeads(query);

  const headers = ['Name', 'Email', 'Status', 'Source', 'Created At'];
  const rows = leads.map((l) => [
    l.name,
    l.email,
    l.status,
    l.source,
    new Date(l.createdAt).toISOString(),
  ]);

  const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=leads.csv');
  res.status(200).send(csv);
});
