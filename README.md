# 🎯 Descubre tu Arquetipo - Web App

Aplicación web para orientación profesional usando el marco Ikigai, con sincronización en tiempo real entre un iPad (para que interactúe cada participante) y un monitor/proyector (que muestra un mural en vivo).

## ✨ Características

- **Cuestionario Ikigai**: 4 preguntas basadas en el marco Ikigai 
  - ¿Qué harías gratis aunque no te pagaran? (Lo que amo)
  - ¿Qué se te hace fácil pero a otros les cuesta? (Soy bueno)
  - ¿Para qué te busca la gente cuando necesita ayuda? (Se necesita)
  - ¿Qué alguien te pagaría por hacer? (Me pagan)
- **Clasificación con Claude AI**: Análisis automático para generar arquetipos profesionales
- **Sincronización en tiempo real**: Resultados aparecen en el mural del monitor
- **Descarga de resultados**: PNG con el arquetipo personal
- **Responsive**: Optimizado para iPad y desktop

## 🚀 Instalación Rápida

```bash
cd /Users/a2019/Documents/casa-abierta-app
npm install
```

## ⚙️ Configuración

1. Copia las variables de entorno:
```bash
cp .env.example .env.local
```

2. Edita `.env.local` y agrega:
   - `VITE_CLAUDE_API_KEY`: Obtén en https://console.anthropic.com
   - Credenciales de Firebase (cuando implementes Realtime Database)

## 🏃 Desarrollo

```bash
npm run dev
```

Accede a `http://localhost:5173`

## 📱 Rutas Principales

- `/` - Pantalla de inicio
- `/jugar` - Vista del iPad (cuestionario)
- `/monitor` - Mural en vivo

## 📂 Estructura del Proyecto

```
src/
├── pages/
│   ├── Home.tsx          # Pantalla de inicio
│   ├── Play.tsx          # Cuestionario (iPad)
│   └── Monitor.tsx       # Mural en vivo
├── components/
│   ├── QuestionCard.tsx  # Tarjeta de pregunta
│   └── ResultCard.tsx    # Resultado final
├── utils/
│   ├── api.ts            # Integración con Claude API
│   └── download.ts       # Descarga de PNG
├── types/
│   └── index.ts          # Tipos TypeScript
└── styles/               # CSS por componente
```

## 🔑 Variables de Entorno

```
VITE_CLAUDE_API_KEY=sk-...
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_DATABASE_URL=...
```

## 🛠 Tech Stack

- React 18 + TypeScript
- Vite (hot reload)
- React Router
- Firebase (próximamente)
- Claude API (Anthropic)
- html-to-image

## 📝 Estado Actual

- ✅ Estructura base del proyecto
- ✅ Componentes UI (Home, Play, Monitor)
- ✅ Flujo de preguntas sin audio (texto por ahora)
- ✅ Integración mock con Claude API
- ✅ Descarga de resultados
- 🔄 Firebase Realtime Database (próximo)
- 🔄 Grabación de audio (MediaRecorder + Web Speech API)
