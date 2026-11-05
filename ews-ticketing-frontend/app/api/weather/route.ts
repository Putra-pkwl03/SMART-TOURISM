interface OpenWeatherResponse {
    name: string;
    main: {
        temp: number;
        humidity: number;
    };
    wind?: {
        speed?: number;
    };
    rain?: {
        '1h'?: number;
    };
    weather: Array<{
        description: string;
    }>;
}

export async function GET() {
    const apiKey = process.env.WEATHER_API_KEY || process.env.NEXT_PUBLIC_WEATHER_API_KEY;
    if (!apiKey) {
        return Response.json(
            { error: 'Weather API key is not configured on the server.' },
            { status: 503 }
        );
    }

    const url = new URL('https://api.openweathermap.org/data/2.5/weather');
    url.searchParams.set('lat', process.env.NEXT_PUBLIC_LAT || '-7.8456');
    url.searchParams.set('lon', process.env.NEXT_PUBLIC_LON || '110.5321');
    url.searchParams.set('units', 'metric');
    url.searchParams.set('appid', apiKey);

    try {
        const response = await fetch(url, { next: { revalidate: 600 } });
        if (!response.ok) {
            if (response.status === 401) {
                return Response.json(
                    { error: 'OpenWeatherMap rejected the API key. Verify it and ensure the key is active.' },
                    { status: 502 }
                );
            }

            console.error(`OpenWeatherMap returned HTTP ${response.status}.`);
            return Response.json(
                { error: 'Weather provider request failed.' },
                { status: 502 }
            );
        }

        const data = await response.json() as OpenWeatherResponse;
        return Response.json({
            temperature: `${data.main.temp.toFixed(1)} °C`,
            humidity: `${data.main.humidity} %`,
            rainfall: `${data.rain?.['1h'] || 0} mm/h`,
            wind_speed: `${((data.wind?.speed || 0) * 3.6).toFixed(1)} km/j`,
            description: data.weather[0]?.description || 'Cuaca tidak diketahui',
            city: data.name,
        });
    } catch {
        console.error('Weather provider request failed.');
        return Response.json(
            { error: 'Weather provider is unavailable.' },
            { status: 502 }
        );
    }
}
