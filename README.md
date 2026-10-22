# Actividades interactivas autocorregidas para Google Classroom

Aplicación web de **Google Apps Script** que permite al alumnado hacer actividades interactivas que se **corrigen solas** y vuelcan la nota a **Google Classroom** como borrador de calificación (la publica el profesorado).

Creada por **Manuel Romero Fraidía** (Departamento de Tecnología, IES Murillo, Sevilla). La versión de ejemplo incluida trabaja el tema *Plásticos e impresión 3D* de Tecnología y Digitalización de 3º ESO, pero está pensada para reutilizarse con cualquier otro contenido.

## Qué hace

- Cuatro actividades de ejemplo con 10 tipos de pregunta: test, verdadero/falso, respuesta múltiple, numérica, completar, relacionar, clasificar, ordenar, rotular una imagen y respuesta escrita.
- Las respuestas escritas se corrigen por **palabras clave** (tolera faltas leves, sinónimos y negaciones) y el profesorado puede ajustar el resultado a mano.
- Las soluciones **nunca viajan al navegador**: se corrigen en el servidor y las opciones se barajan en cada intento.
- Número de intentos configurable. Cuenta la nota del último intento (o la mejor, a elección).
- El alumnado solo ve la nota y decide: repetir, o ver las soluciones (y entonces no puede repetir).
- Panel del profesorado: crea las tareas en Classroom (en borrador), muestra resultados, permite reabrir intentos y reenviar notas.
- Los resultados quedan también en una hoja de cálculo propia.

## Archivos

| Archivo | Para qué sirve | ¿Lo cambio para otro tema? |
|---|---|---|
| `src/Code.gs` | Servidor: Classroom, hoja de resultados, panel | Solo la configuración del principio |
| `src/Motor.gs` | Corrección de preguntas (funciones puras) | No |
| `src/Banco.gs` | Las actividades: preguntas, criterios y explicaciones | **Sí: aquí va tu contenido** |
| `src/Imagenes.gs` | Imágenes incrustadas (PNG en base64) | Sí, si usas imágenes |
| `src/Index.html` | Pantalla del alumnado | Textos y créditos |
| `src/Panel.html` | Pantalla del profesorado | No |
| `src/appsscript.json` | Manifiesto: servicio de Classroom y tipo de despliegue | No |

## Instalación (una sola vez)

1. Entra en [script.google.com](https://script.google.com) → **Nuevo proyecto**.
2. Crea los archivos con **los mismos nombres**: los `.gs` con **+ → Script** (`Code`, `Motor`, `Banco`, `Imagenes`) y los `.html` con **+ → HTML** (`Index`, `Panel`). Pega el contenido de cada uno.
3. En `Code.gs`, sección CONFIGURACIÓN: cambia `PROFES` por tu correo, y ajusta `CLASES`, `MAX_INTENTOS` y `NOTA_CUENTA`.
4. Menú izquierdo → **Servicios (+)** → añade **Google Classroom API**.
5. Ejecuta una vez la función `autorizar` y acepta los permisos.
6. **Implementar → Nueva implementación → Aplicación web**. Ejecutar como: **Yo**. Acceso: usuarios de tu dominio. Copia la URL que termina en `/exec`.
7. Abre `<URL>/exec?page=panel`, pega la URL `/exec` y los enlaces de tus clases de Classroom, pulsa **Guardar** y después **Crear tareas en Classroom**.
8. Si cambias código, usa **Implementar → Gestionar implementaciones → Nueva versión**; si no, la URL sigue sirviendo la versión anterior.

`appsscript.json` puede pegarse en el proyecto (Configuración del proyecto → *Mostrar el archivo de manifiesto*) o dejarse como está: basta con añadir el servicio de Classroom del paso 4.

## Usarla con otro contenido

Copia el proyecto y cambia `Banco.gs` (preguntas, criterios de evaluación, explicaciones), `Imagenes.gs` y los textos de título de `Code.gs`, `Index.html` y `Panel.html`. El formato de cada tipo de pregunta está explicado en la cabecera de `Banco.gs` y el de las respuestas escritas en la de `Motor.gs`.

## Requisitos y limitaciones

- Cuenta de Google Workspace for Education con **Classroom** y acceso a la **API de Classroom**. Algunos centros la tienen restringida por el administrador del dominio.
- Las notas solo se pueden escribir en tareas **creadas por la propia aplicación** (por eso la tarea no debe crearse a mano en Classroom).
- Con la tarea en borrador, Classroom no devuelve entregas: las notas se envían cuando la tarea está publicada (el panel permite reenviarlas).
- Marcar la tarea como «entregada» solo lo puede hacer el propio alumno; la app le da un enlace directo.
- Cada docente tiene que autorizar y desplegar **su propia copia**; no se actualiza sola.

## Protección de datos

El código no contiene datos de alumnado. Los intentos y las notas se guardan en una hoja de cálculo que la app crea en **tu** Drive. No subas esa hoja ni capturas con nombres a ningún repositorio.

## Licencia y créditos

© Manuel Romero Fraidía. Licencia [Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es) para el código y el trabajo original del autor. Consulta el archivo `LICENSE`.

### Créditos del contenido de ejemplo

Las actividades de ejemplo de `src/Banco.gs` y parte de las imágenes de `src/Imagenes.gs` se basan en:

- La unidad 3 del libro de **Donostiarra (Proyecto STAR)**, pp. 72-91. El contenido procedente del libro pertenece a sus titulares y se incluye con **permiso de la editorial**; **no queda cubierto por la licencia Creative Commons** de este repositorio. Si lo reutilizas fuera de este proyecto, consulta con la editorial.
- Las fichas de plásticos e impresión 3D de [yourtechnologyweb](https://www.yourtechnologyweb.com), publicadas con licencia CC0.
