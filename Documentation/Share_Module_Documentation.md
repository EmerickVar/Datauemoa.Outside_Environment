# Módulo Share - QuickActionsBar

## Descripción General

El **Módulo Share** es una extensión de la QuickActionsBar que proporciona funcionalidades avanzadas de compartir contenido en redes sociales. Permite a los usuarios compartir la página actual en múltiples plataformas con opciones específicas para cada red social.

## Funcionalidades Principales

### 🚀 Modal Interactivo
- **Apertura**: Se activa al hacer clic en el botón de compartir (índice 3) de la QuickActionsBar
- **Cierre**: Automático al hacer clic fuera del modal o presionar la tecla Escape
- **Animaciones**: Transiciones fluidas de entrada y salida con efectos de escala y opacidad

### 📱 Redes Sociales Soportadas

#### Facebook
- **Publicación estándar**: Comparte directamente en el timeline
- **Facebook Story**: Abre el creador de historias con el enlace
- **Facebook Messenger**: Envía el enlace por mensaje directo

#### Instagram
- **Publicación**: Copia el enlace y abre Instagram
- **Chat/DM**: Acceso directo a mensajes directos
- **Instagram Story**: Abre el creador de historias

#### Telegram
- **Chat**: Comparte en conversaciones o grupos
- **Telegram Story**: Utiliza la nueva funcionalidad de historias

#### Twitter/X
- **Tweet**: Comparte con título, descripción y hashtags personalizados

#### Utilidades
- **Copiar enlace**: Copia la URL al portapapeles con notificación de confirmación

## Arquitectura del Código

### 📁 Estructura de Archivos

```
├── assets/
│   ├── css/
│   │   └── quick-actions-bar.css    # Estilos del modal y botones
│   └── js/
│       └── QuickActionsBar.js       # Funcionalidad JavaScript
└── templates/
    └── tools/
        └── QuickActionsBar.html.twig # HTML del modal
```

### 🎨 Componentes CSS

#### Modal Principal
```css
.share-modal-overlay    # Overlay con backdrop-filter
.share-modal           # Contenedor principal del modal
.share-modal-header    # Encabezado con título e ícono
.share-options         # Grid de botones de redes sociales
```

#### Botones de Redes Sociales
```css
.share-option          # Clase base para todos los botones
.share-option.facebook # Estilo específico de Facebook
.share-option.instagram # Estilo específico de Instagram
.share-option.telegram # Estilo específico de Telegram
.share-option.twitter  # Estilo específico de Twitter/X
.share-option.copy-link # Estilo para copiar enlace
```

#### Efectos Visuales
```css
.share-option::after   # Efecto ripple en los botones
.copy-notification     # Notificación de copia exitosa
```

### ⚙️ Funciones JavaScript Principales

#### Gestión del Modal
```javascript
openShareModal(event)     # Abre el modal con animaciones
closeShareModal()         # Cierra el modal y limpia eventos
handleSocialShare(option) # Gestiona el partage según la plataforma
```

#### Gestores Específicos por Plataforma
```javascript
handleFacebookShare()   # Gestiona compartir en Facebook
handleInstagramShare()  # Gestiona compartir en Instagram  
handleTelegramShare()   # Gestiona compartir en Telegram
handleTwitterShare()    # Gestiona compartir en Twitter/X
handleClipboardCopy()   # Gestiona copia al portapapeles
```

#### Utilidades
```javascript
openShareWindow()       # Abre ventanas popup para compartir
fallbackCopyToClipboard() # Método alternativo de copia
showCopyNotification()  # Muestra notificaciones temporales
```

## Implementación Técnica

### 🔧 Inicialización

El módulo se inicializa automáticamente cuando el DOM está cargado:

```javascript
document.addEventListener('DOMContentLoaded', function () {
    // Configuración del botón de compartir (índice 3)
    const shareButton = document.querySelector('.QuickActionsBar-item[style*="--item-index: 3"]');
    if (shareButton) {
        shareButton.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            openShareModal(event);
        });
    }
});
```

### 📱 Responsive Design

El modal se adapta automáticamente a diferentes tamaños de pantalla:

- **Desktop**: Grid de columnas automáticas con ancho máximo de 400px
- **Mobile**: Grid fijo de 3 columnas con padding reducido
- **Tablet**: Comportamiento intermedio adaptativo

### 🔗 APIs de Partage

#### URLs de Compartir por Plataforma

**Facebook**:
```javascript
// Publicación estándar
https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}

// Facebook Story
https://www.facebook.com/stories/create/?link=${url}
```

**Twitter/X**:
```javascript
https://twitter.com/intent/tweet?text=${text}&url=${url}
```

**Telegram**:
```javascript
https://t.me/share/url?url=${url}&text=${title}
```

### 🎯 Gestión de Eventos

#### Eventos del Modal
- **Click en overlay**: Cierra el modal
- **Tecla Escape**: Cierra el modal
- **Click en botones**: Ejecuta el partage correspondiente

#### Gestión de Estado
```javascript
let isShareModalOpen = false;  // Estado global del modal
```

## Personalización

### 🎨 Temas y Colores

Los colores de cada red social están definidos en CSS y pueden personalizarse:

```css
/* Facebook */
.share-option.facebook:hover {
    border-color: #1877f2;
    background-color: rgba(24, 119, 242, 0.1);
}

/* Instagram */
.share-option.instagram:hover {
    border-color: #e4405f;
    background-color: rgba(228, 64, 95, 0.1);
}
```

### 📝 Traducciones

El módulo utiliza el sistema de traducción de Symfony:

```twig
{{ 'Compartir página'|trans }}
{{ 'Facebook'|trans }}
{{ 'Instagram'|trans }}
{{ 'Copiar link'|trans }}
```

### ⚡ Configuración de Animaciones

Las animaciones pueden ajustarse modificando las variables CSS:

```css
:root {
    --modal-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --button-hover-elevation: -3px;
    --ripple-duration: 0.6s;
}
```

## Troubleshooting

### 🐛 Problemas Comunes

#### Modal no se abre
- Verificar que el botón tiene el `--item-index: 3`
- Confirmar que los elementos del modal existen en el DOM
- Revisar la consola para errores JavaScript

#### Botones de compartir no funcionan
- Verificar que los atributos `data-platform` y `data-type` están presentes
- Confirmar que los gestionnaires d'événements están correctamente attachés

#### Notificaciones no aparecen
- Verificar que el elemento `.copy-notification` existe
- Confirmar que los estilos CSS están cargados correctamente

### 🔍 Debug Mode

Para activar logs detallados, añadir al inicio del archivo JavaScript:

```javascript
const DEBUG_SHARE_MODULE = true;

function debugLog(message, data = null) {
    if (DEBUG_SHARE_MODULE) {
        console.log(`[ShareModule] ${message}`, data || '');
    }
}
```

## Mejoras Futuras

### 🚀 Funcionalidades Pendientes

1. **Compartir con imágenes**: Integración con Open Graph para compartir imágenes
2. **Estadísticas de compartir**: Tracking de clicks y conversiones
3. **Compartir personalizado**: Permitir personalizar el mensaje de cada red
4. **Más plataformas**: WhatsApp, LinkedIn, Reddit, Pinterest
5. **Modo offline**: Guardar enlaces para compartir después

### 📊 Métricas Sugeridas

- Clicks por plataforma social
- Tasa de conversión del modal
- Tiempo de permanencia en el modal
- Dispositivos más utilizados para compartir

## Mantenimiento

### 🔄 Actualizaciones de APIs

Las APIs de redes sociales cambian frecuentemente. Revisar periódicamente:

- URLs de compartir de Facebook
- Nuevas funcionalidades de Instagram
- Cambios en Twitter/X API
- Actualizaciones de Telegram

### 🧪 Testing

Para probar el módulo:

1. **Verificar apertura del modal**: Click en botón de compartir
2. **Probar cada plataforma**: Click en todos los botones
3. **Verificar cierre**: Click fuera del modal y tecla Escape
4. **Validar copiar enlace**: Verificar notificación y portapapeles
5. **Testing responsive**: Probar en diferentes tamaños de pantalla

---

**Autor**: DataUEMOA Team  
**Versión**: 1.0.0  
**Fecha**: 26 de junio de 2025  
**Licencia**: Propietaria
