<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;
use Symfony\Component\HttpFoundation\Response;

class RefreshActiveSanctumToken
{
    public function handle(Request $request, Closure $next): Response
    {
        $token = $request->user()?->currentAccessToken();
        $expiration = config('sanctum.expiration');

        if (
            $token instanceof PersonalAccessToken
            && $expiration
            && $token->created_at?->lessThan(now()->subMinutes(min(5, max(1, intdiv($expiration, 3)))))
        ) {
            $token->forceFill(['created_at' => now()])->save();
        }

        return $next($request);
    }
}
