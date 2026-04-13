# 🎵 Dual Beat

Un juego de ritmo desarrollado en JavaScript usando Canvas, con arquitectura modular tipo engine, sistema de charts personalizados y editor visual de niveles.

---

## 🧠 Descripción

**Dual Beat Idol** es un rhythm game donde el jugador debe presionar teclas al ritmo de la música utilizando tres tipos de entrada:

* `F` → izquierda
* `J` → derecha
* `F + J` → doble (both)

El juego soporta:

* 🎼 Charts personalizados (hechos a mano o con editor)
* 🎧 Sincronización con audio
* 🎮 Sistema de score, combo y feedback
* 🛠 Editor visual de charts integrado

---

## 🏗 Arquitectura del Proyecto

El proyecto está organizado en módulos (tipo engine) para facilitar mantenimiento y escalabilidad:

```
/assets/js/
│
├── main.js              # Punto de entrada
├── game_logic.js        # Lógica principal del juego
├── renderer.js          # Renderizado en canvas
├── input_system.js      # Manejo de input
├── time_system.js       # Control del tiempo
├── score_system.js      # Score, combo y resultados
├── audio_system.js      # Reproducción de música
├── songs.js             # Mapeo de canciones
│
└── charts/
    ├── tutorial_chart.js
    ├── song1_chart.js
    ├── startdash_chart.js
    ├── idsmile_chart.js
    └── meitantei_chart.js
```

---

## ⚙️ Cómo funciona

### 🎯 Flujo del juego

```
Input → Game Logic → Render → Feedback
           ↓
        Score System
           ↓
         Audio Sync
```

---

### ⏱ Sistema de tiempo

El juego usa tiempo real:

```js
currentTime = Date.now() - startTime;
```

Esto asegura sincronización con la música.

---

### 🎹 Sistema de Input

* Se usa un **input buffer** para evitar pérdida de teclas
* Se detectan inputs simultáneos (F + J) con tolerancia temporal
* Se evita dependencia del frame rate

---

### 🎼 Charts

Los charts son arreglos de objetos:

```js
{
  type: "left" | "right" | "both",
  time: number,
  endTime?: number
}
```

Ejemplo:

```js
{ type: "left", time: 1000 }
{ type: "both", time: 2000, endTime: 3000 }
```

---

## 🎵 Sistema de canciones

Las canciones están definidas en `songs.js`:

```js
export const songs = {
  song1: {
    name: "Song 1",
    chart: song1Chart,
    audio: "../audio/song1.mp3",
    offset: 0
  }
};
```
---

## 🎮 Controles

| Acción    | Tecla |
| --------- | ----- |
| Izquierda | F     |
| Derecha   | J     |
| Doble     | F + J |

---

## 🧪 Cómo ejecutar

1. Clona el repositorio
2. Abre el proyecto en VS Code
3. Usa **Live Server**
4. Abre `index.html`

⚠️ No usar `file://`, los módulos no funcionarán correctamente.

---

## 📦 Dependencias

* Navegador moderno (Chrome recomendado)
* Soporte para ES Modules

---

## 🚀 Features actuales

* Sistema de input robusto
* Detección de timing (Perfect / Good / Miss)
* Combo y score
* Charts largos y complejos
* Editor funcional
* Arquitectura modular

---
## 🧠 Notas técnicas

* El render es independiente del input
* La lógica usa timestamps, no posiciones visuales
* Los charts son la fuente de verdad del gameplay

---

## 👤 Autor

Proyecto desarrollado por Jesús Pérez 
estudiante en ingenieria en sistemas computacionales

---

## 📄 Licencia

Libre para uso educativo y desarrollo personal.
