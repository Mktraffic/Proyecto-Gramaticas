'use client';

import React, { useState } from 'react';
import { Grammar, GrammarType, Production } from '@/types/grammar';
import { validateType2Grammar, validateType3Grammar } from '@/lib/grammarUtils';

interface GrammarFormProps {
  onSave: (grammar: Grammar) => void;
  initialGrammar?: Grammar;
}

/**
 * Formulario para definir y editar gramáticas
 */
export default function GrammarForm({ onSave, initialGrammar }: GrammarFormProps) {
  const [name, setName] = useState(initialGrammar?.name || '');
  const [type, setType] = useState<GrammarType>(initialGrammar?.type || 'Tipo 2');
  const [nonTerminals, setNonTerminals] = useState(
    initialGrammar?.nonTerminals.join(', ') || ''
  );
  const [terminals, setTerminals] = useState(
    initialGrammar?.terminals.join(', ') || ''
  );
  const [startSymbol, setStartSymbol] = useState(initialGrammar?.startSymbol || '');
  const [productions, setProductions] = useState<Production[]>(
    initialGrammar?.productions || [{ left: '', right: '' }]
  );
  const [errors, setErrors] = useState<string[]>([]);

  const handleAddProduction = () => {
    setProductions([...productions, { left: '', right: '' }]);
  };

  const handleRemoveProduction = (index: number) => {
    setProductions(productions.filter((_, i) => i !== index));
  };

  const handleProductionChange = (
    index: number,
    field: 'left' | 'right',
    value: string
  ) => {
    const newProductions = [...productions];
    newProductions[index][field] = value;
    setProductions(newProductions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors([]);

    // Validaciones básicas
    const validationErrors: string[] = [];

    if (!name.trim()) {
      validationErrors.push('El nombre es obligatorio');
    }

    const nonTerminalsArray = nonTerminals
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const terminalsArray = terminals
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (nonTerminalsArray.length === 0) {
      validationErrors.push('Debe definir al menos un no terminal');
    }

    if (terminalsArray.length === 0) {
      validationErrors.push('Debe definir al menos un terminal');
    }

    if (!startSymbol.trim()) {
      validationErrors.push('Debe especificar el símbolo inicial');
    }

    if (!nonTerminalsArray.includes(startSymbol.trim())) {
      validationErrors.push('El símbolo inicial debe estar en los no terminales');
    }

    if (productions.length === 0 || productions.every(p => !p.left || !p.right)) {
      validationErrors.push('Debe definir al menos una producción válida');
    }

    // Validar producciones
    const validProductions = productions.filter(p => p.left.trim() && p.right !== undefined);
    
    for (const prod of validProductions) {
      if (!nonTerminalsArray.includes(prod.left.trim())) {
        validationErrors.push(
          `La producción "${prod.left} → ${prod.right}" tiene un no terminal no definido en el lado izquierdo`
        );
      }
    }

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Crear gramática
    const grammar: Grammar = {
      name: name.trim(),
      type,
      nonTerminals: nonTerminalsArray,
      terminals: terminalsArray,
      productions: validProductions.map(p => ({
        left: p.left.trim(),
        right: p.right.trim()
      })),
      startSymbol: startSymbol.trim()
    };

    // Validar según el tipo
    if (type === 'Tipo 3') {
      const validation = validateType3Grammar(grammar);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }
    } else {
      const validation = validateType2Grammar(grammar);
      if (!validation.valid) {
        setErrors(validation.errors);
        return;
      }
    }

    onSave(grammar);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800">Definir Gramática</h2>

      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Errores de validación:</h3>
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-red-700 text-sm">{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre de la Gramática
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ej. Expresiones Aritméticas"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tipo de Gramática
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as GrammarType)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Tipo 2">Tipo 2 - Libre de Contexto</option>
          <option value="Tipo 3">Tipo 3 - Regular</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          No Terminales (N) - separados por comas
        </label>
        <input
          type="text"
          value={nonTerminals}
          onChange={(e) => setNonTerminals(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ej. S, A, B"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Terminales (T) - separados por comas
        </label>
        <input
          type="text"
          value={terminals}
          onChange={(e) => setTerminals(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ej. a, b, 0, 1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Símbolo Inicial (S)
        </label>
        <input
          type="text"
          value={startSymbol}
          onChange={(e) => setStartSymbol(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="ej. S"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Producciones (P) - use "ε" para cadena vacía
        </label>
        <div className="space-y-2">
          {productions.map((prod, index) => (
            <div key={index} className="flex gap-2 items-center">
              <input
                type="text"
                value={prod.left}
                onChange={(e) => handleProductionChange(index, 'left', e.target.value)}
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="A"
              />
              <span className="text-gray-600">→</span>
              <input
                type="text"
                value={prod.right}
                onChange={(e) => handleProductionChange(index, 'right', e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="aB"
              />
              <button
                type="button"
                onClick={() => handleRemoveProduction(index)}
                className="px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                disabled={productions.length === 1}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddProduction}
          className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
        >
          + Agregar Producción
        </button>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
      >
        Guardar Gramática
      </button>
    </form>
  );
}
