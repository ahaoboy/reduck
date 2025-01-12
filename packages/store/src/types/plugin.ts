import { Store } from 'redux';
import { Context, StoreConfig } from './app';
import { Action, Model, ModelDesc, MountedModel } from './model';

export interface PluginContext {
  store: Store;
}

export interface PluginLifeCycle {
  /**
   * Before createStore, this hook will be revoked. Use to change config.
   */
  config?: <T extends StoreConfig>(config: T) => T;

  /**
   * Runs after store created
   */
  afterCreateStore?: <T extends Context['store'] = Context['store']>(
    store: T,
  ) => T;

  /**
   * Runs when a model mounted for first time.
   */
  modelMount?: <T extends { modelDesc: ModelDesc; mountedModel: MountedModel }>(
    params: T,
    api: {
      /**
       * path: ['todo', 'load']
       */
      setDispatchAction: (path: string[], dispatchAction: any) => void;
    },
  ) => T;

  /**
   * Revoke before useModel value return.
   * You can custom returned value in this hook.
   */
  useModel?: <T extends { state: any; actions: any }>(
    bypassParams: T,
    {
      models,
      mountedModels,
    }: {
      models: Model[];
      mountedModels: MountedModel[];
    },
  ) => T;

  prepareModelDesc?: (modelDesc: ModelDesc) => ModelDesc;

  /**
   * Revoke before reducer excute. You can wrap and return your reducer.
   */
  beforeReducer?: (reducer: Action<any>, { name: string }) => Action<any>;
}

export type Plugin = (context: PluginContext) => PluginLifeCycle;
