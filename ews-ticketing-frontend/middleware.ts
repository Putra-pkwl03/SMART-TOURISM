import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const role = request.cookies.get('user_role')?.value;
    const pathname = request.nextUrl.pathname;

    const isAuthAdminPage = pathname.startsWith('/auth/login');
    const isAuthUserPage = pathname.startsWith('/auth/users/login');
    const isDashboardPage = pathname.startsWith('/dashboard');

    // 1. Jika BELUM LOGIN mencoba akses dashboard -> Tendang ke login
    if (isDashboardPage && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // 2. Proteksi & Pembatasan Akses Berdasarkan Role di dalam /dashboard (Strict / Masing-masing Role)
    if (isDashboardPage && token) {
        // Jika visitor mencoba akses dashboard -> Lempar ke beranda
        if (role === 'visitor') {
            return NextResponse.redirect(new URL('/', request.url));
        }

        // A. Proteksi Halaman UMKM (/dashboard/umkm) - HANYA untuk umkm_mitra
        if (pathname.startsWith('/dashboard/umkm') && role !== 'umkm_mitra') {
            if (role === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', request.url));
            if (role === 'ticketing_officer') return NextResponse.redirect(new URL('/dashboard/loket', request.url));
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // B. Proteksi Halaman Loket (/dashboard/loket atau /dashboard/officer) - HANYA untuk ticketing_officer
        if ((pathname.startsWith('/dashboard/loket') || pathname.startsWith('/dashboard/officer')) && role !== 'ticketing_officer') {
            if (role === 'admin') return NextResponse.redirect(new URL('/dashboard/admin', request.url));
            if (role === 'umkm_mitra') return NextResponse.redirect(new URL('/dashboard/umkm', request.url));
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }

        // C. Proteksi Halaman Admin Utama (/dashboard/admin) - HANYA untuk admin
        if (pathname.startsWith('/dashboard/admin') && role !== 'admin') {
            if (role === 'ticketing_officer') return NextResponse.redirect(new URL('/dashboard/loket', request.url));
            if (role === 'umkm_mitra') return NextResponse.redirect(new URL('/dashboard/umkm', request.url));
            return NextResponse.redirect(new URL('/auth/login', request.url));
        }
    }

    // 3. Jika SUDAH LOGIN membuka halaman login -> Alihkan sesuai role masing-masing
    if ((isAuthAdminPage || isAuthUserPage) && token) {
        if (role === 'admin') {
            return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        } else if (role === 'ticketing_officer') {
            return NextResponse.redirect(new URL('/dashboard/loket', request.url));
        } else if (role === 'umkm_mitra') {
            return NextResponse.redirect(new URL('/dashboard/umkm', request.url));
        } else if (role === 'visitor') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/dashboard/:path*', '/auth/login', '/auth/users/login'],
};