<?php

use App\Http\Controllers\Frontend\TestController;

Route::get('test', [TestController::class, 'index'])->name('test');
Route::get('test/getapi', [TestController::class, 'getapi'])->name('getapi');
