import { ReactNode } from 'react';
import { Utensils, Truck, Users, Leaf, CreditCard, Award, DivideIcon as LucideIcon } from 'lucide-react';

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  // Map string icon names to Lucide components
  const getIcon = (): ReactNode => {
    const iconMap: Record<string, ReactNode> = {
      'utensils': <Utensils size={24} />,
      'truck': <Truck size={24} />,
      'users': <Users size={24} />,
      'leaf': <Leaf size={24} />,
      'credit-card': <CreditCard size={24} />,
      'award': <Award size={24} />
    };

    return iconMap[icon] || <Utensils size={24} />;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="inline-flex items-center justify-center p-3 bg-primary-50 rounded-full text-primary-600 mb-4">
        {getIcon()}
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default FeatureCard;