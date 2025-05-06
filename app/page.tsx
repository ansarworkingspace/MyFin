'use client'

import React, { useEffect, useState } from 'react'
import Calendar from '@/app_component/Calender'
import { PlusIcon } from '@heroicons/react/24/outline'
import TransactionModal from '@/app_component/TransactionModal'
import { useRouter } from 'next/navigation'
import Cookies from 'js-cookie'
export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactionType, setTransactionType] = useState<'income' | 'expense'>('income');
  const [todaySummary, setTodaySummary] = useState<{ income: number, expense: number }>({ income: 0, expense: 0 });
  const [selectedAccount, setSelectedAccount] = useState<string>('expense'); // 
  const handleOpenModal = (type: 'income' | 'expense') => {
    setTransactionType(type);
    setIsModalOpen(true);
  };
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">FinTracker</h1>
          <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">Beta</span>
        </div>
        <div className="flex gap-2 ">
        <button 
            onClick={() => router.push('/balance')}
            className="cursor-pointer inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50 transition-colors"
          >
            Balance
          </button>
          <button 
            onClick={() => {
              Cookies.remove('isAuthenticated');
              router.push('/login');
            }}
            className="cursor-pointer inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 transition-colors"
          >
            Logout
          </button>
          <button 
            onClick={() => handleOpenModal('income')}
            className="cursor-pointer inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50 transition-colors"
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Income
          </button>
          <button 
            onClick={() => handleOpenModal('expense')}
             className="cursor-pointer inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50 transition-colors"
         
          >
            <PlusIcon className="w-4 h-4 mr-1" />
            Expense
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1">
        <div className="bg-[#111111] rounded-xl p-6">
        <Calendar selectedAccount={selectedAccount} onAccountChange={setSelectedAccount} />
        </div>
      </div>
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
        }}
        type={transactionType}
        
      />
    </div>
  )
}