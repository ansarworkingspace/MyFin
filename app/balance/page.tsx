'use client'
import React, { useState, useEffect } from 'react'

interface Account {
  name: string;
  balance: number;
  trend: string;
  accountName: string;
}

interface BalanceData {
  account: string;
  currentBal: number;
  lastUpdate: string;
}


interface Account {
  name: string;
  balance: number;
  trend: string;
  accountName: string;
}

interface BalanceData {
  account: string;
  currentBal: number;
  lastUpdate: string;
}

const BalancePage = () => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editBalance, setEditBalance] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBalance, setShowBalance] = useState(false);

  useEffect(() => {
    fetchBalances();
  }, []);

  const fetchBalances = async () => {
    try {
      const response = await fetch('/api/fetch-balance');
      const data = await response.json();

      if (data.success) {
        const formattedAccounts = data.data.balances.map((balance: BalanceData) => ({
          name: `${balance.account === 'savings' ? 'SBI' : 
                 balance.account === 'expense' ? 'FIDB' : 
                 balance.account === 'cash' ? 'CASH' : 
                 balance.account.charAt(0).toUpperCase() + balance.account.slice(1)} Account`,
          balance: balance.currentBal,
          trend: '+0%',
          accountName: balance.account
        }));
        setAccounts(formattedAccounts);
      }
    } catch (error) {
      console.error('Error fetching balances:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (account: Account) => {
    setSelectedAccount(account);
    setEditBalance(account.balance.toString());
  };

  const handleClose = () => {
    setSelectedAccount(null);
    setEditBalance('');
  };

  const handleUpdateBalance = async () => {
    if (!selectedAccount) return;

    try {
      const response = await fetch('/api/update-balance', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          account: selectedAccount.accountName.toLowerCase(),
          currentBal: Number(editBalance)
        })
      });

      const data = await response.json();

      if (data.success) {
        fetchBalances(); // Refresh balances after update
        handleClose();
      }
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-400">Loading balances...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Account Balance</h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="px-2 py-1 text-xs font-medium bg-[#222222] text-gray-400 rounded-full hover:bg-[#333333] transition-colors"
          >
            {showBalance ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            )}
          </button>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full hover:bg-blue-900/50 transition-colors"
          >
            Home
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map((account, index) => (
          <div 
            key={index}
            className="bg-[#111111] rounded-xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{account.name}</h2>
              <button 
                onClick={() => handleEditClick(account)}
                className="px-2 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-900/50 transition-colors"
              >
                Edit
              </button>
            </div>

            <div className="space-y-2">
              <p className="text-3xl font-bold">
                {showBalance ? `₹${account.balance.toLocaleString()}` : '••••••'}
              </p>
              <p className="text-sm text-gray-400">Total transactions balance</p>
            </div>

            <div className="pt-4 border-t border-[#222222] flex justify-center">
              <span className="px-3 py-1 text-sm font-medium bg-[#222222] text-blue-400 rounded-full border border-[#333333]">
                {account.accountName === 'savings' ? 'SAVINGS' : 
                 account.accountName === 'expense' ? 'EXPENSE' : 
                 account.accountName === 'cash' ? 'CASH' : account.accountName}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Balance Popup */}
      {selectedAccount && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#111111] rounded-xl p-6 shadow-2xl w-80 border border-[#333333]">
            <div className="flex justify-between items-center mb-6">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold">Edit Balance</h3>
                <p className="text-xs text-gray-400">{selectedAccount.name}</p>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">Current Balance</label>
                <input
                  type="number"
                  value={editBalance}
                  onChange={(e) => setEditBalance(e.target.value)}
                  className="w-full bg-[#222222] border border-[#333333] rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter new balance"
                />
              </div>

              <div className="pt-4 border-t border-[#333333] flex justify-end">
                <button
                  onClick={handleUpdateBalance}
                  className="px-4 py-2 text-sm font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Update Balance
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BalancePage