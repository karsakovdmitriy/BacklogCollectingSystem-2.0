import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Expose client if keys are present
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

const rawSupabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Helper to intercept and log database errors and exceptions
function wrapPromise(promise: any, description: string) {
  if (!promise || typeof promise.then !== 'function') return promise;

  const originalThen = promise.then;
  promise.then = function (onfulfilled: any, onrejected: any) {
    return originalThen.call(
      this,
      (result: any) => {
        if (result && result.error) {
          console.error(`[Supabase Error] failed during [${description}]:`, result.error);
        }
        if (onfulfilled) {
          return onfulfilled(result);
        }
        return result;
      },
      (err: any) => {
        console.error(`[Supabase Exception] failed during [${description}]:`, err);
        if (onrejected) {
          return onrejected(err);
        }
        throw err;
      }
    );
  };
  return promise;
}

function makeSafeSupabase(client: any) {
  if (!client) return null;

  // We construct a proxy or wrapped client to intercept from()
  return new Proxy(client, {
    get(target, prop, receiver) {
      if (prop === 'from') {
        return function (table: string) {
          const queryBuilder = target.from(table);

          // Wrap the standard mutation and selection methods
          const originalInsert = queryBuilder.insert;
          queryBuilder.insert = function (...args: any[]) {
            const promise = originalInsert.apply(this, args);
            return wrapPromise(promise, `insert into ${table}`);
          };

          const originalUpdate = queryBuilder.update;
          queryBuilder.update = function (...args: any[]) {
            const promise = originalUpdate.apply(this, args);
            return wrapPromise(promise, `update ${table}`);
          };

          const originalDelete = queryBuilder.delete;
          queryBuilder.delete = function (...args: any[]) {
            const promise = originalDelete.apply(this, args);
            return wrapPromise(promise, `delete from ${table}`);
          };

          const originalUpsert = queryBuilder.upsert;
          queryBuilder.upsert = function (...args: any[]) {
            const promise = originalUpsert.apply(this, args);
            return wrapPromise(promise, `upsert into ${table}`);
          };

          const originalSelect = queryBuilder.select;
          queryBuilder.select = function (...args: any[]) {
            const promise = originalSelect.apply(this, args);
            return wrapPromise(promise, `select from ${table}`);
          };

          return queryBuilder;
        };
      }
      return Reflect.get(target, prop, receiver);
    }
  });
}

export const supabase = makeSafeSupabase(rawSupabase);
