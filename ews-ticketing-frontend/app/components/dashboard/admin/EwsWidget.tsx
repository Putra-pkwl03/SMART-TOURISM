'use client';

import { useEffect, useState } from 'react';
import {
    Activity,
    CheckCircle2,
    CloudRain,
    Droplet,
    ShieldAlert,
    Thermometer,
} from 'lucide-react';

interface EwsWidgetProps {
    data: {
        water_level: string;
        rainfall: string;
        temperature: string;
        humidity: string;
        status: string;
        description: string;
    };
    history?: Array<{
        water_level: number;
        rainfall: number;
        temperature: number;
        humidity: number;
    }>;
}

type Metric = 'water_level' | 'rainfall' | 'temperature' | 'humidity';
type Reading = Record<Metric, number>;

function TrendLine({ values, label }: { values: number[]; label: string }) {
    const width = 96;
    const height = 32;
    const padding = 3;
    const minimum = Math.min(...values);
    const range = Math.max(...values) - minimum;
    const points = values.map((value, index) => {
        const x = values.length === 1
            ? width / 2
            : padding + index * (width - padding * 2) / (values.length - 1);
        const y = range === 0
            ? height / 2
            : height - padding - ((value - minimum) / range) * (height - padding * 2);
        return `${x},${y}`;
    });
    const line = points.join(' ');
    const firstX = points[0].split(',')[0];
    const lastX = points[points.length - 1].split(',')[0];

    return (
        <svg
            className="h-8 w-16 shrink-0 text-emerald-400 sm:w-[4.5rem]"
            viewBox={`0 0 ${width} ${height}`}
            fill="none"
            role="img"
            aria-label={`Tren ${label} dari ${values.length} pembacaan sejak widget dibuka`}
        >
            <polygon points={`${firstX},${height} ${line} ${lastX},${height}`} fill="currentColor" fillOpacity="0.08" />
            <polyline
                points={line}
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-500"
            />
        </svg>
    );
}

export default function EwsWidget({ data, history = [] }: EwsWidgetProps) {
    const isNormal = data?.status === 'NORMAL';
    const isUnknown = data?.status === 'TIDAK ADA DATA';
    const waterLevel = Number.parseFloat(data?.water_level || '') || 0;
    const rainfall = Number.parseFloat(data?.rainfall || '') || 0;
    const temperature = Number.parseFloat(data?.temperature || '') || 0;
    const humidity = Number.parseFloat(data?.humidity || '') || 0;
    const currentReading: Reading = {
        water_level: waterLevel,
        rainfall,
        temperature,
        humidity,
    };
    const [readings, setReadings] = useState<Reading[]>([]);

    useEffect(() => {
        const reading: Reading = {
            water_level: waterLevel,
            rainfall,
            temperature,
            humidity,
        };
        const timeoutId = window.setTimeout(() => {
            setReadings((previous) => {
                const metrics: Metric[] = ['water_level', 'rainfall', 'temperature', 'humidity'];
                const last = previous[previous.length - 1];
                if (last && metrics.every((metric) => last[metric] === reading[metric])) {
                    return previous;
                }

                return [...previous, reading].slice(-12);
            });
        }, 0);

        return () => window.clearTimeout(timeoutId);
    }, [waterLevel, rainfall, temperature, humidity]);

    const chartReadings = history.length
        ? history.map(({ water_level, rainfall, temperature, humidity }) => ({
            water_level,
            rainfall,
            temperature,
            humidity,
        }))
        : readings.length ? readings : [currentReading];
    const valuesFor = (metric: Metric) => chartReadings.map((reading) => reading[metric]);
    const rainfallValues = valuesFor('rainfall');
    const maxRainfall = Math.max(...rainfallValues, 1);

    return (
        <section className="relative isolate overflow-hidden rounded-2xl border border-sky-200/10 bg-gradient-to-br from-[#102b49] via-[#0b2340] to-[#092d3b] p-3.5 text-white shadow-[0_12px_30px_rgba(8,30,52,0.2)] sm:rounded-[1.4rem] sm:p-5">
            <div className="pointer-events-none absolute -right-10 -top-20 -z-10 h-48 w-48 rounded-full bg-sky-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 left-1/3 -z-10 h-40 w-64 rounded-full bg-emerald-400/10 blur-3xl" />

            <div className="mb-3 flex items-center justify-between gap-3 sm:mb-3.5">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-950/30 sm:h-11 sm:w-11">
                        <Activity className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="truncate text-xs font-bold tracking-tight text-white sm:text-sm">
                            Monitoring EWS Hulu Sungai
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-300 sm:text-[11px]">
                            <span className="truncate">Sensor hulu sungai • pembaruan otomatis</span>
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]" />
                        </p>
                    </div>
                </div>

                <span className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-bold sm:px-3.5 sm:text-[11px] ${
                    isNormal
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : isUnknown
                            ? 'bg-slate-500/20 text-slate-300'
                            : 'bg-red-500/20 text-red-300'
                }`}>
                        {isNormal
                            ? <CheckCircle2 className="h-3.5 w-3.5" />
                            : <ShieldAlert className="h-3.5 w-3.5" />}
                    <span>{data?.status || 'NORMAL'}</span>
                </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5 min-[420px]:grid-cols-2 xl:grid-cols-4">
                <div className="flex min-h-[4.25rem] min-w-0 items-center gap-2.5 rounded-xl border border-sky-300/10 bg-sky-950/30 px-3 py-2 sm:gap-3 sm:px-3.5">
                    <Droplet className="h-5 w-5 shrink-0 fill-sky-400 text-sky-400 sm:h-6 sm:w-6" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-medium text-slate-300 sm:text-[11px]">Tinggi Muka Air</p>
                        <p className="mt-0.5 truncate text-base font-bold leading-tight text-white sm:text-lg">{data?.water_level || '1.35 m'}</p>
                    </div>
                    <TrendLine values={valuesFor('water_level')} label="tinggi muka air" />
                </div>

                <div className="flex min-h-[4.25rem] min-w-0 items-center gap-2.5 rounded-xl border border-sky-300/10 bg-sky-950/30 px-3 py-2 sm:gap-3 sm:px-3.5">
                    <CloudRain className="h-5 w-5 shrink-0 fill-sky-400 text-sky-400 sm:h-6 sm:w-6" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-medium text-slate-300 sm:text-[11px]">Curah Hujan</p>
                        <p className="mt-0.5 truncate text-base font-bold leading-tight text-white sm:text-lg">{data?.rainfall || '0 mm/h'}</p>
                    </div>
                    <div
                        className="flex h-8 shrink-0 items-end gap-0.5"
                        role="img"
                        aria-label={`Grafik curah hujan dari ${rainfallValues.length} pembacaan sejak widget dibuka`}
                    >
                        {rainfallValues.map((value, index) => (
                            <span
                                key={`${index}-${value}`}
                                className="w-1 rounded-t-sm bg-emerald-400/80 transition-all duration-500 sm:w-[5px]"
                                style={{ height: `${Math.max(2, value / maxRainfall * 32)}px` }}
                            />
                        ))}
                    </div>
                </div>

                <div className="flex min-h-[4.25rem] min-w-0 items-center gap-2.5 rounded-xl border border-sky-300/10 bg-sky-950/30 px-3 py-2 sm:gap-3 sm:px-3.5">
                    <Thermometer className="h-5 w-5 shrink-0 text-sky-400 sm:h-6 sm:w-6" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-medium text-slate-300 sm:text-[11px]">Suhu Udara</p>
                        <p className="mt-0.5 truncate text-base font-bold leading-tight text-white sm:text-lg">{data?.temperature || '30.6 °C'}</p>
                    </div>
                    <TrendLine values={valuesFor('temperature')} label="suhu udara" />
                </div>

                <div className="flex min-h-[4.25rem] min-w-0 items-center gap-2.5 rounded-xl border border-sky-300/10 bg-sky-950/30 px-3 py-2 sm:gap-3 sm:px-3.5">
                    <Droplet className="h-5 w-5 shrink-0 fill-sky-400 text-sky-400 sm:h-6 sm:w-6" />
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-medium text-slate-300 sm:text-[11px]">Kelembapan</p>
                        <p className="mt-0.5 truncate text-base font-bold leading-tight text-white sm:text-lg">{data?.humidity || '71 %'}</p>
                    </div>
                    <TrendLine values={valuesFor('humidity')} label="kelembapan" />
                </div>
            </div>
        </section>
    );
}
