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

## Ambigüedades

Pendiente completar durante el desarrollo.

## Estrategia de testing

Se utilizarán tests unitarios con Jest siguiendo el estilo provisto por el proyecto base.