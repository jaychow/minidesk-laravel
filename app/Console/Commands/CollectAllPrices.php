<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\Frontend\ChartController;


class CollectAllPrices extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'collectAllPrice';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Create a new command instance.
     *
     * @return void
     */
    public function __construct()
    {
        parent::__construct();
    }

    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        //
        $currencyArr = ['USD', 'GBP', 'CAD'];
        $chartController = new ChartController();
        $fromTime = $chartController->_getFromTime('1M');
        $this->info("From time: ".$fromTime);
        for($i=0;$i<count($currencyArr);$i++){
            for($j=0;$j<count($currencyArr);$j++){
                if($i === $j)
                    continue;
                else{
                    $pair = $currencyArr[$i]."_".$currencyArr[$j];
                    $data = $chartController->getFromAPI($pair, -8, $fromTime, "1M");
                    // $this->info(json_encode($data));
                    if($data){
                        $this->info("Saved ".$pair." data");
                    }
                }
            }
        }
        $this->info("Finish saving all current price in list!");
    }
}
