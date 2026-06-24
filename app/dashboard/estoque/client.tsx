'use client';

import { useState, useEffect } from 'react';
import { ArrowUpCircle, ArrowDownCircle, SlidersHorizontal, AlertTriangle } from 'lucide-react';

interface Product {
  id: string;
  nome: string;
  categoria: string;
  estoque: number;
  minimo: number;
  custo: number;
}

interface Movement {
  id: string;
  tipo: string;
  qty: number;
  motivo: string | null;
  createdAt: string;
  product: { nome: string };
}

export function EstoqueClient() {
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<Movement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ productId: '', tipo: 'entrada', qty: 1, motivo: '' });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    const [pRes, mRes] = await Promise.all([
      fetch('/api/products'),
      fetch('/api/stock'),
    ]);
    if (pRes.ok) setProducts(await pRes.json());
    if (mRes.ok) setMovements(await mRes.json());
    setLoading(false);
  }

  async function handleSave() {
    if (!form.productId || form.qty <= 0) {
      alert('Selecione um produto e informe a quantidade.');
      return;
    }
    const res = await fetch('/api/stock', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (!res.ok) {
      const err = await res.json();
      alert(err.error ?? 'Erro ao registrar movimentação');
      return;
    }
    setShowModal(false);
    setForm({ productId: '', tipo: 'entrada', qty: 1, motivo: '' });
    fetchAll();
  }

  const tipoCor: Record<string, string> = {
    entrada: 'text-green-600 bg-green-50',
    saida: 'text-red-600 bg-red-50',
    ajuste: 'text-blue-600 bg-blue-50',
  };

  const tipoLabel: Record<string, string> = {
    entrada: 'Entrada',
    saida: 'Saída',
    ajuste: 'Ajuste',
  };

  if (loading) return <div className="p-10 text-center text-gray-500">Carregando...</div>;

  const baixo = products.filter((p) => p.estoque <= p.minimo);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Estoque</h1>
          <p className="text-sm text-gray-600">Controle de entradas e saídas de produtos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-gray-900 font-bold px-4 py-2 rounded-lg transition"
        >
          <SlidersHorizontal size={18} /> Movimentar
        </button>
      </div>

      {/* Alertas */}
      {baixo.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-amber-800 flex items-center gap-2 mb-2">
            <AlertTriangle size={16} /> {baixo.length} produto(s) com estoque abaixo do mínimo
          </p>
          <div className="flex flex-wrap gap-2">
            {baixo.map((p) => (
              <span key={p.id} className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                {p.nome}: {p.estoque}/{p.minimo}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tabela de produtos com estoque */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Estoque atual por produto</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Categoria</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Estoque</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Mínimo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhum produto cadastrado</td>
              </tr>
            ) : (
              products.map((p) => {
                const low = p.estoque <= p.minimo;
                return (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{p.nome}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-2 py-0.5 text-xs bg-amber-100 text-amber-800 rounded-full">{p.categoria}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold">
                      <span className={low ? 'text-red-600' : 'text-gray-900'}>{p.estoque}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{p.minimo}</td>
                    <td className="px-6 py-4">
                      {low ? (
                        <span className="inline-flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full font-medium">
                          <AlertTriangle size={12} /> Baixo
                        </span>
                      ) : (
                        <span className="inline-flex text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">OK</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Histórico de movimentações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Histórico de Movimentações</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Produto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Qtd</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase">Motivo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {movements.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">Nenhuma movimentação registrada</td>
              </tr>
            ) : (
              movements.map((m) => (
                <tr key={m.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(m.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{m.product.nome}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${tipoCor[m.tipo] ?? ''}`}>
                      {m.tipo === 'entrada' ? <ArrowUpCircle size={12} /> : m.tipo === 'saida' ? <ArrowDownCircle size={12} /> : null}
                      {tipoLabel[m.tipo] ?? m.tipo}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{m.qty}</td>
                  <td className="px-6 py-4 text-sm text-gray-500">{m.motivo ?? '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de movimentação */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold text-gray-900 mb-5">Nova Movimentação</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Produto</label>
                <select
                  value={form.productId}
                  onChange={(e) => setForm({ ...form, productId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="">Selecione um produto</option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome} (estoque: {p.estoque})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  <option value="entrada">Entrada</option>
                  <option value="saida">Saída</option>
                  <option value="ajuste">Ajuste</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantidade</label>
                <input
                  type="number"
                  min={1}
                  value={form.qty}
                  onChange={(e) => setForm({ ...form, qty: Number(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Motivo (opcional)</label>
                <input
                  type="text"
                  value={form.motivo}
                  onChange={(e) => setForm({ ...form, motivo: e.target.value })}
                  placeholder="Ex: compra, perda, ajuste de inventário..."
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-400 to-amber-500 text-gray-900 font-bold rounded-lg hover:from-amber-500 hover:to-amber-600 transition"
              >
                Registrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
