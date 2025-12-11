# 📡 REFERENCIA TÉCNICA: ENDPOINTS Y VALIDACIONES

**Documento complementario del análisis de flujos y roles**

---

## 1️⃣ ENDPOINTS DE SOLICITUDES

### GET /request/solicitudes
**Obtiene todas las solicitudes**

```typescript
@Get('solicitudes')
@Public()  // ⚠️ SIN PROTECCIÓN DE ROL
findAllSolicitudes(@Query() filterDto: any): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `GET /request/solicitudes` |
| **Autenticación** | ❌ NO REQUERIDA (@Public) |
| **Roles Permitidos** | TODOS (incluso no autenticados) |
| **Parámetros Query** | `filterDto` (estado?, categoria?, ubicacion?) |
| **Respuesta** | Array de Solicitud |
| **Validaciones** | ⚠️ NINGUNA en servidor |

**Filtrado en Cliente:**
```typescript
// technician.service.ts - getAvailableRequests()
return allRequests.filter(
  req => req.estadoSolicitud === EstadoSolicitud.PENDIENTE
);
```

**🚨 PROBLEMAS:**
- Backend no filtra por estado
- No hay límite de registros
- Acepta usuarios no autenticados
- Exposición de todos los costos estimados

**Solución recomendada:**
```typescript
@Get('solicitudes')
@Public()  // O cambiar a @UseGuards(JwtAuthGuard)
@Query('estado') estado?: EstadoSolicitud = EstadoSolicitud.PENDIENTE
findAllSolicitudes(@Query() filterDto: any): Observable<any>
```

---

### GET /request/solicitudes/:id
**Obtiene una solicitud específica por ID**

```typescript
@Get('solicitudes/:id')
@UseGuards(JwtAuthGuard)  // ⚠️ Solo autenticación, sin validar propiedad
findOneSolicitud(@Param('id', ParseIntPipe) id: number): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `GET /request/solicitudes/:id` |
| **Autenticación** | ✅ REQUERIDA (JWT) |
| **Roles Permitidos** | TODOS (con JWT válido) |
| **Parámetros** | `id` (number, PK) |
| **Respuesta** | Solicitud completa |
| **Validaciones** | ✅ Existe? |

**Flujo:**
```typescript
RequestProxyService.findSolicitudById(id)
  └─ emit(REQUEST_PATTERNS.FIND_BY_ID, {id})
     └─ SolicitudesService.findOne(id)
        └─ DB: SELECT * FROM solicitud WHERE idSolicitud=id
```

**🚨 PROBLEMA:**
- No valida que usuario sea propietario o admin
- Cualquier usuario autenticado puede ver cualquier solicitud

**Solución recomendada:**
```typescript
async findOne(idSolicitud: number, currentUser?: {idUser: number; rol: string}) {
  const solicitud = await database.solicitud.findUnique({where: {idSolicitud}});
  
  if (!solicitud) throw new NotFoundException(...);
  
  // Validar propiedad si no es admin
  if (currentUser && currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
    throw new ForbiddenException('No tienes permisos para ver esta solicitud');
  }
  
  return solicitud;
}
```

---

### POST /request/solicitudes
**Crea una nueva solicitud**

```typescript
@Post('solicitudes')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN, RolUsuario.CLIENTE)
createSolicitud(
    @Body() createSolicitudDto: any,
    @Request() req: any
): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `POST /request/solicitudes` |
| **Autenticación** | ✅ REQUERIDA (JWT) |
| **Roles Permitidos** | ADMIN, CLIENTE |
| **Body Required** | CreateSolicitudDto |
| **Respuesta** | Solicitud creada |
| **Validaciones** | ✅ Roles, DTO estructura |

**DTO Schema:**
```typescript
class CreateSolicitudDto {
  @IsString() @IsNotEmpty()
  tituloProblema: string;
  
  @IsString() @IsNotEmpty()
  descripcionProblema: string;
  
  @IsNumber() @IsPositive()
  costoEstimado: number;
  
  @IsNumber() @IsPositive()
  duracionEstimadaMin: number;
  
  @IsArray()
  categoriasProblema?: string[];
}
```

**Flujo:**
```typescript
RequestProxyService.createSolicitud(createSolicitudDto, req.user.idUser)
  └─ emit(REQUEST_PATTERNS.CREATE_SOLICITUD, {createDto, idUser})
     └─ SolicitudesService.create(createDto, idUser)
        └─ DB: INSERT INTO solicitud {
             idUser: (del JWT),
             estadoSolicitud: 'PENDIENTE',
             ...resto del DTO
           }
           RETURNS: Nueva solicitud con idSolicitud
```

**Validaciones Implementadas:**
- ✅ JWT válido (JwtAuthGuard)
- ✅ Rol es ADMIN o CLIENTE (RolesGuard)
- ✅ DTO válido (class-validator)

**Validaciones Faltantes:**
- ⚠️ Usuario puede crear para sí mismo pero no para otros

---

### PUT /request/solicitudes/:id
**Actualiza una solicitud existente**

```typescript
@Put('solicitudes/:id')
@UseGuards(JwtAuthGuard)  // ⚠️ Solo autenticación
updateSolicitud(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSolicitudDto: any,
    @Request() req: any
): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `PUT /request/solicitudes/:id` |
| **Autenticación** | ✅ REQUERIDA (JWT) |
| **Roles Permitidos** | TODOS (con JWT) |
| **Parámetros** | `id` (PK) |
| **Body** | UpdateSolicitudDto (parcial) |
| **Respuesta** | Solicitud actualizada |
| **Validaciones** | ⚠️ Incompletas |

**Validación en Servicio:**
```typescript
async update(
  idSolicitud: number,
  updateSolicitudDto: UpdateSolicitudDto,
  currentUser: { idUser: number; rol: string }  // ⚠️ rol singular
) {
  const solicitud = await database.solicitud.findUnique({
    where: { idSolicitud }
  });

  if (!solicitud) {
    throw new NotFoundException(...);
  }

  // ⚠️ PROBLEMA: Solo valida propiedad, no estado
  if (currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
    throw new ForbiddenException('No tienes permisos...');
  }

  // Debería validar que solicitud está PENDIENTE
  if (solicitud.estadoSolicitud !== EstadoSolicitud.PENDIENTE) {
    throw new BadRequestException('Solo puedes actualizar solicitudes PENDIENTE');
  }

  return database.solicitud.update({
    where: { idSolicitud },
    data: updateSolicitudDto,
    // ...
  });
}
```

**🚨 PROBLEMAS:**
1. Solo autentica, no autoriza por rol explícito
2. No valida estado de solicitud (¿puede actualizar ACEPTADA?)
3. Usa `rol` singular cuando schema define `roles` array

**Solución recomendada:**
```typescript
@Put('solicitudes/:id')
@UseGuards(JwtAuthGuard, RolesGuard)  // Agregar RolesGuard
@Roles(RolUsuario.ADMIN, RolUsuario.CLIENTE)
updateSolicitud(...)
```

---

### PUT /request/solicitudes/:id/cancel
**Cancela una solicitud**

```typescript
@Put('solicitudes/:id/cancel')
@UseGuards(JwtAuthGuard)
@HttpCode(200)
cancelSolicitud(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `PUT /request/solicitudes/:id/cancel` |
| **Autenticación** | ✅ REQUERIDA (JWT) |
| **Roles Permitidos** | TODOS (con JWT) |
| **Parámetros** | `id` (PK) |
| **Body** | (vacío) |
| **HTTP Code** | 200 (OK) |
| **Respuesta** | Solicitud cancelada |

**Validación en Servicio:**
```typescript
async cancel(
  idSolicitud: number,
  currentUser: { idUser: number; rol: string }
) {
  const solicitud = await database.solicitud.findUnique({
    where: { idSolicitud }
  });

  if (currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
    throw new ForbiddenException(...);
  }

  // Validar que está PENDIENTE
  if (solicitud.estadoSolicitud !== EstadoSolicitud.PENDIENTE) {
    throw new BadRequestException('Solo puedes cancelar solicitudes PENDIENTE');
  }

  return database.solicitud.update({
    where: { idSolicitud },
    data: {
      estadoSolicitud: EstadoSolicitud.CANCELADA,
      updatedBy: currentUser.idUser,
      updatedAt: new Date()
    }
  });
}
```

**✅ BIEN IMPLEMENTADO:**
- Valida propiedad
- Valida estado
- Registra quién canceló

---

### DELETE /request/solicitudes/:id
**Elimina una solicitud (hard delete)**

```typescript
@Delete('solicitudes/:id')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
removeSolicitud(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `DELETE /request/solicitudes/:id` |
| **Autenticación** | ✅ REQUERIDA (JWT) |
| **Roles Permitidos** | ADMIN only |
| **Parámetros** | `id` (PK) |
| **Body** | (vacío) |
| **HTTP Code** | 200 (OK) |
| **Respuesta** | Success message |

**✅ BIEN IMPLEMENTADO:**
- Solo ADMIN puede eliminar
- Guard de rol explícito

---

## 2️⃣ ENDPOINTS DE SOLICITUDES-TECNICOS (Propuestas)

### GET /solicitudes-tecnicos
**Obtiene todas las propuestas (solo ADMIN)**

```typescript
@Get('solicitudes-tecnicos')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.ADMIN)
findAllSolicitudesTecnicos(): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `GET /solicitudes-tecnicos` |
| **Autenticación** | ✅ REQUERIDA |
| **Roles Permitidos** | ADMIN |
| **Respuesta** | Array de SolicitudTecnico |

---

### GET /solicitudes-tecnicos/:id
**Obtiene una propuesta específica**

```typescript
@Get('solicitudes-tecnicos/:id')
@UseGuards(JwtAuthGuard)  // ⚠️ Sin validación de propiedad
findOneSolicitudTecnico(
    @Param('id', ParseIntPipe) id: number
): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `GET /solicitudes-tecnicos/:id` |
| **Autenticación** | ✅ REQUERIDA |
| **Roles Permitidos** | TODOS (con JWT) |
| **Respuesta** | Propuesta completa |

**🚨 PROBLEMA:**
- No valida que usuario sea técnico propietario, cliente propietario o admin
- Cualquier usuario autenticado puede ver cualquier propuesta

---

### GET /solicitudes-tecnicos/solicitud/:idSolicitud
**Obtiene propuestas de una solicitud específica**

```typescript
@Get('solicitudes-tecnicos/solicitud/:idSolicitud')
@UseGuards(JwtAuthGuard)  // ⚠️ Sin validación de propiedad
findSolicitudesTecnicosBySolicitud(
    @Param('idSolicitud', ParseIntPipe) idSolicitud: number
): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `GET /solicitudes-tecnicos/solicitud/:idSolicitud` |
| **Autenticación** | ✅ REQUERIDA |
| **Roles Permitidos** | TODOS (con JWT) |
| **Respuesta** | Array de propuestas para solicitud |

**🚨 CRÍTICA - FALLO DE SEGURIDAD:**
- No valida que usuario es cliente propietario
- Cliente B puede ver costos de técnicos para solicitud de Cliente A
- Exposición de datos sensibles

**Código Vulnerable:**
```typescript
// SolicitudesTecnicosService.findBySolicitud()
async findBySolicitud(idSolicitud: number) {
  const solicitud = await this.database.solicitud.findUnique({
    where: { idSolicitud, isActive: true }
  });

  if (!solicitud) {
    throw new NotFoundException(...);
  }

  // ❌ NO VALIDA PROPIEDAD
  return this.database.solicitudTecnico.findMany({
    where: { idSolicitud },
    orderBy: { fechaPropuesta: 'desc' }
  });
}
```

**Solución:**
```typescript
async findBySolicitud(
  idSolicitud: number,
  currentUser: {idUser: number; rol: string}
) {
  const solicitud = await this.database.solicitud.findUnique({
    where: { idSolicitud, isActive: true }
  });

  if (!solicitud) {
    throw new NotFoundException(...);
  }

  // ✅ Validar propiedad
  if (currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
    throw new ForbiddenException('No tienes permisos para ver estas propuestas');
  }

  return this.database.solicitudTecnico.findMany({
    where: { idSolicitud },
    orderBy: { fechaPropuesta: 'desc' }
  });
}
```

---

### GET /solicitudes-tecnicos/my/propuestas
**Obtiene propuestas del técnico actual**

```typescript
@Get('solicitudes-tecnicos/my/propuestas')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.TECNICO)
findMyProposals(@Request() req: any): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `GET /solicitudes-tecnicos/my/propuestas` |
| **Autenticación** | ✅ REQUERIDA |
| **Roles Permitidos** | TECNICO |
| **Respuesta** | Array de propuestas del técnico |

**✅ BIEN IMPLEMENTADO:**
```typescript
// RequestController.findMyProposals()
return this.technicianProxyService.findTechnicianByUserId(req.user.idUser).pipe(
  switchMap(technicianResponse => {
    if (!technicianResponse.success || !technicianResponse.data) {
      return throwError(() => new BadRequestException(...));
    }
    return this.requestProxyService.findSolicitudesByTecnico(
      technicianResponse.data.idTecnico  // ← Usa idTecnico del usuario
    );
  })
);
```

- Verifica que usuario tiene perfil de técnico
- Solo obtiene propuestas del técnico actual
- Rol protegido explícitamente

---

### GET /solicitudes-tecnicos/my/stats
**Obtiene estadísticas del técnico actual**

```typescript
@Get('solicitudes-tecnicos/my/stats')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.TECNICO)
getMyTechnicianStats(@Request() req: any): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `GET /solicitudes-tecnicos/my/stats` |
| **Autenticación** | ✅ REQUERIDA |
| **Roles Permitidos** | TECNICO |
| **Respuesta** | Stats object |

**Respuesta esperada:**
```typescript
{
  total: number,           // Total propuestas
  propuestas: number,      // En estado PROPUESTO
  aceptadas: number,       // Aceptadas
  rechazadas: number,      // Rechazadas
  tasaAceptacion: number   // Porcentaje
}
```

**✅ BIEN IMPLEMENTADO:**
- Mismo patrón seguro que `/my/propuestas`

---

### POST /solicitudes-tecnicos/postularse
**Técnico se postula a una solicitud**

```typescript
@Post('solicitudes-tecnicos/postularse')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(RolUsuario.TECNICO)
postularse(
    @Body() createSolicitudTecnicoDto: CreateSolicitudTecnicoDto,
    @Request() req: any
): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `POST /solicitudes-tecnicos/postularse` |
| **Autenticación** | ✅ REQUERIDA |
| **Roles Permitidos** | TECNICO |
| **Body Required** | CreateSolicitudTecnicoDto |
| **Respuesta** | Propuesta creada |

**DTO Schema:**
```typescript
class CreateSolicitudTecnicoDto {
  @IsNumber() @IsNotEmpty()
  idSolicitud: number;
  
  @IsNumber() @IsPositive()
  @IsOptional()
  costoAcordado?: number;
  
  @IsString()
  @IsOptional()
  notas?: string;
}
```

**Validaciones Implementadas:**
```typescript
async postularse(
  createDto: CreateSolicitudTecnicoDto,
  idTecnico: number
) {
  const { idSolicitud } = createDto;

  // 1️⃣ Verificar solicitud existe
  const solicitud = await this.database.solicitud.findUnique({
    where: { idSolicitud, isActive: true }
  });

  if (!solicitud) {
    throw new NotFoundException(`Solicitud ${idSolicitud} no encontrada`);
  }

  // 2️⃣ Verificar solicitud está PENDIENTE
  if (solicitud.estadoSolicitud !== EstadoSolicitud.PENDIENTE) {
    throw new BadRequestException('Solo se puede postular a solicitudes PENDIENTE');
  }

  // 3️⃣ Verificar técnico no se ha postulado ya (índice UNIQUE)
  const postulacionExistente = await this.database.solicitudTecnico.findUnique({
    where: {
      idSolicitud_idTecnico: { idSolicitud, idTecnico }
    }
  });

  if (postulacionExistente) {
    throw new ConflictException('Ya te has postulado a esta solicitud');
  }

  // 4️⃣ Crear propuesta
  return this.database.solicitudTecnico.create({
    data: {
      idSolicitud,
      idTecnico,
      costoAcordado: createDto.costoAcordado,
      estadoAcuerdo: EstadoAceptacion.PROPUESTO,
      notas: createDto.notas
    },
    include: { solicitud: true }
  });
}
```

**✅ BIEN IMPLEMENTADO:**
- Valida rol (TECNICO)
- Valida estado solicitud (PENDIENTE)
- Previene duplicados (índice unique)
- Usa transacciones

---

### POST /solicitudes-tecnicos/:id/responder
**Cliente responde a una propuesta**

```typescript
@Post('solicitudes-tecnicos/:id/responder')
@UseGuards(JwtAuthGuard)  // ⚠️ Sin @Roles
responderSolicitudTecnico(
    @Param('id', ParseIntPipe) id: number,
    @Body() respuestaDto: ResponderSolicitudDto,
    @Request() req: any
): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `POST /solicitudes-tecnicos/:id/responder` |
| **Autenticación** | ✅ REQUERIDA |
| **Roles Permitidos** | TODOS (con JWT) - ⚠️ Validación en servicio |
| **Body Required** | ResponderSolicitudDto |
| **Respuesta** | Propuesta actualizada + Solicitud |

**DTO Schema:**
```typescript
class ResponderSolicitudDto {
  @IsEnum(EstadoAceptacion)
  estadoAcuerdo: EstadoAceptacion;  // ACEPTADO o RECHAZADO
  
  @IsNumber()
  @IsOptional()
  costoAcordado?: number;
  
  @IsString()
  @IsOptional()
  notas?: string;
}
```

**Validaciones Implementadas:**
```typescript
async responder(
  idSolTec: number,
  respuestaDto: ResponderSolicitudDto,
  currentUser: { idUser: number; rol: string }  // ⚠️ rol SINGULAR
) {
  const propuesta = await this.findOne(idSolTec);

  // 1️⃣ Validar permisos (PROBLEMA: rol singular)
  if (currentUser.rol !== 'ADMIN' && propuesta.solicitud.idUser !== currentUser.idUser) {
    throw new ForbiddenException('No tienes permisos...');
  }

  // 2️⃣ Validar estado propuesta
  if (propuesta.estadoAcuerdo !== EstadoAceptacion.PROPUESTO) {
    throw new BadRequestException('Solo se puede responder a propuestas PROPUESTO');
  }

  // ⚠️ PROBLEMA: NO VALIDA que solicitud no sea CANCELADA

  // 3️⃣ Transacción atómica
  return this.database.$transaction(async (prisma) => {
    // Actualizar propuesta
    const updated = await prisma.solicitudTecnico.update({
      where: { idSolTec },
      data: {
        estadoAcuerdo: respuestaDto.estadoAcuerdo,
        fechaConfirmada: new Date(),
        costoAcordado: respuestaDto.costoAcordado,
        notas: respuestaDto.notas
      },
      include: { solicitud: true }
    });

    // Si ACEPTADO, actualizar solicitud
    if (respuestaDto.estadoAcuerdo === EstadoAceptacion.ACEPTADO) {
      await prisma.solicitud.update({
        where: { idSolicitud: propuesta.idSolicitud },
        data: {
          estadoSolicitud: EstadoSolicitud.ACEPTADA,
          updatedBy: currentUser.idUser
        }
      });

      // Rechazar otras propuestas
      await prisma.solicitudTecnico.updateMany({
        where: {
          idSolicitud: propuesta.idSolicitud,
          idSolTec: { not: idSolTec },
          estadoAcuerdo: EstadoAceptacion.PROPUESTO
        },
        data: {
          estadoAcuerdo: EstadoAceptacion.RECHAZADO,
          fechaConfirmada: new Date()
        }
      });
    }

    return updated;
  });
}
```

**🚨 PROBLEMAS:**
1. No tiene `@Roles` explícito (validación solo en servicio)
2. Usa `rol` singular cuando schema define `roles` array
3. No valida si solicitud es CANCELADA
4. No previene responder después de aceptar otra propuesta

**Soluciones Recomendadas:**
```typescript
// Agregar validación de estado solicitud
if (propuesta.solicitud.estadoSolicitud !== EstadoSolicitud.PENDIENTE) {
  throw new BadRequestException(
    `No puedes responder a solicitudes en estado ${propuesta.solicitud.estadoSolicitud}`
  );
}

// Cambiar rol singular a array
const userRoles = currentUser.roles || (currentUser.rol ? [currentUser.rol] : []);
if (!userRoles.includes('ADMIN') && propuesta.solicitud.idUser !== currentUser.idUser) {
  throw new ForbiddenException(...);
}
```

---

### DELETE /solicitudes-tecnicos/:id
**Técnico cancela su propuesta**

```typescript
@Delete('solicitudes-tecnicos/:id')
@UseGuards(JwtAuthGuard)
deleteSolicitudTecnico(
    @Param('id', ParseIntPipe) id: number,
    @Request() req: any
): Observable<any>
```

| Propiedad | Valor |
|-----------|-------|
| **Ruta** | `DELETE /solicitudes-tecnicos/:id` |
| **Autenticación** | ✅ REQUERIDA |
| **Roles Permitidos** | TECNICO (validado en servicio) |
| **Parámetros** | `id` (idSolTec) |
| **Respuesta** | Success message |

**Validación en Servicio:**
```typescript
async cancelar(idSolTec: number, idTecnico: number) {
  const propuesta = await this.findOne(idSolTec);

  // Verificar propiedad
  if (propuesta.idTecnico !== idTecnico) {
    throw new ForbiddenException('No tienes permisos para cancelar esta propuesta');
  }

  // Verificar estado
  if (propuesta.estadoAcuerdo !== EstadoAceptacion.PROPUESTO) {
    throw new BadRequestException('Solo se pueden cancelar propuestas en estado PROPUESTO');
  }

  return this.database.solicitudTecnico.delete({
    where: { idSolTec }
  });
}
```

**✅ BIEN IMPLEMENTADO:**
- Valida propiedad
- Valida estado
- Hard delete (apropiado para cancelaciones)

---

## 3️⃣ MATRIZ DE VALIDACIONES POR ENDPOINT

| Endpoint | Auth | Rol | Propiedad | Estado | Duplicado | Transacción |
|----------|------|-----|-----------|--------|-----------|-------------|
| `GET /solicitudes` | ❌ | ❌ | ❌ | ❌ | N/A | N/A |
| `GET /solicitudes/:id` | ✅ | ❌ | ❌ | ❌ | N/A | N/A |
| `POST /solicitudes` | ✅ | ✅ | N/A | ✅ | N/A | N/A |
| `PUT /solicitudes/:id` | ✅ | ⚠️ | ✅ | ⚠️ | N/A | N/A |
| `PUT /solicitudes/:id/cancel` | ✅ | ⚠️ | ✅ | ✅ | N/A | N/A |
| `DELETE /solicitudes/:id` | ✅ | ✅ | N/A | ❌ | N/A | N/A |
| `GET /solicitudes-tecnicos` | ✅ | ✅ | N/A | N/A | N/A | N/A |
| `GET /solicitudes-tecnicos/:id` | ✅ | ❌ | ❌ | N/A | N/A | N/A |
| `GET /solicitudes-tecnicos/solicitud/:id` | ✅ | ❌ | ❌ | N/A | N/A | N/A |
| `GET /solicitudes-tecnicos/my/propuestas` | ✅ | ✅ | ✅ | N/A | N/A | N/A |
| `GET /solicitudes-tecnicos/my/stats` | ✅ | ✅ | ✅ | N/A | N/A | N/A |
| `POST /solicitudes-tecnicos/postularse` | ✅ | ✅ | N/A | ✅ | ✅ | N/A |
| `POST /solicitudes-tecnicos/:id/responder` | ✅ | ⚠️ | ✅ | ✅ | N/A | ✅ |
| `DELETE /solicitudes-tecnicos/:id` | ✅ | ⚠️ | ✅ | ✅ | N/A | N/A |

**Leyenda:**
- ✅ = Implementado correctamente
- ⚠️ = Incompleto o inconsistente
- ❌ = Faltante o no implementado
- N/A = No aplica para este endpoint

---

## 4️⃣ GUÍA DE CORRECCIONES PRIORITARIAS

### CRÍTICA - Hacer ahora

**C1: Validar propiedad en `GET /solicitudes-tecnicos/solicitud/:id`**
```typescript
// ANTES (línea ~165 en SolicitudesTecnicosService)
async findBySolicitud(idSolicitud: number) {
  const solicitud = await this.database.solicitud.findUnique({...});
  if (!solicitud) throw new NotFoundException(...);
  return this.database.solicitudTecnico.findMany({...});  // ❌ Sin validar propiedad
}

// DESPUÉS
async findBySolicitud(
  idSolicitud: number,
  currentUser: {idUser: number; rol: string}
) {
  const solicitud = await this.database.solicitud.findUnique({...});
  if (!solicitud) throw new NotFoundException(...);
  
  // ✅ Validar que es cliente propietario
  if (currentUser.rol !== 'ADMIN' && solicitud.idUser !== currentUser.idUser) {
    throw new ForbiddenException('No puedes ver las propuestas de este cliente');
  }
  
  return this.database.solicitudTecnico.findMany({...});
}
```

**C2: Proteger `GET /request/solicitudes`**
```typescript
// ANTES
@Get('solicitudes')
@Public()
findAllSolicitudes(@Query() filterDto: any): Observable<any>

// DESPUÉS
@Get('solicitudes')
@UseGuards(JwtAuthGuard)  // Agregar autenticación
@Query('estado', new DefaultValuePipe(EstadoSolicitud.PENDIENTE))
estado?: EstadoSolicitud
findAllSolicitudes(
  @Query() filterDto: any,
  @Query('estado') estado: EstadoSolicitud
): Observable<any>
```

**C3: Validar estado solicitud en responder propuesta**
```typescript
// ANTES
async responder(idSolTec: number, respuestaDto: ResponderSolicitudDto, ...) {
  const propuesta = await this.findOne(idSolTec);
  if (propuesta.estadoAcuerdo !== EstadoAceptacion.PROPUESTO) {
    throw new BadRequestException(...);
  }
  // ❌ No valida estado de solicitud
}

// DESPUÉS
async responder(idSolTec: number, respuestaDto: ResponderSolicitudDto, ...) {
  const propuesta = await this.findOne(idSolTec);
  
  if (propuesta.estadoAcuerdo !== EstadoAceptacion.PROPUESTO) {
    throw new BadRequestException(...);
  }
  
  // ✅ Validar estado solicitud
  if (propuesta.solicitud.estadoSolicitud !== EstadoSolicitud.PENDIENTE) {
    throw new BadRequestException(
      `No puedes responder a solicitudes en estado ${propuesta.solicitud.estadoSolicitud}`
    );
  }
  
  // ... transacción ...
}
```

### MAYOR - Hacer pronto

**M1: Unificar roles array vs singular**
- Buscar todos los usos de `currentUser.rol` (singular)
- Cambiar a `currentUser.roles` (array)
- Actualizar guards para consistencia

**M2: Mover filtrado de estado al backend**
- Cambiar `GET /request/solicitudes` para retornar solo PENDIENTE
- O crear endpoint específico `GET /request/solicitudes/disponibles`

**M3: Agregar @Roles explícito a endpoints**
- `POST /solicitudes-tecnicos/:id/responder` → `@Roles(ADMIN, CLIENTE)`
- `DELETE /solicitudes-tecnicos/:id` → `@Roles(TECNICO)`

---

## 5️⃣ ÍNDICES DE BASE DE DATOS

**Solicitud tabla:**
```sql
PRIMARY KEY (idSolicitud)
INDEX (idUser) -- Buscar solicitudes por cliente
INDEX (estadoSolicitud) -- Filtrar por estado
UNIQUE (idUser, createdAt) -- Opcional: prevenir spam
```

**SolicitudTecnico tabla:**
```sql
PRIMARY KEY (idSolTec)
UNIQUE (idSolicitud, idTecnico) -- Prevenir duplicados: un técnico solo 1 propuesta por solicitud
INDEX (idTecnico) -- Buscar propuestas de un técnico
INDEX (idSolicitud) -- Buscar propuestas de una solicitud
INDEX (estadoAcuerdo) -- Filtrar por estado
COMPOSITE INDEX (idSolicitud, estadoAcuerdo) -- Consultas comunes
```

---

## 📌 CONCLUSIÓN

**Endpoints Críticos a Parchear:**
1. `GET /solicitudes-tecnicos/solicitud/:id` - Agregar validación propiedad
2. `GET /request/solicitudes` - Agregar autenticación y filtro estado
3. `POST /solicitudes-tecnicos/:id/responder` - Agregar validación estado solicitud

**Endpoints Menores a Mejorar:**
4. Unificar uso de roles (array vs singular) en todos los servicios
5. Agregar @Roles explícito donde falta
6. Mover filtrado de estado al backend

**Impacto de Cambios:**
- Críticas: Previenen exposición de datos privados
- Mayores: Mejoran consistencia y rendimiento
- Menores: Mejoran mantenibilidad y claridad

