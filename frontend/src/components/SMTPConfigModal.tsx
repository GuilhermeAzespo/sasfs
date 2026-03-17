import React, { useState, useEffect } from 'react';
import { X, Mail, Save, Loader2 } from 'lucide-react';
import { alertService } from '../services/api';

interface SMTPConfigModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SMTPConfigModal: React.FC<SMTPConfigModalProps> = ({ isOpen, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
    const [config, setConfig] = useState({
        host: '',
        port: '',
        user: '',
        password: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchConfig();
        }
    }, [isOpen]);

    const fetchConfig = async () => {
        setLoading(true);
        try {
            const currentConfig = await alertService.getConfig();
            if (currentConfig.smtp) {
                setConfig({
                    host: currentConfig.smtp.host || '',
                    port: currentConfig.smtp.port || '',
                    user: currentConfig.smtp.user || '',
                    password: currentConfig.smtp.password || ''
                });
            }
        } catch (error) {
            console.error('Error fetching SMTP config:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await alertService.updateConfig({ smtp: config });
            onClose();
        } catch (error) {
            console.error('Error saving SMTP config:', error);
        } finally {
            setSaving(false);
        }
    };

    const handleTestConnection = async () => {
        setTesting(true);
        setTestResult(null);
        try {
            const result = await alertService.testSMTP(config);
            setTestResult(result);
        } catch (error: any) {
            setTestResult({
                success: false,
                message: error.response?.data?.message || 'Connection failed'
            });
        } finally {
            setTesting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6 sm:p-0">
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-md animate-fade-in"
                onClick={onClose}
            />
            <div className="relative glass-container w-full max-w-lg p-8 animate-slide-up border-white/10">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4 text-left">
                        <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                            <Mail className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">SMTP Configuration</h3>
                            <p className="text-sm text-slate-500">Service for system alert emails</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                        <p className="text-sm text-slate-400">Loading configuration...</p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4 text-left">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Host</label>
                                <input
                                    type="text"
                                    value={config.host}
                                    onChange={(e) => setConfig({ ...config, host: e.target.value })}
                                    placeholder="smtp.example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Port</label>
                                <input
                                    type="number"
                                    value={config.port}
                                    onChange={(e) => setConfig({ ...config, port: e.target.value })}
                                    placeholder="587"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Authentication User</label>
                            <input
                                type="email"
                                value={config.user}
                                onChange={(e) => setConfig({ ...config, user: e.target.value })}
                                placeholder="alerts@system.com"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                            />
                        </div>

                        <div className="space-y-2 text-left">
                            <label className="text-xs font-black text-slate-500 uppercase tracking-widest px-1">Password</label>
                            <input
                                type="password"
                                value={config.password}
                                onChange={(e) => setConfig({ ...config, password: e.target.value })}
                                placeholder="••••••••"
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 transition-all text-sm"
                            />
                        </div>

                        {testResult && (
                            <div className={`p-3 rounded-xl text-xs font-bold ${testResult.success ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                                {testResult.message}
                            </div>
                        )}

                        <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                            <button
                                type="button"
                                onClick={handleTestConnection}
                                disabled={testing}
                                className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Test Connection'}
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                        Save Config
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default SMTPConfigModal;
