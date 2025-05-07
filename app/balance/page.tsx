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

const BalancePage = () => {
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editBalance, setEditBalance] = useState<string>('');
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);

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
        <button 
          onClick={() => window.location.href = '/'}
          className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full hover:bg-blue-900/50 transition-colors"
        >
          Home
        </button>
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
              <p className="text-3xl font-bold">₹{account.balance.toLocaleString()}</p>
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