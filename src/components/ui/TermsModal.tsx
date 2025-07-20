

interface TermsModalProps {
  onAccept: () => void;
}

const TermsModal = ({ onAccept }: TermsModalProps) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Términos y Condiciones de Uso</h2>
        </div>
        <div className="p-6 overflow-y-auto">
          <h3 className="font-semibold text-lg mb-2">¡Bienvenido a ChickenSystem!</h3>
          <p className="text-gray-600 mb-4">
            Antes de continuar, por favor, lee nuestros términos y condiciones. Ten en cuenta que esta plataforma es un <strong>proyecto de demostración y con fines educativos</strong>. No es un servicio comercial real.
          </p>
          
          <h4 className="font-semibold text-md mt-4 mb-2">1. Objeto del Servicio</h4>
          <p className="text-gray-600 mb-3">
            ChickenSystem es una aplicación de prueba diseñada para mostrar funcionalidades de pedidos en línea, reservas y gestión de un restaurante. Toda la información de productos, precios y datos de contacto es ficticia. <strong>Cualquier pedido o reserva que realices a través de esta web no será procesado.</strong>
          </p>

          <h4 className="font-semibold text-md mt-4 mb-2">2. Uso de Datos</h4>
          <p className="text-gray-600 mb-3">
            La información que proporciones (como nombre, correo electrónico al registrarte o iniciar sesión con Google) se utiliza únicamente para simular el funcionamiento de la aplicación. No compartiremos tus datos con terceros y estos podrían ser eliminados en cualquier momento sin previo aviso, ya que la base de datos es de prueba.
          </p>

          <h4 className="font-semibold text-md mt-4 mb-2">3. Propiedad Intelectual</h4>
          <p className="text-gray-600 mb-3">
            El código fuente, diseño y concepto de esta aplicación son propiedad de sus desarrolladores. Está prohibida su reproducción o distribución sin permiso explícito, aunque te animamos a inspirarte en él para tus propios proyectos.
          </p>

          <h4 className="font-semibold text-md mt-4 mb-2">4. Limitación de Responsabilidad</h4>
          <p className="text-gray-600 mb-3">
            Al ser un entorno de pruebas, la aplicación puede contener errores, estar temporalmente fuera de servicio o sufrir cambios sin previo aviso. No nos hacemos responsables de ninguna manera por el uso que se le dé a esta plataforma de demostración.
          </p>

          <p className="text-gray-700 mt-6 font-medium">
            Al hacer clic en "Aceptar", confirmas que has leído, entendido y aceptado estos términos y condiciones, y que eres consciente de que estás interactuando con un proyecto de prueba.
          </p>
        </div>
        <div className="p-6 border-t bg-gray-50 text-right">
          <button 
            onClick={onAccept}
            className="bg-primary-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-primary-700 transition-colors shadow-md"
          >
            Aceptar y Continuar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;
