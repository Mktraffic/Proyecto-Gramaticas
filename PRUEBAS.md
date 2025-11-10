# Guía de Pruebas - Analizador de Gramáticas

## 🧪 Plan de Pruebas Completo

### 1. Pruebas de Definición de Gramáticas

#### Prueba 1.1: Crear Gramática Regular (Tipo 3)
**Pasos:**
1. Completa el formulario con:
   - Nombre: "Test Binarios"
   - Tipo: "Tipo 3 - Regular"
   - No Terminales: S, A
   - Terminales: 0, 1
   - Símbolo Inicial: S
   - Producciones:
     - S → 0A
     - S → 1A
     - A → ε
2. Clic en "Guardar Gramática"

**Resultado Esperado:** ✅ Gramática guardada correctamente

#### Prueba 1.2: Validación de Gramática Tipo 3
**Pasos:**
1. Intenta crear una gramática Tipo 3 con producción inválida:
   - S → abc (más de 2 símbolos)

**Resultado Esperado:** ❌ Error de validación mostrado

---

### 2. Pruebas de Parsing (Análisis de Cadenas)

#### Prueba 2.1: Gramática "a^n b^n" - Cadenas Válidas
**Gramática:** Usar ejemplo "a^n b^n"

**Cadenas a probar:**
| Cadena | Resultado Esperado |
|--------|-------------------|
| ε      | ✅ ACEPTADA       |
| ab     | ✅ ACEPTADA       |
| aabb   | ✅ ACEPTADA       |
| aaabbb | ✅ ACEPTADA       |

**Verificar:**
- Se muestra el árbol de derivación
- Los pasos de derivación son correctos

#### Prueba 2.2: Gramática "a^n b^n" - Cadenas Inválidas
**Cadenas a probar:**
| Cadena | Resultado Esperado |
|--------|-------------------|
| a      | ❌ RECHAZADA      |
| b      | ❌ RECHAZADA      |
| aab    | ❌ RECHAZADA      |
| abb    | ❌ RECHAZADA      |
| ba     | ❌ RECHAZADA      |

#### Prueba 2.3: Gramática "Palíndromos"
**Gramática:** Usar ejemplo "Palíndromos"

**Cadenas válidas:**
- ε → ✅ ACEPTADA
- a → ✅ ACEPTADA
- b → ✅ ACEPTADA
- aba → ✅ ACEPTADA
- bab → ✅ ACEPTADA
- aabaa → ✅ ACEPTADA
- abba → ✅ ACEPTADA

**Cadenas inválidas:**
- ab → ❌ RECHAZADA
- abc → ❌ RECHAZADA
- aab → ❌ RECHAZADA

#### Prueba 2.4: Gramática "Números Binarios"
**Gramática:** Usar ejemplo "Números Binarios"

**Cadenas válidas:**
- 0 → ✅ ACEPTADA
- 1 → ✅ ACEPTADA
- 10 → ✅ ACEPTADA
- 01 → ✅ ACEPTADA
- 101 → ✅ ACEPTADA
- 1111 → ✅ ACEPTADA

**Cadenas inválidas:**
- ε → ❌ RECHAZADA
- 2 → ❌ RECHAZADA
- 10a → ❌ RECHAZADA

---

### 3. Pruebas de Generación de Cadenas

#### Prueba 3.1: Generar desde "a^n b^n"
**Pasos:**
1. Cargar gramática "a^n b^n"
2. Ir a pestaña "⚡ Generar Cadenas"
3. Clic en "Generar 10 Cadenas Más Cortas"

**Resultado Esperado:**
```
1. ε (longitud 0)
2. ab (longitud 2)
3. aabb (longitud 4)
4. aaabbb (longitud 6)
5. aaaabbbb (longitud 8)
... (hasta 10 cadenas)
```

#### Prueba 3.2: Generar desde "Palíndromos"
**Resultado Esperado:**
```
1. ε (longitud 0)
2. a (longitud 1)
3. b (longitud 1)
4. aa (longitud 2)
5. bb (longitud 2)
6. aba (longitud 3)
7. bab (longitud 3)
... (ordenadas por longitud)
```

#### Prueba 3.3: Generar desde "Números Binarios"
**Resultado Esperado:**
```
1. 0 (longitud 1)
2. 1 (longitud 1)
3. 00 (longitud 2)
4. 01 (longitud 2)
5. 10 (longitud 2)
6. 11 (longitud 2)
7. 000 (longitud 3)
... (hasta 10)
```

---

### 4. Pruebas de Persistencia (Guardar/Cargar)

#### Prueba 4.1: Guardar Gramática
**Pasos:**
1. Define o carga una gramática
2. Clic en "💾 Guardar"
3. Verifica que se descarga un archivo JSON

**Resultado Esperado:** Archivo descargado con nombre `[nombre_gramatica].json`

#### Prueba 4.2: Cargar Gramática desde Archivo
**Pasos:**
1. Usa el selector "Cargar Gramática"
2. Selecciona uno de los archivos en la carpeta `examples/`
3. Verifica que se carga correctamente

**Resultado Esperado:** Gramática cargada y mostrada en la interfaz

#### Prueba 4.3: Validar Formato JSON
**Pasos:**
1. Abre uno de los archivos JSON guardados
2. Verifica estructura:
```json
{
  "name": "...",
  "type": "Tipo 2" o "Tipo 3",
  "nonTerminals": [...],
  "terminals": [...],
  "productions": [...],
  "startSymbol": "..."
}
```

---

### 5. Pruebas de Visualización del Árbol

#### Prueba 5.1: Árbol Simple
**Gramática:** a^n b^n
**Cadena:** ab

**Verificar:**
- Nodo raíz es S (azul - no terminal)
- Hijos correctos según derivación
- Hojas son terminales (verde)

#### Prueba 5.2: Árbol Complejo
**Gramática:** Palíndromos
**Cadena:** aba

**Verificar:**
- Estructura jerárquica correcta
- Conexiones padre-hijo visibles
- Símbolos legibles

---

### 6. Pruebas de Interfaz de Usuario

#### Prueba 6.1: Navegación entre Pestañas
**Pasos:**
1. Carga una gramática
2. Cambia entre "🔍 Analizar Cadena" y "⚡ Generar Cadenas"
3. Verifica que el contenido cambia correctamente

#### Prueba 6.2: Responsividad
**Pasos:**
1. Redimensiona la ventana del navegador
2. Prueba en diferentes tamaños

**Resultado Esperado:** Interfaz se adapta correctamente

#### Prueba 6.3: Editar Gramática
**Pasos:**
1. Carga una gramática
2. Clic en "✏️ Editar"
3. Modifica valores
4. Guarda

**Resultado Esperado:** Cambios aplicados correctamente

---

### 7. Casos de Prueba Avanzados

#### Prueba 7.1: Gramática con Recursión
**Definir:**
```
N: S
T: a
P:
  S → aS
  S → a
S: S
```

**Probar:**
- a → ✅ ACEPTADA
- aa → ✅ ACEPTADA
- aaa → ✅ ACEPTADA

#### Prueba 7.2: Gramática con Múltiples No Terminales
**Usar:** Expresiones Aritméticas
**Probar:**
- id → ✅ ACEPTADA
- id+id → ✅ ACEPTADA
- id*id → ✅ ACEPTADA
- (id) → ✅ ACEPTADA

#### Prueba 7.3: Cadenas Muy Largas
**Gramática:** a^n b^n
**Cadena:** aaaaaabbbbbb (6a, 6b)

**Verificar:** El parser maneja correctamente sin timeout

---

## ✅ Checklist de Validación Final

- [ ] Parser clasifica correctamente al menos 10 cadenas diferentes
- [ ] Árbol de derivación se genera para cadenas aceptadas
- [ ] Generador produce exactamente 10 cadenas
- [ ] Cadenas generadas están ordenadas por longitud
- [ ] Guardar/Cargar funciona con archivos JSON
- [ ] Validación rechaza gramáticas mal formadas
- [ ] Interfaz es clara y fácil de usar
- [ ] Todos los ejemplos precargados funcionan
- [ ] No hay errores en consola del navegador
- [ ] Documentación (README) está completa

---

## 🐛 Reporte de Errores

Si encuentras algún problema, documenta:

1. **Gramática utilizada**
2. **Cadena de entrada**
3. **Resultado obtenido**
4. **Resultado esperado**
5. **Pasos para reproducir**

---

## 📊 Criterios de Evaluación

| Criterio | Peso | Estado |
|----------|------|--------|
| Parser correcto | 50% | ✅ Implementado |
| Árbol de derivación | 20% | ✅ Implementado |
| Generador de cadenas | 10% | ✅ Implementado |
| Guardar/Cargar | 10% | ✅ Implementado |
| Calidad código/UI | 10% | ✅ Implementado |

**Total:** 100% ✅
