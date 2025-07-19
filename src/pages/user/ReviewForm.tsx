import { useState } from 'react';
import { API_BASE_URL } from '@/config/apiConfig';

export default function ReviewForm({ user }: { user: any }) {
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    location: '',
    rating: 5,
    comment: ''
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    try {
            const res = await fetch(`${API_BASE_URL}/testimonials`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, user_id: user?.id })
      });
      const data = await res.json();
      if (data.ok) {
        setMsg('¡Gracias por tu reseña!');
        setForm({ ...form, location: '', rating: 5, comment: '' });
      } else {
        setMsg('Error al enviar reseña');
      }
    } catch {
      setMsg('Error al conectar con el servidor');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="name" value={form.name} onChange={handleChange} required placeholder="Tu nombre" className="input mb-2 w-full" />
      <input name="email" value={form.email} onChange={handleChange} required placeholder="Tu correo" className="input mb-2 w-full" />
      <input name="location" value={form.location} onChange={handleChange} placeholder="Ciudad" className="input mb-2 w-full" />
      <select name="rating" value={form.rating} onChange={handleChange} className="input mb-2 w-full">
        {[5,4,3,2,1].map(n => <option key={n} value={n}>{'★'.repeat(n)}</option>)}
      </select>
      <textarea name="comment" value={form.comment} onChange={handleChange} required placeholder="Tu experiencia..." className="input mb-2 w-full" />
      <button type="submit" className="btn-primary w-full" disabled={loading}>Enviar</button>
      {msg && <div className="mt-2 text-center text-green-600">{msg}</div>}
    </form>
  );
}
