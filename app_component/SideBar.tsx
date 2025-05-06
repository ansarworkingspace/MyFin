import React from 'react'
import Link from 'next/link'
import { 
  HomeIcon, 
  BanknotesIcon, 
  CreditCardIcon, 
  ChartBarIcon, 
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline'

const SideBar = () => {
  const menuItems = [

    { title: 'Home', href: '/', icon: HomeIcon  },
    { title: 'Balance', href: '/balance', icon: ChartBarIcon },
    { title: 'Logout', href: '/logout', icon: ArrowRightOnRectangleIcon },
  ]

  return (
    <div className="w-64 bg-[#111111] h-screen p-4 flex flex-col">
      <h1 className="text-xl font-bold mb-8 text-white px-2">MyFin Tracker</h1>
      <nav className="flex-1">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href}
                className="flex items-center px-2 py-2 rounded-md hover:bg-[#222222] transition-colors text-gray-300 hover:text-white group"
              >
                <item.icon className="w-5 h-5 mr-3 group-hover:text-white" />
                <span className="text-sm font-medium">{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}

export default SideBar