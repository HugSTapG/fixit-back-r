
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Solicitud
 * 
 */
export type Solicitud = $Result.DefaultSelection<Prisma.$SolicitudPayload>
/**
 * Model SolicitudTecnico
 * 
 */
export type SolicitudTecnico = $Result.DefaultSelection<Prisma.$SolicitudTecnicoPayload>
/**
 * Model Calificacion
 * 
 */
export type Calificacion = $Result.DefaultSelection<Prisma.$CalificacionPayload>
/**
 * Model Transaccion
 * 
 */
export type Transaccion = $Result.DefaultSelection<Prisma.$TransaccionPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const EstadoSolicitud: {
  PENDIENTE: 'PENDIENTE',
  ACEPTADA: 'ACEPTADA',
  CANCELADA: 'CANCELADA',
  COMPLETADA: 'COMPLETADA'
};

export type EstadoSolicitud = (typeof EstadoSolicitud)[keyof typeof EstadoSolicitud]


export const EstadoAceptacion: {
  PROPUESTO: 'PROPUESTO',
  ACEPTADO: 'ACEPTADO',
  RECHAZADO: 'RECHAZADO'
};

export type EstadoAceptacion = (typeof EstadoAceptacion)[keyof typeof EstadoAceptacion]


export const PuntajeCalificacion: {
  EXCELENTE: 'EXCELENTE',
  BUENO: 'BUENO',
  REGULAR: 'REGULAR',
  MALO: 'MALO',
  TERRIBLE: 'TERRIBLE'
};

export type PuntajeCalificacion = (typeof PuntajeCalificacion)[keyof typeof PuntajeCalificacion]


export const MetodoPago: {
  EFECTIVO: 'EFECTIVO',
  TRANSFERENCIA: 'TRANSFERENCIA',
  TARJETA: 'TARJETA',
  OTRO: 'OTRO'
};

export type MetodoPago = (typeof MetodoPago)[keyof typeof MetodoPago]


export const EstadoPago: {
  PENDIENTE: 'PENDIENTE',
  PAGADO: 'PAGADO',
  FALLIDO: 'FALLIDO'
};

export type EstadoPago = (typeof EstadoPago)[keyof typeof EstadoPago]

}

export type EstadoSolicitud = $Enums.EstadoSolicitud

export const EstadoSolicitud: typeof $Enums.EstadoSolicitud

export type EstadoAceptacion = $Enums.EstadoAceptacion

export const EstadoAceptacion: typeof $Enums.EstadoAceptacion

export type PuntajeCalificacion = $Enums.PuntajeCalificacion

export const PuntajeCalificacion: typeof $Enums.PuntajeCalificacion

export type MetodoPago = $Enums.MetodoPago

export const MetodoPago: typeof $Enums.MetodoPago

export type EstadoPago = $Enums.EstadoPago

export const EstadoPago: typeof $Enums.EstadoPago

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Solicituds
 * const solicituds = await prisma.solicitud.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Solicituds
   * const solicituds = await prisma.solicitud.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.solicitud`: Exposes CRUD operations for the **Solicitud** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Solicituds
    * const solicituds = await prisma.solicitud.findMany()
    * ```
    */
  get solicitud(): Prisma.SolicitudDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.solicitudTecnico`: Exposes CRUD operations for the **SolicitudTecnico** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SolicitudTecnicos
    * const solicitudTecnicos = await prisma.solicitudTecnico.findMany()
    * ```
    */
  get solicitudTecnico(): Prisma.SolicitudTecnicoDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.calificacion`: Exposes CRUD operations for the **Calificacion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Calificacions
    * const calificacions = await prisma.calificacion.findMany()
    * ```
    */
  get calificacion(): Prisma.CalificacionDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.transaccion`: Exposes CRUD operations for the **Transaccion** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Transaccions
    * const transaccions = await prisma.transaccion.findMany()
    * ```
    */
  get transaccion(): Prisma.TransaccionDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Solicitud: 'Solicitud',
    SolicitudTecnico: 'SolicitudTecnico',
    Calificacion: 'Calificacion',
    Transaccion: 'Transaccion'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "solicitud" | "solicitudTecnico" | "calificacion" | "transaccion"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Solicitud: {
        payload: Prisma.$SolicitudPayload<ExtArgs>
        fields: Prisma.SolicitudFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SolicitudFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SolicitudFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload>
          }
          findFirst: {
            args: Prisma.SolicitudFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SolicitudFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload>
          }
          findMany: {
            args: Prisma.SolicitudFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload>[]
          }
          create: {
            args: Prisma.SolicitudCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload>
          }
          createMany: {
            args: Prisma.SolicitudCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SolicitudCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload>[]
          }
          delete: {
            args: Prisma.SolicitudDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload>
          }
          update: {
            args: Prisma.SolicitudUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload>
          }
          deleteMany: {
            args: Prisma.SolicitudDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SolicitudUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SolicitudUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload>[]
          }
          upsert: {
            args: Prisma.SolicitudUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudPayload>
          }
          aggregate: {
            args: Prisma.SolicitudAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSolicitud>
          }
          groupBy: {
            args: Prisma.SolicitudGroupByArgs<ExtArgs>
            result: $Utils.Optional<SolicitudGroupByOutputType>[]
          }
          count: {
            args: Prisma.SolicitudCountArgs<ExtArgs>
            result: $Utils.Optional<SolicitudCountAggregateOutputType> | number
          }
        }
      }
      SolicitudTecnico: {
        payload: Prisma.$SolicitudTecnicoPayload<ExtArgs>
        fields: Prisma.SolicitudTecnicoFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SolicitudTecnicoFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SolicitudTecnicoFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload>
          }
          findFirst: {
            args: Prisma.SolicitudTecnicoFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SolicitudTecnicoFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload>
          }
          findMany: {
            args: Prisma.SolicitudTecnicoFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload>[]
          }
          create: {
            args: Prisma.SolicitudTecnicoCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload>
          }
          createMany: {
            args: Prisma.SolicitudTecnicoCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.SolicitudTecnicoCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload>[]
          }
          delete: {
            args: Prisma.SolicitudTecnicoDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload>
          }
          update: {
            args: Prisma.SolicitudTecnicoUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload>
          }
          deleteMany: {
            args: Prisma.SolicitudTecnicoDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SolicitudTecnicoUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.SolicitudTecnicoUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload>[]
          }
          upsert: {
            args: Prisma.SolicitudTecnicoUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SolicitudTecnicoPayload>
          }
          aggregate: {
            args: Prisma.SolicitudTecnicoAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSolicitudTecnico>
          }
          groupBy: {
            args: Prisma.SolicitudTecnicoGroupByArgs<ExtArgs>
            result: $Utils.Optional<SolicitudTecnicoGroupByOutputType>[]
          }
          count: {
            args: Prisma.SolicitudTecnicoCountArgs<ExtArgs>
            result: $Utils.Optional<SolicitudTecnicoCountAggregateOutputType> | number
          }
        }
      }
      Calificacion: {
        payload: Prisma.$CalificacionPayload<ExtArgs>
        fields: Prisma.CalificacionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.CalificacionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.CalificacionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>
          }
          findFirst: {
            args: Prisma.CalificacionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.CalificacionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>
          }
          findMany: {
            args: Prisma.CalificacionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>[]
          }
          create: {
            args: Prisma.CalificacionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>
          }
          createMany: {
            args: Prisma.CalificacionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.CalificacionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>[]
          }
          delete: {
            args: Prisma.CalificacionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>
          }
          update: {
            args: Prisma.CalificacionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>
          }
          deleteMany: {
            args: Prisma.CalificacionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.CalificacionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.CalificacionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>[]
          }
          upsert: {
            args: Prisma.CalificacionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$CalificacionPayload>
          }
          aggregate: {
            args: Prisma.CalificacionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateCalificacion>
          }
          groupBy: {
            args: Prisma.CalificacionGroupByArgs<ExtArgs>
            result: $Utils.Optional<CalificacionGroupByOutputType>[]
          }
          count: {
            args: Prisma.CalificacionCountArgs<ExtArgs>
            result: $Utils.Optional<CalificacionCountAggregateOutputType> | number
          }
        }
      }
      Transaccion: {
        payload: Prisma.$TransaccionPayload<ExtArgs>
        fields: Prisma.TransaccionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TransaccionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TransaccionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload>
          }
          findFirst: {
            args: Prisma.TransaccionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TransaccionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload>
          }
          findMany: {
            args: Prisma.TransaccionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload>[]
          }
          create: {
            args: Prisma.TransaccionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload>
          }
          createMany: {
            args: Prisma.TransaccionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.TransaccionCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload>[]
          }
          delete: {
            args: Prisma.TransaccionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload>
          }
          update: {
            args: Prisma.TransaccionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload>
          }
          deleteMany: {
            args: Prisma.TransaccionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TransaccionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.TransaccionUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload>[]
          }
          upsert: {
            args: Prisma.TransaccionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TransaccionPayload>
          }
          aggregate: {
            args: Prisma.TransaccionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTransaccion>
          }
          groupBy: {
            args: Prisma.TransaccionGroupByArgs<ExtArgs>
            result: $Utils.Optional<TransaccionGroupByOutputType>[]
          }
          count: {
            args: Prisma.TransaccionCountArgs<ExtArgs>
            result: $Utils.Optional<TransaccionCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    solicitud?: SolicitudOmit
    solicitudTecnico?: SolicitudTecnicoOmit
    calificacion?: CalificacionOmit
    transaccion?: TransaccionOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type SolicitudCountOutputType
   */

  export type SolicitudCountOutputType = {
    solicitudesTecnico: number
    calificaciones: number
    transacciones: number
  }

  export type SolicitudCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitudesTecnico?: boolean | SolicitudCountOutputTypeCountSolicitudesTecnicoArgs
    calificaciones?: boolean | SolicitudCountOutputTypeCountCalificacionesArgs
    transacciones?: boolean | SolicitudCountOutputTypeCountTransaccionesArgs
  }

  // Custom InputTypes
  /**
   * SolicitudCountOutputType without action
   */
  export type SolicitudCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudCountOutputType
     */
    select?: SolicitudCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SolicitudCountOutputType without action
   */
  export type SolicitudCountOutputTypeCountSolicitudesTecnicoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SolicitudTecnicoWhereInput
  }

  /**
   * SolicitudCountOutputType without action
   */
  export type SolicitudCountOutputTypeCountCalificacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CalificacionWhereInput
  }

  /**
   * SolicitudCountOutputType without action
   */
  export type SolicitudCountOutputTypeCountTransaccionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransaccionWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Solicitud
   */

  export type AggregateSolicitud = {
    _count: SolicitudCountAggregateOutputType | null
    _avg: SolicitudAvgAggregateOutputType | null
    _sum: SolicitudSumAggregateOutputType | null
    _min: SolicitudMinAggregateOutputType | null
    _max: SolicitudMaxAggregateOutputType | null
  }

  export type SolicitudAvgAggregateOutputType = {
    idSolicitud: number | null
    idUser: number | null
    idTipoServicio: number | null
    costoEstimado: Decimal | null
    costoPromocion: Decimal | null
    duracionEstimadaMin: number | null
    createdBy: number | null
    updatedBy: number | null
  }

  export type SolicitudSumAggregateOutputType = {
    idSolicitud: number | null
    idUser: number | null
    idTipoServicio: number | null
    costoEstimado: Decimal | null
    costoPromocion: Decimal | null
    duracionEstimadaMin: number | null
    createdBy: number | null
    updatedBy: number | null
  }

  export type SolicitudMinAggregateOutputType = {
    idSolicitud: number | null
    idUser: number | null
    idTipoServicio: number | null
    codigoParroquia: string | null
    tituloProblema: string | null
    descripcionProblema: string | null
    costoEstimado: Decimal | null
    costoPromocion: Decimal | null
    promocion: boolean | null
    estadoSolicitud: $Enums.EstadoSolicitud | null
    fechaProgramada: Date | null
    fechaPublicacion: Date | null
    fechaInicio: Date | null
    fechaFinalizacion: Date | null
    duracionEstimadaMin: number | null
    isActive: boolean | null
    deletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    createdBy: number | null
    updatedBy: number | null
  }

  export type SolicitudMaxAggregateOutputType = {
    idSolicitud: number | null
    idUser: number | null
    idTipoServicio: number | null
    codigoParroquia: string | null
    tituloProblema: string | null
    descripcionProblema: string | null
    costoEstimado: Decimal | null
    costoPromocion: Decimal | null
    promocion: boolean | null
    estadoSolicitud: $Enums.EstadoSolicitud | null
    fechaProgramada: Date | null
    fechaPublicacion: Date | null
    fechaInicio: Date | null
    fechaFinalizacion: Date | null
    duracionEstimadaMin: number | null
    isActive: boolean | null
    deletedAt: Date | null
    createdAt: Date | null
    updatedAt: Date | null
    createdBy: number | null
    updatedBy: number | null
  }

  export type SolicitudCountAggregateOutputType = {
    idSolicitud: number
    idUser: number
    idTipoServicio: number
    codigoParroquia: number
    tituloProblema: number
    descripcionProblema: number
    costoEstimado: number
    costoPromocion: number
    promocion: number
    estadoSolicitud: number
    fechaProgramada: number
    fechaPublicacion: number
    fechaInicio: number
    fechaFinalizacion: number
    duracionEstimadaMin: number
    isActive: number
    deletedAt: number
    createdAt: number
    updatedAt: number
    createdBy: number
    updatedBy: number
    _all: number
  }


  export type SolicitudAvgAggregateInputType = {
    idSolicitud?: true
    idUser?: true
    idTipoServicio?: true
    costoEstimado?: true
    costoPromocion?: true
    duracionEstimadaMin?: true
    createdBy?: true
    updatedBy?: true
  }

  export type SolicitudSumAggregateInputType = {
    idSolicitud?: true
    idUser?: true
    idTipoServicio?: true
    costoEstimado?: true
    costoPromocion?: true
    duracionEstimadaMin?: true
    createdBy?: true
    updatedBy?: true
  }

  export type SolicitudMinAggregateInputType = {
    idSolicitud?: true
    idUser?: true
    idTipoServicio?: true
    codigoParroquia?: true
    tituloProblema?: true
    descripcionProblema?: true
    costoEstimado?: true
    costoPromocion?: true
    promocion?: true
    estadoSolicitud?: true
    fechaProgramada?: true
    fechaPublicacion?: true
    fechaInicio?: true
    fechaFinalizacion?: true
    duracionEstimadaMin?: true
    isActive?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
    updatedBy?: true
  }

  export type SolicitudMaxAggregateInputType = {
    idSolicitud?: true
    idUser?: true
    idTipoServicio?: true
    codigoParroquia?: true
    tituloProblema?: true
    descripcionProblema?: true
    costoEstimado?: true
    costoPromocion?: true
    promocion?: true
    estadoSolicitud?: true
    fechaProgramada?: true
    fechaPublicacion?: true
    fechaInicio?: true
    fechaFinalizacion?: true
    duracionEstimadaMin?: true
    isActive?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
    updatedBy?: true
  }

  export type SolicitudCountAggregateInputType = {
    idSolicitud?: true
    idUser?: true
    idTipoServicio?: true
    codigoParroquia?: true
    tituloProblema?: true
    descripcionProblema?: true
    costoEstimado?: true
    costoPromocion?: true
    promocion?: true
    estadoSolicitud?: true
    fechaProgramada?: true
    fechaPublicacion?: true
    fechaInicio?: true
    fechaFinalizacion?: true
    duracionEstimadaMin?: true
    isActive?: true
    deletedAt?: true
    createdAt?: true
    updatedAt?: true
    createdBy?: true
    updatedBy?: true
    _all?: true
  }

  export type SolicitudAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Solicitud to aggregate.
     */
    where?: SolicitudWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Solicituds to fetch.
     */
    orderBy?: SolicitudOrderByWithRelationInput | SolicitudOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SolicitudWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Solicituds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Solicituds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Solicituds
    **/
    _count?: true | SolicitudCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SolicitudAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SolicitudSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SolicitudMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SolicitudMaxAggregateInputType
  }

  export type GetSolicitudAggregateType<T extends SolicitudAggregateArgs> = {
        [P in keyof T & keyof AggregateSolicitud]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSolicitud[P]>
      : GetScalarType<T[P], AggregateSolicitud[P]>
  }




  export type SolicitudGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SolicitudWhereInput
    orderBy?: SolicitudOrderByWithAggregationInput | SolicitudOrderByWithAggregationInput[]
    by: SolicitudScalarFieldEnum[] | SolicitudScalarFieldEnum
    having?: SolicitudScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SolicitudCountAggregateInputType | true
    _avg?: SolicitudAvgAggregateInputType
    _sum?: SolicitudSumAggregateInputType
    _min?: SolicitudMinAggregateInputType
    _max?: SolicitudMaxAggregateInputType
  }

  export type SolicitudGroupByOutputType = {
    idSolicitud: number
    idUser: number
    idTipoServicio: number
    codigoParroquia: string
    tituloProblema: string
    descripcionProblema: string
    costoEstimado: Decimal | null
    costoPromocion: Decimal | null
    promocion: boolean
    estadoSolicitud: $Enums.EstadoSolicitud
    fechaProgramada: Date | null
    fechaPublicacion: Date
    fechaInicio: Date | null
    fechaFinalizacion: Date | null
    duracionEstimadaMin: number | null
    isActive: boolean
    deletedAt: Date | null
    createdAt: Date
    updatedAt: Date
    createdBy: number | null
    updatedBy: number | null
    _count: SolicitudCountAggregateOutputType | null
    _avg: SolicitudAvgAggregateOutputType | null
    _sum: SolicitudSumAggregateOutputType | null
    _min: SolicitudMinAggregateOutputType | null
    _max: SolicitudMaxAggregateOutputType | null
  }

  type GetSolicitudGroupByPayload<T extends SolicitudGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SolicitudGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SolicitudGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SolicitudGroupByOutputType[P]>
            : GetScalarType<T[P], SolicitudGroupByOutputType[P]>
        }
      >
    >


  export type SolicitudSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idSolicitud?: boolean
    idUser?: boolean
    idTipoServicio?: boolean
    codigoParroquia?: boolean
    tituloProblema?: boolean
    descripcionProblema?: boolean
    costoEstimado?: boolean
    costoPromocion?: boolean
    promocion?: boolean
    estadoSolicitud?: boolean
    fechaProgramada?: boolean
    fechaPublicacion?: boolean
    fechaInicio?: boolean
    fechaFinalizacion?: boolean
    duracionEstimadaMin?: boolean
    isActive?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
    updatedBy?: boolean
    solicitudesTecnico?: boolean | Solicitud$solicitudesTecnicoArgs<ExtArgs>
    calificaciones?: boolean | Solicitud$calificacionesArgs<ExtArgs>
    transacciones?: boolean | Solicitud$transaccionesArgs<ExtArgs>
    _count?: boolean | SolicitudCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["solicitud"]>

  export type SolicitudSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idSolicitud?: boolean
    idUser?: boolean
    idTipoServicio?: boolean
    codigoParroquia?: boolean
    tituloProblema?: boolean
    descripcionProblema?: boolean
    costoEstimado?: boolean
    costoPromocion?: boolean
    promocion?: boolean
    estadoSolicitud?: boolean
    fechaProgramada?: boolean
    fechaPublicacion?: boolean
    fechaInicio?: boolean
    fechaFinalizacion?: boolean
    duracionEstimadaMin?: boolean
    isActive?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
    updatedBy?: boolean
  }, ExtArgs["result"]["solicitud"]>

  export type SolicitudSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idSolicitud?: boolean
    idUser?: boolean
    idTipoServicio?: boolean
    codigoParroquia?: boolean
    tituloProblema?: boolean
    descripcionProblema?: boolean
    costoEstimado?: boolean
    costoPromocion?: boolean
    promocion?: boolean
    estadoSolicitud?: boolean
    fechaProgramada?: boolean
    fechaPublicacion?: boolean
    fechaInicio?: boolean
    fechaFinalizacion?: boolean
    duracionEstimadaMin?: boolean
    isActive?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
    updatedBy?: boolean
  }, ExtArgs["result"]["solicitud"]>

  export type SolicitudSelectScalar = {
    idSolicitud?: boolean
    idUser?: boolean
    idTipoServicio?: boolean
    codigoParroquia?: boolean
    tituloProblema?: boolean
    descripcionProblema?: boolean
    costoEstimado?: boolean
    costoPromocion?: boolean
    promocion?: boolean
    estadoSolicitud?: boolean
    fechaProgramada?: boolean
    fechaPublicacion?: boolean
    fechaInicio?: boolean
    fechaFinalizacion?: boolean
    duracionEstimadaMin?: boolean
    isActive?: boolean
    deletedAt?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    createdBy?: boolean
    updatedBy?: boolean
  }

  export type SolicitudOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idSolicitud" | "idUser" | "idTipoServicio" | "codigoParroquia" | "tituloProblema" | "descripcionProblema" | "costoEstimado" | "costoPromocion" | "promocion" | "estadoSolicitud" | "fechaProgramada" | "fechaPublicacion" | "fechaInicio" | "fechaFinalizacion" | "duracionEstimadaMin" | "isActive" | "deletedAt" | "createdAt" | "updatedAt" | "createdBy" | "updatedBy", ExtArgs["result"]["solicitud"]>
  export type SolicitudInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitudesTecnico?: boolean | Solicitud$solicitudesTecnicoArgs<ExtArgs>
    calificaciones?: boolean | Solicitud$calificacionesArgs<ExtArgs>
    transacciones?: boolean | Solicitud$transaccionesArgs<ExtArgs>
    _count?: boolean | SolicitudCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type SolicitudIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type SolicitudIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $SolicitudPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Solicitud"
    objects: {
      solicitudesTecnico: Prisma.$SolicitudTecnicoPayload<ExtArgs>[]
      calificaciones: Prisma.$CalificacionPayload<ExtArgs>[]
      transacciones: Prisma.$TransaccionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      idSolicitud: number
      idUser: number
      idTipoServicio: number
      codigoParroquia: string
      tituloProblema: string
      descripcionProblema: string
      costoEstimado: Prisma.Decimal | null
      costoPromocion: Prisma.Decimal | null
      promocion: boolean
      estadoSolicitud: $Enums.EstadoSolicitud
      fechaProgramada: Date | null
      fechaPublicacion: Date
      fechaInicio: Date | null
      fechaFinalizacion: Date | null
      duracionEstimadaMin: number | null
      isActive: boolean
      deletedAt: Date | null
      createdAt: Date
      updatedAt: Date
      createdBy: number | null
      updatedBy: number | null
    }, ExtArgs["result"]["solicitud"]>
    composites: {}
  }

  type SolicitudGetPayload<S extends boolean | null | undefined | SolicitudDefaultArgs> = $Result.GetResult<Prisma.$SolicitudPayload, S>

  type SolicitudCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SolicitudFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SolicitudCountAggregateInputType | true
    }

  export interface SolicitudDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Solicitud'], meta: { name: 'Solicitud' } }
    /**
     * Find zero or one Solicitud that matches the filter.
     * @param {SolicitudFindUniqueArgs} args - Arguments to find a Solicitud
     * @example
     * // Get one Solicitud
     * const solicitud = await prisma.solicitud.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SolicitudFindUniqueArgs>(args: SelectSubset<T, SolicitudFindUniqueArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Solicitud that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SolicitudFindUniqueOrThrowArgs} args - Arguments to find a Solicitud
     * @example
     * // Get one Solicitud
     * const solicitud = await prisma.solicitud.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SolicitudFindUniqueOrThrowArgs>(args: SelectSubset<T, SolicitudFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Solicitud that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudFindFirstArgs} args - Arguments to find a Solicitud
     * @example
     * // Get one Solicitud
     * const solicitud = await prisma.solicitud.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SolicitudFindFirstArgs>(args?: SelectSubset<T, SolicitudFindFirstArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Solicitud that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudFindFirstOrThrowArgs} args - Arguments to find a Solicitud
     * @example
     * // Get one Solicitud
     * const solicitud = await prisma.solicitud.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SolicitudFindFirstOrThrowArgs>(args?: SelectSubset<T, SolicitudFindFirstOrThrowArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Solicituds that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Solicituds
     * const solicituds = await prisma.solicitud.findMany()
     * 
     * // Get first 10 Solicituds
     * const solicituds = await prisma.solicitud.findMany({ take: 10 })
     * 
     * // Only select the `idSolicitud`
     * const solicitudWithIdSolicitudOnly = await prisma.solicitud.findMany({ select: { idSolicitud: true } })
     * 
     */
    findMany<T extends SolicitudFindManyArgs>(args?: SelectSubset<T, SolicitudFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Solicitud.
     * @param {SolicitudCreateArgs} args - Arguments to create a Solicitud.
     * @example
     * // Create one Solicitud
     * const Solicitud = await prisma.solicitud.create({
     *   data: {
     *     // ... data to create a Solicitud
     *   }
     * })
     * 
     */
    create<T extends SolicitudCreateArgs>(args: SelectSubset<T, SolicitudCreateArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Solicituds.
     * @param {SolicitudCreateManyArgs} args - Arguments to create many Solicituds.
     * @example
     * // Create many Solicituds
     * const solicitud = await prisma.solicitud.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SolicitudCreateManyArgs>(args?: SelectSubset<T, SolicitudCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Solicituds and returns the data saved in the database.
     * @param {SolicitudCreateManyAndReturnArgs} args - Arguments to create many Solicituds.
     * @example
     * // Create many Solicituds
     * const solicitud = await prisma.solicitud.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Solicituds and only return the `idSolicitud`
     * const solicitudWithIdSolicitudOnly = await prisma.solicitud.createManyAndReturn({
     *   select: { idSolicitud: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SolicitudCreateManyAndReturnArgs>(args?: SelectSubset<T, SolicitudCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Solicitud.
     * @param {SolicitudDeleteArgs} args - Arguments to delete one Solicitud.
     * @example
     * // Delete one Solicitud
     * const Solicitud = await prisma.solicitud.delete({
     *   where: {
     *     // ... filter to delete one Solicitud
     *   }
     * })
     * 
     */
    delete<T extends SolicitudDeleteArgs>(args: SelectSubset<T, SolicitudDeleteArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Solicitud.
     * @param {SolicitudUpdateArgs} args - Arguments to update one Solicitud.
     * @example
     * // Update one Solicitud
     * const solicitud = await prisma.solicitud.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SolicitudUpdateArgs>(args: SelectSubset<T, SolicitudUpdateArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Solicituds.
     * @param {SolicitudDeleteManyArgs} args - Arguments to filter Solicituds to delete.
     * @example
     * // Delete a few Solicituds
     * const { count } = await prisma.solicitud.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SolicitudDeleteManyArgs>(args?: SelectSubset<T, SolicitudDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Solicituds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Solicituds
     * const solicitud = await prisma.solicitud.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SolicitudUpdateManyArgs>(args: SelectSubset<T, SolicitudUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Solicituds and returns the data updated in the database.
     * @param {SolicitudUpdateManyAndReturnArgs} args - Arguments to update many Solicituds.
     * @example
     * // Update many Solicituds
     * const solicitud = await prisma.solicitud.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Solicituds and only return the `idSolicitud`
     * const solicitudWithIdSolicitudOnly = await prisma.solicitud.updateManyAndReturn({
     *   select: { idSolicitud: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SolicitudUpdateManyAndReturnArgs>(args: SelectSubset<T, SolicitudUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Solicitud.
     * @param {SolicitudUpsertArgs} args - Arguments to update or create a Solicitud.
     * @example
     * // Update or create a Solicitud
     * const solicitud = await prisma.solicitud.upsert({
     *   create: {
     *     // ... data to create a Solicitud
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Solicitud we want to update
     *   }
     * })
     */
    upsert<T extends SolicitudUpsertArgs>(args: SelectSubset<T, SolicitudUpsertArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Solicituds.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudCountArgs} args - Arguments to filter Solicituds to count.
     * @example
     * // Count the number of Solicituds
     * const count = await prisma.solicitud.count({
     *   where: {
     *     // ... the filter for the Solicituds we want to count
     *   }
     * })
    **/
    count<T extends SolicitudCountArgs>(
      args?: Subset<T, SolicitudCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SolicitudCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Solicitud.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SolicitudAggregateArgs>(args: Subset<T, SolicitudAggregateArgs>): Prisma.PrismaPromise<GetSolicitudAggregateType<T>>

    /**
     * Group by Solicitud.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SolicitudGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SolicitudGroupByArgs['orderBy'] }
        : { orderBy?: SolicitudGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SolicitudGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSolicitudGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Solicitud model
   */
  readonly fields: SolicitudFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Solicitud.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SolicitudClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    solicitudesTecnico<T extends Solicitud$solicitudesTecnicoArgs<ExtArgs> = {}>(args?: Subset<T, Solicitud$solicitudesTecnicoArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    calificaciones<T extends Solicitud$calificacionesArgs<ExtArgs> = {}>(args?: Subset<T, Solicitud$calificacionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    transacciones<T extends Solicitud$transaccionesArgs<ExtArgs> = {}>(args?: Subset<T, Solicitud$transaccionesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Solicitud model
   */
  interface SolicitudFieldRefs {
    readonly idSolicitud: FieldRef<"Solicitud", 'Int'>
    readonly idUser: FieldRef<"Solicitud", 'Int'>
    readonly idTipoServicio: FieldRef<"Solicitud", 'Int'>
    readonly codigoParroquia: FieldRef<"Solicitud", 'String'>
    readonly tituloProblema: FieldRef<"Solicitud", 'String'>
    readonly descripcionProblema: FieldRef<"Solicitud", 'String'>
    readonly costoEstimado: FieldRef<"Solicitud", 'Decimal'>
    readonly costoPromocion: FieldRef<"Solicitud", 'Decimal'>
    readonly promocion: FieldRef<"Solicitud", 'Boolean'>
    readonly estadoSolicitud: FieldRef<"Solicitud", 'EstadoSolicitud'>
    readonly fechaProgramada: FieldRef<"Solicitud", 'DateTime'>
    readonly fechaPublicacion: FieldRef<"Solicitud", 'DateTime'>
    readonly fechaInicio: FieldRef<"Solicitud", 'DateTime'>
    readonly fechaFinalizacion: FieldRef<"Solicitud", 'DateTime'>
    readonly duracionEstimadaMin: FieldRef<"Solicitud", 'Int'>
    readonly isActive: FieldRef<"Solicitud", 'Boolean'>
    readonly deletedAt: FieldRef<"Solicitud", 'DateTime'>
    readonly createdAt: FieldRef<"Solicitud", 'DateTime'>
    readonly updatedAt: FieldRef<"Solicitud", 'DateTime'>
    readonly createdBy: FieldRef<"Solicitud", 'Int'>
    readonly updatedBy: FieldRef<"Solicitud", 'Int'>
  }
    

  // Custom InputTypes
  /**
   * Solicitud findUnique
   */
  export type SolicitudFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudInclude<ExtArgs> | null
    /**
     * Filter, which Solicitud to fetch.
     */
    where: SolicitudWhereUniqueInput
  }

  /**
   * Solicitud findUniqueOrThrow
   */
  export type SolicitudFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudInclude<ExtArgs> | null
    /**
     * Filter, which Solicitud to fetch.
     */
    where: SolicitudWhereUniqueInput
  }

  /**
   * Solicitud findFirst
   */
  export type SolicitudFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudInclude<ExtArgs> | null
    /**
     * Filter, which Solicitud to fetch.
     */
    where?: SolicitudWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Solicituds to fetch.
     */
    orderBy?: SolicitudOrderByWithRelationInput | SolicitudOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Solicituds.
     */
    cursor?: SolicitudWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Solicituds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Solicituds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Solicituds.
     */
    distinct?: SolicitudScalarFieldEnum | SolicitudScalarFieldEnum[]
  }

  /**
   * Solicitud findFirstOrThrow
   */
  export type SolicitudFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudInclude<ExtArgs> | null
    /**
     * Filter, which Solicitud to fetch.
     */
    where?: SolicitudWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Solicituds to fetch.
     */
    orderBy?: SolicitudOrderByWithRelationInput | SolicitudOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Solicituds.
     */
    cursor?: SolicitudWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Solicituds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Solicituds.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Solicituds.
     */
    distinct?: SolicitudScalarFieldEnum | SolicitudScalarFieldEnum[]
  }

  /**
   * Solicitud findMany
   */
  export type SolicitudFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudInclude<ExtArgs> | null
    /**
     * Filter, which Solicituds to fetch.
     */
    where?: SolicitudWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Solicituds to fetch.
     */
    orderBy?: SolicitudOrderByWithRelationInput | SolicitudOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Solicituds.
     */
    cursor?: SolicitudWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Solicituds from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Solicituds.
     */
    skip?: number
    distinct?: SolicitudScalarFieldEnum | SolicitudScalarFieldEnum[]
  }

  /**
   * Solicitud create
   */
  export type SolicitudCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudInclude<ExtArgs> | null
    /**
     * The data needed to create a Solicitud.
     */
    data: XOR<SolicitudCreateInput, SolicitudUncheckedCreateInput>
  }

  /**
   * Solicitud createMany
   */
  export type SolicitudCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Solicituds.
     */
    data: SolicitudCreateManyInput | SolicitudCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Solicitud createManyAndReturn
   */
  export type SolicitudCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * The data used to create many Solicituds.
     */
    data: SolicitudCreateManyInput | SolicitudCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Solicitud update
   */
  export type SolicitudUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudInclude<ExtArgs> | null
    /**
     * The data needed to update a Solicitud.
     */
    data: XOR<SolicitudUpdateInput, SolicitudUncheckedUpdateInput>
    /**
     * Choose, which Solicitud to update.
     */
    where: SolicitudWhereUniqueInput
  }

  /**
   * Solicitud updateMany
   */
  export type SolicitudUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Solicituds.
     */
    data: XOR<SolicitudUpdateManyMutationInput, SolicitudUncheckedUpdateManyInput>
    /**
     * Filter which Solicituds to update
     */
    where?: SolicitudWhereInput
    /**
     * Limit how many Solicituds to update.
     */
    limit?: number
  }

  /**
   * Solicitud updateManyAndReturn
   */
  export type SolicitudUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * The data used to update Solicituds.
     */
    data: XOR<SolicitudUpdateManyMutationInput, SolicitudUncheckedUpdateManyInput>
    /**
     * Filter which Solicituds to update
     */
    where?: SolicitudWhereInput
    /**
     * Limit how many Solicituds to update.
     */
    limit?: number
  }

  /**
   * Solicitud upsert
   */
  export type SolicitudUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudInclude<ExtArgs> | null
    /**
     * The filter to search for the Solicitud to update in case it exists.
     */
    where: SolicitudWhereUniqueInput
    /**
     * In case the Solicitud found by the `where` argument doesn't exist, create a new Solicitud with this data.
     */
    create: XOR<SolicitudCreateInput, SolicitudUncheckedCreateInput>
    /**
     * In case the Solicitud was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SolicitudUpdateInput, SolicitudUncheckedUpdateInput>
  }

  /**
   * Solicitud delete
   */
  export type SolicitudDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudInclude<ExtArgs> | null
    /**
     * Filter which Solicitud to delete.
     */
    where: SolicitudWhereUniqueInput
  }

  /**
   * Solicitud deleteMany
   */
  export type SolicitudDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Solicituds to delete
     */
    where?: SolicitudWhereInput
    /**
     * Limit how many Solicituds to delete.
     */
    limit?: number
  }

  /**
   * Solicitud.solicitudesTecnico
   */
  export type Solicitud$solicitudesTecnicoArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
    where?: SolicitudTecnicoWhereInput
    orderBy?: SolicitudTecnicoOrderByWithRelationInput | SolicitudTecnicoOrderByWithRelationInput[]
    cursor?: SolicitudTecnicoWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SolicitudTecnicoScalarFieldEnum | SolicitudTecnicoScalarFieldEnum[]
  }

  /**
   * Solicitud.calificaciones
   */
  export type Solicitud$calificacionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
    where?: CalificacionWhereInput
    orderBy?: CalificacionOrderByWithRelationInput | CalificacionOrderByWithRelationInput[]
    cursor?: CalificacionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: CalificacionScalarFieldEnum | CalificacionScalarFieldEnum[]
  }

  /**
   * Solicitud.transacciones
   */
  export type Solicitud$transaccionesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
    where?: TransaccionWhereInput
    orderBy?: TransaccionOrderByWithRelationInput | TransaccionOrderByWithRelationInput[]
    cursor?: TransaccionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TransaccionScalarFieldEnum | TransaccionScalarFieldEnum[]
  }

  /**
   * Solicitud without action
   */
  export type SolicitudDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Solicitud
     */
    select?: SolicitudSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Solicitud
     */
    omit?: SolicitudOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudInclude<ExtArgs> | null
  }


  /**
   * Model SolicitudTecnico
   */

  export type AggregateSolicitudTecnico = {
    _count: SolicitudTecnicoCountAggregateOutputType | null
    _avg: SolicitudTecnicoAvgAggregateOutputType | null
    _sum: SolicitudTecnicoSumAggregateOutputType | null
    _min: SolicitudTecnicoMinAggregateOutputType | null
    _max: SolicitudTecnicoMaxAggregateOutputType | null
  }

  export type SolicitudTecnicoAvgAggregateOutputType = {
    idSolTec: number | null
    idSolicitud: number | null
    idTecnico: number | null
    costoAcordado: Decimal | null
  }

  export type SolicitudTecnicoSumAggregateOutputType = {
    idSolTec: number | null
    idSolicitud: number | null
    idTecnico: number | null
    costoAcordado: Decimal | null
  }

  export type SolicitudTecnicoMinAggregateOutputType = {
    idSolTec: number | null
    idSolicitud: number | null
    idTecnico: number | null
    costoAcordado: Decimal | null
    estadoAcuerdo: $Enums.EstadoAceptacion | null
    fechaPropuesta: Date | null
    fechaConfirmada: Date | null
    notas: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SolicitudTecnicoMaxAggregateOutputType = {
    idSolTec: number | null
    idSolicitud: number | null
    idTecnico: number | null
    costoAcordado: Decimal | null
    estadoAcuerdo: $Enums.EstadoAceptacion | null
    fechaPropuesta: Date | null
    fechaConfirmada: Date | null
    notas: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SolicitudTecnicoCountAggregateOutputType = {
    idSolTec: number
    idSolicitud: number
    idTecnico: number
    costoAcordado: number
    estadoAcuerdo: number
    fechaPropuesta: number
    fechaConfirmada: number
    notas: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SolicitudTecnicoAvgAggregateInputType = {
    idSolTec?: true
    idSolicitud?: true
    idTecnico?: true
    costoAcordado?: true
  }

  export type SolicitudTecnicoSumAggregateInputType = {
    idSolTec?: true
    idSolicitud?: true
    idTecnico?: true
    costoAcordado?: true
  }

  export type SolicitudTecnicoMinAggregateInputType = {
    idSolTec?: true
    idSolicitud?: true
    idTecnico?: true
    costoAcordado?: true
    estadoAcuerdo?: true
    fechaPropuesta?: true
    fechaConfirmada?: true
    notas?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SolicitudTecnicoMaxAggregateInputType = {
    idSolTec?: true
    idSolicitud?: true
    idTecnico?: true
    costoAcordado?: true
    estadoAcuerdo?: true
    fechaPropuesta?: true
    fechaConfirmada?: true
    notas?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SolicitudTecnicoCountAggregateInputType = {
    idSolTec?: true
    idSolicitud?: true
    idTecnico?: true
    costoAcordado?: true
    estadoAcuerdo?: true
    fechaPropuesta?: true
    fechaConfirmada?: true
    notas?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SolicitudTecnicoAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SolicitudTecnico to aggregate.
     */
    where?: SolicitudTecnicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SolicitudTecnicos to fetch.
     */
    orderBy?: SolicitudTecnicoOrderByWithRelationInput | SolicitudTecnicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SolicitudTecnicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SolicitudTecnicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SolicitudTecnicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SolicitudTecnicos
    **/
    _count?: true | SolicitudTecnicoCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SolicitudTecnicoAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SolicitudTecnicoSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SolicitudTecnicoMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SolicitudTecnicoMaxAggregateInputType
  }

  export type GetSolicitudTecnicoAggregateType<T extends SolicitudTecnicoAggregateArgs> = {
        [P in keyof T & keyof AggregateSolicitudTecnico]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSolicitudTecnico[P]>
      : GetScalarType<T[P], AggregateSolicitudTecnico[P]>
  }




  export type SolicitudTecnicoGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SolicitudTecnicoWhereInput
    orderBy?: SolicitudTecnicoOrderByWithAggregationInput | SolicitudTecnicoOrderByWithAggregationInput[]
    by: SolicitudTecnicoScalarFieldEnum[] | SolicitudTecnicoScalarFieldEnum
    having?: SolicitudTecnicoScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SolicitudTecnicoCountAggregateInputType | true
    _avg?: SolicitudTecnicoAvgAggregateInputType
    _sum?: SolicitudTecnicoSumAggregateInputType
    _min?: SolicitudTecnicoMinAggregateInputType
    _max?: SolicitudTecnicoMaxAggregateInputType
  }

  export type SolicitudTecnicoGroupByOutputType = {
    idSolTec: number
    idSolicitud: number
    idTecnico: number
    costoAcordado: Decimal | null
    estadoAcuerdo: $Enums.EstadoAceptacion
    fechaPropuesta: Date
    fechaConfirmada: Date | null
    notas: string | null
    createdAt: Date
    updatedAt: Date
    _count: SolicitudTecnicoCountAggregateOutputType | null
    _avg: SolicitudTecnicoAvgAggregateOutputType | null
    _sum: SolicitudTecnicoSumAggregateOutputType | null
    _min: SolicitudTecnicoMinAggregateOutputType | null
    _max: SolicitudTecnicoMaxAggregateOutputType | null
  }

  type GetSolicitudTecnicoGroupByPayload<T extends SolicitudTecnicoGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SolicitudTecnicoGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SolicitudTecnicoGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SolicitudTecnicoGroupByOutputType[P]>
            : GetScalarType<T[P], SolicitudTecnicoGroupByOutputType[P]>
        }
      >
    >


  export type SolicitudTecnicoSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idSolTec?: boolean
    idSolicitud?: boolean
    idTecnico?: boolean
    costoAcordado?: boolean
    estadoAcuerdo?: boolean
    fechaPropuesta?: boolean
    fechaConfirmada?: boolean
    notas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["solicitudTecnico"]>

  export type SolicitudTecnicoSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idSolTec?: boolean
    idSolicitud?: boolean
    idTecnico?: boolean
    costoAcordado?: boolean
    estadoAcuerdo?: boolean
    fechaPropuesta?: boolean
    fechaConfirmada?: boolean
    notas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["solicitudTecnico"]>

  export type SolicitudTecnicoSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idSolTec?: boolean
    idSolicitud?: boolean
    idTecnico?: boolean
    costoAcordado?: boolean
    estadoAcuerdo?: boolean
    fechaPropuesta?: boolean
    fechaConfirmada?: boolean
    notas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["solicitudTecnico"]>

  export type SolicitudTecnicoSelectScalar = {
    idSolTec?: boolean
    idSolicitud?: boolean
    idTecnico?: boolean
    costoAcordado?: boolean
    estadoAcuerdo?: boolean
    fechaPropuesta?: boolean
    fechaConfirmada?: boolean
    notas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SolicitudTecnicoOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idSolTec" | "idSolicitud" | "idTecnico" | "costoAcordado" | "estadoAcuerdo" | "fechaPropuesta" | "fechaConfirmada" | "notas" | "createdAt" | "updatedAt", ExtArgs["result"]["solicitudTecnico"]>
  export type SolicitudTecnicoInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }
  export type SolicitudTecnicoIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }
  export type SolicitudTecnicoIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }

  export type $SolicitudTecnicoPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SolicitudTecnico"
    objects: {
      solicitud: Prisma.$SolicitudPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      idSolTec: number
      idSolicitud: number
      idTecnico: number
      costoAcordado: Prisma.Decimal | null
      estadoAcuerdo: $Enums.EstadoAceptacion
      fechaPropuesta: Date
      fechaConfirmada: Date | null
      notas: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["solicitudTecnico"]>
    composites: {}
  }

  type SolicitudTecnicoGetPayload<S extends boolean | null | undefined | SolicitudTecnicoDefaultArgs> = $Result.GetResult<Prisma.$SolicitudTecnicoPayload, S>

  type SolicitudTecnicoCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SolicitudTecnicoFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SolicitudTecnicoCountAggregateInputType | true
    }

  export interface SolicitudTecnicoDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SolicitudTecnico'], meta: { name: 'SolicitudTecnico' } }
    /**
     * Find zero or one SolicitudTecnico that matches the filter.
     * @param {SolicitudTecnicoFindUniqueArgs} args - Arguments to find a SolicitudTecnico
     * @example
     * // Get one SolicitudTecnico
     * const solicitudTecnico = await prisma.solicitudTecnico.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SolicitudTecnicoFindUniqueArgs>(args: SelectSubset<T, SolicitudTecnicoFindUniqueArgs<ExtArgs>>): Prisma__SolicitudTecnicoClient<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SolicitudTecnico that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SolicitudTecnicoFindUniqueOrThrowArgs} args - Arguments to find a SolicitudTecnico
     * @example
     * // Get one SolicitudTecnico
     * const solicitudTecnico = await prisma.solicitudTecnico.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SolicitudTecnicoFindUniqueOrThrowArgs>(args: SelectSubset<T, SolicitudTecnicoFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SolicitudTecnicoClient<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SolicitudTecnico that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudTecnicoFindFirstArgs} args - Arguments to find a SolicitudTecnico
     * @example
     * // Get one SolicitudTecnico
     * const solicitudTecnico = await prisma.solicitudTecnico.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SolicitudTecnicoFindFirstArgs>(args?: SelectSubset<T, SolicitudTecnicoFindFirstArgs<ExtArgs>>): Prisma__SolicitudTecnicoClient<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SolicitudTecnico that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudTecnicoFindFirstOrThrowArgs} args - Arguments to find a SolicitudTecnico
     * @example
     * // Get one SolicitudTecnico
     * const solicitudTecnico = await prisma.solicitudTecnico.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SolicitudTecnicoFindFirstOrThrowArgs>(args?: SelectSubset<T, SolicitudTecnicoFindFirstOrThrowArgs<ExtArgs>>): Prisma__SolicitudTecnicoClient<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SolicitudTecnicos that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudTecnicoFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SolicitudTecnicos
     * const solicitudTecnicos = await prisma.solicitudTecnico.findMany()
     * 
     * // Get first 10 SolicitudTecnicos
     * const solicitudTecnicos = await prisma.solicitudTecnico.findMany({ take: 10 })
     * 
     * // Only select the `idSolTec`
     * const solicitudTecnicoWithIdSolTecOnly = await prisma.solicitudTecnico.findMany({ select: { idSolTec: true } })
     * 
     */
    findMany<T extends SolicitudTecnicoFindManyArgs>(args?: SelectSubset<T, SolicitudTecnicoFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SolicitudTecnico.
     * @param {SolicitudTecnicoCreateArgs} args - Arguments to create a SolicitudTecnico.
     * @example
     * // Create one SolicitudTecnico
     * const SolicitudTecnico = await prisma.solicitudTecnico.create({
     *   data: {
     *     // ... data to create a SolicitudTecnico
     *   }
     * })
     * 
     */
    create<T extends SolicitudTecnicoCreateArgs>(args: SelectSubset<T, SolicitudTecnicoCreateArgs<ExtArgs>>): Prisma__SolicitudTecnicoClient<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SolicitudTecnicos.
     * @param {SolicitudTecnicoCreateManyArgs} args - Arguments to create many SolicitudTecnicos.
     * @example
     * // Create many SolicitudTecnicos
     * const solicitudTecnico = await prisma.solicitudTecnico.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SolicitudTecnicoCreateManyArgs>(args?: SelectSubset<T, SolicitudTecnicoCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many SolicitudTecnicos and returns the data saved in the database.
     * @param {SolicitudTecnicoCreateManyAndReturnArgs} args - Arguments to create many SolicitudTecnicos.
     * @example
     * // Create many SolicitudTecnicos
     * const solicitudTecnico = await prisma.solicitudTecnico.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many SolicitudTecnicos and only return the `idSolTec`
     * const solicitudTecnicoWithIdSolTecOnly = await prisma.solicitudTecnico.createManyAndReturn({
     *   select: { idSolTec: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends SolicitudTecnicoCreateManyAndReturnArgs>(args?: SelectSubset<T, SolicitudTecnicoCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a SolicitudTecnico.
     * @param {SolicitudTecnicoDeleteArgs} args - Arguments to delete one SolicitudTecnico.
     * @example
     * // Delete one SolicitudTecnico
     * const SolicitudTecnico = await prisma.solicitudTecnico.delete({
     *   where: {
     *     // ... filter to delete one SolicitudTecnico
     *   }
     * })
     * 
     */
    delete<T extends SolicitudTecnicoDeleteArgs>(args: SelectSubset<T, SolicitudTecnicoDeleteArgs<ExtArgs>>): Prisma__SolicitudTecnicoClient<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SolicitudTecnico.
     * @param {SolicitudTecnicoUpdateArgs} args - Arguments to update one SolicitudTecnico.
     * @example
     * // Update one SolicitudTecnico
     * const solicitudTecnico = await prisma.solicitudTecnico.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SolicitudTecnicoUpdateArgs>(args: SelectSubset<T, SolicitudTecnicoUpdateArgs<ExtArgs>>): Prisma__SolicitudTecnicoClient<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SolicitudTecnicos.
     * @param {SolicitudTecnicoDeleteManyArgs} args - Arguments to filter SolicitudTecnicos to delete.
     * @example
     * // Delete a few SolicitudTecnicos
     * const { count } = await prisma.solicitudTecnico.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SolicitudTecnicoDeleteManyArgs>(args?: SelectSubset<T, SolicitudTecnicoDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SolicitudTecnicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudTecnicoUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SolicitudTecnicos
     * const solicitudTecnico = await prisma.solicitudTecnico.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SolicitudTecnicoUpdateManyArgs>(args: SelectSubset<T, SolicitudTecnicoUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SolicitudTecnicos and returns the data updated in the database.
     * @param {SolicitudTecnicoUpdateManyAndReturnArgs} args - Arguments to update many SolicitudTecnicos.
     * @example
     * // Update many SolicitudTecnicos
     * const solicitudTecnico = await prisma.solicitudTecnico.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more SolicitudTecnicos and only return the `idSolTec`
     * const solicitudTecnicoWithIdSolTecOnly = await prisma.solicitudTecnico.updateManyAndReturn({
     *   select: { idSolTec: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends SolicitudTecnicoUpdateManyAndReturnArgs>(args: SelectSubset<T, SolicitudTecnicoUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one SolicitudTecnico.
     * @param {SolicitudTecnicoUpsertArgs} args - Arguments to update or create a SolicitudTecnico.
     * @example
     * // Update or create a SolicitudTecnico
     * const solicitudTecnico = await prisma.solicitudTecnico.upsert({
     *   create: {
     *     // ... data to create a SolicitudTecnico
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SolicitudTecnico we want to update
     *   }
     * })
     */
    upsert<T extends SolicitudTecnicoUpsertArgs>(args: SelectSubset<T, SolicitudTecnicoUpsertArgs<ExtArgs>>): Prisma__SolicitudTecnicoClient<$Result.GetResult<Prisma.$SolicitudTecnicoPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SolicitudTecnicos.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudTecnicoCountArgs} args - Arguments to filter SolicitudTecnicos to count.
     * @example
     * // Count the number of SolicitudTecnicos
     * const count = await prisma.solicitudTecnico.count({
     *   where: {
     *     // ... the filter for the SolicitudTecnicos we want to count
     *   }
     * })
    **/
    count<T extends SolicitudTecnicoCountArgs>(
      args?: Subset<T, SolicitudTecnicoCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SolicitudTecnicoCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SolicitudTecnico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudTecnicoAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends SolicitudTecnicoAggregateArgs>(args: Subset<T, SolicitudTecnicoAggregateArgs>): Prisma.PrismaPromise<GetSolicitudTecnicoAggregateType<T>>

    /**
     * Group by SolicitudTecnico.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SolicitudTecnicoGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends SolicitudTecnicoGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SolicitudTecnicoGroupByArgs['orderBy'] }
        : { orderBy?: SolicitudTecnicoGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, SolicitudTecnicoGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSolicitudTecnicoGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SolicitudTecnico model
   */
  readonly fields: SolicitudTecnicoFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SolicitudTecnico.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SolicitudTecnicoClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    solicitud<T extends SolicitudDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SolicitudDefaultArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the SolicitudTecnico model
   */
  interface SolicitudTecnicoFieldRefs {
    readonly idSolTec: FieldRef<"SolicitudTecnico", 'Int'>
    readonly idSolicitud: FieldRef<"SolicitudTecnico", 'Int'>
    readonly idTecnico: FieldRef<"SolicitudTecnico", 'Int'>
    readonly costoAcordado: FieldRef<"SolicitudTecnico", 'Decimal'>
    readonly estadoAcuerdo: FieldRef<"SolicitudTecnico", 'EstadoAceptacion'>
    readonly fechaPropuesta: FieldRef<"SolicitudTecnico", 'DateTime'>
    readonly fechaConfirmada: FieldRef<"SolicitudTecnico", 'DateTime'>
    readonly notas: FieldRef<"SolicitudTecnico", 'String'>
    readonly createdAt: FieldRef<"SolicitudTecnico", 'DateTime'>
    readonly updatedAt: FieldRef<"SolicitudTecnico", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SolicitudTecnico findUnique
   */
  export type SolicitudTecnicoFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
    /**
     * Filter, which SolicitudTecnico to fetch.
     */
    where: SolicitudTecnicoWhereUniqueInput
  }

  /**
   * SolicitudTecnico findUniqueOrThrow
   */
  export type SolicitudTecnicoFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
    /**
     * Filter, which SolicitudTecnico to fetch.
     */
    where: SolicitudTecnicoWhereUniqueInput
  }

  /**
   * SolicitudTecnico findFirst
   */
  export type SolicitudTecnicoFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
    /**
     * Filter, which SolicitudTecnico to fetch.
     */
    where?: SolicitudTecnicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SolicitudTecnicos to fetch.
     */
    orderBy?: SolicitudTecnicoOrderByWithRelationInput | SolicitudTecnicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SolicitudTecnicos.
     */
    cursor?: SolicitudTecnicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SolicitudTecnicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SolicitudTecnicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SolicitudTecnicos.
     */
    distinct?: SolicitudTecnicoScalarFieldEnum | SolicitudTecnicoScalarFieldEnum[]
  }

  /**
   * SolicitudTecnico findFirstOrThrow
   */
  export type SolicitudTecnicoFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
    /**
     * Filter, which SolicitudTecnico to fetch.
     */
    where?: SolicitudTecnicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SolicitudTecnicos to fetch.
     */
    orderBy?: SolicitudTecnicoOrderByWithRelationInput | SolicitudTecnicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SolicitudTecnicos.
     */
    cursor?: SolicitudTecnicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SolicitudTecnicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SolicitudTecnicos.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SolicitudTecnicos.
     */
    distinct?: SolicitudTecnicoScalarFieldEnum | SolicitudTecnicoScalarFieldEnum[]
  }

  /**
   * SolicitudTecnico findMany
   */
  export type SolicitudTecnicoFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
    /**
     * Filter, which SolicitudTecnicos to fetch.
     */
    where?: SolicitudTecnicoWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SolicitudTecnicos to fetch.
     */
    orderBy?: SolicitudTecnicoOrderByWithRelationInput | SolicitudTecnicoOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SolicitudTecnicos.
     */
    cursor?: SolicitudTecnicoWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SolicitudTecnicos from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SolicitudTecnicos.
     */
    skip?: number
    distinct?: SolicitudTecnicoScalarFieldEnum | SolicitudTecnicoScalarFieldEnum[]
  }

  /**
   * SolicitudTecnico create
   */
  export type SolicitudTecnicoCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
    /**
     * The data needed to create a SolicitudTecnico.
     */
    data: XOR<SolicitudTecnicoCreateInput, SolicitudTecnicoUncheckedCreateInput>
  }

  /**
   * SolicitudTecnico createMany
   */
  export type SolicitudTecnicoCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SolicitudTecnicos.
     */
    data: SolicitudTecnicoCreateManyInput | SolicitudTecnicoCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SolicitudTecnico createManyAndReturn
   */
  export type SolicitudTecnicoCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * The data used to create many SolicitudTecnicos.
     */
    data: SolicitudTecnicoCreateManyInput | SolicitudTecnicoCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * SolicitudTecnico update
   */
  export type SolicitudTecnicoUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
    /**
     * The data needed to update a SolicitudTecnico.
     */
    data: XOR<SolicitudTecnicoUpdateInput, SolicitudTecnicoUncheckedUpdateInput>
    /**
     * Choose, which SolicitudTecnico to update.
     */
    where: SolicitudTecnicoWhereUniqueInput
  }

  /**
   * SolicitudTecnico updateMany
   */
  export type SolicitudTecnicoUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SolicitudTecnicos.
     */
    data: XOR<SolicitudTecnicoUpdateManyMutationInput, SolicitudTecnicoUncheckedUpdateManyInput>
    /**
     * Filter which SolicitudTecnicos to update
     */
    where?: SolicitudTecnicoWhereInput
    /**
     * Limit how many SolicitudTecnicos to update.
     */
    limit?: number
  }

  /**
   * SolicitudTecnico updateManyAndReturn
   */
  export type SolicitudTecnicoUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * The data used to update SolicitudTecnicos.
     */
    data: XOR<SolicitudTecnicoUpdateManyMutationInput, SolicitudTecnicoUncheckedUpdateManyInput>
    /**
     * Filter which SolicitudTecnicos to update
     */
    where?: SolicitudTecnicoWhereInput
    /**
     * Limit how many SolicitudTecnicos to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * SolicitudTecnico upsert
   */
  export type SolicitudTecnicoUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
    /**
     * The filter to search for the SolicitudTecnico to update in case it exists.
     */
    where: SolicitudTecnicoWhereUniqueInput
    /**
     * In case the SolicitudTecnico found by the `where` argument doesn't exist, create a new SolicitudTecnico with this data.
     */
    create: XOR<SolicitudTecnicoCreateInput, SolicitudTecnicoUncheckedCreateInput>
    /**
     * In case the SolicitudTecnico was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SolicitudTecnicoUpdateInput, SolicitudTecnicoUncheckedUpdateInput>
  }

  /**
   * SolicitudTecnico delete
   */
  export type SolicitudTecnicoDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
    /**
     * Filter which SolicitudTecnico to delete.
     */
    where: SolicitudTecnicoWhereUniqueInput
  }

  /**
   * SolicitudTecnico deleteMany
   */
  export type SolicitudTecnicoDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SolicitudTecnicos to delete
     */
    where?: SolicitudTecnicoWhereInput
    /**
     * Limit how many SolicitudTecnicos to delete.
     */
    limit?: number
  }

  /**
   * SolicitudTecnico without action
   */
  export type SolicitudTecnicoDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SolicitudTecnico
     */
    select?: SolicitudTecnicoSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SolicitudTecnico
     */
    omit?: SolicitudTecnicoOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SolicitudTecnicoInclude<ExtArgs> | null
  }


  /**
   * Model Calificacion
   */

  export type AggregateCalificacion = {
    _count: CalificacionCountAggregateOutputType | null
    _avg: CalificacionAvgAggregateOutputType | null
    _sum: CalificacionSumAggregateOutputType | null
    _min: CalificacionMinAggregateOutputType | null
    _max: CalificacionMaxAggregateOutputType | null
  }

  export type CalificacionAvgAggregateOutputType = {
    idCalificacion: number | null
    idSolicitud: number | null
    idTecnico: number | null
  }

  export type CalificacionSumAggregateOutputType = {
    idCalificacion: number | null
    idSolicitud: number | null
    idTecnico: number | null
  }

  export type CalificacionMinAggregateOutputType = {
    idCalificacion: number | null
    idSolicitud: number | null
    idTecnico: number | null
    puntaje: $Enums.PuntajeCalificacion | null
    comentario: string | null
    fechaCalificacion: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CalificacionMaxAggregateOutputType = {
    idCalificacion: number | null
    idSolicitud: number | null
    idTecnico: number | null
    puntaje: $Enums.PuntajeCalificacion | null
    comentario: string | null
    fechaCalificacion: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type CalificacionCountAggregateOutputType = {
    idCalificacion: number
    idSolicitud: number
    idTecnico: number
    puntaje: number
    comentario: number
    fechaCalificacion: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type CalificacionAvgAggregateInputType = {
    idCalificacion?: true
    idSolicitud?: true
    idTecnico?: true
  }

  export type CalificacionSumAggregateInputType = {
    idCalificacion?: true
    idSolicitud?: true
    idTecnico?: true
  }

  export type CalificacionMinAggregateInputType = {
    idCalificacion?: true
    idSolicitud?: true
    idTecnico?: true
    puntaje?: true
    comentario?: true
    fechaCalificacion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CalificacionMaxAggregateInputType = {
    idCalificacion?: true
    idSolicitud?: true
    idTecnico?: true
    puntaje?: true
    comentario?: true
    fechaCalificacion?: true
    createdAt?: true
    updatedAt?: true
  }

  export type CalificacionCountAggregateInputType = {
    idCalificacion?: true
    idSolicitud?: true
    idTecnico?: true
    puntaje?: true
    comentario?: true
    fechaCalificacion?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type CalificacionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Calificacion to aggregate.
     */
    where?: CalificacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calificacions to fetch.
     */
    orderBy?: CalificacionOrderByWithRelationInput | CalificacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: CalificacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calificacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calificacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Calificacions
    **/
    _count?: true | CalificacionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: CalificacionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: CalificacionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: CalificacionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: CalificacionMaxAggregateInputType
  }

  export type GetCalificacionAggregateType<T extends CalificacionAggregateArgs> = {
        [P in keyof T & keyof AggregateCalificacion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateCalificacion[P]>
      : GetScalarType<T[P], AggregateCalificacion[P]>
  }




  export type CalificacionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: CalificacionWhereInput
    orderBy?: CalificacionOrderByWithAggregationInput | CalificacionOrderByWithAggregationInput[]
    by: CalificacionScalarFieldEnum[] | CalificacionScalarFieldEnum
    having?: CalificacionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: CalificacionCountAggregateInputType | true
    _avg?: CalificacionAvgAggregateInputType
    _sum?: CalificacionSumAggregateInputType
    _min?: CalificacionMinAggregateInputType
    _max?: CalificacionMaxAggregateInputType
  }

  export type CalificacionGroupByOutputType = {
    idCalificacion: number
    idSolicitud: number
    idTecnico: number
    puntaje: $Enums.PuntajeCalificacion
    comentario: string | null
    fechaCalificacion: Date
    createdAt: Date
    updatedAt: Date
    _count: CalificacionCountAggregateOutputType | null
    _avg: CalificacionAvgAggregateOutputType | null
    _sum: CalificacionSumAggregateOutputType | null
    _min: CalificacionMinAggregateOutputType | null
    _max: CalificacionMaxAggregateOutputType | null
  }

  type GetCalificacionGroupByPayload<T extends CalificacionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<CalificacionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof CalificacionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], CalificacionGroupByOutputType[P]>
            : GetScalarType<T[P], CalificacionGroupByOutputType[P]>
        }
      >
    >


  export type CalificacionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCalificacion?: boolean
    idSolicitud?: boolean
    idTecnico?: boolean
    puntaje?: boolean
    comentario?: boolean
    fechaCalificacion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calificacion"]>

  export type CalificacionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCalificacion?: boolean
    idSolicitud?: boolean
    idTecnico?: boolean
    puntaje?: boolean
    comentario?: boolean
    fechaCalificacion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calificacion"]>

  export type CalificacionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idCalificacion?: boolean
    idSolicitud?: boolean
    idTecnico?: boolean
    puntaje?: boolean
    comentario?: boolean
    fechaCalificacion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["calificacion"]>

  export type CalificacionSelectScalar = {
    idCalificacion?: boolean
    idSolicitud?: boolean
    idTecnico?: boolean
    puntaje?: boolean
    comentario?: boolean
    fechaCalificacion?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type CalificacionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idCalificacion" | "idSolicitud" | "idTecnico" | "puntaje" | "comentario" | "fechaCalificacion" | "createdAt" | "updatedAt", ExtArgs["result"]["calificacion"]>
  export type CalificacionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }
  export type CalificacionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }
  export type CalificacionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }

  export type $CalificacionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Calificacion"
    objects: {
      solicitud: Prisma.$SolicitudPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      idCalificacion: number
      idSolicitud: number
      idTecnico: number
      puntaje: $Enums.PuntajeCalificacion
      comentario: string | null
      fechaCalificacion: Date
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["calificacion"]>
    composites: {}
  }

  type CalificacionGetPayload<S extends boolean | null | undefined | CalificacionDefaultArgs> = $Result.GetResult<Prisma.$CalificacionPayload, S>

  type CalificacionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<CalificacionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: CalificacionCountAggregateInputType | true
    }

  export interface CalificacionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Calificacion'], meta: { name: 'Calificacion' } }
    /**
     * Find zero or one Calificacion that matches the filter.
     * @param {CalificacionFindUniqueArgs} args - Arguments to find a Calificacion
     * @example
     * // Get one Calificacion
     * const calificacion = await prisma.calificacion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends CalificacionFindUniqueArgs>(args: SelectSubset<T, CalificacionFindUniqueArgs<ExtArgs>>): Prisma__CalificacionClient<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Calificacion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {CalificacionFindUniqueOrThrowArgs} args - Arguments to find a Calificacion
     * @example
     * // Get one Calificacion
     * const calificacion = await prisma.calificacion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends CalificacionFindUniqueOrThrowArgs>(args: SelectSubset<T, CalificacionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__CalificacionClient<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Calificacion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionFindFirstArgs} args - Arguments to find a Calificacion
     * @example
     * // Get one Calificacion
     * const calificacion = await prisma.calificacion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends CalificacionFindFirstArgs>(args?: SelectSubset<T, CalificacionFindFirstArgs<ExtArgs>>): Prisma__CalificacionClient<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Calificacion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionFindFirstOrThrowArgs} args - Arguments to find a Calificacion
     * @example
     * // Get one Calificacion
     * const calificacion = await prisma.calificacion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends CalificacionFindFirstOrThrowArgs>(args?: SelectSubset<T, CalificacionFindFirstOrThrowArgs<ExtArgs>>): Prisma__CalificacionClient<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Calificacions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Calificacions
     * const calificacions = await prisma.calificacion.findMany()
     * 
     * // Get first 10 Calificacions
     * const calificacions = await prisma.calificacion.findMany({ take: 10 })
     * 
     * // Only select the `idCalificacion`
     * const calificacionWithIdCalificacionOnly = await prisma.calificacion.findMany({ select: { idCalificacion: true } })
     * 
     */
    findMany<T extends CalificacionFindManyArgs>(args?: SelectSubset<T, CalificacionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Calificacion.
     * @param {CalificacionCreateArgs} args - Arguments to create a Calificacion.
     * @example
     * // Create one Calificacion
     * const Calificacion = await prisma.calificacion.create({
     *   data: {
     *     // ... data to create a Calificacion
     *   }
     * })
     * 
     */
    create<T extends CalificacionCreateArgs>(args: SelectSubset<T, CalificacionCreateArgs<ExtArgs>>): Prisma__CalificacionClient<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Calificacions.
     * @param {CalificacionCreateManyArgs} args - Arguments to create many Calificacions.
     * @example
     * // Create many Calificacions
     * const calificacion = await prisma.calificacion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends CalificacionCreateManyArgs>(args?: SelectSubset<T, CalificacionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Calificacions and returns the data saved in the database.
     * @param {CalificacionCreateManyAndReturnArgs} args - Arguments to create many Calificacions.
     * @example
     * // Create many Calificacions
     * const calificacion = await prisma.calificacion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Calificacions and only return the `idCalificacion`
     * const calificacionWithIdCalificacionOnly = await prisma.calificacion.createManyAndReturn({
     *   select: { idCalificacion: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends CalificacionCreateManyAndReturnArgs>(args?: SelectSubset<T, CalificacionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Calificacion.
     * @param {CalificacionDeleteArgs} args - Arguments to delete one Calificacion.
     * @example
     * // Delete one Calificacion
     * const Calificacion = await prisma.calificacion.delete({
     *   where: {
     *     // ... filter to delete one Calificacion
     *   }
     * })
     * 
     */
    delete<T extends CalificacionDeleteArgs>(args: SelectSubset<T, CalificacionDeleteArgs<ExtArgs>>): Prisma__CalificacionClient<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Calificacion.
     * @param {CalificacionUpdateArgs} args - Arguments to update one Calificacion.
     * @example
     * // Update one Calificacion
     * const calificacion = await prisma.calificacion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends CalificacionUpdateArgs>(args: SelectSubset<T, CalificacionUpdateArgs<ExtArgs>>): Prisma__CalificacionClient<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Calificacions.
     * @param {CalificacionDeleteManyArgs} args - Arguments to filter Calificacions to delete.
     * @example
     * // Delete a few Calificacions
     * const { count } = await prisma.calificacion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends CalificacionDeleteManyArgs>(args?: SelectSubset<T, CalificacionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Calificacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Calificacions
     * const calificacion = await prisma.calificacion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends CalificacionUpdateManyArgs>(args: SelectSubset<T, CalificacionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Calificacions and returns the data updated in the database.
     * @param {CalificacionUpdateManyAndReturnArgs} args - Arguments to update many Calificacions.
     * @example
     * // Update many Calificacions
     * const calificacion = await prisma.calificacion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Calificacions and only return the `idCalificacion`
     * const calificacionWithIdCalificacionOnly = await prisma.calificacion.updateManyAndReturn({
     *   select: { idCalificacion: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends CalificacionUpdateManyAndReturnArgs>(args: SelectSubset<T, CalificacionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Calificacion.
     * @param {CalificacionUpsertArgs} args - Arguments to update or create a Calificacion.
     * @example
     * // Update or create a Calificacion
     * const calificacion = await prisma.calificacion.upsert({
     *   create: {
     *     // ... data to create a Calificacion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Calificacion we want to update
     *   }
     * })
     */
    upsert<T extends CalificacionUpsertArgs>(args: SelectSubset<T, CalificacionUpsertArgs<ExtArgs>>): Prisma__CalificacionClient<$Result.GetResult<Prisma.$CalificacionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Calificacions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionCountArgs} args - Arguments to filter Calificacions to count.
     * @example
     * // Count the number of Calificacions
     * const count = await prisma.calificacion.count({
     *   where: {
     *     // ... the filter for the Calificacions we want to count
     *   }
     * })
    **/
    count<T extends CalificacionCountArgs>(
      args?: Subset<T, CalificacionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], CalificacionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Calificacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends CalificacionAggregateArgs>(args: Subset<T, CalificacionAggregateArgs>): Prisma.PrismaPromise<GetCalificacionAggregateType<T>>

    /**
     * Group by Calificacion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {CalificacionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends CalificacionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: CalificacionGroupByArgs['orderBy'] }
        : { orderBy?: CalificacionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, CalificacionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCalificacionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Calificacion model
   */
  readonly fields: CalificacionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Calificacion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__CalificacionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    solicitud<T extends SolicitudDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SolicitudDefaultArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Calificacion model
   */
  interface CalificacionFieldRefs {
    readonly idCalificacion: FieldRef<"Calificacion", 'Int'>
    readonly idSolicitud: FieldRef<"Calificacion", 'Int'>
    readonly idTecnico: FieldRef<"Calificacion", 'Int'>
    readonly puntaje: FieldRef<"Calificacion", 'PuntajeCalificacion'>
    readonly comentario: FieldRef<"Calificacion", 'String'>
    readonly fechaCalificacion: FieldRef<"Calificacion", 'DateTime'>
    readonly createdAt: FieldRef<"Calificacion", 'DateTime'>
    readonly updatedAt: FieldRef<"Calificacion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Calificacion findUnique
   */
  export type CalificacionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
    /**
     * Filter, which Calificacion to fetch.
     */
    where: CalificacionWhereUniqueInput
  }

  /**
   * Calificacion findUniqueOrThrow
   */
  export type CalificacionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
    /**
     * Filter, which Calificacion to fetch.
     */
    where: CalificacionWhereUniqueInput
  }

  /**
   * Calificacion findFirst
   */
  export type CalificacionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
    /**
     * Filter, which Calificacion to fetch.
     */
    where?: CalificacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calificacions to fetch.
     */
    orderBy?: CalificacionOrderByWithRelationInput | CalificacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Calificacions.
     */
    cursor?: CalificacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calificacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calificacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Calificacions.
     */
    distinct?: CalificacionScalarFieldEnum | CalificacionScalarFieldEnum[]
  }

  /**
   * Calificacion findFirstOrThrow
   */
  export type CalificacionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
    /**
     * Filter, which Calificacion to fetch.
     */
    where?: CalificacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calificacions to fetch.
     */
    orderBy?: CalificacionOrderByWithRelationInput | CalificacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Calificacions.
     */
    cursor?: CalificacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calificacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calificacions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Calificacions.
     */
    distinct?: CalificacionScalarFieldEnum | CalificacionScalarFieldEnum[]
  }

  /**
   * Calificacion findMany
   */
  export type CalificacionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
    /**
     * Filter, which Calificacions to fetch.
     */
    where?: CalificacionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Calificacions to fetch.
     */
    orderBy?: CalificacionOrderByWithRelationInput | CalificacionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Calificacions.
     */
    cursor?: CalificacionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Calificacions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Calificacions.
     */
    skip?: number
    distinct?: CalificacionScalarFieldEnum | CalificacionScalarFieldEnum[]
  }

  /**
   * Calificacion create
   */
  export type CalificacionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
    /**
     * The data needed to create a Calificacion.
     */
    data: XOR<CalificacionCreateInput, CalificacionUncheckedCreateInput>
  }

  /**
   * Calificacion createMany
   */
  export type CalificacionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Calificacions.
     */
    data: CalificacionCreateManyInput | CalificacionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Calificacion createManyAndReturn
   */
  export type CalificacionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * The data used to create many Calificacions.
     */
    data: CalificacionCreateManyInput | CalificacionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Calificacion update
   */
  export type CalificacionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
    /**
     * The data needed to update a Calificacion.
     */
    data: XOR<CalificacionUpdateInput, CalificacionUncheckedUpdateInput>
    /**
     * Choose, which Calificacion to update.
     */
    where: CalificacionWhereUniqueInput
  }

  /**
   * Calificacion updateMany
   */
  export type CalificacionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Calificacions.
     */
    data: XOR<CalificacionUpdateManyMutationInput, CalificacionUncheckedUpdateManyInput>
    /**
     * Filter which Calificacions to update
     */
    where?: CalificacionWhereInput
    /**
     * Limit how many Calificacions to update.
     */
    limit?: number
  }

  /**
   * Calificacion updateManyAndReturn
   */
  export type CalificacionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * The data used to update Calificacions.
     */
    data: XOR<CalificacionUpdateManyMutationInput, CalificacionUncheckedUpdateManyInput>
    /**
     * Filter which Calificacions to update
     */
    where?: CalificacionWhereInput
    /**
     * Limit how many Calificacions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Calificacion upsert
   */
  export type CalificacionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
    /**
     * The filter to search for the Calificacion to update in case it exists.
     */
    where: CalificacionWhereUniqueInput
    /**
     * In case the Calificacion found by the `where` argument doesn't exist, create a new Calificacion with this data.
     */
    create: XOR<CalificacionCreateInput, CalificacionUncheckedCreateInput>
    /**
     * In case the Calificacion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<CalificacionUpdateInput, CalificacionUncheckedUpdateInput>
  }

  /**
   * Calificacion delete
   */
  export type CalificacionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
    /**
     * Filter which Calificacion to delete.
     */
    where: CalificacionWhereUniqueInput
  }

  /**
   * Calificacion deleteMany
   */
  export type CalificacionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Calificacions to delete
     */
    where?: CalificacionWhereInput
    /**
     * Limit how many Calificacions to delete.
     */
    limit?: number
  }

  /**
   * Calificacion without action
   */
  export type CalificacionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Calificacion
     */
    select?: CalificacionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Calificacion
     */
    omit?: CalificacionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: CalificacionInclude<ExtArgs> | null
  }


  /**
   * Model Transaccion
   */

  export type AggregateTransaccion = {
    _count: TransaccionCountAggregateOutputType | null
    _avg: TransaccionAvgAggregateOutputType | null
    _sum: TransaccionSumAggregateOutputType | null
    _min: TransaccionMinAggregateOutputType | null
    _max: TransaccionMaxAggregateOutputType | null
  }

  export type TransaccionAvgAggregateOutputType = {
    idTransaccion: number | null
    idSolicitud: number | null
    monto: Decimal | null
  }

  export type TransaccionSumAggregateOutputType = {
    idTransaccion: number | null
    idSolicitud: number | null
    monto: Decimal | null
  }

  export type TransaccionMinAggregateOutputType = {
    idTransaccion: number | null
    idSolicitud: number | null
    monto: Decimal | null
    metodoPago: $Enums.MetodoPago | null
    estadoPago: $Enums.EstadoPago | null
    fechaPago: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransaccionMaxAggregateOutputType = {
    idTransaccion: number | null
    idSolicitud: number | null
    monto: Decimal | null
    metodoPago: $Enums.MetodoPago | null
    estadoPago: $Enums.EstadoPago | null
    fechaPago: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TransaccionCountAggregateOutputType = {
    idTransaccion: number
    idSolicitud: number
    monto: number
    metodoPago: number
    estadoPago: number
    fechaPago: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TransaccionAvgAggregateInputType = {
    idTransaccion?: true
    idSolicitud?: true
    monto?: true
  }

  export type TransaccionSumAggregateInputType = {
    idTransaccion?: true
    idSolicitud?: true
    monto?: true
  }

  export type TransaccionMinAggregateInputType = {
    idTransaccion?: true
    idSolicitud?: true
    monto?: true
    metodoPago?: true
    estadoPago?: true
    fechaPago?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransaccionMaxAggregateInputType = {
    idTransaccion?: true
    idSolicitud?: true
    monto?: true
    metodoPago?: true
    estadoPago?: true
    fechaPago?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TransaccionCountAggregateInputType = {
    idTransaccion?: true
    idSolicitud?: true
    monto?: true
    metodoPago?: true
    estadoPago?: true
    fechaPago?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TransaccionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaccion to aggregate.
     */
    where?: TransaccionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transaccions to fetch.
     */
    orderBy?: TransaccionOrderByWithRelationInput | TransaccionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TransaccionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transaccions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transaccions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Transaccions
    **/
    _count?: true | TransaccionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TransaccionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TransaccionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TransaccionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TransaccionMaxAggregateInputType
  }

  export type GetTransaccionAggregateType<T extends TransaccionAggregateArgs> = {
        [P in keyof T & keyof AggregateTransaccion]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTransaccion[P]>
      : GetScalarType<T[P], AggregateTransaccion[P]>
  }




  export type TransaccionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TransaccionWhereInput
    orderBy?: TransaccionOrderByWithAggregationInput | TransaccionOrderByWithAggregationInput[]
    by: TransaccionScalarFieldEnum[] | TransaccionScalarFieldEnum
    having?: TransaccionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TransaccionCountAggregateInputType | true
    _avg?: TransaccionAvgAggregateInputType
    _sum?: TransaccionSumAggregateInputType
    _min?: TransaccionMinAggregateInputType
    _max?: TransaccionMaxAggregateInputType
  }

  export type TransaccionGroupByOutputType = {
    idTransaccion: number
    idSolicitud: number
    monto: Decimal
    metodoPago: $Enums.MetodoPago
    estadoPago: $Enums.EstadoPago
    fechaPago: Date | null
    createdAt: Date
    updatedAt: Date
    _count: TransaccionCountAggregateOutputType | null
    _avg: TransaccionAvgAggregateOutputType | null
    _sum: TransaccionSumAggregateOutputType | null
    _min: TransaccionMinAggregateOutputType | null
    _max: TransaccionMaxAggregateOutputType | null
  }

  type GetTransaccionGroupByPayload<T extends TransaccionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TransaccionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TransaccionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TransaccionGroupByOutputType[P]>
            : GetScalarType<T[P], TransaccionGroupByOutputType[P]>
        }
      >
    >


  export type TransaccionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idTransaccion?: boolean
    idSolicitud?: boolean
    monto?: boolean
    metodoPago?: boolean
    estadoPago?: boolean
    fechaPago?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaccion"]>

  export type TransaccionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idTransaccion?: boolean
    idSolicitud?: boolean
    monto?: boolean
    metodoPago?: boolean
    estadoPago?: boolean
    fechaPago?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaccion"]>

  export type TransaccionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idTransaccion?: boolean
    idSolicitud?: boolean
    monto?: boolean
    metodoPago?: boolean
    estadoPago?: boolean
    fechaPago?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["transaccion"]>

  export type TransaccionSelectScalar = {
    idTransaccion?: boolean
    idSolicitud?: boolean
    monto?: boolean
    metodoPago?: boolean
    estadoPago?: boolean
    fechaPago?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransaccionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idTransaccion" | "idSolicitud" | "monto" | "metodoPago" | "estadoPago" | "fechaPago" | "createdAt" | "updatedAt", ExtArgs["result"]["transaccion"]>
  export type TransaccionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }
  export type TransaccionIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }
  export type TransaccionIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    solicitud?: boolean | SolicitudDefaultArgs<ExtArgs>
  }

  export type $TransaccionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaccion"
    objects: {
      solicitud: Prisma.$SolicitudPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      idTransaccion: number
      idSolicitud: number
      monto: Prisma.Decimal
      metodoPago: $Enums.MetodoPago
      estadoPago: $Enums.EstadoPago
      fechaPago: Date | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["transaccion"]>
    composites: {}
  }

  type TransaccionGetPayload<S extends boolean | null | undefined | TransaccionDefaultArgs> = $Result.GetResult<Prisma.$TransaccionPayload, S>

  type TransaccionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<TransaccionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: TransaccionCountAggregateInputType | true
    }

  export interface TransaccionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Transaccion'], meta: { name: 'Transaccion' } }
    /**
     * Find zero or one Transaccion that matches the filter.
     * @param {TransaccionFindUniqueArgs} args - Arguments to find a Transaccion
     * @example
     * // Get one Transaccion
     * const transaccion = await prisma.transaccion.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TransaccionFindUniqueArgs>(args: SelectSubset<T, TransaccionFindUniqueArgs<ExtArgs>>): Prisma__TransaccionClient<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Transaccion that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {TransaccionFindUniqueOrThrowArgs} args - Arguments to find a Transaccion
     * @example
     * // Get one Transaccion
     * const transaccion = await prisma.transaccion.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TransaccionFindUniqueOrThrowArgs>(args: SelectSubset<T, TransaccionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TransaccionClient<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaccion that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaccionFindFirstArgs} args - Arguments to find a Transaccion
     * @example
     * // Get one Transaccion
     * const transaccion = await prisma.transaccion.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TransaccionFindFirstArgs>(args?: SelectSubset<T, TransaccionFindFirstArgs<ExtArgs>>): Prisma__TransaccionClient<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Transaccion that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaccionFindFirstOrThrowArgs} args - Arguments to find a Transaccion
     * @example
     * // Get one Transaccion
     * const transaccion = await prisma.transaccion.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TransaccionFindFirstOrThrowArgs>(args?: SelectSubset<T, TransaccionFindFirstOrThrowArgs<ExtArgs>>): Prisma__TransaccionClient<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Transaccions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaccionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Transaccions
     * const transaccions = await prisma.transaccion.findMany()
     * 
     * // Get first 10 Transaccions
     * const transaccions = await prisma.transaccion.findMany({ take: 10 })
     * 
     * // Only select the `idTransaccion`
     * const transaccionWithIdTransaccionOnly = await prisma.transaccion.findMany({ select: { idTransaccion: true } })
     * 
     */
    findMany<T extends TransaccionFindManyArgs>(args?: SelectSubset<T, TransaccionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Transaccion.
     * @param {TransaccionCreateArgs} args - Arguments to create a Transaccion.
     * @example
     * // Create one Transaccion
     * const Transaccion = await prisma.transaccion.create({
     *   data: {
     *     // ... data to create a Transaccion
     *   }
     * })
     * 
     */
    create<T extends TransaccionCreateArgs>(args: SelectSubset<T, TransaccionCreateArgs<ExtArgs>>): Prisma__TransaccionClient<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Transaccions.
     * @param {TransaccionCreateManyArgs} args - Arguments to create many Transaccions.
     * @example
     * // Create many Transaccions
     * const transaccion = await prisma.transaccion.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TransaccionCreateManyArgs>(args?: SelectSubset<T, TransaccionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Transaccions and returns the data saved in the database.
     * @param {TransaccionCreateManyAndReturnArgs} args - Arguments to create many Transaccions.
     * @example
     * // Create many Transaccions
     * const transaccion = await prisma.transaccion.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Transaccions and only return the `idTransaccion`
     * const transaccionWithIdTransaccionOnly = await prisma.transaccion.createManyAndReturn({
     *   select: { idTransaccion: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends TransaccionCreateManyAndReturnArgs>(args?: SelectSubset<T, TransaccionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Transaccion.
     * @param {TransaccionDeleteArgs} args - Arguments to delete one Transaccion.
     * @example
     * // Delete one Transaccion
     * const Transaccion = await prisma.transaccion.delete({
     *   where: {
     *     // ... filter to delete one Transaccion
     *   }
     * })
     * 
     */
    delete<T extends TransaccionDeleteArgs>(args: SelectSubset<T, TransaccionDeleteArgs<ExtArgs>>): Prisma__TransaccionClient<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Transaccion.
     * @param {TransaccionUpdateArgs} args - Arguments to update one Transaccion.
     * @example
     * // Update one Transaccion
     * const transaccion = await prisma.transaccion.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TransaccionUpdateArgs>(args: SelectSubset<T, TransaccionUpdateArgs<ExtArgs>>): Prisma__TransaccionClient<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Transaccions.
     * @param {TransaccionDeleteManyArgs} args - Arguments to filter Transaccions to delete.
     * @example
     * // Delete a few Transaccions
     * const { count } = await prisma.transaccion.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TransaccionDeleteManyArgs>(args?: SelectSubset<T, TransaccionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transaccions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaccionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Transaccions
     * const transaccion = await prisma.transaccion.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TransaccionUpdateManyArgs>(args: SelectSubset<T, TransaccionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Transaccions and returns the data updated in the database.
     * @param {TransaccionUpdateManyAndReturnArgs} args - Arguments to update many Transaccions.
     * @example
     * // Update many Transaccions
     * const transaccion = await prisma.transaccion.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Transaccions and only return the `idTransaccion`
     * const transaccionWithIdTransaccionOnly = await prisma.transaccion.updateManyAndReturn({
     *   select: { idTransaccion: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends TransaccionUpdateManyAndReturnArgs>(args: SelectSubset<T, TransaccionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Transaccion.
     * @param {TransaccionUpsertArgs} args - Arguments to update or create a Transaccion.
     * @example
     * // Update or create a Transaccion
     * const transaccion = await prisma.transaccion.upsert({
     *   create: {
     *     // ... data to create a Transaccion
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Transaccion we want to update
     *   }
     * })
     */
    upsert<T extends TransaccionUpsertArgs>(args: SelectSubset<T, TransaccionUpsertArgs<ExtArgs>>): Prisma__TransaccionClient<$Result.GetResult<Prisma.$TransaccionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Transaccions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaccionCountArgs} args - Arguments to filter Transaccions to count.
     * @example
     * // Count the number of Transaccions
     * const count = await prisma.transaccion.count({
     *   where: {
     *     // ... the filter for the Transaccions we want to count
     *   }
     * })
    **/
    count<T extends TransaccionCountArgs>(
      args?: Subset<T, TransaccionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TransaccionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Transaccion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaccionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TransaccionAggregateArgs>(args: Subset<T, TransaccionAggregateArgs>): Prisma.PrismaPromise<GetTransaccionAggregateType<T>>

    /**
     * Group by Transaccion.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TransaccionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TransaccionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TransaccionGroupByArgs['orderBy'] }
        : { orderBy?: TransaccionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TransaccionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTransaccionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Transaccion model
   */
  readonly fields: TransaccionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Transaccion.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TransaccionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    solicitud<T extends SolicitudDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SolicitudDefaultArgs<ExtArgs>>): Prisma__SolicitudClient<$Result.GetResult<Prisma.$SolicitudPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Transaccion model
   */
  interface TransaccionFieldRefs {
    readonly idTransaccion: FieldRef<"Transaccion", 'Int'>
    readonly idSolicitud: FieldRef<"Transaccion", 'Int'>
    readonly monto: FieldRef<"Transaccion", 'Decimal'>
    readonly metodoPago: FieldRef<"Transaccion", 'MetodoPago'>
    readonly estadoPago: FieldRef<"Transaccion", 'EstadoPago'>
    readonly fechaPago: FieldRef<"Transaccion", 'DateTime'>
    readonly createdAt: FieldRef<"Transaccion", 'DateTime'>
    readonly updatedAt: FieldRef<"Transaccion", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Transaccion findUnique
   */
  export type TransaccionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
    /**
     * Filter, which Transaccion to fetch.
     */
    where: TransaccionWhereUniqueInput
  }

  /**
   * Transaccion findUniqueOrThrow
   */
  export type TransaccionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
    /**
     * Filter, which Transaccion to fetch.
     */
    where: TransaccionWhereUniqueInput
  }

  /**
   * Transaccion findFirst
   */
  export type TransaccionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
    /**
     * Filter, which Transaccion to fetch.
     */
    where?: TransaccionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transaccions to fetch.
     */
    orderBy?: TransaccionOrderByWithRelationInput | TransaccionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transaccions.
     */
    cursor?: TransaccionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transaccions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transaccions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transaccions.
     */
    distinct?: TransaccionScalarFieldEnum | TransaccionScalarFieldEnum[]
  }

  /**
   * Transaccion findFirstOrThrow
   */
  export type TransaccionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
    /**
     * Filter, which Transaccion to fetch.
     */
    where?: TransaccionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transaccions to fetch.
     */
    orderBy?: TransaccionOrderByWithRelationInput | TransaccionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Transaccions.
     */
    cursor?: TransaccionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transaccions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transaccions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Transaccions.
     */
    distinct?: TransaccionScalarFieldEnum | TransaccionScalarFieldEnum[]
  }

  /**
   * Transaccion findMany
   */
  export type TransaccionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
    /**
     * Filter, which Transaccions to fetch.
     */
    where?: TransaccionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Transaccions to fetch.
     */
    orderBy?: TransaccionOrderByWithRelationInput | TransaccionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Transaccions.
     */
    cursor?: TransaccionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Transaccions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Transaccions.
     */
    skip?: number
    distinct?: TransaccionScalarFieldEnum | TransaccionScalarFieldEnum[]
  }

  /**
   * Transaccion create
   */
  export type TransaccionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
    /**
     * The data needed to create a Transaccion.
     */
    data: XOR<TransaccionCreateInput, TransaccionUncheckedCreateInput>
  }

  /**
   * Transaccion createMany
   */
  export type TransaccionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Transaccions.
     */
    data: TransaccionCreateManyInput | TransaccionCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Transaccion createManyAndReturn
   */
  export type TransaccionCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * The data used to create many Transaccions.
     */
    data: TransaccionCreateManyInput | TransaccionCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaccion update
   */
  export type TransaccionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
    /**
     * The data needed to update a Transaccion.
     */
    data: XOR<TransaccionUpdateInput, TransaccionUncheckedUpdateInput>
    /**
     * Choose, which Transaccion to update.
     */
    where: TransaccionWhereUniqueInput
  }

  /**
   * Transaccion updateMany
   */
  export type TransaccionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Transaccions.
     */
    data: XOR<TransaccionUpdateManyMutationInput, TransaccionUncheckedUpdateManyInput>
    /**
     * Filter which Transaccions to update
     */
    where?: TransaccionWhereInput
    /**
     * Limit how many Transaccions to update.
     */
    limit?: number
  }

  /**
   * Transaccion updateManyAndReturn
   */
  export type TransaccionUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * The data used to update Transaccions.
     */
    data: XOR<TransaccionUpdateManyMutationInput, TransaccionUncheckedUpdateManyInput>
    /**
     * Filter which Transaccions to update
     */
    where?: TransaccionWhereInput
    /**
     * Limit how many Transaccions to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * Transaccion upsert
   */
  export type TransaccionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
    /**
     * The filter to search for the Transaccion to update in case it exists.
     */
    where: TransaccionWhereUniqueInput
    /**
     * In case the Transaccion found by the `where` argument doesn't exist, create a new Transaccion with this data.
     */
    create: XOR<TransaccionCreateInput, TransaccionUncheckedCreateInput>
    /**
     * In case the Transaccion was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TransaccionUpdateInput, TransaccionUncheckedUpdateInput>
  }

  /**
   * Transaccion delete
   */
  export type TransaccionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
    /**
     * Filter which Transaccion to delete.
     */
    where: TransaccionWhereUniqueInput
  }

  /**
   * Transaccion deleteMany
   */
  export type TransaccionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Transaccions to delete
     */
    where?: TransaccionWhereInput
    /**
     * Limit how many Transaccions to delete.
     */
    limit?: number
  }

  /**
   * Transaccion without action
   */
  export type TransaccionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Transaccion
     */
    select?: TransaccionSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Transaccion
     */
    omit?: TransaccionOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TransaccionInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const SolicitudScalarFieldEnum: {
    idSolicitud: 'idSolicitud',
    idUser: 'idUser',
    idTipoServicio: 'idTipoServicio',
    codigoParroquia: 'codigoParroquia',
    tituloProblema: 'tituloProblema',
    descripcionProblema: 'descripcionProblema',
    costoEstimado: 'costoEstimado',
    costoPromocion: 'costoPromocion',
    promocion: 'promocion',
    estadoSolicitud: 'estadoSolicitud',
    fechaProgramada: 'fechaProgramada',
    fechaPublicacion: 'fechaPublicacion',
    fechaInicio: 'fechaInicio',
    fechaFinalizacion: 'fechaFinalizacion',
    duracionEstimadaMin: 'duracionEstimadaMin',
    isActive: 'isActive',
    deletedAt: 'deletedAt',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
    createdBy: 'createdBy',
    updatedBy: 'updatedBy'
  };

  export type SolicitudScalarFieldEnum = (typeof SolicitudScalarFieldEnum)[keyof typeof SolicitudScalarFieldEnum]


  export const SolicitudTecnicoScalarFieldEnum: {
    idSolTec: 'idSolTec',
    idSolicitud: 'idSolicitud',
    idTecnico: 'idTecnico',
    costoAcordado: 'costoAcordado',
    estadoAcuerdo: 'estadoAcuerdo',
    fechaPropuesta: 'fechaPropuesta',
    fechaConfirmada: 'fechaConfirmada',
    notas: 'notas',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SolicitudTecnicoScalarFieldEnum = (typeof SolicitudTecnicoScalarFieldEnum)[keyof typeof SolicitudTecnicoScalarFieldEnum]


  export const CalificacionScalarFieldEnum: {
    idCalificacion: 'idCalificacion',
    idSolicitud: 'idSolicitud',
    idTecnico: 'idTecnico',
    puntaje: 'puntaje',
    comentario: 'comentario',
    fechaCalificacion: 'fechaCalificacion',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type CalificacionScalarFieldEnum = (typeof CalificacionScalarFieldEnum)[keyof typeof CalificacionScalarFieldEnum]


  export const TransaccionScalarFieldEnum: {
    idTransaccion: 'idTransaccion',
    idSolicitud: 'idSolicitud',
    monto: 'monto',
    metodoPago: 'metodoPago',
    estadoPago: 'estadoPago',
    fechaPago: 'fechaPago',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TransaccionScalarFieldEnum = (typeof TransaccionScalarFieldEnum)[keyof typeof TransaccionScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'EstadoSolicitud'
   */
  export type EnumEstadoSolicitudFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoSolicitud'>
    


  /**
   * Reference to a field of type 'EstadoSolicitud[]'
   */
  export type ListEnumEstadoSolicitudFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoSolicitud[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'EstadoAceptacion'
   */
  export type EnumEstadoAceptacionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoAceptacion'>
    


  /**
   * Reference to a field of type 'EstadoAceptacion[]'
   */
  export type ListEnumEstadoAceptacionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoAceptacion[]'>
    


  /**
   * Reference to a field of type 'PuntajeCalificacion'
   */
  export type EnumPuntajeCalificacionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PuntajeCalificacion'>
    


  /**
   * Reference to a field of type 'PuntajeCalificacion[]'
   */
  export type ListEnumPuntajeCalificacionFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PuntajeCalificacion[]'>
    


  /**
   * Reference to a field of type 'MetodoPago'
   */
  export type EnumMetodoPagoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MetodoPago'>
    


  /**
   * Reference to a field of type 'MetodoPago[]'
   */
  export type ListEnumMetodoPagoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'MetodoPago[]'>
    


  /**
   * Reference to a field of type 'EstadoPago'
   */
  export type EnumEstadoPagoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoPago'>
    


  /**
   * Reference to a field of type 'EstadoPago[]'
   */
  export type ListEnumEstadoPagoFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'EstadoPago[]'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type SolicitudWhereInput = {
    AND?: SolicitudWhereInput | SolicitudWhereInput[]
    OR?: SolicitudWhereInput[]
    NOT?: SolicitudWhereInput | SolicitudWhereInput[]
    idSolicitud?: IntFilter<"Solicitud"> | number
    idUser?: IntFilter<"Solicitud"> | number
    idTipoServicio?: IntFilter<"Solicitud"> | number
    codigoParroquia?: StringFilter<"Solicitud"> | string
    tituloProblema?: StringFilter<"Solicitud"> | string
    descripcionProblema?: StringFilter<"Solicitud"> | string
    costoEstimado?: DecimalNullableFilter<"Solicitud"> | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: DecimalNullableFilter<"Solicitud"> | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFilter<"Solicitud"> | boolean
    estadoSolicitud?: EnumEstadoSolicitudFilter<"Solicitud"> | $Enums.EstadoSolicitud
    fechaProgramada?: DateTimeNullableFilter<"Solicitud"> | Date | string | null
    fechaPublicacion?: DateTimeFilter<"Solicitud"> | Date | string
    fechaInicio?: DateTimeNullableFilter<"Solicitud"> | Date | string | null
    fechaFinalizacion?: DateTimeNullableFilter<"Solicitud"> | Date | string | null
    duracionEstimadaMin?: IntNullableFilter<"Solicitud"> | number | null
    isActive?: BoolFilter<"Solicitud"> | boolean
    deletedAt?: DateTimeNullableFilter<"Solicitud"> | Date | string | null
    createdAt?: DateTimeFilter<"Solicitud"> | Date | string
    updatedAt?: DateTimeFilter<"Solicitud"> | Date | string
    createdBy?: IntNullableFilter<"Solicitud"> | number | null
    updatedBy?: IntNullableFilter<"Solicitud"> | number | null
    solicitudesTecnico?: SolicitudTecnicoListRelationFilter
    calificaciones?: CalificacionListRelationFilter
    transacciones?: TransaccionListRelationFilter
  }

  export type SolicitudOrderByWithRelationInput = {
    idSolicitud?: SortOrder
    idUser?: SortOrder
    idTipoServicio?: SortOrder
    codigoParroquia?: SortOrder
    tituloProblema?: SortOrder
    descripcionProblema?: SortOrder
    costoEstimado?: SortOrderInput | SortOrder
    costoPromocion?: SortOrderInput | SortOrder
    promocion?: SortOrder
    estadoSolicitud?: SortOrder
    fechaProgramada?: SortOrderInput | SortOrder
    fechaPublicacion?: SortOrder
    fechaInicio?: SortOrderInput | SortOrder
    fechaFinalizacion?: SortOrderInput | SortOrder
    duracionEstimadaMin?: SortOrderInput | SortOrder
    isActive?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    solicitudesTecnico?: SolicitudTecnicoOrderByRelationAggregateInput
    calificaciones?: CalificacionOrderByRelationAggregateInput
    transacciones?: TransaccionOrderByRelationAggregateInput
  }

  export type SolicitudWhereUniqueInput = Prisma.AtLeast<{
    idSolicitud?: number
    AND?: SolicitudWhereInput | SolicitudWhereInput[]
    OR?: SolicitudWhereInput[]
    NOT?: SolicitudWhereInput | SolicitudWhereInput[]
    idUser?: IntFilter<"Solicitud"> | number
    idTipoServicio?: IntFilter<"Solicitud"> | number
    codigoParroquia?: StringFilter<"Solicitud"> | string
    tituloProblema?: StringFilter<"Solicitud"> | string
    descripcionProblema?: StringFilter<"Solicitud"> | string
    costoEstimado?: DecimalNullableFilter<"Solicitud"> | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: DecimalNullableFilter<"Solicitud"> | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFilter<"Solicitud"> | boolean
    estadoSolicitud?: EnumEstadoSolicitudFilter<"Solicitud"> | $Enums.EstadoSolicitud
    fechaProgramada?: DateTimeNullableFilter<"Solicitud"> | Date | string | null
    fechaPublicacion?: DateTimeFilter<"Solicitud"> | Date | string
    fechaInicio?: DateTimeNullableFilter<"Solicitud"> | Date | string | null
    fechaFinalizacion?: DateTimeNullableFilter<"Solicitud"> | Date | string | null
    duracionEstimadaMin?: IntNullableFilter<"Solicitud"> | number | null
    isActive?: BoolFilter<"Solicitud"> | boolean
    deletedAt?: DateTimeNullableFilter<"Solicitud"> | Date | string | null
    createdAt?: DateTimeFilter<"Solicitud"> | Date | string
    updatedAt?: DateTimeFilter<"Solicitud"> | Date | string
    createdBy?: IntNullableFilter<"Solicitud"> | number | null
    updatedBy?: IntNullableFilter<"Solicitud"> | number | null
    solicitudesTecnico?: SolicitudTecnicoListRelationFilter
    calificaciones?: CalificacionListRelationFilter
    transacciones?: TransaccionListRelationFilter
  }, "idSolicitud">

  export type SolicitudOrderByWithAggregationInput = {
    idSolicitud?: SortOrder
    idUser?: SortOrder
    idTipoServicio?: SortOrder
    codigoParroquia?: SortOrder
    tituloProblema?: SortOrder
    descripcionProblema?: SortOrder
    costoEstimado?: SortOrderInput | SortOrder
    costoPromocion?: SortOrderInput | SortOrder
    promocion?: SortOrder
    estadoSolicitud?: SortOrder
    fechaProgramada?: SortOrderInput | SortOrder
    fechaPublicacion?: SortOrder
    fechaInicio?: SortOrderInput | SortOrder
    fechaFinalizacion?: SortOrderInput | SortOrder
    duracionEstimadaMin?: SortOrderInput | SortOrder
    isActive?: SortOrder
    deletedAt?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrderInput | SortOrder
    updatedBy?: SortOrderInput | SortOrder
    _count?: SolicitudCountOrderByAggregateInput
    _avg?: SolicitudAvgOrderByAggregateInput
    _max?: SolicitudMaxOrderByAggregateInput
    _min?: SolicitudMinOrderByAggregateInput
    _sum?: SolicitudSumOrderByAggregateInput
  }

  export type SolicitudScalarWhereWithAggregatesInput = {
    AND?: SolicitudScalarWhereWithAggregatesInput | SolicitudScalarWhereWithAggregatesInput[]
    OR?: SolicitudScalarWhereWithAggregatesInput[]
    NOT?: SolicitudScalarWhereWithAggregatesInput | SolicitudScalarWhereWithAggregatesInput[]
    idSolicitud?: IntWithAggregatesFilter<"Solicitud"> | number
    idUser?: IntWithAggregatesFilter<"Solicitud"> | number
    idTipoServicio?: IntWithAggregatesFilter<"Solicitud"> | number
    codigoParroquia?: StringWithAggregatesFilter<"Solicitud"> | string
    tituloProblema?: StringWithAggregatesFilter<"Solicitud"> | string
    descripcionProblema?: StringWithAggregatesFilter<"Solicitud"> | string
    costoEstimado?: DecimalNullableWithAggregatesFilter<"Solicitud"> | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: DecimalNullableWithAggregatesFilter<"Solicitud"> | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolWithAggregatesFilter<"Solicitud"> | boolean
    estadoSolicitud?: EnumEstadoSolicitudWithAggregatesFilter<"Solicitud"> | $Enums.EstadoSolicitud
    fechaProgramada?: DateTimeNullableWithAggregatesFilter<"Solicitud"> | Date | string | null
    fechaPublicacion?: DateTimeWithAggregatesFilter<"Solicitud"> | Date | string
    fechaInicio?: DateTimeNullableWithAggregatesFilter<"Solicitud"> | Date | string | null
    fechaFinalizacion?: DateTimeNullableWithAggregatesFilter<"Solicitud"> | Date | string | null
    duracionEstimadaMin?: IntNullableWithAggregatesFilter<"Solicitud"> | number | null
    isActive?: BoolWithAggregatesFilter<"Solicitud"> | boolean
    deletedAt?: DateTimeNullableWithAggregatesFilter<"Solicitud"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Solicitud"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Solicitud"> | Date | string
    createdBy?: IntNullableWithAggregatesFilter<"Solicitud"> | number | null
    updatedBy?: IntNullableWithAggregatesFilter<"Solicitud"> | number | null
  }

  export type SolicitudTecnicoWhereInput = {
    AND?: SolicitudTecnicoWhereInput | SolicitudTecnicoWhereInput[]
    OR?: SolicitudTecnicoWhereInput[]
    NOT?: SolicitudTecnicoWhereInput | SolicitudTecnicoWhereInput[]
    idSolTec?: IntFilter<"SolicitudTecnico"> | number
    idSolicitud?: IntFilter<"SolicitudTecnico"> | number
    idTecnico?: IntFilter<"SolicitudTecnico"> | number
    costoAcordado?: DecimalNullableFilter<"SolicitudTecnico"> | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionFilter<"SolicitudTecnico"> | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeFilter<"SolicitudTecnico"> | Date | string
    fechaConfirmada?: DateTimeNullableFilter<"SolicitudTecnico"> | Date | string | null
    notas?: StringNullableFilter<"SolicitudTecnico"> | string | null
    createdAt?: DateTimeFilter<"SolicitudTecnico"> | Date | string
    updatedAt?: DateTimeFilter<"SolicitudTecnico"> | Date | string
    solicitud?: XOR<SolicitudScalarRelationFilter, SolicitudWhereInput>
  }

  export type SolicitudTecnicoOrderByWithRelationInput = {
    idSolTec?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    costoAcordado?: SortOrderInput | SortOrder
    estadoAcuerdo?: SortOrder
    fechaPropuesta?: SortOrder
    fechaConfirmada?: SortOrderInput | SortOrder
    notas?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    solicitud?: SolicitudOrderByWithRelationInput
  }

  export type SolicitudTecnicoWhereUniqueInput = Prisma.AtLeast<{
    idSolTec?: number
    idSolicitud_idTecnico?: SolicitudTecnicoIdSolicitudIdTecnicoCompoundUniqueInput
    AND?: SolicitudTecnicoWhereInput | SolicitudTecnicoWhereInput[]
    OR?: SolicitudTecnicoWhereInput[]
    NOT?: SolicitudTecnicoWhereInput | SolicitudTecnicoWhereInput[]
    idSolicitud?: IntFilter<"SolicitudTecnico"> | number
    idTecnico?: IntFilter<"SolicitudTecnico"> | number
    costoAcordado?: DecimalNullableFilter<"SolicitudTecnico"> | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionFilter<"SolicitudTecnico"> | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeFilter<"SolicitudTecnico"> | Date | string
    fechaConfirmada?: DateTimeNullableFilter<"SolicitudTecnico"> | Date | string | null
    notas?: StringNullableFilter<"SolicitudTecnico"> | string | null
    createdAt?: DateTimeFilter<"SolicitudTecnico"> | Date | string
    updatedAt?: DateTimeFilter<"SolicitudTecnico"> | Date | string
    solicitud?: XOR<SolicitudScalarRelationFilter, SolicitudWhereInput>
  }, "idSolTec" | "idSolicitud_idTecnico">

  export type SolicitudTecnicoOrderByWithAggregationInput = {
    idSolTec?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    costoAcordado?: SortOrderInput | SortOrder
    estadoAcuerdo?: SortOrder
    fechaPropuesta?: SortOrder
    fechaConfirmada?: SortOrderInput | SortOrder
    notas?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SolicitudTecnicoCountOrderByAggregateInput
    _avg?: SolicitudTecnicoAvgOrderByAggregateInput
    _max?: SolicitudTecnicoMaxOrderByAggregateInput
    _min?: SolicitudTecnicoMinOrderByAggregateInput
    _sum?: SolicitudTecnicoSumOrderByAggregateInput
  }

  export type SolicitudTecnicoScalarWhereWithAggregatesInput = {
    AND?: SolicitudTecnicoScalarWhereWithAggregatesInput | SolicitudTecnicoScalarWhereWithAggregatesInput[]
    OR?: SolicitudTecnicoScalarWhereWithAggregatesInput[]
    NOT?: SolicitudTecnicoScalarWhereWithAggregatesInput | SolicitudTecnicoScalarWhereWithAggregatesInput[]
    idSolTec?: IntWithAggregatesFilter<"SolicitudTecnico"> | number
    idSolicitud?: IntWithAggregatesFilter<"SolicitudTecnico"> | number
    idTecnico?: IntWithAggregatesFilter<"SolicitudTecnico"> | number
    costoAcordado?: DecimalNullableWithAggregatesFilter<"SolicitudTecnico"> | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionWithAggregatesFilter<"SolicitudTecnico"> | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeWithAggregatesFilter<"SolicitudTecnico"> | Date | string
    fechaConfirmada?: DateTimeNullableWithAggregatesFilter<"SolicitudTecnico"> | Date | string | null
    notas?: StringNullableWithAggregatesFilter<"SolicitudTecnico"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SolicitudTecnico"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SolicitudTecnico"> | Date | string
  }

  export type CalificacionWhereInput = {
    AND?: CalificacionWhereInput | CalificacionWhereInput[]
    OR?: CalificacionWhereInput[]
    NOT?: CalificacionWhereInput | CalificacionWhereInput[]
    idCalificacion?: IntFilter<"Calificacion"> | number
    idSolicitud?: IntFilter<"Calificacion"> | number
    idTecnico?: IntFilter<"Calificacion"> | number
    puntaje?: EnumPuntajeCalificacionFilter<"Calificacion"> | $Enums.PuntajeCalificacion
    comentario?: StringNullableFilter<"Calificacion"> | string | null
    fechaCalificacion?: DateTimeFilter<"Calificacion"> | Date | string
    createdAt?: DateTimeFilter<"Calificacion"> | Date | string
    updatedAt?: DateTimeFilter<"Calificacion"> | Date | string
    solicitud?: XOR<SolicitudScalarRelationFilter, SolicitudWhereInput>
  }

  export type CalificacionOrderByWithRelationInput = {
    idCalificacion?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    puntaje?: SortOrder
    comentario?: SortOrderInput | SortOrder
    fechaCalificacion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    solicitud?: SolicitudOrderByWithRelationInput
  }

  export type CalificacionWhereUniqueInput = Prisma.AtLeast<{
    idCalificacion?: number
    AND?: CalificacionWhereInput | CalificacionWhereInput[]
    OR?: CalificacionWhereInput[]
    NOT?: CalificacionWhereInput | CalificacionWhereInput[]
    idSolicitud?: IntFilter<"Calificacion"> | number
    idTecnico?: IntFilter<"Calificacion"> | number
    puntaje?: EnumPuntajeCalificacionFilter<"Calificacion"> | $Enums.PuntajeCalificacion
    comentario?: StringNullableFilter<"Calificacion"> | string | null
    fechaCalificacion?: DateTimeFilter<"Calificacion"> | Date | string
    createdAt?: DateTimeFilter<"Calificacion"> | Date | string
    updatedAt?: DateTimeFilter<"Calificacion"> | Date | string
    solicitud?: XOR<SolicitudScalarRelationFilter, SolicitudWhereInput>
  }, "idCalificacion">

  export type CalificacionOrderByWithAggregationInput = {
    idCalificacion?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    puntaje?: SortOrder
    comentario?: SortOrderInput | SortOrder
    fechaCalificacion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: CalificacionCountOrderByAggregateInput
    _avg?: CalificacionAvgOrderByAggregateInput
    _max?: CalificacionMaxOrderByAggregateInput
    _min?: CalificacionMinOrderByAggregateInput
    _sum?: CalificacionSumOrderByAggregateInput
  }

  export type CalificacionScalarWhereWithAggregatesInput = {
    AND?: CalificacionScalarWhereWithAggregatesInput | CalificacionScalarWhereWithAggregatesInput[]
    OR?: CalificacionScalarWhereWithAggregatesInput[]
    NOT?: CalificacionScalarWhereWithAggregatesInput | CalificacionScalarWhereWithAggregatesInput[]
    idCalificacion?: IntWithAggregatesFilter<"Calificacion"> | number
    idSolicitud?: IntWithAggregatesFilter<"Calificacion"> | number
    idTecnico?: IntWithAggregatesFilter<"Calificacion"> | number
    puntaje?: EnumPuntajeCalificacionWithAggregatesFilter<"Calificacion"> | $Enums.PuntajeCalificacion
    comentario?: StringNullableWithAggregatesFilter<"Calificacion"> | string | null
    fechaCalificacion?: DateTimeWithAggregatesFilter<"Calificacion"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"Calificacion"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Calificacion"> | Date | string
  }

  export type TransaccionWhereInput = {
    AND?: TransaccionWhereInput | TransaccionWhereInput[]
    OR?: TransaccionWhereInput[]
    NOT?: TransaccionWhereInput | TransaccionWhereInput[]
    idTransaccion?: IntFilter<"Transaccion"> | number
    idSolicitud?: IntFilter<"Transaccion"> | number
    monto?: DecimalFilter<"Transaccion"> | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFilter<"Transaccion"> | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFilter<"Transaccion"> | $Enums.EstadoPago
    fechaPago?: DateTimeNullableFilter<"Transaccion"> | Date | string | null
    createdAt?: DateTimeFilter<"Transaccion"> | Date | string
    updatedAt?: DateTimeFilter<"Transaccion"> | Date | string
    solicitud?: XOR<SolicitudScalarRelationFilter, SolicitudWhereInput>
  }

  export type TransaccionOrderByWithRelationInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
    metodoPago?: SortOrder
    estadoPago?: SortOrder
    fechaPago?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    solicitud?: SolicitudOrderByWithRelationInput
  }

  export type TransaccionWhereUniqueInput = Prisma.AtLeast<{
    idTransaccion?: number
    AND?: TransaccionWhereInput | TransaccionWhereInput[]
    OR?: TransaccionWhereInput[]
    NOT?: TransaccionWhereInput | TransaccionWhereInput[]
    idSolicitud?: IntFilter<"Transaccion"> | number
    monto?: DecimalFilter<"Transaccion"> | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFilter<"Transaccion"> | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFilter<"Transaccion"> | $Enums.EstadoPago
    fechaPago?: DateTimeNullableFilter<"Transaccion"> | Date | string | null
    createdAt?: DateTimeFilter<"Transaccion"> | Date | string
    updatedAt?: DateTimeFilter<"Transaccion"> | Date | string
    solicitud?: XOR<SolicitudScalarRelationFilter, SolicitudWhereInput>
  }, "idTransaccion">

  export type TransaccionOrderByWithAggregationInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
    metodoPago?: SortOrder
    estadoPago?: SortOrder
    fechaPago?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TransaccionCountOrderByAggregateInput
    _avg?: TransaccionAvgOrderByAggregateInput
    _max?: TransaccionMaxOrderByAggregateInput
    _min?: TransaccionMinOrderByAggregateInput
    _sum?: TransaccionSumOrderByAggregateInput
  }

  export type TransaccionScalarWhereWithAggregatesInput = {
    AND?: TransaccionScalarWhereWithAggregatesInput | TransaccionScalarWhereWithAggregatesInput[]
    OR?: TransaccionScalarWhereWithAggregatesInput[]
    NOT?: TransaccionScalarWhereWithAggregatesInput | TransaccionScalarWhereWithAggregatesInput[]
    idTransaccion?: IntWithAggregatesFilter<"Transaccion"> | number
    idSolicitud?: IntWithAggregatesFilter<"Transaccion"> | number
    monto?: DecimalWithAggregatesFilter<"Transaccion"> | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoWithAggregatesFilter<"Transaccion"> | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoWithAggregatesFilter<"Transaccion"> | $Enums.EstadoPago
    fechaPago?: DateTimeNullableWithAggregatesFilter<"Transaccion"> | Date | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Transaccion"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaccion"> | Date | string
  }

  export type SolicitudCreateInput = {
    idUser: number
    idTipoServicio: number
    codigoParroquia: string
    tituloProblema: string
    descripcionProblema: string
    costoEstimado?: Decimal | DecimalJsLike | number | string | null
    costoPromocion?: Decimal | DecimalJsLike | number | string | null
    promocion?: boolean
    estadoSolicitud: $Enums.EstadoSolicitud
    fechaProgramada?: Date | string | null
    fechaPublicacion?: Date | string
    fechaInicio?: Date | string | null
    fechaFinalizacion?: Date | string | null
    duracionEstimadaMin?: number | null
    isActive?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: number | null
    updatedBy?: number | null
    solicitudesTecnico?: SolicitudTecnicoCreateNestedManyWithoutSolicitudInput
    calificaciones?: CalificacionCreateNestedManyWithoutSolicitudInput
    transacciones?: TransaccionCreateNestedManyWithoutSolicitudInput
  }

  export type SolicitudUncheckedCreateInput = {
    idSolicitud?: number
    idUser: number
    idTipoServicio: number
    codigoParroquia: string
    tituloProblema: string
    descripcionProblema: string
    costoEstimado?: Decimal | DecimalJsLike | number | string | null
    costoPromocion?: Decimal | DecimalJsLike | number | string | null
    promocion?: boolean
    estadoSolicitud: $Enums.EstadoSolicitud
    fechaProgramada?: Date | string | null
    fechaPublicacion?: Date | string
    fechaInicio?: Date | string | null
    fechaFinalizacion?: Date | string | null
    duracionEstimadaMin?: number | null
    isActive?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: number | null
    updatedBy?: number | null
    solicitudesTecnico?: SolicitudTecnicoUncheckedCreateNestedManyWithoutSolicitudInput
    calificaciones?: CalificacionUncheckedCreateNestedManyWithoutSolicitudInput
    transacciones?: TransaccionUncheckedCreateNestedManyWithoutSolicitudInput
  }

  export type SolicitudUpdateInput = {
    idUser?: IntFieldUpdateOperationsInput | number
    idTipoServicio?: IntFieldUpdateOperationsInput | number
    codigoParroquia?: StringFieldUpdateOperationsInput | string
    tituloProblema?: StringFieldUpdateOperationsInput | string
    descripcionProblema?: StringFieldUpdateOperationsInput | string
    costoEstimado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFieldUpdateOperationsInput | boolean
    estadoSolicitud?: EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
    fechaProgramada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaPublicacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaFinalizacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duracionEstimadaMin?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    solicitudesTecnico?: SolicitudTecnicoUpdateManyWithoutSolicitudNestedInput
    calificaciones?: CalificacionUpdateManyWithoutSolicitudNestedInput
    transacciones?: TransaccionUpdateManyWithoutSolicitudNestedInput
  }

  export type SolicitudUncheckedUpdateInput = {
    idSolicitud?: IntFieldUpdateOperationsInput | number
    idUser?: IntFieldUpdateOperationsInput | number
    idTipoServicio?: IntFieldUpdateOperationsInput | number
    codigoParroquia?: StringFieldUpdateOperationsInput | string
    tituloProblema?: StringFieldUpdateOperationsInput | string
    descripcionProblema?: StringFieldUpdateOperationsInput | string
    costoEstimado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFieldUpdateOperationsInput | boolean
    estadoSolicitud?: EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
    fechaProgramada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaPublicacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaFinalizacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duracionEstimadaMin?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    solicitudesTecnico?: SolicitudTecnicoUncheckedUpdateManyWithoutSolicitudNestedInput
    calificaciones?: CalificacionUncheckedUpdateManyWithoutSolicitudNestedInput
    transacciones?: TransaccionUncheckedUpdateManyWithoutSolicitudNestedInput
  }

  export type SolicitudCreateManyInput = {
    idSolicitud?: number
    idUser: number
    idTipoServicio: number
    codigoParroquia: string
    tituloProblema: string
    descripcionProblema: string
    costoEstimado?: Decimal | DecimalJsLike | number | string | null
    costoPromocion?: Decimal | DecimalJsLike | number | string | null
    promocion?: boolean
    estadoSolicitud: $Enums.EstadoSolicitud
    fechaProgramada?: Date | string | null
    fechaPublicacion?: Date | string
    fechaInicio?: Date | string | null
    fechaFinalizacion?: Date | string | null
    duracionEstimadaMin?: number | null
    isActive?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: number | null
    updatedBy?: number | null
  }

  export type SolicitudUpdateManyMutationInput = {
    idUser?: IntFieldUpdateOperationsInput | number
    idTipoServicio?: IntFieldUpdateOperationsInput | number
    codigoParroquia?: StringFieldUpdateOperationsInput | string
    tituloProblema?: StringFieldUpdateOperationsInput | string
    descripcionProblema?: StringFieldUpdateOperationsInput | string
    costoEstimado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFieldUpdateOperationsInput | boolean
    estadoSolicitud?: EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
    fechaProgramada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaPublicacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaFinalizacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duracionEstimadaMin?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SolicitudUncheckedUpdateManyInput = {
    idSolicitud?: IntFieldUpdateOperationsInput | number
    idUser?: IntFieldUpdateOperationsInput | number
    idTipoServicio?: IntFieldUpdateOperationsInput | number
    codigoParroquia?: StringFieldUpdateOperationsInput | string
    tituloProblema?: StringFieldUpdateOperationsInput | string
    descripcionProblema?: StringFieldUpdateOperationsInput | string
    costoEstimado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFieldUpdateOperationsInput | boolean
    estadoSolicitud?: EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
    fechaProgramada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaPublicacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaFinalizacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duracionEstimadaMin?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
  }

  export type SolicitudTecnicoCreateInput = {
    idTecnico: number
    costoAcordado?: Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo: $Enums.EstadoAceptacion
    fechaPropuesta?: Date | string
    fechaConfirmada?: Date | string | null
    notas?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    solicitud: SolicitudCreateNestedOneWithoutSolicitudesTecnicoInput
  }

  export type SolicitudTecnicoUncheckedCreateInput = {
    idSolTec?: number
    idSolicitud: number
    idTecnico: number
    costoAcordado?: Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo: $Enums.EstadoAceptacion
    fechaPropuesta?: Date | string
    fechaConfirmada?: Date | string | null
    notas?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SolicitudTecnicoUpdateInput = {
    idTecnico?: IntFieldUpdateOperationsInput | number
    costoAcordado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionFieldUpdateOperationsInput | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaConfirmada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    solicitud?: SolicitudUpdateOneRequiredWithoutSolicitudesTecnicoNestedInput
  }

  export type SolicitudTecnicoUncheckedUpdateInput = {
    idSolTec?: IntFieldUpdateOperationsInput | number
    idSolicitud?: IntFieldUpdateOperationsInput | number
    idTecnico?: IntFieldUpdateOperationsInput | number
    costoAcordado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionFieldUpdateOperationsInput | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaConfirmada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SolicitudTecnicoCreateManyInput = {
    idSolTec?: number
    idSolicitud: number
    idTecnico: number
    costoAcordado?: Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo: $Enums.EstadoAceptacion
    fechaPropuesta?: Date | string
    fechaConfirmada?: Date | string | null
    notas?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SolicitudTecnicoUpdateManyMutationInput = {
    idTecnico?: IntFieldUpdateOperationsInput | number
    costoAcordado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionFieldUpdateOperationsInput | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaConfirmada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SolicitudTecnicoUncheckedUpdateManyInput = {
    idSolTec?: IntFieldUpdateOperationsInput | number
    idSolicitud?: IntFieldUpdateOperationsInput | number
    idTecnico?: IntFieldUpdateOperationsInput | number
    costoAcordado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionFieldUpdateOperationsInput | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaConfirmada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalificacionCreateInput = {
    idTecnico: number
    puntaje: $Enums.PuntajeCalificacion
    comentario?: string | null
    fechaCalificacion?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
    solicitud: SolicitudCreateNestedOneWithoutCalificacionesInput
  }

  export type CalificacionUncheckedCreateInput = {
    idCalificacion?: number
    idSolicitud: number
    idTecnico: number
    puntaje: $Enums.PuntajeCalificacion
    comentario?: string | null
    fechaCalificacion?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalificacionUpdateInput = {
    idTecnico?: IntFieldUpdateOperationsInput | number
    puntaje?: EnumPuntajeCalificacionFieldUpdateOperationsInput | $Enums.PuntajeCalificacion
    comentario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCalificacion?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    solicitud?: SolicitudUpdateOneRequiredWithoutCalificacionesNestedInput
  }

  export type CalificacionUncheckedUpdateInput = {
    idCalificacion?: IntFieldUpdateOperationsInput | number
    idSolicitud?: IntFieldUpdateOperationsInput | number
    idTecnico?: IntFieldUpdateOperationsInput | number
    puntaje?: EnumPuntajeCalificacionFieldUpdateOperationsInput | $Enums.PuntajeCalificacion
    comentario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCalificacion?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalificacionCreateManyInput = {
    idCalificacion?: number
    idSolicitud: number
    idTecnico: number
    puntaje: $Enums.PuntajeCalificacion
    comentario?: string | null
    fechaCalificacion?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalificacionUpdateManyMutationInput = {
    idTecnico?: IntFieldUpdateOperationsInput | number
    puntaje?: EnumPuntajeCalificacionFieldUpdateOperationsInput | $Enums.PuntajeCalificacion
    comentario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCalificacion?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalificacionUncheckedUpdateManyInput = {
    idCalificacion?: IntFieldUpdateOperationsInput | number
    idSolicitud?: IntFieldUpdateOperationsInput | number
    idTecnico?: IntFieldUpdateOperationsInput | number
    puntaje?: EnumPuntajeCalificacionFieldUpdateOperationsInput | $Enums.PuntajeCalificacion
    comentario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCalificacion?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaccionCreateInput = {
    monto: Decimal | DecimalJsLike | number | string
    metodoPago: $Enums.MetodoPago
    estadoPago?: $Enums.EstadoPago
    fechaPago?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    solicitud: SolicitudCreateNestedOneWithoutTransaccionesInput
  }

  export type TransaccionUncheckedCreateInput = {
    idTransaccion?: number
    idSolicitud: number
    monto: Decimal | DecimalJsLike | number | string
    metodoPago: $Enums.MetodoPago
    estadoPago?: $Enums.EstadoPago
    fechaPago?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransaccionUpdateInput = {
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFieldUpdateOperationsInput | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    solicitud?: SolicitudUpdateOneRequiredWithoutTransaccionesNestedInput
  }

  export type TransaccionUncheckedUpdateInput = {
    idTransaccion?: IntFieldUpdateOperationsInput | number
    idSolicitud?: IntFieldUpdateOperationsInput | number
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFieldUpdateOperationsInput | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaccionCreateManyInput = {
    idTransaccion?: number
    idSolicitud: number
    monto: Decimal | DecimalJsLike | number | string
    metodoPago: $Enums.MetodoPago
    estadoPago?: $Enums.EstadoPago
    fechaPago?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransaccionUpdateManyMutationInput = {
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFieldUpdateOperationsInput | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaccionUncheckedUpdateManyInput = {
    idTransaccion?: IntFieldUpdateOperationsInput | number
    idSolicitud?: IntFieldUpdateOperationsInput | number
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFieldUpdateOperationsInput | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type EnumEstadoSolicitudFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoSolicitud | EnumEstadoSolicitudFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoSolicitud[] | ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoSolicitud[] | ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoSolicitudFilter<$PrismaModel> | $Enums.EstadoSolicitud
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type SolicitudTecnicoListRelationFilter = {
    every?: SolicitudTecnicoWhereInput
    some?: SolicitudTecnicoWhereInput
    none?: SolicitudTecnicoWhereInput
  }

  export type CalificacionListRelationFilter = {
    every?: CalificacionWhereInput
    some?: CalificacionWhereInput
    none?: CalificacionWhereInput
  }

  export type TransaccionListRelationFilter = {
    every?: TransaccionWhereInput
    some?: TransaccionWhereInput
    none?: TransaccionWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type SolicitudTecnicoOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type CalificacionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type TransaccionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SolicitudCountOrderByAggregateInput = {
    idSolicitud?: SortOrder
    idUser?: SortOrder
    idTipoServicio?: SortOrder
    codigoParroquia?: SortOrder
    tituloProblema?: SortOrder
    descripcionProblema?: SortOrder
    costoEstimado?: SortOrder
    costoPromocion?: SortOrder
    promocion?: SortOrder
    estadoSolicitud?: SortOrder
    fechaProgramada?: SortOrder
    fechaPublicacion?: SortOrder
    fechaInicio?: SortOrder
    fechaFinalizacion?: SortOrder
    duracionEstimadaMin?: SortOrder
    isActive?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
  }

  export type SolicitudAvgOrderByAggregateInput = {
    idSolicitud?: SortOrder
    idUser?: SortOrder
    idTipoServicio?: SortOrder
    costoEstimado?: SortOrder
    costoPromocion?: SortOrder
    duracionEstimadaMin?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
  }

  export type SolicitudMaxOrderByAggregateInput = {
    idSolicitud?: SortOrder
    idUser?: SortOrder
    idTipoServicio?: SortOrder
    codigoParroquia?: SortOrder
    tituloProblema?: SortOrder
    descripcionProblema?: SortOrder
    costoEstimado?: SortOrder
    costoPromocion?: SortOrder
    promocion?: SortOrder
    estadoSolicitud?: SortOrder
    fechaProgramada?: SortOrder
    fechaPublicacion?: SortOrder
    fechaInicio?: SortOrder
    fechaFinalizacion?: SortOrder
    duracionEstimadaMin?: SortOrder
    isActive?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
  }

  export type SolicitudMinOrderByAggregateInput = {
    idSolicitud?: SortOrder
    idUser?: SortOrder
    idTipoServicio?: SortOrder
    codigoParroquia?: SortOrder
    tituloProblema?: SortOrder
    descripcionProblema?: SortOrder
    costoEstimado?: SortOrder
    costoPromocion?: SortOrder
    promocion?: SortOrder
    estadoSolicitud?: SortOrder
    fechaProgramada?: SortOrder
    fechaPublicacion?: SortOrder
    fechaInicio?: SortOrder
    fechaFinalizacion?: SortOrder
    duracionEstimadaMin?: SortOrder
    isActive?: SortOrder
    deletedAt?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
  }

  export type SolicitudSumOrderByAggregateInput = {
    idSolicitud?: SortOrder
    idUser?: SortOrder
    idTipoServicio?: SortOrder
    costoEstimado?: SortOrder
    costoPromocion?: SortOrder
    duracionEstimadaMin?: SortOrder
    createdBy?: SortOrder
    updatedBy?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type EnumEstadoSolicitudWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoSolicitud | EnumEstadoSolicitudFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoSolicitud[] | ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoSolicitud[] | ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoSolicitudWithAggregatesFilter<$PrismaModel> | $Enums.EstadoSolicitud
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoSolicitudFilter<$PrismaModel>
    _max?: NestedEnumEstadoSolicitudFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type EnumEstadoAceptacionFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoAceptacion | EnumEstadoAceptacionFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoAceptacion[] | ListEnumEstadoAceptacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoAceptacion[] | ListEnumEstadoAceptacionFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoAceptacionFilter<$PrismaModel> | $Enums.EstadoAceptacion
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type SolicitudScalarRelationFilter = {
    is?: SolicitudWhereInput
    isNot?: SolicitudWhereInput
  }

  export type SolicitudTecnicoIdSolicitudIdTecnicoCompoundUniqueInput = {
    idSolicitud: number
    idTecnico: number
  }

  export type SolicitudTecnicoCountOrderByAggregateInput = {
    idSolTec?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    costoAcordado?: SortOrder
    estadoAcuerdo?: SortOrder
    fechaPropuesta?: SortOrder
    fechaConfirmada?: SortOrder
    notas?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SolicitudTecnicoAvgOrderByAggregateInput = {
    idSolTec?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    costoAcordado?: SortOrder
  }

  export type SolicitudTecnicoMaxOrderByAggregateInput = {
    idSolTec?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    costoAcordado?: SortOrder
    estadoAcuerdo?: SortOrder
    fechaPropuesta?: SortOrder
    fechaConfirmada?: SortOrder
    notas?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SolicitudTecnicoMinOrderByAggregateInput = {
    idSolTec?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    costoAcordado?: SortOrder
    estadoAcuerdo?: SortOrder
    fechaPropuesta?: SortOrder
    fechaConfirmada?: SortOrder
    notas?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SolicitudTecnicoSumOrderByAggregateInput = {
    idSolTec?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    costoAcordado?: SortOrder
  }

  export type EnumEstadoAceptacionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoAceptacion | EnumEstadoAceptacionFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoAceptacion[] | ListEnumEstadoAceptacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoAceptacion[] | ListEnumEstadoAceptacionFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoAceptacionWithAggregatesFilter<$PrismaModel> | $Enums.EstadoAceptacion
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoAceptacionFilter<$PrismaModel>
    _max?: NestedEnumEstadoAceptacionFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumPuntajeCalificacionFilter<$PrismaModel = never> = {
    equals?: $Enums.PuntajeCalificacion | EnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    in?: $Enums.PuntajeCalificacion[] | ListEnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.PuntajeCalificacion[] | ListEnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    not?: NestedEnumPuntajeCalificacionFilter<$PrismaModel> | $Enums.PuntajeCalificacion
  }

  export type CalificacionCountOrderByAggregateInput = {
    idCalificacion?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    puntaje?: SortOrder
    comentario?: SortOrder
    fechaCalificacion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CalificacionAvgOrderByAggregateInput = {
    idCalificacion?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
  }

  export type CalificacionMaxOrderByAggregateInput = {
    idCalificacion?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    puntaje?: SortOrder
    comentario?: SortOrder
    fechaCalificacion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CalificacionMinOrderByAggregateInput = {
    idCalificacion?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
    puntaje?: SortOrder
    comentario?: SortOrder
    fechaCalificacion?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type CalificacionSumOrderByAggregateInput = {
    idCalificacion?: SortOrder
    idSolicitud?: SortOrder
    idTecnico?: SortOrder
  }

  export type EnumPuntajeCalificacionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PuntajeCalificacion | EnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    in?: $Enums.PuntajeCalificacion[] | ListEnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.PuntajeCalificacion[] | ListEnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    not?: NestedEnumPuntajeCalificacionWithAggregatesFilter<$PrismaModel> | $Enums.PuntajeCalificacion
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPuntajeCalificacionFilter<$PrismaModel>
    _max?: NestedEnumPuntajeCalificacionFilter<$PrismaModel>
  }

  export type DecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type EnumMetodoPagoFilter<$PrismaModel = never> = {
    equals?: $Enums.MetodoPago | EnumMetodoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.MetodoPago[] | ListEnumMetodoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.MetodoPago[] | ListEnumMetodoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumMetodoPagoFilter<$PrismaModel> | $Enums.MetodoPago
  }

  export type EnumEstadoPagoFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoPago | EnumEstadoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoPagoFilter<$PrismaModel> | $Enums.EstadoPago
  }

  export type TransaccionCountOrderByAggregateInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
    metodoPago?: SortOrder
    estadoPago?: SortOrder
    fechaPago?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransaccionAvgOrderByAggregateInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
  }

  export type TransaccionMaxOrderByAggregateInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
    metodoPago?: SortOrder
    estadoPago?: SortOrder
    fechaPago?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransaccionMinOrderByAggregateInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
    metodoPago?: SortOrder
    estadoPago?: SortOrder
    fechaPago?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransaccionSumOrderByAggregateInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
  }

  export type DecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type EnumMetodoPagoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MetodoPago | EnumMetodoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.MetodoPago[] | ListEnumMetodoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.MetodoPago[] | ListEnumMetodoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumMetodoPagoWithAggregatesFilter<$PrismaModel> | $Enums.MetodoPago
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMetodoPagoFilter<$PrismaModel>
    _max?: NestedEnumMetodoPagoFilter<$PrismaModel>
  }

  export type EnumEstadoPagoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoPago | EnumEstadoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoPagoWithAggregatesFilter<$PrismaModel> | $Enums.EstadoPago
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoPagoFilter<$PrismaModel>
    _max?: NestedEnumEstadoPagoFilter<$PrismaModel>
  }

  export type SolicitudTecnicoCreateNestedManyWithoutSolicitudInput = {
    create?: XOR<SolicitudTecnicoCreateWithoutSolicitudInput, SolicitudTecnicoUncheckedCreateWithoutSolicitudInput> | SolicitudTecnicoCreateWithoutSolicitudInput[] | SolicitudTecnicoUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: SolicitudTecnicoCreateOrConnectWithoutSolicitudInput | SolicitudTecnicoCreateOrConnectWithoutSolicitudInput[]
    createMany?: SolicitudTecnicoCreateManySolicitudInputEnvelope
    connect?: SolicitudTecnicoWhereUniqueInput | SolicitudTecnicoWhereUniqueInput[]
  }

  export type CalificacionCreateNestedManyWithoutSolicitudInput = {
    create?: XOR<CalificacionCreateWithoutSolicitudInput, CalificacionUncheckedCreateWithoutSolicitudInput> | CalificacionCreateWithoutSolicitudInput[] | CalificacionUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: CalificacionCreateOrConnectWithoutSolicitudInput | CalificacionCreateOrConnectWithoutSolicitudInput[]
    createMany?: CalificacionCreateManySolicitudInputEnvelope
    connect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[]
  }

  export type TransaccionCreateNestedManyWithoutSolicitudInput = {
    create?: XOR<TransaccionCreateWithoutSolicitudInput, TransaccionUncheckedCreateWithoutSolicitudInput> | TransaccionCreateWithoutSolicitudInput[] | TransaccionUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: TransaccionCreateOrConnectWithoutSolicitudInput | TransaccionCreateOrConnectWithoutSolicitudInput[]
    createMany?: TransaccionCreateManySolicitudInputEnvelope
    connect?: TransaccionWhereUniqueInput | TransaccionWhereUniqueInput[]
  }

  export type SolicitudTecnicoUncheckedCreateNestedManyWithoutSolicitudInput = {
    create?: XOR<SolicitudTecnicoCreateWithoutSolicitudInput, SolicitudTecnicoUncheckedCreateWithoutSolicitudInput> | SolicitudTecnicoCreateWithoutSolicitudInput[] | SolicitudTecnicoUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: SolicitudTecnicoCreateOrConnectWithoutSolicitudInput | SolicitudTecnicoCreateOrConnectWithoutSolicitudInput[]
    createMany?: SolicitudTecnicoCreateManySolicitudInputEnvelope
    connect?: SolicitudTecnicoWhereUniqueInput | SolicitudTecnicoWhereUniqueInput[]
  }

  export type CalificacionUncheckedCreateNestedManyWithoutSolicitudInput = {
    create?: XOR<CalificacionCreateWithoutSolicitudInput, CalificacionUncheckedCreateWithoutSolicitudInput> | CalificacionCreateWithoutSolicitudInput[] | CalificacionUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: CalificacionCreateOrConnectWithoutSolicitudInput | CalificacionCreateOrConnectWithoutSolicitudInput[]
    createMany?: CalificacionCreateManySolicitudInputEnvelope
    connect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[]
  }

  export type TransaccionUncheckedCreateNestedManyWithoutSolicitudInput = {
    create?: XOR<TransaccionCreateWithoutSolicitudInput, TransaccionUncheckedCreateWithoutSolicitudInput> | TransaccionCreateWithoutSolicitudInput[] | TransaccionUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: TransaccionCreateOrConnectWithoutSolicitudInput | TransaccionCreateOrConnectWithoutSolicitudInput[]
    createMany?: TransaccionCreateManySolicitudInputEnvelope
    connect?: TransaccionWhereUniqueInput | TransaccionWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableDecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string | null
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type EnumEstadoSolicitudFieldUpdateOperationsInput = {
    set?: $Enums.EstadoSolicitud
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type SolicitudTecnicoUpdateManyWithoutSolicitudNestedInput = {
    create?: XOR<SolicitudTecnicoCreateWithoutSolicitudInput, SolicitudTecnicoUncheckedCreateWithoutSolicitudInput> | SolicitudTecnicoCreateWithoutSolicitudInput[] | SolicitudTecnicoUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: SolicitudTecnicoCreateOrConnectWithoutSolicitudInput | SolicitudTecnicoCreateOrConnectWithoutSolicitudInput[]
    upsert?: SolicitudTecnicoUpsertWithWhereUniqueWithoutSolicitudInput | SolicitudTecnicoUpsertWithWhereUniqueWithoutSolicitudInput[]
    createMany?: SolicitudTecnicoCreateManySolicitudInputEnvelope
    set?: SolicitudTecnicoWhereUniqueInput | SolicitudTecnicoWhereUniqueInput[]
    disconnect?: SolicitudTecnicoWhereUniqueInput | SolicitudTecnicoWhereUniqueInput[]
    delete?: SolicitudTecnicoWhereUniqueInput | SolicitudTecnicoWhereUniqueInput[]
    connect?: SolicitudTecnicoWhereUniqueInput | SolicitudTecnicoWhereUniqueInput[]
    update?: SolicitudTecnicoUpdateWithWhereUniqueWithoutSolicitudInput | SolicitudTecnicoUpdateWithWhereUniqueWithoutSolicitudInput[]
    updateMany?: SolicitudTecnicoUpdateManyWithWhereWithoutSolicitudInput | SolicitudTecnicoUpdateManyWithWhereWithoutSolicitudInput[]
    deleteMany?: SolicitudTecnicoScalarWhereInput | SolicitudTecnicoScalarWhereInput[]
  }

  export type CalificacionUpdateManyWithoutSolicitudNestedInput = {
    create?: XOR<CalificacionCreateWithoutSolicitudInput, CalificacionUncheckedCreateWithoutSolicitudInput> | CalificacionCreateWithoutSolicitudInput[] | CalificacionUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: CalificacionCreateOrConnectWithoutSolicitudInput | CalificacionCreateOrConnectWithoutSolicitudInput[]
    upsert?: CalificacionUpsertWithWhereUniqueWithoutSolicitudInput | CalificacionUpsertWithWhereUniqueWithoutSolicitudInput[]
    createMany?: CalificacionCreateManySolicitudInputEnvelope
    set?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[]
    disconnect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[]
    delete?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[]
    connect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[]
    update?: CalificacionUpdateWithWhereUniqueWithoutSolicitudInput | CalificacionUpdateWithWhereUniqueWithoutSolicitudInput[]
    updateMany?: CalificacionUpdateManyWithWhereWithoutSolicitudInput | CalificacionUpdateManyWithWhereWithoutSolicitudInput[]
    deleteMany?: CalificacionScalarWhereInput | CalificacionScalarWhereInput[]
  }

  export type TransaccionUpdateManyWithoutSolicitudNestedInput = {
    create?: XOR<TransaccionCreateWithoutSolicitudInput, TransaccionUncheckedCreateWithoutSolicitudInput> | TransaccionCreateWithoutSolicitudInput[] | TransaccionUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: TransaccionCreateOrConnectWithoutSolicitudInput | TransaccionCreateOrConnectWithoutSolicitudInput[]
    upsert?: TransaccionUpsertWithWhereUniqueWithoutSolicitudInput | TransaccionUpsertWithWhereUniqueWithoutSolicitudInput[]
    createMany?: TransaccionCreateManySolicitudInputEnvelope
    set?: TransaccionWhereUniqueInput | TransaccionWhereUniqueInput[]
    disconnect?: TransaccionWhereUniqueInput | TransaccionWhereUniqueInput[]
    delete?: TransaccionWhereUniqueInput | TransaccionWhereUniqueInput[]
    connect?: TransaccionWhereUniqueInput | TransaccionWhereUniqueInput[]
    update?: TransaccionUpdateWithWhereUniqueWithoutSolicitudInput | TransaccionUpdateWithWhereUniqueWithoutSolicitudInput[]
    updateMany?: TransaccionUpdateManyWithWhereWithoutSolicitudInput | TransaccionUpdateManyWithWhereWithoutSolicitudInput[]
    deleteMany?: TransaccionScalarWhereInput | TransaccionScalarWhereInput[]
  }

  export type SolicitudTecnicoUncheckedUpdateManyWithoutSolicitudNestedInput = {
    create?: XOR<SolicitudTecnicoCreateWithoutSolicitudInput, SolicitudTecnicoUncheckedCreateWithoutSolicitudInput> | SolicitudTecnicoCreateWithoutSolicitudInput[] | SolicitudTecnicoUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: SolicitudTecnicoCreateOrConnectWithoutSolicitudInput | SolicitudTecnicoCreateOrConnectWithoutSolicitudInput[]
    upsert?: SolicitudTecnicoUpsertWithWhereUniqueWithoutSolicitudInput | SolicitudTecnicoUpsertWithWhereUniqueWithoutSolicitudInput[]
    createMany?: SolicitudTecnicoCreateManySolicitudInputEnvelope
    set?: SolicitudTecnicoWhereUniqueInput | SolicitudTecnicoWhereUniqueInput[]
    disconnect?: SolicitudTecnicoWhereUniqueInput | SolicitudTecnicoWhereUniqueInput[]
    delete?: SolicitudTecnicoWhereUniqueInput | SolicitudTecnicoWhereUniqueInput[]
    connect?: SolicitudTecnicoWhereUniqueInput | SolicitudTecnicoWhereUniqueInput[]
    update?: SolicitudTecnicoUpdateWithWhereUniqueWithoutSolicitudInput | SolicitudTecnicoUpdateWithWhereUniqueWithoutSolicitudInput[]
    updateMany?: SolicitudTecnicoUpdateManyWithWhereWithoutSolicitudInput | SolicitudTecnicoUpdateManyWithWhereWithoutSolicitudInput[]
    deleteMany?: SolicitudTecnicoScalarWhereInput | SolicitudTecnicoScalarWhereInput[]
  }

  export type CalificacionUncheckedUpdateManyWithoutSolicitudNestedInput = {
    create?: XOR<CalificacionCreateWithoutSolicitudInput, CalificacionUncheckedCreateWithoutSolicitudInput> | CalificacionCreateWithoutSolicitudInput[] | CalificacionUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: CalificacionCreateOrConnectWithoutSolicitudInput | CalificacionCreateOrConnectWithoutSolicitudInput[]
    upsert?: CalificacionUpsertWithWhereUniqueWithoutSolicitudInput | CalificacionUpsertWithWhereUniqueWithoutSolicitudInput[]
    createMany?: CalificacionCreateManySolicitudInputEnvelope
    set?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[]
    disconnect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[]
    delete?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[]
    connect?: CalificacionWhereUniqueInput | CalificacionWhereUniqueInput[]
    update?: CalificacionUpdateWithWhereUniqueWithoutSolicitudInput | CalificacionUpdateWithWhereUniqueWithoutSolicitudInput[]
    updateMany?: CalificacionUpdateManyWithWhereWithoutSolicitudInput | CalificacionUpdateManyWithWhereWithoutSolicitudInput[]
    deleteMany?: CalificacionScalarWhereInput | CalificacionScalarWhereInput[]
  }

  export type TransaccionUncheckedUpdateManyWithoutSolicitudNestedInput = {
    create?: XOR<TransaccionCreateWithoutSolicitudInput, TransaccionUncheckedCreateWithoutSolicitudInput> | TransaccionCreateWithoutSolicitudInput[] | TransaccionUncheckedCreateWithoutSolicitudInput[]
    connectOrCreate?: TransaccionCreateOrConnectWithoutSolicitudInput | TransaccionCreateOrConnectWithoutSolicitudInput[]
    upsert?: TransaccionUpsertWithWhereUniqueWithoutSolicitudInput | TransaccionUpsertWithWhereUniqueWithoutSolicitudInput[]
    createMany?: TransaccionCreateManySolicitudInputEnvelope
    set?: TransaccionWhereUniqueInput | TransaccionWhereUniqueInput[]
    disconnect?: TransaccionWhereUniqueInput | TransaccionWhereUniqueInput[]
    delete?: TransaccionWhereUniqueInput | TransaccionWhereUniqueInput[]
    connect?: TransaccionWhereUniqueInput | TransaccionWhereUniqueInput[]
    update?: TransaccionUpdateWithWhereUniqueWithoutSolicitudInput | TransaccionUpdateWithWhereUniqueWithoutSolicitudInput[]
    updateMany?: TransaccionUpdateManyWithWhereWithoutSolicitudInput | TransaccionUpdateManyWithWhereWithoutSolicitudInput[]
    deleteMany?: TransaccionScalarWhereInput | TransaccionScalarWhereInput[]
  }

  export type SolicitudCreateNestedOneWithoutSolicitudesTecnicoInput = {
    create?: XOR<SolicitudCreateWithoutSolicitudesTecnicoInput, SolicitudUncheckedCreateWithoutSolicitudesTecnicoInput>
    connectOrCreate?: SolicitudCreateOrConnectWithoutSolicitudesTecnicoInput
    connect?: SolicitudWhereUniqueInput
  }

  export type EnumEstadoAceptacionFieldUpdateOperationsInput = {
    set?: $Enums.EstadoAceptacion
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type SolicitudUpdateOneRequiredWithoutSolicitudesTecnicoNestedInput = {
    create?: XOR<SolicitudCreateWithoutSolicitudesTecnicoInput, SolicitudUncheckedCreateWithoutSolicitudesTecnicoInput>
    connectOrCreate?: SolicitudCreateOrConnectWithoutSolicitudesTecnicoInput
    upsert?: SolicitudUpsertWithoutSolicitudesTecnicoInput
    connect?: SolicitudWhereUniqueInput
    update?: XOR<XOR<SolicitudUpdateToOneWithWhereWithoutSolicitudesTecnicoInput, SolicitudUpdateWithoutSolicitudesTecnicoInput>, SolicitudUncheckedUpdateWithoutSolicitudesTecnicoInput>
  }

  export type SolicitudCreateNestedOneWithoutCalificacionesInput = {
    create?: XOR<SolicitudCreateWithoutCalificacionesInput, SolicitudUncheckedCreateWithoutCalificacionesInput>
    connectOrCreate?: SolicitudCreateOrConnectWithoutCalificacionesInput
    connect?: SolicitudWhereUniqueInput
  }

  export type EnumPuntajeCalificacionFieldUpdateOperationsInput = {
    set?: $Enums.PuntajeCalificacion
  }

  export type SolicitudUpdateOneRequiredWithoutCalificacionesNestedInput = {
    create?: XOR<SolicitudCreateWithoutCalificacionesInput, SolicitudUncheckedCreateWithoutCalificacionesInput>
    connectOrCreate?: SolicitudCreateOrConnectWithoutCalificacionesInput
    upsert?: SolicitudUpsertWithoutCalificacionesInput
    connect?: SolicitudWhereUniqueInput
    update?: XOR<XOR<SolicitudUpdateToOneWithWhereWithoutCalificacionesInput, SolicitudUpdateWithoutCalificacionesInput>, SolicitudUncheckedUpdateWithoutCalificacionesInput>
  }

  export type SolicitudCreateNestedOneWithoutTransaccionesInput = {
    create?: XOR<SolicitudCreateWithoutTransaccionesInput, SolicitudUncheckedCreateWithoutTransaccionesInput>
    connectOrCreate?: SolicitudCreateOrConnectWithoutTransaccionesInput
    connect?: SolicitudWhereUniqueInput
  }

  export type DecimalFieldUpdateOperationsInput = {
    set?: Decimal | DecimalJsLike | number | string
    increment?: Decimal | DecimalJsLike | number | string
    decrement?: Decimal | DecimalJsLike | number | string
    multiply?: Decimal | DecimalJsLike | number | string
    divide?: Decimal | DecimalJsLike | number | string
  }

  export type EnumMetodoPagoFieldUpdateOperationsInput = {
    set?: $Enums.MetodoPago
  }

  export type EnumEstadoPagoFieldUpdateOperationsInput = {
    set?: $Enums.EstadoPago
  }

  export type SolicitudUpdateOneRequiredWithoutTransaccionesNestedInput = {
    create?: XOR<SolicitudCreateWithoutTransaccionesInput, SolicitudUncheckedCreateWithoutTransaccionesInput>
    connectOrCreate?: SolicitudCreateOrConnectWithoutTransaccionesInput
    upsert?: SolicitudUpsertWithoutTransaccionesInput
    connect?: SolicitudWhereUniqueInput
    update?: XOR<XOR<SolicitudUpdateToOneWithWhereWithoutTransaccionesInput, SolicitudUpdateWithoutTransaccionesInput>, SolicitudUncheckedUpdateWithoutTransaccionesInput>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDecimalNullableFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedEnumEstadoSolicitudFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoSolicitud | EnumEstadoSolicitudFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoSolicitud[] | ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoSolicitud[] | ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoSolicitudFilter<$PrismaModel> | $Enums.EstadoSolicitud
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDecimalNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel> | null
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel> | null
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalNullableWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedDecimalNullableFilter<$PrismaModel>
    _sum?: NestedDecimalNullableFilter<$PrismaModel>
    _min?: NestedDecimalNullableFilter<$PrismaModel>
    _max?: NestedDecimalNullableFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }

  export type NestedEnumEstadoSolicitudWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoSolicitud | EnumEstadoSolicitudFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoSolicitud[] | ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoSolicitud[] | ListEnumEstadoSolicitudFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoSolicitudWithAggregatesFilter<$PrismaModel> | $Enums.EstadoSolicitud
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoSolicitudFilter<$PrismaModel>
    _max?: NestedEnumEstadoSolicitudFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumEstadoAceptacionFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoAceptacion | EnumEstadoAceptacionFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoAceptacion[] | ListEnumEstadoAceptacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoAceptacion[] | ListEnumEstadoAceptacionFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoAceptacionFilter<$PrismaModel> | $Enums.EstadoAceptacion
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedEnumEstadoAceptacionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoAceptacion | EnumEstadoAceptacionFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoAceptacion[] | ListEnumEstadoAceptacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoAceptacion[] | ListEnumEstadoAceptacionFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoAceptacionWithAggregatesFilter<$PrismaModel> | $Enums.EstadoAceptacion
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoAceptacionFilter<$PrismaModel>
    _max?: NestedEnumEstadoAceptacionFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedEnumPuntajeCalificacionFilter<$PrismaModel = never> = {
    equals?: $Enums.PuntajeCalificacion | EnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    in?: $Enums.PuntajeCalificacion[] | ListEnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.PuntajeCalificacion[] | ListEnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    not?: NestedEnumPuntajeCalificacionFilter<$PrismaModel> | $Enums.PuntajeCalificacion
  }

  export type NestedEnumPuntajeCalificacionWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PuntajeCalificacion | EnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    in?: $Enums.PuntajeCalificacion[] | ListEnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    notIn?: $Enums.PuntajeCalificacion[] | ListEnumPuntajeCalificacionFieldRefInput<$PrismaModel>
    not?: NestedEnumPuntajeCalificacionWithAggregatesFilter<$PrismaModel> | $Enums.PuntajeCalificacion
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPuntajeCalificacionFilter<$PrismaModel>
    _max?: NestedEnumPuntajeCalificacionFilter<$PrismaModel>
  }

  export type NestedDecimalFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
  }

  export type NestedEnumMetodoPagoFilter<$PrismaModel = never> = {
    equals?: $Enums.MetodoPago | EnumMetodoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.MetodoPago[] | ListEnumMetodoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.MetodoPago[] | ListEnumMetodoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumMetodoPagoFilter<$PrismaModel> | $Enums.MetodoPago
  }

  export type NestedEnumEstadoPagoFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoPago | EnumEstadoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoPagoFilter<$PrismaModel> | $Enums.EstadoPago
  }

  export type NestedDecimalWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    in?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    notIn?: Decimal[] | DecimalJsLike[] | number[] | string[] | ListDecimalFieldRefInput<$PrismaModel>
    lt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    lte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gt?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    gte?: Decimal | DecimalJsLike | number | string | DecimalFieldRefInput<$PrismaModel>
    not?: NestedDecimalWithAggregatesFilter<$PrismaModel> | Decimal | DecimalJsLike | number | string
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedDecimalFilter<$PrismaModel>
    _sum?: NestedDecimalFilter<$PrismaModel>
    _min?: NestedDecimalFilter<$PrismaModel>
    _max?: NestedDecimalFilter<$PrismaModel>
  }

  export type NestedEnumMetodoPagoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.MetodoPago | EnumMetodoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.MetodoPago[] | ListEnumMetodoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.MetodoPago[] | ListEnumMetodoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumMetodoPagoWithAggregatesFilter<$PrismaModel> | $Enums.MetodoPago
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumMetodoPagoFilter<$PrismaModel>
    _max?: NestedEnumMetodoPagoFilter<$PrismaModel>
  }

  export type NestedEnumEstadoPagoWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.EstadoPago | EnumEstadoPagoFieldRefInput<$PrismaModel>
    in?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    notIn?: $Enums.EstadoPago[] | ListEnumEstadoPagoFieldRefInput<$PrismaModel>
    not?: NestedEnumEstadoPagoWithAggregatesFilter<$PrismaModel> | $Enums.EstadoPago
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumEstadoPagoFilter<$PrismaModel>
    _max?: NestedEnumEstadoPagoFilter<$PrismaModel>
  }

  export type SolicitudTecnicoCreateWithoutSolicitudInput = {
    idTecnico: number
    costoAcordado?: Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo: $Enums.EstadoAceptacion
    fechaPropuesta?: Date | string
    fechaConfirmada?: Date | string | null
    notas?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SolicitudTecnicoUncheckedCreateWithoutSolicitudInput = {
    idSolTec?: number
    idTecnico: number
    costoAcordado?: Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo: $Enums.EstadoAceptacion
    fechaPropuesta?: Date | string
    fechaConfirmada?: Date | string | null
    notas?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SolicitudTecnicoCreateOrConnectWithoutSolicitudInput = {
    where: SolicitudTecnicoWhereUniqueInput
    create: XOR<SolicitudTecnicoCreateWithoutSolicitudInput, SolicitudTecnicoUncheckedCreateWithoutSolicitudInput>
  }

  export type SolicitudTecnicoCreateManySolicitudInputEnvelope = {
    data: SolicitudTecnicoCreateManySolicitudInput | SolicitudTecnicoCreateManySolicitudInput[]
    skipDuplicates?: boolean
  }

  export type CalificacionCreateWithoutSolicitudInput = {
    idTecnico: number
    puntaje: $Enums.PuntajeCalificacion
    comentario?: string | null
    fechaCalificacion?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalificacionUncheckedCreateWithoutSolicitudInput = {
    idCalificacion?: number
    idTecnico: number
    puntaje: $Enums.PuntajeCalificacion
    comentario?: string | null
    fechaCalificacion?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalificacionCreateOrConnectWithoutSolicitudInput = {
    where: CalificacionWhereUniqueInput
    create: XOR<CalificacionCreateWithoutSolicitudInput, CalificacionUncheckedCreateWithoutSolicitudInput>
  }

  export type CalificacionCreateManySolicitudInputEnvelope = {
    data: CalificacionCreateManySolicitudInput | CalificacionCreateManySolicitudInput[]
    skipDuplicates?: boolean
  }

  export type TransaccionCreateWithoutSolicitudInput = {
    monto: Decimal | DecimalJsLike | number | string
    metodoPago: $Enums.MetodoPago
    estadoPago?: $Enums.EstadoPago
    fechaPago?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransaccionUncheckedCreateWithoutSolicitudInput = {
    idTransaccion?: number
    monto: Decimal | DecimalJsLike | number | string
    metodoPago: $Enums.MetodoPago
    estadoPago?: $Enums.EstadoPago
    fechaPago?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransaccionCreateOrConnectWithoutSolicitudInput = {
    where: TransaccionWhereUniqueInput
    create: XOR<TransaccionCreateWithoutSolicitudInput, TransaccionUncheckedCreateWithoutSolicitudInput>
  }

  export type TransaccionCreateManySolicitudInputEnvelope = {
    data: TransaccionCreateManySolicitudInput | TransaccionCreateManySolicitudInput[]
    skipDuplicates?: boolean
  }

  export type SolicitudTecnicoUpsertWithWhereUniqueWithoutSolicitudInput = {
    where: SolicitudTecnicoWhereUniqueInput
    update: XOR<SolicitudTecnicoUpdateWithoutSolicitudInput, SolicitudTecnicoUncheckedUpdateWithoutSolicitudInput>
    create: XOR<SolicitudTecnicoCreateWithoutSolicitudInput, SolicitudTecnicoUncheckedCreateWithoutSolicitudInput>
  }

  export type SolicitudTecnicoUpdateWithWhereUniqueWithoutSolicitudInput = {
    where: SolicitudTecnicoWhereUniqueInput
    data: XOR<SolicitudTecnicoUpdateWithoutSolicitudInput, SolicitudTecnicoUncheckedUpdateWithoutSolicitudInput>
  }

  export type SolicitudTecnicoUpdateManyWithWhereWithoutSolicitudInput = {
    where: SolicitudTecnicoScalarWhereInput
    data: XOR<SolicitudTecnicoUpdateManyMutationInput, SolicitudTecnicoUncheckedUpdateManyWithoutSolicitudInput>
  }

  export type SolicitudTecnicoScalarWhereInput = {
    AND?: SolicitudTecnicoScalarWhereInput | SolicitudTecnicoScalarWhereInput[]
    OR?: SolicitudTecnicoScalarWhereInput[]
    NOT?: SolicitudTecnicoScalarWhereInput | SolicitudTecnicoScalarWhereInput[]
    idSolTec?: IntFilter<"SolicitudTecnico"> | number
    idSolicitud?: IntFilter<"SolicitudTecnico"> | number
    idTecnico?: IntFilter<"SolicitudTecnico"> | number
    costoAcordado?: DecimalNullableFilter<"SolicitudTecnico"> | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionFilter<"SolicitudTecnico"> | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeFilter<"SolicitudTecnico"> | Date | string
    fechaConfirmada?: DateTimeNullableFilter<"SolicitudTecnico"> | Date | string | null
    notas?: StringNullableFilter<"SolicitudTecnico"> | string | null
    createdAt?: DateTimeFilter<"SolicitudTecnico"> | Date | string
    updatedAt?: DateTimeFilter<"SolicitudTecnico"> | Date | string
  }

  export type CalificacionUpsertWithWhereUniqueWithoutSolicitudInput = {
    where: CalificacionWhereUniqueInput
    update: XOR<CalificacionUpdateWithoutSolicitudInput, CalificacionUncheckedUpdateWithoutSolicitudInput>
    create: XOR<CalificacionCreateWithoutSolicitudInput, CalificacionUncheckedCreateWithoutSolicitudInput>
  }

  export type CalificacionUpdateWithWhereUniqueWithoutSolicitudInput = {
    where: CalificacionWhereUniqueInput
    data: XOR<CalificacionUpdateWithoutSolicitudInput, CalificacionUncheckedUpdateWithoutSolicitudInput>
  }

  export type CalificacionUpdateManyWithWhereWithoutSolicitudInput = {
    where: CalificacionScalarWhereInput
    data: XOR<CalificacionUpdateManyMutationInput, CalificacionUncheckedUpdateManyWithoutSolicitudInput>
  }

  export type CalificacionScalarWhereInput = {
    AND?: CalificacionScalarWhereInput | CalificacionScalarWhereInput[]
    OR?: CalificacionScalarWhereInput[]
    NOT?: CalificacionScalarWhereInput | CalificacionScalarWhereInput[]
    idCalificacion?: IntFilter<"Calificacion"> | number
    idSolicitud?: IntFilter<"Calificacion"> | number
    idTecnico?: IntFilter<"Calificacion"> | number
    puntaje?: EnumPuntajeCalificacionFilter<"Calificacion"> | $Enums.PuntajeCalificacion
    comentario?: StringNullableFilter<"Calificacion"> | string | null
    fechaCalificacion?: DateTimeFilter<"Calificacion"> | Date | string
    createdAt?: DateTimeFilter<"Calificacion"> | Date | string
    updatedAt?: DateTimeFilter<"Calificacion"> | Date | string
  }

  export type TransaccionUpsertWithWhereUniqueWithoutSolicitudInput = {
    where: TransaccionWhereUniqueInput
    update: XOR<TransaccionUpdateWithoutSolicitudInput, TransaccionUncheckedUpdateWithoutSolicitudInput>
    create: XOR<TransaccionCreateWithoutSolicitudInput, TransaccionUncheckedCreateWithoutSolicitudInput>
  }

  export type TransaccionUpdateWithWhereUniqueWithoutSolicitudInput = {
    where: TransaccionWhereUniqueInput
    data: XOR<TransaccionUpdateWithoutSolicitudInput, TransaccionUncheckedUpdateWithoutSolicitudInput>
  }

  export type TransaccionUpdateManyWithWhereWithoutSolicitudInput = {
    where: TransaccionScalarWhereInput
    data: XOR<TransaccionUpdateManyMutationInput, TransaccionUncheckedUpdateManyWithoutSolicitudInput>
  }

  export type TransaccionScalarWhereInput = {
    AND?: TransaccionScalarWhereInput | TransaccionScalarWhereInput[]
    OR?: TransaccionScalarWhereInput[]
    NOT?: TransaccionScalarWhereInput | TransaccionScalarWhereInput[]
    idTransaccion?: IntFilter<"Transaccion"> | number
    idSolicitud?: IntFilter<"Transaccion"> | number
    monto?: DecimalFilter<"Transaccion"> | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFilter<"Transaccion"> | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFilter<"Transaccion"> | $Enums.EstadoPago
    fechaPago?: DateTimeNullableFilter<"Transaccion"> | Date | string | null
    createdAt?: DateTimeFilter<"Transaccion"> | Date | string
    updatedAt?: DateTimeFilter<"Transaccion"> | Date | string
  }

  export type SolicitudCreateWithoutSolicitudesTecnicoInput = {
    idUser: number
    idTipoServicio: number
    codigoParroquia: string
    tituloProblema: string
    descripcionProblema: string
    costoEstimado?: Decimal | DecimalJsLike | number | string | null
    costoPromocion?: Decimal | DecimalJsLike | number | string | null
    promocion?: boolean
    estadoSolicitud: $Enums.EstadoSolicitud
    fechaProgramada?: Date | string | null
    fechaPublicacion?: Date | string
    fechaInicio?: Date | string | null
    fechaFinalizacion?: Date | string | null
    duracionEstimadaMin?: number | null
    isActive?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: number | null
    updatedBy?: number | null
    calificaciones?: CalificacionCreateNestedManyWithoutSolicitudInput
    transacciones?: TransaccionCreateNestedManyWithoutSolicitudInput
  }

  export type SolicitudUncheckedCreateWithoutSolicitudesTecnicoInput = {
    idSolicitud?: number
    idUser: number
    idTipoServicio: number
    codigoParroquia: string
    tituloProblema: string
    descripcionProblema: string
    costoEstimado?: Decimal | DecimalJsLike | number | string | null
    costoPromocion?: Decimal | DecimalJsLike | number | string | null
    promocion?: boolean
    estadoSolicitud: $Enums.EstadoSolicitud
    fechaProgramada?: Date | string | null
    fechaPublicacion?: Date | string
    fechaInicio?: Date | string | null
    fechaFinalizacion?: Date | string | null
    duracionEstimadaMin?: number | null
    isActive?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: number | null
    updatedBy?: number | null
    calificaciones?: CalificacionUncheckedCreateNestedManyWithoutSolicitudInput
    transacciones?: TransaccionUncheckedCreateNestedManyWithoutSolicitudInput
  }

  export type SolicitudCreateOrConnectWithoutSolicitudesTecnicoInput = {
    where: SolicitudWhereUniqueInput
    create: XOR<SolicitudCreateWithoutSolicitudesTecnicoInput, SolicitudUncheckedCreateWithoutSolicitudesTecnicoInput>
  }

  export type SolicitudUpsertWithoutSolicitudesTecnicoInput = {
    update: XOR<SolicitudUpdateWithoutSolicitudesTecnicoInput, SolicitudUncheckedUpdateWithoutSolicitudesTecnicoInput>
    create: XOR<SolicitudCreateWithoutSolicitudesTecnicoInput, SolicitudUncheckedCreateWithoutSolicitudesTecnicoInput>
    where?: SolicitudWhereInput
  }

  export type SolicitudUpdateToOneWithWhereWithoutSolicitudesTecnicoInput = {
    where?: SolicitudWhereInput
    data: XOR<SolicitudUpdateWithoutSolicitudesTecnicoInput, SolicitudUncheckedUpdateWithoutSolicitudesTecnicoInput>
  }

  export type SolicitudUpdateWithoutSolicitudesTecnicoInput = {
    idUser?: IntFieldUpdateOperationsInput | number
    idTipoServicio?: IntFieldUpdateOperationsInput | number
    codigoParroquia?: StringFieldUpdateOperationsInput | string
    tituloProblema?: StringFieldUpdateOperationsInput | string
    descripcionProblema?: StringFieldUpdateOperationsInput | string
    costoEstimado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFieldUpdateOperationsInput | boolean
    estadoSolicitud?: EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
    fechaProgramada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaPublicacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaFinalizacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duracionEstimadaMin?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    calificaciones?: CalificacionUpdateManyWithoutSolicitudNestedInput
    transacciones?: TransaccionUpdateManyWithoutSolicitudNestedInput
  }

  export type SolicitudUncheckedUpdateWithoutSolicitudesTecnicoInput = {
    idSolicitud?: IntFieldUpdateOperationsInput | number
    idUser?: IntFieldUpdateOperationsInput | number
    idTipoServicio?: IntFieldUpdateOperationsInput | number
    codigoParroquia?: StringFieldUpdateOperationsInput | string
    tituloProblema?: StringFieldUpdateOperationsInput | string
    descripcionProblema?: StringFieldUpdateOperationsInput | string
    costoEstimado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFieldUpdateOperationsInput | boolean
    estadoSolicitud?: EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
    fechaProgramada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaPublicacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaFinalizacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duracionEstimadaMin?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    calificaciones?: CalificacionUncheckedUpdateManyWithoutSolicitudNestedInput
    transacciones?: TransaccionUncheckedUpdateManyWithoutSolicitudNestedInput
  }

  export type SolicitudCreateWithoutCalificacionesInput = {
    idUser: number
    idTipoServicio: number
    codigoParroquia: string
    tituloProblema: string
    descripcionProblema: string
    costoEstimado?: Decimal | DecimalJsLike | number | string | null
    costoPromocion?: Decimal | DecimalJsLike | number | string | null
    promocion?: boolean
    estadoSolicitud: $Enums.EstadoSolicitud
    fechaProgramada?: Date | string | null
    fechaPublicacion?: Date | string
    fechaInicio?: Date | string | null
    fechaFinalizacion?: Date | string | null
    duracionEstimadaMin?: number | null
    isActive?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: number | null
    updatedBy?: number | null
    solicitudesTecnico?: SolicitudTecnicoCreateNestedManyWithoutSolicitudInput
    transacciones?: TransaccionCreateNestedManyWithoutSolicitudInput
  }

  export type SolicitudUncheckedCreateWithoutCalificacionesInput = {
    idSolicitud?: number
    idUser: number
    idTipoServicio: number
    codigoParroquia: string
    tituloProblema: string
    descripcionProblema: string
    costoEstimado?: Decimal | DecimalJsLike | number | string | null
    costoPromocion?: Decimal | DecimalJsLike | number | string | null
    promocion?: boolean
    estadoSolicitud: $Enums.EstadoSolicitud
    fechaProgramada?: Date | string | null
    fechaPublicacion?: Date | string
    fechaInicio?: Date | string | null
    fechaFinalizacion?: Date | string | null
    duracionEstimadaMin?: number | null
    isActive?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: number | null
    updatedBy?: number | null
    solicitudesTecnico?: SolicitudTecnicoUncheckedCreateNestedManyWithoutSolicitudInput
    transacciones?: TransaccionUncheckedCreateNestedManyWithoutSolicitudInput
  }

  export type SolicitudCreateOrConnectWithoutCalificacionesInput = {
    where: SolicitudWhereUniqueInput
    create: XOR<SolicitudCreateWithoutCalificacionesInput, SolicitudUncheckedCreateWithoutCalificacionesInput>
  }

  export type SolicitudUpsertWithoutCalificacionesInput = {
    update: XOR<SolicitudUpdateWithoutCalificacionesInput, SolicitudUncheckedUpdateWithoutCalificacionesInput>
    create: XOR<SolicitudCreateWithoutCalificacionesInput, SolicitudUncheckedCreateWithoutCalificacionesInput>
    where?: SolicitudWhereInput
  }

  export type SolicitudUpdateToOneWithWhereWithoutCalificacionesInput = {
    where?: SolicitudWhereInput
    data: XOR<SolicitudUpdateWithoutCalificacionesInput, SolicitudUncheckedUpdateWithoutCalificacionesInput>
  }

  export type SolicitudUpdateWithoutCalificacionesInput = {
    idUser?: IntFieldUpdateOperationsInput | number
    idTipoServicio?: IntFieldUpdateOperationsInput | number
    codigoParroquia?: StringFieldUpdateOperationsInput | string
    tituloProblema?: StringFieldUpdateOperationsInput | string
    descripcionProblema?: StringFieldUpdateOperationsInput | string
    costoEstimado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFieldUpdateOperationsInput | boolean
    estadoSolicitud?: EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
    fechaProgramada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaPublicacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaFinalizacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duracionEstimadaMin?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    solicitudesTecnico?: SolicitudTecnicoUpdateManyWithoutSolicitudNestedInput
    transacciones?: TransaccionUpdateManyWithoutSolicitudNestedInput
  }

  export type SolicitudUncheckedUpdateWithoutCalificacionesInput = {
    idSolicitud?: IntFieldUpdateOperationsInput | number
    idUser?: IntFieldUpdateOperationsInput | number
    idTipoServicio?: IntFieldUpdateOperationsInput | number
    codigoParroquia?: StringFieldUpdateOperationsInput | string
    tituloProblema?: StringFieldUpdateOperationsInput | string
    descripcionProblema?: StringFieldUpdateOperationsInput | string
    costoEstimado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFieldUpdateOperationsInput | boolean
    estadoSolicitud?: EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
    fechaProgramada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaPublicacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaFinalizacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duracionEstimadaMin?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    solicitudesTecnico?: SolicitudTecnicoUncheckedUpdateManyWithoutSolicitudNestedInput
    transacciones?: TransaccionUncheckedUpdateManyWithoutSolicitudNestedInput
  }

  export type SolicitudCreateWithoutTransaccionesInput = {
    idUser: number
    idTipoServicio: number
    codigoParroquia: string
    tituloProblema: string
    descripcionProblema: string
    costoEstimado?: Decimal | DecimalJsLike | number | string | null
    costoPromocion?: Decimal | DecimalJsLike | number | string | null
    promocion?: boolean
    estadoSolicitud: $Enums.EstadoSolicitud
    fechaProgramada?: Date | string | null
    fechaPublicacion?: Date | string
    fechaInicio?: Date | string | null
    fechaFinalizacion?: Date | string | null
    duracionEstimadaMin?: number | null
    isActive?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: number | null
    updatedBy?: number | null
    solicitudesTecnico?: SolicitudTecnicoCreateNestedManyWithoutSolicitudInput
    calificaciones?: CalificacionCreateNestedManyWithoutSolicitudInput
  }

  export type SolicitudUncheckedCreateWithoutTransaccionesInput = {
    idSolicitud?: number
    idUser: number
    idTipoServicio: number
    codigoParroquia: string
    tituloProblema: string
    descripcionProblema: string
    costoEstimado?: Decimal | DecimalJsLike | number | string | null
    costoPromocion?: Decimal | DecimalJsLike | number | string | null
    promocion?: boolean
    estadoSolicitud: $Enums.EstadoSolicitud
    fechaProgramada?: Date | string | null
    fechaPublicacion?: Date | string
    fechaInicio?: Date | string | null
    fechaFinalizacion?: Date | string | null
    duracionEstimadaMin?: number | null
    isActive?: boolean
    deletedAt?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    createdBy?: number | null
    updatedBy?: number | null
    solicitudesTecnico?: SolicitudTecnicoUncheckedCreateNestedManyWithoutSolicitudInput
    calificaciones?: CalificacionUncheckedCreateNestedManyWithoutSolicitudInput
  }

  export type SolicitudCreateOrConnectWithoutTransaccionesInput = {
    where: SolicitudWhereUniqueInput
    create: XOR<SolicitudCreateWithoutTransaccionesInput, SolicitudUncheckedCreateWithoutTransaccionesInput>
  }

  export type SolicitudUpsertWithoutTransaccionesInput = {
    update: XOR<SolicitudUpdateWithoutTransaccionesInput, SolicitudUncheckedUpdateWithoutTransaccionesInput>
    create: XOR<SolicitudCreateWithoutTransaccionesInput, SolicitudUncheckedCreateWithoutTransaccionesInput>
    where?: SolicitudWhereInput
  }

  export type SolicitudUpdateToOneWithWhereWithoutTransaccionesInput = {
    where?: SolicitudWhereInput
    data: XOR<SolicitudUpdateWithoutTransaccionesInput, SolicitudUncheckedUpdateWithoutTransaccionesInput>
  }

  export type SolicitudUpdateWithoutTransaccionesInput = {
    idUser?: IntFieldUpdateOperationsInput | number
    idTipoServicio?: IntFieldUpdateOperationsInput | number
    codigoParroquia?: StringFieldUpdateOperationsInput | string
    tituloProblema?: StringFieldUpdateOperationsInput | string
    descripcionProblema?: StringFieldUpdateOperationsInput | string
    costoEstimado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFieldUpdateOperationsInput | boolean
    estadoSolicitud?: EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
    fechaProgramada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaPublicacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaFinalizacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duracionEstimadaMin?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    solicitudesTecnico?: SolicitudTecnicoUpdateManyWithoutSolicitudNestedInput
    calificaciones?: CalificacionUpdateManyWithoutSolicitudNestedInput
  }

  export type SolicitudUncheckedUpdateWithoutTransaccionesInput = {
    idSolicitud?: IntFieldUpdateOperationsInput | number
    idUser?: IntFieldUpdateOperationsInput | number
    idTipoServicio?: IntFieldUpdateOperationsInput | number
    codigoParroquia?: StringFieldUpdateOperationsInput | string
    tituloProblema?: StringFieldUpdateOperationsInput | string
    descripcionProblema?: StringFieldUpdateOperationsInput | string
    costoEstimado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    costoPromocion?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    promocion?: BoolFieldUpdateOperationsInput | boolean
    estadoSolicitud?: EnumEstadoSolicitudFieldUpdateOperationsInput | $Enums.EstadoSolicitud
    fechaProgramada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaPublicacion?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaInicio?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    fechaFinalizacion?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    duracionEstimadaMin?: NullableIntFieldUpdateOperationsInput | number | null
    isActive?: BoolFieldUpdateOperationsInput | boolean
    deletedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    createdBy?: NullableIntFieldUpdateOperationsInput | number | null
    updatedBy?: NullableIntFieldUpdateOperationsInput | number | null
    solicitudesTecnico?: SolicitudTecnicoUncheckedUpdateManyWithoutSolicitudNestedInput
    calificaciones?: CalificacionUncheckedUpdateManyWithoutSolicitudNestedInput
  }

  export type SolicitudTecnicoCreateManySolicitudInput = {
    idSolTec?: number
    idTecnico: number
    costoAcordado?: Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo: $Enums.EstadoAceptacion
    fechaPropuesta?: Date | string
    fechaConfirmada?: Date | string | null
    notas?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type CalificacionCreateManySolicitudInput = {
    idCalificacion?: number
    idTecnico: number
    puntaje: $Enums.PuntajeCalificacion
    comentario?: string | null
    fechaCalificacion?: Date | string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransaccionCreateManySolicitudInput = {
    idTransaccion?: number
    monto: Decimal | DecimalJsLike | number | string
    metodoPago: $Enums.MetodoPago
    estadoPago?: $Enums.EstadoPago
    fechaPago?: Date | string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SolicitudTecnicoUpdateWithoutSolicitudInput = {
    idTecnico?: IntFieldUpdateOperationsInput | number
    costoAcordado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionFieldUpdateOperationsInput | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaConfirmada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SolicitudTecnicoUncheckedUpdateWithoutSolicitudInput = {
    idSolTec?: IntFieldUpdateOperationsInput | number
    idTecnico?: IntFieldUpdateOperationsInput | number
    costoAcordado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionFieldUpdateOperationsInput | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaConfirmada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SolicitudTecnicoUncheckedUpdateManyWithoutSolicitudInput = {
    idSolTec?: IntFieldUpdateOperationsInput | number
    idTecnico?: IntFieldUpdateOperationsInput | number
    costoAcordado?: NullableDecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string | null
    estadoAcuerdo?: EnumEstadoAceptacionFieldUpdateOperationsInput | $Enums.EstadoAceptacion
    fechaPropuesta?: DateTimeFieldUpdateOperationsInput | Date | string
    fechaConfirmada?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalificacionUpdateWithoutSolicitudInput = {
    idTecnico?: IntFieldUpdateOperationsInput | number
    puntaje?: EnumPuntajeCalificacionFieldUpdateOperationsInput | $Enums.PuntajeCalificacion
    comentario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCalificacion?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalificacionUncheckedUpdateWithoutSolicitudInput = {
    idCalificacion?: IntFieldUpdateOperationsInput | number
    idTecnico?: IntFieldUpdateOperationsInput | number
    puntaje?: EnumPuntajeCalificacionFieldUpdateOperationsInput | $Enums.PuntajeCalificacion
    comentario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCalificacion?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type CalificacionUncheckedUpdateManyWithoutSolicitudInput = {
    idCalificacion?: IntFieldUpdateOperationsInput | number
    idTecnico?: IntFieldUpdateOperationsInput | number
    puntaje?: EnumPuntajeCalificacionFieldUpdateOperationsInput | $Enums.PuntajeCalificacion
    comentario?: NullableStringFieldUpdateOperationsInput | string | null
    fechaCalificacion?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaccionUpdateWithoutSolicitudInput = {
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFieldUpdateOperationsInput | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaccionUncheckedUpdateWithoutSolicitudInput = {
    idTransaccion?: IntFieldUpdateOperationsInput | number
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFieldUpdateOperationsInput | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaccionUncheckedUpdateManyWithoutSolicitudInput = {
    idTransaccion?: IntFieldUpdateOperationsInput | number
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFieldUpdateOperationsInput | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}