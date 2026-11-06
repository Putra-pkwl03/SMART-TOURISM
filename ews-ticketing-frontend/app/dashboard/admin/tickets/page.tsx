'use client';

import { useState, useEffect } from 'react';
import { apiClient } from '@/app/lib/axios';
import { getBackendUrl } from '@/app/lib/backend-url';
import { toast } from 'sonner';

// Import Komponen Terpisah
import TicketHeader from '@/app/components/dashboard/admin/tickets/TicketHeader';
import TicketStats from '@/app/components/dashboard/admin/tickets/TicketStats';
import TicketFilters from '@/app/components/dashboard/admin/tickets/TicketFilters';
import TicketTable from '@/app/components/dashboard/admin/tickets/TicketTable';
import TicketModals from '@/app/components/dashboard/admin/tickets/TicketModals';
import { SkeletonStats } from '@/app/components/dashboard/shared/DashboardSkeleton';

interface TicketItem {
    id: number;
    ticket_code: string;
    visitor_count: number;
    total_price: number;
    payment_status: 'pending' | 'paid' | 'cancelled';
    ticket_status: 'valid' | 'used' | 'expired';
    payment_method?: string;
    payment_proof?: string;
    rejection_reason?: string;
    created_at: string;
    destination?: {
        name: string;
        location: string;
    };
    user?: {
        name: string;
        email: string;
    };
}

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState<TicketItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    
    // State Modal Bukti Bayar
    const [selectedProof, setSelectedProof] = useState<string | null>(null);
    const [isProofModalOpen, setIsProofModalOpen] = useState(false);

    // State Modal Penolakan
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');

    const BACKEND_URL = getBackendUrl();

    const fetchTickets = async () => {
        try {
            setLoading(true);
            const res = await apiClient.get('/tickets');
            setTickets(res.data);
        } catch (error) {
            toast.error('Gagal memuat data tiket dari server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleApprovePayment = async (id: number) => {
        try {
            await apiClient.patch(`/tickets/${id}/approve`);
            toast.success('Pembayaran tiket berhasil diverifikasi dan disetujui!');
            fetchTickets();
        } catch (error) {
            toast.error('Gagal memverifikasi pembayaran.');
        }
    };

    const handleRejectPayment = async () => {
        if (!selectedTicketId || !rejectionReason.trim()) {
            toast.error('Harap masukkan alasan penolakan terlebih dahulu.');
            return;
        }

        try {
            await apiClient.patch(`/tickets/${selectedTicketId}/reject`, {
                rejection_reason: rejectionReason
            });
            toast.success('Pembayaran tiket berhasil ditolak.');
            setIsRejectModalOpen(false);
            setRejectionReason('');
            setSelectedTicketId(null);
            fetchTickets();
        } catch (error) {
            toast.error('Gagal menolak pembayaran.');
        }
    };

    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');

    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');

    // Logika Filter Data Tiket
    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = 
            ticket.ticket_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ticket.destination?.name.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesStatus = selectedStatus ? ticket.payment_status === selectedStatus : true;
        
        const matchesMethod = selectedPaymentMethod 
            ? ticket.payment_method?.toLowerCase() === selectedPaymentMethod.toLowerCase() 
            : true;

        let matchesDate = true;
        if (selectedDate === 'today') {
            const todayStr = new Date().toISOString().split('T')[0];
            matchesDate = ticket.created_at.startsWith(todayStr);
        }

        return matchesSearch && matchesStatus && matchesMethod && matchesDate;
    });

    // Hitung statistik otomatis dari data tiket
    const totalVisitors = tickets.reduce((acc, curr) => acc + (curr.visitor_count || 0), 0);
    const totalTicketsSold = tickets.filter(t => t.payment_status === 'paid').length * 120; // Contoh dummy skala atau hitung langsung
    const totalRevenue = tickets
        .filter(t => t.payment_status === 'paid')
        .reduce((acc, curr) => acc + (curr.total_price || 0), 0);

    return (
        <div className="space-y-6">
            {/* Header Hero Banner */}
            <TicketHeader />

            {/* Statistik Cards */}
            {loading ? <SkeletonStats /> : (
                <TicketStats
                    totalVisitors={totalVisitors > 0 ? totalVisitors : 2850}
                    totalTicketsSold={2420}
                    totalRevenue={totalRevenue > 0 ? totalRevenue : 48750000}
                    todayVisitors={342}
                />
            )}

            <TicketFilters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                selectedPaymentMethod={selectedPaymentMethod}
                setSelectedPaymentMethod={setSelectedPaymentMethod}
            />

            {/* Tabel Data Tiket */}
            <TicketTable 
                tickets={filteredTickets}
                loading={loading}
                backendUrl={BACKEND_URL}
                onViewProof={(url) => {
                    setSelectedProof(url);
                    setIsProofModalOpen(true);
                }}
                onApprove={handleApprovePayment}
                onRejectClick={(id) => {
                    setSelectedTicketId(id);
                    setIsRejectModalOpen(true);
                }}
            />

            {/* Modals Komponen */}
            <TicketModals 
                isProofModalOpen={isProofModalOpen}
                selectedProof={selectedProof}
                onCloseProofModal={() => setIsProofModalOpen(false)}
                isRejectModalOpen={isRejectModalOpen}
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                onCloseRejectModal={() => setIsRejectModalOpen(false)}
                onSubmitReject={handleRejectPayment}
            />
        </div>
    );
}