'use client';

import { Clock, ShieldCheck } from 'lucide-react';

interface LoketHeaderProps {
    currentTime: string;
}

export default function LoketHeader({ currentTime }: LoketHeaderProps) {
    return (
        <div className="flex flex-col gap-4 px-1 py-2 sm:flex-row sm:items-end sm:justify-between">
            

            <div className="flex items-center gap-2 self-start rounded-full border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 sm:self-auto">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                <span>Petugas Loket</span>
                <span className="mx-1 h-4 w-px bg-emerald-200" />
                <Clock className="h-3.5 w-3.5 text-emerald-600" />
                <span className="font-mono">{currentTime || '--:--:--'}</span>
            </div>
        </div>
    );
}