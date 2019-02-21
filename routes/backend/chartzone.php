<?php

use App\Http\Controllers\Backend\ChartZoneController;

Route::get('chartzone', [ChartZoneController::class, 'index'])->name('chartzone');
Route::get('chartzone/getTable', [ChartZoneController::class, 'getTable'])->name('getTable');
Route::get('chartzone/getZone', [ChartZoneController::class, 'getZone'])->name('getZone');
Route::post('chartzone/submitZone', [ChartZoneController::class, 'submitZone'])->name('submitZone');
