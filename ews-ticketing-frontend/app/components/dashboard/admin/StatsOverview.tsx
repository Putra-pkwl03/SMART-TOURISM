import { DollarSign, Users, ShoppingBag } from 'lucide-react';

export default function StatsOverview() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Kunjungan Wisata</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">142 Orang</h4>
                    <p className="text-xs text-emerald-600 font-medium mt-1">+12% dari minggu lalu</p>
                </div>
                <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                    <Users className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pendapatan Tiket & Bundling</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">Rp 1.420.000</h4>
                    <p className="text-xs text-emerald-600 font-medium mt-1">Pencatatan real-time</p>
                </div>
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                    <DollarSign className="w-6 h-6" />
                </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Terjual Produk UMKM</p>
                    <h4 className="text-2xl font-bold text-slate-900 mt-1">38 Paket</h4>
                    <p className="text-xs text-purple-600 font-medium mt-1">Konsinyasi Sedyo Maju</p>
                </div>
                <div className="p-3 bg-purple-50 text-purple-600 rounded-2xl">
                    <ShoppingBag className="w-6 h-6" />
                </div>
            </div>
        </div>
    );
}