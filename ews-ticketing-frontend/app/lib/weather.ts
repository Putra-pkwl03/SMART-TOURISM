export interface WeatherData {
    temperature: string;
    humidity: string;
    rainfall: string;
    wind_speed: string;
    description: string;
    city: string;
}

export async function fetchWeatherData(): Promise<WeatherData | null> {
    try {
        const response = await fetch('/api/weather', { cache: 'no-store' });
        if (!response.ok) {
            const result = await response.json().catch(() => null);
            throw new Error(result?.error || `Weather request failed (${response.status}).`);
        }

        return await response.json() as WeatherData;
    } catch (error) {
        console.warn(
            'Data cuaca eksternal tidak tersedia:',
            error instanceof Error ? error.message : 'Kesalahan tidak diketahui.'
        );
        return null;
    }
}
