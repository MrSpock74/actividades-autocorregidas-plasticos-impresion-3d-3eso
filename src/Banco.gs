// VERSIÓN 2026-10-11-v4
/**
 * BANCO DE ACTIVIDADES · Plásticos e impresión 3D · 3º ESO · IES Murillo
 * Basado en la unidad 3 del libro de Donostiarra (Proyecto STAR, pp. 72-91) y en
 * las fichas de plásticos e impresión 3D de yourtechnologyweb (CC0).
 *
 * Tipos de pregunta:
 *  single   una opción         { opciones:[...], correcta:índice }
 *  tf       verdadero/falso    { correcta:0 (Verdadero) | 1 (Falso) }
 *  multi    varias opciones    { opciones:[...], correctas:[índices] }  (crédito parcial)
 *  num      número             { resp, tol, unidad }
 *  fill     completar          { acepta:[...] }
 *  match    relacionar         { pares:[{izq, der}] }
 *  clasif   clasificar         { cats:[...], items:[{t, c:índice de cats}] }
 *  orden    ordenar pasos      { items:[... en el orden correcto] }
 *  rotular  rotular imagen     { img:'clave de Imagenes.gs', marcas:[{x,y (% de la imagen), resp}], extras:[distractores] }
 *  (cualquier pregunta puede llevar img:'clave' para mostrar una imagen sobre las opciones)
 *  abierta  texto libre        { conceptos:[...], necesarios, modelo }
 *
 * Conceptos de las preguntas abiertas (ver Motor.gs):
 *  { l:'etiqueta que verá el alumno', alts:['forma de decirlo', ...], w:peso }
 *  { l, a:[...], b:[...], dist:8 }       dos ideas que deben aparecer cerca
 *  { l, lista:[[alts],[alts],...], min } al menos "min" elementos distintos
 *  Una palabra con * al final = "empieza por" (fund* = fundir, fundido, funden...)
 */

var ACTIVIDADES = {

/* =====================================================================
 * 1 · MATERIALES PLÁSTICOS  (STAR 17-29 · fichas 1 y 2)
 * ===================================================================== */
plasticos: {
  id: 'plasticos',
  titulo: 'Materiales plásticos: conocer para reciclar',
  corto: 'Materiales plásticos',
  criterios: [
    {id:'2.2', t:'Seleccionar, planificar y organizar materiales, herramientas y tareas para construir una solución, de forma individual o en grupo.'},
    {id:'3.1', t:'Fabricar objetos o modelos manipulando materiales con herramientas y máquinas adecuadas, aplicando fundamentos técnicos y respetando las normas de seguridad.'},
    {id:'7.1', t:'Reconocer la influencia de la tecnología en la sociedad y en la sostenibilidad ambiental, valorando su contribución al desarrollo sostenible.'}
  ],
  ref: 'Libro STAR, actividades 17-29 · Fichas 1 y 2 de yourtechnologyweb',
  intro: 'Qué es un plástico, cómo se clasifican, qué significan los números del triángulo de reciclaje y qué plástico conviene para cada objeto.',
  preguntas: [

  { tipo:'single', q:'¿Cómo se llama la unidad básica que se repite en la estructura de todos los plásticos?',
    opciones:['Monómero','Polímero','Aditivo','Granza'], correcta:0,
    exp:'La unidad que se repite es el <b>monómero</b>. La cadena formada por muchos monómeros unidos es el <b>polímero</b>.' },

  { tipo:'fill', q:'Un polímero se convierte en el plástico que usamos cuando se le añaden ______ (sustancias que le dan color, flexibilidad o resistencia).',
    acepta:['aditivos','aditivo','colorantes y aditivos','aditivos y colorantes'],
    exp:'Polímero + <b>aditivos</b> = plástico. Los aditivos y colorantes se mezclan con el polímero para dar las propiedades finales.' },

  { tipo:'clasif', q:'Clasifica cada material según su <b>origen</b>.',
    cats:['Natural','Sintético (del petróleo)'],
    items:[ {t:'Látex (savia del árbol Hevea)', c:0}, {t:'Plástico derivado del almidón', c:0}, {t:'Plástico derivado de la celulosa', c:0},
            {t:'Polietileno', c:1}, {t:'PVC', c:1}, {t:'Poliestireno', c:1} ],
    exp:'Los plásticos sintéticos se obtienen del petróleo y sus derivados. Los naturales salen directamente de materias primas naturales: látex, almidón y celulosa.' },

  { tipo:'clasif', q:'Según la estructura de sus cadenas, los plásticos son termoplásticos, termoestables o elastómeros. Clasifica estas descripciones.',
    cats:['Termoplástico','Termoestable','Elastómero'],
    items:[ {t:'Cadenas lineales unidas por enlaces débiles', c:0},
            {t:'Cadenas entrecruzadas formando redes con enlaces fuertes', c:1},
            {t:'Cadenas de polímeros enrolladas', c:2},
            {t:'Se ablandan con el calor y se pueden fundir y moldear muchas veces', c:0},
            {t:'Muy flexibles: recuperan su forma cuando deja de actuar la fuerza que los deforma', c:2},
            {t:'Rígidos y resistentes al calor, como la baquelita', c:1} ],
    exp:'<b>Termoplásticos</b>: cadenas lineales, enlaces débiles, se funden varias veces. <b>Termoestables</b>: redes de enlaces fuertes, no se vuelven a fundir. <b>Elastómeros</b>: cadenas enrolladas, muy elásticos.' },

  { tipo:'clasif', q:'Indica a qué tipo de plástico corresponde cada material.',
    cats:['Termoplástico','Termoestable','Elastómero'],
    items:[ {t:'Baquelita', c:1}, {t:'Polietileno', c:0}, {t:'Caucho', c:2}, {t:'Látex', c:2}, {t:'PVC', c:0}, {t:'Melamina', c:1}, {t:'Resina de poliéster', c:1} ],
    exp:'Termoestables: baquelita, melamina y resina de poliéster. Termoplásticos: polietileno y PVC. Elastómeros: caucho y látex (el látex es el caucho natural).' },

  { tipo:'match', q:'Relaciona cada <b>código de reciclaje (RIC)</b> con su plástico.',
    pares:[ {izq:'1', der:'PET (polietileno tereftalato)'}, {izq:'2', der:'HDPE (polietileno de alta densidad)'}, {izq:'3', der:'PVC (policloruro de vinilo)'},
            {izq:'4', der:'LDPE (polietileno de baja densidad)'}, {izq:'5', der:'PP (polipropileno)'}, {izq:'6', der:'PS (poliestireno)'}, {izq:'7', der:'Otros (nailon, policarbonato, ABS...)'} ],
    exp:'1 PET · 2 HDPE · 3 PVC · 4 LDPE · 5 PP · 6 PS · 7 Otros. El código RIC se creó en 1988 e identifica la resina principal de cada plástico.' },

  { tipo:'multi', q:'¿Qué números del código RIC identifican los plásticos <b>fácilmente reciclables</b> (los que no necesitan plantas especializadas)? Marca todos los correctos.',
    opciones:['1 · PET','2 · HDPE','3 · PVC','4 · LDPE','5 · PP','6 · PS','7 · Otros'], correctas:[0,1,3,4],
    exp:'Son los grupos <b>1, 2, 4 y 5</b>. Los 3 y 6 se reciclan en plantas especializadas, y los del 7 son muy difíciles o imposibles de reciclar.' },

  { tipo:'match', q:'Relaciona cada objeto con el material del que está hecho.',
    pares:[ {izq:'Bolsa de plástico', der:'Polietileno de baja densidad'}, {izq:'Desagüe', der:'PVC'}, {izq:'Bolígrafo', der:'Polipropileno'},
            {izq:'Embalaje de electrodoméstico', der:'Porexpán (poliestireno expandido)'}, {izq:'Piscina', der:'Resina de poliéster'}, {izq:'Manguera', der:'Caucho'} ],
    exp:'Bolsa → LDPE · desagüe → PVC · bolígrafo → polipropileno · embalaje → porexpán · piscina → resina de poliéster (con fibra de vidrio) · manguera → caucho.' },

  { tipo:'match', q:'Relaciona cada plástico con un uso típico.',
    pares:[ {izq:'PET', der:'Botellas de agua y bebidas'}, {izq:'HDPE', der:'Botellas de leche'}, {izq:'PVC', der:'Aislamiento de cables y perfiles de ventanas'},
            {izq:'LDPE', der:'Bolsas y film de envasado'}, {izq:'PP', der:'Juguetes y carpetas'}, {izq:'PS', der:'Envases de yogur y productos lácteos'} ],
    exp:'PET: transparente, botellas. HDPE: opaco, botellas de leche. PVC: resistente a impactos, tuberías y ventanas. LDPE: suave y flexible, bolsas. PP: fácil de moldear y colorear. PS: ligero y frágil, envases lácteos.' },

  { tipo:'clasif', q:'¿Es <b>recomendable</b> fabricar estos objetos con el material indicado?',
    cats:['Recomendable','No recomendable'],
    items:[ {t:'Tapa de una cacerola de polietileno de baja densidad (LDPE)', c:1},
            {t:'Suela de unas zapatillas deportivas de caucho', c:0},
            {t:'Recubrimiento del mobiliario de un aula con melamina', c:0},
            {t:'Enchufe de polipropileno', c:1} ],
    exp:'El LDPE es blando y no aguanta el calor de una cacerola. El caucho es elástico y perfecto para suelas. La melamina es resistente y fácil de limpiar. El polipropileno se funde con el calor; un enchufe se hace con termoestables como la baquelita.' },

  { tipo:'abierta', q:'¿Cómo se comportan los plásticos <b>termoestables</b> frente al calor? Pon dos ejemplos.',
    ph:'Explica su comportamiento y escribe dos ejemplos…',
    conceptos:[
      { l:'que una vez moldeados no se pueden volver a fundir ni remoldear', w:2, alts:[
          'no * fund*','no * derret*','no * fusion','no * ablanda*','no * reblandec*','no * remold*','no * moldear * nuevo','no * moldear * otra vez','no * reciclar*',
          'una vez * moldead*','una vez * conformad*','una vez * enfriad*','solo * una vez','unica vez','mantienen * forma','conservan * forma','no cambian * forma','permanent*','no * modific*','no * deform*' ] },
      { l:'que con mucho calor se degradan, se descomponen o se queman', alts:['degrad*','descompon*','carboniz*','quema*','arden','ardi*','se rompen','se estropean','pierden sus propiedades'] },
      { l:'ejemplo: baquelita', alts:['baquelita'] },
      { l:'ejemplo: melamina', alts:['melamina'] },
      { l:'ejemplo: resina de poliéster', alts:['resina poliester','resinas poliester','poliester','fibra de vidrio'] }
    ], necesarios:3,
    modelo:'Se pueden moldear con calor una vez, pero después no vuelven a fundirse (si se calientan mucho se degradan o se descomponen). Ejemplos: baquelita, melamina, resina de poliéster.',
    exp:'Los termoestables tienen cadenas entrecruzadas formando redes: se moldean con calor <b>una sola vez</b> y no se vuelven a fundir.' },

  { tipo:'abierta', q:'¿Cómo se comportan los plásticos <b>termoplásticos</b> frente al calor? Pon dos ejemplos.',
    ph:'Explica su comportamiento y escribe dos ejemplos…',
    conceptos:[
      { l:'que se ablandan o se funden con el calor', neg:true, alts:['ablanda*','fund*','derret*','reblandec*','fusion','blando','se funde','se deshacen','se hacen maleables','se vuelven maleables'] },
      { l:'que se pueden volver a moldear o fundir muchas veces (reciclables)', w:2, neg:true, alts:[
          'muchas veces','varias veces','tantas veces','todas las veces','repetidamente','de nuevo','otra vez','nuevamente','una y otra vez','reciclabl*','se pueden reciclar','volver a moldear*','volver a fund*','re moldear*','remoldear*','reutiliz*','infinitas veces','las veces que' ] },
      { l:'ejemplo: PET', alts:['pet','tereftalato'] },
      { l:'ejemplo: polietileno (PE, HDPE, LDPE)', alts:['polietileno','hdpe','ldpe','pe'] },
      { l:'ejemplo: PVC', alts:['pvc','policloruro','cloruro de polivinilo'] },
      { l:'ejemplo: polipropileno (PP)', alts:['polipropileno','pp'] },
      { l:'ejemplo: poliestireno / porexpán (PS)', alts:['poliestireno','ps','porexpan','corcho blanco','estireno'] },
      { l:'ejemplo: ABS, PLA, nailon o policarbonato', alts:['abs','pla','nailon','nylon','policarbonato'] }
    ], necesarios:4,
    modelo:'Se ablandan con el calor y se pueden fundir y moldear muchas veces (son reciclables). Ejemplos: PET, PVC, polietileno, polipropileno, poliestireno.',
    exp:'Los termoplásticos tienen cadenas lineales con enlaces débiles: el calor las separa y se pueden moldear <b>tantas veces como se quiera</b>.' },

  { tipo:'abierta', q:'¿Qué es el código RIC y qué finalidad tiene?',
    ph:'Explica qué es y para qué sirve…',
    conceptos:[
      { l:'que es un número (del 1 al 7) o un símbolo, normalmente un triángulo de flechas', alts:['numero*','simbolo*','triangulo','codigo','flechas','del 1 al 7','1 al 7','siete'] },
      { l:'que identifica el tipo de plástico o su resina principal', w:2, alts:[
          'identific*','indica * plastic*','indica * tipo','indica * resina','indica * material','dice * plastic*','dice * tipo','dice * material','distingu*','diferenci*','reconoc*','informa * plastic*','informa * tipo','informa * material','tipo de plastico','tipo de material','resina','de que esta hecho','de que plastico','que plastico es','clasific*','clasifica' ] },
      { l:'que sirve para saber cómo reciclar el plástico o si es reciclable', w:2, alts:[
          'recicl*','posibilidades de reciclado','separar','reciclado','contenedor','planta*','facilitar la recogida','tratamiento' ] }
    ], necesarios:4,
    modelo:'El código RIC (Resin Identification Code) es un número del 1 al 7, dentro de un triángulo de flechas, que identifica la resina principal de cada plástico y sirve para saber cómo se puede reciclar.',
    exp:'Es el número del 1 al 7 que ves en el triángulo de flechas de los envases. Identifica la resina y orienta sobre su reciclado.' },

  { tipo:'abierta', q:'Indica qué plástico utilizarías para fabricar cada uno de estos objetos: <b>bolsa de la compra, utensilios para cocinar, piscina, juguetes para bebés y traje de inmersión</b>. Justifica tus respuestas.',
    ph:'Bolsa de la compra: …  Utensilios de cocina: …  Piscina: …  Juguetes de bebé: …  Traje de inmersión: …',
    conceptos:[
      { l:'bolsa de la compra → polietileno (LDPE/HDPE)', a:['bolsa*','compra'], b:['polietileno','ldpe','hdpe','pe','polieti*','plastico flexible','film'], dist:7 },
      { l:'utensilios de cocina → melamina o baquelita (resisten el calor)', a:['utensilio*','cocin*','cacerola*','sarten*','mango*','cuchar*'], b:['melamina','baquelita','termoestable*'], dist:9 },
      { l:'piscina → resina de poliéster (con fibra de vidrio)', a:['piscina*'], b:['poliester','resina*','fibra*','vidrio','termoestable*'], dist:7 },
      { l:'juguetes de bebé → polipropileno, silicona u otro plástico no tóxico', a:['juguete*','bebe*','bebes'], b:['polipropileno','pp','silicona*','pet','poliestireno','ps','polietileno','hdpe','ldpe','pe','abs','no toxico','seguro*','atoxico'], dist:9 },
      { l:'traje de inmersión → neopreno', a:['traje*','inmersion','buceo','bucear','neopreno'], b:['neopreno'], dist:9 }
    ], necesarios:4,
    modelo:'Bolsa de la compra: polietileno (LDPE). Utensilios de cocina: melamina o baquelita (soportan el calor). Piscina: resina de poliéster reforzada con fibra de vidrio. Juguetes para bebés: polipropileno (o silicona), no tóxico y fácil de moldear. Traje de inmersión: neopreno, flexible e impermeable.',
    exp:'Se elige el plástico según sus propiedades: flexible para la bolsa, resistente al calor para cocinar, rígido y reforzado para la piscina, seguro para el bebé, flexible e impermeable para el traje.' },

  { tipo:'abierta', q:'¿Qué es un plástico? ¿Por qué decimos que los plásticos tienen una estructura repetitiva?',
    ph:'Define plástico y explica la estructura repetitiva…',
    conceptos:[
      { l:'que es un material moldeable con presión y temperatura que mantiene la forma al enfriarse', alts:[
          'moldeable*','moldea*','se puede moldear','presion','temperatura','calor','mantien* * forma','conserv* * forma','material sintetico','material derivado del petroleo','material organico','polimero*','material' ] },
      { l:'que se repite una unidad básica llamada monómero', w:2, alts:['monomero*','unidad basica','unidad que se repite','unidad repetida','se repite','repiten','repeticion','repetitiv*','misma unidad','mismas unidades','eslabon*'] },
      { l:'que los monómeros unidos forman cadenas o polímeros', alts:['polimero*','cadena*','union de * monomero*','monomeros unidos','unidos entre si'] }
    ], necesarios:3,
    modelo:'Un plástico es un material moldeable con presión y temperatura adecuadas que mantiene su forma al cesar esas condiciones. Todos tienen una estructura repetitiva porque están formados por monómeros que se repiten y se unen formando cadenas llamadas polímeros.',
    exp:'Plástico = material moldeable con presión y calor. Estructura repetitiva = muchos <b>monómeros</b> unidos forman un <b>polímero</b>.' }

  ]
},

/* =====================================================================
 * 2 · IMPRESIÓN 3D  (STAR 3-7 · fichas 3, 4 y 5)
 * ===================================================================== */
impresion3d: {
  id: 'impresion3d',
  titulo: 'Impresión 3D: de la idea a la pieza',
  corto: 'Impresión 3D',
  criterios: [
    {id:'1.2', t:'Comprender y analizar productos tecnológicos cotidianos mediante el método científico y herramientas de simulación.'},
    {id:'2.2', t:'Seleccionar, planificar y organizar materiales, herramientas y tareas para construir una solución, de forma individual o en grupo.'},
    {id:'3.1', t:'Fabricar objetos o modelos manipulando materiales con herramientas y máquinas adecuadas, aplicando fundamentos técnicos y respetando las normas de seguridad.'}
  ],
  ref: 'Libro STAR, actividades 3-7 · Fichas 3, 4 y 5 de yourtechnologyweb',
  intro: 'Las partes de una impresora, el proceso diseño → STL → laminado → impresión, los materiales (PLA y ABS) y los parámetros que cambian el resultado.',
  preguntas: [

  { tipo:'orden', q:'Ordena los pasos del <b>proceso de impresión 3D</b>.',
    items:['Diseñar la pieza en 3D con un programa CAD (por ejemplo, Tinkercad)', 'Exportar el diseño en formato STL', 'Abrir el STL en un programa de laminado (por ejemplo, Cura) y ajustar los parámetros',
            'Generar el archivo GCODE', 'Copiar el GCODE a una tarjeta SD (o enviarlo por cable) y llevarlo a la impresora', 'La impresora funde el filamento y construye la pieza capa a capa'],
    exp:'Diseño CAD → archivo STL → laminado (se ajustan los parámetros) → archivo GCODE → SD o cable → impresión capa a capa.' },

  { tipo:'match', q:'Relaciona cada herramienta o archivo con su papel en el proceso.',
    pares:[ {izq:'Tinkercad / FreeCAD', der:'Diseño 3D de la pieza (CAD)'}, {izq:'STL', der:'Archivo del diseño que se exporta desde el programa CAD'},
            {izq:'Cura / Slic3r', der:'Laminado: divide la pieza en capas y genera las instrucciones'}, {izq:'GCODE', der:'Archivo con las instrucciones que entiende la impresora'},
            {izq:'Thingiverse', der:'Repositorio donde descargar diseños ya hechos'} ],
    exp:'El CAD diseña, el STL guarda la forma, el laminador (Cura) la corta en capas y la convierte en GCODE, que es lo que lee la impresora. Thingiverse y MyMiniFactory son repositorios de diseños.' },

  { tipo:'match', q:'Relaciona cada <b>parte de la impresora 3D</b> con su función.',
    pares:[ {izq:'Extrusor', der:'Toma el filamento de la bobina y lo deposita en la cantidad precisa'}, {izq:'Hot-end', der:'Funde el material'},
            {izq:'Boquilla', der:'Por ella sale el filamento de plástico fundido'}, {izq:'Electrónica', der:'Controla todos los procesos de la impresora'},
            {izq:'Mecánica', der:'Motores y mecanismos que mueven el material hasta su posición'}, {izq:'Base de impresión', der:'Superficie sobre la que se deposita la pieza'} ],
    exp:'El extrusor incluye el hot-end (que funde) y la boquilla (por donde sale). La electrónica (con placa tipo Arduino) controla y la mecánica mueve.' },

  { tipo:'rotular', img:'impresora', q:'Observa la impresora 3D y rotula las partes <b>numeradas</b> (las casillas sin número no hace falta rellenarlas).',
    marcas:[ {x:48.8,y:3.9,resp:'Bobina de filamento'}, {x:18.8,y:13.6,resp:'Pantalla'}, {x:7.8,y:64.6,resp:'Base de impresión'}, {x:28.5,y:92.2,resp:'Extrusor'},
             {x:63.6,y:55.6,resp:'Hot-end'}, {x:70.2,y:81.5,resp:'Boquilla'},
             {x:8.4,y:29.2,resp:'Filamento'}, {x:48.3,y:48.1,resp:'Tornillo sin fin'}, {x:9.4,y:50.4,resp:'Ventilador'}, {x:45.4,y:92.7,resp:'Motor paso a paso'} ],
    extras:['Cadena portacables','Fuente de alimentación','Tarjeta SD','Sensor de temperatura'],
    exp:'Impresora completa: bobina de filamento · pantalla · filamento (baja de la bobina al extrusor) · tornillo sin fin (transmite el movimiento del motor) · ventilador · cama/base de impresión · extrusor · motor paso a paso. Detalle del extrusor: filamento · hot-end (funde el plástico) · boquilla (por donde sale fundido).' },

  { tipo:'clasif', q:'¿Qué plástico tiene cada una de estas características: <b>PLA</b> o <b>ABS</b>?',
    cats:['PLA','ABS'],
    items:[ {t:'Se fabrica a partir de almidón de maíz o caña de azúcar', c:0}, {t:'Se imprime entre 230 y 260 °C', c:1}, {t:'Emite gases nocivos: conviene imprimir en un lugar ventilado', c:1},
            {t:'Es inodoro y biodegradable', c:0}, {t:'Resiste temperaturas altas', c:1}, {t:'A partir de 50-60 °C empieza a deformarse', c:0},
            {t:'Se pinta y se mecaniza con facilidad', c:1}, {t:'No necesita base caliente y permite impresiones rápidas', c:0} ],
    exp:'<b>PLA</b>: natural, biodegradable, inodoro, doméstico, poca resistencia al calor. <b>ABS</b>: industrial, tenaz y resistente al calor, gases nocivos, se pinta y se pega bien.' },

  { tipo:'clasif', q:'¿Es una herramienta de fabricación <b>aditiva</b> (añade material) o <b>sustractiva</b> (quita material)?',
    cats:['Aditiva','Sustractiva'],
    items:[ {t:'Impresora 3D', c:0}, {t:'Fresadora CNC', c:1}, {t:'Torno', c:1}, {t:'Cortadora láser', c:1} ],
    exp:'La fabricación aditiva construye capa a capa (impresoras 3D). La sustractiva parte de un bloque y retira el sobrante (fresadoras, tornos y cortadoras láser, máquinas CNC).' },

  { tipo:'num', q:'¿A qué temperatura (en °C) debe calentarse el <b>ABS</b> para imprimir? Escribe un valor dentro del rango correcto.',
    resp:245, tol:15, unidad:'°C',
    exp:'El ABS se imprime <b>entre 230 y 260 °C</b> porque su punto de fusión es muy alto.' },

  { tipo:'single', q:'Si el agujero de la boquilla es más pequeño, la impresión será…',
    opciones:['Más lenta, pero la pieza más precisa','Más rápida y más precisa','Más rápida, pero la pieza menos precisa','Igual: el tamaño de la boquilla no influye'], correcta:0,
    exp:'Cuanto más pequeño es el agujero de la boquilla, más lenta es la impresión pero más precisa es la pieza.' },

  { tipo:'tf', q:'Para que la pieza se adhiera a la base de impresión se puede rociar la base con laca de peinado.',
    opciones:['Verdadero','Falso'], correcta:0,
    exp:'Es uno de los consejos del libro: la laca hace que la pieza se agarre a la base y no se levante durante la impresión.' },

  { tipo:'match', q:'Relaciona cada <b>parámetro de impresión</b> con lo que controla.',
    pares:[ {izq:'Altura de capa', der:'Grosor de cada capa: cuanto menor, mejor calidad'}, {izq:'Densidad de relleno', der:'Cantidad de plástico que hay dentro de la pieza'},
            {izq:'Velocidad de impresión', der:'Rapidez con la que se mueve el extrusor'}, {izq:'Soportes', der:'Estructuras que sostienen las partes que quedarían en el aire'},
            {izq:'Temperatura de impresión', der:'Calor al que se funde el plástico en el extrusor'} ],
    exp:'Estos parámetros se fijan en el laminador. Más calidad suele significar más tiempo; más relleno, más resistencia y más material.' },

  { tipo:'abierta', q:'Explica el procedimiento para crear una pieza con una impresora 3D a partir de hilo de plástico (filamento).',
    ph:'Describe paso a paso el procedimiento…',
    conceptos:[
      { l:'diseñar la pieza en 3D con un programa de diseño (CAD)', alts:['dise*','cad','tinkercad','freecad','sketchup','openscad','blender','autocad','modelar','modelado','descargar * dise*','thingiverse','repositorio*','crear * pieza','crear * modelo','modelo 3d'] },
      { l:'guardar o exportar el diseño en formato STL', alts:['stl','exportar','guardar * formato','archivo * 3d'] },
      { l:'laminar con un programa de laminado (Cura, Slic3r) que divide la pieza en capas', alts:['lamina*','cura','slic3r','slicer','repetier','capas','rebanad*','ajustar * parametros','parametros'] },
      { l:'obtener el archivo GCODE que entiende la impresora', alts:['gcode','g code','codigo g'] },
      { l:'pasar el archivo a la impresora (tarjeta SD o cable USB)', alts:['sd','tarjeta*','memoria','usb','cable','enviar*','pasar*','copiar*','cargar*','conectar*','meter*'] },
      { l:'imprimir: la impresora funde el filamento y lo deposita capa a capa', alts:['imprim*','impresion','fund*','deposit*','capa por capa','capa a capa','extrusor','boquilla','sale el plastico','construye*','va haciendo'] }
    ], necesarios:5,
    modelo:'1) Diseño la pieza con un programa CAD (Tinkercad, FreeCAD…). 2) La exporto en formato STL. 3) La abro en un programa de laminado (Cura) que la divide en capas y ajusta los parámetros. 4) Genero el archivo GCODE. 5) Lo copio a una tarjeta SD (o lo envío por cable) a la impresora. 6) La impresora funde el filamento y construye la pieza capa a capa.',
    exp:'Cuatro ideas clave: diseño CAD → STL → laminado → GCODE → impresión.' },

  { tipo:'abierta', q:'Compara los dos plásticos más usados en impresión 3D, el <b>PLA</b> y el <b>ABS</b>. Indica ventajas y desventajas de cada uno.',
    ph:'Ventajas y desventajas del PLA y del ABS…',
    conceptos:[
      { l:'PLA: es biodegradable o está hecho de materiales naturales (maíz, caña de azúcar)', neg:true, a:['pla'], b:['biodegradable*','natural*','maiz','almidon','azucar','organico','ecologico','vegetal'], dist:12 },
      { l:'PLA: no emite gases tóxicos, es inodoro o se imprime rápido sin base caliente', a:['pla'], b:['inodoro','no toxico','sin olor','no huele','no emite','sin gases','no gases','rapid*','sin base caliente','no necesita base','no necesita cama','seguro','humedad'], dist:12 },
      { l:'PLA: resiste poco el calor (se deforma a 50-60 °C) y es difícil de pintar o mecanizar', a:['pla'], b:['no resiste','poca resistencia','menos resistente','se deforma','se descompone','deforma*','50','60','dificil','complejo','complicado','mas debil','fragil','blando'], dist:12 },
      { l:'ABS: es resistente, duro, tenaz y aguanta altas temperaturas', a:['abs'], b:['resistente*','dur*','tenaz','rigido','aguanta*','soporta*','altas temperaturas','calor','solido','fuerte','flexib*'], dist:12 },
      { l:'ABS: se pinta, se mecaniza y se pega con facilidad (acabado bueno)', a:['abs'], b:['pint*','mecaniz*','acabado*','pega*','acetona','lijar','lija'], dist:12 },
      { l:'ABS: emite gases nocivos (hay que ventilar), no es biodegradable y necesita 230-260 °C', a:['abs'], b:['gases*','nocivo*','toxico*','ventila*','humos','no es biodegradable','no biodegradable','230','260','temperatura alta','alta temperatura','reciclable','contamin*','olor'], dist:12 }
    ], necesarios:4,
    modelo:'PLA: ventajas, es biodegradable (se hace de maíz o caña de azúcar), inodoro, rápido y no necesita base caliente; desventajas, resiste poco el calor (se deforma a 50-60 °C) y es difícil de pintar. ABS: ventajas, es tenaz, duro, resistente al calor, fácil de pintar y mecanizar; desventajas, emite gases nocivos (hay que ventilar), no es biodegradable (aunque sí reciclable) y exige 230-260 °C.',
    exp:'Cuatro ideas bien situadas (cada una junto a su material) dan la nota completa.' },

  { tipo:'abierta', q:'Indica las <b>principales partes de una impresora 3D</b>. ¿Cuál crees que es la pieza fundamental? ¿Por qué?',
    ph:'Partes de la impresora y pieza más importante, con tu razonamiento…',
    conceptos:[
      { l:'nombrar al menos 3 partes: extrusor, hot-end/boquilla, electrónica, mecánica/motores, base, bobina…', lista:[
          ['extrusor*'],['hot end','hotend','hot-end','cabezal'],['boquilla*','nozzle'],['electronic*','placa*','arduino','controladora','tarjeta controladora'],
          ['mecanic*','motor*','mecanismo*'],['base*','cama','plataforma','bandeja','superficie de impresion'],['bobina*','filamento*'],['fuente*','alimentacion'],['pantalla*'],['sensor*','termistor*'],['ejes','correas','varillas','guias'] ], min:3, w:2 },
      { l:'elegir una pieza fundamental (extrusor / hot-end / boquilla / electrónica…)', alts:['fundamental','principal','mas importante','importante','imprescindible','esencial','clave','mas necesari*','sin * no','sin el','sin la','sin ella','sin el no'] },
      { l:'justificar la elección (porque…)', alts:['porque','ya que','pues','debido','gracias','permite*','encarga*','sirve*','es el que','es la que','es quien','se encarga','sin * no','que funde','que controla','que deposita','calidad','calidad de la impresion','determina*','depende*'] }
    ], necesarios:4,
    modelo:'Las partes principales son el extrusor (con el hot-end y la boquilla), la electrónica (placa tipo Arduino, sensores, fuente y pantalla), la mecánica (motores y mecanismos) y la base de impresión. La pieza fundamental es el extrusor (hot-end), porque funde el plástico y lo deposita, y de él depende la calidad de la impresión. (También se admite la electrónica, porque controla todo, si se justifica.)',
    exp:'Es una pregunta de opinión: vale cualquier parte bien justificada.' },

  { tipo:'abierta', q:'¿Cómo podemos <b>pegar</b> un objeto de ABS? ¿Cómo se puede mejorar su acabado final?',
    ph:'Cómo se pega y cómo se mejora el acabado…',
    conceptos:[
      { l:'usar acetona (es un disolvente del ABS)', w:2, alts:['acetona*','quitaesmalte*','quita esmalte','disolvente*','disolver*','disuelve*'] },
      { l:'aplicarla con un pincel ligeramente mojado sobre la superficie', alts:['pincel*','brocha*','mojad*','humed*','pasar*','aplicar*','untar*','frotar*','vapor*','banar*','embadurnar*'] },
      { l:'(para pegar) disolver las superficies y unir las piezas', a:['disolv*','disuelv*','disuelt*','fund*','derret*','ablanda*','reblandec*'], b:['superficie*','pieza*','plastico*','abs','union','unir*','pega*','junta*'], dist:8 }
    ], necesarios:2.5,
    modelo:'El ABS se pega con acetona, que es un disolvente de este plástico: disuelve un poco las superficies y las piezas se unen al secarse. Para mejorar el acabado se pasa un pincel ligeramente mojado en acetona por la pieza.',
    exp:'La acetona disuelve el ABS: sirve tanto para pegar como para alisar la superficie con un pincel.' }

  ]
},

/* =====================================================================
 * 3 · TÉCNICAS DE FABRICACIÓN  (STAR 30-35)
 * ===================================================================== */
tecnicas: {
  id: 'tecnicas',
  titulo: 'Técnicas de fabricación con plásticos',
  corto: 'Técnicas de fabricación',
  criterios: [
    {id:'1.2', t:'Comprender y analizar productos tecnológicos cotidianos mediante el método científico y herramientas de simulación.'},
    {id:'2.2', t:'Seleccionar, planificar y organizar materiales, herramientas y tareas para construir una solución, de forma individual o en grupo.'},
    {id:'3.1', t:'Fabricar objetos o modelos manipulando materiales con herramientas y máquinas adecuadas, aplicando fundamentos técnicos y respetando las normas de seguridad.'}
  ],
  ref: 'Libro STAR, actividades 30-35',
  intro: 'Extrusión, inyección, compresión, soplado y conformado al vacío: cómo funciona cada técnica y qué objetos se fabrican con ella.',
  preguntas: [

  { tipo:'match', q:'Relaciona cada <b>técnica de conformado</b> con su descripción.',
    pares:[ {izq:'Extrusión', der:'Un tornillo sin fin empuja el plástico fundido por una boquilla'}, {izq:'Moldeo por inyección', der:'El plástico fundido se inyecta en un molde frío donde solidifica'},
            {izq:'Moldeo por compresión', der:'El plástico se prensa con calor entre un molde y un contramolde'}, {izq:'Soplado', der:'Se insufla aire dentro de un tubo de plástico para que adopte la forma del molde'},
            {izq:'Conformado al vacío', der:'Una lámina caliente se aspira contra un molde'} ],
    exp:'Extrusión (tornillo sin fin y boquilla) · inyección (molde frío) · compresión (molde y contramolde) · soplado (aire) · vacío (lámina y succión).' },

  { tipo:'match', q:'Relaciona cada objeto con la técnica con la que se fabrica.',
    pares:[ {izq:'Pajita para beber', der:'Extrusión'}, {izq:'Carcasa de un teléfono móvil', der:'Moldeo por inyección'}, {izq:'Huevera', der:'Conformado al vacío'},
            {izq:'Enchufe', der:'Moldeo por compresión'}, {izq:'Botella de plástico', der:'Soplado'} ],
    exp:'Pajita → extrusión (producto largo y hueco) · carcasa → inyección · huevera → vacío (lámina) · enchufe → compresión (termoestable) · botella → soplado.' },

  { tipo:'clasif', q:'¿Con qué tipo de plástico se usa cada técnica?',
    cats:['Termoplásticos','Termoestables'],
    items:[ {t:'Extrusión', c:0}, {t:'Moldeo por compresión', c:1}, {t:'Moldeo por inyección', c:0}, {t:'Conformado al vacío', c:0} ],
    exp:'La compresión se usa con <b>termoestables</b> (se moldean una vez, con calor y presión). El resto de técnicas funden el plástico, por lo que se usan con <b>termoplásticos</b>.' },

  { tipo:'orden', q:'Ordena el proceso de la <b>extrusión</b>.',
    items:['El plástico se vierte por la tolva', 'Cae sobre un tornillo sin fin giratorio', 'El tornillo lo empuja por un tubo caliente donde se funde', 'Sale por la boquilla con la forma de ésta', 'El producto obtenido se refrigera'],
    exp:'Tolva → tornillo sin fin → tubo caliente (se funde) → boquilla (da la forma) → refrigeración.' },

  { tipo:'match', q:'En una máquina de <b>moldeo por inyección</b>, ¿qué hace cada parte?',
    pares:[ {izq:'Tolva', der:'Por ella entra el plástico (granza) en la máquina'}, {izq:'Resistencias', der:'Calientan el cilindro y funden el plástico'},
            {izq:'Pistón', der:'Empuja el plástico fundido hacia el molde'}, {izq:'Molde', der:'Da forma a la pieza cuando el plástico se enfría'} ],
    exp:'La granza entra por la tolva, las resistencias la funden, el pistón la empuja hacia el molde y el molde la enfría con la forma deseada.' },

  { tipo:'rotular', img:'inyeccion', q:'Esta máquina fabrica piezas fundiendo el plástico y metiéndolo en un molde: es el <b>moldeo por inyección</b>. Rotula las casillas numeradas.',
    marcas:[ {x:11.9,y:10.5,resp:'Tolva'}, {x:51.1,y:9.8,resp:'Resistencias'}, {x:87.4,y:14.7,resp:'Molde'}, {x:15.0,y:76.7,resp:'Pistón'} ],
    extras:['Tornillo sin fin','Boquilla','Refrigeración','Contramolde'],
    exp:'1 · tolva (entra el plástico) · 2 · resistencias (lo calientan y lo funden) · 3 · molde (da forma a la pieza) · 4 · pistón (empuja el plástico fundido hacia el molde).' },

  { tipo:'single', img:'vacio', q:'Observa el dibujo: una lámina de plástico se calienta con los calefactores (puntos rojos), se coloca sobre un molde y se aspira el aire por debajo (flechas azules). ¿Qué técnica es?',
    opciones:['Conformado al vacío','Extrusión','Soplado','Moldeo por compresión'], correcta:0,
    exp:'Es el <b>conformado al vacío</b> (termoconformado): se usa para huevera, envases de yogur o bandejas de bombones.' },

  { tipo:'abierta', img:'vacio', q:'Explica la imagen: ¿qué le ocurre a la lámina de plástico? Indica la <b>técnica de conformado</b> y <b>dos objetos</b> que se fabriquen con ella.',
    ph:'Explica el proceso, nombra la técnica y escribe dos objetos…',
    conceptos:[
      { l:'que se parte de una lámina o plancha de plástico', alts:['lamina*','plancha*','hoja*','placa*','pelicula*','film'] },
      { l:'que la lámina se calienta (calefactores, resistencias) y se ablanda', alts:['calient*','calent*','calor','calefact*','resistencia*','ablanda*','reblandec*','caliente'] },
      { l:'que se coloca sobre un molde', alts:['molde*','sobre * molde','encima * molde'] },
      { l:'que se aspira el aire / se hace el vacío', alts:['vacio*','aspir*','succion*','absorb*','chup*','extra* * aire','sac* * aire','quit* * aire','aire'] },
      { l:'que la lámina adopta la forma del molde', alts:['forma*','adopta*','copia*','se pega al molde','pega * molde','toma * forma'] },
      { l:'la técnica: conformado al vacío (termoconformado)', alts:['conformado * vacio','termoconform*','termoformad*','termoform*','moldeo * vacio','formado * vacio','conformado de vacio','vacuum'] },
      { l:'dos objetos: huevera, envase de yogur, bandeja de bombones, vaso…', w:2, min:2, lista:[
          ['huevera*'],['yogur*','yogurt*'],['bombon*','bandeja*'],['blister*'],['vaso*'],['barquilla*'],['envase* de comida','envases alimentarios','envase* alimentari*'],['tapa*'],['cubitera*','hielo*'],['bandeja* de * alimento*','bandeja* de carne','bandeja* de fruta'],['carcasa*','casco*']
        ] }
    ], necesarios:6,
    modelo:'Una lámina de plástico se calienta con calefactores y se ablanda; se coloca sobre un molde y se aspira el aire de debajo (se hace el vacío), de modo que la lámina se pega al molde y toma su forma. La técnica es el conformado al vacío (termoconformado). Se fabrican hueveras, envases de yogur o bandejas de bombones.',
    exp:'Lámina + calor + molde + vacío = conformado al vacío. Hueveras, envases de yogur, bandejas de bombones…' },

  { tipo:'tf', q:'El moldeo por compresión se utiliza con plásticos termoplásticos.',
    opciones:['Verdadero','Falso'], correcta:1,
    exp:'Falso: la compresión se usa con plásticos <b>termoestables</b>, para piezas pequeñas como clavijas o enchufes.' },

  { tipo:'abierta', q:'Explica la técnica de la <b>extrusión</b> para obtener objetos de plástico y nombra cuatro objetos distintos que se obtienen con ella.',
    ph:'Explica cómo funciona y escribe cuatro objetos…',
    conceptos:[
      { l:'el plástico entra por una tolva', alts:['tolva*','embudo','entra el plastico','se echa el plastico','se vierte*','se introduce*','granza'] },
      { l:'un tornillo sin fin giratorio lo empuja', alts:['tornillo*','husillo','sin fin','sinfin','rosca','gira*','empuja*','arrastra*'] },
      { l:'se funde con calor en un tubo caliente', alts:['fund*','derret*','calent*','calient*','calor','resistencia*','caliente*','funde'] },
      { l:'sale por una boquilla que da la forma', alts:['boquilla*','molde','salida','sale*','forma de la','dado','hilera','troquel*'] },
      { l:'se enfría o se refrigera al salir', alts:['refriger*','enfri*','enfria*','solidific*','endurec*','se seca','agua fria'] },
      { l:'cuatro objetos obtenidos por extrusión (tubos, perfiles, mangueras, cables, pajitas…)', w:2, lista:[
          ['tubo*','tuberia*','canalizacion*'],['perfil*'],['manguera*'],['cable*','aislamiento*'],['pajita*','pajilla*','popote*','canutillo*'],['lamina*','film','plancha*'],['filamento*','hilo*'],['varilla*','barra*'],['canalon*','bajante*'],['marco* de ventana','ventana*','puerta*'],['bolsa*'],['junta*'],['rodapie*','zocalo*','moldura*'],['persiana*']
        ], min:4 }
    ], necesarios:5,
    modelo:'El plástico (termoplástico) se vierte por la tolva y cae sobre un tornillo sin fin que gira y lo empuja por un tubo caliente, donde se funde. Sale por la boquilla con su forma y después se refrigera. Se obtienen tubos, perfiles, mangueras, cables aislados, pajitas…',
    exp:'Se obtienen productos largos y de sección constante: tubos, perfiles, mangueras, cables, pajitas, láminas…' },

  { tipo:'abierta', q:'Explica la técnica del <b>moldeo por compresión</b>. Indica el nombre de algún objeto que se conforme mediante esta técnica.',
    ph:'Explica cómo funciona y pon un ejemplo…',
    conceptos:[
      { l:'el plástico se coloca entre un molde y un contramolde', w:2, alts:['molde * contramolde','contramolde*','dos moldes','entre moldes','molde y su','molde superior','molde inferior','macho * hembra','matriz'] },
      { l:'se aplica presión y calor', w:2, alts:['presion*','prens*','aprieta*','comprim*','compresion','aplast*','calor','calent*','temperatura'] },
      { l:'el plástico se funde o adquiere la forma del molde', alts:['fund*','derret*','adquiere*','toma * forma','coge * forma','cog* * forma','adopta*','forma deseada','forma del molde'] },
      { l:'se usa con termoestables (baquelita, melamina…)', alts:['termoestable*','baquelita','melamina','poliester','resina*'] },
      { l:'ejemplo: clavija, enchufe, mango, pieza pequeña…', alts:['clavija*','enchufe*','mango*','interruptor*','tapon*','tapa*','pieza* pequena*','piezas pequenas','ficha*','tecla*','accesorio* electrico*','cuenco*','vajilla*','baquelita'] }
    ], necesarios:5,
    modelo:'El plástico (termoestable) se coloca entre un molde y un contramolde; con presión y calor se funde y adquiere la forma deseada. Se usa para piezas pequeñas como clavijas y enchufes.',
    exp:'Molde + contramolde + presión + calor, con termoestables, para piezas pequeñas (clavijas, enchufes…).' },

  { tipo:'abierta', q:'Indica la <b>técnica</b> y el <b>tipo de plástico</b> que se ha utilizado para fabricar: una pajita para beber, la carcasa de un teléfono móvil, una huevera y un enchufe.',
    ph:'Pajita: técnica y plástico…  Carcasa: …  Huevera: …  Enchufe: …',
    conceptos:[
      { l:'pajita → extrusión', a:['pajita*','pajilla*','popote*','canutillo*'], b:['extrus*'], dist:9 },
      { l:'pajita → polipropileno u otro termoplástico (PP, polietileno…)', a:['pajita*','pajilla*','popote*','canutillo*'], b:['polipropileno','pp','polietileno','pe','termoplastic*','pet','poliestireno'], dist:9, w:0.5 },
      { l:'carcasa del móvil → moldeo por inyección', a:['carcasa*','movil*','telefono*','celular*'], b:['inyecc*','inyect*'], dist:9 },
      { l:'carcasa → ABS, policarbonato, polipropileno u otro termoplástico', a:['carcasa*','movil*','telefono*','celular*'], b:['abs','policarbonato','pc','polipropileno','pp','termoplastic*','nailon','nylon','silicona*','tpu','poliuretano'], dist:9, w:0.5 },
      { l:'huevera → conformado al vacío (termoconformado)', a:['huevera*'], b:['vacio','termoconform*','conformado'], dist:9 },
      { l:'huevera → poliestireno (PS), PET u otro termoplástico', a:['huevera*'], b:['poliestireno','ps','porexpan','pet','termoplastic*','carton','pulpa'], dist:9, w:0.5 },
      { l:'enchufe → moldeo por compresión', a:['enchufe*'], b:['compresion','comprim*','prens*','presion'], dist:9 },
      { l:'enchufe → baquelita, melamina u otro termoestable', a:['enchufe*'], b:['baquelita','melamina','termoestable*','resina*','poliester'], dist:9, w:0.5 }
    ], necesarios:6,
    modelo:'Pajita: extrusión, con polipropileno (termoplástico). Carcasa del móvil: moldeo por inyección, con ABS o policarbonato. Huevera: conformado al vacío, con poliestireno (PS) o PET. Enchufe: moldeo por compresión, con baquelita (termoestable).',
    exp:'Pajita → extrusión · carcasa → inyección · huevera → vacío · enchufe → compresión (termoestable).' }

  ]
},

/* =====================================================================
 * 4 · EL DILEMA DE LOS PLÁSTICOS Y FABRICACIÓN SOSTENIBLE  (STAR 10-15 y 36)
 * ===================================================================== */
sostenibilidad: {
  id: 'sostenibilidad',
  titulo: 'El dilema de los plásticos y la fabricación sostenible',
  corto: 'Plásticos y sostenibilidad',
  criterios: [
    {id:'2.1', t:'Diseñar soluciones eficaces, innovadoras y sostenibles a problemas definidos, con criterios interdisciplinares y actitud creativa y perseverante.'},
    {id:'7.1', t:'Reconocer la influencia de la tecnología en la sociedad y en la sostenibilidad ambiental, valorando su contribución al desarrollo sostenible.'},
    {id:'7.2', t:'Identificar las aportaciones de las tecnologías emergentes al bienestar, la igualdad social y la reducción del impacto ambiental, con un uso responsable y ético.'}
  ],
  ref: 'Libro STAR, actividades 10-15 y 36',
  intro: 'Ventajas e inconvenientes de los plásticos, la regla de las 3 R, el reciclaje, las «lágrimas de sirena» y cómo diseñar y construir proyectos de forma sostenible.',
  preguntas: [

  { tipo:'multi', q:'Marca las <b>ventajas</b> del uso de plásticos frente a otros materiales (hay cuatro correctas).',
    opciones:['Mejoran el aislamiento térmico de las viviendas y ahorran energía','Hacen más ligeros los vehículos, que consumen menos combustible','Conservan los alimentos frescos durante más tiempo',
              'Son materiales muy baratos de obtener','Se descomponen en pocos meses sin contaminar','Son más pesados y por eso más resistentes en los transportes','Nunca se acumulan como residuos'],
    correctas:[0,1,2,3],
    exp:'Ventajas: aislamiento térmico, vehículos más ligeros (menos combustible y menos gases), mejor conservación de alimentos y bajo precio. Que se descompongan rápido o no se acumulen es falso.' },

  { tipo:'single', q:'¿Qué quiere decir que los plásticos son <b>no biodegradables</b>?',
    opciones:['Que no se descomponen de forma natural o tardan muchísimos años en hacerlo','Que no se pueden reciclar','Que se rompen con mucha facilidad','Que solo se fabrican a partir del petróleo'], correcta:0,
    exp:'No biodegradable = no lo descomponen los seres vivos de forma natural; necesita muchos años y mucha radiación ultravioleta. Por eso se acumulan los residuos.' },

  { tipo:'match', q:'Relaciona cada <b>R</b> con una acción de ejemplo.',
    pares:[ {izq:'Reducir', der:'Llevar una bolsa de tela en lugar de usar bolsas de plástico de un solo uso'}, {izq:'Reutilizar', der:'Usar una botella vacía como maceta'},
            {izq:'Reciclar', der:'Echar el envase al contenedor amarillo'}, {izq:'Reparar', der:'Arreglar un juguete roto en vez de tirarlo y comprar otro'} ],
    exp:'Reducir (usar menos plástico), reutilizar (dar nuevos usos), reciclar (contenedor amarillo) y reparar. La regla de las 3 R se amplía a las 5 R: reducir, reparar, recuperar, reciclar y reutilizar.' },

  { tipo:'single', q:'¿Qué es la <b>granza</b>?',
    opciones:['Trozos muy pequeños de plástico triturado que se obtienen en las plantas de reciclaje','Un aditivo que da color al plástico','El filamento que usan las impresoras 3D','El gas que se desprende al quemar el plástico'], correcta:0,
    exp:'La granza son trozos muy pequeños de plástico. Se mezcla después con aditivos y colorantes para fabricar piezas nuevas.' },

  { tipo:'orden', q:'Ordena el <b>proceso de reciclaje</b> del plástico.',
    items:['Se deposita el envase en el contenedor amarillo', 'En la planta, los plásticos se agrupan según su procedencia', 'Se lavan y se secan', 'Se trituran (molienda) y se obtiene la granza', 'La granza se mezcla con aditivos y colorantes', 'Pasa por una extrusora y se fabrican piezas nuevas'],
    exp:'Contenedor amarillo → clasificación → lavado y secado → molienda (granza) → mezcla con aditivos → extrusión de piezas nuevas (tuberías, bolsas, columpios, mobiliario urbano…).' },

  { tipo:'single', q:'¿A qué llamamos «lágrimas de sirena»?',
    opciones:['A pequeños trozos de plástico procedentes de fábricas y plantas de reciclado que acaban en los océanos','A las gotas de petróleo que flotan en el mar','A los plásticos naturales derivados de las algas','A las botellas que arrastra el mar hasta la playa'], correcta:0,
    exp:'Son pequeños trozos de plástico que se escapan de fábricas y plantas de reciclado y llegan al mar. Los animales los confunden con comida y se intoxican.' },

  { tipo:'clasif', q:'Clasifica estas buenas prácticas según la fase del proyecto en la que se aplican.',
    cats:['Diseño','Construcción','Difusión'],
    items:[ {t:'Usar el papel por las dos caras y aprovechar el reverso para bocetos', c:0}, {t:'Diseñar para fuente de alimentación y no malgastar pilas', c:0},
            {t:'Dibujar y cortar empezando por los bordes del material', c:1}, {t:'Comprar en las tiendas del barrio lo que haga falta', c:1},
            {t:'Pedir permiso antes de publicar fotos de compañeros', c:2}, {t:'Proponer medidas de reciclaje del proyecto una vez presentado', c:2} ],
    exp:'Diseño: ahorrar papel y energía. Construcción: aprovechar el material, comprar cerca. Difusión: respetar la privacidad y proponer el reciclaje.' },

  { tipo:'abierta', q:'Explica la <b>regla de las 3 R</b> y pon un ejemplo de cada una de ellas en el uso de plásticos.',
    ph:'Reducir: …  Reutilizar: …  Reciclar: …',
    conceptos:[
      { l:'reducir', alts:['reduc*'] },
      { l:'reutilizar', alts:['reutiliz*','reusar*','reutilis*','volver a usar','usar * varias veces','dar * nuevo uso','dar * nuevos usos','segunda vida'] },
      { l:'reciclar', alts:['recicl*'] },
      { l:'ejemplo de reducir (bolsa de tela, botella de cristal, menos envoltorios, evitar un solo uso…)', a:['reduc*'], b:['tela','cristal','vidrio','carton','un solo uso','usar menos','menos plastico','evitar*','granel','bolsa*','botella*','reutilizable*','termo','cantimplora','papel','envoltorio*','alternativ*','consumir menos','no usar','comprar menos','sin plastico'], dist:10 },
      { l:'ejemplo de reutilizar (macetero, botella como contenedor, comedero, juguetero…)', a:['reutiliz*','reusar*','volver a usar','segunda vida','nuevo uso','nuevos usos'], b:['macet*','maceter*','botella*','garrafa*','envase*','contenedor*','comedero*','portalapices','lapicero*','organizador*','caja*','bolsa*','tapon*','juguete*','tupper*','tarro*','bote*','manualidad*','decorac*'], dist:10 },
      { l:'ejemplo de reciclar (contenedor amarillo, planta de reciclaje…)', a:['recicl*'], b:['contenedor*','amarillo*','planta*','separar*','tirar*','echar*','depositar*','llevar*','punto limpio','nuevos productos','nuevas piezas','transformar*','triturar*','fabricar*'], dist:10 }
    ], necesarios:5,
    modelo:'Reducir: usar menos plástico (por ejemplo, bolsas de tela en vez de bolsas de un solo uso). Reutilizar: darles otros usos (una botella como macetero). Reciclar: depositarlos en el contenedor amarillo para que se conviertan en piezas nuevas.',
    exp:'Reducir, reutilizar y reciclar, cada una con su ejemplo. (La regla se amplía a las 5 R: reducir, reparar, recuperar, reciclar y reutilizar.)' },

  { tipo:'abierta', q:'Explica qué son las <b>«lágrimas de sirena»</b> y qué problemas medioambientales ocasionan.',
    ph:'Qué son y qué problemas causan…',
    conceptos:[
      { l:'que son pequeños trozos o bolitas de plástico', alts:['trozos*','trocitos','bolitas','granzas','granza','piezas pequenas','particulas','fragmentos','pedacitos','pedazos','restos de plastico','pellets','gr* de plastico','plastico* pequen*','pequenos plasticos','pequenos trozos'] },
      { l:'que proceden de fábricas o plantas de reciclado y se escapan accidentalmente', alts:['fabrica*','planta*','reciclad*','industria*','accidental*','se escapan','se pierden','por accidente','sin querer','vertid*','derram*','se cuelan'] },
      { l:'que acaban en los mares y océanos', w:1.5, alts:['mar','mares','oceano*','agua*','costa*','playa*','rio*','marino*','marina*'] },
      { l:'que los animales marinos los comen confundiéndolos con comida', w:1.5, alts:['animal*','peces','pez','aves','tortuga*','fauna','ingier*','comen','comida','alimento*','tragan*','confund*','se alimentan','pescado*'] },
      { l:'que provocan intoxicación o muerte (y contaminan aguas, tierra y la cadena alimentaria)', alts:['intoxic*','muer*','envenen*','contamin*','danan*','dano*','mata*','matan','toxic*','salud','cadena trofica','cadena alimentaria','enferm*'] }
    ], necesarios:4,
    modelo:'Son pequeños trozos de plástico que, procedentes de las fábricas de objetos de plástico y de las plantas de reciclado, acaban accidentalmente en los océanos. Los animales marinos los confunden con comida y los ingieren, lo que los intoxica y, en la mayoría de los casos, les provoca la muerte.',
    exp:'Pequeños trozos de plástico → mar → los animales los comen → intoxicación y muerte.' },

  { tipo:'abierta', q:'Explica el siguiente proceso: una botella de plástico usada se convierte en nuevos objetos (cintas transportadoras, lavado, molinos, trituración, granza, extrusora y piezas nuevas).',
    ph:'Describe qué le ocurre al plástico en cada fase…',
    conceptos:[
      { l:'se lava (y se seca)', alts:['lava*','limpi*','agua','duchas','ducha'] },
      { l:'se tritura o se muele', alts:['tritur*','muel*','moli*','molienda','pica*','corta*','rompe*','muelen','desmenuz*','fragment*','trocea*'] },
      { l:'se obtiene granza (trozos muy pequeños)', alts:['granza*','trocitos','trozos pequen*','bolitas','pellets','trozos muy pequen*','pequenos trozos','escamas','copos'] },
      { l:'se funde y se extruye (extrusora)', alts:['extru*','fund*','derret*','calent*','calor'] },
      { l:'se fabrican piezas nuevas (tubos, bolsas, perfiles…)', alts:['nuev*','tubo*','tuberia*','bolsa*','piezas','objeto*','producto*','otra vez','de nuevo','columpio*','mobiliario*','perfil*','fibra*','ropa','tela*','cilindr*','barras'] }
    ], necesarios:4,
    modelo:'La botella usada se lava, se tritura (molienda) y se obtiene granza (trozos muy pequeños). La granza se funde en una extrusora y sale con una forma determinada, con la que se fabrican piezas nuevas (tubos, por ejemplo).',
    exp:'Lavado → molienda → granza → extrusión → piezas nuevas.' },

  { tipo:'abierta', q:'Tan importante como reciclar es <b>reutilizar</b>. ¿Qué otros usos podemos dar en el taller de tecnología a estos productos de desecho: botellas de plástico, tapones de plástico, fundas perforadas para folios y palitos de Chupa-Chups?',
    ph:'Botellas: …  Tapones: …  Fundas: …  Palitos: …',
    conceptos:[
      { l:'botellas de plástico: macetero, organizador, depósito, flotador, estructura…', a:['botella*'], b:['macet*','organizador*','portalapices','lapicero*','deposito*','flotador*','estructura*','maqueta*','contenedor*','recipiente*','pulverizador*','embudo*','regadera*','cohete*','coche*','vehiculo*','barco*','carcasa*','cuerpo','soporte*','envase*','hucha*','comedero*','pieza*','proyecto*','robot*','guardar*','almacenar*','herramienta*','tornillo*','material*','pintura*','agua','casa*','invernadero*','jardinera*','sirve*','usar*','hacer*','fabricar*','construir*','servir*','para'], dist:8 },
      { l:'tapones: ruedas, fichas, botones, pulsadores, contadores…', a:['tapon*','tapa*'], b:['rueda*','ficha*','boton*','pulsador*','contador*','ojos','eje*','vehiculo*','coche*','robot*','juego*','pies','patas','soporte*','separador*','mosaico*','organizador*','caja*','guardar*','tornillo*','pieza*','usar*','hacer*','sirve*','servir*','para','construir*','fabricar*','decorac*','adorno*'], dist:8 },
      { l:'fundas perforadas: protección, mamparas, pantallas, cubrir pinturas, forros…', a:['funda*','folio*','plastico* perforad*'], b:['proteg*','proteccion','mampara*','pantalla*','cubrir*','forrar*','forro*','tapar*','cubierta*','ventana*','vitrina*','visera*','careta*','mascara*','bolsillo*','guardar*','almacenar*','archivar*','carpeta*','dibuj*','plantilla*','calcar*','calco','mantel*','mesa*','pintura*','pintar','manchar*','salpic*','invernadero*','fundas','usar*','hacer*','sirve*','servir*','para','construir*','fabricar*','pieza*','cortar*','pegar*','tejado*','techo*','impermeable*'], dist:8 },
      { l:'palitos de Chupa-Chups: estructuras, maquetas, puentes, ejes, varillas…', a:['palito*','palo*','chupa*','piruleta*','varilla*'], b:['estructura*','maqueta*','puente*','eje*','varilla*','soporte*','construir*','edific*','torre*','casa*','armazon*','esqueleto*','pieza*','pegar*','unir*','cercado*','valla*','vallas','marco*','marioneta*','palanca*','mecanismo*','robot*','vehiculo*','coche*','sirve*','servir*','para','usar*','hacer*','fabricar*','mezclar*','remover*','decorac*','adorno*','manualidad*','tutor*','plantas'], dist:8 }
    ], necesarios:3,
    modelo:'Botellas: maceteros, organizadores, depósitos o parte de vehículos y maquetas. Tapones: ruedas, fichas, botones o contadores. Fundas perforadas: protección de mesas, mamparas o cubiertas al pintar. Palitos de Chupa-Chups: estructuras, puentes y maquetas, o ejes y varillas.',
    exp:'Hay muchas respuestas válidas: aquí lo importante es que cada residuo tenga un uso concreto en el taller.' },

  { tipo:'abierta', q:'Indica <b>tres medidas</b> para que tu proyecto sea más sostenible mientras lo construyes en el taller.',
    ph:'Escribe tres medidas distintas…',
    conceptos:[
      { l:'tres medidas de sostenibilidad (aprovechar el material, usar materiales reciclados, comprar cerca, compartir, pinturas ecológicas, no malgastar agua, guardar en cajas reutilizadas…)', w:3, min:3, lista:[
          ['borde*','recortes','aprovechar el material','aprovechar * material','no desperdiciar*','no malgast*','desperdicio*','sobrantes','sobrante*'],
          ['recicl*','reutiliz*','ya usad*','segunda vida','otros proyectos','material usado','materiales usados','reusar*','nueva vida'],
          ['tiendas del barrio','tienda* * barrio','comercio local','tiendas locales','comprar cerca','tiendas cercanas','comprar en el barrio','vecinos','comercios'],
          ['caja*','recipiente*','envases','guardar*','contenedor*'],
          ['compart*','prestar*','intercambiar*','dar * companeros','material * companeros'],
          ['pintura* ecolog*','esmalte* ecolog*','pinturas respetuosas','respetuos* * medio','pinturas al agua','no contaminantes','pinturas naturales'],
          ['agua','desperdiciar agua','gastar agua','no malgastar agua','ahorrar agua'],
          ['equipo','repartir*','tareas','respetar* * compan*','trabajo en equipo'],
          ['papel * caras','dos caras','papel usado','reverso','borrador'],
          ['pila*','fuente de alimentacion','ahorro energetico','energia'],
          ['materiales necesarios','comprar de mas','no comprar de mas','ajustar* * material*','calcular * material*','lo justo','lo necesario','comprar lo justo','comprar lo necesario'],
          ['huella de carbono','impacto ambiental','medioambient*'],
          ['seguridad','higiene','normas de seguridad'],
          ['contenedores apropiados','tirar * contenedor*','residuos * contenedor*','clasificar * residuos','separar * residuos']
        ] }
    ], necesarios:3,
    modelo:'Por ejemplo: dibujar y cortar empezando por los bordes del material para aprovechar los recortes; usar materiales reciclados o ya usados en otros proyectos; comprar en las tiendas del barrio; guardar el proyecto en cajas reutilizadas; compartir los materiales con los compañeros; usar pinturas respetuosas con el medio ambiente y no malgastar agua.',
    exp:'Vale cualquier medida real. En el libro aparecen: aprovechar los bordes del material, usar materiales reciclados, comprar en el barrio, usar recipientes reciclados, compartir materiales, pinturas ecológicas, ahorrar agua y trabajar en equipo.' }

  ]
}

};

var ORDEN_ACTIVIDADES = ['plasticos', 'impresion3d', 'tecnicas', 'sostenibilidad'];