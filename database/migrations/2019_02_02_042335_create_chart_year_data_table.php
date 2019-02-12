<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChartYearDataTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chart_year_data', function (Blueprint $table)
        {
            $table->dateTime('time');
            $table->text('type');
            $table->float('open',8,4);
            $table->float('high',8,4);
            $table->float('low',8,4);
            $table->float('close',8,4);
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
        Schema::dropIfExists('chart_year_data');
    }
}
