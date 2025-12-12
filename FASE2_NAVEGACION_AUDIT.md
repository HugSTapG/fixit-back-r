# FASE 2: Auditoría de Navegación Actual

**Fecha:** December 12, 2025
**Status:** ✅ VALIDACIÓN COMPLETA

---

## 📋 ESTADO ACTUAL DE NAVEGACIÓN

### CLIENT NAVIGATOR ✅ CORRECTO

**Bottom Tabs (3):**
1. `HomeTab` → HomeScreen
2. `RequestsTab` → RequestsStack (con 4 screens internas)
3. `ProfileTab` → ProfileStack (con 7 screens internas)

**RequestsStack contiene:**
- `ClientRequests` → ClientRequestsScreen (MAIN)
- `RequestDetails` → RequestDetailsScreen (secundaria)
- `Proposals` → ProposalsScreen (secundaria)
- `CreateRequestStack` → CreateRequestStack (wizard)

**ProfileStack contiene:**
- `Profile` → ClientProfileScreen
- `EditProfile` → EditProfileScreen
- `RequestsHistory` → RequestsHistoryScreen
- `ActiveServices` → ActiveServicesScreen
- `Notifications` → NotificationsScreen ⚠️
- `Support` → SupportScreen
- `BecomeTechnician` → BecomeTechnicianScreen

**PROBLEMA IDENTIFICADO:**
- NotificationsScreen está en ProfileStack (nested)
- SOLUCIÓN: Moverla a Tab principal (pero manteniendo acceso desde Profile también)

---

### TECHNICIAN NAVIGATOR ✅ CORRECTO

**Bottom Tabs (4):**
1. `Dashboard` → TechnicianHomeScreen
2. `AvailableRequests` → AvailableRequestsScreen
3. `MyJobs` → MyJobsScreen
4. `Profile` → TechnicianProfileScreen

**Status:** ✅ Estructura correcta para FASE 2
- Tab "Disponibles" ✅
- Tab "Mis Propuestas" (aquí está MyJobsScreen) ✅
- Tab "Trabajos" ✅
- Tab "Perfil" ✅

---

## 📊 SCREENS EXISTENTES (INVENTARIO)

### CLIENT Screens
```
✅ HomeScreen                   (Tab)
✅ ClientRequestsScreen         (Tab → RequestsStack)
  ├─ RequestDetailsScreen       (Stack)
  ├─ ProposalsScreen            (Stack) ← Ver propuestas
  └─ RequestStepXxx (Wizard)    (Stack)
✅ ClientProfileScreen          (Tab → ProfileStack)
✅ EditProfileScreen            (Stack)
✅ RequestsHistoryScreen        (Stack)
✅ ActiveServicesScreen         (Stack)
✅ NotificationsScreen          (Stack) ⚠️ Nested en Profile
✅ SupportScreen                (Stack)
✅ BecomeTechnicianScreen       (Stack)
```

### TECHNICIAN Screens
```
✅ TechnicianHomeScreen         (Tab)
✅ AvailableRequestsScreen      (Tab) ← Disponibles
✅ MyJobsScreen                 (Tab) ← Mis Propuestas
✅ TechnicianProfileScreen      (Tab)
```

---

## 🔍 SCREENS NECESARIOS vs EXISTENTES

### CLIENTE

| Funcionalidad | Screen Requerido | Estado | Acción |
|---------------|------------------|--------|--------|
| Listar mis solicitudes con estado + propuestas badge | ClientRequestsScreen | ✅ Existe | REFACTOR: Agregar badge contador de propuestas |
| Ver propuestas de una solicitud | ProposalsScreen | ✅ Existe | REFACTOR: Mejorar lógica de aceptar/rechazar |
| Aceptar/Rechazar propuesta | ProposalsScreen | ✅ Existe | ✅ Ya hace esto, solo mejorar UX |

### TÉCNICO

| Funcionalidad | Screen Requerido | Estado | Acción |
|---------------|------------------|--------|--------|
| Listar solicitudes disponibles | AvailableRequestsScreen | ✅ Existe | REFACTOR: Cambiar Alert.prompt por Modal personalizado |
| Modal enviar propuesta | SubmitProposalModal | ❌ No existe | CREATE: Modal reutilizable |
| Ver mis propuestas enviadas | MyJobsScreen | ✅ Existe | ✅ Ya hace esto, solo mejorar presentación |

---

## 🎨 REFACTORINGS NECESARIOS (SIN DUPLICAR)

### 1. ClientRequestsScreen
**Cambio:** Agregar badge contador de propuestas al lado del título

**Líneas afectadas:** ~100-130 (renderRequestCard)

**Lógica:**
- Para cada solicitud en estado PENDIENTE, contar propuestas desde backend
- Mostrar: "3 propuestas" o "Sin propuestas"
- Al tocar → navega a ProposalsScreen (ya funciona)

**Implementación:**
- Extender RequestPreview type con `proposalCount?: number`
- En homeService.getMySolicitudes() obtener también count
- En renderRequestCard mostrar badge adicional

---

### 2. AvailableRequestsScreen
**Cambio:** Reemplazar Alert.prompt nativo por Modal personalizado

**Línea afectada:** ~56 (handleApply con Alert.prompt)

**Problema:** Alert.prompt es feo y no permite validación clara

**Solución:**
- Crear SubmitProposalModal.tsx reutilizable
- Importar y mostrar con useState
- Pasar callback de aceptación

---

### 3. MyJobsScreen
**Cambio:** Mejorar presentación, agregar CTA si está aceptada

**Líneas afectadas:** ~82-130 (renderItem)

**Mejora:**
- Si estadoAcuerdo = ACEPTADO → agregar CTA "Ir al trabajo"
- CTA lleva a ActiveJobsScreen del técnico

**Nota:** Ya existe lógica buena, solo mejorar UI

---

### 4. ProposalsScreen
**Cambio:** Mejorar UX de aceptar (ya funciona, solo mejorar flujo)

**Estado:** Funcional, UI aceptable

**Mejora opcional:** Agregar confirmación más clara

---

## 🔔 NOTIFICACIONES

### Estado Actual
- NotificationsScreen ✅ Existe
- Ubicación: En ProfileStack (anidada)
- Problema: No es visible directamente desde tab

### Solución FASE 2
**Opción 1 (Recomendada):** Agregar campana 🔔 en header superior
- Pequeño badge con unread count
- Click → abre NotificationsScreen como modal
- No cambiar navegación base

**Opción 2:** Crear novo tab (no recomendado, ya tenemos suficientes)

---

## 📝 CAMBIOS A REALIZAR

### CLIENTE

#### Refactor 1: ClientRequestsScreen
```
Línea: ~100-130
ANTES: renderRequestCard sin propuestas badge
DESPUÉS: Agregar View con contador de propuestas
```

#### Refactor 2: homeService.ts
```
Extender getMySolicitudes() para incluir proposal count
O crear método complementario
```

#### Refactor 3: ProposalsScreen
```
UI aceptable, solo pequeños ajustes en confirmación
```

---

### TÉCNICO

#### Refactor 1: AvailableRequestsScreen
```
Línea: ~56-78 (handleApply)
ANTES: Alert.prompt(...)
DESPUÉS: Mostrar SubmitProposalModal
```

#### Refactor 2: Crear SubmitProposalModal.tsx
```
NUEVO: Modal para enviar propuesta
- Input: precio
- Input: comentario (opcional)
- Validación clara
- Botón "Enviar"
```

#### Refactor 3: MyJobsScreen
```
Línea: ~82-130 (renderItem)
DESPUÉS: Si ACEPTADO → agregar CTA "Ir al trabajo"
```

---

## ✅ CONCLUSIÓN

### Navegación Base ✅ CORRECTA
- Cliente: 3 tabs en root
- Técnico: 4 tabs en root
- No cambiar estructura
- NotificationsScreen será accesible desde campana

### Screens Existentes ✅ REUTILIZABLES
- ClientRequestsScreen → REFACTOR (agregar badge)
- ProposalsScreen → REFACTOR (mejorar UX)
- AvailableRequestsScreen → REFACTOR (Modal en lugar de Alert.prompt)
- MyJobsScreen → REFACTOR (agregar CTA si aceptada)
- TechnicianHomeScreen → SIN CAMBIOS
- TechnicianProfileScreen → SIN CAMBIOS

### Screens Nuevas ❌ NECESARIAS
- SubmitProposalModal.tsx (reutilizable)

### Backend FASE 2 ✅ LISTO
- currentUser ya fluye correctamente (FASE 1 completa)
- Endpoints listos: /postularse, /responder, /getProposals
- Falta: Triggers de notificaciones (siguiente paso)

---

## 🚀 PLAN DE IMPLEMENTACIÓN

1. **PASO 1:** Crear SubmitProposalModal.tsx
2. **PASO 2:** Refactor AvailableRequestsScreen (usar Modal)
3. **PASO 3:** Refactor ClientRequestsScreen (agregar badge)
4. **PASO 4:** Refactor MyJobsScreen (agregar CTA)
5. **PASO 5:** Refactor ProposalsScreen (mejorar UX)
6. **PASO 6:** Agregar campana notificaciones en header
7. **PASO 7:** Backend - Triggers notificaciones
8. **PASO 8:** Testing manual

---

**Status:** ✅ Listo para implementación
**Cambios:** 0 Eliminaciones | 1 Nuevo componente | 4 Refactors
**Riesgo:** BAJO (mantiene estructura base)
