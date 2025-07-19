import { ChefHat } from 'lucide-react';
import { StyledLink as Link } from './Link';

interface LogoProps {
  variant?: 'default' | 'white';
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ variant = 'default', size = 'md' }: LogoProps) => {
  const textColor = variant === 'white' ? 'text-white' : 'text-gray-900';
  const iconColor = variant === 'white' ? 'text-white' : 'text-primary-600';
  
  const sizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl'
  };
  
  const iconSize = {
    sm: 20,
    md: 24,
    lg: 28
  };

  return (
    <Link href="/" className="flex items-center">
      <span className={`mr-2 ${iconColor}`}>
        <ChefHat size={iconSize[size]} strokeWidth={2} />
      </span>
      <span className={`font-heading font-bold ${textColor} ${sizeClasses[size]}`}>
        Chicken<span className="text-primary-600">System</span>
      </span>
    </Link>
  );
};

export default Logo;