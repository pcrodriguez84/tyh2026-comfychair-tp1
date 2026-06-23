commit 1, mejorar redacción.

Se aplicó el patrón Strategy para desacoplar el algoritmo de aceptación de papers de la clase Session. La política original basada en porcentaje fue encapsulada en AcceptanceByPercentage para mantener compatibilidad con TP1 y permitir incorporar nuevas políticas sin modificar Session.