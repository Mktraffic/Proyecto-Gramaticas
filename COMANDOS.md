# Scripts y Comandos Útiles

## 🚀 Comandos de Desarrollo

### Iniciar servidor de desarrollo
```bash
npm run dev
```
La aplicación estará disponible en: http://localhost:3000

### Compilar para producción
```bash
npm run build
```

### Iniciar servidor de producción
```bash
npm start
```

### Verificar errores de TypeScript
```bash
npx tsc --noEmit
```

### Limpiar caché de Next.js
```bash
rm -rf .next
```

## 🧪 Comandos de Prueba

### Probar un ejemplo específico
1. Abrir http://localhost:3000
2. Cargar gramática de ejemplo
3. Probar cadenas en la consola del navegador:

```javascript
// Abrir DevTools (F12) y ejecutar:
console.log('Probando gramática...');
```

## 📦 Gestión de Dependencias

### Instalar todas las dependencias
```bash
npm install
```

### Actualizar dependencias
```bash
npm update
```

### Ver dependencias instaladas
```bash
npm list
```

## 🔧 Solución de Problemas Comunes

### Error: "Cannot find module 'react'"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: "Port 3000 already in use"
```bash
# Windows (PowerShell):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# O usar otro puerto:
$env:PORT=3001; npm run dev
```

### Error de TypeScript
```bash
npm run build
# Revisar los errores en la salida
```

## 📊 Análisis de Bundle

### Ver tamaño de la build
```bash
npm run build
# Revisar el output en .next/
```

### Analizar dependencias
```bash
npx depcheck
```

## 🎨 Comandos de Tailwind

### Regenerar estilos
Los estilos se regeneran automáticamente en modo dev.

### Ver clases disponibles
Consultar: https://tailwindcss.com/docs

## 📁 Estructura de Archivos Generados

```
.next/           # Build de Next.js (ignorar en git)
node_modules/    # Dependencias (ignorar en git)
examples/        # Gramáticas de ejemplo (incluir en git)
```

## 🐛 Debug

### Modo verbose de Next.js
```bash
$env:DEBUG="*"; npm run dev
```

### Ver logs del compilador
Los logs aparecen automáticamente en la terminal donde ejecutaste `npm run dev`

## 🌐 Deploy (Opcionales)

### Deploy en Vercel (Recomendado)
```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Deploy en Netlify
```bash
npm run build
# Subir carpeta .next a Netlify
```

### Deploy local (producción)
```bash
npm run build
npm start
```

## 📝 Notas Importantes

- **Puerto por defecto:** 3000
- **Hot reload:** Activado en modo dev
- **TypeScript:** Strict mode habilitado
- **ESLint:** Configuración de Next.js

## 🎯 Checklist Pre-entrega

- [ ] `npm install` ejecutado sin errores
- [ ] `npm run dev` inicia correctamente
- [ ] Todas las gramáticas de ejemplo funcionan
- [ ] Parser acepta/rechaza correctamente
- [ ] Árbol de derivación se visualiza
- [ ] Generador produce 10 cadenas
- [ ] Guardar/Cargar funciona
- [ ] No hay errores en consola del navegador
- [ ] README.md está completo
- [ ] PRUEBAS.md tiene casos de prueba
