<?php

use App\Http\Controllers\Frontend\ChartController;

Route::get('chart', [ChartController::class, 'index'])->name('chart');
Route::get('chart/getAPI', [ChartController::class, 'getAPI'])->name('getAPI');
Route::get('chart/getTable', [ChartController::class, 'getTable'])->name('getTable');
Route::get('chart/saveTradeSetting', [ChartController::class, 'saveTradeSetting'])->name('saveTradeSetting');
Route::get('chart/getTradeSetting', [ChartController::class, 'getTradeSetting'])->name('getTradeSetting');


