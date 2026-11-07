<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SessionActivityTest extends TestCase
{
    use RefreshDatabase;

    public function test_activity_refreshes_a_valid_token_sliding_expiration(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $issuedToken = $user->createToken('test-token', ['admin']);
        $token = $issuedToken->accessToken;
        $token->forceFill(['created_at' => now()->subSeconds(config('sanctum.expiration') * 60 - 30)])->save();

        $this->withToken($issuedToken->plainTextToken)
            ->postJson('/api/auth/activity')
            ->assertOk()
            ->assertJsonPath('expires_in', config('sanctum.expiration') * 60);

        $this->assertTrue($token->fresh()->created_at->greaterThan(now()->subMinute()));
    }

    public function test_expired_token_is_rejected_without_activity_refresh(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $issuedToken = $user->createToken('test-token', ['admin']);
        $token = $issuedToken->accessToken;
        $expiredAt = now()->subSeconds(config('sanctum.expiration') * 60 + 30);
        $token->forceFill(['created_at' => $expiredAt])->save();

        $this->withToken($issuedToken->plainTextToken)
            ->postJson('/api/auth/activity')
            ->assertUnauthorized();

        $this->assertSame(
            $expiredAt->toDateTimeString(),
            $token->fresh()->created_at->toDateTimeString()
        );
    }

    public function test_regular_authenticated_requests_do_not_refresh_token_expiration(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $issuedToken = $user->createToken('test-token', ['admin']);
        $token = $issuedToken->accessToken;
        $issuedAt = now()->subSeconds(config('sanctum.expiration') * 60 - 30);
        $token->forceFill(['created_at' => $issuedAt])->save();

        $this->withToken($issuedToken->plainTextToken)
            ->getJson('/api/me')
            ->assertOk();

        $this->assertSame(
            $issuedAt->toDateTimeString(),
            $token->fresh()->created_at->toDateTimeString()
        );
    }

    public function test_logout_does_not_restore_the_revoked_token(): void
    {
        $user = User::factory()->create(['role' => 'admin']);
        $issuedToken = $user->createToken('test-token', ['admin']);
        $issuedToken->accessToken->forceFill([
            'created_at' => now()->subSeconds(config('sanctum.expiration') * 60 - 30),
        ])->save();

        $this->withToken($issuedToken->plainTextToken)
            ->postJson('/api/logout')
            ->assertOk();

        $this->assertDatabaseMissing('personal_access_tokens', [
            'id' => $issuedToken->accessToken->id,
        ]);
    }
}
