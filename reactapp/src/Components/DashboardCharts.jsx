import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { toast } from 'react-toastify';
import startupSubmissionService from '../services/startupSubmissionService';
import startupService from '../services/startupService';
import { useTheme } from '../hooks/useTheme';

const STATUS_MAP = {
    1: 'Pending',
    2: 'Shortlisted',
    3: 'Rejected'
};

const DashboardCharts = () => {
    const { theme } = useTheme();
    const { role } = useSelector(state => state.user);
    
    const [statusData, setStatusData] = useState([]);
    const [fundingData, setFundingData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isShowingProfiles, setIsShowingProfiles] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                let submissions = [];
                let profiles = [];
                
                // Fetch Profiles (as fallback/platform stats)
                const profileRes = await startupService.getAllProfiles({ limit: 50 });
                if (profileRes.success) profiles = profileRes.data;

                // Fetch Submissions
                if (role === 'Mentor') {
                    const res = await startupSubmissionService.getMentorSubmissions({ limit: 50 });
                    if (res.success) submissions = res.data;
                } else if (role === 'Entrepreneur') {
                    const res = await startupSubmissionService.getMySubmissions({ limit: 50 });
                    if (res.success) submissions = res.data;
                }

                if (submissions.length > 0) {
                    setIsShowingProfiles(false);
                    // Aggregate Data for Pie Chart (Status Distribution)
                    const statusCounts = { 1: 0, 2: 0, 3: 0 };
                    submissions.forEach(sub => {
                        statusCounts[sub.status] = (statusCounts[sub.status] || 0) + 1;
                    });
                    
                    const pieData = Object.keys(statusCounts)
                        .filter(key => statusCounts[key] > 0)
                        .map(key => ({
                            name: STATUS_MAP[key],
                            value: statusCounts[key]
                        }));
                    
                    setStatusData(pieData);

                    // Aggregate Data for Bar/Area Chart
                    const barData = submissions.map((sub, index) => ({
                        name: sub.startupProfileId?.category || `Idea ${index + 1}`,
                        funding: sub.expectedFunding || 0
                    })).slice(0, 10);

                    setFundingData(barData);
                } else if (profiles.length > 0) {
                    setIsShowingProfiles(true);
                    // Fallback to showing Profile data
                    const industryCounts = {};
                    profiles.forEach(p => {
                        const ind = p.targetIndustry || 'Other';
                        industryCounts[ind] = (industryCounts[ind] || 0) + 1;
                    });

                    const pieData = Object.keys(industryCounts).map(key => ({
                        name: key,
                        value: industryCounts[key]
                    }));
                    setStatusData(pieData);

                    const barData = profiles.map((p, index) => ({
                        name: p.category || `Opp ${index + 1}`,
                        funding: p.fundingLimit || 0
                    })).slice(0, 10);
                    setFundingData(barData);
                }
            } catch (error) {
                console.error("Failed to load chart data:", error);
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        if (role) {
            fetchDashboardData();
        }
    }, [role]);

    if (loading) {
        return (
            <div className="w-full h-64 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (statusData.length === 0 && fundingData.length === 0) {
        return (
            <div className={`p-8 text-center rounded-2xl ${theme === 'gravity' ? 'bg-white/5 border border-white/10 text-gray-400' : 'bg-gray-50 text-gray-500'}`}>
                <p>No data available yet to display charts.</p>
            </div>
        );
    }

    // Theme specific configurations
    const isClassic = theme === 'default';
    const isGravity = theme === 'gravity';

    // Disable animations in classic
    const isAnimated = !isClassic;

    const COLORS = isGravity 
        ? ['#8b5cf6', '#3b82f6', '#f59e0b'] // Neon purple, blue, amber
        : ['#1E3A5F', '#F97316', '#64748b']; // Classic brand colors

    // Custom tooltips
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className={`p-3 rounded-xl border ${
                    isGravity ? 'bg-[#050510]/90 backdrop-blur-xl border-purple-500/30 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)]' : 
                    'bg-white border-gray-200 shadow-md text-gray-800'
                }`}>
                    <p className="font-bold mb-1">{label}</p>
                    {payload.map((entry, index) => (
                        <p key={`item-${index}`} style={{ color: entry.color }} className="text-sm font-medium">
                            {entry.name}: {entry.name.includes('Funding') ? `₹${entry.value.toLocaleString()}` : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const textFill = isGravity ? '#94a3b8' : '#64748b';
    const gridColor = isGravity ? 'rgba(255,255,255,0.05)' : '#e2e8f0';

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8 w-full max-w-6xl mx-auto px-4 pb-12 relative z-10">
            
            {/* Chart 1: Status Distribution (Pie) */}
            <div className={`p-6 rounded-3xl ${
                isGravity ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(124,58,237,0.1)]' : 
                'bg-white shadow-lg border border-gray-100'
            }`}>
                <h3 className={`text-xl font-bold mb-4 text-center ${
                    isGravity ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 
                    'text-gray-800'
                }`}>
                    {isShowingProfiles ? 'Opportunities by Industry' : 'Submission Status Overview'}
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={statusData}
                                cx="50%"
                                cy="50%"
                                innerRadius={isGravity ? 60 : 0} // Donut for modern
                                outerRadius={80}
                                paddingAngle={isGravity ? 5 : 0}
                                dataKey="value"
                                isAnimationActive={isAnimated}
                                animationBegin={0}
                                animationDuration={isGravity ? 1500 : 800}
                                animationEasing={isGravity ? "ease-out" : "ease"}
                                stroke={isGravity ? 'rgba(255,255,255,0.1)' : '#fff'}
                                strokeWidth={2}
                            >
                                {statusData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index % COLORS.length]} 
                                        style={isGravity ? { filter: `drop-shadow(0px 0px 8px ${COLORS[index % COLORS.length]}80)` } : {}}
                                    />
                                ))}
                            </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ color: textFill }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Chart 2: Funding vs Potential (Bar / Area) */}
            <div className={`p-6 rounded-3xl ${
                isGravity ? 'bg-white/5 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(124,58,237,0.1)]' : 
                'bg-white shadow-lg border border-gray-100'
            }`}>
                <h3 className={`text-xl font-bold mb-4 text-center ${
                    isGravity ? 'text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 
                    'text-gray-800'
                }`}>
                    {isShowingProfiles ? 'Available Funding Limits' : 'Recent Submissions Funding'}
                </h3>
                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        {isGravity ? (
                            // Ultimate Gravity Theme uses glowing AreaChart
                            <AreaChart data={fundingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="colorFunding" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis dataKey="name" stroke={textFill} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                <YAxis stroke={textFill} tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="funding" 
                                    stroke="#8b5cf6" 
                                    strokeWidth={3}
                                    fillOpacity={1} 
                                    fill="url(#colorFunding)" 
                                    isAnimationActive={true}
                                    animationDuration={2000}
                                    activeDot={{ r: 6, fill: '#fff', stroke: '#8b5cf6', strokeWidth: 2, filter: 'drop-shadow(0 0 5px rgba(139, 92, 246, 0.8))' }}
                                />
                            </AreaChart>
                        ) : (
                            // Classic and Osmo use BarChart
                            <BarChart data={fundingData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
                                <XAxis dataKey="name" stroke={textFill} tick={{fontSize: 12}} tickLine={false} axisLine={false} />
                                <YAxis stroke={textFill} tick={{fontSize: 12}} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value/1000}k`} />
                                <RechartsTooltip content={<CustomTooltip />} />
                                <Bar 
                                    dataKey="funding" 
                                    fill={COLORS[0]} 
                                    radius={[0, 0, 0, 0]} 
                                    isAnimationActive={isAnimated}
                                    animationDuration={1000}
                                />
                            </BarChart>
                        )}
                    </ResponsiveContainer>
                </div>
            </div>

        </div>
    );
};

export default DashboardCharts;
