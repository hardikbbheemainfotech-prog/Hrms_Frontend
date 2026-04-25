"use client"

import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { useToast } from "@/hooks/use_toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Clock, CalendarDays, Wallet, Loader2, Filter, CheckCircle2, XCircle, PieChart as PieIcon } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export default function AttendancePage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [isMounted, setIsMounted] = useState(false) // SSR Fix ke liye
  
  const [filters, setFilters] = useState({
    filter: "range",
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  })

  const [leaveStatus, setLeaveStatus] = useState<any[]>([])
  const [attendanceLogs, setAttendanceLogs] = useState<any[]>([])
  const [leaveSummary, setLeaveSummary] = useState<any[]>([])

  const [leaveData, setLeaveData] = useState({
    leave_type_id: "1",
    start_date: "",
    end_date: "",
    reason: ""
  })

  // Theme Colors
  const COLORS = ['#1A2517', '#ACC8A2', '#4B6344', '#D1E0CD'];

  const fetchAttendance = async () => {
    try {
      const response = await api.get("/employee/attendance", {
        params: { filter: filters.filter, from: filters.start, to: filters.end }
      });
      setAttendanceLogs(response.data?.data || []);
    } catch (e) {
      setAttendanceLogs([]);
    }
  };

  const fetchAllData = async () => {
    try {
      const [leaveRes, summaryRes] = await Promise.all([
        api.get("/employee/leave_status"),
        api.get("/employee/leave_summary")
      ]);
      setLeaveStatus(leaveRes.data?.data?.data || []);
      setLeaveSummary(summaryRes.data?.data?.data || []);
    } catch (e) { console.error("Error fetching leave data"); }
    fetchAttendance();
  };

  useEffect(() => {
    setIsMounted(true); // Component mount hone par true hoga
    fetchAllData();
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [filters]);

  // IMPORTANT: String numbers ko actual numbers mein convert karna (Chart ke liye)
  const chartData = leaveSummary.map(item => ({
    ...item,
    remaining_days: Number(item.remaining_days) || 0
  }));

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "--:--";
    const date = new Date(dateStr);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit', minute: '2-digit', hour12: true, timeZone: 'UTC'    
    });
  };

  const handleApplyLeave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const diff = new Date(leaveData.end_date).getTime() - new Date(leaveData.start_date).getTime()
      const total_days = Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1

      await api.post("/employee/apply_leave", {
        ...leaveData,
        leave_type_id: parseInt(leaveData.leave_type_id),
        total_days
      })
      toast({ title: "Applied!", description: "Leave application submitted." })
      setLeaveData({ leave_type_id: "1", start_date: "", end_date: "", reason: "" })
      fetchAllData()
    } catch (error) {
      toast({ variant: "destructive", title: "Failed to apply" })
    } finally { setLoading(false) }
  }

  return (
    <div className="p-8 space-y-8 bg-[#ACC8A2]/10 min-h-screen">
      
      <h1 className="text-2xl font-bold text-[#1A2517] flex items-center gap-2">
        <CalendarDays /> Attendance & Leaves
      </h1>

      {/* TOP SECTION: SUMMARY & CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* STAT CARDS */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {leaveSummary.map((leave: any, i: number) => (
            <Card key={i} className="border-none shadow-sm bg-white">
              <CardContent className="pt-6 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{leave.leave_type}</p>
                  <h3 className="text-2xl font-bold text-[#1A2517]">{leave.remaining_days} Days</h3>
                  <p className="text-[10px] text-gray-500 mt-1">Used: {leave.taken_days || 0}</p>
                </div>
                <div className="p-3 bg-[#ACC8A2]/20 rounded-full text-[#1A2517]">
                  <Wallet size={20} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* PIE CHART CARD */}
        <Card className="border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <PieIcon size={16} /> Remaining Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px] w-full flex items-center justify-center">
              {isMounted && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="remaining_days"
                      nameKey="leave_type"
                    >
                      {chartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Legend verticalAlign="bottom" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-gray-400 text-xs flex flex-col items-center gap-2">
                   <Loader2 className="animate-spin" size={16} />
                   Rendering Chart...
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ATTENDANCE LOGS TABLE */}
      <Card className="border-none shadow-md overflow-hidden">
        <CardHeader className="bg-[#1A2517] text-[#ACC8A2] flex flex-col md:flex-row items-center justify-between gap-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock size={20} /> Daily Attendance Logs
          </CardTitle>

          <div className="flex items-center gap-2 bg-white/10 p-1.5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 px-2">
              <span className="text-[10px] font-bold uppercase text-white/60">From</span>
              <Input 
                type="date" 
                className="bg-transparent text-xs text-[#ACC8A2] border-none h-7 p-0 focus-visible:ring-0" 
                value={filters.start}
                onChange={(e) => setFilters({...filters, start: e.target.value})}
              />
            </div>
            <div className="flex items-center gap-2 border-l border-white/20 pl-2 px-2">
              <span className="text-[10px] font-bold uppercase text-white/60">To</span>
              <Input 
                type="date" 
                className="bg-transparent text-xs text-[#ACC8A2] border-none h-7 p-0 focus-visible:ring-0" 
                value={filters.end}
                onChange={(e) => setFilters({...filters, end: e.target.value})}
              />
            </div>
            <Button size="sm" className="h-7 bg-[#ACC8A2] text-[#1A2517] hover:bg-white text-[10px] font-bold" onClick={fetchAttendance}>
              <Filter size={12} className="mr-1" /> FILTER
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4 text-green-700">Check In</th>
                  <th className="px-6 py-4 text-red-700">Check Out</th>
                  <th className="px-6 py-4 text-center">Total Hours</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {attendanceLogs.length > 0 ? (
                  attendanceLogs.map((log: any, i: number) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors bg-white">
                      <td className="px-6 py-4 font-medium">{log.attendance_date?.split("T")[0]}</td>
                      <td className="px-6 py-4 font-bold">{formatTime(log.check_in)}</td>
                      <td className="px-6 py-4 font-bold">{formatTime(log.check_out)}</td>
                      <td className="px-6 py-4 text-center font-mono">{log.total_hours || "0.0"}</td>
                      <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                          log.status === 'present' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan={5} className="text-center py-10 text-gray-400 italic">No attendance records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* LEAVE FORM & HISTORY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
        <Card className="lg:col-span-1 border-none shadow-md">
          <CardHeader className="border-b"><CardTitle className="text-md">Request Leave</CardTitle></CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleApplyLeave} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Leave Type</label>
                <select className="w-full p-2 border rounded-md text-sm outline-none focus:border-[#1A2517]" value={leaveData.leave_type_id} onChange={(e) => setLeaveData({...leaveData, leave_type_id: e.target.value})}>
                  {leaveSummary.map((type, i) => (
                    <option key={i} value={type.leave_type_id}>{type.leave_type}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">From</label>
                  <Input type="date" value={leaveData.start_date} onChange={(e) => setLeaveData({...leaveData, start_date: e.target.value})} required />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase">To</label>
                  <Input type="date" value={leaveData.end_date} onChange={(e) => setLeaveData({...leaveData, end_date: e.target.value})} required />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">Reason</label>
                <textarea className="w-full p-2 border rounded-md text-sm min-h-[100px] outline-none" placeholder="Reason..." value={leaveData.reason} onChange={(e) => setLeaveData({...leaveData, reason: e.target.value})} required />
              </div>
              <Button disabled={loading} className="w-full bg-[#1A2517] text-[#ACC8A2] font-bold">
                {loading ? <Loader2 className="animate-spin" size={18} /> : "Apply Leave"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-none shadow-md overflow-hidden">
          <CardHeader className="border-b"><CardTitle className="text-md">Leave Status & History</CardTitle></CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-600 text-[10px] font-bold uppercase tracking-wider">
                  <tr>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Dates</th>
                    <th className="px-6 py-4 text-center">Days</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {leaveStatus.length > 0 ? (
                    leaveStatus.map((leave, idx) => (
                      <tr key={idx} className="hover:bg-gray-50 transition-colors bg-white">
                        <td className="px-6 py-4 font-bold text-[#1A2517]">
                          {leave.leave_type || (leave.leave_type_id === 1 ? "Paid" : "Casual")}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium">
                          {leave.start_date?.split("T")[0]} to {leave.end_date?.split("T")[0]}
                        </td>
                        <td className="px-6 py-4 text-center font-mono">{leave.total_days}</td>
                        <td className="px-6 py-4 text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase inline-flex items-center gap-1 ${
                            leave.status === 'approved' ? 'bg-green-100 text-green-700' :
                            leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                          }`}>
                            {leave.status === 'approved' ? <CheckCircle2 size={12}/> : 
                             leave.status === 'rejected' ? <XCircle size={12}/> : <Clock size={12}/>}
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={4} className="text-center py-20 text-gray-400 italic font-medium">No leave history found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}