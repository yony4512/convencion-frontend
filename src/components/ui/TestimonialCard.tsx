import { Star } from 'lucide-react';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  image: string;
  text: string;
}

const TestimonialCard = ({ name, location, rating, image, text }: TestimonialCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
      <div className="flex items-center mb-4">
        <img 
          src={image || '/assets/default-avatar.png'} 
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h3 className="font-semibold">{name}</h3>
          <p className="text-sm text-gray-600">{location}</p>
        </div>
      </div>
      
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            size={16} 
            className={`${i < rating ? 'text-secondary-500 fill-secondary-500' : 'text-gray-300'} mr-1`}
          />
        ))}
      </div>
      
      <p className="text-gray-700 italic">"{text}"</p>
    </div>
  );
};

export default TestimonialCard;