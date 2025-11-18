import { Grammar, ParseResult, DerivationTreeNode } from '@/types/grammar';
import { splitToSymbols, joinSymbols } from '@/lib/grammarUtils';

/**
 * Clase para el análisis sintáctico de gramáticas
 * Implementa algoritmos de parsing para Gramáticas Regulares (Tipo 3) y Libres de Contexto (Tipo 2)
 */
export class GrammarParser {
  private grammar: Grammar;

  constructor(grammar: Grammar) {
    this.grammar = grammar;
  }

  /**
   * Analiza si una cadena pertenece al lenguaje definido por la gramática
   * @param input Cadena de entrada a analizar
   * @returns Resultado del análisis con árbol de derivación si es aceptada
   */
  parse(input: string): ParseResult {
    const normalized = input === 'ε' ? '' : input.replace(/\s+/g, '');
    const inputTokens = splitToSymbols(normalized, this.grammar);
    if (inputTokens === null) {
      return { accepted: false, message: 'No se pudo tokenizar la entrada con los terminales definidos' };
    }

    if (this.grammar.type === 'Tipo 3') {
      return this.parseType3(inputTokens);
    } else {
      return this.parseType2(inputTokens);
    }
  }

  /**
   * Parser para Gramáticas Regulares (Tipo 3)
   * Usa un enfoque de análisis bottom-up con búsqueda en anchura
   */
  private parseType3(inputTokens: string[]): ParseResult {
    const steps: string[] = [];

    // Caso especial: cadena vacía
    if (inputTokens.length === 0) {
      const hasEmptyProduction = this.grammar.productions.some(
        p => p.left === this.grammar.startSymbol && (p.right === '' || p.right === 'ε')
      );

      if (hasEmptyProduction) {
        const tree: DerivationTreeNode = {
          symbol: this.grammar.startSymbol,
          children: [{
            symbol: 'ε',
            children: [],
            isTerminal: true
          }],
          isTerminal: false
        };
        return {
          accepted: true,
          derivationTree: tree,
          steps: [this.grammar.startSymbol + ' → ε'],
          message: 'Cadena vacía aceptada'
        };
      }
      return { accepted: false, message: 'Cadena vacía no aceptada por esta gramática' };
    }

    interface State {
      current: string[];
      tree: DerivationTreeNode;
      derivation: string[];
    }

    const queue: State[] = [{
      current: [this.grammar.startSymbol],
      tree: {
        symbol: this.grammar.startSymbol,
        children: [],
        isTerminal: false
      },
      derivation: [this.grammar.startSymbol]
    }];

    const visited = new Set<string>();
    let iterations = 0;
    const maxIterations = 10000;

    const countTerminalTokens = (tokens: string[]) => tokens.reduce((acc, t) => acc + (this.grammar.terminals.includes(t) ? 1 : 0), 0);

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      const state = queue.shift()!;

      const stateKey = state.current.join(' ');
      if (visited.has(stateKey)) continue;
      visited.add(stateKey);

      // Si la cadena actual coincide con la entrada, éxito
      if (joinSymbols(state.current) === joinSymbols(inputTokens)) {
        return {
          accepted: true,
          derivationTree: state.tree,
          steps: state.derivation,
          message: 'Cadena aceptada'
        };
      }

      // Si la cantidad de terminales supera la de la entrada, no continuar
      if (countTerminalTokens(state.current) > inputTokens.length) continue;

      // Encontrar el primer no terminal
      let nonTerminalIndex = -1;
      let nonTerminal = '';
      
      for (let i = 0; i < state.current.length; i++) {
        if (this.grammar.nonTerminals.includes(state.current[i])) {
          nonTerminalIndex = i;
          nonTerminal = state.current[i];
          break;
        }
      }

      if (nonTerminalIndex === -1) continue;

      // Aplicar todas las producciones posibles
      for (const prod of this.grammar.productions) {
        if (prod.left === nonTerminal) {
          const rightTokens = splitToSymbols(prod.right, this.grammar) || [];
          const newCurrent = [
            ...state.current.slice(0, nonTerminalIndex),
            ...rightTokens,
            ...state.current.slice(nonTerminalIndex + 1)
          ];

          // Crear nuevo nodo del árbol
          const newChildren: DerivationTreeNode[] = rightTokens.map(tok => ({
            symbol: tok,
            children: [],
            isTerminal: this.grammar.terminals.includes(tok)
          }));

          const newTree = JSON.parse(JSON.stringify(state.tree));
          this.updateTree(newTree, nonTerminal, newChildren);

          queue.push({
            current: newCurrent,
            tree: newTree,
            derivation: [...state.derivation, `${prod.left} → ${prod.right}`]
          });
        }
      }
    }

    return {
      accepted: false,
      message: iterations >= maxIterations
        ? 'Límite de iteraciones alcanzado'
        : 'Cadena no pertenece al lenguaje'
    };
  }

  /**
   * Parser para Gramáticas Libres de Contexto (Tipo 2)
   * Implementa un parser CYK modificado y búsqueda en anchura
   */
  private parseType2(inputTokens: string[]): ParseResult {
    // Caso especial: cadena vacía
    if (inputTokens.length === 0) {
      const hasEmptyProduction = this.grammar.productions.some(
        p => p.left === this.grammar.startSymbol && (p.right === '' || p.right === 'ε')
      );

      if (hasEmptyProduction) {
        const tree: DerivationTreeNode = {
          symbol: this.grammar.startSymbol,
          children: [{
            symbol: 'ε',
            children: [],
            isTerminal: true
          }],
          isTerminal: false
        };
        return {
          accepted: true,
          derivationTree: tree,
          steps: [this.grammar.startSymbol + ' → ε'],
          message: 'Cadena vacía aceptada'
        };
      }
      return { accepted: false, message: 'Cadena vacía no aceptada por esta gramática' };
    }

    interface State {
      sententialForm: string[];
      tree: DerivationTreeNode;
      steps: string[];
    }

    const queue: State[] = [{
      sententialForm: [this.grammar.startSymbol],
      tree: {
        symbol: this.grammar.startSymbol,
        children: [],
        isTerminal: false
      },
      steps: [this.grammar.startSymbol]
    }];

    const visited = new Set<string>();
    let iterations = 0;
    const maxIterations = 10000;

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      const state = queue.shift()!;
      
      const stateKey = state.sententialForm.join(' ');
      if (visited.has(stateKey)) continue;
      visited.add(stateKey);

      // Verificar si llegamos a la cadena objetivo
      if (joinSymbols(state.sententialForm) === joinSymbols(inputTokens)) {
        return {
          accepted: true,
          derivationTree: state.tree,
          steps: state.steps,
          message: 'Cadena aceptada'
        };
      }

      // Si solo quedan terminales y no coincide, descartar
      const hasNonTerminal = state.sententialForm.some(
        token => this.grammar.nonTerminals.includes(token)
      );
      
      if (!hasNonTerminal) continue;

      // Limitar longitud para evitar explosión (en tokens)
      if (state.sententialForm.length > inputTokens.length * 2) continue;

      // Encontrar el primer no terminal (derivación más izquierda)
      let firstNonTerminal = '';
      let firstNonTerminalIndex = -1;
      
      for (let i = 0; i < state.sententialForm.length; i++) {
        if (this.grammar.nonTerminals.includes(state.sententialForm[i])) {
          firstNonTerminal = state.sententialForm[i];
          firstNonTerminalIndex = i;
          break;
        }
      }

      if (firstNonTerminal === '') continue;

      // Aplicar todas las producciones del primer no terminal
      for (const prod of this.grammar.productions) {
        if (prod.left === firstNonTerminal) {
          const rightTokens = splitToSymbols(prod.right, this.grammar) || [];
          
          const newSententialForm = [
            ...state.sententialForm.slice(0, firstNonTerminalIndex),
            ...rightTokens,
            ...state.sententialForm.slice(firstNonTerminalIndex + 1)
          ];

          // Construir hijos del árbol
          const newChildren: DerivationTreeNode[] = rightTokens.map(t => ({
            symbol: t,
            children: [],
            isTerminal: this.grammar.terminals.includes(t)
          }));

          // Clonar y actualizar árbol
          const newTree = JSON.parse(JSON.stringify(state.tree));
          this.updateTreeCFG(newTree, firstNonTerminal, newChildren);

          queue.push({
            sententialForm: newSententialForm,
            tree: newTree,
            steps: [...state.steps, `${prod.left} → ${prod.right}`]
          });
        }
      }
    }

    return {
      accepted: false,
      message: iterations >= maxIterations
        ? 'Límite de iteraciones alcanzado'
        : 'Cadena no pertenece al lenguaje'
    };
  }

  /**
   * Actualiza el árbol de derivación reemplazando el primer no terminal encontrado
   */
  private updateTree(node: DerivationTreeNode, target: string, newChildren: DerivationTreeNode[]): boolean {
    if (node.symbol === target && node.children.length === 0) {
      node.children = newChildren;
      return true;
    }

    for (const child of node.children) {
      if (this.updateTree(child, target, newChildren)) {
        return true;
      }
    }

    return false;
  }

  /**
   * Actualiza el árbol para gramáticas libres de contexto
   */
  private updateTreeCFG(node: DerivationTreeNode, target: string, newChildren: DerivationTreeNode[]): boolean {
    if (node.symbol === target && node.children.length === 0 && !node.isTerminal) {
      node.children = newChildren;
      return true;
    }

    for (const child of node.children) {
      if (this.updateTreeCFG(child, target, newChildren)) {
        return true;
      }
    }

    return false;
  }
}
