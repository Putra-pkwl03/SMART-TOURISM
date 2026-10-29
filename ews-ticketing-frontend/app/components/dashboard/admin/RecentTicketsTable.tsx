export default function RecentTicketsTable() {
    const dummyTickets = [
        { code: 'JT-261028-001', visitor: 'Budi Santoso', count: 2, total: 'Rp 70.000', status: 'valid', date: '28 Okt 2026' },
        { code: 'JT-261028-002', visitor: 'Siti Rahma', count: 4, total: 'Rp 140.000', status: 'used', date: '28 Okt 2026' },
        { code: 'JT-261027-003', visitor: 'Ahmad Fauzi', count: 1, total: 'Rp 35.000', status: 'valid', date: '27 Okt 2026' },
    ];

    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-900">Pemesanan E-Ticketing Terbaru</h3>
                    <p className="text-xs text-slate-500">Daftar transaksi karcis masuk kawasan Jurug Gedhe</p>
                </div>
                <button className="text-xs font-semibold text-blue-600 hover:underline">Lihat Semua</button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                    <thead>
                        <tr className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-100">
                            <th className="p-4">Kode Tiket</th>
                            <th className="p-4">Nama Wisatawan</th>
                            <th className="p-4">Jumlah</th>
                            <th className="p-4">Total Harga</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700">
                        {dummyTickets.map((ticket, idx) => (
                            <tr key={idx} className="hover:bg-slate-50/50 transition">
                                <td className="p-4 font-mono font-bold text-slate-900">{ticket.code}</td>
                                <td className="p-4 font-medium">{ticket.visitor}</td>
                                <td className="p-4">{ticket.count} Orang</td>
                                <td className="p-4 font-semibold">{ticket.total}</td>
                                <td className="p-4">
                                    <span className={`px-2.5 py-1 rounded-full font-medium text-[10px] uppercase ${
                                        ticket.status === 'valid' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td className="p-4 text-slate-400">{ticket.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}