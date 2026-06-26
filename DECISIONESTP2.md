
# Documento de decisiones - ComfyChair TP2

## Contexto

El sistema ComfyChair modela conferencias científicas, sesiones, artículos, revisores, bids, revisiones y selección de trabajos aceptados.

## Decisiones de diseño

### Decisión 1 - Aplicar Strategy para políticas de aceptación de papers

Esta implementación cubre el requerimiento 2.2 – Políticas de aceptación del TP2.

Se incorporó nuevas formas de seleccionar los artículos aceptados de una sesión. 
Además de la política original basada en porcentaje, el sistema soporta nuevas 
políticas configurables sin afectar el resto del modelo.

Se decidió aplicar el patrón Strategy para desacoplar el algoritmo de aceptación 
de papers de la clase Session.

Para ello se incorporó la clase abstracta AcceptancePolicy, responsable de definir el protocolo 
común para todas las políticas de aceptación. A partir de esta abstracción se implementaron 
las estrategias concretas:

AcceptanceByPercentage, que preserva el comportamiento original del TP1 basado en un porcentaje de aceptación.
AcceptanceByCount, que permite aceptar una cantidad fija de artículos ordenados por score.
AcceptanceByScoreThreshold, que permite aceptar todos los artículos cuyo score promedio supere un valor mínimo configurable.

La clase Session deja de conocer los detalles de cada algoritmo de selección y delega la decisión 
a la política configurada mediante una referencia a AcceptancePolicy.

De esta manera, nuevas estrategias de aceptación pueden incorporarse mediante nuevas clases 
concretas sin necesidad de modificar Session, cumpliendo con el objetivo de extensibilidad planteado en el TP2.

Esta decisión mejora la mantenibilidad del sistema, reduce el acoplamiento y elimina la necesidad de incorporar
lógica condicional para seleccionar distintas políticas de aceptación.

### Decisión 2 - Corrección ISSUE N 1 (Modificación TP1) Encapsular la validación de autoría dentro de Paper

Esta implementación surge a partir de la devolución recibida sobre el TP1 y busca mejorar el encapsulamiento 
y la distribución de responsabilidades del modelo de objetos.

Durante la revisión del TP1 se detectó que la clase Session accedía directamente 
al atributo '_authors' de Paper para determinar si un reviewer era autor de un artículo.

Se decidió incorporar el método 'isAuthor(user)' dentro de la clase Paper 
para encapsular esta validación y evitar que otras clases dependan 
de la estructura interna del objeto.

A partir de este cambio, Session delega la consulta al propio Paper
 en lugar de inspeccionar directamente la colección de autores.

Esta modificación mejora el encapsulamiento del modelo, reduce 
el acoplamiento entre clases y distribuye las responsabilidades de manera más 
consistente con los principios de diseño orientado a objetos vistos durante la cursada.

### Decisión 3 - Aplicar State para modelar el flujo de una sesión

Esta implementación cubre el requerimiento 2.1 – Flujo de sesiones del TP2.

El sistema ya contemplaba las distintas etapas del proceso de una conferencia 
(Receiving, Bidding, Reviewing y Selection). En este marco,en este marco la clase 
`Session` era la responsable de decidir qué operaciones estaban habilitadas
 en cada momento del ciclo de vida de la sesión.

Se decidió aplicar el patrón "State" para representar cada etapa como un objeto independiente,
delegando en dicho estado la decisión de qué operaciones pueden ejecutarse y cuáles deben rechazarse.

Para ello se incorporó la clase abstracta `SessionState`, responsable de definir el comportamiento 
común de todos los estados. A partir de esta abstracción se implementaron los estados concretos:
`ReceivingState` (responsable de habilitar el envío de papers y el cierre del período de recepción.)
`BiddingState` (responsable de habilitar el registro de bids y la asignación de reviewers.)
`ReviewingState` (responsable de habilitar la carga de revisiones por parte de los reviewers asignados.)
`SelectionState`(incorporado para representar la etapa de selección de trabajos aceptados y permitir 
 futuras extensiones del flujo de la sesión.)

Se decidió que la lógica de negocio permanezca centralizada en la clase `Session`, ya que es la clase que 
conoce los papers, reviewers, bids, asignaciones y políticas de aceptación. 
Los objetos State únicamente determinan si una operación está permitida según la etapa actual 
y delegan su ejecución a `Session`.

De esta manera se logra separar la responsabilidad de controlar el flujo de una sesión de la lógica 
propia del dominio, reduciendo el acoplamiento y facilitando la incorporación de nuevas etapas 
o modificaciones del proceso sin afectar significativamente el resto del sistema.

Durante la migración al patrón State se mantuvo el atributo `_stage` para preservar la compatibilidad con la implementación original del TP1. Actualmente el comportamiento de la sesión ya se encuentra delegado a los distintos estados, por lo que dicho atributo podría eliminarse en un refactoring posterior sin modificar el comportamiento del sistema.



