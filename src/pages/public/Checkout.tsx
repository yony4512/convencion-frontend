import { useState, useEffect } from "react";
import { ArrowLeft, Trash2, Banknote, QrCode, Check } from "lucide-react";
import { Link } from "../../components/ui/Link";
import { toast } from "sonner";
import { useAuth } from "../../contexts/AuthContext";
import { API_BASE_URL } from "../../config/apiConfig";


// Cart item type definition
interface CartItem {
  id: number;
  name?: string;
  price?: number;
  image?: string;
  quantity: number;
}



const Checkout = () => {

  const [cart, setCart] = useState<CartItem[]>(() => {
    // Cargar el carrito desde localStorage al iniciar
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "yape" | "">("");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { user, token } = useAuth(); // <-- Obtenemos el token del contexto
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    notes: "",
  });

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Rellenar datos del usuario si está logueado
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || '',
      }));
    }
  }, [user]);

  // Update form data
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Update quantity
  const updateQuantity = (productId: number, newQuantity: number): void => {
    if (newQuantity < 1) return;

    setCart(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // Remove item
  const removeItem = (productId: number): void => {
    setCart(prev => prev.filter(item => item.id !== productId));
    toast.success("Producto eliminado del carrito");
  };

  // Calculate subtotal
  const subtotal = cart.reduce(
    (sum, i) => sum + Number(i.price ?? 0) * i.quantity,
    0
  );

  // Calculate delivery fee
  const deliveryFee = 5.00;

  // Calculate total
  const total = subtotal + deliveryFee;

  // Check if can proceed to payment
  const canProceedToPayment = (): boolean => {
    return !!(formData.name && formData.email && formData.phone && formData.address);

  };

  // Check if can complete order
  const canCompleteOrder = (): boolean => {
    return paymentMethod !== "";
  };

  // Handle submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (step === 1) {
      if (canProceedToPayment()) {
        setStep(2);
      }
      return;
    }

    if (step === 2 && canCompleteOrder()) {
      setIsProcessingPayment(true);
      if (!token) {
        toast.error("Error de autenticación. Por favor, inicia sesión de nuevo.");
        setIsProcessingPayment(false);
        return;
      }

      // --- Flujo para pago en efectivo ---
      if (paymentMethod === 'cash') {
        try {
          const payload = {
            items: cart,
            total: total,
            paymentMethod: 'Efectivo al entregar',
            deliveryInfo: formData,
          };

          const res = await fetch(`${API_BASE_URL}/api/orders`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'Error al crear el pedido');
          }

          toast.success("¡Pedido creado con éxito!");
          localStorage.removeItem("cart");
          setCart([]);
          setStep(3);

        } catch (error: any) {
          console.error("Error al procesar el pedido en efectivo:", error);
          toast.error(error.message || "No se pudo procesar el pedido.");
        } finally {
          setIsProcessingPayment(false);
        }
        return;
      }

      // --- Flujo para Yape / Plin (Mercado Pago) ---
      if (paymentMethod === 'yape') {
        try {
          const payload = {
            cart: cart,
            deliveryFee: deliveryFee,
            deliveryInfo: formData,
          };

          const res = await fetch(`${API_BASE_URL}/api/payment/create-preference`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          });

          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'No se pudo iniciar el proceso de pago.');
          }

          const data = await res.json();
          if (data.init_point) {
            // Redirigir al usuario a la pasarela de pago
            window.location.href = data.init_point;
          } else {
            throw new Error('No se recibió la URL de pago.');
          }

        } catch (error: any) {
          console.error('Error al crear la preferencia de Mercado Pago:', error);
          toast.error(error.message || 'Error al conectar con el servicio de pago.');
          setIsProcessingPayment(false); // Detener el spinner solo si hay error
        }
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="max-w-5xl mx-auto">
          {/* Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 1
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > 1 ? <Check size={16} /> : 1}
                </div>
                <div className="ml-2 font-medium">Carrito</div>
              </div>
              <div
                className={`flex-1 mx-4 h-1 ${
                  step > 1 ? "bg-primary-600" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 2
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step > 2 ? <Check size={16} /> : 2}
                </div>
                <div className="ml-2 font-medium">Pago</div>
              </div>
              <div
                className={`flex-1 mx-4 h-1 ${
                  step > 2 ? "bg-primary-600" : "bg-gray-200"
                }`}
              ></div>
              <div className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    step >= 3
                      ? "bg-primary-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  3
                </div>
                <div className="ml-2 font-medium">Confirmación</div>
              </div>
            </div>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Tu Carrito</h2>
                    <Link
                      href="/menu"
                      className="text-primary-600 flex items-center hover:text-primary-700"
                    >
                      <ArrowLeft size={16} className="mr-1" />
                      Seguir comprando
                    </Link>
                  </div>

                  {cart.length > 0 ? (
                    <div className="space-y-6">
                      {cart.map(item => (
                        <div
                          key={item.id}
                          className="flex border-b border-gray-100 pb-6"
                        >
                          <img
                            src={`${API_BASE_URL}/uploads/${item.image}`}
                            alt={item.name ?? ""}
                            className="w-20 h-20 object-cover rounded-md"
                          />
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <h3 className="font-medium">{item.name}</h3>
                              <span className="font-medium">
                                S/.{" "}
                                {(Number(item.price ?? 0) * item.quantity).toFixed(
                                  2
                                )}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                              S/. {Number(item.price ?? 0).toFixed(2)} c/u
                            </p>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  aria-label={`Disminuir cantidad de ${item.name}`}
                                >
                                  -
                                </button>
                                <span className="w-10 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50"
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  aria-label={`Aumentar cantidad de ${item.name}`}
                                >
                                  +
                                </button>
                              </div>
                              <button
                                className="text-gray-400 hover:text-red-500"
                                onClick={() => removeItem(item.id)}
                                aria-label={`Eliminar ${item.name} del carrito`}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-gray-500 mb-4">
                        Tu carrito está vacío
                      </p>
                      <Link href="/menu" className="btn-primary">
                        Ir al menú
                      </Link>
                    </div>
                  )}
                </div>

                {cart.length > 0 && (
                  <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
                    <h2 className="text-lg font-bold mb-4">
                      Información de entrega
                    </h2>
                    <form onSubmit={handleSubmit}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="label">
                            Nombre completo *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            className="input"
                            value={formData.name}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="label">
                            Correo electrónico *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            className="input bg-gray-100 cursor-not-allowed"
                            value={formData.email}
                            readOnly
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="label">
                            Teléfono *
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            className="input"
                            value={formData.phone}
                            onChange={handleFormChange}
                            required
                          />
                          <p className="text-red-600 text-xs mt-1">
                            Ingrese su teléfono actual para coordinar su pedido.
                          </p>
                        </div>
                        <div>
                          <label htmlFor="address" className="label">
                            Dirección de entrega *
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            className="input"
                            value={formData.address}
                            onChange={handleFormChange}
                            required
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="notes" className="label">
                            Instrucciones adicionales
                          </label>
                          <textarea
                            id="notes"
                            name="notes"
                            className="input"
                            value={formData.notes}
                            onChange={handleFormChange}
                            placeholder="Instrucciones para el delivery, referencias, etc."
                            rows={3}
                          ></textarea>
                        </div>
                      </div>
                      <div className="mt-6">
                        <button
                          type="submit"
                          className="btn-primary w-full py-3"
                          disabled={!canProceedToPayment()}
                        >
                          Continuar al pago
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-bold mb-4">Resumen del pedido</h2>
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>S/. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span>S/. {deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>S/. {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium mb-2">Resumen de productos</h3>
                    <ul className="space-y-2">
                      {cart.map(item => (
                        <li
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>
                            S/.{" "}
                            {(Number(item.price ?? 0) * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Payment Methods */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Método de Pago</h2>
                    <button
                      onClick={() => setStep(1)}
                      className="text-primary-600 flex items-center hover:text-primary-700"
                    >
                      <ArrowLeft size={16} className="mr-1" />
                      Volver
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                      {/* Cash Option */}
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethod === "cash"
                            ? "border-primary-600 bg-primary-50"
                            : "border-gray-200 hover:border-primary-300"
                        }`}
                        onClick={() => setPaymentMethod("cash")}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              paymentMethod === "cash"
                                ? "border-primary-600"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentMethod === "cash" && (
                              <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="flex items-center">
                              <Banknote size={20} className="mr-2 text-gray-600" />
                              <span className="font-medium">
                                Efectivo al entregar
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Paga con efectivo cuando recibas tu pedido
                            </p>
                          </div>
                        </div>
                      </div>



                      {/* Yape/Plin Option */}
                      <div
                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                          paymentMethod === "yape"
                            ? "border-primary-600 bg-primary-50"
                            : "border-gray-200 hover:border-primary-300"
                        }`}
                        onClick={() => setPaymentMethod("yape")}
                      >
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                              paymentMethod === "yape"
                                ? "border-primary-600"
                                : "border-gray-300"
                            }`}
                          >
                            {paymentMethod === "yape" && (
                              <div className="w-3 h-3 rounded-full bg-primary-600"></div>
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="flex items-center">
                              <QrCode size={20} className="mr-2 text-gray-600" />
                              <span className="font-medium">Yape / Plin</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              Paga con Yape o Plin escaneando el código QR
                            </p>
                          </div>
                        </div>

                        {paymentMethod === "yape" && (
                          <div className="mt-4 p-4 bg-gray-50 rounded-md text-center">
                            <p className="text-sm text-gray-600 mb-4">
                              Escanea el código QR para realizar el pago:
                            </p>
                            <div className="flex justify-center mb-4">
                              <div className="p-3 bg-white rounded-lg inline-block">
                                <QrCode size={150} />
                              </div>
                            </div>
                            <p className="text-sm text-gray-600">
                              Una vez realizado el pago, enviaremos una
                              confirmación a tu correo electrónico.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="btn-primary w-full py-3"
                        disabled={!canCompleteOrder() || isProcessingPayment}
                      >
                        {isProcessingPayment ? 'Procesando...' : 'Confirmar pedido'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                  <h2 className="text-lg font-bold mb-4">Resumen del pedido</h2>
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>S/. {subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivery</span>
                      <span>S/. {deliveryFee.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 mt-3">
                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span>S/. {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h3 className="font-medium mb-2">Resumen de productos</h3>
                    <ul className="space-y-2">
                      {cart.map(item => (
                        <li
                          key={item.id}
                          className="flex justify-between text-sm"
                        >
                          <span>
                            {item.quantity}x {item.name}
                          </span>
                          <span>
                            S/.{" "}
                            {(Number(item.price ?? 0) * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-green-100 p-4 rounded-full">
                  <Check size={48} className="text-green-600" />
                </div>
              </div>
              <h2 className="text-2xl font-bold mb-4">¡Pedido Confirmado!</h2>
              <p className="text-gray-600 mb-6">
                Gracias {formData.name}, hemos recibido tu pedido y está siendo
                procesado.
              </p>
              <div className="bg-gray-50 p-6 rounded-lg mb-6 max-w-md mx-auto">
                <div className="mb-4 text-left">
                  <p className="text-sm text-gray-500">Número de pedido</p>
                  <p className="font-medium">
                    ORD
                    {Math.floor(Math.random() * 10000)
                      .toString()
                      .padStart(4, "0")}
                  </p>
                </div>
                <div className="mb-4 text-left">
                  <p className="text-sm text-gray-500">Método de pago</p>
                  <p className="font-medium">
                    {paymentMethod === "cash" && "Efectivo al entregar"}

                    {paymentMethod === "yape" && "Yape / Plin"}
                  </p>
                </div>
                <div className="mb-4 text-left">
                  <p className="text-sm text-gray-500">Dirección de entrega</p>
                  <p className="font-medium">{formData.address}</p>
                </div>
                <div className="mb-4 text-left">
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium">S/. {total.toFixed(2)}</p>
                </div>
              </div>
              <p className="text-gray-600 mb-8">
                Hemos enviado un correo de confirmación a {formData.email} con
                los detalles de tu pedido. También recibirás notificaciones sobre
                el estado de tu entrega.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/" className="btn-primary">
                  Volver al inicio
                </Link>
                <Link href="/user/orders" className="btn-outline">
                  Ver mis pedidos
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;