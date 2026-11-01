import { Tag, Users } from 'lucide-react';

const NGORO_ORO_REGIONS = [
    'Padukuhan Gembyong (Jurug Gedhe)',
    'Padukuhan Salaran (Sentra UMKM)',
    'Padukuhan Sepat',
    'Padukuhan Klegung',
    'Padukuhan Tawang',
    'Padukuhan Senggotan',
    'Padukuhan Gunung Asem',
    'Padukuhan Soka',
    'Padukuhan Jati Kuning'
];

interface DestinationBasicInfoProps {
    entryType: 'destination' | 'package';
    name: string;
    setName: (val: string) => void;
    type: string;
    setType: (val: string) => void;
    price: number | '';
    setPrice: (val: number | '') => void;
    quota: number | '';
    setQuota: (val: number | '') => void;
}

export default function DestinationBasicInfo({
    entryType,
    name,
    setName,
    type,
    setType,
    price,
    setPrice,
    quota,
    setQuota,
}: DestinationBasicInfoProps) {
    return (
        <div className="space-y-4">
            {/* Nama */}
            <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">
                    Nama {entryType === 'destination' ? 'Destinasi Wisata' : 'Paket Bundling'}
                </label>
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Tag className="w-4 h-4" />
                    </span>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Paket Wisata + Hampers Karak Sedyo Maju"
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                    />
                </div>
            </div>

            {/* Lokasi, Harga, Kuota */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Lokasi Padukuhan</label>
                    <select
                        value={type}
                        onChange={(e) => setType(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none cursor-pointer"
                    >
                        {NGORO_ORO_REGIONS.map((region) => (
                            <option key={region} value={region}>{region}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Harga Tiket / Paket (Rp)</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 font-bold text-xs">Rp</span>
                        <input
                            type="number"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1.5">Kuota Harian</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                            <Users className="w-4 h-4" />
                        </span>
                        <input
                            type="number"
                            required
                            value={quota}
                            onChange={(e) => setQuota(e.target.value === '' ? '' : Number(e.target.value))}
                            className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50/70 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}