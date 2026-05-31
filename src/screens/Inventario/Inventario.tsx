/**
 * ============================================================
 * INVENTÁRIO — EPI (Personal Protective Equipment) registry
 * ============================================================
 * Displays a table of registered EPIs with CRUD capabilities
 * and a modal for adding new items.
 */

import { useEffect, useState } from "react";
import { Sidebar } from "../../components/Sidebar";
import {
  createInventoryItem,
  deleteInventoryItem,
  getInventoryItems,
  updateInventoryItem,
} from "../../services/inventoryService";
import type { InventoryItem } from "../../types";

const EMPTY_FORM = {
  name: "",
  category: "",
  quantity: 0,
  unit: "un",
  status: "available" as InventoryItem["status"],
};

export function Inventario() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getInventoryItems()
      .then(setItems)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Erro ao carregar inventário.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const openAddForm = () => {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setShowForm(true);
  };

  const openEditForm = (item: InventoryItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity,
      unit: item.unit,
      status: item.status,
    });
    setShowForm(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      if (editingItem) {
        const updated = await updateInventoryItem(editingItem.id, formData);
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? updated : i))
        );
      } else {
        const created = await createInventoryItem(formData);
        setItems((prev) => [created, ...prev]);
      }
      setShowForm(false);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao salvar item.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Remover este item?")) return;

    try {
      await deleteInventoryItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Erro ao remover item.");
    }
  };

  return (
    <main className="min-h-screen w-full bg-[#1a1a1a]">
      <div className="flex min-h-screen w-full">
        <Sidebar activePath="/inventario" />

        <section className="flex-1 overflow-auto px-8 py-6">
          <div className="mb-6 flex items-center justify-between">
            <header>
              <h1 className="[font-family:'Merriweather',Helvetica] text-3xl font-extrabold text-white">
                Inventário
              </h1>
              <p className="mt-1 [font-family:'Merriweather',Helvetica] text-sm text-gray-400">
                Painel de EPI's registrados
              </p>
            </header>
            <div className="text-right">
              <p className="[font-family:'Merriweather',Helvetica] text-xs text-gray-400">
                Total de EPI's registrados:
              </p>
              <p className="[font-family:'Merriweather',Helvetica] text-2xl font-bold text-white">
                {items.length}
              </p>
            </div>
          </div>

          {isLoading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-gray-700" />
              ))}
            </div>
          )}

          {error && !isLoading && (
            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}

          {!isLoading && (
            <div className="rounded-2xl border-4 border-[#8B4545] bg-white overflow-hidden">
              {/* Header with button */}
              <div className="flex items-center justify-between border-b border-gray-200 p-4">
                <h2 className="[font-family:'Merriweather',Helvetica] text-base font-bold text-[#8B4545]">
                  Painel de EPI's registrados
                </h2>
                <button
                  type="button"
                  onClick={openAddForm}
                  className="rounded-lg bg-[#8B4545] px-4 py-1.5 [font-family:'Merriweather',Helvetica] text-xs font-bold text-white transition-colors hover:bg-[#9b5555]"
                >
                  Registrar EPI's
                </button>
              </div>

              {/* Search bar */}
              <div className="border-b border-gray-200 p-3">
                <input
                  type="text"
                  placeholder="Pesquisar EPI..."
                  className="w-full rounded-lg border border-gray-300 bg-gray-50 px-3 py-1.5 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a] placeholder:text-gray-400"
                />
              </div>

              {/* Table */}
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    {["Nome dos EPIs", "CA", "Validade", "Estoque", "Ações"].map(
                      (col) => (
                        <th
                          key={col}
                          className="px-4 py-2 text-left [font-family:'Merriweather',Helvetica] text-[10px] font-bold text-[#8B4545]"
                        >
                          {col}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-4 py-6 text-center [font-family:'Merriweather',Helvetica] text-xs text-gray-400"
                      >
                        Nenhum item registrado.
                      </td>
                    </tr>
                  ) : (
                    items.map((item, idx) => (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-200 ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="px-4 py-2 [font-family:'Merriweather',Helvetica] text-[10px] text-[#1a1a1a]">
                          {item.name}
                        </td>
                        <td className="px-4 py-2 [font-family:'Merriweather',Helvetica] text-[10px] text-[#1a1a1a]">
                          {item.category}
                        </td>
                        <td className="px-4 py-2 [font-family:'Merriweather',Helvetica] text-[10px] text-[#1a1a1a]">
                          {item.lastUpdated.split("T")[0]}
                        </td>
                        <td className="px-4 py-2 [font-family:'Merriweather',Helvetica] text-[10px] text-[#1a1a1a]">
                          {item.quantity}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            type="button"
                            onClick={() => openEditForm(item)}
                            className="text-[9px] text-blue-500 underline hover:no-underline"
                          >
                            ✎
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(item.id)}
                            className="text-[9px] text-red-500 underline hover:no-underline"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>

      {/* Add/Edit Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="[font-family:'Merriweather',Helvetica] text-lg font-bold text-[#8B4545]">
                {editingItem ? "Editar EPI" : "Novo registro de EPI:"}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-xl text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="grid grid-cols-2 gap-4">
              {/* Nome do EPI */}
              <div>
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Nome do EPI:
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, name: e.target.value }))
                  }
                  placeholder="Capacete de Segurança SKA V-Gard"
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                />
              </div>

              {/* Type */}
              <div>
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Type:
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, category: e.target.value }))
                  }
                  placeholder="Capacete"
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                />
              </div>

              {/* Quantidade */}
              <div>
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Quantidade em estoque:
                </label>
                <input
                  type="number"
                  min={0}
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      quantity: Number(e.target.value),
                    }))
                  }
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                />
              </div>

              {/* Unit */}
              <div>
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Unidade:
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData((p) => ({ ...p, unit: e.target.value }))
                  }
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                />
              </div>

              {/* Fabricante */}
              <div className="col-span-2">
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Fabricante:
                </label>
                <input
                  type="text"
                  placeholder="MSA"
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                />
              </div>

              {/* Número da CA */}
              <div>
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Número da CA (Certificado de Aprovação):
                </label>
                <input
                  type="text"
                  placeholder="23304"
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                />
              </div>

              {/* Data de compra */}
              <div>
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Data de compra:
                </label>
                <input
                  type="text"
                  placeholder="18/03/2025"
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                />
              </div>

              {/* Custo unitário */}
              <div>
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Custo unitário (R$):
                </label>
                <input
                  type="text"
                  placeholder="85.00"
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                />
              </div>

              {/* Observação */}
              <div className="col-span-2">
                <label className="mb-1 block [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#1a1a1a]">
                  Observação:
                </label>
                <textarea
                  placeholder="Cap. Ajust."
                  className="w-full rounded-lg border-2 border-[#8B4545] px-3 py-2 [font-family:'Merriweather',Helvetica] text-xs text-[#1a1a1a]"
                  rows={2}
                />
              </div>

              {/* Action buttons */}
              <div className="col-span-2 flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 rounded-lg bg-[#8B4545] px-4 py-2 [font-family:'Merriweather',Helvetica] text-xs font-bold text-white transition-colors hover:bg-[#9b5555] disabled:opacity-60"
                >
                  {isSaving ? "Salvando..." : "Salvar registro"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-lg border-2 border-[#8B4545] bg-white px-4 py-2 [font-family:'Merriweather',Helvetica] text-xs font-bold text-[#8B4545] transition-colors hover:bg-gray-50"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
