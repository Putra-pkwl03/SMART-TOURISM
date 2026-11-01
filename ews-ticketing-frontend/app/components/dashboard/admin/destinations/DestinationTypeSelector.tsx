import { MapPin, Layers } from 'lucide-react';

interface DestinationTypeSelectorProps {
    entryType: 'destination' | 'package';
    setEntryType: (val: 'destination' | 'package') => void;
}

export default function DestinationTypeSelector({ entryType, setEntryType }: DestinationTypeSelectorProps) {
    return (
        <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Jenis Entri Menu</label>
            <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
                <button
                    type="button"
                    onClick={() => setEntryType('destination')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        entryType === 'destination' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <MapPin className="w-4 h-4" /> Tiket / Destinasi Murni
                </button>
                <button
                    type="button"
                    onClick={() => setEntryType('package')}
                    className={`py-2 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        entryType === 'package' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
                    }`}
                >
                    <Layers className="w-4 h-4" /> Paket Bundling UMKM
                </button>
            </div>
        </div>
    );
}