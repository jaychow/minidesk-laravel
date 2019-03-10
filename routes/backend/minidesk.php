<?php

use App\Http\Controllers\Backend\ZoneEditorController;
use App\Http\Controllers\Backend\ChartRefreshIntervalController;

Route::get('zoneeditor', [ZoneEditorController::class, 'index'])->name('zoneeditor');
Route::get('zoneeditor/getZone', [ZoneEditorController::class, 'getZone'])->name('getZone');
Route::post('zoneeditor/submitZone', [ZoneEditorController::class, 'submitZone'])->name('submitZone');

Route::get('chartrefreshinterval', [ChartRefreshIntervalController::class, 'index'])->name('chartrefreshinterval');
Route::get('chartrefreshinterval/getInterval', [ChartRefreshIntervalController::class, 'getInterval'])->name('getInterval');
Route::post('chartrefreshinterval/submitInterval', [ChartRefreshIntervalController::class, 'submitInterval'])->name('submitInterval');