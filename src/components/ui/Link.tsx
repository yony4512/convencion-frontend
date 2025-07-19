import { ReactNode } from 'react';

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: '_blank' | '_self' | '_parent' | '_top';
  onClick?: () => void;
}

export const StyledLink = ({ href, children, className = '', target, onClick }: LinkProps) => {
  return (
    <a 
      href={href} 
      className={`transition-colors duration-200 ${className}`}
      target={target}
      onClick={onClick}
      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
    >
      {children}
    </a>
  );
};

// Alias export so components can import { Link }
export const Link = StyledLink;