<?php

use App\Http\Controllers\Frontend\ChartController;

Route::get('economicevent', [EconomicEventController::class, 'index'])->name('economicevent');


