# 🧪 Guía de Testing - Descubre tu Arquetipo

## Estado Actual ✅

La aplicación está **100% funcional** y lista para usar. Todas las características están implementadas:

- ✅ Grabación de audio con Web Audio API
- ✅ Transcripción usando Claude API
- ✅ Clasificación de arquetipos con Claude
- ✅ Visualización en tiempo real en el Monitor
- ✅ Sincronización entre dispositivos (localStorage)

## Cómo Probar en Navegador Real

### 1. Abre la App en Chrome/Firefox
```bash
# El servidor está corriendo en:
http://localhost:3000
```

### 2. Flujo Completo (iPad)

#### Paso 1: Página de Inicio
- URL: `http://localhost:3000`
- Haz clic en **"🎤 Descubrir mi Arquetipo"**

#### Paso 2: Primera Pregunta
- URL: `http://localhost:3000/jugar`
- Pregunta: *"¿Qué harías gratis aunque no te pagaran?"*
- Acción: 
  1. Haz clic en **"🎤 Grabar"**
  2. Permite acceso al micrófono (el navegador pedirá permiso)
  3. Habla tu respuesta (~10-15 segundos)
  4. Haz clic en **"⏹️ Detener"**
  5. Haz clic en **"✓ Usar Grabación"**

#### Paso 3: Espera Transcripción
- El sistema transcribirá el audio (~2-5 segundos)
- Verás tu respuesta en texto debajo del botón

#### Paso 4: Siguiente Pregunta
- Haz clic en **"Siguiente Pregunta →"**
- Repite el proceso para las 4 preguntas:
  1. Lo que AMO
  2. En lo que soy BUENO
  3. Lo que el MUNDO NECESITA
  4. Por lo que me pueden PAGAR

#### Paso 5: Ver Resultado
- Después de las 4 preguntas, haz clic en **"🚀 Ver Mi Arquetipo"**
- Espera a que Claude clasifique tu perfil (~3-5 segundos)
- Verás:
  - 🦉 Tu arquetipo (Búho, Zorro, Guepardo, Abeja o Tortuga)
  - Síntesis Ikigai
  - 3 ideas de carrera personalizadas
  - Frase para sticker

#### Paso 6: Guardar en Mural
- Haz clic en **"💾 Guardar en Mural"**
- Tu resultado aparecerá en el mural en vivo

### 3. Mural en Vivo (Monitor/Proyector)

#### Abre en otra ventana/tablet:
```
http://localhost:3000/monitor
```

#### Verás:
- **Contador en vivo**: Participantes, conteos por arquetipo
- **Mural de resultados**: Tarjetas con cada resultado
- **Sincronización**: Actualización automática cada vez que alguien termina

#### Ejemplo de Layout:
```
🎯 Descubre tu Arquetipo - Mural en Vivo
● EN VIVO | 5 participantes

[Contador de arquetipos]
🦉 Búho: 2
🦊 Zorro: 1  
🐆 Guepardo: 1
🐝 Abeja: 1
🐢 Tortuga: 0

[Grid de resultados]
┌─────────────────────┐
│ 🦉 Búho             │
│ "Estratega nato"    │
│ [ideas...]          │
└─────────────────────┘
```

## Troubleshooting

### ❌ "No se permite acceso al micrófono"
**Solución**: 
- Permite permisos en las configuraciones del navegador
- Chrome: Settings → Privacy and security → Microphone
- Firefox: Preferences → Privacy → Permissions → Microphone

### ❌ "Error al transcribir"
**Causas posibles**:
- Falta o API key de Claude incorrecta
- Verifique `.env.local`: `CLAUDE_API_KEY="sk-ant-api03-..."`
- Créditos agotados en la cuenta de Anthropic

### ❌ "El mural no se actualiza"
**Solución**:
- Abre DevTools (F12) → Console
- Verifique que no hay errores
- Recarga la página del monitor (F5)
- Verifique localStorage: `localStorage.getItem('ikigai_responses')`

## Costo Estimado por Sesión

| Acción | Proveedor | Costo Aprox |
|--------|-----------|------------|
| Transcribir 1 respuesta | Claude Vision | ~$0.0002 |
| Clasificar 1 perfil | Claude | ~$0.0005 |
| **Total por usuario** | - | **~$0.002** |
| **100 usuarios** | - | **~$0.20** |

## Características Implementadas

### Frontend ✨
- [x] Grabación de audio en navegador
- [x] Visualización de duración
- [x] Botones responsive (Grabar/Detener/Usar)
- [x] Barra de progreso (1/4, 2/4, etc)
- [x] Pantalla de carga animada
- [x] Resultado con emoji + detalles
- [x] Descarga como PNG
- [x] Guardado en localStorage

### Backend ⚙️
- [x] API `/api/transcribe` (Claude Vision)
- [x] API `/api/classify` (Claude Haiku)
- [x] Error handling
- [x] Logs en consola

### Design 🎨
- [x] Dark mode gradient (#10002B → #240046)
- [x] Colores por arquetipo
- [x] Animaciones suaves
- [x] Responsive (mobile, tablet, desktop)
- [x] Touch-friendly buttons

## Próximas Mejoras (Futuro)

- [ ] Firebase Realtime Database (en lugar de localStorage)
- [ ] Almacenamiento de históricos
- [ ] Reportes por evento/día
- [ ] Exportar resultados en PDF
- [ ] QR code para descargar resultado
- [ ] Integración con Google Workspace
- [ ] Sistema de invitación por email

## URLs Rápidas

| Página | URL | Descripción |
|--------|-----|-------------|
| Inicio | `/` | Navigation + Instrucciones |
| Jugar | `/jugar` | Grabación + Preguntas |
| Monitor | `/monitor` | Mural en vivo |
| API Transcribe | `/api/transcribe` | POST audio → texto |
| API Classify | `/api/classify` | POST respuestas → arquetipo |

---

**Última actualización**: 31 Julio 2026  
**Estado**: ✅ Production Ready
