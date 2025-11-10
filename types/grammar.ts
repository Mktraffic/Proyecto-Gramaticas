/**
 * Tipos de gramáticas soportadas
 */
export type GrammarType = 'Tipo 2' | 'Tipo 3';

/**
 * Producción de una gramática
 * Representa una regla de reescritura de la forma: left -> right
 */
export interface Production {
  left: string;  // Lado izquierdo (no terminal)
  right: string; // Lado derecho (combinación de terminales y no terminales)
}

/**
 * Definición completa de una gramática formal
 * G = (N, T, P, S)
 */
export interface Grammar {
  name: string;              // Nombre identificador de la gramática
  type: GrammarType;         // Tipo 2 (Libre de Contexto) o Tipo 3 (Regular)
  nonTerminals: string[];    // N - Conjunto de símbolos no terminales
  terminals: string[];       // T - Alfabeto de símbolos terminales
  productions: Production[]; // P - Conjunto de reglas de producción
  startSymbol: string;       // S - Símbolo inicial
}

/**
 * Nodo del árbol de derivación
 */
export interface DerivationTreeNode {
  symbol: string;               // Símbolo en este nodo
  children: DerivationTreeNode[]; // Hijos del nodo
  isTerminal: boolean;          // true si es terminal, false si es no terminal
}

/**
 * Resultado del análisis de una cadena
 */
export interface ParseResult {
  accepted: boolean;            // true si la cadena pertenece al lenguaje
  derivationTree?: DerivationTreeNode; // Árbol de derivación (solo si accepted es true)
  steps?: string[];             // Pasos de derivación
  message?: string;             // Mensaje descriptivo del resultado
}

/**
 * Cadena generada con su longitud
 */
export interface GeneratedString {
  value: string;
  length: number;
}
