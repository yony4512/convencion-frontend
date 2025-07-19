import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import UserSidebar from '../../components/user/UserSidebar';
import UserReservationDetailModal from '../../components/user/UserReservationDetailModal';
import { useAuth } from '../../contexts/AuthContext';
import { ReservationDetail } from '../../types/reservation';

const UserReservations = () => {
  const { user } = useAuth();
  const [reservations, setReservations] = useState<ReservationDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para el modal (corregido para incluir el estado de carga)
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<ReservationDetail | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/reservations', { credentials: 'include' });
        if (!response.ok) {
          throw new Error('No se pudieron cargar las reservas.');
        }
        const data = await response.json();
        setReservations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchReservations();
    }
  }, [user]);

  const handleViewReservation = async (reservationId: number) => {
    setModalOpen(true);
    setModalLoading(true);
    setSelectedReservation(null); // Limpiar datos anteriores
    try {
      const response = await fetch(`/api/reservations/${reservationId}`, { credentials: 'include' });
      if (!response.ok) {
        throw new Error('No se pudo cargar el detalle de la reserva.');
      }
      const data = await response.json();
      setSelectedReservation(data);
    } catch (err) {
      console.error(err);
      setError('Error al cargar detalles. Intente de nuevo.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedReservation(null);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <UserSidebar activePage="reservations" />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">Mis Reservas</h1>
              <p className="text-gray-600">Historial de todas tus reservas realizadas</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                {loading ? (
                  <p className="p-6 text-center">Cargando reservas...</p>
                ) : error ? (
                  <p className="p-6 text-center text-red-500">{error}</p>
                ) : reservations.length === 0 ? (
                  <p className="p-6 text-center text-gray-500">No tienes ninguna reserva.</p>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 text-gray-600">
                      <tr>
                        <th className="p-4 font-medium">RESERVA</th>
                        <th className="p-4 font-medium">FECHA</th>
                        <th className="p-4 font-medium">HORA</th>
                        <th className="p-4 font-medium">PERSONAS</th>
                        <th className="p-4 font-medium">ESTADO</th>
                        <th className="p-4 font-medium"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {reservations.map((reservation) => (
                        <tr key={reservation.id} className="border-b">
                          <td className="p-4 font-medium text-gray-800">RSV{String(reservation.id).padStart(3, '0')}</td>
                          <td className="p-4">{format(new Date(reservation.date), 'dd \'de\' MMMM, yyyy', { locale: es })}</td>
                          <td className="p-4">{reservation.time}</td>
                          <td className="p-4 text-center">{reservation.people}</td>
                          <td className="p-4">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                              reservation.status?.toLowerCase() === 'confirmada' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                              {reservation.status || 'Pendiente'}
                            </span>
                          </td>
                          <td className="p-4">
                            <button onClick={() => handleViewReservation(reservation.id)} className="font-medium text-primary-600 hover:underline">
                              Detalles
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <UserReservationDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        reservation={selectedReservation}
        isLoading={modalLoading} 
      />
    </div>
  );
};

export default UserReservations;