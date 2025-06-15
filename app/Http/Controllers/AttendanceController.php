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

    //  public function sync()
    //  {
    //      $zk = new LaravelZkteco('192.168.1.50'); // connect to your device IP

    //      if ($zk->connect()) {
    //          $attendance = $zk->getAttendance();
    //          return response()->json($attendance);
    //      } else {
    //          return response()->json(['error' => 'Unable to connect to device'], 500);
    //      }
    //  }


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


}
