export interface AdminDashboardSummary {
    visitors: number;
    visitor_change_percent: number | null;
    ticket_revenue: number;
    bundling_revenue: number;
    total_revenue: number;
    bundling_sales: number;
    pending_consignments: number;
}

export interface VisitorTrendPoint {
    date: string;
    label: string;
    visitors: number;
}

export interface RevenueCompositionItem {
    name: string;
    amount: number;
}

export interface RecentDashboardTicket {
    id: number;
    code: string;
    visitor: string;
    count: number;
    total: number;
    status: string;
    created_at: string;
}

export interface ConsignmentDashboardProduct {
    id: number;
    name: string;
    stock: number;
    image_path: string | null;
}

export interface AdminDashboardData {
    period: number;
    ews: {
        water_level: string;
        rainfall: string;
        temperature: string;
        humidity: string;
        status: string;
        description: string;
    } | null;
    ews_history: Array<{
        water_level: number;
        rainfall: number;
        temperature: number;
        humidity: number;
        status: string;
        created_at: string;
    }>;
    summary: AdminDashboardSummary;
    visitor_trend: VisitorTrendPoint[];
    revenue_composition: RevenueCompositionItem[];
    recent_tickets: RecentDashboardTicket[];
    consignment_products: ConsignmentDashboardProduct[];
}
