import { Request, Response } from 'express';
import db from '../utils/database';
import storageService from '../services/storageService';

export interface Alert {
    id: string;
    type: 'warning' | 'critical' | 'info';
    title: string;
    message: string;
    folderId?: number;
    timestamp: string;
    severity: 'low' | 'medium' | 'high';
}

class AlertController {
    async getAlerts(req: Request, res: Response) {
        try {
            const folders = await db.getFolders();
            const alerts: Alert[] = [];

            for (const folder of folders) {
                const usedMB = await storageService.getDirectorySize(folder.path);
                const usagePercent = (usedMB / folder.limitMB) * 100;

                if (usagePercent >= 95) {
                    alerts.push({
                        id: `crit-${folder.id}`,
                        type: 'critical',
                        title: 'Quota Critical',
                        message: `The share "${folder.name}" has reached ${usagePercent.toFixed(1)}% of its ${folder.limitMB}MB quota.`,
                        folderId: folder.id,
                        timestamp: new Date().toISOString(),
                        severity: 'high'
                    });
                } else if (usagePercent >= 80) {
                    alerts.push({
                        id: `warn-${folder.id}`,
                        type: 'warning',
                        title: 'Storage Warning',
                        message: `The share "${folder.name}" is at ${usagePercent.toFixed(1)}% usage. Consider expanding the quota.`,
                        folderId: folder.id,
                        timestamp: new Date().toISOString(),
                        severity: 'medium'
                    });
                }
            }

            // Global system alerts (example)
            if (folders.length === 0) {
                alerts.push({
                    id: 'sys-no-shares',
                    type: 'info',
                    title: 'System Ready',
                    message: 'No shared folders detected. Create your first network share to start.',
                    timestamp: new Date().toISOString(),
                    severity: 'low'
                });
            }

            res.json(alerts);
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching alerts', error: error.message });
        }
    }

    async getConfig(req: Request, res: Response) {
        try {
            const config = await db.getConfig();
            res.json(config);
        } catch (error: any) {
            res.status(500).json({ message: 'Error fetching config', error: error.message });
        }
    }

    async updateConfig(req: Request, res: Response) {
        try {
            const config = await db.updateConfig(req.body);
            res.json(config);
        } catch (error: any) {
            res.status(500).json({ message: 'Error updating config', error: error.message });
        }
    }

    async testSMTP(req: Request, res: Response) {
        const { host, port, user, password } = req.body;
        
        try {
            const nodemailer = require('nodemailer');
            const transporter = nodemailer.createTransport({
                host,
                port: Number(port),
                secure: Number(port) === 465,
                auth: {
                    user,
                    pass: password
                },
                timeout: 10000 // 10 seconds timeout
            });

            await transporter.verify();
            res.json({ success: true, message: 'SMTP connection successful!' });
        } catch (error: any) {
            console.error('SMTP Test Error:', error);
            res.status(500).json({ 
                success: false, 
                message: 'Failed to connect to SMTP server', 
                error: error.message 
            });
        }
    }
}

export default new AlertController();
