import { MapPin, Clock, Phone } from 'lucide-react';
import { StyledLink as Link } from '../ui/Link';

const MapSection = () => {
  return (
    <section className="bg-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        {/* Map */}
        <div className="h-[400px] lg:h-[500px]">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3879.056583800276!2d-71.98121492494188!3d-13.520608190499123!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x916dd6739cd7f175%3A0x27c9a5138ce193ab!2sAvenida%20El%20Sol%2C%20Cusco%2C%20Peru!5e0!3m2!1sen!2sus!4v1710067892023!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de ChickenSystem"
            aria-label="Mapa de ubicación de ChickenSystem"
          ></iframe>
        </div>
        
        {/* Info */}
        <div className="flex items-center bg-gray-900 text-white">
          <div className="p-8 md:p-12 lg:p-16">
            <h2 className="text-3xl font-bold mb-6">Visítanos</h2>
            <p className="text-gray-300 mb-8">
              Estamos ubicados en el corazón de Cusco, a pocos minutos de la Plaza de Armas. Te esperamos para brindarte una experiencia gastronómica inolvidable.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin size={24} className="text-primary-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Dirección</h3>
                  <p className="text-gray-300">Av. El Sol 123, Cusco, Perú</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock size={24} className="text-primary-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Horario</h3>
                  <p className="text-gray-300">Lun - Jue: 11:00 - 22:00</p>
                  <p className="text-gray-300">Vie - Sáb: 11:00 - 23:00</p>
                  <p className="text-gray-300">Dom: 12:00 - 22:00</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone size={24} className="text-primary-400 mr-3 mt-1" />
                <div>
                  <h3 className="font-semibold mb-1">Contáctanos</h3>
                  <p className="text-gray-300">+51 984 123 456</p>
                  <p className="text-gray-300">info@chickensystem.com</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <Link href="/reservation" className="btn-primary">
                Reserva una mesa
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;