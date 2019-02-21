<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateChartZoneTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('chart_zone', function (Blueprint $table)
        {
            $table->bigIncrements('id');
            $table->timestamps();
            $table->text('currency');
            $table->text('trade');
            $table->boolean('enable');
            $table->float('high',8,4);
            $table->float('low',8,4);
            $table->dateTime('date');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('chart_zone');
    }
}
