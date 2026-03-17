import { Router } from 'express';
import alertController from '../controllers/alertController';

const router = Router();

router.get('/', alertController.getAlerts);
router.get('/config', alertController.getConfig);
router.patch('/config', alertController.updateConfig);
router.post('/test-smtp', alertController.testSMTP);

export default router;
