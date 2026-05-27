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

Con esta implementación se logra:
- Consultar fácilmente los reviewers asignados a cada paper.
- Mantener centralizada la lógica de asignación dentro de Session.
- Facilitar la validación posterior de reviewers habilitados para realizar revisiones.

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



## Ambigüedades

Pendiente completar durante el desarrollo.

## Estrategia de testing

Se utilizarán tests unitarios con Jest siguiendo el estilo provisto por el proyecto base.