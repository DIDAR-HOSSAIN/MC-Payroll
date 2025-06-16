<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Attendance;
// use LaravelZkteco\LaravelZkteco;
use LaravelZkteco;

class SyncAttendance extends Command
{
    protected $signature = 'attendance:sync';

    protected $description = 'Sync fingerprint attendance every minute';

    public function handle()
{
    try {
        $zk = new LaravelZkteco('192.168.1.50');

        if ($zk->connect()) {
            $data = $zk->getAttendance();

            foreach ($data as $entry) {
                $exists = Attendance::where('uid', $entry['uid'])
                    ->where('timestamp', $entry['timestamp'])
                    ->exists();

                if (!$exists) {
                    Attendance::create([
                        'uid' => $entry['uid'],
                        'employee_id' => $entry['id'],
                        'state' => $entry['state'],
                        'timestamp' => $entry['timestamp'],
                        'type' => $entry['type'],
                    ]);
                }
            }

            \Log::info('Attendance synced.');
            $this->info('Done');
        } else {
            \Log::error('ZK connection failed.');
        }
    } catch (\Throwable $e) {
        \Log::error('SyncAttendance failed: ' . $e->getMessage());
    }
}

}
