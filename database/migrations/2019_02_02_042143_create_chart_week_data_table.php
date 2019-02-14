<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChartWeekDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chart_week_data', function (Blueprint $table)
        {
            $table->dateTime('time');
            $table->text('type');
            $table->float('open',8,5);
            $table->float('high',8,5);
            $table->float('low',8,5);
            $table->float('close',8,5);
            $table->bigInteger('volume');
            $table->float('price_change',8,3);
            $table->float('price_range',8,5);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chart_week_data');
    }
}
