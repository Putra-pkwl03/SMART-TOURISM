import { ShieldCheck, Activity, Cpu, Database, Droplets, CloudRain } from 'lucide-react';

export default function LoginHero() {
    return (
        <div className="hidden lg:flex lg:w-1/2 bg-slate-950 text-white p-12 flex-col justify-between relative overflow-hidden border-r border-slate-800">
            {/* Efek Glow di Background */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
            
            {/* Bagian Atas: Header & Judul */}
            <div>
                <div className="flex justify-between items-center mb-12">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="font-bold text-base tracking-wider">JURUG GEDHE <span className="text-xs font-normal text-slate-400">SMART TOURISM</span></h1>
                        </div>
                    </div>
                </div>

                <div className="max-w-lg mt-6">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 text-blue-400 text-xs font-semibold rounded-full border border-blue-500/20 mb-4">
                        <Database className="w-3.5 h-3.5" /> Kalurahan Ngoro-Oro, Patuk, Gunungkidul
                    </span>
                    <h2 className="text-3xl font-extrabold tracking-tight mb-4 leading-tight">
                        Mitigasi Bencana & Integrasi Ekonomi Rantai Pasok.
                    </h2>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Platform terpadu pemantauan sensor EWS hulu sungai real-time, manajemen e-ticketing destinasi wisata, serta tata kelola konsinyasi produk UMKM Sedyo Maju.
                    </p>
                </div>
            </div>

            {/* Bagian Tengah: Kartu Widget Statistik/Telemetry EWS */}
            <div className="my-8 bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 shadow-2xl backdrop-blur-md">
                <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-800">
                    <div className="flex items-center gap-2.5">
                        <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20">
                            <Cpu className="w-4 h-4" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-white">EWS Hulu Sungai (IoT)</p>
                            <p className="text-[11px] text-slate-400">Sensor Terhubung • LoRaWAN 4G</p>
                        </div>
                    </div>
                    <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded border border-emerald-500/20">
                        STATUS AMAN
                    </span>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><Droplets className="w-3 h-3 text-blue-400"/> Tinggi Air</p>
                        <p className="text-sm font-bold text-white flex items-center gap-1">
                            1.35 <span className="text-[10px] text-slate-400 font-normal">m</span>
                        </p>
                        <p className="text-[9px] text-emerald-400">Normal Threshold</p>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-[10px] text-slate-400 mb-1 flex items-center gap-1"><CloudRain className="w-3 h-3 text-indigo-400"/> Curah Hujan</p>
                        <p className="text-sm font-bold text-white">12.4</p>
                    </div>
                    <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/50">
                        <p className="text-[10px] text-slate-400 mb-1">Suhu / Lembab</p>
                        <p className="text-sm font-bold text-white">28.6°C</p>
                    </div>
                </div>

                <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
                        <span>Kapasitas Rantai Pasok & Wisata</span>
                        <span className="text-emerald-400 font-medium">Aktif Terintegrasi</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div className="bg-gradient-to-r from-blue-500 to-emerald-500 h-full w-[85%] rounded-full animate-pulse" />
                    </div>
                </div>
            </div>

            {/* Bagian Bawah: Footer Info */}
            <div className="text-xs text-slate-500 flex flex-wrap justify-between items-center pt-4 border-t border-slate-900 gap-2">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-blue-400" /> Kolaborasi Unjaya & UAD</span>
                    <span>🔒 Secured API Integration</span>
                </div>
                <span>© 2026 Program Kosabangsa</span>
            </div>
        </div>
    );
}