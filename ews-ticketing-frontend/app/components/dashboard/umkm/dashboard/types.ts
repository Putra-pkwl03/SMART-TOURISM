export interface UmkmDashboardSummary {
    total_products: number;
    low_stock_count: number;
    monthly_sold_quantity: number;
    monthly_gross_sales: number;
    monthly_estimated_income: number;
}

export interface UmkmSalesTrendPoint {
    date: string;
    label: string;
    quantity: number;
}

export interface UmkmProductCompositionItem {
    name: string;
    quantity: number;
}

export interface UmkmTopProduct {
    id: number;
    name: string;
    price: number;
    stock: number;
    sold_quantity: number;
    gross_sales: number;
    image_path: string | null;
}

export interface UmkmDashboardData {
    summary: UmkmDashboardSummary;
    period: number;
    sales_trend: UmkmSalesTrendPoint[];
    product_composition: UmkmProductCompositionItem[];
    top_products: UmkmTopProduct[];
}
