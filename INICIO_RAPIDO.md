# 🚀 INICIO RÁPIDO

## ¿Qué es esto?

Una aplicación web completa para trabajar con **Gramáticas Formales** (Tipo 2 y Tipo 3).

## 📦 Instalación (Solo una vez)

Abre PowerShell/Terminal en esta carpeta y ejecuta:

```bash
npm install
```

## ▶️ Ejecutar la Aplicación

```bash
npm run dev
```

Luego abre tu navegador en: **http://localhost:3000**

## 🎯 Prueba Rápida (5 minutos)

### 1. Carga un Ejemplo
- Haz clic en el botón **"Palíndromos"**

### 2. Analiza una Cadena
- En el campo de texto, escribe: `aba`
- Clic en **"Analizar"**
- ✅ Verás: ACEPTADA con árbol de derivación

### 3. Genera Cadenas
- Cambia a la pestaña **"⚡ Generar Cadenas"**
- Clic en **"Generar 10 Cadenas Más Cortas"**
- Verás: ε, a, b, aa, bb, aba, bab...

### 4. Guarda la Gramática
- Clic en **"💾 Guardar"**
- Se descargará un archivo JSON

### 5. Carga una Gramática
- Usa el selector de archivos
- Carga cualquier JSON de la carpeta `examples/`

## 📁 Archivos Importantes

```
README.md                    ← Documentación completa
PRUEBAS.md                   ← Casos de prueba
DOCUMENTACION_TECNICA.md     ← Explicación de algoritmos
examples/                    ← Gramáticas de ejemplo
```

## 🎓 Gramáticas de Ejemplo Incluidas

1. **Números Binarios** (Tipo 3) - Acepta: 0, 1, 10, 11, 101...
2. **Palíndromos** (Tipo 2) - Acepta: ε, a, b, aba, bab...
3. **a^n b^n** (Tipo 2) - Acepta: ε, ab, aabb, aaabbb...
4. **Expresiones Aritméticas** (Tipo 2) - Acepta: id, id+id, id*id...

## ❓ Problemas Comunes

### "npm: command not found"
→ Instala Node.js desde: https://nodejs.org/

### "Port 3000 already in use"
→ Cierra otras aplicaciones que usen el puerto 3000

### La página no carga
→ Espera 5-10 segundos después de ejecutar `npm run dev`

## 🎨 Características Principales

✅ Definir gramáticas personalizadas
✅ Analizar cadenas (Parser BFS)
✅ Visualizar árbol de derivación
✅ Generar cadenas del lenguaje
✅ Guardar/Cargar en JSON
✅ Interfaz moderna y responsiva

## 📞 Ayuda

- Problemas con instalación → Ver README.md
- Entender algoritmos → Ver DOCUMENTACION_TECNICA.md
- Casos de prueba → Ver PRUEBAS.md

## 🏆 ¡Listo para entregar!

El proyecto está **100% funcional** y cumple todos los requisitos:
- ✅ Parser (50%)
- ✅ Árbol de derivación (20%)
- ✅ Generador (10%)
- ✅ Persistencia (10%)
- ✅ Calidad código/UI (10%)

---

**¡Disfruta explorando las gramáticas formales! 🎉**
