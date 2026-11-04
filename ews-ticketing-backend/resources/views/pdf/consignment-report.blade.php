<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <title>Berita Acara Konsinyasi - {{ $period['month'] }}/{{ $period['year'] }}</title>
    <style>
        @page {
            size: A4 portrait;
            margin: 15mm;
        }
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 10px;
            color: #334155;
            line-height: 1.4;
            margin: 0;
            padding: 0;
        }
        /* Header Laporan */
        .header {
            border-bottom: 2px solid #4B5563;
            padding-bottom: 10px;
            margin-bottom: 15px;
            text-align: center;
        }
        .header h2 {
            font-size: 15px;
            font-weight: 700;
            color: #0f172a;
            margin: 0 0 4px 0;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .header p {
            font-size: 11px;
            color: #64748b;
            margin: 0;
            font-weight: 500;
        }
        .header-period-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 8px;
        }
        .header-period-table td {
            border: none;
            padding: 0;
        }
        .period-right {
            text-align: right;
            font-size: 11px;
            font-weight: bold;
            color: #334155;
        }

        /* Kartu Ringkasan (Stats) */
        .summary-cards {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 15px;
        }
        .summary-cards td {
            border: 1px solid #e2e8f0;
            background-color: #f8fafc;
            padding: 8px 10px;
            width: 33.33%;
            vertical-align: top;
            border-radius: 6px;
        }
        .card-label {
            font-size: 9px;
            text-transform: uppercase;
            color: #64748b;
            font-weight: 600;
            margin-bottom: 2px;
        }
        .card-value {
            font-size: 12px;
            font-weight: 700;
            color: #0f172a;
        }

        /* Tabel Utama */
        .data-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
        }
        .data-table th {
            background-color: #0f172a;
            color: #ffffff;
            font-weight: 600;
            text-transform: uppercase;
            font-size: 9px;
            letter-spacing: 0.5px;
            padding: 7px 8px;
            border: 1px solid #0f172a;
            text-align: left;
        }
        .data-table td {
            border: 1px solid #e2e8f0;
            padding: 6px 8px;
            color: #334155;
            vertical-align: middle;
        }
        .data-table tbody tr:nth-child(even) {
            background-color: #f8fafc;
        }
        
        /* Badge Status */
        .badge {
            display: inline-block;
            padding: 2px 6px;
            font-size: 8px;
            font-weight: bold;
            border-radius: 4px;
            text-align: center;
        }
        .badge-paid {
            background-color: #d1fae5;
            color: #065f46;
            border: 1px solid #6ee7b7;
        }
        .badge-pending {
            background-color: #fef3c7;
            color: #92400e;
            border: 1px solid #fcd34d;
        }

        .text-right { text-align: right; }
        .text-center { text-align: center; }

        /* Keterangan Tambahan / Catatan */
        .notes-text {
            font-size: 9px;
            color: #64748b;
            font-style: italic;
        }

        /* Bagian Tanda Tangan */
        .signature-section {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            page-break-inside: avoid;
        }
        .signature-section td {
            border: none;
            width: 50%;
            text-align: center;
            padding: 0 20px;
            vertical-align: top;
        }
        .signature-space {
            height: 50px;
        }
        .sign-name {
            font-weight: bold;
            text-decoration: underline;
            color: #0f172a;
        }
        .sign-title {
            color: #64748b;
            font-size: 9px;
            margin-top: 2px;
        }
        .footer-info {
            margin-top: 15px;
            text-align: right;
            font-size: 8px;
            color: #94a3b8;
        }
    </style>
</head>
<body>

    <!-- Header Laporan -->
    <div class="header">
        <!-- Judul di Tengah -->
        <h2>Berita Acara Penyerahan Dana Konsinyasi UMKM</h2>
        <p>Rekapitulasi Bagi Hasil Pokdarwis dan UMKM Sedyo Maju</p>
        
        <!-- Periode di Kanan Tanpa Background -->
        <table class="header-period-table">
            <tr>
                <td></td>
                <td class="period-right">
                    Periode: {{ str_pad($period['month'], 2, '0', STR_PAD_LEFT) }} / {{ $period['year'] }}
                </td>
            </tr>
        </table>
    </div>

    <!-- Ringkasan Statistik (Cards) -->
    <table class="summary-cards">
        <tr>
            <td style="border-right: none;">
                <div class="card-label">Total Qty Terjual</div>
                <div class="card-value">{{ $summary['total_qty'] }} Pcs</div>
            </td>
            <td style="border-left: none; border-right: none;">
                <div class="card-label">Total Pendapatan UMKM</div>
                <div class="card-value" style="color: #059669;">Rp {{ number_format($summary['total_umkm_income'], 0, ',', '.') }}</div>
            </td>
            <td style="border-left: none;">
                <div class="card-label">Total Pendapatan Pokdarwis</div>
                <div class="card-value" style="color: #2563eb;">Rp {{ number_format($summary['total_pokdarwis_income'], 0, ',', '.') }}</div>
            </td>
        </tr>
    </table>

    <!-- Tabel Data Transaksi -->
    <table class="data-table">
        <thead>
            <tr>
                <th style="width: 4%;" class="text-center">No</th>
                <th style="width: 15%;">Tgl / Kode Tiket</th>
                <th style="width: 20%;">Wisatawan</th>
                <th style="width: 26%;">Produk UMKM</th>
                <th style="width: 7%;" class="text-center">Qty</th>
                <th style="width: 18%;" class="text-right">Pendapatan UMKM</th>
                <th style="width: 10%;" class="text-center">Status</th>
            </tr>
        </thead>
        <tbody>
            @forelse($settlements as $index => $item)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>
                    <div style="font-weight: bold;">{{ $item->ticket->ticket_code ?? '-' }}</div>
                    <div style="font-size: 8px; color: #64748b; margin-top: 2px;">{{ \Carbon\Carbon::parse($item->created_at)->format('d/m/Y H:i') }}</div>
                </td>
                <td>{{ $item->ticket->user->name ?? 'Umum / Tamu' }}</td>
                <td>
                    <div>{{ $item->umkmProduct->name ?? '-' }}</div>
                    @if($item->notes)
                        <div class="notes-text">Catatan: {{ $item->notes }}</div>
                    @endif
                </td>
                <td class="text-center">{{ $item->qty }}</td>
                <td class="text-right">Rp {{ number_format($item->total_umkm_income, 0, ',', '.') }}</td>
                <td class="text-center">
                    @if(strtolower($item->status) === 'paid')
                        <span class="badge badge-paid">PAID / LUNAS</span>
                    @else
                        <span class="badge badge-pending">PENDING</span>
                    @endif
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="7" class="text-center" style="padding: 20px; color: #94a3b8;">
                    Tidak ada data transaksi konsinyasi pada periode ini.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <!-- Bagian Tanda Tangan -->
    <table class="signature-section">
        <tr>
            <td>
                <p>Mengetahui,</p>
                <p class="sign-title">Pengelola Pokdarwis</p>
                <div class="signature-space"></div>
                <p class="sign-name">( __________________________ )</p>
            </td>
            <td>
                <p>Dibuat Oleh,</p>
                <p class="sign-title">Admin / Keuangan EWS</p>
                <div class="signature-space"></div>
                <p class="sign-name">( __________________________ )</p>
            </td>
        </tr>
    </table>

    <!-- Info Cetak Dokumen -->
    <div class="footer-info">
        Dokumen ini dicetak secara otomatis melalui Sistem EWS-Ticketing pada {{ date('d-m-Y H:i:s') }}
    </div>

</body>
</html>