'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Package } from 'lucide-react';

interface ReportData {
  vendasPorDia: { data: string; total: number; qtd: number }[];
  estoquePorCategoria: { categoria: string; qtd: number; valor: number }[];
  topProdutos: { nome: string; totalVendido: number; receita: number }[];
  resumo: { totalVendas: number; receitaTotal: number; ticketMedio: number };
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function RelatoriosClient() {
  const [data, setData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState('7');

  useEffect(() => {
    fetchReport();
  }, [periodo]);

  async function fetchReport() {
    setLoading(true);
    const res = await fetch(`/api/reports?dias=${periodo}`);
    if (res.ok) setData(await res.json());
    setLoading(false);
  }

  if (loading) return <div className="p-10 text-center text-gray-500">Carregando relatório...</div>;
  if (!data) return <div className="p-10 text-center text-gray-500">Erro ao carregar relatório.</div>;

  const maxVenda = Math.max(...data.vendasPorDia.map((d) => d.total), 1);
  const maxEstoque = Math.max(...data.estoquePorCategoria.map((c) => c.qtd), 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">Relatórios</h1>
          <p className="text-sm text-gray-600">Análise de vendas e estoque</p>
        </div>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
        >
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
        </select>
      </div>

      {/* Cards resumo */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-lg flex items-center justify-center mb-3">
            <TrendingUp size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{data.resumo.totalVendas}</p>
          <p className="text-sm text-gray-500 mt-1">Vendas no período</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center mb-3">
            <BarChart3 size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{fmt(data.resumo.receitaTotal)}</p>
          <p className="text-sm text-gray-500 mt-1">Receita total</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3">
            <Package size={20} />
          </div>
          <p className="text-2xl font-bold text-gray-900">{fmt(data.resumo.ticketMedio)}</p>
          <p className="text-sm text-gray-500 mt-1">Ticket médio</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vendas por dia */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Vendas por Dia</h2>
          {data.vendasPorDia.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nenhuma venda no período</p>
          ) : (
            <div className="space-y-3">
              {data.vendasPorDia.map((d) => (
                <div key={d.data}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{d.data}</span>
                    <span className="font-medium text-gray-900">{fmt(d.total)} ({d.qtd} venda{d.qtd !== 1 ? 's' : ''})</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full transition-all"
                      style={{ width: `${Math.round((d.total / maxVenda) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estoque por categoria */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-gray-900 mb-5">Estoque por Categoria</h2>
          {data.estoquePorCategoria.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nenhum produto cadastrado</p>
          ) : (
            <div className="space-y-3">
              {data.estoquePorCategoria.map((c) => (
                <div key={c.categoria}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{c.categoria}</span>
                    <span className="font-medium text-gray-900">{c.qtd} unid. — {fmt(c.valor)}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-400 to-blue-500 rounded-full transition-all"
                      style={{ width: `${Math.round((c.qtd / maxEstoque) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top produtos vendidos */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 lg:col-span-2">
          <h2 className="font-semibold text-gray-900 mb-4">Produtos Mais Vendidos</h2>
          {data.topProdutos.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-8">Nenhuma venda no período</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">#</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 uppercase">Produto</th>
                  <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase">Qtd vendida</th>
                  <th className="pb-3 text-right text-xs font-medium text-gray-500 uppercase">Receita</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.topProdutos.map((p, i) => (
                  <tr key={p.nome} className="py-3">
                    <td className="py-3 text-sm text-gray-400 font-medium">{i + 1}</td>
                    <td className="py-3 text-sm font-medium text-gray-900">{p.nome}</td>
                    <td className="py-3 text-sm text-gray-700 text-right">{p.totalVendido}</td>
                    <td className="py-3 text-sm font-semibold text-green-600 text-right">{fmt(p.receita)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
