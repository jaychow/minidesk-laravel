<?php

Breadcrumbs::for('admin.dashboard', function ($trail) {
    $trail->push(__('strings.backend.dashboard.title'), route('admin.dashboard'));
});

Breadcrumbs::for('admin.chartzone', function ($trail) {
    $trail->push(__('strings.backend.chartzone.title'), route('admin.chartzone'));
});

require __DIR__.'/auth.php';
require __DIR__.'/log-viewer.php';
