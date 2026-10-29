import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('auth_token')?.value;
    const role = request.cookies.get('user_role')?.value;
    const pathname = request.nextUrl.pathname;

    const isAuthAdminPage = pathname.startsWith('/auth/login');
    const isAuthUserPage = pathname.startsWith('/auth/users/login');
    const isDashboardPage = pathname.startsWith('/dashboard');

    // 1. Jika BELUM LOGIN mencoba akses dashboard -> Tendang ke login admin
    if (isDashboardPage && !token) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    // 2. Proteksi role jika VISITOR mencoba akses /dashboard -> Lempar ke beranda
    if (isDashboardPage && role === 'visitor') {
        return NextResponse.redirect(new URL('/', request.url));
    }

    // 3. Jika SUDAH LOGIN membuka halaman login admin/user -> Alihkan sesuai role
    if ((isAuthAdminPage || isAuthUserPage) && token) {
        if (role === 'admin') {
            return NextResponse.redirect(new URL('/dashboard/admin', request.url));
        } else if (role === 'ticketing_officer') {
            return NextResponse.redirect(new URL('/dashboard/loket/scanner', request.url));
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