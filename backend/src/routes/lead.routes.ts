import { Router } from 'express';
import * as leadController from '../controllers/lead.controller';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createLeadSchema, updateLeadSchema, leadQuerySchema } from '../validations';

const router = Router();

router.use(authenticate);

router.get('/', validate(leadQuerySchema, 'query'), leadController.getLeads);
router.get('/stats', leadController.getLeadStats);
router.get('/export', validate(leadQuerySchema, 'query'), leadController.exportLeads);
router.get('/:id', leadController.getLead);
router.post('/', validate(createLeadSchema), leadController.createLead);
router.put('/:id', validate(updateLeadSchema), leadController.updateLead);
router.delete('/:id', authorize('admin'), leadController.deleteLead);

export default router;
