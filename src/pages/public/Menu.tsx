import { useState, useEffect } from 'react';
import { Search, ShoppingCart } from 'lucide-react';
import { StyledLink as Link } from '../../components/ui/Link';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';
import LoginModal from '../../components/auth/LoginModal';
import { API_BASE_URL } from '@/config/apiConfig';

// El tipo de producto debe coincidir con lo que se obtiene de la API y el contexto
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
}

const Menu = () => {
  const { user } = useAuth();
  const { addToCart, cartQuantity } = useCart();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  // Obtener categorías y productos
  useEffect(() => {
    const fetchCategories = async () => {
      try {
                const res = await fetch(`${API_BASE_URL}/api/products/categories`);
        const data = await res.json();
        if (data.ok) setCategories(data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchProducts = async () => {
      try {
                const res = await fetch(`${API_BASE_URL}/api/products/public`);
        const data = await res.json();
        if (data.ok) setProducts(data.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchCategories();
    fetchProducts();
  }, []);

  // Lógica para manejar el clic en "Agregar al carrito"
  const handleAddToCartClick = (product: Product) => {
    if (user) {
      addToCart(product);
    } else {
      setLoginModalOpen(true);
    }
  };

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <LoginModal isOpen={isLoginModalOpen} onClose={() => setLoginModalOpen(false)} />
      
      <div>
        {/* Hero Banner */}
        <section className="relative bg-gray-900 text-white py-16">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
            style={{
              backgroundImage: "url('https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')",
            }}
          ></div>
          <div className="container-custom relative z-10 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nuestro Menú</h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Descubre nuestra variedad de pollos a la brasa, combos especiales y acompañamientos
            </p>
          </div>
        </section>

        {/* Search and Filter */}
        <section className="py-6 bg-white shadow-sm sticky top-16 z-30">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              {/* Search */}
              <div className="relative w-full md:w-64 lg:w-80">
                <input
                  type="text"
                  placeholder="Buscar en el menú..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Buscar en el menú"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>

              {/* Categories */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button onClick={() => setActiveCategory('all')} className={`btn ${activeCategory === 'all' ? 'btn-primary' : 'btn-outline'}`}>Todos</button>
                {categories.map((category) => (
                  <button key={category} onClick={() => setActiveCategory(category)} className={`btn ${activeCategory === category ? 'btn-primary' : 'btn-outline'}`}>
                    {category}
                  </button>
                ))}
              </div>

              {/* Cart Button */}
              <Link href="/checkout" className="btn-primary hidden md:flex items-center gap-2">
                <ShoppingCart size={18} />
                <span>Carrito ({cartQuantity})</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Menu Items */}
        <section className="section bg-gray-50">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="card group overflow-hidden">
                  <div className="h-48 overflow-hidden relative">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                    {product.popular && (
                      <div className="absolute top-2 right-2 bg-primary-600 text-white text-sm font-bold px-3 py-1 rounded">Popular</div>
                    )}
                  </div>
                  <div className="p-6 flex flex-col">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{product.description}</p>
                    <div className="flex justify-between items-center mt-auto">
                      <span className="text-lg font-bold text-primary-600">S/. {Number(product.price).toFixed(2)}</span>
                      <button 
                        className="btn-primary py-2 px-4 text-sm"
                        onClick={() => handleAddToCartClick(product)}
                        aria-label={`Agregar ${product.name} al carrito`}
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <h3 className="text-xl font-medium mb-2">No se encontraron productos</h3>
                <p className="text-gray-600">Intenta con otra búsqueda o categoría</p>
              </div>
            )}
          </div>
        </section>

        {/* Fixed Cart Button (Mobile) */}
        <div className="fixed bottom-4 right-4 md:hidden z-40">
          <Link href="/checkout" className="btn-primary rounded-full p-4 shadow-lg flex items-center gap-2">
            <ShoppingCart size={20} />
            <span>{cartQuantity}</span>
          </Link>
        </div>
      </div>
    </>
  );
};

export default Menu;