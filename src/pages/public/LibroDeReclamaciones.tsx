import React, { useState } from 'react';

import { API_BASE_URL } from '@/config/apiConfig';
import { CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const LibroDeReclamaciones = () => {
  const [formData, setFormData] = useState({
    consumer_name: '',
    consumer_lastname: '',
    consumer_document_type: '',
    consumer_document_number: '',
    consumer_phone: '',
    consumer_email: '',
    consumer_address: '', // Dirección del consumidor
    consumer_is_minor: 'false', // Inicia como string
    item_type: 'producto',
    item_amount: '',
    item_description: '',
    complaint_type: 'reclamo',
    complaint_details: '',
    consumer_request: '',
  });
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const dataToSend = {
      ...formData,
      consumer_is_minor: formData.consumer_is_minor === 'true', // Convierte a booleano
      item_amount: formData.item_amount ? parseFloat(formData.item_amount) : null, // Convierte a número o null
    };

        const backendUrl = API_BASE_URL;
    try {
      const response = await fetch(`${backendUrl}/api/complaints`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'No se pudo registrar el reclamo.');
      }

      toast.success('Reclamación registrada con éxito.');
      setSubmissionStatus('success');

    } catch (error: any) {
      console.error('Error al enviar el reclamo:', error);
      toast.error(error.message || 'Ocurrió un error inesperado.');
      setSubmissionStatus('error');
    }
  };

  if (submissionStatus === 'success') {
    return (
      <div className="container-custom py-12 md:py-20">
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h1 className="text-2xl font-bold mb-4">Reclamación Enviada</h1>
          <p className="text-gray-600 mb-6">Hemos recibido tu reclamación correctamente. Nos pondremos en contacto contigo a la brevedad.</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">
            Registrar otra reclamación
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12 md:py-20">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">Hoja de Reclamación</h1>
        <p className="text-center text-gray-600 mb-8">Conforme a lo establecido en el Código de la Protección y Defensa del consumidor este establecimiento cuenta con un Libro de Reclamaciones a tu disposición. Registra la queja o reclamo aquí.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 1. Identificación del Consumidor */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold text-primary-500 mb-6">1. Identificación del Consumidor Reclamante</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="text" name="consumer_name" placeholder="Nombres:*" className="input" required onChange={handleFormChange} value={formData.consumer_name} />
              <input type="text" name="consumer_lastname" placeholder="Apellido:*" className="input" required onChange={handleFormChange} value={formData.consumer_lastname} />
              <select name="consumer_document_type" className="input" required onChange={handleFormChange} value={formData.consumer_document_type}>
                <option value="">Seleccione tipo de documento</option>
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
                <option value="CE">Carnet de Extranjería</option>
                <option value="PAS">Pasaporte</option>
              </select>
              <input type="text" name="consumer_document_number" placeholder="Nº Doc.:*" className="input" required onChange={handleFormChange} value={formData.consumer_document_number} />
              <input type="tel" name="consumer_phone" placeholder="Teléfono:*" className="input" required onChange={handleFormChange} value={formData.consumer_phone} />
              <input type="email" name="consumer_email" placeholder="Email:*" className="input" required onChange={handleFormChange} value={formData.consumer_email} />
              <input type="text" name="consumer_address" placeholder="Dirección:*" className="input md:col-span-2" required onChange={handleFormChange} value={formData.consumer_address} />
              <div>
                <label className="label">¿Eres menor de edad?</label>
                <div className="flex items-center gap-4 mt-2">
                  <label><input type="radio" name="consumer_is_minor" value="true" onChange={handleRadioChange} checked={formData.consumer_is_minor === 'true'} /> Sí</label>
                  <label><input type="radio" name="consumer_is_minor" value="false" onChange={handleRadioChange} checked={formData.consumer_is_minor === 'false'} /> No</label>
                </div>
              </div>
            </div>
          </div>

          {/* 2. Identificación del Bien Contratado */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold text-primary-500 mb-6">2. Identificación del Bien Contratado</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <label><input type="radio" name="item_type" value="producto" onChange={handleRadioChange} checked={formData.item_type === 'producto'} /> Producto</label>
                <label><input type="radio" name="item_type" value="servicio" onChange={handleRadioChange} checked={formData.item_type === 'servicio'} /> Servicio</label>
              </div>
              <input type="number" name="item_amount" placeholder="Monto:" className="input" onChange={handleFormChange} value={formData.item_amount} />
              <textarea name="item_description" placeholder="Descripción: Especificar el producto o servicio adquirido" className="input h-24" maxLength={300} onChange={handleFormChange} value={formData.item_description}></textarea>
            </div>
          </div>

          {/* 3. Detalle de Reclamación */}
          <div className="p-6 border border-gray-200 rounded-lg">
            <h2 className="text-xl font-bold text-primary-500 mb-6">3. Detalle de Reclamación y pedido del consumidor</h2>
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <label><input type="radio" name="complaint_type" value="reclamo" onChange={handleRadioChange} checked={formData.complaint_type === 'reclamo'} /> Reclamo</label>
                <label><input type="radio" name="complaint_type" value="queja" onChange={handleRadioChange} checked={formData.complaint_type === 'queja'} /> Queja</label>
              </div>
              <textarea name="complaint_details" placeholder="Detalle:* Explicar el reclamo o queja" className="input h-24" required maxLength={300} onChange={handleFormChange} value={formData.complaint_details}></textarea>
              <textarea name="consumer_request" placeholder="Pedido de cliente:* Detallar lo que solicita" className="input h-24" required maxLength={300} onChange={handleFormChange} value={formData.consumer_request}></textarea>
            </div>
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-primary">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LibroDeReclamaciones;
