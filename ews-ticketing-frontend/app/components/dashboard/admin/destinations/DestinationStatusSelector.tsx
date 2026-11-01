import { ShieldAlert } from 'lucide-react';

interface DestinationStatusSelectorProps {
    status: 'Aktif' | 'Darurat Ditutup';
    setStatus: (val: 'Aktif' | 'Darurat Ditutup') => void;
}

export default function DestinationStatusSelector({ status, setStatus }: DestinationStatusSelectorProps) {
    return (
        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-slate-400" /> Status Operasional (EWS)
            </label>
            <select
                value={status}
                onChange={(e) => setStatus(e.target.value as 'Aktif' | 'Darurat Ditutup')}
                className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
            >
                <option value="Aktif">🟢 Aktif (Normal)</option>
                <option value="Darurat Ditutup">🔴 Darurat Ditutup (Siaga EWS)</option>
            </select>
        </div>
    );
}