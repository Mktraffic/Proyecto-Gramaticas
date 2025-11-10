# Documentación Técnica - Algoritmos Implementados

## 📚 Tabla de Contenidos
1. [Algoritmo de Parsing](#algoritmo-de-parsing)
2. [Generador de Cadenas](#generador-de-cadenas)
3. [Validación de Gramáticas](#validación-de-gramáticas)
4. [Construcción del Árbol de Derivación](#construcción-del-árbol-de-derivación)

---

## 1. Algoritmo de Parsing

### 1.1 Visión General

El parser implementa un enfoque de **búsqueda en anchura (BFS)** sobre el espacio de derivaciones posibles. Esta técnica garantiza que se encuentre la derivación más corta si existe.

### 1.2 Pseudocódigo

```
función parse(gramática, cadenaEntrada):
    cola ← [(símboloInicial, árbolInicial, [símboloInicial])]
    visitados ← conjunto vacío
    iteraciones ← 0
    
    mientras cola no esté vacía Y iteraciones < 10000:
        iteraciones++
        (formaActual, árbol, pasos) ← cola.sacar()
        
        si formaActual == cadenaEntrada:
            retornar ACEPTADA con árbol y pasos
        
        si formaActual en visitados:
            continuar
        
        agregar formaActual a visitados
        
        primerNoTerminal ← encontrarPrimerNoTerminal(formaActual)
        
        para cada producción donde producción.izq == primerNoTerminal:
            nuevaForma ← aplicarProducción(formaActual, producción)
            nuevoÁrbol ← clonarYActualizarÁrbol(árbol, producción)
            nuevosPasos ← pasos + [producción]
            
            cola.agregar((nuevaForma, nuevoÁrbol, nuevosPasos))
    
    retornar RECHAZADA
```

### 1.3 Complejidad

- **Tiempo:** O(V + E) donde V es el número de formas sentenciales distintas y E el número de derivaciones
- **Espacio:** O(V) para el conjunto de visitados
- **Limitación:** Máximo 10,000 iteraciones para evitar bucles infinitos

### 1.4 Optimizaciones Implementadas

1. **Conjunto de Visitados:** Evita procesar la misma forma sentencial múltiples veces
2. **Poda por Longitud:** Descarta formas sentenciales más largas que la entrada × 2
3. **Derivación Más Izquierda:** Para gramáticas Tipo 2, siempre expande el no terminal más a la izquierda

### 1.5 Ejemplo de Ejecución

**Gramática:** S → aSb | ε
**Entrada:** aabb

```
Iteración 1: S
  Aplicar S → aSb: aSb
  Aplicar S → ε: ε (descartado, no coincide)

Iteración 2: aSb
  Aplicar S → aSb: aaSbb
  Aplicar S → ε: ab (descartado, no coincide)

Iteración 3: aaSbb
  Aplicar S → aSb: aaaSbbb
  Aplicar S → ε: aabb ✅ ACEPTADA
```

---

## 2. Generador de Cadenas

### 2.1 Visión General

Genera las N cadenas más cortas del lenguaje usando BFS. Garantiza que las cadenas se generen en orden de longitud creciente.

### 2.2 Pseudocódigo

```
función generarCadenas(gramática, cantidad):
    resultados ← []
    cola ← [(símboloInicial, 0)]
    vistos ← conjunto vacío
    
    mientras cola no esté vacía Y |resultados| < cantidad:
        (formaActual, profundidad) ← cola.sacar()
        
        si profundidad > MAX_PROFUNDIDAD:
            continuar
        
        si esTerminal(formaActual):
            si formaActual no en vistos:
                agregar formaActual a resultados
                agregar formaActual a vistos
            continuar
        
        primerNoTerminal ← encontrarPrimerNoTerminal(formaActual)
        
        producciones ← filtrar(gramática.producciones, p => p.izq == primerNoTerminal)
        ordenar producciones por longitud de lado derecho
        
        para cada producción en producciones:
            nuevaForma ← aplicarProducción(formaActual, producción)
            si nuevaForma no en vistos:
                cola.agregar((nuevaForma, profundidad + 1))
    
    ordenar resultados por (longitud, orden alfabético)
    retornar primeros cantidad elementos
```

### 2.3 Características Clave

1. **Ordenamiento por Longitud:** Las producciones más cortas se procesan primero
2. **Control de Profundidad:** Límite de 20 niveles para evitar bucles infinitos
3. **Deduplicación:** Usa conjunto de vistos para evitar cadenas repetidas

### 2.4 Ejemplo de Ejecución

**Gramática:** S → aS | bS | ε
**Objetivo:** Generar 6 cadenas

```
Nivel 0: [S]
Nivel 1: [ε, aS, bS]
  → Genera: ε

Nivel 2: [a, b, aaS, abS, baS, bbS]
  → Genera: a, b

Nivel 3: [aa, ab, ba, bb, aaaS, aabS, ...]
  → Genera: aa, ab, ba, bb

Resultado: [ε, a, b, aa, ab, ba]
```

---

## 3. Validación de Gramáticas

### 3.1 Validación Tipo 3 (Regular)

**Reglas:**
- Lado izquierdo: exactamente un no terminal
- Lado derecho:
  - Un terminal: A → a ✅
  - Terminal + No terminal: A → aB ✅
  - No terminal + Terminal: A → Ba ✅
  - Cadena vacía: A → ε ✅
  - Más de 2 símbolos: A → abc ❌

```typescript
función validarTipo3(gramática):
    errores ← []
    
    para cada producción en gramática.producciones:
        derecha ← producción.derecha
        
        si derecha == "ε":
            continuar
        
        si longitud(derecha) == 1:
            si derecha no es terminal:
                agregar error
        
        si longitud(derecha) == 2:
            [primero, segundo] ← derecha
            esValidaDerecha ← (esTerminal(primero) Y esNoTerminal(segundo))
            esValidaIzquierda ← (esNoTerminal(primero) Y esTerminal(segundo))
            
            si no esValidaDerecha Y no esValidaIzquierda:
                agregar error
        
        si longitud(derecha) > 2:
            agregar error
    
    retornar errores
```

### 3.2 Validación Tipo 2 (Libre de Contexto)

**Reglas:**
- Lado izquierdo: exactamente un no terminal
- Lado derecho: cualquier combinación de terminales y no terminales

```typescript
función validarTipo2(gramática):
    errores ← []
    
    para cada producción en gramática.producciones:
        si longitud(producción.izquierda) != 1:
            agregar error("Lado izquierdo debe ser un símbolo")
        
        si producción.izquierda no es no terminal:
            agregar error("Lado izquierdo debe ser no terminal")
    
    retornar errores
```

---

## 4. Construcción del Árbol de Derivación

### 4.1 Estructura del Árbol

```typescript
interface NodoÁrbol {
    símbolo: string
    esTerminal: boolean
    hijos: NodoÁrbol[]
}
```

### 4.2 Algoritmo de Construcción

```
función construirÁrbol(producción, árbolActual):
    // Clonar árbol para inmutabilidad
    nuevoÁrbol ← clonarProfundo(árbolActual)
    
    // Encontrar primer no terminal sin expandir
    nodoObjetivo ← buscarPrimerNoTerminalSinHijos(nuevoÁrbol)
    
    // Crear hijos según la producción
    para cada símbolo en producción.derecha:
        hijo ← crearNodo(
            símbolo: símbolo,
            esTerminal: esTerminal(símbolo),
            hijos: []
        )
        agregar hijo a nodoObjetivo.hijos
    
    retornar nuevoÁrbol
```

### 4.3 Renderizado SVG

El árbol se renderiza usando coordenadas calculadas recursivamente:

```
función calcularPosiciones(nodo, x, y, ancho):
    posición[nodo] ← (x, y)
    
    si nodo tiene hijos:
        anchosHijos ← calcularAnchosSubárboles(nodo.hijos)
        anchoTotal ← suma(anchosHijos)
        
        xActual ← x - (anchoTotal / 2)
        
        para cada hijo en nodo.hijos:
            anchoHijo ← anchosHijos[índice]
            xHijo ← xActual + (anchoHijo / 2)
            calcularPosiciones(hijo, xHijo, y + ALTURA_NIVEL, anchoHijo)
            xActual ← xActual + anchoHijo
```

---

## 5. Casos Especiales

### 5.1 Cadena Vacía (ε)

- **Representación interna:** `""`
- **Representación UI:** `"ε"`
- **Producción:** `A → ε` se almacena con `right: "ε"`

### 5.2 Tokens Multi-carácter

Ejemplo: `id`, `+`, `*` en gramáticas de expresiones

- **Problema:** Distinguir `id` (un terminal) de `i` y `d` (dos terminales)
- **Solución:** Los terminales se definen explícitamente en el conjunto T

### 5.3 Gramáticas Ambiguas

La aplicación encuentra **una** derivación válida, no necesariamente todas.

**Ejemplo:**
```
E → E + E | E * E | id
Cadena: id + id * id
```

Puede generar múltiples árboles, pero el parser retorna el primero encontrado por BFS.

---

## 6. Limitaciones y Trade-offs

### 6.1 Límite de Iteraciones

**Decisión:** Máximo 10,000 iteraciones en parser
**Razón:** Prevenir bucles infinitos en gramáticas con recursión izquierda
**Alternativa:** Usar timeout basado en tiempo

### 6.2 Límite de Profundidad

**Decisión:** Máximo 20 niveles en generador
**Razón:** Controlar memoria y tiempo de ejecución
**Impacto:** Puede no generar todas las cadenas en gramáticas muy recursivas

### 6.3 Almacenamiento de Estados

**Decisión:** Usar conjunto de strings visitados
**Razón:** Simplicidad y eficiencia para comparaciones
**Limitación:** Alto uso de memoria en gramáticas con muchas formas sentenciales

---

## 7. Ejemplos de Complejidad

### 7.1 Caso Mejor: Gramática Lineal Simple

```
S → aS | b
Cadena: aaaab
```

- **Iteraciones:** 5
- **Memoria:** O(5)
- **Tiempo:** O(5)

### 7.2 Caso Promedio: Gramática Palindrómica

```
S → aSa | bSb | ε
Cadena: aabaa
```

- **Iteraciones:** ~50
- **Memoria:** O(50)
- **Tiempo:** O(50)

### 7.3 Caso Peor: Gramática Altamente Ambigua

```
E → E + E | E * E | id
Cadena: id + id + id
```

- **Iteraciones:** Puede alcanzar 10,000 (límite)
- **Memoria:** O(10,000)
- **Tiempo:** O(10,000)

---

## 8. Referencias Teóricas

1. **Chomsky Hierarchy:** Clasificación de gramáticas formales
2. **BFS (Breadth-First Search):** Algoritmo fundamental de grafos
3. **CYK Algorithm:** Inspiración para parsing de CFG (no implementado directamente)
4. **Derivación Más Izquierda:** Estrategia estándar para CFG

---

## 9. Posibles Mejoras Futuras

1. **CYK Completo:** Para gramáticas en forma normal de Chomsky
2. **Earley Parser:** Más eficiente para CFG arbitrarias
3. **Visualización Múltiple:** Mostrar todas las derivaciones posibles
4. **Optimización de Memoria:** Usar estructuras más eficientes que strings
5. **Detección de Ambigüedad:** Alertar cuando hay múltiples derivaciones
