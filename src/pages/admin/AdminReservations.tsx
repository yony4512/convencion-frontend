import { useState } from 'react';
import { 
  ChevronRight, 
  Eye, 
  Check, 
  X,
  Clock,
  Calendar,
  Users,
  Ban
} from 'lucide-react';
import { Link } from '../../components/ui/Link';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from 'sonner';

// Sample reservations data
const reservationsData = [
  {
    id: "RSV456",
    customer: {
      name: "Carlos Martínez",
      email: "carlos@example.com",
      phone: "+51 984 567 890"
    },
    date: "18 de Junio, 2023",
    time: "19:00",
    people: 4,
    status: "Confirmada",
    notes: "Mesa cerca a la ventana"
  },
  {
    id: "RSV455",
    customer: {
      name: "Lucía Mendoza",
      email: "lucia@example.com",
      phone: "+51 984 123 456"
    },
    date: "18 de Junio, 2023",
    time: "20:30",
    people: 2,
    status: "Confirmada",
    notes: ""
  },
  {
    id: "RSV454",
    customer: {
      name: "Jorge Ríos",
      email: "jorge@example.com",
      phone: "+51 984 789 012"
    },
    date: "17 de Junio, 2023",
    time: "13:00",
    people: 6,
    status: "Completada",
    notes: "Celebración de cumpleaños"
  },
  {
    id: "RSV453",
    customer: {
      name: "Ana Torres",
      email: "ana@example.com",
      phone: "+51 984 345 678"
    },
    date: "16 de Junio, 2023",
    time: "18:30",
    people: 3,
    status: "Cancelada",
    notes: ""
  }
];

const AdminReservations = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<string | null>(null);
  const [reservations, setReservations] = useState(reservationsData);

  // Update reservation status
  const updateReservationStatus = (reservationId: string, newStatus: string) => {
    setReservations(prevReservations =>
      prevReservations.map(reservation =>
        reservation.id === reservationId
          ? { ...reservation, status: newStatus }
          : reservation
      )
    );
    toast.success(`Reserva ${reservationId} actualizada a ${newStatus}`);
  };

  // Get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return <Clock className="text-yellow-500\" size={20} />;
      case 'Confirmada':
        return <Check className="text-blue-500" size={20} />;
      case 'Completada':
        return <Check className="text-green-500" size={20} />;
      case 'Cancelada':
        return <Ban className="text-red-500" size={20} />;
      default:
        return null;
    }
  };

  // Get status class
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'Confirmada':
        return 'bg-blue-100 text-blue-800';
      case 'Completada':
        return 'bg-green-100 text-green-800';
      case 'Cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar for larger screens */}
          <AdminSidebar activePage="reservations" className="hidden md:block" />

          {/* Mobile menu button */}
          <div className="md:hidden w-full">
            <button
              type="button"
              className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="font-medium">Menú de Administrador</span>
              <ChevronRight className={`transform transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`} />
            </button>
            
            {mobileMenuOpen && (
              <div className="mt-2 bg-white rounded-lg shadow-sm overflow-hidden">
                <AdminSidebar activePage="reservations" className="block" />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h1 className="text-2xl font-bold mb-2">Gestión de Reservas</h1>
              <p className="text-gray-600">Administra y actualiza el estado de las reservas</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reserva
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cliente
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha y Hora
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Personas
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {reservations.map((reservation) => (
                      <>
                        <tr key={reservation.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{reservation.id}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{reservation.customer.name}</div>
                            <div className="text-sm text-gray-500">{reservation.customer.phone}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{reservation.date}</div>
                            <div className="text-sm text-gray-500">{reservation.time}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{reservation.people}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(reservation.status)}`}>
                              <span className="flex items-center">
                                {getStatusIcon(reservation.status)}
                                <span className="ml-1">{reservation.status}</span>
                              </span>
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => setSelectedReservation(selectedReservation === reservation.id ? null : reservation.id)}
                              className="text-primary-600 hover:text-primary-900 flex items-center justify-end"
                            >
                              <Eye size={16} className="mr-1" />
                              Detalles
                            </button>
                          </td>
                        </tr>
                        {selectedReservation === reservation.id && (
                          <tr>
                            <td colSpan={6} className="px-6 py-4 bg-gray-50">
                              <div className="text-sm">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Información del Cliente</h4>
                                    <dl className="space-y-1">
                                      <div>
                                        <dt className="text-gray-500">Nombre:</dt>
                                        <dd>{reservation.customer.name}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-gray-500">Email:</dt>
                                        <dd>{reservation.customer.email}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-gray-500">Teléfono:</dt>
                                        <dd>{reservation.customer.phone}</dd>
                                      </div>
                                    </dl>
                                  </div>
                                  
                                  <div>
                                    <h4 className="font-medium mb-2">Estado de la Reserva</h4>
                                    <div className="space-x-2">
                                      <button
                                        onClick={() => updateReservationStatus(reservation.id, 'Pendiente')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          reservation.status === 'Pendiente'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-yellow-50'
                                        }`}
                                      >
                                        Pendiente
                                      </button>
                                      <button
                                        onClick={() => updateReservationStatus(reservation.id, 'Confirmada')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          reservation.status === 'Confirmada'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-blue-50'
                                        }`}
                                      >
                                        Confirmada
                                      </button>
                                      <button
                                        onClick={() => updateReservationStatus(reservation.id, 'Completada')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          reservation.status === 'Completada'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-green-50'
                                        }`}
                                      >
                                        Completada
                                      </button>
                                      <button
                                        onClick={() => updateReservationStatus(reservation.id, 'Cancelada')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                                          reservation.status === 'Cancelada'
                                            ? 'bg-red-100 text-red-800'
                                            : 'bg-gray-100 text-gray-600 hover:bg-red-50'
                                        }`}
                                      >
                                        Cancelada
                                      </button>
                                    </div>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <h4 className="font-medium mb-2">Detalles de la Reserva</h4>
                                    <dl className="space-y-1">
                                      <div>
                                        <dt className="text-gray-500">Fecha:</dt>
                                        <dd>{reservation.date}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-gray-500">Hora:</dt>
                                        <dd>{reservation.time}</dd>
                                      </div>
                                      <div>
                                        <dt className="text-gray-500">Número de personas:</dt>
                                        <dd>{reservation.people}</dd>
                                      </div>
                                    </dl>
                                  </div>
                                  
                                  {reservation.notes && (
                                    <div>
                                      <h4 className="font-medium mb-2">Notas Adicionales</h4>
                                      <p className="text-gray-600">{reservation.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReservations;