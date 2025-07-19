import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Calendar, Clock, Users, User, Phone, Mail, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Definición de la interfaz para el detalle de la reserva
export interface ReservationDetail {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  date: string;
  time: string;
  people: number;
  status: string;
  notes?: string;
  created_at: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  reservation: ReservationDetail | null;
  isLoading: boolean;
}

// Función segura para formatear fechas
const safeFormatDate = (date: string | null | undefined) => {
  if (!date) return 'Fecha no disponible';
  try {
    return format(new Date(date), 'EEEE, dd \'de\' MMMM, yyyy', { locale: es });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Fecha inválida';
  }
};

const UserReservationDetailModal = ({ isOpen, onClose, reservation, isLoading }: Props) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-40" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-gray-900 flex justify-between items-center"
                >
                  Detalles de la Reserva
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </Dialog.Title>

                <div className="mt-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Cargando detalles...</p>
                    </div>
                  ) : !reservation ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">No se pudieron cargar los detalles.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <div className="flex items-center text-blue-800">
                          <Hash className="w-5 h-5 mr-3" />
                          <span className="font-semibold">Reserva ID:</span>
                          <span className="ml-2">RSV{String(reservation.id).padStart(3, '0')}</span>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Información del Cliente</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border p-4 rounded-lg">
                          <div className="flex items-center">
                            <User className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{reservation.customer_name || 'No disponible'}</span>
                          </div>
                          <div className="flex items-center">
                            <Mail className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{reservation.customer_email || 'No especificado'}</span>
                          </div>
                          <div className="flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{reservation.customer_phone || 'No disponible'}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Detalles de la Reserva</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm border p-4 rounded-lg">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{safeFormatDate(reservation.date)}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{reservation.time || 'No disponible'}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-2 text-gray-500" />
                            <span>{reservation.people != null ? `${reservation.people} personas` : 'No disponible'}</span>
                          </div>
                          <div className="flex items-center">
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${reservation.status?.toLowerCase() === 'confirmada' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                              {reservation.status || 'Pendiente'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {reservation.notes && (
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Notas Adicionales</h4>
                          <p className="text-sm text-gray-600 border p-4 rounded-lg bg-gray-50">{reservation.notes}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={onClose}
                  >
                    Cerrar
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default UserReservationDetailModal;