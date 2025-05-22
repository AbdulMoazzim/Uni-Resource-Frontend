import { Calendar, Menu, UserCog, X } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar({condition}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <nav className="bg-white border-b border-gray-100">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between h-16">
        <div className="flex items-center">
          <Link to="/"><span className="font-bold text-xl text-blue-600">EduSchedule</span></Link>
        </div>
        <div className="flex items-center">
          <div className="hidden md:ml-10 lg:flex md:space-x-8">
            <a href="#features" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Features</a>
            <a href="#" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">How It Works</a>
          </div>
        </div>
        {
          condition ? ""
          :
        <div className="hidden lg:flex items-center">
          <Link to="/login" className="text-gray-500 hover:text-blue-600 px-3 py-2 text-sm font-medium">Log in</Link>
          <Link to="/register" className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Register Your Institution</Link>
        </div> 
        }
        <div className="flex items-center lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
    
    {/* Mobile menu */}
      <div className={`absolute transition linear duration-700 ${mobileMenuOpen ? "translate-y-[0px]" : "translate-y-[-500px]"} border-t border-gray-100 bg-white w-full z-10>`}>
        <div className="flex items-start justify-between px-4 py-3">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#features" className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50">Features</a>
            <a href="#" className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50">How It Works</a>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          ><X /></button>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-100">
          <div className="px-2 space-y-1">
          <Link to="/login" className="block px-3 py-2 text-base font-medium text-gray-500 hover:bg-gray-50">Log in</Link>
            <Link to="/register" className="ml-4 px-4 py-2 rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Register Your Institution</Link>
          </div>
        </div>
      </div>
  </nav>
  )
}
