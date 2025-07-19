import { useState, useEffect } from 'react';
import { CalendarIcon, Clock, Users, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../config/apiClient';

const Reservation = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [time, setTime] = useState('');
  const [people, setPeople] = useState('2');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Available time slots
  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', 
    '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
  ];

  // Form validation
  const isFormValid = () => {
    return date && time && people && name && email && phone;
  };

  // Handle calendar toggle
  const toggleCalendar = () => {
    setCalendarOpen(!calendarOpen);
  };

  // Handle reservation submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid()) {
      toast.error('Por favor, completa todos los campos obligatorios');
      return;
    }

    try {
            await apiClient.post('/reservations', {
        date: date && format(date, 'yyyy-MM-dd'),
        time,
        people: parseInt(people),
        customer: { name, email, phone, notes }, // Incluir notas si es necesario
      });

      setStep(2);
      toast.success('¡Reserva confirmada con éxito!');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Error inesperado');
    }
  };

  // Reset form
  const resetForm = () => {
    setDate(undefined);
    setTime('');
    setPeople('2');
    setName('');
    setEmail('');
    setPhone('');
    setNotes('');
    setStep(1);
  };

  // Autenticación obligatoria y autocompletar datos
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: user } = await apiClient.get('/auth/profile');
        if (user) {
          setName(user.name || '');
          setEmail(user.email || '');
        } else {
          // Si no hay usuario, redirigir
          navigate('/login?redirect=/reservation', { replace: true });
        }
      } catch (error) {
        // Si hay un error (ej. 401), redirigir
        console.error('Error de autenticación:', error);
        navigate('/login?redirect=/reservation', { replace: true });
      } finally {
        setCheckingAuth(false);
      }
    };

    checkAuth();
  }, [navigate]);

  if (checkingAuth) return null;

  // Styles para el selector de días
  const customStyles = {
    caption: { color: '#E11D48' },
    selected: { backgroundColor: '#E11D48' },
  };

  return (
    <div>
      {/* Hero Banner */}
      <section className="relative bg-gray-900 text-white py-16">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{
            backgroundImage: "url('https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
          }}
        ></div>
        <div className="container-custom relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reserva una Mesa</h1>
          <p className="text-xl text-gray-200 max-w-2xl mx-auto">
            Asegura tu lugar en ChickenSystem y disfruta de nuestro delicioso pollo a la brasa
          </p>
        </div>
      </section>

      {/* Reservation Form Section */}
      <section className="section bg-gray-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {step === 1 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-200">
                  <h2 className="text-2xl font-bold mb-2">Reserva tu mesa</h2>
                  <p className="text-gray-600">Completa el formulario para hacer tu reserva</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 md:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Date Selection */}
                    <div className="relative">
                      <label htmlFor="date" className="label">Fecha *</label>
                      <div className="relative">
                        <input
                          type="text"
                          id="date"
                          className="input pl-10"
                          placeholder="Selecciona una fecha"
                          value={date ? format(date, 'dd/MM/yyyy') : ''}
                          onClick={toggleCalendar}
                          readOnly
                          required
                        />
                        <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                      
                      {calendarOpen && (
                        <div className="absolute z-10 mt-1 bg-white rounded-md shadow-lg p-4 border border-gray-200">
                          <DayPicker
                            mode="single"
                            selected={date}
                            onSelect={(selectedDate) => {
                              setDate(selectedDate);
                              setCalendarOpen(false);
                            }}
                            locale={es}
                            disabled={{ before: new Date() }}
                            styles={customStyles}
                          />
                        </div>
                      )}
                    </div>

                    {/* Time Selection */}
                    <div>
                      <label htmlFor="time" className="label">Hora *</label>
                      <div className="relative">
                        <select
                          id="time"
                          className="input pl-10"
                          value={time}
                          onChange={(e) => setTime(e.target.value)}
                          required
                        >
                          <option value="">Selecciona una hora</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>

                    {/* Number of People */}
                    <div>
                      <label htmlFor="people" className="label">Cantidad de personas *</label>
                      <div className="relative">
                        <select
                          id="people"
                          className="input pl-10"
                          value={people}
                          onChange={(e) => setPeople(e.target.value)}
                          required
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                            <option key={num} value={num.toString()}>
                              {num} {num === 1 ? 'persona' : 'personas'}
                            </option>
                          ))}
                          <option value="11+">Más de 10 personas</option>
                        </select>
                        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      </div>
                    </div>

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="label">Nombre completo *</label>
                      <input
                        type="text"
                        id="name"
                        className="input"
                        placeholder="Tu nombre"
                        value={name}
                        readOnly
                        required
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="label">Correo electrónico *</label>
                      <input
                        type="email"
                        id="email"
                        className="input"
                        placeholder="correo@ejemplo.com"
                        value={email}
                        readOnly
                        required
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label htmlFor="phone" className="label">Teléfono *</label>
                      <input
                        type="tel"
                        id="phone"
                        className="input"
                        placeholder="987654321"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                      <p className="text-red-600 text-xs mt-1">
                        Ingrese su teléfono actual para confirmar su reserva
                      </p>
                    </div>

                    {/* Special Requests */}
                    <div className="md:col-span-2">
                      <label htmlFor="notes" className="label">Solicitudes especiales</label>
                      <textarea
                        id="notes"
                        className="input min-h-[100px]"
                        placeholder="Cualquier solicitud especial para tu reserva..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      ></textarea>
                    </div>
                  </div>

                  <div className="mt-8">
                    <button type="submit" className="btn-primary w-full py-3">
                      Confirmar Reserva
                    </button>
                  </div>

                  <p className="mt-4 text-sm text-gray-500 text-center">
                    * Campos obligatorios
                  </p>
                </form>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-8 text-center">
                <div className="flex justify-center mb-6">
                  <div className="bg-green-100 p-4 rounded-full">
                    <CheckCircle size={48} className="text-green-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-4">¡Reserva Confirmada!</h2>
                <p className="text-gray-600 mb-6">
                  Gracias {name}, hemos recibido tu reserva para el {date && format(date, 'dd/MM/yyyy')} a las {time} para {people} {parseInt(people) === 1 ? 'persona' : 'personas'}.
                </p>
                <p className="text-gray-600 mb-8">
                  Hemos enviado un correo de confirmación a {email} con los detalles de tu reserva. También recibirás un recordatorio 24 horas antes de tu reserva.
                </p>
                <div className="bg-gray-50 p-6 rounded-lg mb-6 inline-block">
                  <div className="mb-4 text-left">
                    <p className="text-sm text-gray-500">Fecha y hora</p>
                    <p className="font-medium">{date && format(date, 'dd/MM/yyyy')} - {time}</p>
                  </div>
                  <div className="mb-4 text-left">
                    <p className="text-sm text-gray-500">Número de personas</p>
                    <p className="font-medium">{people} {parseInt(people) === 1 ? 'persona' : 'personas'}</p>
                  </div>
                  <div className="mb-4 text-left">
                    <p className="text-sm text-gray-500">Código de reserva</p>
                    <p className="font-medium">RS{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}</p>
                  </div>
                </div>
                <button
                  onClick={resetForm}
                  className="btn-primary w-full py-3"
                >
                  Hacer otra reserva
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Preguntas Frecuentes</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Todo lo que necesitas saber sobre nuestro sistema de reservas
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">¿Con cuánta anticipación debo reservar?</h3>
                <p className="text-gray-600">
                  Recomendamos reservar con al menos 24 horas de anticipación, especialmente para fines de semana y fechas especiales. Sin embargo, siempre puedes contactarnos para verificar disponibilidad para el mismo día.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">¿Puedo modificar o cancelar mi reserva?</h3>
                <p className="text-gray-600">
                  Sí, puedes modificar o cancelar tu reserva hasta 3 horas antes de la hora programada. Para ello, utiliza el enlace que enviamos en el correo de confirmación o llámanos directamente.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">¿Qué sucede si llego tarde a mi reserva?</h3>
                <p className="text-gray-600">
                  Mantendremos tu reserva por hasta 15 minutos después de la hora programada. Después de ese tiempo, la mesa podría ser asignada a otros clientes. Si sabes que llegarás tarde, por favor avísanos.
                </p>
              </div>
              
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-2">¿Puedo hacer reservas para eventos o grupos grandes?</h3>
                <p className="text-gray-600">
                  ¡Por supuesto! Para grupos de más de 10 personas o eventos especiales, te recomendamos contactarnos directamente por teléfono o correo electrónico para que podamos atender mejor tus necesidades específicas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Reservation;