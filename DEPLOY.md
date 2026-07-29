# Despliegue de "Descubre tu Arquetipo"

## Arquitectura

- **Frontend**: React + TypeScript (Vite) — se despliega en cualquier CDN (Vercel, Netlify, etc.)
- **Backend**: Función serverless `/api/clasificar` — procesa las respuestas con Claude API de forma segura
- **Database** (opcional): Firebase Realtime Database — para sincronizar el mural en vivo

## Despliegue en Vercel (Recomendado)

### 1. Preparar el código

```bash
# Asegúrate de que el archivo `api/clasificar.ts` existe
ls api/clasificar.ts
```

### 2. Conectar a Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar (primera vez)
vercel

# En las preguntas:
# - Project name: casa-abierta-app
# - Root directory: .
# - Build command: npm run build
# - Output directory: dist
```

### 3. Configurar variables de entorno

En el dashboard de Vercel (`vercel.com`), ve a tu proyecto y agrega:

**Settings → Environment Variables**

```
CLAUDE_API_KEY = sk-ant-v4-...
```

### 4. Configurar URL del frontend

Después del despliegue, Vercel te dará una URL (ej: `https://casa-abierta-app.vercel.app`).

Copia esa URL y úsala como `VITE_API_URL` en tus variables de entorno del frontend, o déjalo vacío si el frontend y backend están en el mismo dominio (Vercel maneja esto automáticamente).

## Despliegue en Netlify

### 1. Preparar Functions de Netlify

Renombra la carpeta:
```bash
mkdir -p netlify/functions
mv api/clasificar.ts netlify/functions/clasificar.ts
```

Actualiza el archivo para que sea compatible con Netlify:

```typescript
// netlify/functions/clasificar.ts
import { Handler } from '@netlify/functions'

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' }
  }

  const apiKey = process.env.CLAUDE_API_KEY
  if (!apiKey) {
    return { statusCode: 500, body: 'API key no configurada' }
  }

  try {
    const { love, good, needed, paid } = JSON.parse(event.body || '{}')
    
    // ... resto del código de clasificación ...
    
    return {
      statusCode: 200,
      body: JSON.stringify(result)
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    }
  }
}
```

### 2. Configurar en Netlify

1. Conecta tu repo a Netlify
2. **Settings → Environment variables**
   - Agrega: `CLAUDE_API_KEY = sk-ant-v4-...`
3. **Settings → Build & deploy**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `netlify/functions`

## Despliegue Local (para desarrollo)

### Backend

```bash
# Instalar dependencias de Vercel
npm install @vercel/node

# Crear archivo .env.local en la raíz
echo "CLAUDE_API_KEY=sk-ant-v4-..." > .env.local

# Ejecutar con Vercel dev server
npx vercel dev

# Accederá a http://localhost:3000/api/clasificar
```

### Frontend

```bash
# En otra terminal
npm run dev

# Accederá a http://localhost:5173
```

En `src/utils/api.ts`, asegúrate de que `VITE_API_URL` apunte a `http://localhost:3000` en desarrollo.

## Guía de Seguridad

✅ **CORRECTO:**
- Claude API Key solo en variables de entorno del servidor
- Frontend llama a `/api/clasificar` del mismo dominio o URL configurada
- Las respuestas se devuelven como JSON

❌ **INCORRECTO:**
- Guardar `CLAUDE_API_KEY` en variables `VITE_*` (se exponen en el navegador)
- Hacer fetch directo a Claude API desde el frontend
- Guardar credenciales en archivos `.env` que se comitean

## Variables de Entorno

### Frontend (.env.local)
```
VITE_API_URL=https://casa-abierta-app.vercel.app
VITE_FIREBASE_API_KEY=...  # opcional
VITE_FIREBASE_PROJECT_ID=...  # opcional
```

### Backend (Vercel/Netlify dashboard)
```
CLAUDE_API_KEY=sk-ant-v4-...
```

## Verificar el despliegue

1. Abre tu app en el navegador
2. Ve a `/jugar`
3. Completa las 4 preguntas
4. Presiona "Ver Resultado"
5. Debería mostrar un arquetipo real generado por Claude

Si ves un error, revisa:
- Que `CLAUDE_API_KEY` esté configurado en Vercel/Netlify
- Que la URL del API sea correcta
- Los logs en Vercel/Netlify dashboard
