// VERSIÓN 2026-10-11-v5
/**
 * ACTIVIDADES INTERACTIVAS · Plásticos e impresión 3D · 3º ESO · IES Murillo
 * Aplicación web de Google Apps Script. Corrige sola y vuelca la nota del ÚLTIMO intento de
 * cada actividad a Google Classroom (como borrador: la publicas tú).
 *
 * Archivos del proyecto:  Code.gs (este) · Motor.gs · Banco.gs · Imagenes.gs · Index.html · Panel.html
 *
 * PASOS DE INSTALACIÓN (una sola vez)
 *  1. script.google.com → Nuevo proyecto → crea los 6 archivos con estos nombres
 *     (los .gs con "+ → Script", los .html con "+ → HTML") y pega cada contenido.
 *  2. Menú izquierdo "Servicios" (+) → añade "Google Classroom API" (identificador Classroom).
 *     No hace falta tocar el manifiesto appsscript.json.
 *  3. Ejecuta una vez la función "autorizar" y acepta los permisos.
 *  4. Implementar → Nueva implementación → Aplicación web
 *       Ejecutar como: Yo   ·   Quién tiene acceso: Cualquier usuario de Consejería de Educación
 *     Copia la URL que acaba en /exec  (NO la que acaba en /dev).
 *  5. Abre  <URL>/exec?page=panel  → pega la URL /exec y los enlaces de Classroom de
 *     3º A, B y C (y, si quieres, de la clase de prueba) → "Guardar" → "Crear tareas en Classroom".
 *     Las tareas se crean en BORRADOR: tú las publicas desde Classroom cuando quieras.
 *  6. Cada vez que cambies código: Implementar → Gestionar implementaciones → lápiz →
 *     Versión: "Nueva versión" → Implementar (si no, el /exec sigue sirviendo la anterior).
 *
 * URL alumnado:        .../exec
 * Panel del profesor:  .../exec?page=panel
 */

/* ===================== CONFIGURACIÓN ===================== */
var PROFES = ['profe@tucentro.es'];   // <-- CAMBIA ESTO: tu correo (puedes poner varios, separados por comas)
var CLASES = ['3º ESO A', '3º ESO B', '3º ESO C', 'Clase de prueba'];   // la de prueba es opcional: solo se usa si pegas su enlace en el panel
var MAX_INTENTOS = 2;            // intentos por actividad (puedes reabrir intentos desde el panel con «+1 intento»). 0 = sin límite
var NOTA_CUENTA = 'ultimo';      // qué intento cuenta: 'ultimo' = la nota del último intento · 'mejor' = la mejor de todos
var NOMBRE_LIBRO = 'Resultados · Actividades plásticos e impresión 3D · 3º ESO';
var HOJA_INTENTOS = 'Intentos';
/* ======================================================== */

/* ===================== WEB APP ===================== */
function doGet(e){
  var page = (e && e.parameter && e.parameter.page) || '';
  if(page === 'panel'){
    if(!esProfesor_()){
      return HtmlService.createHtmlOutput('<div style="font-family:system-ui,sans-serif;padding:32px;"><h2>Acceso restringido</h2><p>Este panel es solo para el profesorado.</p></div>').setTitle('Panel del profesor');
    }
    return HtmlService.createTemplateFromFile('Panel').evaluate().setTitle('Panel · Actividades plásticos e impresión 3D').addMetaTag('viewport', 'width=device-width, initial-scale=1');
  }
  return HtmlService.createTemplateFromFile('Index').evaluate().setTitle('Actividades · Plásticos e impresión 3D').addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/* URL /exec de la aplicación: la guardada en el panel o, si no, la del despliegue actual. */
function urlBase_(){
  var u = props_().getProperty('URL_APP') || '';
  if(!u){ try { u = ScriptApp.getService().getUrl() || ''; } catch(e){} }
  return String(u).replace(/\?.*$/, '');
}

function getUsuario_(){ try { return (Session.getActiveUser().getEmail() || '').toLowerCase(); } catch(e){ return ''; } }
function esProfesor_(){ return PROFES.indexOf(getUsuario_()) >= 0; }
function exigeProfesor_(){ if(!esProfesor_()) throw new Error('Acceso restringido al profesorado.'); }

/* Ejecútala una vez desde el editor para conceder permisos (hoja, Drive y Classroom). */
function autorizar(){
  getLibro_();
  var cursos = Classroom.Courses.list({ pageSize: 1, teacherId: 'me' });
  Logger.log('Classroom accesible. Cursos visibles: ' + ((cursos.courses || []).length));
  // referencias a los métodos que usa la app, para que Google detecte los permisos necesarios
  var fns = [Classroom.Courses.Students.get, Classroom.Courses.Students.list, Classroom.Courses.CourseWork.create,
             Classroom.Courses.CourseWork.StudentSubmissions.list, Classroom.Courses.CourseWork.StudentSubmissions.patch];
  Logger.log('Permisos concedidos (' + fns.length + ' métodos de Classroom). Ya puedes implementar la aplicación web.');
}

/* ===================== PROPIEDADES / CONFIGURACIÓN ===================== */
function props_(){ return PropertiesService.getScriptProperties(); }
function getCursos_(){ try { return JSON.parse(props_().getProperty('CURSOS') || '{}'); } catch(e){ return {}; } }

/* El id que aparece tras /c/ en la URL de Classroom está en base64: se decodifica. */
function decodificarCourseId(entrada){
  var s = String(entrada || '').trim();
  var m = s.match(/\/c\/([A-Za-z0-9_\-]+)/);
  if(m) s = m[1];
  if(/^\d+$/.test(s)) return s;
  try {
    var pad = s + '==='.slice((s.length + 3) % 4);
    var txt = Utilities.newBlob(Utilities.base64DecodeWebSafe(pad)).getDataAsString();
    if(/^\d+$/.test(txt)) return txt;
  } catch(e){}
  return '';
}

/* ===================== ALUMNADO ===================== */
/* Busca al alumno en las clases configuradas (por su correo) y guarda el resultado. */
function resolverAlumno_(email){
  if(!email) return null;
  var p = props_(), k = 'AL|' + email, raw = p.getProperty(k);
  if(raw){ try { return JSON.parse(raw); } catch(e){} }
  var cursos = getCursos_(), claves = Object.keys(cursos);
  for(var i = 0; i < claves.length; i++){
    try {
      var est = Classroom.Courses.Students.get(cursos[claves[i]], email);
      var al = { clase: claves[i], courseId: cursos[claves[i]], nombre: (est.profile && est.profile.name && est.profile.name.fullName) || email };
      p.setProperty(k, JSON.stringify(al));
      return al;
    } catch(e){ /* no está en esa clase */ }
  }
  return null;
}

/* ===================== HOJA DE INTENTOS ===================== */
var COL_ = { FECHA:0, CORREO:1, NOMBRE:2, CLASE:3, ACT:4, INTENTO:5, NOTA:6, FINAL:7, REVISADO:8, CLASSROOM:9, DETALLE:10 };
function getLibro_(){
  var sid = props_().getProperty('SHEET_ID'), ss = null;
  if(sid){ try { ss = SpreadsheetApp.openById(sid); } catch(e){ ss = null; } }
  if(!ss){ ss = SpreadsheetApp.create(NOMBRE_LIBRO); props_().setProperty('SHEET_ID', ss.getId()); }
  return ss;
}
function getHoja_(){
  var ss = getLibro_(), sh = ss.getSheetByName(HOJA_INTENTOS);
  if(!sh){
    sh = ss.insertSheet(HOJA_INTENTOS);
    var cab = ['Fecha y hora', 'Correo', 'Nombre', 'Clase', 'Actividad', 'Intento', 'Nota automática', 'Nota final', 'Revisado', 'Classroom', 'Detalle (JSON)'];
    sh.appendRow(cab);
    sh.getRange(1, 1, 1, cab.length).setFontWeight('bold');
    sh.setFrozenRows(1);
    sh.setColumnWidth(COL_.DETALLE + 1, 120);
    var vacia = ss.getSheetByName('Hoja 1') || ss.getSheetByName('Sheet1');
    if(vacia && ss.getSheets().length > 1 && vacia.getLastRow() === 0) ss.deleteSheet(vacia);
  }
  return sh;
}
function leerFilas_(){
  var sh = getHoja_(), n = sh.getLastRow();
  if(n < 2) return [];
  return sh.getRange(2, 1, n - 1, COL_.DETALLE + 1).getValues().map(function(f, i){ return { fila: i + 2, v: f }; });
}
function notaNum_(x){ var n = Number(x); return isNaN(n) ? 0 : n; }

/* Nota que cuenta según NOTA_CUENTA, a partir de las notas de los intentos en orden cronológico. */
function notaQueCuenta_(notas){
  if(!notas.length) return null;
  if(NOTA_CUENTA === 'mejor') return Math.max.apply(null, notas);
  return notas[notas.length - 1];
}

/* Resumen por actividad para un alumno: { act: { n, mejor, ultimo, nota } } (nota = la que cuenta) */
function resumenAlumno_(email, filas){
  var res = {};
  filas.forEach(function(r){
    if(String(r.v[COL_.CORREO]).toLowerCase() !== email) return;
    var a = r.v[COL_.ACT]; if(!res[a]) res[a] = { n: 0, mejor: null, ultimo: null, nota: null, _l: [] };
    var x = res[a], nf = notaNum_(r.v[COL_.FINAL]);
    x.n++; if(x.mejor === null || nf > x.mejor) x.mejor = nf; x.ultimo = nf; x._l.push(nf); x.nota = notaQueCuenta_(x._l);
  });
  return res;
}
/* ¿Ha visto ya las soluciones? Entonces no puede repetir (hasta que el profesor lo reabra). */
function cerrado_(email, actId){ return props_().getProperty('VS|' + email + '|' + actId) !== null; }

/* Intentos permitidos. 'usados' = intentos ya hechos; si vio las soluciones, el máximo se queda en los ya usados. */
function maxIntentos_(email, actId, usados){
  if(cerrado_(email, actId)) return Math.max(1, Number(usados) || 0);
  if(!MAX_INTENTOS) return 0;
  var extra = Number(props_().getProperty('EX|' + email + '|' + actId) || 0);
  return MAX_INTENTOS + extra;
}

/* ===================== API PARA EL ALUMNADO ===================== */
function getInicio(){
  var email = getUsuario_(), prof = esProfesor_();
  var al = prof ? null : resolverAlumno_(email);
  var res = prof ? {} : resumenAlumno_(email, leerFilas_());
  return {
    urlPanel: prof ? urlBase_() + '?page=panel' : '',
    email: email, esProfesor: prof, nombre: al ? al.nombre : '', clase: al ? al.clase : '',
    enClassroom: !!al, 
    actividades: ORDEN_ACTIVIDADES.map(function(id){
      var a = ACTIVIDADES[id], r = res[id] || { n: 0, mejor: null, ultimo: null, nota: null };
      return { id: id, titulo: a.titulo, corto: a.corto, intro: a.intro, ref: a.ref, nPreguntas: a.preguntas.length, criterios: a.criterios || [],
               intentos: r.n, max: maxIntentos_(email, id, r.n), cerrado: !prof && cerrado_(email, id), nota: r.nota, ultimo: r.ultimo };
    })
  };
}

/* Envía las preguntas SIN soluciones y con las opciones barajadas. */
function getActividad(id){
  var act = ACTIVIDADES[id]; if(!act) throw new Error('Actividad no encontrada.');
  var email = getUsuario_(), prof = esProfesor_();
  var res = prof ? {} : resumenAlumno_(email, leerFilas_());
  var usados = res[id] ? res[id].n : 0;
  var max = maxIntentos_(email, id, usados);
  var draft = null;
  var raw = props_().getProperty('DR|' + email + '|' + id);
  if(raw){ try { draft = JSON.parse(raw); } catch(e){} }
  var preguntas = act.preguntas.map(function(q, i){
    var o = { i: i, tipo: q.tipo, q: q.q, peso: pesoPregunta_(q) };
    if(q.img && IMAGENES[q.img]) o.img = IMAGENES[q.img];
    switch(q.tipo){
      case 'rotular': {
        o.marcas = q.marcas.map(function(mk){ return { x: mk.x, y: mk.y }; });
        var todas = q.marcas.map(function(mk){ return mk.resp; }).concat(q.extras || []);
        o.opciones = baraja_(todas.filter(function(t, k){ return todas.indexOf(t) === k; }));
        break;
      }
      case 'single': o.opciones = baraja_(q.opciones); break;
      case 'tf': o.opciones = q.opciones.slice(); break;
      case 'multi': o.opciones = baraja_(q.opciones); break;
      case 'num': o.unidad = q.unidad || ''; break;
      case 'match':
        o.izq = q.pares.map(function(p){ return p.izq; });
        o.opciones = baraja_(q.pares.map(function(p){ return p.der; })); break;
      case 'clasif':
        o.cats = q.cats.slice();
        o.items = baraja_(q.items.map(function(it, k){ return { k: k, t: it.t }; })); break;
      case 'orden': {
        var m = baraja_(q.items), intentos = 0;
        while(m.join('|') === q.items.join('|') && intentos++ < 5) m = baraja_(q.items);
        o.items = m; break;
      }
      case 'abierta': o.ph = q.ph || ''; break;
    }
    return o;
  });
  return { id: id, titulo: act.titulo, intro: act.intro, ref: act.ref, preguntas: preguntas, explica: explicacionNota_(act), criterios: act.criterios || [],
           esProfesor: prof, usados: usados, max: max, draft: draft };
}

function guardarBorrador(id, respuestas){
  var email = getUsuario_(); if(!email || !ACTIVIDADES[id]) return false;
  try { props_().setProperty('DR|' + email + '|' + id, JSON.stringify(respuestas || {})); } catch(e){ return false; }
  return true;
}

function enviarActividad(id, respuestas){
  var act = ACTIVIDADES[id]; if(!act) throw new Error('Actividad no encontrada.');
  respuestas = respuestas || {};
  var email = getUsuario_(); if(!email) throw new Error('No se ha podido identificar tu cuenta. Abre el enlace con tu correo del centro.');
  var prof = esProfesor_();
  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch(e){}
  try {
    var filas = leerFilas_();
    var resumen = resumenAlumno_(email, filas)[id] || { n: 0, nota: null };
    var max = maxIntentos_(email, id, resumen.n);
    if(!prof && max && resumen.n >= max) return { sinIntentos: true, max: max, nota: resumen.nota };

    var r = corregirActividad_(act, respuestas);
    var intento = resumen.n + 1;
    var agotado = !!max && intento >= max;
    var notaAntes = resumen.nota;
    var cuenta = (NOTA_CUENTA === 'mejor' && notaAntes !== null) ? Math.max(notaAntes, r.nota) : r.nota;

    var estado = 'modo prueba (profesor): no se guarda';
    if(!prof){
      var al = resolverAlumno_(email);
      var detalle = { r: respuestas, f: r.det.map(function(d){ return d.f; }), ok: r.det.map(function(d){ return d.ok; }), fl: r.det.map(function(d){ return d.faltan; }), ov: {} };
      var detTxt = JSON.stringify(detalle); if(detTxt.length > 49000){ detalle.r = {}; detTxt = JSON.stringify(detalle); }
      getHoja_().appendRow([new Date(), email, al ? al.nombre : '', al ? al.clase : '', id, intento, r.nota, r.nota, 'No', '', detTxt]);
      var filaNueva = getHoja_().getLastRow();
      if(NOTA_CUENTA === 'mejor' && notaAntes !== null && r.nota <= notaAntes){ estado = 'sin cambios (ya tenías una nota mejor)'; }
      else { estado = empujarNota_(email, id, cuenta); }
      getHoja_().getRange(filaNueva, COL_.CLASSROOM + 1).setValue(estado);
      try { props_().deleteProperty('DR|' + email + '|' + id); } catch(e){}
    }

    // Si aún le quedan intentos y no ha sacado 10, primero decide: repetir (sin ver respuestas) o ver soluciones (y cerrar).
    var decide = !agotado && r.nota < 10;
    var enlace = prof ? '' : enlaceTarea_(email, id);
    var rev = decide ? null : revisionDe_(act, r.det.map(function(d){ return { f: d.f, ok: d.ok, faltan: d.faltan }; }));
    var verSol = !decide;
    return { decide: decide, enlace: enlace, nota: r.nota, cuenta: cuenta, anterior: notaAntes, modo: NOTA_CUENTA, intento: intento, max: max, agotado: agotado, verSol: verSol,
             classroom: estado, prof: prof, rev: rev };
  } finally {
    try { lock.releaseLock(); } catch(e){}
  }
}


/* Texto "¿De dónde sale tu nota?" calculado a partir de las preguntas reales de la actividad. */
function explicacionNota_(act){
  var n = { test:0, multi:0, num:0, fill:0, rel:0, abierta:0 }, peso = 0;
  act.preguntas.forEach(function(q){
    peso += pesoPregunta_(q);
    if(q.tipo === 'single' || q.tipo === 'tf') n.test++;
    else if(q.tipo === 'multi') n.multi++;
    else if(q.tipo === 'num') n.num++;
    else if(q.tipo === 'fill') n.fill++;
    else if(q.tipo === 'abierta') n.abierta++;
    else n.rel++;
  });
  var p = [];
  p.push(NOTA_CUENTA === 'mejor'
    ? 'La nota va de 0 a 10 y es la MEJOR de tus intentos' + (MAX_INTENTOS ? (' (tienes ' + MAX_INTENTOS + ')') : '') + ': si repites y sacas menos, no pierdes la anterior.'
    : 'La nota va de 0 a 10 y es la de tu ÚLTIMO intento' + (MAX_INTENTOS ? (' (tienes ' + MAX_INTENTOS + ')') : '') + ': si repites, la nueva nota sustituye a la anterior aunque sea más baja. Repite solo si de verdad quieres mejorar.');
  p.push('Cada pregunta vale según su peso (las de respuesta escrita pesan 1,5 y el resto 1). Tu nota = puntos conseguidos ÷ puntos posibles × 10. En esta actividad hay ' + act.preguntas.length + ' preguntas y ' + String(peso).replace('.', ',') + ' puntos posibles.');
  if(n.test)  p.push(n.test + ' de elegir una opción o verdadero/falso: todo o nada.');
  if(n.multi) p.push(n.multi + ' con varias respuestas correctas: cada acierto suma y cada fallo resta, así que marca solo lo que sepas.');
  if(n.num)   p.push(n.num + ' numérica(s): vale si el resultado está dentro del margen de error admitido.');
  if(n.fill)  p.push(n.fill + ' de completar: vale si escribes el término correcto (se admiten pequeñas faltas de ortografía).');
  if(n.rel)   p.push(n.rel + ' de relacionar, clasificar, ordenar o rotular: puntúa la proporción de aciertos, así que cada pieza bien colocada suma.');
  if(n.abierta) p.push(n.abierta + ' de respuesta escrita: se buscan los conceptos clave con tus propias palabras (no importan el orden ni las faltas leves). Cada concepto bien explicado suma; si no lo mencionas o lo afirmas al revés, no suma. El profesor puede revisarlas.');
  if(MAX_INTENTOS !== 1) p.push('Al terminar un intento solo verás tu nota. Podrás elegir entre repetir la actividad o ver las respuestas correctas, pero si miras las respuestas ya no podrás repetirla.');
  p.push('Para sacar un 10: acierta todas las preguntas y, en las escritas, explica todos los conceptos importantes con precisión.');
  return p;
}

/* Construye la revisión (con soluciones y explicaciones) a partir de {f, ok, faltan} por pregunta. */
function revisionDe_(act, dets){
  return act.preguntas.map(function(q, i){
    var d = dets[i] || { f: 0, ok: [], faltan: [] };
    return { f: d.f, w: pesoPregunta_(q), tipo: q.tipo, ok: d.ok || [], faltan: d.f >= 1 ? [] : (d.faltan || []), sol: textoSolucion_(q), exp: q.exp || '' };
  });
}

/* El alumno decide NO repetir: se le muestran las respuestas correctas y se cierran los intentos que le quedaban.
   Para el profesor (modo prueba) no se guarda nada y se corrige lo que envíe el navegador. */
function verSoluciones(id, respuestas){
  var act = ACTIVIDADES[id]; if(!act) throw new Error('Actividad no encontrada.');
  var email = getUsuario_(); if(!email) throw new Error('No se ha podido identificar tu cuenta.');
  if(esProfesor_()){
    var rp = corregirActividad_(act, respuestas || {});
    return { rev: revisionDe_(act, rp.det.map(function(d){ return { f: d.f, ok: d.ok, faltan: d.faltan }; })), cerrado: false };
  }
  var lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch(e){}
  try {
    var ultima = null;
    leerFilas_().forEach(function(r){ if(String(r.v[COL_.CORREO]).toLowerCase() === email && r.v[COL_.ACT] === id) ultima = r; });
    if(!ultima) throw new Error('Primero tienes que entregar la actividad.');
    var d = {}; try { d = JSON.parse(ultima.v[COL_.DETALLE] || '{}'); } catch(e){}
    var dets = act.preguntas.map(function(q, i){ return { f: (d.f && d.f[i]) || 0, ok: (d.ok && d.ok[i]) || [], faltan: (d.fl && d.fl[i]) || [] }; });
    props_().setProperty('VS|' + email + '|' + id, String(new Date().getTime()));
    return { rev: revisionDe_(act, dets), cerrado: true };
  } finally { try { lock.releaseLock(); } catch(e){} }
}

/* Enlace a la tarea de Classroom del alumno (para que la marque como entregada). */
function enlaceTarea_(email, actId){
  try {
    var al = resolverAlumno_(email); if(!al) return '';
    var k = 'CWL|' + al.courseId + '|' + actId, v = props_().getProperty(k);
    if(v) return v;
    var cwId = props_().getProperty('CW|' + al.courseId + '|' + actId); if(!cwId) return '';
    var cw = Classroom.Courses.CourseWork.get(al.courseId, cwId);
    if(cw && cw.alternateLink){ props_().setProperty(k, cw.alternateLink); return cw.alternateLink; }
  } catch(e){}
  return '';
}

/* ===================== CLASSROOM ===================== */
/* Pone la nota que cuenta (borrador) en la tarea de Classroom del alumno. Devuelve texto de estado. */
function empujarNota_(email, actId, nota){
  var al = resolverAlumno_(email);
  if(!al) return 'sin enviar: el alumno no está en ninguna clase configurada';
  var cwId = props_().getProperty('CW|' + al.courseId + '|' + actId);
  if(!cwId) return 'sin enviar: la tarea no está creada en ' + al.clase + ' (panel → Crear tareas)';
  try {
    var lista = Classroom.Courses.CourseWork.StudentSubmissions.list(al.courseId, cwId, { userId: email });
    var sub = (lista.studentSubmissions || [])[0];
    if(!sub) return 'sin enviar: Classroom no devuelve entrega para este alumno (¿tarea sin publicar?)';
    Classroom.Courses.CourseWork.StudentSubmissions.patch({ draftGrade: nota }, al.courseId, cwId, sub.id, { updateMask: 'draftGrade' });
    return 'ok: ' + nota + ' (' + al.clase + ')';
  } catch(err){
    return 'error Classroom: ' + String(err.message || err).slice(0, 160);
  }
}

/* ===================== PANEL DEL PROFESORADO ===================== */
function getPanel(){
  exigeProfesor_();
  var cursos = getCursos_();
  var tareas = {};
  Object.keys(cursos).forEach(function(c){
    tareas[c] = ORDEN_ACTIVIDADES.filter(function(a){ return !!props_().getProperty('CW|' + cursos[c] + '|' + a); });
  });
  return {
    clases: CLASES, cursos: cursos, tareas: tareas, urlApp: props_().getProperty('URL_APP') || '',
    actividades: ORDEN_ACTIVIDADES.map(function(id){ return { id: id, corto: ACTIVIDADES[id].corto, titulo: ACTIVIDADES[id].titulo }; }),
    maxIntentos: MAX_INTENTOS, libroUrl: getLibro_().getUrl()
  };
}

function guardarConfig(urlApp, enlaces){
  exigeProfesor_();
  var cursos = {}, avisos = [];
  CLASES.forEach(function(c){
    var v = (enlaces || {})[c]; if(!v) return;
    var id = decodificarCourseId(v);
    if(id) cursos[c] = id; else avisos.push('No se ha podido leer el enlace de ' + c);
  });
  urlApp = String(urlApp || '').trim();
  if(urlApp && !/\/exec(\?.*)?$/.test(urlApp)) avisos.push('La URL de la aplicación debería acabar en /exec');
  props_().setProperty('CURSOS', JSON.stringify(cursos));
  props_().setProperty('URL_APP', urlApp.replace(/\?.*$/, ''));
  // se olvidan las asignaciones de alumnos guardadas para volver a calcularlas con la nueva configuración
  var todas = props_().getProperties();
  Object.keys(todas).forEach(function(k){ if(k.indexOf('AL|') === 0) props_().deleteProperty(k); });
  return { cursos: cursos, avisos: avisos };
}


function descripcionTarea_(a){
  var t = a.intro + '\n\nEntra con tu cuenta del centro y haz la actividad en el enlace adjunto. Se corrige sola y la nota llega aquí cuando tu profesor la publique.';
  t += '\n\n¿DE DÓNDE SALE MI NOTA?\n' + explicacionNota_(a).map(function(x){ return '• ' + x; }).join('\n');
  if(a.criterios && a.criterios.length){
    t += '\n\nCRITERIOS DE EVALUACIÓN QUE SE TRABAJAN\n' + a.criterios.map(function(k){ return '• ' + k.id + '. ' + k.t; }).join('\n');
  }
  return t;
}

function crearTareas(){
  exigeProfesor_();
  var url = props_().getProperty('URL_APP'); if(!url) throw new Error('Primero guarda la URL /exec de la aplicación.');
  var cursos = getCursos_(), claves = Object.keys(cursos); if(!claves.length) throw new Error('Primero guarda los enlaces de Classroom de las clases.');
  var log = [];
  claves.forEach(function(clase){
    ORDEN_ACTIVIDADES.forEach(function(aid){
      var k = 'CW|' + cursos[clase] + '|' + aid;
      if(props_().getProperty(k)){ log.push(clase + ' · ' + ACTIVIDADES[aid].corto + ': ya existía'); return; }
      try {
        var a = ACTIVIDADES[aid];
        var cw = Classroom.Courses.CourseWork.create({
          title: 'Actividad interactiva: ' + a.corto,
          description: descripcionTarea_(a),
          workType: 'ASSIGNMENT', state: 'DRAFT', maxPoints: 10,
          materials: [{ link: { url: url, title: 'Abrir las actividades interactivas' } }]
        }, cursos[clase]);
        props_().setProperty(k, cw.id);
        if(cw.alternateLink) props_().setProperty('CWL|' + cursos[clase] + '|' + aid, cw.alternateLink);
        log.push(clase + ' · ' + a.corto + ': creada');
      } catch(err){ log.push(clase + ' · ' + ACTIVIDADES[aid].corto + ': ERROR ' + String(err.message || err).slice(0, 140)); }
    });
  });
  return log;
}

function fmt_(d){ try { return Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), 'dd/MM HH:mm'); } catch(e){ return ''; } }

/* Tabla de una actividad: una fila por alumno (incluye a quien no ha empezado, si hay clase). */
function getResultados(actId, clase){
  exigeProfesor_();
  var filas = leerFilas_(), por = {};
  filas.forEach(function(r){
    if(r.v[COL_.ACT] !== actId) return;
    var em = String(r.v[COL_.CORREO]).toLowerCase();
    if(clase && r.v[COL_.CLASE] !== clase) return;
    var x = por[em] || (por[em] = { correo: em, nombre: r.v[COL_.NOMBRE] || em, clase: r.v[COL_.CLASE] || '', n: 0, mejor: null, ultima: '', estado: '', _l: [], cerrado: cerrado_(em, actId) });
    var nf = notaNum_(r.v[COL_.FINAL]); x.n++; x._l.push(nf);
    x.mejor = notaQueCuenta_(x._l);
    x.ultima = fmt_(r.v[COL_.FECHA]); x.estado = String(r.v[COL_.CLASSROOM] || '');
  });
  var cursos = getCursos_();
  if(clase && cursos[clase]){
    try {
      var tok;
      do {
        var l = Classroom.Courses.Students.list(cursos[clase], { pageSize: 100, pageToken: tok });
        (l.students || []).forEach(function(s){
          var em = String((s.profile && s.profile.emailAddress) || '').toLowerCase();
          if(em && !por[em]) por[em] = { correo: em, nombre: (s.profile.name && s.profile.name.fullName) || em, clase: clase, n: 0, mejor: null, ultima: '', estado: '' };
        });
        tok = l.nextPageToken;
      } while(tok);
    } catch(e){}
  }
  var out = Object.keys(por).map(function(k){ return por[k]; });
  out.sort(function(a, b){ return a.nombre.localeCompare(b.nombre, 'es'); });
  return { filas: out, extra: Number(MAX_INTENTOS) };
}

/* Reabre intentos: si el alumno había visto las soluciones, se le devuelven los intentos que le quedaban;
   si había gastado todos, se le concede uno más. */
function darIntentoExtra(correo, actId){
  exigeProfesor_();
  correo = String(correo).toLowerCase();
  if(cerrado_(correo, actId)){ props_().deleteProperty('VS|' + correo + '|' + actId); return { desbloqueado: true, extra: Number(props_().getProperty('EX|' + correo + '|' + actId) || 0) }; }
  var k = 'EX|' + correo + '|' + actId;
  var n = Number(props_().getProperty(k) || 0) + 1; props_().setProperty(k, String(n));
  return { desbloqueado: false, extra: n };
}

/* Vuelve a enviar a Classroom la nota que cuenta de todos los alumnos de una actividad. */
function sincronizarNotas(actId){
  exigeProfesor_();
  var filas = leerFilas_(), listas = {}, mejor = {};
  filas.forEach(function(r){
    if(r.v[COL_.ACT] !== actId) return;
    var em = String(r.v[COL_.CORREO]).toLowerCase();
    (listas[em] = listas[em] || []).push(notaNum_(r.v[COL_.FINAL]));
    mejor[em] = notaQueCuenta_(listas[em]);
  });
  var ok = 0, mal = [];
  Object.keys(mejor).forEach(function(em){
    var e = empujarNota_(em, actId, mejor[em]);
    if(e.indexOf('ok') === 0) ok++; else mal.push(em + ' → ' + e);
  });
  return { enviadas: ok, fallos: mal };
}

/* ---------- Revisión de preguntas abiertas ---------- */
function limpiaHtml_(s){ return quitaHtml_(s); }
function getRevision(actId, soloPendientes){
  exigeProfesor_();
  var act = ACTIVIDADES[actId], salida = [];
  leerFilas_().reverse().forEach(function(r){
    if(salida.length >= 40 || r.v[COL_.ACT] !== actId) return;
    if(soloPendientes && String(r.v[COL_.REVISADO]) === 'Sí') return;
    var d; try { d = JSON.parse(r.v[COL_.DETALLE]); } catch(e){ return; }
    var preg = [];
    act.preguntas.forEach(function(q, i){
      if(q.tipo !== 'abierta') return;
      var ov = d.ov && d.ov[i] !== undefined ? d.ov[i] : null;
      preg.push({ i: i, q: limpiaHtml_(q.q), texto: (d.r && d.r[i]) || '', auto: d.f[i], ok: d.ok[i] || [], faltan: d.fl[i] || [], ov: ov, modelo: q.modelo || '' });
    });
    salida.push({ fila: r.fila, nombre: r.v[COL_.NOMBRE] || r.v[COL_.CORREO], clase: r.v[COL_.CLASE], intento: r.v[COL_.INTENTO],
                  fecha: fmt_(r.v[COL_.FECHA]), nota: notaNum_(r.v[COL_.FINAL]), revisado: String(r.v[COL_.REVISADO]) === 'Sí', preguntas: preg });
  });
  return salida;
}

/* El profesor fija la fracción (0..1) de una pregunta abierta; se recalcula la nota y se reenvía la que cuenta. */
function ajustarPregunta(fila, qIdx, frac){
  exigeProfesor_();
  var sh = getHoja_(), v = sh.getRange(fila, 1, 1, COL_.DETALLE + 1).getValues()[0];
  var act = ACTIVIDADES[v[COL_.ACT]], d = JSON.parse(v[COL_.DETALLE]);
  d.ov = d.ov || {};
  if(frac === null || frac === '' || frac === undefined) delete d.ov[qIdx]; else d.ov[qIdx] = Math.max(0, Math.min(1, Number(frac)));
  var obt = 0, tot = 0;
  act.preguntas.forEach(function(q, i){
    var w = pesoPregunta_(q), f = (d.ov[i] !== undefined) ? d.ov[i] : d.f[i];
    tot += w; obt += w * f;
  });
  var nueva = Math.round(obt / tot * 100) / 10;
  sh.getRange(fila, COL_.FINAL + 1).setValue(nueva);
  sh.getRange(fila, COL_.DETALLE + 1).setValue(JSON.stringify(d));
  return { nota: nueva };
}
function cerrarRevision(fila){
  exigeProfesor_();
  var sh = getHoja_(), v = sh.getRange(fila, 1, 1, COL_.DETALLE + 1).getValues()[0];
  sh.getRange(fila, COL_.REVISADO + 1).setValue('Sí');
  var email = String(v[COL_.CORREO]).toLowerCase(), actId = v[COL_.ACT], lista = [];
  leerFilas_().forEach(function(r){
    if(String(r.v[COL_.CORREO]).toLowerCase() === email && r.v[COL_.ACT] === actId) lista.push(notaNum_(r.v[COL_.FINAL]));
  });
  var mejor = notaQueCuenta_(lista) || 0;
  var estado = empujarNota_(email, actId, mejor);
  sh.getRange(fila, COL_.CLASSROOM + 1).setValue('revisión: ' + estado);
  return { mejor: mejor, estado: estado };
}