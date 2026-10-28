<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Admin / Pokdarwis
        User::updateOrCreate(['email' => 'admin@juruggedhe.com'], [
            'name' => 'Admin Pokdarwis',
            'password' => Hash::make('password123'),
            'role' => 'admin'
        ]);

        // 2. Petugas Loket
        User::updateOrCreate(['email' => 'loket@juruggedhe.com'], [
            'name' => 'Petugas Loket',
            'password' => Hash::make('password123'),
            'role' => 'ticketing_officer'
        ]);

        // 3. Mitra UMKM Sedyo Maju
        User::updateOrCreate(['email' => 'umkm@sedyomaju.com'], [
            'name' => 'Pengurus UMKM Sedyo Maju',
            'password' => Hash::make('password123'),
            'role' => 'umkm_mitra'
        ]);

        // 4. Wisatawan / Publik
        User::updateOrCreate(['email' => 'visitor@gmail.com'], [
            'name' => 'Wisatawan Umum',
            'password' => Hash::make('password123'),
            'role' => 'visitor'
        ]);
    }
}