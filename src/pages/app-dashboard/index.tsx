import React, { useState } from 'react'
import AppList from './app-list'
import AppDashboardHome from './app-dashboard-home'

const AppDashboard = () => {
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  return (
    <div>  
    {
      selectedRow ? <AppDashboardHome/> :<AppList selectedRow={selectedRow} setSelectedRow={setSelectedRow}/> 
    }
    </div>
  )
}

export default AppDashboard
