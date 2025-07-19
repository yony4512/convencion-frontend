import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingCart, User, Mail, Phone, MapPin, Calendar, DollarSign, Hash } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Tipos para los datos del pedido
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface Order {
  id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  delivery_address: string;
  total_amount: number;
  status: string;
  payment_method: string;
  createdAt: string;
  items: OrderItem[] | string; // Puede ser un string JSON
}

interface OrderDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  isLoading: boolean;
}

const UserOrderDetailModal = ({ isOpen, onClose, order, isLoading }: OrderDetailModalProps) => {

  // Función segura para parsear items si vienen como string
  const getItemsArray = (): OrderItem[] => {
    if (!order?.items) return [];
    if (Array.isArray(order.items)) return order.items;
    try {
      return JSON.parse(order.items);
    } catch (error) {
      console.error("Error al parsear items:", error);
      return [];
    }
  };

  const items = getItemsArray();

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'Fecha no disponible';
    try {
      return format(new Date(dateString), 'PPpp', { locale: es }); // Formato más completo
    } catch {
      return 'Fecha inválida';
    }
  };

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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-xl font-bold leading-6 text-gray-900 flex justify-between items-center"
                >
                  Detalles del Pedido
                  <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </Dialog.Title>

                <div className="mt-4">
                  {isLoading ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">Cargando detalles...</p>
                    </div>
                  ) : !order ? (
                    <div className="text-center py-8">
                      <p className="text-red-600">No se pudieron cargar los detalles del pedido.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="flex items-center text-green-800">
                          <Hash className="w-5 h-5 mr-3" />
                          <span className="font-semibold">Pedido ID:</span>
                          <span className="ml-2">ORD{String(order.id).padStart(4, '0')}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><User className="w-4 h-4 mr-2 text-gray-500"/>Información del Cliente</h4>
                          <div className="text-sm space-y-2 border p-4 rounded-lg">
                            <p><strong>Nombre:</strong> {order.customer_name || 'No disponible'}</p>
                            <p><strong>Email:</strong> {order.customer_email || 'No disponible'}</p>
                            <p><strong>Teléfono:</strong> {order.customer_phone || 'No disponible'}</p>
                            <p><strong>Dirección:</strong> {order.delivery_address || 'No disponible'}</p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2 flex items-center"><ShoppingCart className="w-4 h-4 mr-2 text-gray-500"/>Resumen del Pedido</h4>
                          <div className="text-sm space-y-2 border p-4 rounded-lg">
                            <p><strong>Fecha:</strong> {formatDate(order.createdAt)}</p>
                            <p><strong>Total:</strong> S/ {Number(order.total_amount).toFixed(2)}</p>
                            <p><strong>Estado:</strong> <span className="capitalize font-medium">{order.status || 'No disponible'}</span></p>
                            <p><strong>Método de Pago:</strong> {order.payment_method || 'No disponible'}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">Productos del Pedido</h4>
                        <div className="border rounded-lg overflow-hidden">
                          <ul className="divide-y divide-gray-200">
                            {items.length > 0 ? items.map((item, index) => (
                              <li key={index} className="flex items-center p-3">
                                <img src={item.image || '/placeholder.png'} alt={item.name} className="w-14 h-14 rounded-md object-cover mr-4" />
                                <div className="flex-grow">
                                  <p className="font-medium text-gray-800">{item.name}</p>
                                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                                </div>
                                <p className="font-semibold text-gray-800">S/ {(item.quantity * item.price).toFixed(2)}</p>
                              </li>
                            )) : (
                              <li className="p-4 text-center text-gray-500">No hay productos en este pedido.</li>
                            )}
                          </ul>
                        </div>
                      </div>

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

export default UserOrderDetailModal;
