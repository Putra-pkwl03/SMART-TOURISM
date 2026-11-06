<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Laporan Konsinyasi & Pendapatan UMKM</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            color: #333;
            font-size: 11px;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #10b981;
            padding-bottom: 10px;
            margin-bottom: 20px;
        }
        .header h2 {
            margin: 0;
            color: #065f46;
            font-size: 16px;
            text-transform: uppercase;
        }
        .header p {
            margin: 3px 0;
            color: #666;
            font-size: 10px;
        }
        .info-box {
            width: 100%;
            margin-bottom: 15px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            padding: 10px;
        }
        .info-box table {
            width: 100%;
            border-collapse: collapse;
        }
        .info-box td {
            padding: 3px 5px;
            font-size: 11px;
        }
        .summary-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .summary-table td {
            width: 25%;
            background: #f1f5f9;
            border: 1px solid #cbd5e1;
            padding: 8px;
            text-align: center;
            vertical-align: middle;
        }
        .summary-table .title {
            font-size: 9px;
            color: #475569;
            text-transform: uppercase;
            font-weight: bold;
            display: block;
            margin-bottom: 3px;
        }
        .summary-table .value {
            font-size: 12px;
            font-weight: bold;
            color: #0f172a;
        }
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
        }
        .data-table th, .data-table td {
            border: 1px solid #cbd5e1;
            padding: 6px 8px;
            text-align: left;
        }
        .data-table th {
            background-color: #065f46;
            color: #ffffff;
            font-size: 10px;
            text-transform: uppercase;
        }
        .data-table tr:nth-child(even) {
            background-color: #f8fafc;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .badge {
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
        }
        .badge-paid {
            background-color: #d1fae5;
            color: #065f46;
        }
        .badge-pending {
            background-color: #fef3c7;
            color: #d97706;
        }
        .footer {
            margin-top: 30px;
            width: 100%;
        }
        .signature-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .signature-table td {
            text-align: center;
            width: 50%;
            font-size: 11px;
        }
        .signature-space {
            height: 60px;
        }
    </style>
</head>
<body>

    @php
        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April', 
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus', 
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];
        $formattedMonth = $monthNames[(int)($period['month'] ?? date('m'))] ?? 'Januari';
    @endphp

    <!-- Header Laporan -->
    <div class="header">
        <h2>Laporan Penjualan & Pendapatan UMKM</h2>
        <p>Program Ekowisata & Rantai Pasok Desa Wisata Cerdas</p>
        <p>Periode Laporan: <strong>{{ $formattedMonth }} {{ $period['year'] ?? date('Y') }}</strong></p>
    </div>

    <!-- Informasi Mitra -->
    <div class="info-box">
        <table>
            <tr>
                <td style="width: 15%;"><strong>Nama Mitra:</strong></td>
                <td style="width: 35%;">{{ auth()->name ?? 'Mitra UMKM Sedyo Maju' }}</td>
                <td style="width: 15%;"><strong>Tanggal Cetak:</strong></td>
                <td style="width: 35%;">{{ date('d-m-Y H:i') }} WIB</td>
            </tr>
            <tr>
                <td><strong>Lokasi Usaha:</strong></td>
                <td>Padukuhan Salaran, Ngoro-Oro, Patuk</td>
                <td><strong>Status Dokumen:</strong></td>
                <td>Rekap penjualan satuan & bagi hasil bundling</td>
            </tr>
        </table>
    </div>

    <!-- Kotak Ringkasan Statistik (Summary Cards) -->
    <table class="summary-table">
        <tr>
            <td>
                <span class="title">Total Terjual</span>
                <span class="value">{{ number_format($summary['total_qty'] ?? 0) }} Pcs</span>
            </td>
            <td>
                <span class="title">Omzet Kotor (Gross)</span>
                <span class="value">Rp {{ number_format($summary['total_gross'] ?? 0, 0, ',', '.') }}</span>
            </td>
            <td>
                <span class="title">Pendapatan UMKM</span>
                <span class="value" style="color: #059669;">Rp {{ number_format($summary['total_umkm_income'] ?? 0, 0, ',', '.') }}</span>
            </td>
            <td>
                <span class="title">Status Pencairan</span>
                <span class="value" style="font-size: 10px;">
                    Lunas: Rp {{ number_format($summary['total_paid'] ?? 0, 0, ',', '.') }}<br>
                    Pending: Rp {{ number_format($summary['total_pending'] ?? 0, 0, ',', '.') }}
                </span>
            </td>
        </tr>
    </table>

    <!-- Tabel Detail Transaksi -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 5%;" class="text-center">No</th>
                <th style="width: 18%;">Tanggal / ID</th>
                <th style="width: 27%;">Nama Produk / Hampers</th>
                <th style="width: 15%;" class="text-center">Jenis Penjualan</th>
                <th style="width: 10%;" class="text-center">Qty</th>
                <th style="width: 15%;" class="text-right">Pendapatan / Hak UMKM</th>
                <th style="width: 10%;" class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($settlements as $index => $item)
                <tr>
                    <td class="text-center">{{ $index + 1 }}</td>
                    <td>
                        <strong>{{ $item->created_at->format('d/m/Y') }}</strong><br>
                        <span style="font-size: 9px; color: #64748b;">
                            {{ $item->ticket_id ? 'JT-' . $item->ticket_id : ($item->offlineSale->receipt_code ?? 'STANDALONE') }}
                        </span>
                    </td>
                    <td>
                        {{ $item->umkmProduct->name ?? 'Produk Konsinyasi' }}<br>
                        <span style="font-size: 9px; color: #64748b;">Harga: Rp {{ number_format($item->unit_price ?? $item->umkmProduct->price ?? 0, 0, ',', '.') }}</span>
                    </td>
                    <td class="text-center">
                        @if($item->ticket_id)
                            <span style="color: #2563eb; font-weight: bold;">Bundling Tiket</span>
                        @else
                            <span style="color: #7c3aed; font-weight: bold;">Standalone</span>
                        @endif
                    </td>
                    <td class="text-center">{{ $item->qty }} Pcs</td>
                    <td class="text-right font-weight-bold">Rp {{ number_format($item->total_umkm_income, 0, ',', '.') }}</td>
                    <td class="text-center">
                        @if($item->status === 'paid')
                            <span class="badge badge-paid">PAID</span>
                        @else
                            <span class="badge badge-pending">PENDING</span>
                        @endif
                    </td>
                </tr>
            @empty
                <tr>
                    <td colspan="7" class="text-center" style="padding: 15px; color: #64748b;">
                        Tidak ada riwayat transaksi konsinyasi pada periode {{ $formattedMonth }} {{ $period['year'] ?? date('Y') }}.
                    </td>
                </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Bagian Tanda Tangan / Validasi -->
    <table class="signature-table">
        <tr>
            <td>
                <p>Mengetahui,</p>
                <p><strong>Pengelola Ekowisata / Pokdarwis</strong></p>
                <div class="signature-space"></div>
                <p>___________________________</p>
            </td>
            <td>
                <p>Ngoro-Oro, {{ date('d') }} {{ $formattedMonth }} {{ $period['year'] ?? date('Y') }}</p>
                <p><strong>Perwakilan Mitra UMKM Sedyo Maju</strong></p>
                <div class="signature-space"></div>
                <p><strong>( ___________________________ )</strong></p>
            </td>
        </tr>
    </table>

</body>
</html>