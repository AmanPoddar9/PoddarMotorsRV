import { FaCalendarDay, FaCalendarWeek, FaCalendarAlt, FaExclamationTriangle } from 'react-icons/fa'

export default function DashboardStats({ stats, loading }) {
  const cards = [
    {
      title: 'Expiring Today',
      value: stats.expiringToday,
      icon: <FaCalendarDay className="text-red-500 text-2xl" />,
      bg: 'bg-red-500/10',
      border: 'border-red-500/20',
      text: 'text-red-500'
    },
    {
      title: 'Expiring This Week',
      value: stats.expiringWeek,
      icon: <FaCalendarWeek className="text-orange-500 text-2xl" />,
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      text: 'text-orange-500'
    },
    {
      title: 'Expiring This Month',
      value: stats.expiringMonth,
      icon: <FaCalendarAlt className="text-yellow-500 text-2xl" />,
      bg: 'bg-yellow-500/10',
      border: 'border-yellow-500/20',
      text: 'text-yellow-500'
    },
    {
      title: 'Already Expired',
      value: stats.expired,
      icon: <FaExclamationTriangle className="text-gray-400 text-2xl" />,
      bg: 'bg-gray-800',
      border: 'border-gray-700',
      text: 'text-gray-400'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`${card.bg} border ${card.border} p-6 rounded-xl`}>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-gray-400 text-sm font-medium">{card.title}</p>
              {loading ? (
                <div className="h-8 w-16 bg-gray-700 animate-pulse rounded mt-2"></div>
              ) : (
                <h3 className={`text-3xl font-bold mt-2 ${card.text}`}>{card.value}</h3>
              )}
            </div>
            <div className="p-3 bg-black/20 rounded-lg">
              {card.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
