// VERSIÓN 2026-10-11-v4
/**
 * MOTOR DE CORRECCIÓN · Actividades interactivas de plásticos e impresión 3D
 * IES Murillo · Tecnología y Digitalización 3º ESO
 *
 * Funciones puras (sin servicios de Google): corrigen una actividad y devuelven
 * una fracción 0..1 por pregunta. Las respuestas se comparan por TEXTO, no por
 * posición, porque el servidor baraja las opciones cada vez que se abre la
 * actividad y así el cliente nunca recibe las soluciones.
 *
 * CORRECCIÓN POR PALABRAS CLAVE (preguntas abiertas) — cómo se intenta ser justo:
 *  1. Se normaliza todo: minúsculas, sin tildes, sin signos, espacios únicos.
 *     "Termoplásticos," == "termoplasticos".
 *  2. Se comparan RAÍCES, no palabras exactas: plástico/plásticos/plástica
 *     cuentan igual. Una "palabra*" con asterisco significa "cualquier palabra
 *     que empiece así" (fund* = fundir, fundirse, funden, fundido...).
 *  3. Se toleran faltas de escritura: una letra de diferencia en palabras de 5+
 *     letras (polietileo ≈ polietileno), dos en palabras muy largas.
 *  4. Se toleran espacios mal puestos: "termo plástico" y "termoplastico" valen.
 *  5. Cada idea ("concepto") admite muchas formas de decirla (sinónimos, siglas,
 *     frases); basta con una. No hace falta copiar el libro.
 *  6. Hay varias vías de llegar al 10: se pide un número de ideas ("necesarios")
 *     menor que el total de ideas posibles.
 *  7. Crédito parcial proporcional: 2 de 4 ideas = 50 % de la pregunta.
 *  8. Si la idea se puede negar para decir lo contrario ("no se pueden fundir" en vez de
 *     "se pueden fundir"), se descarta la aparición precedida de no/nunca/jamás en su misma frase.
 *  9. Las ideas que dependen de una asociación (objeto ↔ técnica) exigen que las
 *     dos palabras estén cerca en la frase, para que no valga con volcar una
 *     lista de términos sueltos.
 * 10. Todo texto escrito se guarda y el profesor puede corregir a mano el
 *     resultado de cualquier pregunta abierta (Panel → Revisión).
 */

/* ---------- Normalización ---------- */
function norm_(s){
  return String(s == null ? '' : s).toLowerCase().normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}
function quitaHtml_(s){ return String(s == null ? '' : s).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(); }

/* Raíz sencilla del español: quita -s y una vocal final (plásticos→plastic). */
function stem_(t){
  if(t.length < 5) return t;
  if(t.charAt(t.length - 1) === 's') t = t.slice(0, -1);
  if(t.length >= 5 && /[aeo]$/.test(t)) t = t.slice(0, -1);
  return t;
}

/* Distancia de edición con tope (devuelve tope+1 si lo supera). */
function lev_(a, b, tope){
  if(Math.abs(a.length - b.length) > tope) return tope + 1;
  var prev = [], cur = [], i, j;
  for(j = 0; j <= b.length; j++) prev[j] = j;
  for(i = 1; i <= a.length; i++){
    cur = [i]; var min = i;
    for(j = 1; j <= b.length; j++){
      var c = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1;
      cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c);
      if(cur[j] < min) min = cur[j];
    }
    if(min > tope) return tope + 1;
    prev = cur;
  }
  return prev[b.length];
}

/* ¿La palabra del alumno (tok) coincide con la palabra clave (w)? */
function tokMatch_(w, tok){
  if(w.charAt(w.length - 1) === '*'){ return tok.indexOf(w.slice(0, -1)) === 0; }
  if(w === tok) return true;
  var sa = stem_(w), st = stem_(tok);
  if(sa === st) return true;
  var m = Math.min(sa.length, st.length), L = Math.max(sa.length, st.length);
  if(m >= 5 && sa.charAt(0) === st.charAt(0)){
    var tope = L >= 12 ? 2 : 1;
    return lev_(sa, st, tope) <= tope;
  }
  return false;
}

/* Convierte una alternativa ("no se fund*") en lista de palabras clave. */
var CACHE_ALT_ = {};
function palabrasAlt_(alt){
  if(CACHE_ALT_[alt]) return CACHE_ALT_[alt];
  var out = [];
  String(alt).trim().split(/\s+/).forEach(function(raw){
    var star = raw.charAt(raw.length - 1) === '*';
    var partes = norm_(raw.replace(/\*/g, '')).split(' ').filter(Boolean);
    partes.forEach(function(p, i){ out.push((star && i === partes.length - 1) ? p + '*' : p); });
  });
  CACHE_ALT_[alt] = out;
  return out;
}

/* Texto del alumno -> palabras + cláusula de cada palabra (para detectar negaciones). */
var CONJ_ = { y:1, e:1, pero:1, sino:1, aunque:1, mientras:1, ni:1 };
var NEGS_ = { no:1, nunca:1, jamas:1, tampoco:1, ningun:1, ninguna:1, ninguno:1 };
function tokenizar_(texto){
  var s = String(texto == null ? '' : texto).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  s = s.replace(/[.,;:!?()\n\r]+/g, ' | ').replace(/[^a-z0-9|]+/g, ' ');
  var toks = [], cl = [], sn = [], c = 0, p = 0;
  s.split(' ').forEach(function(w){
    if(!w) return;
    if(w === '|'){ c++; p++; return; }
    toks.push(w); cl.push(c); sn.push(p);
    if(CONJ_[w]) c++;
  });
  return { toks: toks, cl: cl, sn: sn, sq: toks.join('') };
}
/* ¿Hay una negación en la misma cláusula, justo antes de la posición i? */
function negadaEn_(T, i){
  for(var k = i - 1; k >= 0 && k >= i - 6 && T.cl[k] === T.cl[i]; k--){ if(NEGS_[T.toks[k]]) return true; }
  return false;
}

/* Posiciones donde aparece la alternativa en el texto (−1 = solo detectada sin espacios).
 * Si neg=true se descartan las apariciones precedidas de "no/nunca/jamás…" en su cláusula
 * (salvo que la propia alternativa empiece por una negación: 'no * fund*'). */
var HUECO_MAX_ = 5; // palabras de relleno permitidas entre dos palabras de una frase
function posAlt_(alt, T, neg){
  var toks = T.toks, ws = palabrasAlt_(alt), res = [], i;
  if(!ws.length) return res;
  var exenta = !!NEGS_[ws[0]], visto = false;
  for(i = 0; i < toks.length; i++){
    if(!tokMatch_(ws[0], toks[i])) continue;
    var pos = i, ok = true;
    for(var k = 1; k < ws.length; k++){
      var found = -1;
      for(var j = pos + 1; j <= pos + HUECO_MAX_ && j < toks.length && T.sn[j] === T.sn[pos]; j++){
        if(tokMatch_(ws[k], toks[j])){ found = j; break; }
      }
      if(found < 0){ ok = false; break; }
      pos = found;
    }
    if(!ok) continue;
    visto = true;
    if(neg && !exenta && negadaEn_(T, i)) continue;
    res.push(i);
  }
  if(!res.length && !visto){
    var plano = ws.join('').replace(/\*/g, '');
    var tieneEstrella = ws.some(function(w){ return w.charAt(w.length - 1) === '*'; });
    if(!tieneEstrella && plano.length >= 7 && T.sq.indexOf(plano) >= 0) res.push(-1);
  }
  return res;
}
function posLista_(alts, T, neg){
  var all = [];
  for(var i = 0; i < alts.length; i++){ all = all.concat(posAlt_(alts[i], T, neg)); if(all.length > 30) break; }
  return all;
}

/* Fracción 0..1 en que se cumple un concepto. */
function evalConcepto_(c, T){
  var neg = !!c.neg;
  if(c.lista){
    var n = 0;
    c.lista.forEach(function(item){ if(posLista_(item, T, neg).length) n++; });
    return Math.min(1, n / (c.min || c.lista.length));
  }
  if(c.a && c.b){
    var pa = posLista_(c.a, T, false), pb = posLista_(c.b, T, neg);
    if(!pa.length || !pb.length) return 0;
    var d = c.dist || 8;
    for(var i = 0; i < pa.length; i++) for(var j = 0; j < pb.length; j++){
      if(pa[i] < 0 || pb[j] < 0 || Math.abs(pa[i] - pb[j]) <= d) return 1;
    }
    return 0;
  }
  return posLista_(c.alts || [], T, neg).length ? 1 : 0;
}

/* Corrige una pregunta abierta. Devuelve { frac, ok:[etiquetas], faltan:[etiquetas] }. */
function corregirAbierta_(q, texto){
  var T = tokenizar_(texto);
  var res = { frac: 0, ok: [], faltan: [] };
  if(!T.toks.length){ q.conceptos.forEach(function(c){ res.faltan.push(c.l); }); return res; }
  var total = 0, got = 0;
  q.conceptos.forEach(function(c){
    var w = c.w || 1, f = evalConcepto_(c, T);
    total += w; got += w * f;
    if(f >= 1) res.ok.push(c.l); else res.faltan.push(c.l + (f > 0 ? ' (a medias)' : ''));
  });
  var need = q.necesarios != null ? q.necesarios : total;
  res.frac = Math.min(1, got / need);
  res.frac = Math.round(res.frac * 100) / 100;
  return res;
}

/* ---------- Preguntas objetivas ---------- */
function mismoTexto_(a, b){ return norm_(quitaHtml_(a)) === norm_(quitaHtml_(b)); }

function respuestaFill_(q, ans){
  if(ans == null || String(ans).trim() === '') return false;
  var n = norm_(ans);
  return q.acepta.some(function(a){
    var na = norm_(a);
    if(n === na) return true;
    if(na.length >= 6 && lev_(n, na, 1) <= 1) return true;
    var nt = n.split(' ').length, nat = na.split(' ').length;
    return nt <= nat + 2 && (' ' + n + ' ').indexOf(' ' + na + ' ') >= 0;
  });
}

/* Devuelve { frac, ok:[..] , faltan:[..] } para cualquier tipo. */
function puntuar_(q, ans){
  var r = { frac: 0, ok: [], faltan: [] };
  switch(q.tipo){
    case 'single': case 'tf':
      r.frac = (ans != null && mismoTexto_(ans, q.opciones[q.correcta])) ? 1 : 0; break;
    case 'multi': {
      var cor = q.correctas.map(function(i){ return norm_(quitaHtml_(q.opciones[i])); });
      var sel = Array.isArray(ans) ? ans.map(function(x){ return norm_(quitaHtml_(x)); }) : [];
      var hits = sel.filter(function(x){ return cor.indexOf(x) >= 0; }).length;
      var fall = sel.length - hits;
      r.frac = Math.max(0, (hits - fall) / cor.length); break;
    }
    case 'num': {
      if(ans == null || ans === ''){ r.frac = 0; break; }
      var v = parseFloat(String(ans).replace(',', '.'));
      r.frac = (!isNaN(v) && Math.abs(v - q.resp) <= q.tol) ? 1 : 0; break;
    }
    case 'fill': r.frac = respuestaFill_(q, ans) ? 1 : 0; break;
    case 'match': {
      var a1 = Array.isArray(ans) ? ans : [], ok1 = 0;
      q.pares.forEach(function(p, i){ if(a1[i] != null && mismoTexto_(a1[i], p.der)) ok1++; });
      r.frac = ok1 / q.pares.length; break;
    }
    case 'rotular': {
      var a5 = Array.isArray(ans) ? ans : [], ok5 = 0;
      q.marcas.forEach(function(mk, i){ if(a5[i] != null && mismoTexto_(a5[i], mk.resp)) ok5++; });
      r.frac = ok5 / q.marcas.length; break;
    }
    case 'clasif': {
      var a2 = Array.isArray(ans) ? ans : [], ok2 = 0;
      q.items.forEach(function(it, i){ if(a2[i] != null && mismoTexto_(a2[i], q.cats[it.c])) ok2++; });
      r.frac = ok2 / q.items.length; break;
    }
    case 'orden': {
      var a3 = Array.isArray(ans) ? ans : [], ok3 = 0;
      q.items.forEach(function(it, i){ if(a3[i] != null && mismoTexto_(a3[i], it)) ok3++; });
      r.frac = ok3 / q.items.length; break;
    }
    case 'abierta': {
      var ab = corregirAbierta_(q, ans);
      r = ab; break;
    }
  }
  r.frac = Math.round(r.frac * 100) / 100;
  return r;
}

function pesoPregunta_(q){ return q.peso != null ? q.peso : (q.tipo === 'abierta' ? 1.5 : 1); }

function textoSolucion_(q){
  switch(q.tipo){
    case 'single': case 'tf': return quitaHtml_(q.opciones[q.correcta]);
    case 'multi': return q.correctas.map(function(i){ return quitaHtml_(q.opciones[i]); }).join(' · ');
    case 'num': return String(q.resp).replace('.', ',') + (q.unidad ? ' ' + q.unidad : '') + (q.tol ? ' (valen valores entre ' + (q.resp - q.tol) + ' y ' + (q.resp + q.tol) + ')' : '');
    case 'fill': return q.acepta[0];
    case 'match': return q.pares.map(function(p){ return quitaHtml_(p.izq) + ' → ' + quitaHtml_(p.der); }).join(' · ');
    case 'rotular': return q.marcas.map(function(mk, i){ return (i + 1) + ' → ' + mk.resp; }).join(' · ');
    case 'clasif': return q.items.map(function(it){ return quitaHtml_(it.t) + ' → ' + q.cats[it.c]; }).join(' · ');
    case 'orden': return q.items.map(function(t, i){ return (i + 1) + '. ' + quitaHtml_(t); }).join('  ');
    case 'abierta': return q.modelo || '';
  }
  return '';
}

/* Corrige una actividad completa. respuestas = { "0": ..., "1": ... } */
function corregirActividad_(act, respuestas){
  respuestas = respuestas || {};
  var obtenido = 0, total = 0, det = [];
  act.preguntas.forEach(function(q, i){
    var r = puntuar_(q, respuestas[i]);
    var w = pesoPregunta_(q);
    total += w; obtenido += w * r.frac;
    det.push({ f: r.frac, ok: r.ok || [], faltan: r.faltan || [], w: w });
  });
  var nota = Math.round(obtenido / total * 100) / 10; // 0..10 con un decimal
  return { nota: nota, obtenido: obtenido, total: total, det: det };
}

/* Baraja (Fisher–Yates) una copia del array. */
function baraja_(arr){
  var a = arr.slice();
  for(var i = a.length - 1; i > 0; i--){ var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; }
  return a;
}