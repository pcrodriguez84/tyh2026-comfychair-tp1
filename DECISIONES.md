# Documento de decisiones - ComfyChair TP1

## Contexto

El sistema ComfyChair modela conferencias científicas, sesiones, artículos, revisores, bids, revisiones y selección de trabajos aceptados.

## Decisiones de diseño

### Decisión 1 - Mantener la lógica principal en Session

Se implementará la asignación de revisores, carga de revisiones y selección de artículos dentro de la clase Session, 
porque es la clase que ya representa el flujo de una sesión: recepción, bidding, revisión y selección. En este marco
entendemos que:

- Session ya conoce los artículos enviados.
- Session ya conoce los bids.
- Session representa el ciclo de vida del proceso.
- Se evita crear clases nuevas innecesarias para el alcance del TP.

### Decisión 2 - Representar asignaciones como pares paper-reviewer
Esta implementación cubre parte del punto **4.1 – Asignación de revisores** del TP, específicamente:
Asignación de exactamente tres reviewers por paper Y consulta de reviewers asignados a un artículo

Se implementó el test de asignación de reviewers en `Session.test.js`, verificando que cada paper 
tenga exactamente tres reviewers asignados luego del proceso de asignación.

Para soportar este comportamiento, se agregaron en la clase `Session` el atributo `_assignments` y 
los métodos `assignReviewers()` y `reviewersFor()`.

Se decidió representar las asignaciones de revisión como una colección de pares compuestos por paper y 
reviewer dentro de la clase `Session`.

Con esta implementación se logra consultar fácilmente los reviewers asignados a cada paper,
mantener centralizada la lógica de asignación dentro de Session, facilitar la validación posterior 
de reviewers habilitados para realizar revisiones.

### Decisión 3 - Delegar almacenamiento de reviews a Paper

Esta implementación cubre parte del **punto 4.2 – Carga de revisiones del TP**, específicamente:
validación de reviewer asignado, registro de revisiones y cálculo del score promedio del paper
en función de las reviws cargas.

Se implementó el test /*TEST should allow assigned reviewers to submit reviews*/
de carga de revisiones en Session.test.js, verificando que un reviewer 
asignado pueda cargar correctamente una review sobre un paper previamente asignado.

Para soportar este comportamiento, se agregó el método submitReview() en la clase Session, 
delegando el almacenamiento de las revisiones al objeto Paper.

Se decidió mantener las reviews dentro de Paper, ya que forman parte del estado propio del 
artículo y son necesarias para calcular su score promedio.

Session solamente controla el flujo y las restricciones del proceso de revisión: decide cuándo 
se puede revisar, quién puede revisar y qué reviewers están asignados. Paper es el responsable 
de almacenar las revisiones y calcular el score del artículo.

/*TEST  should not allow unassigned reviewers to submit reviews*/
También se agregó una validación para impedir que reviewers no asignados puedan cargar 
revisiones sobre un paper.  (caso límite)

/*TEST should not allow more than three reviews per paper*/
También se validó el límite máximo de tres revisiones por paper, reutilizando la restricción 
ya definida dentro de la clase Paper.

### Decisión 4 -  Priorizar reviewers según bids de interés
Esta implementación cubre parte del punto **4.1 – Asignación de revisores** del TP, específicamente:
- Priorización de reviewers según interés expresado en los bids
- Asignación de reviewers interesados antes que el resto de los revisores disponibles.

Se implementó el test de prioridad de bids en `Session.test.js`, verificando que los reviewers que marcaron
 `Interested` sean priorizados durante el proceso de asignación de revisores.

Para soportar este comportamiento, se modificó el método `assignReviewers()` en la clase `Session`, 
incorporando una lógica básica de priorización basada en los bids registrados para cada paper.


### Decisión 5 - Excluir autores del proceso de revisión

Esta implementación cubre parte opcional del punto **4.1 – Asignación de revisores** del TP, específicamente:
Validación de conflictos de interés entre autores y reviewers.

Se implementó el test de conflicto de interés en `Session.test.js`, verificando que un autor no pueda ser 
asignado como reviewer de su propio paper.

Para soportar este comportamiento, se modificó el método `assignReviewers()` en la clase `Session`, 
excluyendo del proceso de asignación a los autores del artículo evaluado.
Esta implementación evita que un autor evalúe su propio trabajo, mantiene coherencia con el dominio académico modelado y
mejora la calidad del proceso de revisión.

### Decisión 6 - Seleccionar papers según score promedio
Esta implementación cubre parte del punto **4.3 – Selección de artículos** del TP, específicamente:
Ordenamiento de papers según score, selección de mejores artículos y límite porcentual de aceptación.

Se implementó el test de selección de artículos en `Session.test.js`, verificando que los papers con mejor 
score promedio sean priorizados durante el proceso de aceptación.

Para soportar este comportamiento, se agregó el método `selectAcceptedPapers()` en la clase `Session`, 
ordenando los artículos según su score promedio y limitando la cantidad de aceptados según el 
porcentaje configurado.
Esta implementación permite modelar un proceso básico de aceptación académica, mantiene la lógica de 
selección centralizada dentro de Session y reutiliza el cálculo de score ya definido en la clase Paper.

## Observaciones 

Durante la implementación se identificaron algunas cuestiones no completamente especificadas en el enunciado,
por lo tanto se observó que no se detalla cómo resolver empates entre artículos con igual score promedio durante 
el proceso de selección, no se especifica una estrategia obligatoria para distribuir la carga de revisiones
entre reviewers cuando existen múltiples candidatos válidos. Asimismo, la gestión de conflictos de interés 
entre autores y reviewers aparece como una mejora opcional, por lo que se decidió implementar una validación 
básica que impida que un autor revise su propio trabajo.

Ante estas situaciones se optó por soluciones simples, priorizando la claridad del modelo y el cumplimiento 
de los requisitos principales del TP.

## Estrategia de testing

Se utilizó Jest como framework de testing unitario, siguiendo el enfoque presentado durante la cursada. Asimismo,
los tests fueron desarrollados de forma incremental, implementando primero los casos principales de negocio y
luego incorporando validaciones y casos límite.

Entre los escenarios verificados se incluyen: Asignación de reviewers a artículos, priorización de reviewers según bids de interés,
validación de conflictos de interés, registro de revisiones, restricción de reviewers no asignados, límite máximo de revisiones por paper y
selección de artículos según score.

La ejecución de la suite de pruebas dio como resultado un **total de 31 tests exitosos y una cobertura global del 94,91%**.

## Uso de Git

El desarrollo se realizó utilizando Git y GitHub para registrar la evolución del proyecto, realizandose commits incrementales asociados a cada funcionalidad implementada, permitiendo mantener trazabilidad entre las decisiones de diseño, los tests desarrollados y 
los cambios realizados sobre el código fuente.

## Uso de IA Generativa

La IA generativa fue utilizada como herramienta de apoyo durante el desarrollo para analizar alternativas de implementación, comprender conceptos de testing y validar decisiones de diseño. Todas las funcionalidades implementadas fueron revisadas, adaptadas e integradas manualmente dentro de la arquitectura propuesta por el proyecto base.

## Conclusiones

Se logró implementar el flujo principal del sistema ComfyChair, cubriendo los procesos de asignación de reviewers, carga de revisiones y selección de artículos. Asimismo, las decisiones de diseño adoptadas se ralizron en el marco de mantener la simplicidad del modelo, respetar las responsabilidades de cada clase y reutilizar la estructura provista por el proyecto base.

El resultado obtenido presenta una cobertura superior al mínimo solicitado y una suite de pruebas que valida tanto los escenarios principales del sistema como distintas restricciones del dominio, incluyendo reviewers no asignados, límite máximo de revisiones, conflictos de interés y priorización mediante bids.