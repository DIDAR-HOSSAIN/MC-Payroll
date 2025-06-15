<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Attendance;
use MehediJaman\LaravelZkteco\LaravelZkteco;

class SyncAttendance extends Command
{

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'attendance:sync';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sync attendance from ZKTeco device';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $zk = new LaravelZkteco('192.168.1.50');
        if ($zk->connect()) {
            $records = $zk->getAttendance();
            foreach ($records as $record) {
                Attendance::updateOrCreate(
                    ['uid' => $record['uid']],
                    [
                        'employee_id' => $record['id'],
                        'state' => $record['state'],
                        'timestamp' => $record['timestamp'],
                        'type' => $record['type']
                    ]
                );
            }

            $this->info('Attendance synced successfully');
        } else {
            $this->error('Failed to connect to device');
        }
    }
}
