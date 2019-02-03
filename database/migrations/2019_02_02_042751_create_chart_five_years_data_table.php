<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChartFiveYearsDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chart_five_years_data', function (Blueprint $table)
        {
            $table->dateTime('time');
            $table->text('type');
            $table->float('open');
            $table->float('high');
            $table->float('low');
            $table->float('close');
            $table->bigInteger('volume');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chart_five_years_data');
    }
}