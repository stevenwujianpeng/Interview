var Store = function Store (options) {

    var plugins = options.plugins; if ( plugins === void 0 ) plugins = [];
    var strict = options.strict; if ( strict === void 0 ) strict = false;

    var state = options.state; if ( state === void 0 ) state = {};
    if (typeof state === 'function') {
        state = state() || {};
    }

    // store internal state
    this._committing = false;
    this._actions = Object.create(null);
    this._actionSubscribers = [];
    this._mutations = Object.create(null);
    this._wrappedGetters = Object.create(null);
    this._modules = new ModuleCollection(options);
    this._modulesNamespaceMap = Object.create(null);
    this._subscribers = [];
    this._watcherVM = new Vue();

    // bind commit and dispatch to self
    var store = this;
    var ref = this;
    var dispatch = ref.dispatch;
    var commit = ref.commit;
    this.dispatch = function boundDispatch (type, payload) {
        return dispatch.call(store, type, payload)
    };
    this.commit = function boundCommit (type, payload, options) {
        return commit.call(store, type, payload, options)
    };

    // strict mode
    this.strict = strict;

    // init root module.
    // this also recursively registers all sub-modules
    // and collects all module getters inside this._wrappedGetters
    installModule(this, state, [], this._modules.root);

    // initialize the store vm, which is responsible for the reactivity
    // (also registers _wrappedGetters as computed properties)
    resetStoreVM(this, state);

    // apply plugins
    plugins.forEach(function (plugin) { return plugin(this$1); });

    if (Vue.config.devtools) {
        devtoolPlugin(this);
    }
};