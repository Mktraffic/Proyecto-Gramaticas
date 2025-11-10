import { Grammar } from '@/types/grammar';

/**
 * Utilidades para persistencia de gramáticas
 */

/**
 * Exporta una gramática a formato JSON
 * @param grammar Gramática a exportar
 * @returns String JSON de la gramática
 */
export function exportGrammarToJSON(grammar: Grammar): string {
  return JSON.stringify(grammar, null, 2);
}

/**
 * Importa una gramática desde formato JSON
 * @param jsonString String JSON con la gramática
 * @returns Gramática parseada
 * @throws Error si el JSON no es válido o no tiene la estructura correcta
 */
export function importGrammarFromJSON(jsonString: string): Grammar {
  try {
    const parsed = JSON.parse(jsonString);
    
    // Validar estructura
    if (!parsed.name || !parsed.type || !parsed.nonTerminals || 
        !parsed.terminals || !parsed.productions || !parsed.startSymbol) {
      throw new Error('Estructura de gramática inválida');
    }

    // Validar tipo
    if (parsed.type !== 'Tipo 2' && parsed.type !== 'Tipo 3') {
      throw new Error('Tipo de gramática debe ser "Tipo 2" o "Tipo 3"');
    }

    // Validar que el símbolo inicial esté en no terminales
    if (!parsed.nonTerminals.includes(parsed.startSymbol)) {
      throw new Error('El símbolo inicial debe estar en el conjunto de no terminales');
    }

    // Validar producciones
    for (const prod of parsed.productions) {
      if (!prod.left || prod.right === undefined) {
        throw new Error('Producción inválida: debe tener "left" y "right"');
      }
      
      if (!parsed.nonTerminals.includes(prod.left)) {
        throw new Error(`El lado izquierdo "${prod.left}" no está en no terminales`);
      }
    }

    return parsed as Grammar;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error al importar gramática: ${error.message}`);
    }
    throw new Error('Error desconocido al importar gramática');
  }
}

/**
 * Descarga una gramática como archivo JSON
 * @param grammar Gramática a descargar
 */
export function downloadGrammar(grammar: Grammar): void {
  const json = exportGrammarToJSON(grammar);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${grammar.name.replace(/\s+/g, '_')}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Lee un archivo y retorna su contenido como string
 * @param file Archivo a leer
 * @returns Promise con el contenido del archivo
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('No se pudo leer el archivo'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsText(file);
  });
}

/**
 * Valida que una gramática sea de Tipo 3 (Regular)
 * Las producciones deben ser de la forma:
 * - A → aB o A → a (lineal derecha)
 * - A → Ba o A → a (lineal izquierda)
 * - A → ε
 */
export function validateType3Grammar(grammar: Grammar): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const prod of grammar.productions) {
    const right = prod.right;
    
    // Permitir producción vacía
    if (right === 'ε' || right === '') continue;

    // Verificar longitud (máximo 2 símbolos)
    if (right.length > 2) {
      errors.push(`Producción ${prod.left} → ${prod.right}: demasiado larga para Tipo 3`);
      continue;
    }

    // Un símbolo: debe ser terminal
    if (right.length === 1) {
      if (!grammar.terminals.includes(right)) {
        errors.push(`Producción ${prod.left} → ${prod.right}: símbolo único debe ser terminal`);
      }
      continue;
    }

    // Dos símbolos: terminal + no terminal o no terminal + terminal
    if (right.length === 2) {
      const first = right[0];
      const second = right[1];
      
      const isValidRight = grammar.terminals.includes(first) && grammar.nonTerminals.includes(second);
      const isValidLeft = grammar.nonTerminals.includes(first) && grammar.terminals.includes(second);
      
      if (!isValidRight && !isValidLeft) {
        errors.push(`Producción ${prod.left} → ${prod.right}: debe ser (terminal)(no-terminal) o (no-terminal)(terminal)`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Valida que una gramática sea de Tipo 2 (Libre de Contexto)
 * El lado izquierdo debe ser un único no terminal
 */
export function validateType2Grammar(grammar: Grammar): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const prod of grammar.productions) {
    // El lado izquierdo debe ser un único no terminal
    if (prod.left.length !== 1) {
      errors.push(`Producción ${prod.left} → ${prod.right}: lado izquierdo debe ser un único símbolo`);
      continue;
    }

    if (!grammar.nonTerminals.includes(prod.left)) {
      errors.push(`Producción ${prod.left} → ${prod.right}: lado izquierdo debe ser no terminal`);
    }

    // El lado derecho puede ser cualquier combinación (no hay restricción para Tipo 2)
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Gramáticas de ejemplo predefinidas
 */
export const exampleGrammars: Grammar[] = [
  {
    name: 'Números Binarios',
    type: 'Tipo 3',
    nonTerminals: ['S', 'A'],
    terminals: ['0', '1'],
    productions: [
      { left: 'S', right: '0A' },
      { left: 'S', right: '1A' },
      { left: 'A', right: '0A' },
      { left: 'A', right: '1A' },
      { left: 'A', right: 'ε' }
    ],
    startSymbol: 'S'
  },
  {
    name: 'Palíndromos',
    type: 'Tipo 2',
    nonTerminals: ['S'],
    terminals: ['a', 'b'],
    productions: [
      { left: 'S', right: 'aSa' },
      { left: 'S', right: 'bSb' },
      { left: 'S', right: 'a' },
      { left: 'S', right: 'b' },
      { left: 'S', right: 'ε' }
    ],
    startSymbol: 'S'
  },
  {
    name: 'Expresiones Aritméticas',
    type: 'Tipo 2',
    nonTerminals: ['E', 'T', 'F'],
    terminals: ['id', '+', '*', '(', ')'],
    productions: [
      { left: 'E', right: 'E+T' },
      { left: 'E', right: 'T' },
      { left: 'T', right: 'T*F' },
      { left: 'T', right: 'F' },
      { left: 'F', right: '(E)' },
      { left: 'F', right: 'id' }
    ],
    startSymbol: 'E'
  },
  {
    name: 'a^n b^n',
    type: 'Tipo 2',
    nonTerminals: ['S'],
    terminals: ['a', 'b'],
    productions: [
      { left: 'S', right: 'aSb' },
      { left: 'S', right: 'ε' }
    ],
    startSymbol: 'S'
  }
];
