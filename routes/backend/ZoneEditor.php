<?php

use App\Http\Controllers\Backend\ZoneEditorController;

Route::get('zoneeditor', [ZoneEditorController::class, 'index'])->name('zoneeditor');
Route::get('zoneeditor/getTable', [ZoneEditorController::class, 'getTable'])->name('getTable');
Route::get('zoneeditor/getZone', [ZoneEditorController::class, 'getZone'])->name('getZone');
Route::post('zoneeditor/submitZone', [ZoneEditorController::class, 'submitZone'])->name('submitZone');
