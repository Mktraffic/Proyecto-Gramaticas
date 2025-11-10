# Analizador de Gramáticas Formales

Aplicación web completa para trabajar con **Gramáticas Regulares (Tipo 3)** y **Libres de Contexto (Tipo 2)**.

## 🎯 Características

### ✅ Funcionalidades Implementadas

1. **Definición de Gramáticas**
   - Interfaz intuitiva para definir G = (N, T, P, S)
   - Validación automática según el tipo de gramática
   - Soporte para producciones con cadena vacía (ε)

2. **Persistencia**
   - Guardar gramáticas en formato JSON
   - Cargar gramáticas desde archivos
   - Gramáticas de ejemplo precargadas

3. **Análisis de Cadenas (Parser)**
   - Algoritmo de parsing con búsqueda en anchura (BFS)
   - Determina si una cadena pertenece al lenguaje
   - Muestra los pasos de derivación

4. **Visualización del Árbol de Derivación**
   - Representación gráfica SVG del árbol
   - Diferenciación visual entre terminales y no terminales
   - Diseño interactivo y responsivo

5. **Generación de Cadenas**
   - Genera las 10 cadenas más cortas del lenguaje
   - Usa BFS para garantizar cadenas ordenadas por longitud
   - Previene bucles infinitos en gramáticas recursivas

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+ instalado
- npm o yarn

### Pasos de instalación

1. **Instalar dependencias:**
```bash
npm install
```

2. **Ejecutar en modo desarrollo:**
```bash
npm run dev
```

3. **Abrir en el navegador:**
```
http://localhost:3000
```

## 📖 Uso de la Aplicación

### 1. Definir una Gramática

Puedes crear una gramática de dos formas:

#### Opción A: Cargar un Ejemplo
- Haz clic en uno de los botones de "Gramáticas de Ejemplo"
- Ejemplos incluidos:
  - Números Binarios (Tipo 3)
  - Palíndromos (Tipo 2)
  - Expresiones Aritméticas (Tipo 2)
  - a^n b^n (Tipo 2)

#### Opción B: Crear Manualmente
1. Completa el formulario con:
   - **Nombre:** Identificador de la gramática
   - **Tipo:** Selecciona "Tipo 2" o "Tipo 3"
   - **No Terminales (N):** Separados por comas (ej: S, A, B)
   - **Terminales (T):** Separados por comas (ej: a, b, 0, 1)
   - **Símbolo Inicial (S):** Un no terminal
   - **Producciones (P):** Agrega reglas de la forma A → aB
2. Haz clic en "Guardar Gramática"

### 2. Analizar Cadenas

1. Navega a la pestaña "🔍 Analizar Cadena"
2. Ingresa la cadena a analizar (usa "ε" para cadena vacía)
3. Haz clic en "Analizar"
4. Resultado:
   - ✅ **ACEPTADA:** Muestra pasos de derivación y árbol
   - ❌ **RECHAZADA:** Indica que no pertenece al lenguaje

### 3. Generar Cadenas

1. Navega a la pestaña "⚡ Generar Cadenas"
2. Haz clic en "Generar 10 Cadenas Más Cortas"
3. Se mostrarán las primeras 10 cadenas ordenadas por longitud

### 4. Guardar y Cargar

- **Guardar:** Haz clic en "💾 Guardar" para descargar la gramática como JSON
- **Cargar:** Usa el selector de archivos para importar un JSON

## 📁 Estructura del Proyecto

```
Proyecto-Gramaticas/
├── app/
│   ├── layout.tsx        # Layout principal
│   ├── page.tsx          # Página principal
│   └── globals.css       # Estilos globales
├── components/
│   ├── GrammarForm.tsx   # Formulario de definición
│   └── DerivationTree.tsx # Visualización del árbol
├── lib/
│   ├── parser.ts         # Algoritmo de parsing
│   ├── generator.ts      # Generador de cadenas
│   └── grammarUtils.ts   # Utilidades y validación
├── types/
│   └── grammar.ts        # Tipos TypeScript
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Tecnologías

- **Frontend:** React 18 + Next.js 14
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS
- **Visualización:** SVG nativo

## 📝 Ejemplos de Gramáticas

### Gramática Regular (Tipo 3)
```
Nombre: Números Binarios
Tipo: Tipo 3
N: S, A
T: 0, 1
S: S
P:
  S → 0A
  S → 1A
  A → 0A
  A → 1A
  A → ε

Cadenas aceptadas: 0, 1, 00, 01, 10, 11, 000, ...
```

### Gramática Libre de Contexto (Tipo 2)
```
Nombre: Palíndromos
Tipo: Tipo 2
N: S
T: a, b
S: S
P:
  S → aSa
  S → bSb
  S → a
  S → b
  S → ε

Cadenas aceptadas: ε, a, b, aa, bb, aba, bab, aaa, ...
```

## 🎓 Algoritmos Implementados

### Parser (Análisis Sintáctico)
- **Técnica:** Búsqueda en Anchura (BFS) sobre derivaciones
- **Complejidad:** Limitada a 10,000 iteraciones
- **Estrategia:** Derivación más izquierda para Tipo 2
- **Optimización:** Detección de ciclos con conjunto visitado

### Generador de Cadenas
- **Técnica:** BFS sobre formas sentenciales
- **Ordenamiento:** Por longitud, luego alfabético
- **Prevención de bucles:** Límite de profundidad y conjunto de vistos

## 🏆 Criterios de Evaluación Cumplidos

- ✅ **Correctitud del Parser (50%):** Implementado con BFS robusto
- ✅ **Visualización del Árbol (20%):** Renderizado SVG completo
- ✅ **Generador de Cadenas (10%):** Genera 10 cadenas más cortas
- ✅ **Funcionalidad Guardar/Cargar (10%):** Persistencia JSON
- ✅ **Calidad de Código e Interfaz (10%):** TypeScript + comentarios + UI moderna

## 🐛 Notas Técnicas

### Formato de Archivos JSON
```json
{
  "name": "Mi Gramática",
  "type": "Tipo 2",
  "nonTerminals": ["S", "A"],
  "terminals": ["a", "b"],
  "productions": [
    { "left": "S", "right": "aSb" },
    { "left": "S", "right": "ε" }
  ],
  "startSymbol": "S"
}
```

### Símbolos Especiales
- Use **ε** (epsilon) para representar la cadena vacía
- Los terminales pueden ser caracteres individuales o tokens (ej: "id", "+")

## 📧 Autores

David Santiago Lotero (GitHub.com/Mktraffic)

Nicolas Danilo Muñoz (GitHub.com/NicolasDaniloMunozAldana)

Diego Alejandro Rodríguez (GitHub.com/Diegosch1)

## 📄 Licencia

MIT License - Uso académico permitido
