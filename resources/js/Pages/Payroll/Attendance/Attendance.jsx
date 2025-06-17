import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AttendanceReport = ({ uid }) => {
    const [report, setReport] = useState([]);

    useEffect(() => {
        axios.get(`/attendance/report/${uid}`).then(res => {
            setReport(res.data);
        });
    }, [uid]);

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">Attendance Report</h2>
            <div className="overflow-x-auto">
                <table className="table-auto w-full text-left border-collapse border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-4 py-2">Date</th>
                            <th className="border px-4 py-2">In Time</th>
                            <th className="border px-4 py-2">Out Time</th>
                            <th className="border px-4 py-2">Late</th>
                            <th className="border px-4 py-2">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.map((item, index) => (
                            <tr key={index}>
                                <td className="border px-4 py-2">{item.date}</td>
                                <td className="border px-4 py-2">{item.in_time || '--'}</td>
                                <td className="border px-4 py-2">{item.out_time || '--'}</td>
                                <td className="border px-4 py-2">{item.late || '--'}</td>
                                <td className={`border px-4 py-2 font-semibold ${item.status === 'Absent' ? 'text-red-500' : 'text-green-600'}`}>
                                    {item.status}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AttendanceReport;
