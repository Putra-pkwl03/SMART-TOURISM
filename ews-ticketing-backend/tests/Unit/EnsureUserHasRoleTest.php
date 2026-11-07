<?php

namespace Tests\Unit;

use App\Http\Middleware\EnsureUserHasRole;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Tests\TestCase;

class EnsureUserHasRoleTest extends TestCase
{
    public function test_it_allows_a_user_with_an_allowed_role(): void
    {
        $request = Request::create('/api/admin/dashboard');
        $request->setUserResolver(fn () => new User(['role' => 'admin']));

        $response = (new EnsureUserHasRole())->handle(
            $request,
            fn () => new Response('', 204),
            'admin'
        );

        $this->assertSame(204, $response->getStatusCode());
    }

    public function test_it_rejects_a_user_with_a_different_role(): void
    {
        $request = Request::create('/api/admin/dashboard');
        $request->setUserResolver(fn () => new User(['role' => 'visitor']));

        $response = (new EnsureUserHasRole())->handle(
            $request,
            fn () => new Response('', 204),
            'admin'
        );

        $this->assertSame(403, $response->getStatusCode());
    }

    public function test_it_rejects_a_request_without_an_authenticated_user(): void
    {
        $request = Request::create('/api/admin/dashboard');
        $request->setUserResolver(fn () => null);

        $response = (new EnsureUserHasRole())->handle(
            $request,
            fn () => new Response('', 204),
            'admin'
        );

        $this->assertSame(401, $response->getStatusCode());
    }
}
