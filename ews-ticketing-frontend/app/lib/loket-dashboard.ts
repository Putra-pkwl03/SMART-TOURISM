export interface LoketDashboardData {
    period: number;
    summary: {
        verified_tickets_today: number;
        visitors_today: number;
    };
    ews: {
        water_level: number;
        rainfall: number;
        temperature: number;
        humidity: number;
        status: 'NORMAL' | 'WASPADA' | 'AWAS' | string;
        description: string | null;
        updated_at: string;
        sensor_online: boolean;
    } | null;
    trend: Array<{
        date: string;
        label: string;
        tickets: number;
        visitors: number;
    }>;
    recent_logs: Array<{
        id: number;
        ticket_code: string;
        visitor_name: string;
        destination_name: string;
        visitor_count: number;
        used_at: string;
    }>;
}
