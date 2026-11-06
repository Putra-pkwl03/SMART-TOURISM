export interface CashierProduct {
    id: number;
    name: string;
    description?: string | null;
    price: number;
    stock: number;
    images?: Array<{
        id: number;
        image_path: string;
        is_primary: boolean;
    }>;
}

export interface CashierCartItem {
    product: CashierProduct;
    quantity: number;
}
