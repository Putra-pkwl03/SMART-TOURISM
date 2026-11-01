import { Package } from 'lucide-react';

interface UmkmBundlingSelectorProps {
    availableProducts: any[];
    selectedProductIds: number[];
    setSelectedProductIds: (ids: number[]) => void;
}

export default function UmkmBundlingSelector({
    availableProducts,
    selectedProductIds,
    setSelectedProductIds,
}: UmkmBundlingSelectorProps) {
    
    // Helper untuk mengambil dan memformat URL gambar produk UMKM dari struktur backend
    const getProductImageUrl = (prod: any) => {
        let rawPath = '';

        // Cek apakah ada relasi images (sesuai controller: with('images'))
        if (prod.images && Array.isArray(prod.images) && prod.images.length > 0) {
            // Cari yang primary, atau ambil yang index pertama [0]
            const primaryImg = prod.images.find((img: any) => img.is_primary) || prod.images[0];
            rawPath = primaryImg.image_path || primaryImg.image_url || '';
        } else {
            // Fallback jika langsung ada di atribut produk
            rawPath = prod.image_url || prod.image || '';
        }

        if (!rawPath) return '';
        if (rawPath.startsWith('http://') || rawPath.startsWith('https://') || rawPath.startsWith('blob:')) {
            return rawPath;
        }

        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8000';
        
        // Karena di controller Laravel `store` menggunakan ->store('products', 'public') 
        // yang menghasilkan path 'products/namafile.jpg', biasanya diakses via '/storage/products/...' 
        // atau langsung `${backendUrl}/storage/${rawPath}`
        const formattedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
        
        if (formattedPath.startsWith('/storage/')) {
            return `${backendUrl}${formattedPath}`;
        }
        
        return `${backendUrl}/storage${formattedPath}`;
    };

    const handleSelectAll = () => {
        const allIds = availableProducts.map(p => p.id);
        setSelectedProductIds(allIds);
    };

    const handleDeselectAll = () => {
        setSelectedProductIds([]);
    };

    return (
        <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-2xl space-y-3">
            {/* Header Judul & Ringkasan */}
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-bold text-emerald-900 text-xs flex items-center gap-1.5">
                        <Package className="w-4 h-4 text-emerald-600" /> Pilih Produk UMKM untuk Dibundling
                    </h4>
                    <p className="text-[11px] text-emerald-700 mt-0.5">Pilih produk atau hampers yang disertakan dalam paket wisata ini.</p>
                </div>
                <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded-full shadow-xs">
                    {selectedProductIds.length} Dipilih
                </span>
            </div>

            {/* Tombol Aksi Cepat */}
            {availableProducts.length > 0 && (
                <div className="flex items-center justify-between pt-1 border-t border-emerald-100 text-[11px]">
                    <span className="text-slate-500 font-medium">Aksi Cepat Pilihan:</span>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleSelectAll}
                            className="text-emerald-700 hover:text-emerald-900 font-bold hover:underline cursor-pointer transition"
                        >
                            Pilih Semua
                        </button>
                        <span className="text-slate-300">|</span>
                        <button
                            type="button"
                            onClick={handleDeselectAll}
                            className="text-rose-600 hover:text-rose-800 font-bold hover:underline cursor-pointer transition"
                        >
                            Reset Pilihan
                        </button>
                    </div>
                </div>
            )}

            {/* Daftar Produk Grid */}
            {availableProducts.length === 0 ? (
                <div className="p-4 text-center bg-white/60 rounded-xl border border-slate-200">
                    <p className="text-slate-400 text-xs italic">Belum ada produk UMKM terdaftar di sistem.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                    {availableProducts.map(prod => {
                        const isChecked = selectedProductIds.includes(prod.id);
                        const imageUrl = getProductImageUrl(prod);

                        return (
                            <div
                                key={prod.id}
                                onClick={() => {
                                    if (isChecked) {
                                        setSelectedProductIds(selectedProductIds.filter(id => id !== prod.id));
                                    } else {
                                        setSelectedProductIds([...selectedProductIds, prod.id]);
                                    }
                                }}
                                className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                                    isChecked 
                                        ? 'bg-white border-emerald-500 shadow-sm ring-1 ring-emerald-500/20' 
                                        : 'bg-white/70 border-slate-200 hover:bg-white hover:border-slate-300'
                                }`}
                            >
                                <div className="flex items-center gap-2.5 truncate">
                                    {/* Checkbox */}
                                    <input 
                                        type="checkbox" 
                                        checked={isChecked}
                                        onChange={() => {}} 
                                        className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-3.5 h-3.5 cursor-pointer flex-shrink-0"
                                    />

                                    {/* Thumbnail Foto Produk UMKM (Diambil dari relasi images) */}
                                    <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                                        {imageUrl ? (
                                            <img 
                                                src={imageUrl} 
                                                alt={prod.name} 
                                                className="w-full h-full object-cover" 
                                                onError={(e) => {
                                                    // Fallback jika gambar gagal dimuat
                                                    (e.target as HTMLElement).style.display = 'none';
                                                }}
                                            />
                                        ) : (
                                            <Package className="w-4 h-4 text-slate-400" />
                                        )}
                                    </div>

                                    {/* Nama & Harga Produk */}
                                    <div className="truncate">
                                        <p className="font-bold text-slate-800 text-xs truncate" title={prod.name}>
                                            {prod.name}
                                        </p>
                                        <p className="text-[10px] font-semibold text-emerald-600">
                                            Rp {Number(prod.price).toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                </div>

                                {/* Status Stok */}
                                {prod.stock !== undefined && (
                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md flex-shrink-0 ${
                                        prod.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                                    }`}>
                                        Stok: {prod.stock}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}