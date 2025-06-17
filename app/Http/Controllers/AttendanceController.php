<?php

namespace App\Http\Controllers;

use App\Models\Attendance;
use App\Http\Requests\StoreAttendanceRequest;
use App\Http\Requests\UpdateAttendanceRequest;
use MehediJaman\LaravelZkteco\LaravelZkteco;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;




class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $data = $request->validate([
            'user_id' => 'required|integer',
            'timestamp' => 'required|date',
            'status' => 'required|string',
        ]);

        Attendance::create($data);

        return response()->json(['message' => 'Attendance saved']);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttendanceRequest $request)
    {
        $request->validate([
            'user_id' => 'required|string',
            'timestamp' => 'required|date',
            'status' => 'required|string',
        ]);

        // Check if record exists to prevent duplicates (optional)
        $exists = Attendance::where('user_id', $request->user_id)
                    ->where('timestamp', $request->timestamp)
                    ->exists();

        if (!$exists) {
            Attendance::create([
                'user_id' => $request->user_id,
                'timestamp' => $request->timestamp,
                'status' => $request->status,
            ]);
        }

        return response()->json(['message' => 'Attendance recorded']);
    }

    /**
     * Display the specified resource.
     */
    public function show(Attendance $attendance)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attendance $attendance)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttendanceRequest $request, Attendance $attendance)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attendance $attendance)
    {
        //
    }

    public function sync()
    {
        $zk = new LaravelZkteco('192.168.1.50');

        if ($zk->connect()) {
            $data = $zk->getAttendance();

            foreach ($data as $entry) {
                // Check if already exists to avoid duplicates
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

            return response()->json(['message' => 'Attendance synced successfully.']);
        }

        return response()->json(['error' => 'Unable to connect to device'], 500);
    }


    public function report($employee_id)
    {
        $startDate = now()->startOfMonth()->toDateString(); // First day of current month
        $endDate = now()->endOfMonth()->toDateString();     // Last day of current month
        $shiftStart = Carbon::createFromTimeString('09:00:00'); // Define shift start time

        $dates = collect();
        for ($date = Carbon::parse($startDate); $date->lte($endDate); $date->addDay()) {
            $dates->push($date->toDateString());
        }

        $records = Attendance::where('employee_id', $employee_id)
            ->whereBetween('timestamp', [$startDate, $endDate])
            ->orderBy('timestamp')
            ->get()
            ->groupBy(fn($item) => Carbon::parse($item->timestamp)->toDateString());

        $report = [];

        foreach ($dates as $date) {
            if (isset($records[$date])) {
                $daily = $records[$date];
                $inTime = Carbon::parse($daily->min('timestamp'))->format('H:i');
                $outTime = Carbon::parse($daily->max('timestamp'))->format('H:i');
                $isLate = Carbon::parse($inTime)->gt($shiftStart) ? 'Yes' : 'No';

                $report[] = [
                    'date' => $date,
                    'in_time' => Carbon::parse($inTime)->format('h:i A'),
                    'out_time' => Carbon::parse($outTime)->format('h:i A'),
                    'late' => $isLate,
                    'status' => 'Present',
                ];
            } else {
                $report[] = [
                    'date' => $date,
                    'in_time' => null,
                    'out_time' => null,
                    'late' => null,
                    'status' => 'Absent',
                ];
            }
        }

        return response()->json($report);
    }

}
