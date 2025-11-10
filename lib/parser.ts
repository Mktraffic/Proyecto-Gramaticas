import { Grammar, ParseResult, DerivationTreeNode } from '@/types/grammar';

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
    if (this.grammar.type === 'Tipo 3') {
      return this.parseType3(input);
    } else {
      return this.parseType2(input);
    }
  }

  /**
   * Parser para Gramáticas Regulares (Tipo 3)
   * Usa un enfoque de análisis bottom-up con búsqueda en anchura
   */
  private parseType3(input: string): ParseResult {
    const steps: string[] = [];
    
    // Caso especial: cadena vacía
    if (input === '') {
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

    // BFS para encontrar derivación
    interface State {
      current: string;
      tree: DerivationTreeNode;
      derivation: string[];
    }

    const queue: State[] = [{
      current: this.grammar.startSymbol,
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

    while (queue.length > 0 && iterations < maxIterations) {
      iterations++;
      const state = queue.shift()!;
      
      if (visited.has(state.current)) continue;
      visited.add(state.current);

      // Si la cadena actual coincide con la entrada, éxito
      if (state.current === input) {
        return {
          accepted: true,
          derivationTree: state.tree,
          steps: state.derivation,
          message: 'Cadena aceptada'
        };
      }

      // Si la cadena es más larga que la entrada, no continuar
      if (state.current.length > input.length) continue;

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
          const rightSide = prod.right === 'ε' ? '' : prod.right;
          const newCurrent = 
            state.current.substring(0, nonTerminalIndex) + 
            rightSide + 
            state.current.substring(nonTerminalIndex + 1);

          // Crear nuevo nodo del árbol
          const newChildren: DerivationTreeNode[] = [];
          for (const char of rightSide) {
            newChildren.push({
              symbol: char,
              children: [],
              isTerminal: this.grammar.terminals.includes(char)
            });
          }

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
  private parseType2(input: string): ParseResult {
    // Caso especial: cadena vacía
    if (input === '') {
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

    // BFS con derivación más izquierda
    interface State {
      sententialForm: string;
      tree: DerivationTreeNode;
      steps: string[];
    }

    const queue: State[] = [{
      sententialForm: this.grammar.startSymbol,
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
      
      const stateKey = state.sententialForm;
      if (visited.has(stateKey)) continue;
      visited.add(stateKey);

      // Verificar si llegamos a la cadena objetivo
      if (state.sententialForm === input) {
        return {
          accepted: true,
          derivationTree: state.tree,
          steps: state.steps,
          message: 'Cadena aceptada'
        };
      }

      // Si solo quedan terminales y no coincide, descartar
      const hasNonTerminal = state.sententialForm.split('').some(
        char => this.grammar.nonTerminals.includes(char)
      );
      
      if (!hasNonTerminal) continue;

      // Limitar longitud para evitar explosión
      if (state.sententialForm.length > input.length * 2) continue;

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
          const rightSide = prod.right === 'ε' ? '' : prod.right;
          
          const newSententialForm = 
            state.sententialForm.substring(0, firstNonTerminalIndex) +
            rightSide +
            state.sententialForm.substring(firstNonTerminalIndex + 1);

          // Construir hijos del árbol
          const newChildren: DerivationTreeNode[] = [];
          for (const char of rightSide) {
            newChildren.push({
              symbol: char,
              children: [],
              isTerminal: this.grammar.terminals.includes(char)
            });
          }

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
