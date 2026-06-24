'use client';

import Link from 'next/link';
import { Package, DollarSign, TrendingUp, AlertTriangle } from 'lucide-react';

interface Props {
  totalProdutos: number;
  valorEstoque: number;
  vendasHoje: number;
  vendasMes: number;
  produtosBaixo: { id: string; nome: string; estoque: number; minimo: number }[];
  vendasRecentes: { id: string; total: number; createdAt: string; itens: number }[];
}

function fmt(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function fmtData(iso: string) {
  return new Date(iso).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export function VisaoGeralClient({ totalProdutos, valorEstoque, vendasHoje, vendasMes, produtosBaixo, vendasRecentes }: Props) {
  const cards = [
    { label: 'Produtos cadastrados', value: String(totalProdutos), icon: Package, color: 'bg-blue-50 text-blue-600' },
    { label: 'Valor em estoque', value: fmt(valorEstoque), icon: DollarSign, color: 'bg-green-50 text-green-600' },
    { label: 'Vendas hoje', value: fmt(vendasHoje), icon: TrendingUp, color: 'bg-amber-50 text-amber-600' },
    { label: 'Vendas este mês', value: fmt(vendasMes), icon: TrendingUp, color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-1">Visão Geral</h1>
        <p className="text-sm text-gray-500">Resumo do seu negócio hoje</p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color}`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Alertas de estoque baixo */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-500" />
              Estoque Baixo
            </h2>
            <Link href="/dashboard/estoque" className="text-xs text-amber-600 hover:underline">Ver tudo</Link>
          </div>
          {produtosBaixo.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">Nenhum produto com estoque baixo 🎉</p>
          ) : (
            <ul className="space-y-2">
              {produtosBaixo.slice(0, 6).map((p) => (
                <li key={p.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <span className="text-sm text-gray-800">{p.nome}</span>
                  <span className="text-sm font-medium text-red-600">
                    {p.estoque} / {p.minimo} min
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Vendas recentes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Vendas Recentes</h2>
            <Link href="/dashboard/vendas" className="text-xs text-amber-600 hover:underline">Ver tudo</Link>
          </div>
          {vendasRecentes.length === 0 ? (
            <p className="text-sm text-gray-500 py-4 text-center">Nenhuma venda registrada ainda</p>
          ) : (
            <ul className="space-y-2">
              {vendasRecentes.map((v) => (
                <li key={v.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm text-gray-800">{v.itens} {v.itens === 1 ? 'item' : 'itens'}</p>
                    <p className="text-xs text-gray-400">{fmtData(v.createdAt)}</p>
                  </div>
                  <span className="text-sm font-semibold text-green-600">{fmt(v.total)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
