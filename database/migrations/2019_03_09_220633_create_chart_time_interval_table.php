<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChartTimeIntervalTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chart_time_interval', function (Blueprint $table)
        {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->string('day');
            $table->string('hour');
            $table->string('minute');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chart_time_interval');
    }
}
