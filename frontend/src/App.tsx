import { useState, useEffect } from 'react';
import { TrendingUp, Activity, Waves, Search, RefreshCw, Users, ArrowLeft, ChevronRight, CreditCard, Wallet, CheckCircle2 } from 'lucide-react';

interface Meter {
  id: number;
  meterNumber: string;
  waterUsed: number;
  balance: number;
  status: 'Aktiv' | 'Pul kam';
}

interface User {
  id: number;
  name: string;
  meters: Meter[];
}

const generateMockData = (): User[] => {
  const firstNames = ['Aziz', 'Bekzod', 'Dilshod', 'Elyor', 'Farhod', 'Gulnora', 'Hasan', 'Ilhom', 'Jamshid', 'Komil'];
  const lastNames = ['Karimov', 'Turdiyev', 'Rahimov', 'Usmonov', 'Aliyev', 'Murodova', 'Nazarov', 'Sadiqov', 'Tolipov', 'Vahobov'];
  
  let globalMeterId = 1;
  
  return Array.from({ length: 10 }, (_, i) => {
    // Generate 1 to 3 meters per user randomly
    const meterCount = Math.floor(Math.random() * 3) + 1;
    const userMeters: Meter[] = [];
    
    for (let j = 0; j < meterCount; j++) {
      userMeters.push({
        id: globalMeterId++,
        meterNumber: `HM${458231 + globalMeterId}`,
        waterUsed: parseFloat((Math.random() * 0.5).toFixed(2)),
        balance: Math.floor(Math.random() * 5000) + 44000,
        status: 'Aktiv',
      });
    }

    return {
      id: i + 1,
      name: `${firstNames[i]} ${lastNames[i]}`,
      meters: userMeters
    };
  });
};

function App() {
  // Hierarchy States
  const [users, setUsers] = useState<User[]>(generateMockData());
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  // UI States
  const [searchQuery, setSearchQuery] = useState('');

  // Payment States
  const [paymentGateway, setPaymentGateway] = useState<'uzcard' | 'humo' | 'visa'>('uzcard');
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');

  // Dummy effect for simulating real-time metric increments across all users and meters
  useEffect(() => {
    const interval = setInterval(() => {

      // Deep simulation of user meter data
      setUsers(prevUsers => prevUsers.map(user => {
        const updatedMeters = user.meters.map(meter => {
          const waterIncrease = parseFloat((Math.random() * 0.05).toFixed(2));
          const balanceDecrease = Math.floor(waterIncrease * 500); 
          
          const newWaterUsed = parseFloat((meter.waterUsed + waterIncrease).toFixed(2));
          const newBalance = meter.balance - balanceDecrease;
          
          return {
            ...meter,
            waterUsed: newWaterUsed,
            balance: newBalance,
            status: (newBalance < 45000 ? 'Pul kam' : 'Aktiv') as 'Aktiv' | 'Pul kam'
          };
        });
        
        return {
          ...user,
          meters: updatedMeters
        };
      }));

    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setUsers(generateMockData());
  };

  const handlePayment = () => {
    if (!selectedUserId || !paymentAmount || isNaN(Number(paymentAmount)) || Number(paymentAmount) <= 0) return;
    
    const amount = Number(paymentAmount);
    
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id !== selectedUserId) return user;
      
      const updatedMeters = [...user.meters];
      if (updatedMeters.length > 0) {
        // Apply payment to their first meter
        const newBalance = updatedMeters[0].balance + amount;
        updatedMeters[0] = {
          ...updatedMeters[0],
          balance: newBalance,
          status: (newBalance < 45000 ? 'Pul kam' : 'Aktiv') as 'Aktiv' | 'Pul kam'
        };
      }
      
      return {
        ...user,
        meters: updatedMeters
      };
    }));
    
    setPaymentAmount('');
    setCardNumber('');
  };

  // Render Helpers
  const selectedUser = users.find(u => u.id === selectedUserId);
  
  const getAggregatedData = (user: User) => {
    const totalWater = user.meters.reduce((sum, m) => sum + m.waterUsed, 0);
    const totalBalance = user.meters.reduce((sum, m) => sum + m.balance, 0);
    const hasLowBalance = user.meters.some(m => m.status === 'Pul kam');
    return {
      totalWater: parseFloat(totalWater.toFixed(2)),
      totalBalance,
      status: hasLowBalance ? 'Pul kam' : 'Aktiv'
    };
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredMeters = selectedUser?.meters.filter(meter => 
    meter.meterNumber.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];


  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 pb-20">

      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-12 flex flex-col gap-12">

        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Waves className="h-6 w-6 text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">AquaTrack</h1>
              <p className="text-sm font-medium text-slate-400">Smart Water Monitoring</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900 border border-slate-800">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-300">System Online</span>
          </div>
        </header>

        {selectedUserId !== null && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Balance Card */}
            <div className="group relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 transition-all hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                  <Wallet className="h-6 w-6" />
                </div>
                <h2 className="text-lg font-semibold text-slate-300">
                  {selectedUserId === null ? "Umumiy Tizim Balansi" : "Joriy Balans"}
                </h2>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl md:text-6xl font-black tracking-tighter text-white tabular-nums">
                  {selectedUserId === null 
                    ? users.reduce((acc, user) => acc + getAggregatedData(user).totalBalance, 0).toLocaleString('ru-RU')
                    : (selectedUser ? getAggregatedData(selectedUser).totalBalance.toLocaleString('ru-RU') : '0')}
                </span>
                <span className="text-xl font-medium text-slate-500">UZS</span>
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <span className="text-emerald-400 font-medium ml-1">Live</span>
                <span className="text-slate-500 ml-2">Real-time tracking</span>
              </div>
            </div>
            <Wallet className="absolute -bottom-6 -right-6 h-48 w-48 text-emerald-500/5 rotate-12 group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-700 ease-out" />
          </div>

          {/* Payment Card */}
          <div className="relative overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 p-8 flex flex-col justify-between">
            {selectedUserId === null ? (
              <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="p-4 rounded-full bg-slate-800/50">
                  <CreditCard className="h-8 w-8 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-300">To'lov qilish</h3>
                  <p className="text-sm text-slate-500 mt-2 max-w-[280px]">
                    To'lov amalga oshirish uchun avval ro'yxatdan mijozni tanlang
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <h2 className="text-lg font-semibold text-slate-300">Hisobni To'ldirish</h2>
                </div>
                
                <div className="space-y-4 flex-grow">
                  <div className="grid grid-cols-3 gap-3">
                    <button 
                      onClick={() => setPaymentGateway('uzcard')}
                      className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                        paymentGateway === 'uzcard' 
                          ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.15)]' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Uzcard
                    </button>
                    <button 
                      onClick={() => setPaymentGateway('humo')}
                      className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                        paymentGateway === 'humo' 
                          ? 'bg-orange-500/20 border-orange-500 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.15)]' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Humo
                    </button>
                    <button 
                      onClick={() => setPaymentGateway('visa')}
                      className={`py-2 px-3 rounded-xl border text-sm font-medium transition-all ${
                        paymentGateway === 'visa' 
                          ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.15)]' 
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      Visa
                    </button>
                  </div>
                  
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="0000 0000 0000 0000"
                      value={cardNumber}
                      maxLength={19}
                      onChange={(e) => {
                        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
                        val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
                        setCardNumber(val);
                      }}
                      className="w-full bg-slate-950 border border-slate-700 text-base rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-500 transition-all font-medium font-mono tracking-wider"
                    />
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      placeholder="Summani kiriting..."
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 text-base rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 text-white placeholder-slate-500 transition-all font-medium"
                    />
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <span className="text-slate-500 font-medium text-sm">UZS</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={handlePayment}
                  disabled={!paymentAmount || Number(paymentAmount) <= 0 || cardNumber.length < 19}
                  className="mt-4 w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  To'lov qilish
                </button>
              </div>
            )}
          </div>
        </div>
        )}

        {/* --- MAIN CONTENT AREA --- */}
        <div className="rounded-3xl bg-slate-900 border border-slate-800 shadow-xl overflow-hidden mt-6">
          
          {/* Main Toolbar */}
          <div className="p-6 md:p-8 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center gap-4">
              {selectedUserId !== null && (
                <button 
                  onClick={() => {
                    setSelectedUserId(null);
                    setSearchQuery('');
                  }}
                  className="p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 transition-colors border border-slate-700/50"
                  aria-label="Back to Admin Dashboard"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
              )}
              
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white mb-1 flex items-center gap-2">
                  {selectedUserId === null ? (
                    <>
                      <Users className="h-5 w-5 text-blue-400" />
                      Client Monitoring Board
                    </>
                  ) : (
                    <>
                      Profil: <span className="text-blue-400">{selectedUser?.name}</span>
                    </>
                  )}
                </h2>
                <p className="text-sm text-slate-400">
                  {selectedUserId === null 
                    ? <>Jami mijozlar: <span className="text-white font-semibold">{users.length}</span></>
                    : <>Jami hisoblagichlar: <span className="text-white font-semibold">{selectedUser?.meters.length}</span></>
                  }
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-500" />
                </div>
                <input
                  type="text"
                  placeholder={selectedUserId === null ? "Mijoz qidirish..." : "Hisoblagich qidirish..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-sm rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-200 placeholder-slate-500 w-full sm:w-64 transition-all"
                />
              </div>
              <button 
                onClick={handleRefresh}
                className="bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white p-2.5 px-4 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 shadow-lg shadow-blue-500/20"
              >
                <RefreshCw className="h-4 w-4" />
                <span className="hidden sm:inline">Yangilash</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            {selectedUserId === null ? (
              // ADMIN DASHBOARD VIEW (Users List)
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Mijoz (Ism Familiya)</th>
                    <th className="px-6 py-4 text-center">Uskunalar Soni</th>
                    <th className="px-6 py-4 text-right">Jami Suv (m³)</th>
                    <th className="px-6 py-4 text-right">Umumiy Balans</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => {
                      const aggData = getAggregatedData(user);
                      return (
                        <tr 
                          key={user.id} 
                          onClick={() => {
                            setSelectedUserId(user.id);
                            setSearchQuery('');
                          }}
                          className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                        >
                          <td className="px-6 py-4 text-slate-500 font-medium">{user.id}</td>
                          <td className="px-6 py-4 text-slate-300 font-medium group-hover:text-blue-400 transition-colors">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 text-center text-slate-400">
                            {user.meters.length}
                          </td>
                          <td className="px-6 py-4 text-right text-slate-300 tabular-nums font-medium">
                            {aggData.totalWater.toFixed(2)}
                          </td>
                          <td className={`px-6 py-4 text-right tabular-nums font-semibold ${aggData.status === 'Pul kam' ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {aggData.totalBalance.toLocaleString('ru-RU')}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium w-24 ${
                              aggData.status === 'Aktiv' 
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>
                              {aggData.status}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-right">
                            <ChevronRight className="h-5 w-5 text-slate-600 group-hover:text-blue-400 transition-colors inline-block" />
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} className="px-6 py-12 text-center text-slate-500">Mijoz topilmadi</td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              // USER DETAIL VIEW (Meters List)
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-slate-900/50 text-slate-400 uppercase text-xs font-semibold tracking-wider">
                  <tr>
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Hisoblagich raqami</th>
                    <th className="px-6 py-4 text-right">Suv ishlatilgan (m³)</th>
                    <th className="px-6 py-4 text-right">Balans</th>
                    <th className="px-6 py-4 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredMeters.length > 0 ? (
                    filteredMeters.map((meter) => (
                      <tr key={meter.id} className="hover:bg-slate-800/30 transition-colors group">
                        <td className="px-6 py-4 text-slate-500 font-medium">{meter.id}</td>
                        <td className="px-6 py-4 text-slate-300 font-medium group-hover:text-white transition-colors">
                          {meter.meterNumber}
                        </td>
                        <td className="px-6 py-4 text-right text-slate-300 tabular-nums font-medium">
                          {meter.waterUsed.toFixed(2)}
                        </td>
                        <td className={`px-6 py-4 text-right tabular-nums font-semibold ${meter.status === 'Pul kam' ? 'text-rose-400' : 'text-emerald-400'}`}>
                          {meter.balance.toLocaleString('ru-RU')}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium w-24 ${
                            meter.status === 'Aktiv' 
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}>
                            {meter.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-slate-500">Uskuna topilmadi</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
