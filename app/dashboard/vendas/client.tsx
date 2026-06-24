'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, CheckCircle } from 'lucide-react';

interface Product {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
}

interface CartItem {
  productId: string;
  nome: string;
  preco: number;
  qty: number;
}

interface SaleItem {
  qty: number;
  price: number;
  product: { nome: string };
}

interface Sale {
  id: string;
  total: number;
  createdAt: string;
  items: SaleItem[];
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function VendasClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedQty, setSelectedQty] = useState(1);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const [pRes, sRes] = await Promise.all([fetch('/api/products'), fetch('/api/sales')]);
    if (pRes.ok) setProducts(await pRes.json());
    if (sRes.ok) setSales(await sRes.json());
    setLoading(false);
  }

  function addToCart() {
    const product = products.find((p) => p.id === selectedProduct);
    if (!product) return;

    const existing = cart.find((c) => c.productId === product.id);
    const totalQty = (existing?.qty ?? 0) + selectedQty;

    if (totalQty > product.estoque) {
      alert(`Estoque insuficiente. Disponível: ${product.estoque}`);
      return;
    }

    if (existing) {
      setCart(cart.map((c) => c.productId === product.id ? { ...c, qty: c.qty + selectedQty } : c));
    } else {
      setCart([...cart, { productId: product.id, nome: product.nome, preco: product.preco, qty: selectedQty }]);
    }
    setSelectedProduct('');
    setSelectedQty(1);
  }

  function removeFromCart(productId: string) {
    setCart(cart.filter((c) => c.productId !== productId));
  }

  function updateQty(productId: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    const product = products.find((p) => p.id === productId);
    if (product && qty > product.estoque) {
      alert(`Estoque insuficiente. Disponível: ${product.estoque}`);
      return;
    }
    setCart(cart.map((c) => c.productId === productId ? { ...c, qty } : c));
  }

  const total = cart.reduce((s, c) => s + c.preco * c.qty, 0);

  async function handleFinalize() {
    if (cart.length === 0) {
      alert('Adicione pelo menos um produto ao carrinho.');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((c) => ({ productId: c.productId, qty: c.qty, price: c.preco })),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error ?? 'Erro ao finalizar venda');
        return;
      }
      setCart([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      fetchAll();
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Carregando...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Vendas</h1>
        <p className="text-sm text-gray-600">Registre novas vendas e visualize o histórico</p>
      </div>

      {success && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <CheckCircle size={20} />
          <span className="font-medium">Venda registrada com sucesso!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Carrinho */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2 mb-5">
            <ShoppingCart size={18} /> Nova Venda
          </h2>

          {/* Adicionar produto */}
          <div className="flex gap-2 mb-5">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
            >
              <option value="">Selecione um produto</option>
              {products.filter((p) => p.estoque > 0).map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nome} — {fmt(p.preco)} (est: {p.estoque})
                </option>
              ))}
            </select>
            <input
              type="number"
              min={1}
              value={selectedQty}
              onChange={(e) => setSelectedQty(Number(e.target.value))}
              className="w-16 px-3 py-2 border border-gray-200 rounded-lg text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={addToCart}
              disabled={!selectedProduct}
              className="px-3 py-2 bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-lg disabled:opacity-40 transition"
            >
              <Plus size={18} />
            </button>
          </div>

          {/* Itens do carrinho */}
          {cart.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Carrinho vazio</p>
          ) : (
            <>
              <ul className="space-y-2 mb-5">
                {cart.map((item) => (
                  <li key={item.productId} className="flex items-center gap-3 py-2 border-b border-gray-50">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.nome}</p>
                      <p className="text-xs text-gray-500">{fmt(item.preco)} / un</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQty(item.productId, item.qty - 1)}
                        className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-bold"
                      >−</button>
                      <span className="w-8 text-center text-sm font-medium">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.productId, item.qty + 1)}
                        className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-bold"
                      >+</button>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 w-20 text-right">{fmt(item.preco * item.qty)}</span>
                    <button onClick={() => removeFromCart(item.productId)} className="text-red-400 hover:text-red-600">
                      <Trash2 size={15} />
                    </button>
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="font-semibold text-gray-900">Total</span>
                <span className="text-xl font-bold text-green-600">{fmt(total)}</span>
              </div>

              <button
                onClick={handleFinalize}
                disabled={saving}
                className="mt-4 w-full py-3 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold rounded-lg disabled:opacity-60 transition"
              >
                {saving ? 'Finalizando...' : 'Finalizar Venda'}
              </button>
            </>
          )}
        </div>

        {/* Histórico */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Histórico de Vendas</h2>
          {sales.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nenhuma venda registrada</p>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto">
              {sales.map((sale) => (
                <div key={sale.id} className="border border-gray-100 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-xs text-gray-400">
                      {new Date(sale.createdAt).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </p>
                    <span className="text-base font-bold text-green-600">{fmt(sale.total)}</span>
                  </div>
                  <ul className="space-y-1">
                    {sale.items.map((item, i) => (
                      <li key={i} className="text-xs text-gray-600 flex justify-between">
                        <span>{item.product.nome} × {item.qty}</span>
                        <span>{fmt(item.price * item.qty)}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
