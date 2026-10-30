<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'https://smartmdl.com',
        'https://www.smartmdl.com',
        'http://localhost:3000',
        
    ], 

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true, // WAJIB bernilai true jika menggunakan Cookie, Session, atau Sanctum Auth
];