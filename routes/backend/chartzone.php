<?php

use App\Http\Controllers\Backend\ChartZoneController;

Route::get('zone', [ChartZoneController::class, 'index'])->name('zone');
Route::get('zone/getTable', [ChartZoneController::class, 'getTable'])->name('getTable');
Route::get('zone/getZone', [ChartZoneController::class, 'getZone'])->name('getZone');
Route::get('zone/submitZone', [ChartZoneController::class, 'submitZone'])->name('submitZone');
