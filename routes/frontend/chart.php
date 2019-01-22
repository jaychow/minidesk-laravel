<?php

use App\Http\Controllers\Frontend\ChartController;

Route::get('chart', [ChartController::class, 'index'])->name('chart');
Route::get('chart/hello', [ChartController::class, 'hello'])->name('chart.hello');
