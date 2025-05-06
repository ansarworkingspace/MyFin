import React, { useState, useEffect } from 'react';

interface TransactionDetails {
  amount: number;
  account: string;
  timestamp: string;
  note: string; 
}

interface DateDetails {
  date: number;
  createdDate: number;
  transactions: {
    expense: TransactionDetails | null;
    income: TransactionDetails | null;
    note: TransactionDetails | null; 
  };
}
interface CalendarProps {
    selectedAccount: string;
    onAccountChange: (account: string) => void;
  }
  
  const Calendar = ({ selectedAccount, onAccountChange }: CalendarProps) => {
  const [selectedDate, setSelectedDate] = useState<DateDetails | null>(null);
//   const [selectedAccount, setSelectedAccount] = useState<string>('expense');
  const [displayDate, setDisplayDate] = useState(new Date());
  const [transactionsData, setTransactionsData] = useState<{[key: number]: DateDetails}>({});
  const currentDate = new Date();

  // Add these variable declarations
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const firstDayOfMonth = new Date(displayDate.getFullYear(), displayDate.getMonth(), 1);
  const daysInMonth = Array.from(
    { length: new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 0).getDate() },
    (_, i) => i + 1
  );

  useEffect(() => {
    const handleTransactionAdded = () => {
      fetchTransactions();
    };

    window.addEventListener('transactionAdded', handleTransactionAdded);
    
    return () => {
      window.removeEventListener('transactionAdded', handleTransactionAdded);
    };
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [displayDate, selectedAccount]);

  const fetchTransactions = async () => {
    try {
      const month = displayDate.getMonth() + 1;
      const year = displayDate.getFullYear();
      const response = await fetch(`/api/fetch-data?month=${month}&year=${year}&account=${selectedAccount}`);
      
      if (response.status === 404) {
        setTransactionsData({});
        return;
      }
      
      const data = await response.json();
      
      if (!data.success) {
        setTransactionsData({});
        return;
      }
      
      const formattedData = data.data.transactions.reduce((acc: any, transaction: any) => {
        // Get the date in UTC without timezone conversion
        const date = new Date(transaction.dateOfTransaction);
        const utcDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
        const day = utcDate.getUTCDate();
        
        // Initialize the day entry if it doesn't exist
        if (!acc[day]) {
          acc[day] = {
            date: day,
            createdDate: new Date(transaction.createdDate).toLocaleDateString('en-IN'),
            transactions: {
              expense: null,
              income: null
            }
          };
        }
        
        // Update the transaction based on category
        if (transaction.category === 'expense') {
          acc[day].transactions.expense = {
            amount: transaction.amount,
            account: transaction.account,
            timestamp: transaction.dateOfTransaction,
            note: transaction.note
          };
        } else if (transaction.category === 'income') {
          acc[day].transactions.income = {
            amount: transaction.amount,
            account: transaction.account,
            timestamp: transaction.dateOfTransaction,
            note: transaction.note
          };
        }
        
        return acc;
      }, {});
      
      setTransactionsData(formattedData);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactionsData({});
    }
  };

  const handleDateClick = (day: number) => {
    setSelectedDate(transactionsData[day] || {
      date: day,
      transactions: {
        expense: null,
        income: null
      }
    });
  };

  const handlePrevMonth = () => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth() - 1, 1);
    const currentYear = currentDate.getFullYear();
    // Only allow navigation within current year
    if (newDate.getFullYear() === currentYear) {
      setDisplayDate(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(displayDate.getFullYear(), displayDate.getMonth() + 1, 1);
    const currentYear = currentDate.getFullYear();
    // Only allow navigation within current year and prevent future months
    if (newDate.getFullYear() === currentYear && newDate <= currentDate) {
      setDisplayDate(newDate);
    }
  };

  // Update isDateDisabled to consider current year
  const isDateDisabled = (day: number): boolean => {
    const checkDate = new Date(displayDate.getFullYear(), displayDate.getMonth(), day);
    return checkDate > currentDate;
  };

  return (
    <div className="w-full relative">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">
            {displayDate.toLocaleString('default', { month: 'long' })} {displayDate.getFullYear()}
          </h2>
          <select
        value={selectedAccount}
        onChange={(e) => onAccountChange(e.target.value)}
        className="bg-[#222222] border border-[#333333] rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="all">All Accounts</option>
      
        <option value="expense">Expense Account</option>
        <option value="savings">Savings Account</option>
        <option value="cash">Cash Account</option>
      </select>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={handlePrevMonth}
            className="p-2 bg-[#222222] rounded-lg hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={displayDate.getMonth() === 0}
          >
            ←
          </button>
          <button 
            onClick={handleNextMonth}
            className="p-2 bg-[#222222] rounded-lg hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              displayDate.getMonth() === currentDate.getMonth() && 
              displayDate.getFullYear() === currentDate.getFullYear()
            }
          >
            →
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-2">
        {days.map((day:any) => (
          <div key={day} className="text-center text-gray-400 font-medium py-2">
            {day}
          </div>
        ))}
        
        {Array(firstDayOfMonth.getDay())
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="p-4" />
          ))}
        
        {daysInMonth.map((day) => (
          <div
            key={day}
            onClick={() => !isDateDisabled(day) && handleDateClick(day)}
            className={`p-3 rounded-lg transition-colors ${
              isDateDisabled(day) 
                ? 'opacity-50 cursor-not-allowed bg-[#1a1a1a]' 
                : 'hover:bg-[#222222] cursor-pointer ' +
                  (day === currentDate.getDate() && 
                   displayDate.getMonth() === currentDate.getMonth() && 
                   displayDate.getFullYear() === currentDate.getFullYear() 
                    ? 'bg-blue-900/50' 
                    : 'bg-[#1a1a1a]')
            }`}
          >
            <div className="text-center mb-2 font-medium">{day}</div>
            <div className="text-xs space-y-1">
              <div className="text-gray-400">Expense</div>
              <div className="text-blue-500">
                ₹{transactionsData[day]?.transactions.expense?.amount || 0}
              </div>
              <div className="text-gray-400 mt-1">Income</div>
              <div className="text-green-500">
                ₹{transactionsData[day]?.transactions.income?.amount || 0}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Date Details Popup */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111111] rounded-xl p-6 shadow-2xl w-80 border border-[#333333]">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">
                  {currentDate.toLocaleString('default', { month: 'long' })} {selectedDate.date}
                </h3>
                <p className="text-xs text-gray-400">Added on {selectedDate.createdDate}</p>
              </div>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
            {selectedDate.transactions.expense && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-medium bg-red-900/30 text-red-400 rounded-full">
                      Expense
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#222222] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-red-500 font-medium">
                        ₹{selectedDate.transactions.expense.amount}
                      </div>
                      <div className="text-xs px-2 py-0.5 bg-[#333333] rounded-full text-gray-400">
                        {selectedDate.transactions.expense.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      disabled={true}
                      value={selectedDate?.transactions.expense?.note || selectedDate?.transactions.income?.note || ''}
                      placeholder="Expense note"
                      className="w-full bg-[#222222] border border-[#333333] rounded-lg px-3 py-1.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}
              {selectedDate.transactions.income && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-900/30 text-blue-400 rounded-full">
                      Income
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#222222] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-green-500 font-medium">
                        ₹{selectedDate.transactions.income.amount}
                      </div>
                      <div className="text-xs px-2 py-0.5 bg-[#333333] rounded-full text-gray-400">
                        {selectedDate.transactions.income.timestamp}
                      </div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <input
                      type="text"
                      disabled={true}
                      placeholder="Income note"
                      value={selectedDate?.transactions.income?.note || selectedDate?.transactions.expense?.note || ''}
                      className="w-full bg-[#222222] border border-[#333333] rounded-lg px-3 py-1.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              )}

             

              <div className="mt-4 pt-4 border-t border-[#333333]">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">Account</span>
                  <span className="px-2 py-1 text-xs font-medium bg-[#222222] text-blue-400 rounded-full border border-[#333333]">
                    Expense Account
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;