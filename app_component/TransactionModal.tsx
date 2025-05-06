import React, { useState } from 'react';
import { XMarkIcon, CheckIcon } from '@heroicons/react/24/outline';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'income' | 'expense';
}

const TransactionModal = ({ isOpen, onClose, type }: TransactionModalProps) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isFutureDate, setIsFutureDate] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    account: 'expense',
    note: ''
  });
  const handleDateChange = (date: string) => {
    const selectedDate = new Date(date);
    const currentDate = new Date();
    const isFuture = selectedDate > currentDate;
    setIsFutureDate(isFuture);
    setFormData({...formData, date});
  };
  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {

      const now = new Date();
      const offset = 330; // IST is UTC+5:30
      const istTime = new Date(now.getTime() + offset * 60 * 1000);
      const timeString = istTime.toISOString().split('T')[1].split('.')[0];

      const response = await fetch('/api/add-transaction', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: type,
          amount: Number(formData.amount),
          account: formData.account,
          dateOfTransaction: `${formData.date}T${timeString}.000Z`,
          note: formData.note
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      // Show success animation
      setIsSuccess(true);
      
      // Reset and close after animation
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setFormData({
          amount: '',
          date: new Date().toISOString().split('T')[0],
          account: 'expense',  // Changed from 'savings' to 'expense'
          note: ''
        });
        // Trigger refresh
        window.dispatchEvent(new Event('transactionAdded'));
      }, 1500);
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Failed to add transaction. Please try again.');
    }
  };

  if (isSuccess) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#111111] rounded-xl w-full max-w-md p-6 shadow-xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mb-4 animate-[scale_0.3s_ease-in-out]">
            <CheckIcon className="w-8 h-8 text-green-500 animate-[bounce_0.5s_ease-in-out]" />
          </div>
          <h3 className="text-xl font-medium text-white animate-[fadeIn_0.5s_ease-in-out]">
            Successfully Added!
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-[#111111] rounded-xl w-full max-w-md p-6 shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold">Add {type}</h2>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              type === 'expense' 
                ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                : 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            }`}>
              {type}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Amount (₹)
            </label>
            <input
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({...formData, amount: e.target.value})}
              className="w-full bg-[#222222] border border-[#333333] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full bg-[#222222] border border-[#333333] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {isFutureDate && (
              <p className="text-xs text-red-500 mt-1">Future dates are not allowed</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Account
            </label>
            <select 
              value={formData.account}
              onChange={(e) => setFormData({...formData, account: e.target.value})}
              className="w-full bg-[#222222] border border-[#333333] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
            
              <option value="expense">Expense Account</option>
              <option value="savings">Savings Account</option>
              <option value="cash">Cash Account</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Note
            </label>
            <textarea
              value={formData.note}
              onChange={(e) => setFormData({...formData, note: e.target.value})}
              className="w-full bg-[#222222] border border-[#333333] rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              placeholder="Add any additional notes..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isFutureDate}
              className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
                type === 'expense'
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              } ${
                isFutureDate ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Add {type}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 rounded-lg font-medium bg-[#222222] hover:bg-[#333333] text-white transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionModal;