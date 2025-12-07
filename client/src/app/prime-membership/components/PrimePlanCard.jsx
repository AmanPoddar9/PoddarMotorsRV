import { FaCheck, FaTimes, FaCrown } from 'react-icons/fa';

const PrimePlanCard = ({ plan, onSelect }) => {
  const { name, price, description, features, color, popular } = plan;

  const getGradient = () => {
    switch (name) {
      case 'Prime Gold':
        return 'from-yellow-400 to-yellow-600';
      case 'Prime Platinum':
        return 'from-slate-700 to-slate-900 border-yellow-500/50';
      default:
        return 'from-slate-200 to-slate-400';
    }
  };

  const getTextColor = () => {
    switch (name) {
      case 'Prime Platinum':
        return 'text-white';
      default:
        return 'text-custom-black';
    }
  };

  return (
    <div 
      className={`relative rounded-2xl p-1 ${popular ? 'transform md:-translate-y-4 z-10' : ''} transition-all duration-300 hover:scale-105`}
    >
      {/* Glow Effect for Popular Plan */}
      {popular && (
        <div className="absolute inset-0 bg-yellow-500 blur-lg opacity-20 rounded-2xl"></div>
      )}

      {/* Card Content */}
      <div className={`relative h-full bg-white rounded-xl overflow-hidden shadow-xl flex flex-col ${popular ? 'border-2 border-yellow-400' : ''}`}>
        
        {/* Most Popular Badge */}
        {popular && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-custom-black text-xs font-bold px-3 py-1 rounded-bl-lg z-20">
            MOST POPULAR
          </div>
        )}

        {/* Header */}
        <div className={`p-6 bg-gradient-to-br ${getGradient()}`}>
          <h3 className={`text-2xl font-bold mb-2 ${getTextColor()}`}>{name}</h3>
          <div className={`flex items-baseline gap-1 ${getTextColor()}`}>
            <span className="text-3xl font-bold">₹{price}</span>
            <span className="text-sm opacity-80">/ year</span>
          </div>
          <p className={`mt-2 text-sm opacity-90 ${getTextColor()}`}>{description}</p>
        </div>

        {/* Features */}
        <div className="p-6 flex-grow">
          <ul className="space-y-3">
            {features.map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                <FaCheck className={`mt-1 flex-shrink-0 ${popular ? 'text-yellow-500' : 'text-green-500'}`} />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 mt-auto">
          <button
            onClick={() => onSelect(plan)}
            className={`w-full py-3 rounded-lg font-bold transition-all duration-300 ${
              popular 
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:shadow-lg hover:shadow-yellow-500/30' 
                : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            Select {name.split(' ')[1]}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrimePlanCard;
