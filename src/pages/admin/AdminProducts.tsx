import { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Plus, 
  Search, 
  Edit,
  Trash2,
  Check,
  X,
  Save
} from 'lucide-react';
import { Link } from '../../components/ui/Link';
import AdminSidebar from '../../components/admin/AdminSidebar';
import { toast } from 'sonner';

// Product type definition
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  popular?: boolean;
}

// Sample product data
const productsData: Product[] = [
  {
    id: 1,
    name: "Pollo Entero",
    description: "Pollo a la brasa entero con papas fritas y ensalada",
    price: 65.90,
    image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "pollos",
    popular: true
  },
  {
    id: 2,
    name: "1/2 Pollo",
    description: "Medio pollo a la brasa con papas fritas y ensalada",
    price: 39.90,
    image: "https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "pollos"
  },
  {
    id: 3,
    name: "1/4 Pollo",
    description: "Cuarto de pollo a la brasa con papas fritas y ensalada",
    price: 22.90,
    image: "https://images.pexels.com/photos/2673353/pexels-photo-2673353.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "pollos"
  },
  {
    id: 4,
    name: "Combo Familiar",
    description: "1 pollo entero + papas fritas familiares + 4 ensaladas + 1 gaseosa de 1.5L",
    price: 79.90,
    image: "https://images.pexels.com/photos/2338407/pexels-photo-2338407.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "combos",
    popular: true
  },
  {
    id: 5,
    name: "Combo Dúo",
    description: "1/2 pollo + papas fritas medianas + 2 ensaladas + 2 gaseosas personales",
    price: 49.90,
    image: "https://images.pexels.com/photos/6210747/pexels-photo-6210747.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "combos"
  },
  {
    id: 6,
    name: "Ensalada Mixta",
    description: "Lechuga, tomate, pepino, zanahoria y aderezo de la casa",
    price: 12.90,
    image: "https://images.pexels.com/photos/257816/pexels-photo-257816.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "acompañamientos"
  },
  {
    id: 7,
    name: "Papas Fritas",
    description: "Porción grande de papas fritas crujientes",
    price: 15.90,
    image: "https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "acompañamientos",
    popular: true
  },
  {
    id: 8,
    name: "Gaseosa Personal",
    description: "Gaseosa de 500ml (Coca Cola, Inca Kola, Sprite)",
    price: 5.90,
    image: "https://images.pexels.com/photos/1211887/pexels-photo-1211887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "bebidas"
  },
  {
    id: 9,
    name: "Gaseosa Familiar",
    description: "Gaseosa de 1.5L (Coca Cola, Inca Kola, Sprite)",
    price: 12.90,
    image: "https://images.pexels.com/photos/2983100/pexels-photo-2983100.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    category: "bebidas"
  },
];

// Categories
const categories = [
  { id: 'all', name: 'Todos' },
  { id: 'pollos', name: 'Pollos' },
  { id: 'combos', name: 'Combos' },
  { id: 'acompañamientos', name: 'Acompañamientos' },
  { id: 'bebidas', name: 'Bebidas' },
];

const AdminProducts = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>(productsData);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [deleteConfirmationId, setDeleteConfirmationId] = useState<number | null>(null);

  // Filter products based on category and search term
  const filteredProducts = products.filter(product => {
    const matchesCategory = activeCategory === 'all' || product.category === activeCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Open modal for creating new product
  const openCreateModal = () => {
    setCurrentProduct({
      id: Math.max(...products.map(p => p.id), 0) + 1,
      name: '',
      description: '',
      price: 0,
      image: '',
      category: 'pollos',
      popular: false,
    });
    setIsModalOpen(true);
  };

  // Open modal for editing product
  const openEditModal = (product: Product) => {
    setCurrentProduct({ ...product });
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!currentProduct) return;

    const { name, value } = e.target;
    if (name === 'price') {
      const priceValue = parseFloat(value);
      setCurrentProduct({ ...currentProduct, [name]: isNaN(priceValue) ? 0 : priceValue });
    } else if (name === 'popular') {
      setCurrentProduct({ ...currentProduct, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setCurrentProduct({ ...currentProduct, [name]: value });
    }
  };

  // Save product (create or update)
  const saveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentProduct) return;

    // Enhanced validation
    if (!currentProduct.name.trim()) {
      toast.error('El nombre del producto es requerido');
      return;
    }
    if (!currentProduct.description.trim()) {
      toast.error('La descripción del producto es requerida');
      return;
    }
    if (!currentProduct.image.trim()) {
      toast.error('La URL de la imagen es requerida');
      return;
    }
    if (currentProduct.price <= 0) {
      toast.error('El precio debe ser mayor a 0');
      return;
    }
    if (!currentProduct.category) {
      toast.error('La categoría es requerida');
      return;
    }

    // Check if product exists (update) or not (create)
    const existingIndex = products.findIndex(p => p.id === currentProduct.id);
    
    if (existingIndex >= 0) {
      // Update existing product
      const updatedProducts = [...products];
      updatedProducts[existingIndex] = currentProduct;
      setProducts(updatedProducts);
      toast.success('Producto actualizado correctamente');
    } else {
      // Create new product
      setProducts([...products, currentProduct]);
      toast.success('Producto creado correctamente');
    }
    
    // Close modal
    setIsModalOpen(false);
    setCurrentProduct(null);
  };

  // Delete product
  const deleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
    setDeleteConfirmationId(null);
    toast.success('Producto eliminado correctamente');
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container-custom py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar for larger screens */}
          <AdminSidebar activePage="products" className="hidden md:block" />

          {/* Mobile menu button */}
          <div className="md:hidden w-full">
            <button
              type="button"
              className="w-full flex items-center justify-between bg-white p-4 rounded-lg shadow-sm"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              <span className="font-medium">Menú de Administrador</span>
              <ChevronRight className={`transform transition-transform ${mobileMenuOpen ? 'rotate-90' : ''}`} />
            </button>
            
            {mobileMenuOpen && (
              <div id="mobile-menu" className="mt-2 bg-white rounded-lg shadow-sm overflow-hidden">
                <AdminSidebar activePage="products" className="block" />
              </div>
            )}
          </div>

          {/* Main content */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h1 className="text-2xl font-bold">Gestión de Productos</h1>
                  <p className="text-gray-600">Administra el menú de productos de ChickenSystem</p>
                </div>
                <button
                  onClick={openCreateModal}
                  className="btn-primary flex items-center gap-2"
                  aria-label="Agregar nuevo producto"
                >
                  <Plus size={18} />
                  Agregar Producto
                </button>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-4 justify-between">
                {/* Search */}
                <div className="relative w-full md:w-64">
                  <input
                    type="text"
                    placeholder="Buscar productos..."
                    className="input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label="Buscar productos"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-2 overflow-x-auto">
                  {categories.map(category => (
                    <button
                      key={category.id}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                        activeCategory === category.id
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveCategory(category.id)}
                      aria-pressed={activeCategory === category.id}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Products List */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Producto
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Precio
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Popular
                      </th>
                      <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProducts.map((product) => (
                      <tr key={product.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0 rounded-md overflow-hidden">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="h-10 w-10 object-cover"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">{product.category}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">S/. {product.price.toFixed(2)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {product.popular ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Popular
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                              Normal
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                          <div className="flex justify-center space-x-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="text-indigo-600 hover:text-indigo-900"
                              aria-label={`Editar ${product.name}`}
                            >
                              <Edit size={18} />
                            </button>
                            {deleteConfirmationId === product.id ? (
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => deleteProduct(product.id)}
                                  className="text-red-600 hover:text-red-900"
                                  aria-label={`Confirmar eliminación de ${product.name}`}
                                >
                                  <Check size={18} />
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmationId(null)}
                                  className="text-gray-600 hover:text-gray-900"
                                  aria-label="Cancelar eliminación"
                                >
                                  <X size={18} />
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmationId(product.id)}
                                className="text-red-600 hover:text-red-900"
                                aria-label={`Eliminar ${product.name}`}
                              >
                                <Trash2 size={18} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No se encontraron productos
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Modal */}
      {isModalOpen && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={saveProduct}>
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-xl font-bold">
                  {currentProduct.id && products.some(p => p.id === currentProduct.id) 
                    ? 'Editar Producto' 
                    : 'Crear Producto'}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                  aria-label="Cerrar formulario"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="label">Nombre del producto *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="input"
                      value={currentProduct.name}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="label">Descripción *</label>
                    <textarea
                      id="description"
                      name="description"
                      className="input min-h-[80px]"
                      value={currentProduct.description}
                      onChange={handleInputChange}
                      required
                      aria-required="true"
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="label">Precio (S/.) *</label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        min="0.01"
                        className="input"
                        value={currentProduct.price}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="label">Categoría *</label>
                      <select
                        id="category"
                        name="category"
                        className="input"
                        value={currentProduct.category}
                        onChange={handleInputChange}
                        required
                        aria-required="true"
                      >
                        <option value="pollos">Pollos</option>
                        <option value="combos">Combos</option>
                        <option value="acompañamientos">Acompañamientos</option>
                        <option value="bebidas">Bebidas</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="image" className="label">URL de la imagen *</label>
                    <input
                      type="url"
                      id="image"
                      name="image"
                      className="input"
                      value={currentProduct.image}
                      onChange={handleInputChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      required
                      aria-required="true"
                    />
                    {currentProduct.image && (
                      <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden">
                        <img
                          src={currentProduct.image}
                          alt="Vista previa de la imagen del producto"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="popular"
                      name="popular"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      checked={currentProduct.popular || false}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="popular" className="ml-2 block text-sm text-gray-900">
                      Marcar como producto popular
                    </label>
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    className="btn-outline"
                    onClick={() => setIsModalOpen(false)}
                    aria-label="Cancelar edición"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center gap-2"
                    aria-label="Guardar producto"
                  >
                    <Save size={18} />
                    Guardar Producto
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;