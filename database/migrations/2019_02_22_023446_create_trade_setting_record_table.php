<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTradeSettingRecordTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('trade_setting_record', function (Blueprint $table)
        {
            $table->bigIncrements('id');
            $table->text('account');
            $table->text('home_currency');
            $table->text('trade_currency');
            $table->text('trade');
            $table->float('amount',8,2);
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
        Schema::dropIfExists('trade_setting_record');
    }
}
