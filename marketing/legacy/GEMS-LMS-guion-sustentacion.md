# GEMS LMS — Guion para llenar la PPTX de sustentación

**Aprendiz:** Sebastián Pulgarín Gómez · CC 1108558201 · Ficha 2721550
**Programa:** Análisis y Desarrollo de Software (ADSO) · Regional Santander
**Instructores:** Jorge Luis Gómez Cartagena (técnico y seguimiento) · Rocío del Pilar Bedoya Orjuela (seguimiento etapa productiva)
**Plantilla:** 30 diapositivas · `PLANTILLA MODELO SUSTENTACIÓN PROYECTO EMPRESARIAL`

---

## 🔄 ACTUALIZACIÓN — PORTAFOLIO CONSOLIDADO A DOS SERVICIOS

> **Este documento se escribió con el portafolio original de 4 productos. Ya quedó reducido a 2 servicios.**
>
> | Antes | Ahora |
> |---|---|
> | GEMS LMS — Core Institucional | **GEMS Plataforma** — licencia anual $2.500.000 a $2.900.000 |
> | GEMS Connect | **Soporte y mantenimiento** — $950.000 a $1.200.000 anuales |
> | GEMS Analytics | *Capacidad del roadmap, no se vende aparte* |
> | GEMS Pay | *Capacidad del roadmap, no se vende aparte* |
>
> **Por qué:** el Excel `(6)` solo tenía dos servicios costeados. Declarar cuatro y costear dos era la inconsistencia más fácil de detectar. Con dos servicios el portafolio cuadra con las cifras.
>
> **Las cifras no cambian** — solo los nombres. El servicio 1 conserva los números del antiguo Core y el servicio 2 los del antiguo Connect: costo unitario $36.747 y $58.995, márgenes 100% y 85%, ingresos Año 1 de $105.830.172 y $65.483.939. Total $171.314.111. ✅
>
> **Competencia:** también se reemplazaron Schoology y Chamilo por **Master2000** y **Q10 Académico**, que son los competidores reales en colegios colombianos.
>
> **Fuente de verdad para nombres y tablas: [gems-lms-diapositivas.html](gems-lms-diapositivas.html)**, que ya está actualizado. Donde este documento diga "Core Institucional", "Connect", "Analytics" o "Pay" como productos vendibles, aplica la tabla de arriba.
>
> **La diapositiva 13 ya no se usa** — las dos fichas técnicas caben en la 12. Elimínala del PPTX.

---

## ⚠️ ANTES DE EMPEZAR — LEE ESTO

Adjuntaste **dos versiones del Excel** y **no dicen lo mismo en lo financiero**. Esto es lo primero que hay que resolver, porque de ahí salen las diapositivas 21 a 24.

| Indicador | `...empresarial.xlsm` (sin sufijo) | `...empresarial (6).xlsm` |
|---|---|---|
| Inversión requerida | $275.940.207 | **$97.160.477** |
| Ingresos Año 1 | $1.006.471.200 | **$171.314.111** |
| VPN | **–$66.395.231** ❌ | **+$31.084.486** ✅ |
| TIR | 14,60% (< 20% costo capital) ❌ | **28,77%** ✅ |
| Relación B/C | 1,008 | **1,108** ✅ |
| Utilidad neta Año 1 | –$107.119.190 | +$5.649.337 |
| Crédito bancario | $82.782.062 | $0 (capital propio + socios + convocatoria) |

**Recomendación: sustenta con la versión `(6)`.** La otra tiene **VPN negativo y TIR por debajo del costo de capital**, es decir, técnicamente el proyecto **no es viable** y el jurado te lo va a tumbar en la primera pregunta. La `(6)` da un proyecto viable y con cifras mucho más realistas para un SaaS que arranca.

**Pero la `(6)` tiene 3 huecos que debes tapar antes de presentar:**

1. **El párrafo de análisis financiero (celda 5.8.1) quedó con las cifras viejas.** Dice "$586.141.065 de saldo Año 5" y "$275.940.207 de inversión" — números de la versión no viable. Hay que reescribirlo (te dejo el texto nuevo en la diapositiva 24).
2. **GEMS Analytics y GEMS Pay están en $0.** Solo Core y Connect tienen costos, precios e ingresos. Declaras 4 productos pero solo 2 están costeados. Decide: o los costeas, o los presentas como *roadmap futuro* y no como líneas de ingreso del año 1.
3. **La nómina quedó en 1 programador + 1 asesor comercial**, pero el estudio organizacional describe **6 cargos**. Aclara en la sustentación que los 6 cargos son la estructura objetivo y los 2 contratados son el arranque.

> En las diapositivas de abajo, **todas las cifras financieras son de la versión `(6)`**. Donde una cifra solo existe en la otra versión, lo digo explícitamente.

---

## DIAPOSITIVA 1 — Portada de la plantilla
No se toca. Es la portada institucional del SENA.

---

## DIAPOSITIVA 2 — Título del proyecto

**⚠️ CORRIGE EL NOMBRE.** En la plantilla dice "Gemas LMS" y en el Excel aparece escrito "GE MAS LMS" (con espacio, es un error de digitación). Unifica todo a:

```
GEMS LMS
```

Contenido de la diapositiva:

| Campo | Qué poner |
|---|---|
| Nombre del proyecto | **GEMS LMS** |
| Aprendiz | Sebastián Pulgarín Gómez |
| Programa | Análisis y Desarrollo de Software — ADSO |
| Ficha | 2721550 |
| Centro de formación | Regional Santander |

*(Si el nombre comercial de la unidad productiva es GEMAS S.A.S. y la marca del producto es GEMS LMS, dilo así: "Unidad productiva: GEMAS S.A.S. — Marca: GEMS LMS". Pero no mezcles "Gemas" y "GEMS" al azar, eso se nota.)*

---

## DIAPOSITIVA 3 — Divisor de sección
"Aspectos base y generales del proyecto empresarial". No se toca.

---

## DIAPOSITIVA 4 — Objetivos del proyecto

**Objetivo general:**
> Formular un plan de negocios para la creación de una unidad productiva dedicada al desarrollo e implementación de una plataforma LMS orientada a la gestión académica y la educación digital.

**Objetivos específicos** (los 4, uno por caja):

1. **Identificar** las características del mercado objetivo mediante el análisis de las necesidades de instituciones educativas interesadas en soluciones LMS.
2. **Determinar** la viabilidad técnica del proyecto mediante la evaluación de tecnologías, infraestructura y recursos necesarios para el desarrollo de la plataforma.
3. **Definir** la estructura administrativa estableciendo funciones, roles y organización del proyecto para garantizar su correcto funcionamiento.
4. **Calcular** la viabilidad financiera y económica mediante el análisis de costos, inversión y sostenibilidad del proyecto.

---

## DIAPOSITIVA 5 — Lienzo del proyecto (Business Model Canvas)

Los 9 bloques, listos para pegar:

**Socios clave**
- Amazon Web Services (infraestructura cloud)
- Mercado Pago / Wompi (pasarela de pagos)
- SendGrid – Twilio (correo transaccional masivo)
- Google Cloud Workspace (operación interna)
- Sectigo / DigiCert (certificados SSL)
- Consultores del SIEE y asesores de calidad educativa en Antioquia (canal de recomendación)

**Actividades clave**
- Desarrollo y mantenimiento del software (backend, frontend, APIs)
- Despliegue y parametrización del SIEE por institución
- Migración de bases de datos de estudiantes y docentes
- Soporte técnico y capacitación docente
- Venta consultiva B2B a rectores y comités directivos
- Monitoreo de infraestructura y ciberseguridad

**Recursos clave**
- Código fuente propietario (registrado ante la DNDA)
- Infraestructura cloud en AWS
- Equipo técnico: desarrollo, DevOps, QA, diseño
- Marca GEMS registrada ante la SIC
- Base de datos de colegios privados del Valle de Aburrá

**Propuesta de valor**
> Un solo ecosistema SaaS especializado en colegios K-12 que reemplaza 4 herramientas sueltas: gestión académica, comunicación con padres en tiempo real, analítica predictiva de deserción y recaudo escolar. Cero mantenimiento técnico para el colegio, boletines automáticos bajo su propio SIEE y portal de padres que elimina las circulares en papel.

**Relación con el cliente**
- Venta consultiva directa con demo personalizada
- Onboarding acompañado (parametrización + capacitación)
- Soporte con SLA de 99,5% de disponibilidad
- Mesa de ayuda L–V 7:00 a.m.–5:00 p.m., monitoreo 24/7
- Éxito del cliente: encuestas de satisfacción y roadmap alimentado por los usuarios

**Canales**
- Venta directa B2B (visitas a rectorías, 60 instituciones/año)
- Landing page corporativa con SEO local
- LinkedIn Ads segmentado por cargo directivo
- Congresos y mesas de rectores en Antioquia
- Webinars y newsletter técnico mensual

**Segmentos de cliente**
- Colegios privados premium (80–150 empleados, ingresos > $3.500 M)
- Colegios privados medianos tradicionales (35–75 empleados)
- Corporaciones y redes educativas multi-sede (> 200 empleados)
- Usuarios finales: rectores, docentes, estudiantes, padres de familia

**Productos o servicios**
1. GEMS LMS – Core Institucional
2. GEMS Connect – Comunicación Escuela-Familia
3. GEMS Analytics – Inteligencia de datos
4. GEMS Pay – Recaudo escolar

**Estructura de costos**
- Costos de producción: $91.911.482 (Año 1)
- Mano de obra administrativa: $34.981.380
- Mezcla de mercadeo: $42.910.000
- Administración y generales: $3.000.000
- Inversión en activos: $68.360.000
- **Total egresos Año 1: $172.802.862**

**Fuentes de ingreso**
- Licenciamiento anual del Core: $2.500.000 – $2.900.000 por institución
- Módulo Connect: $950.000 – $1.200.000
- Módulo Analytics: $1.400.000 – $1.800.000
- Módulo Pay: $800.000 – $1.100.000
- **Ingresos Año 1: $171.314.111 → Año 5: $347.397.284**

---

## DIAPOSITIVA 6 — Divisor de sección
"Análisis y estudio de mercados". No se toca.

---

## DIAPOSITIVA 7 — Estudio de mercado

**Zona donde ofertará el producto/servicio**

| Campo | Valor |
|---|---|
| País | Colombia |
| Departamento | Antioquia |
| Ciudad | Medellín |
| Zona | Área metropolitana del Valle de Aburrá — comunas de estratos 3 a 6: El Poblado, Laureles-Estadio, Belén, Envigado y Sabaneta |

**Demanda potencial — 40%** *(el porcentaje que trae la plantilla)*

| Caracterización | Número | Descripción |
|---|---|---|
| **Personas** | **> 142.000** | Estudiantes y docentes vinculados a instituciones privadas del Valle de Aburrá. Fuente: censo educativo de la Secretaría de Educación de Medellín y clúster de servicios del Valle de Aburrá. |
| **Empresas** | **> 380** | Instituciones educativas privadas con licencia vigente. Fuente: Directorio Único de Establecimientos Educativos (DUE) del MEN y Cámara de Comercio de Medellín. |

**Demandantes potenciales reales** (el nicho al que sí le puedes vender):
- **> 350 personas** — rectores, directores académicos y gerentes de compras con autonomía presupuestal
- **> 150 empresas** — colegios privados de estrato medio-alto en proceso de transformación digital

**Precios de venta** (licenciamiento anual por institución)

| | Producto | Precio |
|---|---|---|
| Precio 1 | GEMS LMS – Core Institucional | $2.500.000 – $2.900.000 |
| Precio 2 | GEMS Connect | $950.000 – $1.200.000 |
| Precio 3 | GEMS Analytics | $1.400.000 – $1.800.000 |
| Precio 4 | GEMS Pay | $800.000 – $1.100.000 |

> **Descuento suite completa: 15%** si contratan los 4 módulos.

---

## DIAPOSITIVA 8 — Análisis de la competencia

Los 5 competidores. Para cada uno: nivel de aceptación, a quién atiende, por qué lo eligen y precio.

**Competidor 1 — Moodle** · Aceptación: Regular
- **Atiende:** universidades, educación superior e institutos técnicos (ETDH)
- **Por qué lo eligen:** código abierto, licencia gratuita, comunidad global masiva de desarrolladores
- **Precio:** licencia $0, pero hosting y soporte de terceros desde **$2.500.000/año**
- **Nuestra ventaja:** Moodle es genérico y exige que el colegio administre su propio servidor. No tiene portal de padres ni analítica predictiva nativa.

**Competidor 2 — Google Classroom** · Aceptación: Alta
- **Atiende:** colegios públicos y privados de todos los niveles, docentes independientes
- **Por qué lo eligen:** interfaz muy intuitiva, gratuita con Google Workspace, integración nativa con la nube
- **Precio:** gratuito; Enterprise desde **$22.000/usuario/mes**
- **Nuestra ventaja:** Classroom gestiona tareas, no gestiona el colegio. No hay boletines bajo SIEE, ni observador, ni recaudo, ni analítica directiva.

**Competidor 3 — Phidias** · Aceptación: Alta
- **Atiende:** colegios privados de estratos 5 y 6, bilingües de gran tamaño
- **Por qué lo eligen:** centraliza muy bien administración, facturación de pensiones y matrícula
- **Precio:** cotización B2B, promedio **> $12.000.000/año**
- **Nuestra ventaja:** nuestro precio es 4–5 veces menor y apuntamos al segmento medio que Phidias deja por fuera.

**Competidor 4 — Schoology (PowerSchool)** · Aceptación: Regular
- **Atiende:** básica y media con enfoque internacional o bilingüe
- **Por qué lo eligen:** diseño tipo red social que facilita la adopción estudiantil, evaluación con rúbricas
- **Precio:** suscripción anual en dólares, **$8.000.000 – $15.000.000**
- **Nuestra ventaja:** no está parametrizado al SIEE colombiano ni a la normativa local de habeas data.

**Competidor 5 — Chamilo** · Aceptación: Poca
- **Atiende:** centros de capacitación pequeños, colegios independientes, cursos libres
- **Por qué lo eligen:** software libre muy liviano, fácil de instalar en servidores económicos
- **Precio:** licencia $0, instalación y administración por cuenta del cliente
- **Nuestra ventaja:** no tiene gestión escolar ni módulo financiero; el cliente queda solo con el soporte.

**Cierre de la diapositiva (dilo en voz alta):**
> Ninguno de los cinco resuelve las tres cosas al mismo tiempo: gestión académica bajo SIEE colombiano, portal de padres en tiempo real y analítica predictiva de deserción. Los gratuitos exigen que el colegio sea su propio administrador de sistemas; los robustos cuestan de 4 a 5 veces más que nosotros. GEMS LMS ocupa ese espacio del medio.

---

## DIAPOSITIVA 9 — Estrategias de mercado y promociones

**Estrategia de precio — Descuentos** · Costo anual: $6.000.000
> Campaña de penetración: **15% de descuento** a las primeras 15 instituciones que contraten la suite completa durante el primer trimestre de lanzamiento.

**Estrategia de mercado 2 — Subsidio de inclusión digital** · Costo anual: $4.500.000
> **10% de descuento** en la licencia anual para colegios pequeños (menos de 250 estudiantes matriculados) o de zonas vulnerables, para facilitar su transformación digital.

**Estrategia de mercado 3 — Pronto pago y renovación anticipada** · Costo anual: $2.500.000
> **5% de descuento** si el contrato se liquida antes del inicio del año escolar, dentro de los primeros 30 días del calendario formativo.

**Estrategia de mercado 4 — Congelación de tarifas** · Costo anual: $0
> Tarifa congelada por **24 meses** para instituciones que firmen acuerdos de permanencia bienales; la empresa absorbe la inflación de la infraestructura de servidores.

**Subtotal estrategias de precio Año 1: $13.000.000**

*Si sobra espacio, añade la promoción más fuerte que tienes: **prueba piloto gratis de 30 días** del módulo de padres (GEMS Connect) y **cero costo de implementación inicial** si firman en el primer mes.*

---

## DIAPOSITIVA 10 — Canales y formas de distribución

**Canales de distribución**

| Opción de la plantilla | Aplica | Justificación |
|---|---|---|
| **Distribución directa** | ✅ **SÍ** | Venta consultiva B2B sin intermediarios. Un equipo comercial interno contacta directamente a juntas directivas y rectores para demos personalizadas. Indispensable porque el software exige negociación de presupuesto institucional, firma de contrato de manejo de datos e implementación técnica guiada. |
| Distribución indirecta – canal corto | ❌ No aplica | No se usan revendedores ni tiendas de apps. Un intermediario encarecería la anualidad y debilitaría el soporte prioritario que debemos garantizar directamente al colegio. |
| Distribución indirecta – canal largo | ❌ No aplica | Mayoristas y agentes externos son obsoletos en EdTech. La complejidad técnica, la ciberseguridad y el despliegue personalizado en la nube impiden delegar la comercialización. |
| Local físico / servicio a domicilio | ❌ No aplica | El producto es intangible: se entrega como subdominio web (ej. `colegio.gemslms.com`) con credenciales cifradas por rol. La operación es **desde casa**, no hay local abierto al público. |

**Formas de distribución** → marca **SELECTIVA**

| Forma | Aplica | Por qué |
|---|---|---|
| Intensiva | ❌ | Es para consumo masivo de baja implicación. Un software de gestión escolar no se oferta en marketplaces genéricos. |
| **Selectiva** | ✅ | Nicho corporativo específico: colegios privados K-12 urbanos de estrato medio-alto, que cumplan un perfil técnico mínimo (conectividad y dispositivos) para asegurar la estabilidad del servicio. |
| Exclusiva | ❌ | No se otorga exclusividad territorial. Cualquier establecimiento educativo formal del Área Metropolitana puede contratar, sin restricción de competencia entre ellos. |

**Otras estrategias de distribución** (con costo anual):
- Venta consultiva directa corporativa — $2.400.000
- Email marketing corporativo segmentado a directivos — $600.000
- Participación en congresos educativos de Antioquia — $3.500.000
- Alianzas con consultores del SIEE y asesores de calidad — $0
- **Subtotal plaza: $6.500.000**

---

## DIAPOSITIVA 11 — Divisor de sección
"Análisis y estudio técnico". No se toca.

---

## DIAPOSITIVAS 12 y 13 — Fichas técnicas de los 4 productos

La 12 lleva los productos 1 y 2; la 13 lleva los productos 3 y 4.

### FICHA 1 — GEMS LMS Core Institucional

| Campo | Contenido |
|---|---|
| **Nombre del producto** | Ecosistema Tecnológico de Gestión Académica GEMS LMS |
| **Nombre comercial** | GEMS LMS – Core Institucional |
| **Descripción general** | Plataforma web integral en la nube (SaaS) para la administración, control pedagógico y seguimiento académico de instituciones K-12. Centraliza bases de datos, matrículas, control de asistencia, observador del alumno, asignación de actividades virtuales y automatización de boletines periódicos. |
| **Presentación y empaque** | Entrega 100% digital: subdominio institucional personalizado (`colegio.gemslms.com`) con entornos cifrados independientes y acceso por credenciales según rol. |
| **Vida útil** | Indefinida, sujeta al contrato de licenciamiento anual. Incluye actualizaciones, optimizaciones y mantenimiento continuo sin instalaciones del cliente. |
| **Condiciones de almacenamiento** | Alojamiento en AWS con redundancia de datos, HTTPS, cifrado SSL/TLS en tránsito y reposo, backups automáticos diarios. |
| **Condiciones de uso** | Dispositivo con internet estable (PC, tablet o smartphone) y navegador moderno (Chrome, Firefox, Safari, Edge). |
| **Composición** | Backend robusto, bases de datos relacionales seguras, APIs de integración modular, frontend responsive. |
| **Mínimo de producción** | 1 licencia institucional parametrizada |
| **Máximo de producción** | Ilimitado (escalabilidad horizontal en la nube) |
| **Otro** | Cumplimiento de la Ley 1581 de 2012 (Habeas Data) para datos de menores de edad. |
| **Imagen** | Screenshot del dashboard principal |

### FICHA 2 — GEMS Connect

| Campo | Contenido |
|---|---|
| **Nombre del producto** | Módulo de Comunicación y Vinculación Escuela-Familia |
| **Nombre comercial** | GEMS Connect |
| **Descripción general** | Aplicación web y portal móvil para interacción instantánea entre institución y acudientes. Automatiza circulares, control diario de asistencia, citaciones, reportes en tiempo real del observador y firmas electrónicas de autorizaciones. |
| **Presentación y empaque** | Extensión modular dentro del entorno institucional; accesos web para padres mediante perfiles cifrados individuales. |
| **Vida útil** | Indefinida, ligada al contrato anual. Parches de UI/UX, mantenimiento preventivo y actualizaciones mensuales transparentes. |
| **Condiciones de almacenamiento** | AWS con bases de datos indexadas y cifrado extremo a extremo del historial de comunicaciones de menores. |
| **Condiciones de uso** | Cualquier smartphone, tablet o PC con navegador estándar. Arquitectura web ligera, sin descargas pesadas. |
| **Composición** | Microservicios vía APIs REST, motores de notificación masiva (push/email), bases NoSQL para logs de lectura. |
| **Mínimo de producción** | 1 licencia modular por institución |
| **Máximo de producción** | Ilimitado (según ancho de banda cloud) |
| **Otro** | Trazabilidad legal: registro auditable con marca de tiempo de circulares enviadas y leídas, válido ante auditorías del SIEE. |
| **Imagen** | Screenshot del portal de padres en móvil |

### FICHA 3 — GEMS Analytics

| Campo | Contenido |
|---|---|
| **Nombre del producto** | Módulo Avanzado de Inteligencia de Datos y Analítica Predictiva |
| **Nombre comercial** | GEMS Analytics |
| **Descripción general** | Tablero analítico interactivo (Dashboard BI) que procesa variables académicas y de asistencia. Genera alertas tempranas de riesgo de deserción o reprobación mediante reportes visuales para la alta dirección. |
| **Presentación y empaque** | Módulo restringido dentro del subdominio institucional, con permisos cifrados específicos para rectoría y coordinación. |
| **Vida útil** | Indefinida, ligada al contrato anual. Incluye optimización continua de algoritmos y mantenimiento de la base analítica. |
| **Condiciones de almacenamiento** | AWS; las consultas analíticas se ejecutan aisladas para no afectar la operación diaria del colegio. |
| **Condiciones de uso** | PC o laptop con internet estable y navegador moderno; resolución estándar para los gráficos interactivos. |
| **Composición** | Motores de consulta optimizados, scripts de agregación de KPIs escolares, librerías dinámicas de visualización. |
| **Mínimo de producción** | 1 licencia analítica por colegio |
| **Máximo de producción** | Ilimitado (clústeres cloud) |
| **Otro** | Cifrado a nivel de fila: los informes confidenciales solo son accesibles por usuarios directivos autorizados. |
| **Imagen** | Screenshot del dashboard de indicadores |

### FICHA 4 — GEMS Pay

| Campo | Contenido |
|---|---|
| **Nombre del producto** | Sistema Centralizado de Recaudo y Pasarela Financiera Escolar |
| **Nombre comercial** | GEMS Pay |
| **Descripción general** | Módulo financiero que automatiza liquidación, facturación y cobranza en línea de matrículas y pensiones. Permite consulta de estados de cuenta en tiempo real y conciliación bancaria automática para la tesorería. |
| **Presentación y empaque** | Integración nativa de APIs financieras dentro del portal institucional, habilitando pasarelas de pago para acudientes. |
| **Vida útil** | Indefinida, ligada al contrato anual. Incluye mantenimiento de conexiones API, actualizaciones por normativa bancaria y soporte al área contable. |
| **Condiciones de almacenamiento** | AWS bajo estándares de seguridad financiera; transacciones cifradas en bases relacionales con alta redundancia. |
| **Condiciones de uso** | Acudientes: cualquier dispositivo con internet seguro. Tesorería: PC con navegador moderno para el panel contable. |
| **Composición** | Webhooks para respuesta de pago en tiempo real, cifrado de transacciones, exportación contable en CSV/Excel. |
| **Mínimo de producción** | 1 entorno de recaudo parametrizado con las cuentas del colegio |
| **Máximo de producción** | Ilimitado (procesamiento elástico para picos de matrícula) |
| **Otro** | Cifrado extremo a extremo con protocolos equivalentes a PCI-DSS; aislamiento total de datos bancarios. |
| **Imagen** | Screenshot del estado de cuenta / botón de pago |

---

## DIAPOSITIVA 14 — Requerimientos y activos

Las 7 categorías de la plantilla, con cantidad y precio total:

| Categoría | Detalle | Total |
|---|---|---|
| **Maquinaria y equipo** | 2 servidores en rack (Xeon 24 núcleos, 128GB RAM, NVMe RAID) $30.000.000 · 3 estaciones de compilación (Core i9, GPU 16GB, 64GB RAM) $36.000.000 · 2 NAS de 4TB $300.000 · 1 impresora térmica $250.000 · 2 UPS 1500VA $240.000 | **$66.790.000** |
| **Equipo de comunicación y computación** | Router corporativo con VPN y firewall $200.000 · Switch administrable 24 puertos PoE $300.000 · Firewall físico IPS/IDS $500.000 · Access Point Wi-Fi 6 $60.000 · Kit de diademas profesionales $40.000 | **$1.100.000** |
| **Muebles y enseres** | 1 archivador metálico con cerradura $10.000 · 2 escritorios de desarrollo $40.000 · 3 sillas ergonómicas $90.000 | **$140.000** |
| **Herramientas y otros** | Licencia IDE de desarrollo backend $50.000 · 2 licencias de herramientas UI/UX $120.000 · Kit de herramientas de mantenimiento *(en la v6 queda en $120.000)* | **$120.000** |
| **Semovientes y cultivos** | **NO APLICA** — Proyecto de economía digital y desarrollo de plataformas SaaS. Sin actividades agrícolas, pecuarias ni explotación de suelos. | **$0** |
| **Infraestructura y adecuaciones** | Cableado estructurado Cat 6A $30.000 · Sistema eléctrico y polo a tierra $40.000 · Adecuación lumínica LED $50.000 | **$120.000** |
| **Gastos pre-operativos** | Constitución legal ante Cámara de Comercio $20.000 · Registro del software ante la DNDA $30.000 · Registro marcario GEMS ante la SIC $40.000 | **$90.000** |
| **VALOR TOTAL REQUERIMIENTO Y ACTIVOS** | | **$68.360.000** |

> ⚠️ En la categoría "Semovientes y cultivos" el Excel sin sufijo tiene $270.000 con textos raros ("Justificación tecnológica", "Exclusión de activos biológicos"). Eso es un relleno para no dejar la fila vacía y **se ve mal**. En la v6 ya está en $0. Déjalo en $0 y di "no aplica" — es la respuesta correcta y honesta.

---

## DIAPOSITIVA 15 — Estimación de la demanda y presupuesto de costos

**Costos variables por unidad o servicio (costo unitario Año 1)**

| Producto o servicio | Costo unitario | Valor mensual | Valor anual |
|---|---|---|---|
| GEMS LMS – Core Institucional | $36.747 | $2.939.727 | $35.276.724 |
| GEMS Connect | $58.995 | $2.949.727 | $35.396.724 |
| GEMS Analytics | *(sin costear en v6)* | — | — |
| GEMS Pay | *(sin costear en v6)* | — | — |

**Presupuesto de costos de producción proyectado**

| Bien o servicio | Año 1 | Año 2 | Año 3 | Año 4 | Año 5 |
|---|---|---|---|---|---|
| GEMS LMS – Core | $35.276.724 | $38.261.558 | $41.576.922 | $45.308.035 | $49.467.313 |
| GEMS Connect | $56.634.758 | $61.426.738 | $66.749.365 | $72.739.454 | $79.416.935 |
| GEMS Analytics | $0 | $0 | $0 | $0 | $0 |
| GEMS Pay | $0 | $0 | $0 | $0 | $0 |
| **TOTAL** | **$91.911.482** | **$99.688.297** | **$108.326.288** | **$118.047.489** | **$128.884.248** |

**Plan de producción (unidades = licencias/servicios prestados)**

| Producto | Cant. mensual | Cant. anual | Año 1 | Año 5 |
|---|---|---|---|---|
| GEMS LMS – Core | 80 | 960 | 960 | 1.195 |
| GEMS Connect | 50 | 600 | 600 | 747 |
| **TOTAL UNIDADES/AÑO** | | | **1.560** | **1.942** |

*El crecimiento anual se proyecta con el PIB del sector: 5,2% (Año 2), 5,5% (Año 3), 5,8% (Año 4), 6,0% (Año 5).*

---

## DIAPOSITIVA 16 — Requerimientos de mano de obra directa

**Versión (6) — la que debes presentar:**

| Nombre del cargo | Cantidad | Tipo de contrato | Salario básico | Valor neto pagado |
|---|---|---|---|---|
| Programador | 1 | Contrato de nómina | $2.800.000 | **$4.514.727** |
| **Total** | **1** | | **$2.800.000** | **$4.514.727** |

> ⚠️ **El Excel sin sufijo tiene aquí un problema grave:** los cargos dicen "Persona con rol de operario 1", "operario mecánico", "operario tornero", "jefe de producción" — son los **ejemplos genéricos de la plantilla del SENA para una empresa de manufactura**. En un proyecto de software eso es un error evidente y el jurado lo va a ver.
>
> Si necesitas mostrar más de un cargo en mano de obra directa, usa nombres reales del proyecto:
> - Desarrollador Backend / Ingeniero de Software
> - Diseñador Web UI/UX y Frontend
> - Ingeniero de Operaciones / DevOps
> - Analista de Control de Calidad / QA Tester
>
> Y aclara en voz alta: *"la mano de obra directa del año 1 es un programador de tiempo completo; los demás cargos se incorporan según el plan de escalamiento."*

**Proyección de la mano de obra directa** (con incremento salarial 3,1% / 3% / 3% / 3%):
Año 1: $54.176.724 · escala hasta ~$60.988.000 en Año 5.

---

## DIAPOSITIVA 17 — Divisor de sección
"Análisis organizacional y legal". No se toca.

---

## DIAPOSITIVA 18 — Organigrama

Datos de identidad de la unidad productiva:
- **Nombre comercial:** GEMAS
- **Sigla / razón social:** GEMAS S.A.S.
- **Marca:** GEMS LMS
- **Tipo de persona:** Persona jurídica · **Individual** (1 socio)
- **Forma de operar:** desde casa · zona periurbana
- **Empleos:** 0 directos (sin incluirte) + **2 indirectos**

**Estructura a dibujar** (4 niveles, de arriba abajo):

```
                    GERENCIA GENERAL
                 Gerente General / Líder de Proyectos
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
  ÁREA DE DESARROLLO    ÁREA DE DISEÑO      ÁREA COMERCIAL
     Y BACKEND            Y FRONTEND         Y DE SERVICIOS
        │                     │                     │
  • Desarrollador       • Diseñador Web      • Auxiliar de Soporte
    Backend /             UI/UX y              y Éxito del Cliente
    Ing. de Software      Frontend
  • Ing. de Operaciones
    / DevOps
  • Analista QA Tester
```

**Las 3 áreas y sus funciones (para narrar):**
- **Gerencia General** — dirección estratégica, relación comercial B2B con instituciones, flujo de caja y presupuestos, cumplimiento legal (Habeas Data), SLA y escalabilidad del negocio.
- **Área de Desarrollo y Backend** — arquitectura lógica y bases de datos, APIs, algoritmos de analítica, servidores, backups, monitoreo, pruebas y control de calidad.
- **Área de Diseño y Frontend** — UI/UX, wireframes, frontend responsive, identidad visual, pruebas de usabilidad.
- **Área Comercial y de Servicios** — soporte técnico a usuarios, onboarding de clientes nuevos, tickets, manuales y FAQs, encuestas de satisfacción.

> Como la unidad arranca contigo solo, dilo así: *"En la fase inicial asumo las funciones de gerencia y desarrollo; el organigrama representa la estructura objetivo hacia la que escala la unidad productiva."* Es exactamente lo que el formato pide (punto 4.2.1: "independientemente de que usted sea el único vinculado, debe señalar las áreas").

---

## DIAPOSITIVA 19 — Requerimientos de mano de obra administrativa

**Versión (6):**

| Nombre del cargo | Cantidad | Tipo de contrato | Salario básico | Valor neto pagado |
|---|---|---|---|---|
| Asesor Comercial | 1 | Contrato de nómina | $1.750.000 | **$2.915.115** |
| **Total** | **1** | | **$1.750.000** | **$2.915.115** |

**Proyección:** Año 1 $34.981.380 → Año 5 $39.410.076

*(La versión sin sufijo trae 3 cargos: gerente $2.247.663, revisor fiscal $500.000, auxiliar contable $2.862.607 → total $5.610.270/mes y $67.323.240 al año. Si presentas la v6, no mezcles estas cifras.)*

**Datos de referencia que puedes citar si preguntan:**
- Salario mínimo: $1.750.905 · Auxilio de transporte: $249.095
- Prestaciones sociales: 21,8% (prima 8,3% + cesantías 8,33% + vacaciones 4,17% + intereses 1%)
- Seguridad social a cargo del empleador: 20,5% (salud 8,5% + pensión 12%)
- Parafiscales: 9% (caja 4% + ICBF 3% + SENA 2%)
- Riesgo laboral: **Clase I – 0,522%** (trabajos de oficina y administrativos) ← el que aplica a una empresa de software

---

## DIAPOSITIVA 20 — Gastos administrativos de la unidad

**Versión (6):**

| Rubro | Valor mensual | Año 1 | Año 2 | Año 3 | Año 4 | Año 5 |
|---|---|---|---|---|---|---|
| Mezcla de mercados | $3.575.833 | $42.910.000 | $44.240.210 | $45.567.416 | $46.934.439 | $48.342.472 |
| Agua y aseo | $100.000 | $1.200.000 | $1.237.200 | $1.274.316 | $1.312.545 | $1.351.922 |
| Papelería | $50.000 | $600.000 | $618.600 | $637.158 | $656.273 | $655.636 |
| Viáticos | $100.000 | $1.200.000 | $1.237.200 | $1.274.316 | $1.312.545 | $1.311.272 |
| **TOTAL** | **$3.825.833** | **$45.910.000** | **$47.333.210** | **$48.753.206** | **$50.215.802** | **$51.661.302** |

**Resumen consolidado (gastos administrativos, ventas y generales):**

| Detalle | Año 1 | Año 5 |
|---|---|---|
| Mano de obra administrativa | $34.981.380 | $39.410.076 |
| Administración, ventas y generales | $45.910.000 | $51.661.302 |
| **Total** | **$80.891.380** | **$91.071.379** |

*(La versión sin sufijo solo tiene 2 rubros — mezcla de mercados $42.910.000 y arrendamiento $6.000.000 — para un total de $48.910.000, y el consolidado sube a $116.233.240. La v6 es más completa en el desglose.)*

---

## DIAPOSITIVA 21 — Divisor de sección
"Análisis de viabilidad financiera". No se toca.

---

## DIAPOSITIVA 22 — Costos operacionales y precio

**Presupuesto de costos operacionales** (costo unitario de producción por año)

| Item | Bien/Servicio | Año 1 | Año 2 | Año 3 | Año 4 | Año 5 |
|---|---|---|---|---|---|---|
| 1 | GEMS LMS – Core Institucional | $36.747 | $37.886 | $39.022 | $40.193 | $41.399 |
| 2 | GEMS Connect | $58.995 | $60.823 | $62.648 | $64.528 | $64.528 |
| 3 | GEMS Analytics | $0 | $0 | $0 | $0 | $0 |
| 4 | GEMS Pay | $0 | $0 | $0 | $0 | $0 |

**Precios proyectados**

| Item | Bien/Servicio | Costo unitario | Margen | Precio Año 1 | Año 2 | Año 3 | Año 4 | Año 5 |
|---|---|---|---|---|---|---|---|---|
| 1 | GEMS LMS – Core | $36.747 | **100%** | $110.240 | $121.264 | $135.815 | $154.830 | $179.602 |
| 2 | GEMS Connect | $58.995 | **85%** | $109.140 | $120.054 | $134.460 | $153.285 | $177.810 |
| 3 | GEMS Analytics | — | — | — | — | — | — | — |
| 4 | GEMS Pay | — | — | — | — | — | — | — |

*Incremento del precio proyectado: 10% (A2), 12% (A3), 14% (A4), 16% (A5).*

> ⚠️ **Ojo con esto:** la plantilla PPTX viene con cifras de ejemplo ($57.630, $13.552, margen 30%/20%/14%/58%). **Bórralas todas** y pon las de arriba. Y si te preguntan por qué el precio unitario es ~$110.000 cuando la licencia institucional se vende en $2.500.000: porque la unidad de medida del plan de producción es **paquete/licencia por usuario o grupo**, no la institución completa. Ten clara esa explicación.

---

## DIAPOSITIVA 23 — Estados financieros

**Ingresos de ventas**

| Año 1 | Año 2 | Año 3 | Año 4 | Año 5 |
|---|---|---|---|---|
| $171.314.111 | $198.244.690 | $234.245.925 | $282.528.695 | $347.397.284 |

*(Ingreso por ventas con política de cartera a 15 días: $178.452.199 · $206.504.885 · $244.006.172 · $294.300.724 · $361.872.171)*

**Egresos**

| Año 1 | Año 2 | Año 3 | Año 4 | Año 5 |
|---|---|---|---|---|
| $172.802.862 | $183.031.510 | $194.169.797 | $206.466.303 | $219.955.627 |

*Composición Año 1: costos de producción $91.911.482 + mezcla de mercados $42.910.000 + mano de obra administrativa $34.981.380 + administración y generales $3.000.000 + depreciación $3.625.500. Sin intereses ni amortización (no hay crédito bancario).*

**Utilidad neta**

| Año 1 | Año 2 | Año 3 | Año 4 | Año 5 |
|---|---|---|---|---|
| $5.649.337 | $17.605.032 | $37.377.282 | $65.875.816 | $144.104.283 |

*Impuesto de renta persona jurídica: 35%. Saldo final de caja acumulado Año 5: **$270.611.749**.*

---

## DIAPOSITIVA 24 — Análisis de la viabilidad financiera

**Los indicadores (versión 6):**

| Indicador | Valor | Lectura |
|---|---|---|
| **Costo de capital** | **20%** | Tasa de descuento exigida al proyecto |
| **Valor actual de la inversión (VA)** | **$128.244.963** | Valor presente de los flujos futuros |
| **Valor presente neto (VPN)** | **+$31.084.486** | ✅ Positivo → el proyecto genera valor por encima del 20% exigido |
| **Tasa interna de retorno (TIR)** | **28,77%** | ✅ Supera el costo de capital en 8,77 puntos |
| **Relación beneficio / costo** | **1,11** | ✅ Por cada peso invertido se recuperan $1,11 |
| **Año de recuperación de la inversión (PRI)** | **Año 5** | La inversión de $97.160.477 se recupera dentro del horizonte |

**Estructura de financiación:**
- Capital propio 40% — $38.864.191
- Capital de socios 50% — $48.580.239
- Convocatoria 10% — $9.716.048
- **Crédito bancario: $0** (el proyecto no se apalanca con deuda)
- **Total: $97.160.477**

**Texto nuevo para el análisis** *(reemplaza el del Excel, que quedó con las cifras viejas)*:

> El proyecto es financieramente viable. Con un costo de capital del 20%, el Valor Presente Neto es positivo en $31.084.486 y la Tasa Interna de Retorno alcanza el 28,77%, es decir, 8,77 puntos por encima de la rentabilidad mínima exigida. La relación beneficio-costo de 1,11 indica que por cada peso invertido se recuperan $1,11.
>
> A diferencia de la mayoría de emprendimientos de software, la unidad productiva genera **utilidad neta positiva desde el primer año** ($5.649.337), gracias a que el modelo SaaS tiene un costo marginal muy bajo por usuario adicional y a que no se recurre a crédito bancario, lo que elimina la carga de intereses. Los ingresos escalan de $171.314.111 en el Año 1 a $347.397.284 en el Año 5 —un crecimiento del 103%— mientras los egresos solo crecen 27%, lo que amplía progresivamente el margen operativo.
>
> El saldo final de caja acumulado llega a $270.611.749 en el Año 5 y la inversión inicial de $97.160.477 se recupera dentro del horizonte de evaluación. La estructura de financiación —40% capital propio, 50% capital de socios y 10% convocatoria— mantiene la unidad libre de deuda financiera, lo que reduce el riesgo en la etapa de penetración de mercado.

---

## DIAPOSITIVA 25 — Divisor de sección
"Producto Mínimo Viable". No se toca.

---

# 🚨 ANTES DE LAS DIAPOSITIVAS DEL PMV — LEE ESTO

Revisé el código de `gems-lms.zip`. **Lo que construiste es sólido y grande** (683 archivos, ~58.900 líneas, 113 componentes, 3 microservicios, 43 endpoints). Pero hay una **brecha entre lo que el plan de negocio promete y lo que el software hace hoy**, y el jurado la va a encontrar. Mejor que la nombres tú primero:

| El plan de negocio vende… | En el código hay… |
|---|---|
| **GEMS LMS Core** — gestión académica | ✅ **Construido y navegable de punta a punta** |
| **GEMS Connect** — portal de padres de familia | ❌ **No existe el rol "padre/acudiente".** Los roles son super_admin, admin, instructor, student. No hay portal de acudientes ni notificaciones push ni firma electrónica. |
| **GEMS Analytics** — IA predictiva de deserción | ⚠️ Hay panel de estadísticas del instructor y gráfico de radar comparando notas vs. promedio del grupo. **No hay ningún componente de IA ni modelo predictivo** — cero dependencias de IA en el proyecto. |
| **GEMS Pay** — recaudo con pasarela | ❌ **No existe.** Sin pasarela, sin facturación, sin conciliación. Solo un enum conceptual de tipo de suscripción. |
| "Componente innovador: inteligencia artificial" | ❌ **No implementado.** Es la afirmación más riesgosa del documento. |

**Cómo lo manejo yo si fuera tu presentación:** el PMV es **GEMS LMS Core**, y está muy bien logrado. Connect, Analytics y Pay se presentan como **roadmap del producto** (fases 2, 3 y 4), no como módulos entregados. Y el componente innovador que defiendes es el que **sí puedes demostrar en pantalla**:

> Arquitectura multi-tenant con white-labeling en tiempo real: cada institución ve la plataforma con su logo, sus colores, su tema y su CSS propio, sobre una sola base de código. Más la progresión secuencial bloqueada con certificación automática.

Eso es real, es difícil de hacer, y lo puedes mostrar en vivo. Es mucho mejor defensa que una IA que no existe.

---

## DIAPOSITIVA 26 — Aspectos clave del Producto Mínimo Viable

### ¿Qué competencias de mi programa de formación se alinean con la elaboración de mi PMV?

- **Analizar los requisitos del cliente** — Se levantaron los requisitos de cuatro perfiles de usuario distintos (super administrador, administrador de institución, instructor y estudiante) y se modelaron 22 rutas de navegación con permisos diferenciados.
- **Diseñar el sistema de información** — Se aplicó **Arquitectura Hexagonal (Clean Architecture) con DDD** en los tres microservicios y en las cinco librerías del frontend: capas `domain` → `application` → `infrastructure`, con entidades ricas, *value objects* validados y puertos/adaptadores.
- **Construir el sistema de información / producir el código de los módulos** — 683 archivos, ~58.900 líneas: Java 24 con Spring Boot 3.4.5 reactivo (WebFlux) en el backend y Angular 22 con *signals* y *zoneless change detection* en el frontend.
- **Implementar la estructura de datos** — 11 tablas en PostgreSQL 16 sobre un modelo **database-per-service** (tres bases independientes), con acceso reactivo vía R2DBC.
- **Aplicar buenas prácticas de calidad y realizar pruebas** — 67 clases de prueba y 7.568 líneas de test (≈40% del backend), con JUnit 5, Mockito y `StepVerifier`, y **cobertura exigida del 100%** en casos de uso, adaptadores, controladores y entidades vía JaCoCo.
- **Desplegar el sistema de información** — Contenerización con Docker Compose, reverse proxy Nginx con TLS y certificados Let's Encrypt sobre tres subdominios productivos.
- **Aplicar seguridad informática** — Autenticación JWT, hash BCrypt, *rate limiting* con Redis, cabeceras de seguridad HTTP, CORS configurable y manejo global de excepciones.

### ¿Qué importancia tiene la elaboración del PMV con la funcionalidad de mi proyecto?

> El PMV es lo que convierte el plan de negocio en algo demostrable. Un rector no compra una promesa: compra lo que ve funcionando en la pantalla en una demo de veinte minutos.
>
> Concretamente, el PMV permitió tres cosas. **Primero, validar la arquitectura**: comprobar que el modelo multi-tenant con white-labeling en tiempo real es viable sobre una sola base de código, que es la premisa de la que depende toda la estructura de costos del modelo SaaS —el costo marginal por institución adicional es casi cero—. **Segundo, validar la experiencia de usuario** de los cuatro roles con datos realistas: once cursos con currículo completo, cinco rutas de aprendizaje, estudiantes con avances distintos y casos límite (un curso casi terminado y uno completado) para poder probar la certificación y la encuesta. **Tercero, habilitar la estrategia comercial**: la prueba piloto gratuita de 30 días y el "cero costo de implementación" que aparecen en el plan de mercadeo solo son ofertables porque existe un producto que se puede desplegar.

### ¿Qué quiero lograr con la elaboración de mi PMV?

1. **Demostrar el recorrido completo** de los cuatro roles sin datos ficticios visibles: desde que el super administrador crea una institución con su branding hasta que el estudiante descarga su certificado en PDF.
2. **Probar técnicamente el multi-tenant**: una institución nueva operativa con su identidad visual propia en minutos, sin tocar código.
3. **Validar el ciclo académico completo**: crear un curso con seis tipos de contenido → matricular un grupo → que el estudiante avance con progresión bloqueada → que el quiz se califique automáticamente → que el instructor califique la tarea → que se emita el certificado.
4. **Tener una base de demo para la venta consultiva** que soporte las reuniones con rectores del Área Metropolitana.
5. **Dejar la arquitectura lista para escalar** hacia los módulos Connect, Analytics y Pay sin reescribir el núcleo.

### Características diferenciadoras del PMV realizado

- **White-labeling en tiempo real** — El `BrandingService` sobrescribe las CSS custom properties en runtime: logo, favicon, colores primario/secundario/acento/texto, tema claro-oscuro, imagen de fondo del login y **CSS personalizado por institución**. Una sola base de código, N identidades visuales.
- **Progresión secuencial bloqueada** — Un bloque de contenido queda inaccesible hasta que se completa el anterior. Los documentos se auto-completan por tiempo mínimo de permanencia; los quizzes solo desbloquean si el **mejor** intento aprueba; las tareas **no** se completan hasta que el instructor las califica.
- **Seis tipos de bloque de contenido** en un mismo editor — video (YouTube/Vimeo/externo, con miniatura y transcripción), markdown con preview, quiz, tarea con rúbrica, SCORM y sesión en vivo.
- **Certificación automática en PDF** — Al llegar al 100%, se genera el certificado (con id verificable, estudiante, curso, instructor, institución y fecha) y se descarga como PDF en formato carta horizontal (html2canvas + jsPDF).
- **Panel del instructor por cohorte** — El mismo curso puede tener varios grupos; cada uno con sus propias estadísticas, calificación de entregas, lista de quienes no entregaron, reseñas y resultados de encuesta. Con **gráfico de radar** que compara las notas del estudiante contra el promedio de su grupo.
- **Importación y exportación en Excel** — Carga masiva de usuarios y estudiantes desde `.xlsx` (acepta encabezados en español), y exportación del reporte de notas del curso a Excel y por estudiante a PDF.
- **Backend reactivo no bloqueante** — Spring WebFlux con R2DBC de punta a punta: mayor concurrencia con menos recursos de servidor, que es exactamente lo que necesita un SaaS con picos en temporada de matrículas.
- **Arquitectura hexagonal estricta y verificada** — Con exigencia de cobertura del 100% en la capa de negocio. El código está preparado para cambiar de base de datos o de framework sin tocar la lógica de dominio.

---

## DIAPOSITIVA 27 — Proceso y resultados

*(La narrativa de los tres avances corresponde a las fases que quedaron registradas en los propios esquemas de base de datos del proyecto.)*

### Resultados del 1er avance — Fundación: arquitectura, identidad y multi-tenancy

- Definición de la arquitectura general: **monorepo con backend de microservicios y frontend Angular multi-librería**.
- **`ms-auth`** operativo (puerto 8081): registro, login con emisión de JWT, desactivación lógica de usuarios, consulta por institución. Value objects validados (`Email`, `Password`, `UserRole`) y BCrypt.
- **`ms-admin`** operativo (puerto 8082): CRUD de instituciones con metadata y **CRUD de branding** — el cimiento del white-labeling.
- Módulo **`shared`** con la cadena de filtros de seguridad: cabeceras HTTP, *rate limiting* con Redis y validación de JWT.
- Infraestructura: PostgreSQL 16 con base por servicio, Redis 7, Nginx con TLS y Docker Compose.
- Frontend: *design system* propio (`variables.scss` + BEM), librería `shared` con los primeros componentes, login de dos paneles, sesión persistente y guards por rol.
- **Entregable:** un usuario puede autenticarse y un super administrador puede crear una institución con su identidad visual propia.

### Resultados del 2º avance — Dominio académico y autoría de contenido

- **`ms-education`** (puerto 8083) con el modelo académico en cascada: `courses` → `modules` → `lessons` → `contents`, más la entidad `students` con ocho value objects validados.
- **Editor de cursos completo** en el frontend: árbol de currículo navegable, panel de edición, cálculo automático de duraciones, publicar/archivar.
- **Modal de bloques de contenido** con los seis tipos, incluyendo el editor markdown con preview en vivo.
- Módulo **`admin`** del frontend: dashboard de la institución, vista de Personas (usuarios + grupos), **importación masiva de usuarios desde Excel** y panel de branding con preview en vivo.
- **Entregable:** un administrador o instructor puede construir un curso completo con contenido real, y cargar sus usuarios desde una hoja de cálculo.

### Resultados del 3er avance — Evaluación, experiencia del estudiante y seguimiento

- Backend: `quizzes` y `questions` con **calificación automática** (`score`, `passed`, aciertos/total), `learning_paths` con cursos ordenados, y `enrollments` con **matriculación masiva** y actualización de avance 0–100.
- **Reproductor de curso (course player)** — la pieza más elaborada: sidebar de avance, render por tipo de bloque, progresión bloqueada, quizzes con feedback por pregunta y control de intentos, entrega de tareas, guard que impide salir a mitad de un quiz, cálculo de progreso y **certificado descargable en PDF**.
- Zona del estudiante completa: inicio personalizado, catálogo unificado de cursos y rutas con filtros, "Mi aprendizaje" con certificaciones y tareas pendientes, vista previa pública y **encuesta de satisfacción** habilitada solo al 100%.
- Módulo **`instructor`**: cursos por cohorte con cinco pestañas (resumen, estudiantes, entregas, reseñas, encuesta), panel de calificación con retroalimentación, gráfico de radar comparativo, estadísticas globales y **exportación de reportes a Excel y PDF**.
- **Entregable:** el ciclo académico completo de punta a punta, desde la creación del curso hasta la certificación del estudiante y el reporte de notas del instructor.

### Resultado final del PMV

> **GEMS LMS Core es un LMS multi-tenant funcionalmente completo y demostrable de extremo a extremo.**
>
> **683 archivos y ~58.900 líneas de código.** Backend: 3 microservicios, 229 clases de producción, 43 endpoints REST reactivos, 35 casos de uso, 13 entidades de dominio, 11 tablas y 67 clases de prueba con 7.568 líneas de test. Frontend: 113 componentes Angular en 5 librerías, 26 casos de uso, 22 rutas protegidas por rol, ~8.500 líneas de plantillas y ~16.900 de estilos.
>
> Los cuatro roles —super administrador, administrador, instructor y estudiante— tienen su recorrido completo navegable, con datos semilla realistas: 11 cursos con currículo real (videos, markdown extenso, quizzes con explicaciones, tareas con rúbrica), 5 rutas de aprendizaje, 5 instituciones, 3 grupos, 10 estudiantes con avances distintos y encuestas con respuestas.
>
> El backend está desplegable con Docker Compose y Nginx con TLS sobre tres subdominios productivos.

### ¿Qué falta para llegar a la fase de comercialización?

Sé honesto y ordénalo como un plan, no como una lista de fallas. Esto es lo que realmente falta:

**1. Integrar frontend y backend (el pendiente crítico).** Hoy el frontend opera sobre datos simulados en memoria: todos los servicios de datos tienen un flag `USE_MOCK = true`. Falta apagar esos flags, implementar las llamadas HTTP reales, agregar un interceptor que inyecte el JWT y alinear los puertos del `environment.ts` con los de los microservicios. *Estimación: 3–4 semanas.*

**2. Cerrar la brecha del modelo de datos.** El frontend ya maneja un modelo mucho más rico que el esquema SQL. Faltan tablas y endpoints para: intentos de quiz, entregas y calificación de tareas, rúbricas, grupos/cohortes, encuestas y respuestas, reseñas, certificados y progreso granular por bloque. Hoy la base cubre cerca del 40% de lo que el frontend sabe manejar. *Estimación: 4–6 semanas.*

**3. Implementar autorización por rol en el backend.** La autenticación existe (JWT válido, `X-User-Role` inyectado), pero la autorización granular hoy es solo del frontend: el `SecurityConfig` de cada microservicio está en `permitAll()`. Es un requisito de seguridad no negociable antes de manejar datos de menores de edad. *Estimación: 1–2 semanas.*

**4. Subida real de archivos.** Hoy solo se guardan URLs. Falta integrar almacenamiento en la nube (S3 o equivalente) para logos, miniaturas y entregas de tareas. *Estimación: 2 semanas.*

**5. Notificaciones reales.** El centro de notificaciones funciona solo en memoria en el navegador. Falta el servicio de correo transaccional (SendGrid, ya contemplado en el plan de proveedores). *Estimación: 2 semanas.*

**6. Pruebas del frontend.** Karma y Jasmine están configurados pero no hay pruebas escritas. *Estimación: 3 semanas.*

**7. Los tres módulos del roadmap comercial** — Connect (portal de acudientes, que además exige crear el rol de padre de familia), Analytics (la analítica predictiva) y Pay (la pasarela de recaudo). *Estimación: 2 a 3 trimestres.*

**8. Trámites legales previos a la venta**, ya presupuestados en el estudio técnico: constitución de GEMAS S.A.S. ante Cámara de Comercio, registro del código fuente ante la DNDA, registro marcario ante la SIC y política de tratamiento de datos conforme a la Ley 1581 de 2012.

---

## DIAPOSITIVA 28 — Matriz DOFA del Producto Mínimo Viable

### Fortalezas del PMV

- **Arquitectura hexagonal estricta con DDD** en backend y frontend, con reglas de arquitectura documentadas y aplicadas de forma consistente en las 8 unidades del monorepo.
- **Alta calidad verificada en el backend**: 40% del código Java es prueba, con exigencia de cobertura del 100% en la capa de negocio.
- **Stack de última generación**: Java 24, Spring Boot 3.4.5 reactivo, Angular 22 con signals y zoneless change detection, TypeScript 6.
- **Multi-tenancy con white-labeling en runtime**, funcionando y demostrable.
- **UI muy trabajada, no wireframes**: ~16.900 líneas de SCSS y un design system propio de 27 componentes reutilizables, con dark mode por defecto, accesibilidad (ARIA, teclado, contraste 4.5:1) y diseño responsive documentado.
- **Recorrido completo de los cuatro roles**, con datos semilla realistas que cubren casos límite.
- **Backend reactivo no bloqueante**: mayor concurrencia con menos infraestructura, clave para la estructura de costos del modelo SaaS.
- **Listo para desplegar**: Docker Compose de producción, Nginx con TLS y renovación automática de certificados.

### Debilidades del PMV

- **Frontend y backend no están integrados**: el frontend corre 100% sobre datos simulados en memoria y los datos se pierden al recargar.
- **El esquema de base de datos cubre ~40% del modelo** que el frontend ya maneja.
- **Autorización por rol ausente en el backend** (`permitAll()` en los tres microservicios).
- **Cero pruebas en el frontend** pese a tener el runner configurado.
- **Los tres módulos que sustentan el 40% de los ingresos proyectados —Connect, Analytics y Pay— no están desarrollados**, y el rol de padre de familia no existe en el sistema.
- **El componente innovador declarado (inteligencia artificial) no está implementado**: no hay ninguna dependencia ni servicio de IA en el proyecto.
- **Sin almacenamiento de archivos ni correo transaccional**.
- **Desalineación de nomenclatura** entre backend (`TEACHER`) y frontend (`instructor`), y alias de importación inconsistentes.
- **Deuda técnica menor**: el módulo `api-gateway` quedó huérfano (sin código fuente, excluido del build) y Swagger falta en `ms-education`, el microservicio más grande.
- **Riesgo de seguridad**: el archivo `.env` con credenciales y el `JWT_SECRET` quedó versionado en el repositorio. *Hay que rotar esas credenciales y sacar el archivo del control de versiones antes de cualquier despliegue real.*
- **Dependencia de un solo desarrollador**: hoy todo el conocimiento técnico está concentrado en una persona.

### Oportunidades de mejora del PMV

- **Integración frontend–backend**: es el paso de mayor impacto y el más cercano; el trabajo pesado de ambos lados ya está hecho.
- **Ampliar `ms-education`** con las tablas y endpoints faltantes para cerrar la brecha del modelo.
- **Convertir el panel del instructor en el verdadero GEMS Analytics**: ya existen las estadísticas por cohorte y el radar comparativo; el siguiente paso natural es el modelo de alerta temprana de deserción sobre esos mismos datos.
- **Crear el rol de acudiente** reutilizando el sistema de roles y guards ya construido: es la vía más corta hacia GEMS Connect y hacia el diferenciador comercial más fuerte del plan.
- **Aprovechar SCORM y sesión en vivo**, que ya están modelados y son seleccionables pero no tienen runtime — dos funcionalidades vendibles a bajo costo incremental.
- **Programa piloto con colegios reales** del Valle de Aburrá para validar la propuesta y conseguir casos de éxito.
- **Certificación en ciberseguridad y habeas data** como argumento de venta diferenciador frente a los competidores gratuitos.
- **Exportar el modelo a otros segmentos**: la arquitectura multi-tenant sirve igual para academias, centros de ETDH y capacitación corporativa.

### Amenazas del PMV

- **Competidores gratuitos y muy arraigados**: Google Classroom (gratuito, aceptación alta) y Moodle (código abierto, comunidad global masiva).
- **Competidores consolidados en el segmento premium**: Phidias y Schoology ya tienen la relación comercial con los colegios de estrato alto y músculo de soporte.
- **Ciclo de venta institucional largo**: las decisiones dependen de comités directivos y presupuestos anuales; se puede perder un año escolar completo.
- **Riesgo regulatorio alto**: manejar datos de menores de edad bajo la Ley 1581 de 2012 y la Ley 1273 de 2009. Un incidente de seguridad sería difícil de sobrevivir para una empresa nueva.
- **Costos de nube en dólares** frente a ingresos en pesos: la devaluación afecta directamente el margen.
- **Barrera de adopción docente**: la resistencia del cuerpo profesoral al cambio de herramienta puede hundir una implementación técnicamente correcta.
- **Velocidad del mercado EdTech**: si los competidores incorporan analítica con IA antes, se pierde el diferenciador prometido.
- **Deuda técnica acumulada**: si la integración se posterga, el frontend seguirá creciendo sobre datos simulados y la brecha con el backend se volverá más costosa de cerrar.

---

## DIAPOSITIVA 29 — Funcionalidad del PMV

Esta diapositiva es para material adicional. **Aquí es donde ganas la sustentación**: el proyecto es fuerte y hay que mostrarlo, no describirlo.

**Qué recomiendo poner:**

1. **Enlace al repositorio** del proyecto.
2. **Video de demostración de 3 a 5 minutos** (o demo en vivo, si el ambiente aguanta) con este recorrido:
   - Login → **super administrador** crea una institución con logo y colores propios → se muestra cómo **cambia toda la interfaz en tiempo real** *(este es el momento más fuerte de la demo)*
   - **Administrador** importa usuarios desde un `.xlsx`, crea un grupo y lo matricula completo en un curso
   - **Instructor** crea un curso: agrega módulo, lección, un video, un documento markdown y un quiz con explicaciones
   - **Estudiante** entra al player: se ve la **progresión bloqueada**, resuelve el quiz, recibe la calificación automática con feedback por pregunta, entrega una tarea
   - **Instructor** califica la entrega con retroalimentación y muestra el **radar comparativo** del estudiante contra el promedio del grupo
   - **Estudiante** completa el curso al 100% → **descarga su certificado en PDF**
   - **Instructor** exporta el reporte de notas del curso a Excel
3. **Diagrama de arquitectura** — ya está en el repositorio (`gems-lms-api/docs/architecture_diagram.svg`). Úsalo.
4. **Capturas clave** por si el video no corre: dashboard con branding aplicado, editor de cursos con el árbol de currículo, player con un bloque bloqueado, certificado generado, panel del instructor con el radar.
5. **Una tabla de métricas** que respalde el volumen del trabajo:

| Métrica | Valor |
|---|---|
| Archivos de código | 683 |
| Líneas de código | ~58.900 |
| Microservicios | 3 |
| Endpoints REST | 43 |
| Componentes Angular | 113 |
| Casos de uso | 61 (35 backend + 26 frontend) |
| Clases de prueba backend | 67 (7.568 líneas) |
| Tablas de base de datos | 11 |
| Roles con recorrido completo | 4 |

**Cierre sugerido para decir en voz alta:**
> El plan de negocio proyecta cuatro productos. Hoy tengo el primero construido y funcionando: GEMS LMS Core, con el recorrido completo de los cuatro roles, arquitectura multi-tenant y calidad verificada en el backend. Los otros tres —Connect, Analytics y Pay— son el roadmap de los próximos tres trimestres, y la arquitectura ya está preparada para recibirlos sin reescribir el núcleo. Lo que traigo no es una idea: es un producto que se puede desplegar y demostrar hoy.

---

## DIAPOSITIVA 30 — Cierre
La plantilla la trae vacía. Pon el agradecimiento, el logo de GEMS LMS y tus datos de contacto (correo y celular: 3012508805).

---

# ✅ CHECKLIST ANTES DE PRESENTAR

- [ ] **Decidir con qué Excel sustentas.** Recomendación: la versión `(6)` — es la única con VPN positivo y TIR por encima del costo de capital.
- [ ] **Reescribir el párrafo de análisis financiero (5.8.1)**, que quedó con las cifras de la versión no viable. Texto nuevo en la diapositiva 24.
- [ ] **Unificar el nombre.** "GE MAS LMS" y "Gemas LMS" → **GEMS LMS** en todas partes.
- [ ] **Borrar las cifras de ejemplo de la plantilla** en la diapositiva 22 ($57.630, $13.552, márgenes 30/20/14/58%).
- [ ] **Cambiar los cargos de mano de obra directa**: "operario tornero" y "operario mecánico" son los ejemplos de manufactura de la plantilla del SENA. En un proyecto de software eso salta a la vista.
- [ ] **Dejar "Semovientes y cultivos" en $0 / No aplica.** Sin textos de relleno.
- [ ] **Decidir cómo presentas Analytics y Pay**: o los costeas en el Excel, o los presentas como roadmap y no como línea de ingreso del año 1. Lo que no puedes es dejarlos en $0 y a la vez cobrarlos.
- [ ] **Preparar la respuesta sobre la IA.** Te la van a preguntar porque está en el componente innovador. Respuesta honesta: *"la analítica predictiva es la fase 3 del roadmap; el diferenciador que ya tengo construido y puedo demostrar es la arquitectura multi-tenant con white-labeling en tiempo real"*.
- [ ] **Rotar el `JWT_SECRET` y las credenciales** del archivo `.env` que quedó versionado, y sacarlo del control de versiones.
- [ ] **Grabar el video de demo** antes de la sustentación. No dependas de que el ambiente levante en vivo.
- [ ] Verificar que las cifras que quedan en las diapositivas 15, 16, 19, 20, 22, 23 y 24 vengan **todas del mismo Excel**. Mezclar versiones es el error más fácil de cometer y el más fácil de detectar.
