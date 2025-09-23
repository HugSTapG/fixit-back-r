
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
 * Model Transaccion
 * 
 */
export type Transaccion = $Result.DefaultSelection<Prisma.$TransaccionPayload>

/**
 * Enums
 */
export namespace $Enums {
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
 * // Fetch zero or more Transaccions
 * const transaccions = await prisma.transaccion.findMany()
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
   * // Fetch zero or more Transaccions
   * const transaccions = await prisma.transaccion.findMany()
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
      modelProps: "transaccion"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
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
   * Models
   */

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
    referencia: string | null
    notas: string | null
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
    referencia: string | null
    notas: string | null
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
    referencia: number
    notas: number
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
    referencia?: true
    notas?: true
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
    referencia?: true
    notas?: true
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
    referencia?: true
    notas?: true
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
    referencia: string | null
    notas: string | null
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
    referencia?: boolean
    notas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["transaccion"]>

  export type TransaccionSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idTransaccion?: boolean
    idSolicitud?: boolean
    monto?: boolean
    metodoPago?: boolean
    estadoPago?: boolean
    fechaPago?: boolean
    referencia?: boolean
    notas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["transaccion"]>

  export type TransaccionSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    idTransaccion?: boolean
    idSolicitud?: boolean
    monto?: boolean
    metodoPago?: boolean
    estadoPago?: boolean
    fechaPago?: boolean
    referencia?: boolean
    notas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }, ExtArgs["result"]["transaccion"]>

  export type TransaccionSelectScalar = {
    idTransaccion?: boolean
    idSolicitud?: boolean
    monto?: boolean
    metodoPago?: boolean
    estadoPago?: boolean
    fechaPago?: boolean
    referencia?: boolean
    notas?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TransaccionOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"idTransaccion" | "idSolicitud" | "monto" | "metodoPago" | "estadoPago" | "fechaPago" | "referencia" | "notas" | "createdAt" | "updatedAt", ExtArgs["result"]["transaccion"]>

  export type $TransaccionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Transaccion"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      idTransaccion: number
      idSolicitud: number
      monto: Prisma.Decimal
      metodoPago: $Enums.MetodoPago
      estadoPago: $Enums.EstadoPago
      fechaPago: Date | null
      referencia: string | null
      notas: string | null
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
    readonly referencia: FieldRef<"Transaccion", 'String'>
    readonly notas: FieldRef<"Transaccion", 'String'>
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


  export const TransaccionScalarFieldEnum: {
    idTransaccion: 'idTransaccion',
    idSolicitud: 'idSolicitud',
    monto: 'monto',
    metodoPago: 'metodoPago',
    estadoPago: 'estadoPago',
    fechaPago: 'fechaPago',
    referencia: 'referencia',
    notas: 'notas',
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
   * Reference to a field of type 'Decimal'
   */
  export type DecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal'>
    


  /**
   * Reference to a field of type 'Decimal[]'
   */
  export type ListDecimalFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Decimal[]'>
    


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
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


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
    referencia?: StringNullableFilter<"Transaccion"> | string | null
    notas?: StringNullableFilter<"Transaccion"> | string | null
    createdAt?: DateTimeFilter<"Transaccion"> | Date | string
    updatedAt?: DateTimeFilter<"Transaccion"> | Date | string
  }

  export type TransaccionOrderByWithRelationInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
    metodoPago?: SortOrder
    estadoPago?: SortOrder
    fechaPago?: SortOrderInput | SortOrder
    referencia?: SortOrderInput | SortOrder
    notas?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
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
    referencia?: StringNullableFilter<"Transaccion"> | string | null
    notas?: StringNullableFilter<"Transaccion"> | string | null
    createdAt?: DateTimeFilter<"Transaccion"> | Date | string
    updatedAt?: DateTimeFilter<"Transaccion"> | Date | string
  }, "idTransaccion">

  export type TransaccionOrderByWithAggregationInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
    metodoPago?: SortOrder
    estadoPago?: SortOrder
    fechaPago?: SortOrderInput | SortOrder
    referencia?: SortOrderInput | SortOrder
    notas?: SortOrderInput | SortOrder
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
    referencia?: StringNullableWithAggregatesFilter<"Transaccion"> | string | null
    notas?: StringNullableWithAggregatesFilter<"Transaccion"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"Transaccion"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Transaccion"> | Date | string
  }

  export type TransaccionCreateInput = {
    idSolicitud: number
    monto: Decimal | DecimalJsLike | number | string
    metodoPago: $Enums.MetodoPago
    estadoPago?: $Enums.EstadoPago
    fechaPago?: Date | string | null
    referencia?: string | null
    notas?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransaccionUncheckedCreateInput = {
    idTransaccion?: number
    idSolicitud: number
    monto: Decimal | DecimalJsLike | number | string
    metodoPago: $Enums.MetodoPago
    estadoPago?: $Enums.EstadoPago
    fechaPago?: Date | string | null
    referencia?: string | null
    notas?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransaccionUpdateInput = {
    idSolicitud?: IntFieldUpdateOperationsInput | number
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFieldUpdateOperationsInput | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type TransaccionUncheckedUpdateInput = {
    idTransaccion?: IntFieldUpdateOperationsInput | number
    idSolicitud?: IntFieldUpdateOperationsInput | number
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFieldUpdateOperationsInput | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
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
    referencia?: string | null
    notas?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type TransaccionUpdateManyMutationInput = {
    idSolicitud?: IntFieldUpdateOperationsInput | number
    monto?: DecimalFieldUpdateOperationsInput | Decimal | DecimalJsLike | number | string
    metodoPago?: EnumMetodoPagoFieldUpdateOperationsInput | $Enums.MetodoPago
    estadoPago?: EnumEstadoPagoFieldUpdateOperationsInput | $Enums.EstadoPago
    fechaPago?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
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
    referencia?: NullableStringFieldUpdateOperationsInput | string | null
    notas?: NullableStringFieldUpdateOperationsInput | string | null
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

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type TransaccionCountOrderByAggregateInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
    metodoPago?: SortOrder
    estadoPago?: SortOrder
    fechaPago?: SortOrder
    referencia?: SortOrder
    notas?: SortOrder
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
    referencia?: SortOrder
    notas?: SortOrder
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
    referencia?: SortOrder
    notas?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TransaccionSumOrderByAggregateInput = {
    idTransaccion?: SortOrder
    idSolicitud?: SortOrder
    monto?: SortOrder
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

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
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

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
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