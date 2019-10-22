<?php

use App\Http\Controllers\Frontend\ChartController;
use App\Http\Controllers\Frontend\EconomicEventController;

Route::get('chart', [ChartController::class, 'index'])->name('chart');
Route::get('chart/getAPI', [ChartController::class, 'getAPI'])->name('getAPI');
Route::get('chart/getTable', [ChartController::class, 'getTable'])->name('getTable');
Route::get('chart/getZone', [ChartController::class, 'getZone'])->name('getZone');
Route::get('chart/getTimeInterval', [ChartController::class, 'getTimeInterval'])->name('getTimeInterval');
Route::get('chart/saveTradeSetting', [ChartController::class, 'saveTradeSetting'])->name('saveTradeSetting');
Route::get('chart/getTradeSetting', [ChartController::class, 'getTradeSetting'])->name('getTradeSetting');
Route::get('chart/getInfoList', [ChartController::class, 'getInfoList'])->name('getInfoList');
Route::get('chart/getInfoPages', [ChartController::class, 'getInfoPages'])->name('getInfoPages');

Route::get('economicevent', [EconomicEventController::class, 'index'])->name('economicevent');


