import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/config/apiConfig';
import { ArrowRight, Clock, MapPin, Star, PhoneCall } from 'lucide-react';
import { StyledLink as Link } from '../../components/ui/Link';
import FeatureCard from '../../components/ui/FeatureCard';
import TestimonialCard from '../../components/ui/TestimonialCard';
import MapSection from '../../components/sections/MapSection';

// Define the Product interface, same as in Menu.tsx
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
}

interface Testimonial {
  id: number;
  name: string;
  location: string;
  rating: number;
  comment: string;
  image_url: string | null;
}

const Homepage = () => {
  const [combos, setCombos] = useState<Product[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [combosRes, testimonialsRes] = await Promise.all([
          fetch(`${API_BASE_URL}/products`),
          fetch(`${API_BASE_URL}/testimonials`)
        ]);

        // Process combos
        if (combosRes.ok) {
          const combosData = await combosRes.json();
          if (combosData.ok) {
            const comboProducts = combosData.products
              .filter((p: any) => p.category && p.category.toLowerCase() === 'combos')
              .slice(0, 3);
            setCombos(comboProducts);
          }
        } else {
           console.error('Error fetching combos');
        }

        // Process testimonials
        if (testimonialsRes.ok) {
          const testimonialsData = await testimonialsRes.json();
          if (testimonialsData.ok) {
            setTestimonials(testimonialsData.testimonials);
          }
        } else {
          console.error('Error fetching testimonials');
        }

      } catch (error) {
        console.error('Error fetching page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/6210876/pexels-photo-6210876.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          }}
        ></div>
        <div className="container-custom relative z-10 py-20 md:py-28 lg:py-36">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              El mejor pollo a la brasa de Cusco
            </h1>
            <p className="text-xl mb-8 text-gray-200">
              Disfruta del auténtico sabor peruano en cada bocado. Nuestra receta tradicional y nuestros ingredientes frescos nos distinguen.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu" className="btn-primary py-3 px-6 text-lg">
                Ver menú
              </Link>
              <Link href="/reservation" className="btn-outline border-white text-white hover:bg-white/10 py-3 px-6 text-lg">
                Reservar mesa
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestros Combos Especiales</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Descubre nuestras promociones y combos más populares, diseñados para disfrutar en familia o con amigos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[200px]">
            {loading ? (
              <div className="col-span-3 flex items-center justify-center">
                <p className="text-gray-500">Cargando combos especiales...</p>
              </div>
            ) : combos.length > 0 ? (
              combos.map((combo) => (
                <div key={combo.id} className="card group">
                  <div className="h-56 overflow-hidden relative">
                    <img 
                      src={combo.image}
                      alt={combo.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {combo.popular && (
                      <div className="absolute top-2 right-2 bg-primary-600 text-white text-sm font-bold px-3 py-1 rounded">
                        Más vendido
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{combo.name}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{combo.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg font-bold text-primary-600">S/. {combo.price.toFixed(2)}</span>
                      <Link href={`/menu`} className="text-sm font-medium text-primary-600 flex items-center hover:text-primary-700">
                        Ordenar ahora <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center">
                <p className="text-gray-500">No hay combos especiales disponibles en este momento.</p>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link href="/menu" className="btn-primary">
              Ver menú completo
            </Link>
          </div>
        </div>
      </section>

      {/* About/Info Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Tradición y Sabor en Cada Plato</h2>
              <p className="text-gray-600 mb-6">
                Desde 2010, ChickenSystem ha servido el auténtico pollo a la brasa peruano en Cusco. Nuestro secreto es la combinación perfecta de especias tradicionales y técnicas de cocción que preservan el sabor y la jugosidad de nuestro pollo.
              </p>
              <p className="text-gray-600 mb-6">
                Cada pollo es marinado por 24 horas en nuestra mezcla especial de ingredientes y luego asado lentamente en nuestros hornos tradicionales para lograr ese sabor inconfundible que nos caracteriza.
              </p>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center">
                  <Clock className="text-primary-600 mr-2" size={24} />
                  <span className="font-medium">Más de 13 años de experiencia</span>
                </div>
                <div className="flex items-center">
                  <Star className="text-secondary-500 mr-2" size={24} />
                  <span className="font-medium">Calificación 4.8/5 en reseñas</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="text-accent-600 mr-2" size={24} />
                  <span className="font-medium">Ubicados en el centro de Cusco</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/5718071/pexels-photo-5718071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" 
                alt="Preparación de pollo a la brasa" 
                className="rounded-lg shadow-lg w-full h-auto object-cover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg md:max-w-xs">
                <div className="flex items-center">
                  <div className="bg-primary-100 p-3 rounded-full mr-4">
                    <PhoneCall className="text-primary-600" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Llámanos para delivery</p>
                    <p className="text-lg font-bold">+51 984 123 456</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">¿Por qué elegirnos?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              En ChickenSystem nos esforzamos por brindarte la mejor experiencia culinaria con estos beneficios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon="utensils" 
              title="Ingredientes Frescos" 
              description="Utilizamos solo ingredientes frescos y de la más alta calidad para preparar nuestros platillos."
            />
            <FeatureCard 
              icon="truck" 
              title="Delivery Rápido" 
              description="Servicio de delivery rápido y seguro para que disfrutes de nuestro pollo en la comodidad de tu hogar."
            />
            <FeatureCard 
              icon="users" 
              title="Atención Personalizada" 
              description="Nuestro personal está comprometido en brindarte un servicio amable y atento."
            />
            <FeatureCard 
              icon="leaf" 
              title="Opciones Saludables" 
              description="Ofrecemos variedad de ensaladas y opciones más ligeras para complementar tu comida."
            />
            <FeatureCard 
              icon="credit-card" 
              title="Múltiples Formas de Pago" 
              description="Aceptamos efectivo, tarjetas, y métodos de pago móvil como Yape y Plin."
            />
            <FeatureCard 
              icon="award" 
              title="Sabor Premiado" 
              description="Nuestro pollo a la brasa ha sido reconocido como uno de los mejores de Cusco."
            />
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Conoce las experiencias de quienes han disfrutado de nuestro pollo a la brasa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[150px]">
            {loading ? (
              <div className="col-span-3 flex items-center justify-center">
                <p className="text-gray-500">Cargando testimonios...</p>
              </div>
            ) : testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.name}
                  location={testimonial.location}
                  rating={testimonial.rating}
                  image={testimonial.image_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=random`}
                  text={testimonial.comment}
                />
              ))
            ) : (
              <div className="col-span-3 flex items-center justify-center">
                <p className="text-gray-500">Aún no hay testimonios. ¡Sé el primero en dejar uno!</p>
              </div>
            )}
          </div>

          <div className="text-center mt-10">
            <Link href="/reservation" className="btn-primary">
              Haz tu reserva ahora
            </Link>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <MapSection />
    </div>
  );
};

export default Homepage;