import { Grammar, GeneratedString } from '@/types/grammar';

/**
 * Generador de cadenas para gramáticas
 * Usa búsqueda en anchura (BFS) para generar las cadenas más cortas del lenguaje
 */
export class StringGenerator {
  private grammar: Grammar;

  constructor(grammar: Grammar) {
    this.grammar = grammar;
  }

  /**
   * Genera las primeras N cadenas más cortas del lenguaje
   * @param count Número de cadenas a generar (por defecto 10)
   * @returns Array de cadenas generadas ordenadas por longitud
   */
  generateStrings(count: number = 10): GeneratedString[] {
    const results: GeneratedString[] = [];
    const seen = new Set<string>();
    
    // Cola para BFS: [forma sentencial, profundidad]
    const queue: [string, number][] = [[this.grammar.startSymbol, 0]];
    
    let iterations = 0;
    const maxIterations = 50000;
    const maxDepth = 20;

    while (queue.length > 0 && results.length < count && iterations < maxIterations) {
      iterations++;
      const [current, depth] = queue.shift()!;

      // Limitar profundidad para evitar bucles infinitos
      if (depth > maxDepth) continue;

      // Verificar si es una cadena terminal (pertenece al lenguaje)
      if (this.isTerminalString(current)) {
        const value = current === '' ? 'ε' : current;
        
        if (!seen.has(value)) {
          seen.add(value);
          results.push({
            value: value,
            length: current.length
          });
        }
        
        if (results.length >= count) break;
        continue;
      }

      // Encontrar el primer no terminal
      let firstNonTerminal = '';
      let firstNonTerminalIndex = -1;

      for (let i = 0; i < current.length; i++) {
        if (this.grammar.nonTerminals.includes(current[i])) {
          firstNonTerminal = current[i];
          firstNonTerminalIndex = i;
          break;
        }
      }

      if (firstNonTerminal === '') continue;

      // Aplicar todas las producciones del primer no terminal
      const applicableProductions = this.grammar.productions.filter(
        p => p.left === firstNonTerminal
      );

      // Ordenar producciones por longitud del lado derecho (más cortas primero)
      applicableProductions.sort((a, b) => {
        const aLen = a.right === 'ε' ? 0 : a.right.length;
        const bLen = b.right === 'ε' ? 0 : b.right.length;
        return aLen - bLen;
      });

      for (const prod of applicableProductions) {
        const rightSide = prod.right === 'ε' ? '' : prod.right;
        
        const newString = 
          current.substring(0, firstNonTerminalIndex) +
          rightSide +
          current.substring(firstNonTerminalIndex + 1);

        // Solo agregar si no hemos visto esta forma sentencial
        if (!seen.has(newString)) {
          queue.push([newString, depth + 1]);
        }
      }
    }

    // Ordenar por longitud y luego alfabéticamente
    results.sort((a, b) => {
      if (a.length !== b.length) {
        return a.length - b.length;
      }
      return a.value.localeCompare(b.value);
    });

    return results.slice(0, count);
  }

  /**
   * Verifica si una cadena contiene solo símbolos terminales
   */
  private isTerminalString(str: string): boolean {
    if (str === '') return true; // Cadena vacía es válida
    
    for (const char of str) {
      if (!this.grammar.terminals.includes(char)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Genera todas las cadenas hasta una longitud máxima
   * @param maxLength Longitud máxima de las cadenas
   * @returns Array de cadenas generadas
   */
  generateUpToLength(maxLength: number): GeneratedString[] {
    const results: GeneratedString[] = [];
    const seen = new Set<string>();
    
    const queue: string[] = [this.grammar.startSymbol];
    let iterations = 0;
    const maxIterations = 50000;

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      const current = queue.shift()!;

      if (seen.has(current)) continue;
      seen.add(current);

      // Si es terminal y no excede la longitud máxima
      if (this.isTerminalString(current) && current.length <= maxLength) {
        const value = current === '' ? 'ε' : current;
        if (!results.some(r => r.value === value)) {
          results.push({
            value: value,
            length: current.length
          });
        }
        continue;
      }

      // Si ya es muy largo, no continuar
      if (current.length > maxLength * 2) continue;

      // Expandir con producciones
      for (let i = 0; i < current.length; i++) {
        if (this.grammar.nonTerminals.includes(current[i])) {
          const nonTerminal = current[i];
          
          for (const prod of this.grammar.productions) {
            if (prod.left === nonTerminal) {
              const rightSide = prod.right === 'ε' ? '' : prod.right;
              const newString = 
                current.substring(0, i) + rightSide + current.substring(i + 1);
              
              if (!seen.has(newString) && newString.length <= maxLength * 2) {
                queue.push(newString);
              }
            }
          }
          break; // Solo expandir el primer no terminal
        }
      }
    }

    // Ordenar resultados
    results.sort((a, b) => {
      if (a.length !== b.length) {
        return a.length - b.length;
      }
      return a.value.localeCompare(b.value);
    });

    return results;
  }
}
