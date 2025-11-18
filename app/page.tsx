'use client';

import React, { useState } from 'react';
import { Grammar, ParseResult } from '@/types/grammar';
import { GrammarParser } from '@/lib/parser';
import { StringGenerator } from '@/lib/generator';
import {
  exportGrammarToJSON,
  importGrammarFromJSON,
  downloadGrammar,
  readFileAsText,
  exampleGrammars
} from '@/lib/grammarUtils';
import GrammarForm from '@/components/GrammarForm';
import DerivationTree from '@/components/DerivationTree';

export default function Home() {
  const [currentGrammar, setCurrentGrammar] = useState<Grammar | null>(null);
  const [showForm, setShowForm] = useState(true);
  const [inputString, setInputString] = useState('');
  const [parseResult, setParseResult] = useState<ParseResult | null>(null);
  const [generatedStrings, setGeneratedStrings] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'parse' | 'generate'>('parse');

  const handleSaveGrammar = (grammar: Grammar) => {
    setCurrentGrammar(grammar);
    setShowForm(false);
    setParseResult(null);
    setGeneratedStrings([]);
  };

  const handleLoadExample = (grammar: Grammar) => {
    setCurrentGrammar(grammar);
    setShowForm(false);
    setParseResult(null);
    setGeneratedStrings([]);
  };

  const handleDownload = () => {
    if (currentGrammar) {
      downloadGrammar(currentGrammar);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const content = await readFileAsText(file);
        const grammar = importGrammarFromJSON(content);
        setCurrentGrammar(grammar);
        setShowForm(false);
        setParseResult(null);
        setGeneratedStrings([]);
        alert('Gramática cargada exitosamente');
      } catch (error) {
        alert(`Error al cargar gramática: ${error instanceof Error ? error.message : 'Error desconocido'}`);
      }
    }
  };

  const handleParse = () => {
    if (!currentGrammar) return;

    const parser = new GrammarParser(currentGrammar);
    const result = parser.parse(inputString);
    setParseResult(result);
  };

  const handleGenerate = () => {
    if (!currentGrammar) return;

    const generator = new StringGenerator(currentGrammar);
    const strings = generator.generateStrings(10);
    setGeneratedStrings(strings.map(s => s.value));
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Analizador de Gramáticas Formales
          </h1>
          <p className="text-gray-600">
            Gramáticas Regulares (Tipo 3) y Libres de Contexto (Tipo 2)
          </p>
        </header>

        {/* Grammar Examples */}
        <div className="mb-6 bg-white rounded-lg shadow-lg p-4">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Gramáticas de Ejemplo:</h3>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setCurrentGrammar(null);
                setShowForm(true);
                setParseResult(null);
                setGeneratedStrings([]);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
            >
              ✏️ Nueva Gramática
            </button>
            {exampleGrammars.map((grammar, index) => (
              <button
                key={index}
                onClick={() => handleLoadExample(grammar)}
                className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
              >
                {grammar.name}
              </button>
            ))}
          </div>
        </div>

        {/* Current Grammar Display */}
        {currentGrammar && !showForm && (
          <div className="mb-6 bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{currentGrammar.name}</h2>
                <p className="text-gray-600">{currentGrammar.type}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  💾 Guardar
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  ✏️ Editar
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-gray-700">No Terminales (N):</strong>
                <span className="ml-2 text-gray-600">{currentGrammar.nonTerminals.join(', ')}</span>
              </div>
              <div>
                <strong className="text-gray-700">Terminales (T):</strong>
                <span className="ml-2 text-gray-600">{currentGrammar.terminals.join(', ')}</span>
              </div>
              <div>
                <strong className="text-gray-700">Símbolo Inicial (S):</strong>
                <span className="ml-2 text-gray-600">{currentGrammar.startSymbol}</span>
              </div>
            </div>

            <div className="mt-4">
              <strong className="text-gray-700">Producciones (P):</strong>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {currentGrammar.productions.map((prod, index) => (
                  <div key={index} className="bg-gray-50 px-3 py-2 rounded border border-gray-200">
                    <code className="text-sm">
                      {prod.left} → {prod.right || 'ε'}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Form or Actions */}
          <div className="lg:col-span-1">
            {showForm || !currentGrammar ? (
              <div>
                <GrammarForm onSave={handleSaveGrammar} initialGrammar={currentGrammar || undefined} />
                
                <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Cargar Gramática</h3>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Operations */}
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">Cargar Gramática</h3>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileUpload}
                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                </div>

                {/* Info Card */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">💡 Instrucciones</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Use "ε" para cadena vacía</li>
                    <li>• El parser usa BFS para encontrar derivaciones</li>
                    <li>• Las cadenas generadas se ordenan por longitud</li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Parser and Generator */}
          {currentGrammar && !showForm && (
            <div className="lg:col-span-2">
              {/* Tabs */}
              <div className="flex mb-4 bg-white rounded-t-lg shadow-lg overflow-hidden">
                <button
                  onClick={() => setActiveTab('parse')}
                  className={`flex-1 py-3 px-4 font-semibold transition-colors ${
                    activeTab === 'parse'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  🔍 Analizar Cadena
                </button>
                <button
                  onClick={() => setActiveTab('generate')}
                  className={`flex-1 py-3 px-4 font-semibold transition-colors ${
                    activeTab === 'generate'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  ⚡ Generar Cadenas
                </button>
              </div>

              {/* Parse Tab */}
              {activeTab === 'parse' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Analizar Cadena (Parser)
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={inputString}
                        onChange={(e) => setInputString(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ingrese la cadena a analizar (use ε para vacía)"
                      />
                      <button
                        onClick={handleParse}
                        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-semibold"
                      >
                        Analizar
                      </button>
                    </div>
                  </div>

                  {/* Parse Result */}
                  {parseResult && (
                    <div>
                      <div
                        className={`p-6 rounded-lg shadow-lg mb-6 ${
                          parseResult.accepted
                            ? 'bg-green-50 border-2 border-green-300'
                            : 'bg-red-50 border-2 border-red-300'
                        }`}
                      >
                        <h3
                          className={`text-xl font-bold mb-2 ${
                            parseResult.accepted ? 'text-green-800' : 'text-red-800'
                          }`}
                        >
                          {parseResult.accepted ? '✅ ACEPTADA' : '❌ RECHAZADA'}
                        </h3>
                        <p
                          className={`${
                            parseResult.accepted ? 'text-green-700' : 'text-red-700'
                          }`}
                        >
                          {parseResult.message}
                        </p>

                        {parseResult.steps && parseResult.steps.length > 0 && (
                          <div className="mt-4">
                            <h4 className="font-semibold text-gray-800 mb-2">
                              Pasos de Derivación:
                            </h4>
                            <div className="bg-white rounded p-3 max-h-48 overflow-y-auto">
                              {parseResult.steps.map((step, index) => (
                                <div key={index} className="text-sm text-gray-700 font-mono">
                                  {index + 1}. {step}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Derivation Tree */}
                      {parseResult.accepted && parseResult.derivationTree && (
                        <DerivationTree tree={parseResult.derivationTree} />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Generate Tab */}
              {activeTab === 'generate' && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800">
                      Generar Cadenas
                    </h3>
                    <button
                      onClick={handleGenerate}
                      className="w-full px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-semibold"
                    >
                      Generar 10 Cadenas Más Cortas
                    </button>
                  </div>

                  {/* Generated Strings */}
                  {generatedStrings.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                      <h3 className="text-xl font-semibold mb-4 text-gray-800">
                        Cadenas Generadas (ordenadas por longitud)
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {generatedStrings.map((str, index) => (
                          <div
                            key={index}
                            className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4"
                          >
                            <div className="flex justify-between items-center">
                              <span className="text-sm text-gray-600 font-semibold">
                                #{index + 1}
                              </span>
                              <span className="text-xs text-gray-500">
                                Longitud: {str === 'ε' ? 0 : str.length}
                              </span>
                            </div>
                            <code className="text-lg font-mono text-gray-800 block mt-2">
                              {str}
                            </code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-600 text-sm">
          <p>
            Aplicación de Análisis de Gramáticas Formales - UPTC
          </p>
          <p className="mt-1">
            Teoría de Lenguajes Formales y Autómatas
          </p>
        </footer>
      </div>
    </div>
  );
}
