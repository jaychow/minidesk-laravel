<?php

use App\Http\Controllers\Backend\ChartZoneController;

Route::get('chartzone', [ChartZoneController::class, 'index'])->name('zone');
Route::get('chartzone/getTable', [ChartZoneController::class, 'getTable'])->name('getTable');
Route::get('chartzone/getZone', [ChartZoneController::class, 'getZone'])->name('getZone');
Route::get('chartzone/submitZone', [ChartZoneController::class, 'submitZone'])->name('submitZone');
