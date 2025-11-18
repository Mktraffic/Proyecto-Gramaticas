import { Grammar, GeneratedString } from '@/types/grammar';
import { splitToSymbols, joinSymbols } from '@/lib/grammarUtils';

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
    const seenForms = new Set<string>();
    const seenResults = new Set<string>();
    
    // Cola para BFS: [forma sentencial tokens, profundidad]
    const queue: [string[], number][] = [[[this.grammar.startSymbol], 0]];
    
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
        const display = joinSymbols(current) === '' ? 'ε' : joinSymbols(current);
        if (!seenResults.has(display)) {
          seenResults.add(display);
          results.push({
            value: display,
            length: display === 'ε' ? 0 : display.length
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
        const rightTokens = splitToSymbols(prod.right, this.grammar) || [];
        const newTokens = [
          ...current.slice(0, firstNonTerminalIndex),
          ...rightTokens,
          ...current.slice(firstNonTerminalIndex + 1)
        ];

        const key = newTokens.join(' ');
        if (!seenForms.has(key)) {
          seenForms.add(key);
          queue.push([newTokens, depth + 1]);
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
  private isTerminalString(tokens: string[] | string): boolean {
    if (typeof tokens === 'string') {
      const normalized = tokens === 'ε' ? '' : tokens.replace(/\s+/g, '');
      const tks = splitToSymbols(normalized, this.grammar);
      if (tks === null) return false;
      return tks.every(t => this.grammar.terminals.includes(t));
    }
    if (!Array.isArray(tokens)) return false;
    if (tokens.length === 0) return true;
    return tokens.every(t => this.grammar.terminals.includes(t));
  }

  /**
   * Genera todas las cadenas hasta una longitud máxima
   * @param maxLength Longitud máxima de las cadenas
   * @returns Array de cadenas generadas
   */
  generateUpToLength(maxLength: number): GeneratedString[] {
    const results: GeneratedString[] = [];
    const seen = new Set<string>();
    const seenValues = new Set<string>();

    const queue: string[][] = [[this.grammar.startSymbol]];
    let iterations = 0;
    const maxIterations = 50000;

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      const current = queue.shift()!;

      const key = current.join(' ');
      if (seen.has(key)) continue;
      seen.add(key);

      const display = joinSymbols(current) === '' ? 'ε' : joinSymbols(current);

      // Si es terminal y no excede la longitud máxima (en caracteres)
      if (this.isTerminalString(current) && display.length <= maxLength) {
        if (!seenValues.has(display)) {
          seenValues.add(display);
          results.push({ value: display, length: display === 'ε' ? 0 : display.length });
        }
        continue;
      }

      // Si ya es muy largo, no continuar (número de tokens)
      if (current.length > maxLength * 2) continue;

      // Expandir con producciones: expandir primer no terminal
      for (let i = 0; i < current.length; i++) {
        if (this.grammar.nonTerminals.includes(current[i])) {
          const nonTerminal = current[i];
          for (const prod of this.grammar.productions) {
            if (prod.left === nonTerminal) {
              const rightTokens = splitToSymbols(prod.right, this.grammar) || [];
              const newTokens = [
                ...current.slice(0, i),
                ...rightTokens,
                ...current.slice(i + 1)
              ];
              const newKey = newTokens.join(' ');
              if (!seen.has(newKey)) queue.push(newTokens);
            }
          }
          break; // Solo expandir el primer no terminal
        }
      }
    }

    // Ordenar resultados
    results.sort((a, b) => {
      if (a.length !== b.length) return a.length - b.length;
      return a.value.localeCompare(b.value);
    });

    return results;
  }
}
