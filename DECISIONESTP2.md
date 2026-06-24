
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

### Decisión 2 - Corrección ISSUE N 1 (Modificación TP1)

Esta implementación surge a partir de la devolución recibida sobre el TP1 y busca mejorar el encapsulamiento 
y la distribución de responsabilidades del modelo de objetos.

### Decisión 2 - Encapsular la validación de autoría dentro de Paper

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


