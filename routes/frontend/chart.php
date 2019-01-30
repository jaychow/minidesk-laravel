<?php

use App\Http\Controllers\Frontend\ChartController;

Route::get('chart', [ChartController::class, 'index'])->name('chart');
Route::get('chart/getAPI', [ChartController::class, 'getAPI'])->name('chart.getAPI');


