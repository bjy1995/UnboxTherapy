
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? undefined : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.23.1' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev("SvelteDOMSetProperty", { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.data === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe,
        };
    }
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function regexparam (str, loose) {
    	if (str instanceof RegExp) return { keys:false, pattern:str };
    	var c, o, tmp, ext, keys=[], pattern='', arr = str.split('/');
    	arr[0] || arr.shift();

    	while (tmp = arr.shift()) {
    		c = tmp[0];
    		if (c === '*') {
    			keys.push('wild');
    			pattern += '/(.*)';
    		} else if (c === ':') {
    			o = tmp.indexOf('?', 1);
    			ext = tmp.indexOf('.', 1);
    			keys.push( tmp.substring(1, !!~o ? o : !!~ext ? ext : tmp.length) );
    			pattern += !!~o && !~ext ? '(?:/([^/]+?))?' : '/([^/]+?)';
    			if (!!~ext) pattern += (!!~o ? '?' : '') + '\\' + tmp.substring(ext);
    		} else {
    			pattern += '/' + tmp;
    		}
    	}

    	return {
    		keys: keys,
    		pattern: new RegExp('^' + pattern + (loose ? '(?=$|\/)' : '\/?$'), 'i')
    	};
    }

    /* node_modules\svelte-spa-router\Router.svelte generated by Svelte v3.23.1 */

    const { Error: Error_1, Object: Object_1, console: console_1 } = globals;

    // (219:0) {:else}
    function create_else_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return { $$inline: true };
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props());
    		switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[5]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					switch_instance.$on("routeEvent", /*routeEvent_handler_1*/ ctx[5]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(219:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (217:0) {#if componentParams}
    function create_if_block(ctx) {
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		return {
    			props: { params: /*componentParams*/ ctx[1] },
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		var switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[4]);
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*componentParams*/ 2) switch_instance_changes.params = /*componentParams*/ ctx[1];

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("routeEvent", /*routeEvent_handler*/ ctx[4]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(217:0) {#if componentParams}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*componentParams*/ ctx[1]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function wrap(route, userData, ...conditions) {
    	// Check if we don't have userData
    	if (userData && typeof userData == "function") {
    		conditions = conditions && conditions.length ? conditions : [];
    		conditions.unshift(userData);
    		userData = undefined;
    	}

    	// Parameter route and each item of conditions must be functions
    	if (!route || typeof route != "function") {
    		throw Error("Invalid parameter route");
    	}

    	if (conditions && conditions.length) {
    		for (let i = 0; i < conditions.length; i++) {
    			if (!conditions[i] || typeof conditions[i] != "function") {
    				throw Error("Invalid parameter conditions[" + i + "]");
    			}
    		}
    	}

    	// Returns an object that contains all the functions to execute too
    	const obj = { route, userData };

    	if (conditions && conditions.length) {
    		obj.conditions = conditions;
    	}

    	// The _sveltesparouter flag is to confirm the object was created by this router
    	Object.defineProperty(obj, "_sveltesparouter", { value: true });

    	return obj;
    }

    /**
     * @typedef {Object} Location
     * @property {string} location - Location (page/view), for example `/book`
     * @property {string} [querystring] - Querystring from the hash, as a string not parsed
     */
    /**
     * Returns the current location from the hash.
     *
     * @returns {Location} Location object
     * @private
     */
    function getLocation() {
    	const hashPosition = window.location.href.indexOf("#/");

    	let location = hashPosition > -1
    	? window.location.href.substr(hashPosition + 1)
    	: "/";

    	// Check if there's a querystring
    	const qsPosition = location.indexOf("?");

    	let querystring = "";

    	if (qsPosition > -1) {
    		querystring = location.substr(qsPosition + 1);
    		location = location.substr(0, qsPosition);
    	}

    	return { location, querystring };
    }

    const loc = readable(null, // eslint-disable-next-line prefer-arrow-callback
    function start(set) {
    	set(getLocation());

    	const update = () => {
    		set(getLocation());
    	};

    	window.addEventListener("hashchange", update, false);

    	return function stop() {
    		window.removeEventListener("hashchange", update, false);
    	};
    });

    const location = derived(loc, $loc => $loc.location);
    const querystring = derived(loc, $loc => $loc.querystring);

    function push(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		window.location.hash = (location.charAt(0) == "#" ? "" : "#") + location;
    	});
    }

    function pop() {
    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		window.history.back();
    	});
    }

    function replace(location) {
    	if (!location || location.length < 1 || location.charAt(0) != "/" && location.indexOf("#/") !== 0) {
    		throw Error("Invalid parameter location");
    	}

    	// Execute this code when the current call stack is complete
    	return tick().then(() => {
    		const dest = (location.charAt(0) == "#" ? "" : "#") + location;

    		try {
    			window.history.replaceState(undefined, undefined, dest);
    		} catch(e) {
    			// eslint-disable-next-line no-console
    			console.warn("Caught exception while replacing the current page. If you're running this in the Svelte REPL, please note that the `replace` method might not work in this environment.");
    		}

    		// The method above doesn't trigger the hashchange event, so let's do that manually
    		window.dispatchEvent(new Event("hashchange"));
    	});
    }

    function link(node, hrefVar) {
    	// Only apply to <a> tags
    	if (!node || !node.tagName || node.tagName.toLowerCase() != "a") {
    		throw Error("Action \"link\" can only be used with <a> tags");
    	}

    	updateLink(node, hrefVar || node.getAttribute("href"));

    	return {
    		update(updated) {
    			updateLink(node, updated);
    		}
    	};
    }

    // Internal function used by the link function
    function updateLink(node, href) {
    	// Destination must start with '/'
    	if (!href || href.length < 1 || href.charAt(0) != "/") {
    		throw Error("Invalid value for \"href\" attribute");
    	}

    	// Add # to the href attribute
    	node.setAttribute("href", "#" + href);
    }

    function nextTickPromise(cb) {
    	// eslint-disable-next-line no-console
    	console.warn("nextTickPromise from 'svelte-spa-router' is deprecated and will be removed in version 3; use the 'tick' method from the Svelte runtime instead");

    	return tick().then(cb);
    }

    function instance($$self, $$props, $$invalidate) {
    	let $loc,
    		$$unsubscribe_loc = noop;

    	validate_store(loc, "loc");
    	component_subscribe($$self, loc, $$value => $$invalidate(6, $loc = $$value));
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loc());
    	let { routes = {} } = $$props;
    	let { prefix = "" } = $$props;

    	/**
     * Container for a route: path, component
     */
    	class RouteItem {
    		/**
     * Initializes the object and creates a regular expression from the path, using regexparam.
     *
     * @param {string} path - Path to the route (must start with '/' or '*')
     * @param {SvelteComponent} component - Svelte component for the route
     */
    		constructor(path, component) {
    			if (!component || typeof component != "function" && (typeof component != "object" || component._sveltesparouter !== true)) {
    				throw Error("Invalid component object");
    			}

    			// Path must be a regular or expression, or a string starting with '/' or '*'
    			if (!path || typeof path == "string" && (path.length < 1 || path.charAt(0) != "/" && path.charAt(0) != "*") || typeof path == "object" && !(path instanceof RegExp)) {
    				throw Error("Invalid value for \"path\" argument");
    			}

    			const { pattern, keys } = regexparam(path);
    			this.path = path;

    			// Check if the component is wrapped and we have conditions
    			if (typeof component == "object" && component._sveltesparouter === true) {
    				this.component = component.route;
    				this.conditions = component.conditions || [];
    				this.userData = component.userData;
    			} else {
    				this.component = component;
    				this.conditions = [];
    				this.userData = undefined;
    			}

    			this._pattern = pattern;
    			this._keys = keys;
    		}

    		/**
     * Checks if `path` matches the current route.
     * If there's a match, will return the list of parameters from the URL (if any).
     * In case of no match, the method will return `null`.
     *
     * @param {string} path - Path to test
     * @returns {null|Object.<string, string>} List of paramters from the URL if there's a match, or `null` otherwise.
     */
    		match(path) {
    			// If there's a prefix, remove it before we run the matching
    			if (prefix && path.startsWith(prefix)) {
    				path = path.substr(prefix.length) || "/";
    			}

    			// Check if the pattern matches
    			const matches = this._pattern.exec(path);

    			if (matches === null) {
    				return null;
    			}

    			// If the input was a regular expression, this._keys would be false, so return matches as is
    			if (this._keys === false) {
    				return matches;
    			}

    			const out = {};
    			let i = 0;

    			while (i < this._keys.length) {
    				out[this._keys[i]] = matches[++i] || null;
    			}

    			return out;
    		}

    		/**
     * Dictionary with route details passed to the pre-conditions functions, as well as the `routeLoaded` and `conditionsFailed` events
     * @typedef {Object} RouteDetail
     * @property {SvelteComponent} component - Svelte component
     * @property {string} name - Name of the Svelte component
     * @property {string} location - Location path
     * @property {string} querystring - Querystring from the hash
     * @property {Object} [userData] - Custom data passed by the user
     */
    		/**
     * Executes all conditions (if any) to control whether the route can be shown. Conditions are executed in the order they are defined, and if a condition fails, the following ones aren't executed.
     * 
     * @param {RouteDetail} detail - Route detail
     * @returns {bool} Returns true if all the conditions succeeded
     */
    		checkConditions(detail) {
    			for (let i = 0; i < this.conditions.length; i++) {
    				if (!this.conditions[i](detail)) {
    					return false;
    				}
    			}

    			return true;
    		}
    	}

    	// Set up all routes
    	const routesList = [];

    	if (routes instanceof Map) {
    		// If it's a map, iterate on it right away
    		routes.forEach((route, path) => {
    			routesList.push(new RouteItem(path, route));
    		});
    	} else {
    		// We have an object, so iterate on its own properties
    		Object.keys(routes).forEach(path => {
    			routesList.push(new RouteItem(path, routes[path]));
    		});
    	}

    	// Props for the component to render
    	let component = null;

    	let componentParams = null;

    	// Event dispatcher from Svelte
    	const dispatch = createEventDispatcher();

    	// Just like dispatch, but executes on the next iteration of the event loop
    	const dispatchNextTick = (name, detail) => {
    		// Execute this code when the current call stack is complete
    		tick().then(() => {
    			dispatch(name, detail);
    		});
    	};

    	const writable_props = ["routes", "prefix"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Router", $$slots, []);

    	function routeEvent_handler(event) {
    		bubble($$self, event);
    	}

    	function routeEvent_handler_1(event) {
    		bubble($$self, event);
    	}

    	$$self.$set = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    	};

    	$$self.$capture_state = () => ({
    		readable,
    		derived,
    		tick,
    		wrap,
    		getLocation,
    		loc,
    		location,
    		querystring,
    		push,
    		pop,
    		replace,
    		link,
    		updateLink,
    		nextTickPromise,
    		createEventDispatcher,
    		regexparam,
    		routes,
    		prefix,
    		RouteItem,
    		routesList,
    		component,
    		componentParams,
    		dispatch,
    		dispatchNextTick,
    		$loc
    	});

    	$$self.$inject_state = $$props => {
    		if ("routes" in $$props) $$invalidate(2, routes = $$props.routes);
    		if ("prefix" in $$props) $$invalidate(3, prefix = $$props.prefix);
    		if ("component" in $$props) $$invalidate(0, component = $$props.component);
    		if ("componentParams" in $$props) $$invalidate(1, componentParams = $$props.componentParams);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*component, $loc*/ 65) {
    			// Handle hash change events
    			// Listen to changes in the $loc store and update the page
    			 {
    				// Find a route matching the location
    				$$invalidate(0, component = null);

    				let i = 0;

    				while (!component && i < routesList.length) {
    					const match = routesList[i].match($loc.location);

    					if (match) {
    						const detail = {
    							component: routesList[i].component,
    							name: routesList[i].component.name,
    							location: $loc.location,
    							querystring: $loc.querystring,
    							userData: routesList[i].userData
    						};

    						// Check if the route can be loaded - if all conditions succeed
    						if (!routesList[i].checkConditions(detail)) {
    							// Trigger an event to notify the user
    							dispatchNextTick("conditionsFailed", detail);

    							break;
    						}

    						$$invalidate(0, component = routesList[i].component);

    						// Set componentParams onloy if we have a match, to avoid a warning similar to `<Component> was created with unknown prop 'params'`
    						// Of course, this assumes that developers always add a "params" prop when they are expecting parameters
    						if (match && typeof match == "object" && Object.keys(match).length) {
    							$$invalidate(1, componentParams = match);
    						} else {
    							$$invalidate(1, componentParams = null);
    						}

    						dispatchNextTick("routeLoaded", detail);
    					}

    					i++;
    				}
    			}
    		}
    	};

    	return [
    		component,
    		componentParams,
    		routes,
    		prefix,
    		routeEvent_handler,
    		routeEvent_handler_1
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { routes: 2, prefix: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get routes() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set routes(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get prefix() {
    		throw new Error_1("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set prefix(value) {
    		throw new Error_1("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\views\Knn.svelte generated by Svelte v3.23.1 */

    const { Object: Object_1$1 } = globals;
    const file = "src\\views\\Knn.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[27] = list[i];
    	child_ctx[29] = i;
    	return child_ctx;
    }

    // (342:16) {#each labels as label, i}
    function create_each_block(ctx) {
    	let p;
    	let t0_value = /*label*/ ctx[27] + "";
    	let t0;
    	let t1;
    	let t2_value = /*counts*/ ctx[0][/*label*/ ctx[27]] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(t0_value);
    			t1 = text(" : ");
    			t2 = text(t2_value);
    			add_location(p, file, 342, 20, 11196);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			append_dev(p, t1);
    			append_dev(p, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*counts*/ 1 && t2_value !== (t2_value = /*counts*/ ctx[0][/*label*/ ctx[27]] + "")) set_data_dev(t2, t2_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(342:16) {#each labels as label, i}",
    		ctx
    	});

    	return block;
    }

    // (340:18)                   
    function fallback_block(ctx) {
    	let p;
    	let t0;
    	let t1;
    	let each_1_anchor;
    	let each_value = /*labels*/ ctx[3];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			t0 = text(/*testlabel*/ ctx[1]);
    			t1 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    			set_style(p, "font-size", "25px");
    			add_location(p, file, 340, 16, 11086);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t0);
    			insert_dev(target, t1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*testlabel*/ 2) set_data_dev(t0, /*testlabel*/ ctx[1]);

    			if (dirty & /*counts, labels*/ 9) {
    				each_value = /*labels*/ ctx[3];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching) detach_dev(t1);
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(340:18)                   ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let div6;
    	let div2;
    	let div1;
    	let div0;
    	let button0;
    	let i0;
    	let t1;
    	let button1;
    	let i1;
    	let t3;
    	let span;
    	let t4;
    	let html_tag;
    	let t5;
    	let div5;
    	let div3;
    	let svg_1;
    	let t6;
    	let div4;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[4], null);
    	const default_slot_or_fallback = default_slot || fallback_block(ctx);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			button0 = element("button");
    			i0 = element("i");
    			i0.textContent = "add";
    			t1 = space();
    			button1 = element("button");
    			i1 = element("i");
    			i1.textContent = "remove";
    			t3 = space();
    			span = element("span");
    			t4 = space();
    			t5 = space();
    			div5 = element("div");
    			div3 = element("div");
    			svg_1 = svg_element("svg");
    			t6 = space();
    			div4 = element("div");
    			if (default_slot_or_fallback) default_slot_or_fallback.c();
    			attr_dev(i0, "class", "material-icons");
    			add_location(i0, file, 323, 20, 10453);
    			attr_dev(button0, "id", "add-layers");
    			attr_dev(button0, "class", "mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab");
    			add_location(button0, file, 322, 16, 10337);
    			attr_dev(i1, "class", "material-icons");
    			add_location(i1, file, 326, 20, 10650);
    			attr_dev(button1, "id", "remove-layers");
    			attr_dev(button1, "class", "mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab");
    			add_location(button1, file, 325, 16, 10531);
    			attr_dev(div0, "class", "ui-numHiddenLayers");
    			set_style(div0, "float", "left");
    			set_style(div0, "margin-right", "15px");
    			add_location(div0, file, 321, 12, 10246);
    			attr_dev(span, "id", "num-k");
    			set_style(span, "float", "left");
    			set_style(span, "margin-right", "5px");
    			set_style(span, "font-size", "25px");
    			add_location(span, file, 329, 12, 10747);
    			set_style(div1, "float", "left");
    			set_style(div1, "margin-right", "5px");
    			add_location(div1, file, 320, 8, 10187);
    			html_tag = new HtmlTag(null);
    			attr_dev(div2, "id", "top-legends");
    			attr_dev(div2, "class", "clearfix svelte-bzlv24");
    			add_location(div2, file, 319, 4, 10138);
    			attr_dev(svg_1, "id", "knn-svg");
    			add_location(svg_1, file, 336, 12, 10953);
    			attr_dev(div3, "class", "box1 svelte-bzlv24");
    			add_location(div3, file, 335, 8, 10920);
    			attr_dev(div4, "class", "box svelte-bzlv24");
    			set_style(div4, "position", "relative");
    			add_location(div4, file, 338, 8, 11003);
    			attr_dev(div5, "id", "knn-graph");
    			add_location(div5, file, 334, 4, 10890);
    			attr_dev(div6, "class", "knn");
    			add_location(div6, file, 318, 0, 10115);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, i0);
    			append_dev(div0, t1);
    			append_dev(div0, button1);
    			append_dev(button1, i1);
    			append_dev(div1, t3);
    			append_dev(div1, span);
    			append_dev(div2, t4);
    			html_tag.m(/*strlegend*/ ctx[2], div2);
    			append_dev(div6, t5);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, svg_1);
    			append_dev(div5, t6);
    			append_dev(div5, div4);

    			if (default_slot_or_fallback) {
    				default_slot_or_fallback.m(div4, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!current || dirty & /*strlegend*/ 4) html_tag.p(/*strlegend*/ ctx[2]);

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[4], dirty, null, null);
    				}
    			} else {
    				if (default_slot_or_fallback && default_slot_or_fallback.p && dirty & /*counts, testlabel*/ 3) {
    					default_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			if (default_slot_or_fallback) default_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const height = 280;
    const width = 500;
    const r = 3.5;

    function swatches(
    	{ color, format = x => x, swatchSize = 20, swatchWidth = swatchSize, swatchHeight = swatchSize, marginLeft = 0 }
    ) {
    	const id = "color-legend2";

    	return `<div style="display: flex; align-items: center; min-height: 33px; margin-left: ${+marginLeft}px; font: 10px sans-serif; float: right">
        <style>

        .${id} {
        display: inline-flex;
        align-items: center;
        margin-right: 2em;
        }

        .${id}::before {
        content: "";
        width: ${+swatchWidth}px;
        height: ${+swatchHeight}px;
        margin-right: 0.5em;
        background: var(--color);
        }

        </style>
        <div>${color.domain().map(value => `<span class="${id}" style="--color: ${color(value)}">${value}</span>`).join("")}</div>`;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let outdata;
    	let sortdata;
    	var kdata;

    	const color = {
    		"apple": "red",
    		"blueberry": "steelblue",
    		"watermelon": "green"
    	};

    	const arrcolor = ["red", "steelblue", "green"];
    	const labels = ["apple", "blueberry", "watermelon"];
    	const margin = { top: 20, right: 10, bottom: 10, left: 40 };

    	let counts = {
    		"apple": 0,
    		"blueberry": 0,
    		"watermelon": 0
    	};

    	let testlabel = "";
    	let k = 6;
    	let svg;
    	let xAxis;
    	let yAxis;
    	let y, ry;
    	let x, rx;
    	let point = {};
    	let link;
    	let strlegend;

    	onMount(async () => {
    		$$invalidate(2, strlegend = swatches({ color: d3.scaleOrdinal(labels, arrcolor) }));
    		const data = await d3.csv("/assets/data/test.csv");

    		// const data = d3.csvParse(await FileAttachment("/assets/data/us-population-state-age.csv").text(), d3.autoType);
    		// const ages = data.columns.slice(1);
    		// for (const d of data) d.total = d3.sum(ages, age => d[age]);
    		// outdata = ages.flatMap(age => data.map(d => ({name: d.name, age, value: d[age] / d.total})));
    		const newlabels = data.columns.slice(1);

    		outdata = data.map(d => ({
    			x: d.x,
    			y: d.y,
    			label: labels[d.label - 1]
    		}));

    		y = d3.scaleLinear().domain(d3.extent(outdata, d => d.y)).rangeRound([margin.top, height - margin.bottom]);
    		ry = d3.scaleLinear().domain([margin.top, height - margin.bottom]).rangeRound(d3.extent(outdata, d => d.y));
    		x = d3.scaleLinear().domain(d3.extent(outdata, d => d.x)).rangeRound([margin.left + 10, width - margin.right]);
    		rx = d3.scaleLinear().domain([margin.left + 10, width - margin.right]).rangeRound(d3.extent(outdata, d => d.x));
    		yAxis = g => g.attr("transform", `translate(${margin.left},0)`).call(d3.axisLeft(y)).call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("x2", width - margin.right - margin.left)).call(g => g.selectAll(".domain").remove());
    		xAxis = g => g.attr("transform", `translate(0,${margin.top})`).call(d3.axisTop(x)).call(g => g.selectAll(".tick line").clone().attr("stroke-opacity", 0.1).attr("y2", height - margin.bottom - margin.top)).call(g => g.selectAll(".domain").remove());
    		svg = d3.select("#knn-svg").attr("viewBox", [0, 0, width, height]);
    		svg.append("g").call(xAxis);
    		svg.append("g").call(yAxis);
    		svg.append("g").attr("class", "tcircles").attr("fill", "none").attr("pointer-events", "all").selectAll("circle").data(outdata).join("circle").attr("stroke", d => color[d.label]).attr("r", r).attr("cx", d => x(d.x)).attr("cy", d => y(d.y)).append("title").text(d => `label: ${d.label}  (${d.x},  ${d.y})`);
    		const circles = d3.range(1).map(i => ({ x: 50, y: 50 }));
    		point.x = 50;
    		point.y = 50;
    		svg.append("g").selectAll("circle").data(circles).join("circle").attr("fill", "yellow").attr("stroke", "#C4C400").attr("r", r).attr("cx", d => x(d.x)).attr("cy", d => y(d.y)).call(d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended));
    		sortdata = outdata;

    		sortdata.sort((a, b) => {
    			let distance1 = (a.x - point.x) ** 2 + (a.y - point.y) ** 2;
    			let distance2 = (b.x - point.x) ** 2 + (b.y - point.y) ** 2;
    			return distance1 - distance2;
    		});

    		kdata = sortdata.slice(0, k);
    		link = svg.insert("g", ".tcircles").attr("id", "lines").selectAll("line").data(kdata).join("line").attr("stroke", d => color[d.label]).style("opacity", 0.5).attr("x1", x(point.x)).attr("y1", y(point.y)).attr("x2", d => x(d.x)).attr("y2", d => y(d.y));
    		d3.select("#num-k").text("k = " + k);

    		d3.select("#add-layers").on("click", () => {
    			k++;
    			let diff = 1;

    			if (k > 10) {
    				k = 10;
    				diff = 0;
    			}

    			d3.select("#num-k").text("k = " + k);
    			drawklines(diff);
    		});

    		d3.select("#remove-layers").on("click", () => {
    			k--;
    			let diff = -1;

    			if (k <= 0) {
    				k = 1;
    				diff = 0;
    			}

    			d3.select("#num-k").text("k = " + k);
    			drawklines(diff);
    		});

    		countlabelnums();
    	});

    	function drawklines(diff) {
    		sortdata.sort((a, b) => {
    			let distance1 = (a.x - point.x) ** 2 + (a.y - point.y) ** 2;
    			let distance2 = (b.x - point.x) ** 2 + (b.y - point.y) ** 2;
    			return distance1 - distance2;
    		});

    		kdata = sortdata.slice(0, k);

    		if (diff > 0) {
    			link = d3.select("#lines").selectAll("line");
    			link.data(kdata).enter().append("line").transition().duration(1000).attr("stroke", d => color[d.label]).style("opacity", 0.5).attr("x1", x(point.x)).attr("y1", y(point.y)).attr("x2", d => x(d.x)).attr("y2", d => y(d.y));
    		} else if (diff < 0) {
    			link = d3.select("#lines").selectAll("line");
    			link.data(kdata).exit().transition().duration(100).remove().attr("stroke", d => color[d.label]).style("opacity", 0.5).attr("x1", x(point.x)).attr("y1", y(point.y)).attr("x2", d => x(d.x)).attr("y2", d => y(d.y));
    		} else {
    			link.data(kdata).transition().duration(1000).attr("x1", x(point.x)).attr("y1", y(point.y)).attr("x2", d => x(d.x)).attr("y2", d => y(d.y)).attr("stroke", d => color[d.label]).style("opacity", 0.5);
    		}
    	}

    	function dragstarted(d) {
    		link = d3.select("#lines").selectAll("line");
    		d3.select(this).attr("stroke", "black");
    	}

    	function dragged(d) {
    		d3.select(this).raise().attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
    		point.x = rx(d3.event.x);
    		point.y = ry(d3.event.y);
    		link.data(kdata).attr("x1", x(point.x)).attr("y1", y(point.y)).attr("x2", d => x(d.x)).attr("y2", d => y(d.y));
    	}

    	function dragended(d) {
    		d3.select(this).attr("stroke", "#C4C400");

    		if (d3.event.x > width - margin.right || d3.event.x < margin.left + 10) {
    			d3.select(this).attr("cx", d.x = x(50));
    			point.x = 50;
    		} else if (d3.event.y > height - margin.bottom || d3.event.y < margin.top) {
    			d3.select(this).attr("cy", d.y = y(50));
    			point.y = 50;
    		} else {
    			point.x = rx(d3.event.x);
    			point.y = ry(d3.event.y);
    		}

    		drawklines(0);
    		countlabelnums();
    	}

    	function countlabelnums() {
    		$$invalidate(0, counts = {
    			"apple": 0,
    			"blueberry": 0,
    			"watermelon": 0
    		});

    		for (let i = 0; i < k; ++i) {
    			$$invalidate(0, counts[kdata[i].label] += 1, counts);
    		}

    		let max_num = 0;
    		let keys = Object.keys(counts);

    		for (let i = 0; i < keys.length; ++i) {
    			if (counts[keys[i]] > max_num) {
    				max_num = counts[keys[i]];
    				$$invalidate(1, testlabel = keys[i]);
    			}
    		}
    	}

    	const writable_props = [];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Knn> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Knn", $$slots, ['default']);

    	$$self.$set = $$props => {
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		outdata,
    		sortdata,
    		kdata,
    		color,
    		arrcolor,
    		labels,
    		margin,
    		height,
    		width,
    		r,
    		counts,
    		testlabel,
    		k,
    		svg,
    		xAxis,
    		yAxis,
    		y,
    		ry,
    		x,
    		rx,
    		point,
    		link,
    		strlegend,
    		drawklines,
    		dragstarted,
    		dragged,
    		dragended,
    		countlabelnums,
    		swatches
    	});

    	$$self.$inject_state = $$props => {
    		if ("outdata" in $$props) outdata = $$props.outdata;
    		if ("sortdata" in $$props) sortdata = $$props.sortdata;
    		if ("kdata" in $$props) kdata = $$props.kdata;
    		if ("counts" in $$props) $$invalidate(0, counts = $$props.counts);
    		if ("testlabel" in $$props) $$invalidate(1, testlabel = $$props.testlabel);
    		if ("k" in $$props) k = $$props.k;
    		if ("svg" in $$props) svg = $$props.svg;
    		if ("xAxis" in $$props) xAxis = $$props.xAxis;
    		if ("yAxis" in $$props) yAxis = $$props.yAxis;
    		if ("y" in $$props) y = $$props.y;
    		if ("ry" in $$props) ry = $$props.ry;
    		if ("x" in $$props) x = $$props.x;
    		if ("rx" in $$props) rx = $$props.rx;
    		if ("point" in $$props) point = $$props.point;
    		if ("link" in $$props) link = $$props.link;
    		if ("strlegend" in $$props) $$invalidate(2, strlegend = $$props.strlegend);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [counts, testlabel, strlegend, labels, $$scope, $$slots];
    }

    class Knn extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Knn",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\views\home.svelte generated by Svelte v3.23.1 */
    const file$1 = "src\\views\\home.svelte";

    function create_fragment$2(ctx) {
    	let div0;
    	let ul;
    	let li0;
    	let a0;
    	let t1;
    	let li1;
    	let a1;
    	let t3;
    	let li2;
    	let a2;
    	let t5;
    	let li3;
    	let a3;
    	let t7;
    	let li4;
    	let a4;
    	let t9;
    	let li5;
    	let a5;
    	let t11;
    	let div9;
    	let div1;
    	let t12;
    	let div3;
    	let h1;
    	let t14;
    	let h20;
    	let t16;
    	let div2;
    	let t17;
    	let p0;
    	let t18;
    	let strong0;
    	let t20;
    	let t21;
    	let p1;
    	let strong1;
    	let t23;
    	let t24;
    	let p2;
    	let t26;
    	let div4;
    	let h21;
    	let t28;
    	let div5;
    	let p3;
    	let t29;
    	let strong2;
    	let t31;
    	let t32;
    	let p4;
    	let t34;
    	let p5;
    	let t35;
    	let span0;
    	let t36;
    	let span39;
    	let span38;
    	let span1;
    	let math0;
    	let semantics0;
    	let mrow0;
    	let msub0;
    	let mi0;
    	let t38;
    	let mn0;
    	let t40;
    	let mo0;
    	let t42;
    	let msub1;
    	let mi1;
    	let t44;
    	let mn1;
    	let t46;
    	let mo1;
    	let t48;
    	let msub2;
    	let mi2;
    	let t50;
    	let mn2;
    	let t52;
    	let annotation0;
    	let t54;
    	let span37;
    	let span20;
    	let span2;
    	let t55;
    	let span16;
    	let span3;
    	let t57;
    	let span15;
    	let span14;
    	let span10;
    	let span8;
    	let span7;
    	let span4;
    	let t58;
    	let span6;
    	let span5;
    	let t60;
    	let span9;
    	let t62;
    	let span13;
    	let span12;
    	let span11;
    	let t63;
    	let span17;
    	let t64;
    	let span18;
    	let t66;
    	let span19;
    	let t67;
    	let span36;
    	let span21;
    	let t68;
    	let span35;
    	let span22;
    	let t70;
    	let span34;
    	let span33;
    	let span29;
    	let span27;
    	let span26;
    	let span23;
    	let t71;
    	let span25;
    	let span24;
    	let t73;
    	let span28;
    	let t75;
    	let span32;
    	let span31;
    	let span30;
    	let t76;
    	let div6;
    	let h3;
    	let t78;
    	let div7;
    	let p6;
    	let t80;
    	let span57;
    	let span56;
    	let span40;
    	let math1;
    	let semantics1;
    	let mrow1;
    	let mi3;
    	let t82;
    	let mo2;
    	let t84;
    	let mo3;
    	let t86;
    	let mn3;
    	let t88;
    	let mo4;
    	let t90;
    	let mn4;
    	let t92;
    	let mo5;
    	let t94;
    	let annotation1;
    	let t96;
    	let span55;
    	let span46;
    	let span41;
    	let t97;
    	let span42;
    	let t99;
    	let span43;
    	let t100;
    	let span44;
    	let t102;
    	let span45;
    	let t103;
    	let span54;
    	let span47;
    	let t104;
    	let span48;
    	let t106;
    	let span49;
    	let t108;
    	let span50;
    	let t110;
    	let span51;
    	let t111;
    	let span52;
    	let t113;
    	let span53;
    	let t115;
    	let div8;
    	let p7;
    	let t117;
    	let current;
    	const knn = new Knn({ $$inline: true });

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			ul = element("ul");
    			li0 = element("li");
    			a0 = element("a");
    			a0.textContent = "Let’s get started!";
    			t1 = space();
    			li1 = element("li");
    			a1 = element("a");
    			a1.textContent = "1. Building Blocks: Neurons";
    			t3 = space();
    			li2 = element("li");
    			a2 = element("a");
    			a2.textContent = "1.1 A Simple Example";
    			t5 = space();
    			li3 = element("li");
    			a3 = element("a");
    			a3.textContent = "1.2 Coding a Neuron";
    			t7 = space();
    			li4 = element("li");
    			a4 = element("a");
    			a4.textContent = "2. Combining Neurons into a Neural Network";
    			t9 = space();
    			li5 = element("li");
    			a5 = element("a");
    			a5.textContent = "2.1 An Example:Feedforward";
    			t11 = space();
    			div9 = element("div");
    			div1 = element("div");
    			t12 = space();
    			div3 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Machine Learning for Beginners: An Introduction to Neural Networks";
    			t14 = space();
    			h20 = element("h2");
    			h20.textContent = "A simple explanation of how they work and how to implement one from\r\n      scratch in Python.";
    			t16 = space();
    			div2 = element("div");
    			t17 = space();
    			p0 = element("p");
    			t18 = text("Here’s something that might surprise you:\r\n      ");
    			strong0 = element("strong");
    			strong0.textContent = "neural networks aren’t that complicated!";
    			t20 = text("\r\n      The term “neural network” gets used as a buzzword a lot, but in reality\r\n      they’re often much simpler than people imagine.");
    			t21 = space();
    			p1 = element("p");
    			strong1 = element("strong");
    			strong1.textContent = "This post is intended for complete beginners and assumes ZERO prior\r\n        knowledge of machine learning";
    			t23 = text("\r\n      . We’ll understand how neural networks work while implementing one from\r\n      scratch in Python.");
    			t24 = space();
    			p2 = element("p");
    			p2.textContent = "Let’s get started!";
    			t26 = space();
    			div4 = element("div");
    			h21 = element("h2");
    			h21.textContent = "1. Building Blocks: Neurons";
    			t28 = space();
    			div5 = element("div");
    			p3 = element("p");
    			t29 = text("First, we have to talk about neurons, the basic unit of a neural network.\r\n      ");
    			strong2 = element("strong");
    			strong2.textContent = "A neuron takes inputs, does some math with them, and produces one output";
    			t31 = text("\r\n      . Here’s what a 2-input neuron looks like:");
    			t32 = space();
    			p4 = element("p");
    			p4.textContent = "photo。。。emmm....可以交互吗";
    			t34 = space();
    			p5 = element("p");
    			t35 = text("3 things are happening here. First, each input is multiplied by a weight:\r\n      ");
    			span0 = element("span");
    			t36 = space();
    			span39 = element("span");
    			span38 = element("span");
    			span1 = element("span");
    			math0 = element("math");
    			semantics0 = element("semantics");
    			mrow0 = element("mrow");
    			msub0 = element("msub");
    			mi0 = element("mi");
    			mi0.textContent = "x";
    			t38 = space();
    			mn0 = element("mn");
    			mn0.textContent = "1";
    			t40 = space();
    			mo0 = element("mo");
    			mo0.textContent = "→";
    			t42 = space();
    			msub1 = element("msub");
    			mi1 = element("mi");
    			mi1.textContent = "x";
    			t44 = space();
    			mn1 = element("mn");
    			mn1.textContent = "1";
    			t46 = space();
    			mo1 = element("mo");
    			mo1.textContent = "∗";
    			t48 = space();
    			msub2 = element("msub");
    			mi2 = element("mi");
    			mi2.textContent = "w";
    			t50 = space();
    			mn2 = element("mn");
    			mn2.textContent = "1";
    			t52 = space();
    			annotation0 = element("annotation");
    			annotation0.textContent = "x_1 \\rightarrow x_1 * w_1";
    			t54 = space();
    			span37 = element("span");
    			span20 = element("span");
    			span2 = element("span");
    			t55 = space();
    			span16 = element("span");
    			span3 = element("span");
    			span3.textContent = "x";
    			t57 = space();
    			span15 = element("span");
    			span14 = element("span");
    			span10 = element("span");
    			span8 = element("span");
    			span7 = element("span");
    			span4 = element("span");
    			t58 = space();
    			span6 = element("span");
    			span5 = element("span");
    			span5.textContent = "1";
    			t60 = space();
    			span9 = element("span");
    			span9.textContent = "​";
    			t62 = space();
    			span13 = element("span");
    			span12 = element("span");
    			span11 = element("span");
    			t63 = space();
    			span17 = element("span");
    			t64 = space();
    			span18 = element("span");
    			span18.textContent = "→";
    			t66 = space();
    			span19 = element("span");
    			t67 = space();
    			span36 = element("span");
    			span21 = element("span");
    			t68 = space();
    			span35 = element("span");
    			span22 = element("span");
    			span22.textContent = "x";
    			t70 = space();
    			span34 = element("span");
    			span33 = element("span");
    			span29 = element("span");
    			span27 = element("span");
    			span26 = element("span");
    			span23 = element("span");
    			t71 = space();
    			span25 = element("span");
    			span24 = element("span");
    			span24.textContent = "1";
    			t73 = space();
    			span28 = element("span");
    			span28.textContent = "​";
    			t75 = space();
    			span32 = element("span");
    			span31 = element("span");
    			span30 = element("span");
    			t76 = space();
    			div6 = element("div");
    			h3 = element("h3");
    			h3.textContent = "1.1 A Simple Example";
    			t78 = space();
    			div7 = element("div");
    			p6 = element("p");
    			p6.textContent = "Assume we have a 2-input neuron that uses the sigmoid activation function\r\n      and has the following parameters:";
    			t80 = space();
    			span57 = element("span");
    			span56 = element("span");
    			span40 = element("span");
    			math1 = element("math");
    			semantics1 = element("semantics");
    			mrow1 = element("mrow");
    			mi3 = element("mi");
    			mi3.textContent = "w";
    			t82 = space();
    			mo2 = element("mo");
    			mo2.textContent = "=";
    			t84 = space();
    			mo3 = element("mo");
    			mo3.textContent = "[";
    			t86 = space();
    			mn3 = element("mn");
    			mn3.textContent = "0";
    			t88 = space();
    			mo4 = element("mo");
    			mo4.textContent = ",";
    			t90 = space();
    			mn4 = element("mn");
    			mn4.textContent = "1";
    			t92 = space();
    			mo5 = element("mo");
    			mo5.textContent = "]";
    			t94 = space();
    			annotation1 = element("annotation");
    			annotation1.textContent = "w = [0, 1]";
    			t96 = space();
    			span55 = element("span");
    			span46 = element("span");
    			span41 = element("span");
    			t97 = space();
    			span42 = element("span");
    			span42.textContent = "w";
    			t99 = space();
    			span43 = element("span");
    			t100 = space();
    			span44 = element("span");
    			span44.textContent = "=";
    			t102 = space();
    			span45 = element("span");
    			t103 = space();
    			span54 = element("span");
    			span47 = element("span");
    			t104 = space();
    			span48 = element("span");
    			span48.textContent = "[";
    			t106 = space();
    			span49 = element("span");
    			span49.textContent = "0";
    			t108 = space();
    			span50 = element("span");
    			span50.textContent = ",";
    			t110 = space();
    			span51 = element("span");
    			t111 = space();
    			span52 = element("span");
    			span52.textContent = "1";
    			t113 = space();
    			span53 = element("span");
    			span53.textContent = "]";
    			t115 = space();
    			div8 = element("div");
    			p7 = element("p");
    			p7.textContent = "测试测试111";
    			t117 = space();
    			create_component(knn.$$.fragment);
    			attr_dev(a0, "href", "#Zero");
    			attr_dev(a0, "class", "svelte-1i2h269");
    			add_location(a0, file$1, 103, 6, 2102);
    			add_location(li0, file$1, 102, 4, 2090);
    			attr_dev(a1, "href", "#One");
    			attr_dev(a1, "class", "svelte-1i2h269");
    			add_location(a1, file$1, 106, 6, 2169);
    			add_location(li1, file$1, 105, 4, 2157);
    			attr_dev(a2, "href", "#One1");
    			attr_dev(a2, "class", "svelte-1i2h269");
    			add_location(a2, file$1, 109, 6, 2244);
    			add_location(li2, file$1, 108, 4, 2232);
    			attr_dev(a3, "href", "#One2");
    			attr_dev(a3, "class", "svelte-1i2h269");
    			add_location(a3, file$1, 112, 4, 2311);
    			add_location(li3, file$1, 111, 4, 2301);
    			attr_dev(a4, "href", "#Two");
    			attr_dev(a4, "class", "svelte-1i2h269");
    			add_location(a4, file$1, 115, 4, 2377);
    			add_location(li4, file$1, 114, 4, 2367);
    			attr_dev(a5, "href", "Two1");
    			attr_dev(a5, "class", "svelte-1i2h269");
    			add_location(a5, file$1, 118, 4, 2465);
    			add_location(li5, file$1, 117, 4, 2455);
    			attr_dev(ul, "class", "svelte-1i2h269");
    			add_location(ul, file$1, 101, 2, 2080);
    			attr_dev(div0, "class", "left_tree svelte-1i2h269");
    			add_location(div0, file$1, 100, 0, 2053);
    			attr_dev(div1, "class", "name_md extra svelte-1i2h269");
    			attr_dev(div1, "id", "Zero");
    			add_location(div1, file$1, 124, 2, 2573);
    			attr_dev(h1, "class", "Content-module--content__title--2nRHa  svelte-1i2h269");
    			add_location(h1, file$1, 126, 4, 2631);
    			attr_dev(h20, "class", "Content-module--content__subtitle--34jJU svelte-1i2h269");
    			add_location(h20, file$1, 129, 4, 2773);
    			attr_dev(div2, "class", "Content-module--content__spacer--2kN9Y svelte-1i2h269");
    			add_location(div2, file$1, 133, 4, 2944);
    			add_location(strong0, file$1, 136, 6, 3064);
    			add_location(p0, file$1, 134, 4, 3004);
    			add_location(strong1, file$1, 141, 6, 3282);
    			add_location(p1, file$1, 140, 4, 3271);
    			add_location(p2, file$1, 148, 4, 3544);
    			add_location(div3, file$1, 125, 2, 2620);
    			attr_dev(h21, "class", "svelte-1i2h269");
    			add_location(h21, file$1, 151, 38, 3621);
    			attr_dev(div4, "class", "name_md extra svelte-1i2h269");
    			attr_dev(div4, "id", "One");
    			add_location(div4, file$1, 151, 2, 3585);
    			add_location(strong2, file$1, 155, 6, 3770);
    			add_location(p3, file$1, 153, 4, 3678);
    			add_location(p4, file$1, 160, 4, 3943);
    			attr_dev(span0, "class", "inline-square svelte-1i2h269");
    			set_style(span0, "background-color", "rgb(200, 0, 0)");
    			add_location(span0, file$1, 163, 6, 4069);
    			add_location(p5, file$1, 161, 4, 3977);
    			add_location(mi0, file$1, 172, 18, 4357);
    			add_location(mn0, file$1, 173, 18, 4387);
    			add_location(msub0, file$1, 171, 16, 4331);
    			add_location(mo0, file$1, 175, 16, 4440);
    			add_location(mi1, file$1, 177, 18, 4494);
    			add_location(mn1, file$1, 178, 18, 4524);
    			add_location(msub1, file$1, 176, 16, 4468);
    			add_location(mo1, file$1, 180, 16, 4577);
    			add_location(mi2, file$1, 182, 18, 4631);
    			add_location(mn2, file$1, 183, 18, 4661);
    			add_location(msub2, file$1, 181, 16, 4605);
    			add_location(mrow0, file$1, 170, 14, 4307);
    			attr_dev(annotation0, "encoding", "application/x-tex");
    			add_location(annotation0, file$1, 186, 14, 4735);
    			add_location(semantics0, file$1, 169, 12, 4280);
    			add_location(math0, file$1, 168, 10, 4260);
    			attr_dev(span1, "class", "katex-mathml svelte-1i2h269");
    			add_location(span1, file$1, 167, 8, 4221);
    			attr_dev(span2, "class", "strut svelte-1i2h269");
    			set_style(span2, "height", "0.58056em");
    			set_style(span2, "vertical-align", "-0.15em");
    			add_location(span2, file$1, 194, 12, 5009);
    			attr_dev(span3, "class", "mord mathdefault");
    			add_location(span3, file$1, 198, 14, 5158);
    			attr_dev(span4, "class", "pstrut");
    			set_style(span4, "height", "2.7em");
    			add_location(span4, file$1, 205, 24, 5556);
    			attr_dev(span5, "class", "mord mtight");
    			add_location(span5, file$1, 207, 26, 5700);
    			attr_dev(span6, "class", "sizing reset-size6 size3 mtight");
    			add_location(span6, file$1, 206, 24, 5626);
    			set_style(span7, "top", "-2.5500000000000003em");
    			set_style(span7, "margin-left", "0em");
    			set_style(span7, "margin-right", "0.05em");
    			add_location(span7, file$1, 203, 22, 5429);
    			attr_dev(span8, "class", "vlist");
    			set_style(span8, "height", "0.30110799999999993em");
    			add_location(span8, file$1, 202, 20, 5348);
    			attr_dev(span9, "class", "vlist-s");
    			add_location(span9, file$1, 211, 20, 5849);
    			attr_dev(span10, "class", "vlist-r");
    			add_location(span10, file$1, 201, 18, 5304);
    			add_location(span11, file$1, 215, 22, 6036);
    			attr_dev(span12, "class", "vlist");
    			set_style(span12, "height", "0.15em");
    			add_location(span12, file$1, 214, 20, 5970);
    			attr_dev(span13, "class", "vlist-r");
    			add_location(span13, file$1, 213, 18, 5926);
    			attr_dev(span14, "class", "vlist-t vlist-t2");
    			add_location(span14, file$1, 200, 16, 5253);
    			attr_dev(span15, "class", "msupsub");
    			add_location(span15, file$1, 199, 14, 5213);
    			attr_dev(span16, "class", "mord");
    			add_location(span16, file$1, 197, 12, 5123);
    			attr_dev(span17, "class", "mspace svelte-1i2h269");
    			set_style(span17, "margin-right", "0.2777777777777778em");
    			add_location(span17, file$1, 221, 12, 6183);
    			attr_dev(span18, "class", "mrel");
    			add_location(span18, file$1, 222, 12, 6262);
    			attr_dev(span19, "class", "mspace svelte-1i2h269");
    			set_style(span19, "margin-right", "0.2777777777777778em");
    			add_location(span19, file$1, 223, 12, 6303);
    			attr_dev(span20, "class", "base svelte-1i2h269");
    			add_location(span20, file$1, 193, 10, 4976);
    			attr_dev(span21, "class", "strut svelte-1i2h269");
    			set_style(span21, "height", "0.61528em");
    			set_style(span21, "vertical-align", "-0.15em");
    			add_location(span21, file$1, 226, 12, 6432);
    			attr_dev(span22, "class", "mord mathdefault");
    			add_location(span22, file$1, 230, 14, 6581);
    			attr_dev(span23, "class", "pstrut");
    			set_style(span23, "height", "2.7em");
    			add_location(span23, file$1, 237, 24, 6979);
    			attr_dev(span24, "class", "mord mtight");
    			add_location(span24, file$1, 239, 26, 7123);
    			attr_dev(span25, "class", "sizing reset-size6 size3 mtight");
    			add_location(span25, file$1, 238, 24, 7049);
    			set_style(span26, "top", "-2.5500000000000003em");
    			set_style(span26, "margin-left", "0em");
    			set_style(span26, "margin-right", "0.05em");
    			add_location(span26, file$1, 235, 22, 6852);
    			attr_dev(span27, "class", "vlist");
    			set_style(span27, "height", "0.30110799999999993em");
    			add_location(span27, file$1, 234, 20, 6771);
    			attr_dev(span28, "class", "vlist-s");
    			add_location(span28, file$1, 243, 20, 7272);
    			attr_dev(span29, "class", "vlist-r");
    			add_location(span29, file$1, 233, 18, 6727);
    			add_location(span30, file$1, 247, 22, 7459);
    			attr_dev(span31, "class", "vlist");
    			set_style(span31, "height", "0.15em");
    			add_location(span31, file$1, 246, 20, 7393);
    			attr_dev(span32, "class", "vlist-r");
    			add_location(span32, file$1, 245, 18, 7349);
    			attr_dev(span33, "class", "vlist-t vlist-t2");
    			add_location(span33, file$1, 232, 16, 6676);
    			attr_dev(span34, "class", "msupsub");
    			add_location(span34, file$1, 231, 14, 6636);
    			attr_dev(span35, "class", "mord");
    			add_location(span35, file$1, 229, 12, 6546);
    			attr_dev(span36, "class", "base svelte-1i2h269");
    			add_location(span36, file$1, 225, 10, 6399);
    			attr_dev(span37, "class", "katex-html svelte-1i2h269");
    			attr_dev(span37, "aria-hidden", "true");
    			add_location(span37, file$1, 192, 8, 4920);
    			attr_dev(span38, "class", "katex svelte-1i2h269");
    			add_location(span38, file$1, 166, 6, 4191);
    			attr_dev(span39, "class", "katex-display svelte-1i2h269");
    			add_location(span39, file$1, 165, 4, 4155);
    			add_location(div5, file$1, 152, 2, 3667);
    			attr_dev(h3, "class", "svelte-1i2h269");
    			add_location(h3, file$1, 259, 39, 7709);
    			attr_dev(div6, "class", "name_md extra svelte-1i2h269");
    			attr_dev(div6, "id", "One1");
    			add_location(div6, file$1, 259, 2, 7672);
    			add_location(p6, file$1, 261, 4, 7759);
    			add_location(mi3, file$1, 271, 16, 8076);
    			add_location(mo2, file$1, 272, 16, 8104);
    			attr_dev(mo3, "stretchy", "false");
    			add_location(mo3, file$1, 273, 16, 8132);
    			add_location(mn3, file$1, 274, 16, 8177);
    			attr_dev(mo4, "separator", "true");
    			add_location(mo4, file$1, 275, 16, 8205);
    			add_location(mn4, file$1, 276, 16, 8250);
    			attr_dev(mo5, "stretchy", "false");
    			add_location(mo5, file$1, 277, 16, 8278);
    			add_location(mrow1, file$1, 270, 14, 8052);
    			attr_dev(annotation1, "encoding", "application/x-tex");
    			add_location(annotation1, file$1, 279, 14, 8344);
    			add_location(semantics1, file$1, 269, 12, 8025);
    			add_location(math1, file$1, 268, 10, 8005);
    			attr_dev(span40, "class", "katex-mathml svelte-1i2h269");
    			add_location(span40, file$1, 267, 8, 7966);
    			attr_dev(span41, "class", "strut svelte-1i2h269");
    			set_style(span41, "height", "0.43056em");
    			set_style(span41, "vertical-align", "0em");
    			add_location(span41, file$1, 285, 12, 8569);
    			attr_dev(span42, "class", "mord mathdefault");
    			set_style(span42, "margin-right", "0.02691em");
    			add_location(span42, file$1, 286, 12, 8649);
    			attr_dev(span43, "class", "mspace svelte-1i2h269");
    			set_style(span43, "margin-right", "0.2777777777777778em");
    			add_location(span43, file$1, 289, 12, 8763);
    			attr_dev(span44, "class", "mrel");
    			add_location(span44, file$1, 290, 12, 8842);
    			attr_dev(span45, "class", "mspace svelte-1i2h269");
    			set_style(span45, "margin-right", "0.2777777777777778em");
    			add_location(span45, file$1, 291, 12, 8883);
    			attr_dev(span46, "class", "base svelte-1i2h269");
    			add_location(span46, file$1, 284, 10, 8536);
    			attr_dev(span47, "class", "strut svelte-1i2h269");
    			set_style(span47, "height", "1em");
    			set_style(span47, "vertical-align", "-0.25em");
    			add_location(span47, file$1, 294, 12, 9012);
    			attr_dev(span48, "class", "mopen");
    			add_location(span48, file$1, 295, 12, 9090);
    			attr_dev(span49, "class", "mord");
    			add_location(span49, file$1, 296, 12, 9132);
    			attr_dev(span50, "class", "mpunct");
    			add_location(span50, file$1, 297, 12, 9173);
    			attr_dev(span51, "class", "mspace svelte-1i2h269");
    			set_style(span51, "margin-right", "0.16666666666666666em");
    			add_location(span51, file$1, 298, 12, 9216);
    			attr_dev(span52, "class", "mord");
    			add_location(span52, file$1, 299, 12, 9296);
    			attr_dev(span53, "class", "mclose");
    			add_location(span53, file$1, 300, 12, 9337);
    			attr_dev(span54, "class", "base svelte-1i2h269");
    			add_location(span54, file$1, 293, 10, 8979);
    			attr_dev(span55, "class", "katex-html svelte-1i2h269");
    			attr_dev(span55, "aria-hidden", "true");
    			add_location(span55, file$1, 283, 8, 8480);
    			attr_dev(span56, "class", "katex svelte-1i2h269");
    			add_location(span56, file$1, 266, 6, 7936);
    			attr_dev(span57, "class", "katex-display svelte-1i2h269");
    			add_location(span57, file$1, 265, 4, 7900);
    			add_location(div7, file$1, 260, 2, 7748);
    			add_location(p7, file$1, 308, 4, 9468);
    			attr_dev(div8, "id", "knnss");
    			add_location(div8, file$1, 307, 2, 9446);
    			attr_dev(div9, "class", "right_content svelte-1i2h269");
    			add_location(div9, file$1, 123, 0, 2542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a0);
    			append_dev(ul, t1);
    			append_dev(ul, li1);
    			append_dev(li1, a1);
    			append_dev(ul, t3);
    			append_dev(ul, li2);
    			append_dev(li2, a2);
    			append_dev(ul, t5);
    			append_dev(ul, li3);
    			append_dev(li3, a3);
    			append_dev(ul, t7);
    			append_dev(ul, li4);
    			append_dev(li4, a4);
    			append_dev(ul, t9);
    			append_dev(ul, li5);
    			append_dev(li5, a5);
    			insert_dev(target, t11, anchor);
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div1);
    			append_dev(div9, t12);
    			append_dev(div9, div3);
    			append_dev(div3, h1);
    			append_dev(div3, t14);
    			append_dev(div3, h20);
    			append_dev(div3, t16);
    			append_dev(div3, div2);
    			append_dev(div3, t17);
    			append_dev(div3, p0);
    			append_dev(p0, t18);
    			append_dev(p0, strong0);
    			append_dev(p0, t20);
    			append_dev(div3, t21);
    			append_dev(div3, p1);
    			append_dev(p1, strong1);
    			append_dev(p1, t23);
    			append_dev(div3, t24);
    			append_dev(div3, p2);
    			append_dev(div9, t26);
    			append_dev(div9, div4);
    			append_dev(div4, h21);
    			append_dev(div9, t28);
    			append_dev(div9, div5);
    			append_dev(div5, p3);
    			append_dev(p3, t29);
    			append_dev(p3, strong2);
    			append_dev(p3, t31);
    			append_dev(div5, t32);
    			append_dev(div5, p4);
    			append_dev(div5, t34);
    			append_dev(div5, p5);
    			append_dev(p5, t35);
    			append_dev(p5, span0);
    			append_dev(div5, t36);
    			append_dev(div5, span39);
    			append_dev(span39, span38);
    			append_dev(span38, span1);
    			append_dev(span1, math0);
    			append_dev(math0, semantics0);
    			append_dev(semantics0, mrow0);
    			append_dev(mrow0, msub0);
    			append_dev(msub0, mi0);
    			append_dev(msub0, t38);
    			append_dev(msub0, mn0);
    			append_dev(mrow0, t40);
    			append_dev(mrow0, mo0);
    			append_dev(mrow0, t42);
    			append_dev(mrow0, msub1);
    			append_dev(msub1, mi1);
    			append_dev(msub1, t44);
    			append_dev(msub1, mn1);
    			append_dev(mrow0, t46);
    			append_dev(mrow0, mo1);
    			append_dev(mrow0, t48);
    			append_dev(mrow0, msub2);
    			append_dev(msub2, mi2);
    			append_dev(msub2, t50);
    			append_dev(msub2, mn2);
    			append_dev(semantics0, t52);
    			append_dev(semantics0, annotation0);
    			append_dev(span38, t54);
    			append_dev(span38, span37);
    			append_dev(span37, span20);
    			append_dev(span20, span2);
    			append_dev(span20, t55);
    			append_dev(span20, span16);
    			append_dev(span16, span3);
    			append_dev(span16, t57);
    			append_dev(span16, span15);
    			append_dev(span15, span14);
    			append_dev(span14, span10);
    			append_dev(span10, span8);
    			append_dev(span8, span7);
    			append_dev(span7, span4);
    			append_dev(span7, t58);
    			append_dev(span7, span6);
    			append_dev(span6, span5);
    			append_dev(span10, t60);
    			append_dev(span10, span9);
    			append_dev(span14, t62);
    			append_dev(span14, span13);
    			append_dev(span13, span12);
    			append_dev(span12, span11);
    			append_dev(span20, t63);
    			append_dev(span20, span17);
    			append_dev(span20, t64);
    			append_dev(span20, span18);
    			append_dev(span20, t66);
    			append_dev(span20, span19);
    			append_dev(span37, t67);
    			append_dev(span37, span36);
    			append_dev(span36, span21);
    			append_dev(span36, t68);
    			append_dev(span36, span35);
    			append_dev(span35, span22);
    			append_dev(span35, t70);
    			append_dev(span35, span34);
    			append_dev(span34, span33);
    			append_dev(span33, span29);
    			append_dev(span29, span27);
    			append_dev(span27, span26);
    			append_dev(span26, span23);
    			append_dev(span26, t71);
    			append_dev(span26, span25);
    			append_dev(span25, span24);
    			append_dev(span29, t73);
    			append_dev(span29, span28);
    			append_dev(span33, t75);
    			append_dev(span33, span32);
    			append_dev(span32, span31);
    			append_dev(span31, span30);
    			append_dev(div9, t76);
    			append_dev(div9, div6);
    			append_dev(div6, h3);
    			append_dev(div9, t78);
    			append_dev(div9, div7);
    			append_dev(div7, p6);
    			append_dev(div7, t80);
    			append_dev(div7, span57);
    			append_dev(span57, span56);
    			append_dev(span56, span40);
    			append_dev(span40, math1);
    			append_dev(math1, semantics1);
    			append_dev(semantics1, mrow1);
    			append_dev(mrow1, mi3);
    			append_dev(mrow1, t82);
    			append_dev(mrow1, mo2);
    			append_dev(mrow1, t84);
    			append_dev(mrow1, mo3);
    			append_dev(mrow1, t86);
    			append_dev(mrow1, mn3);
    			append_dev(mrow1, t88);
    			append_dev(mrow1, mo4);
    			append_dev(mrow1, t90);
    			append_dev(mrow1, mn4);
    			append_dev(mrow1, t92);
    			append_dev(mrow1, mo5);
    			append_dev(semantics1, t94);
    			append_dev(semantics1, annotation1);
    			append_dev(span56, t96);
    			append_dev(span56, span55);
    			append_dev(span55, span46);
    			append_dev(span46, span41);
    			append_dev(span46, t97);
    			append_dev(span46, span42);
    			append_dev(span46, t99);
    			append_dev(span46, span43);
    			append_dev(span46, t100);
    			append_dev(span46, span44);
    			append_dev(span46, t102);
    			append_dev(span46, span45);
    			append_dev(span55, t103);
    			append_dev(span55, span54);
    			append_dev(span54, span47);
    			append_dev(span54, t104);
    			append_dev(span54, span48);
    			append_dev(span54, t106);
    			append_dev(span54, span49);
    			append_dev(span54, t108);
    			append_dev(span54, span50);
    			append_dev(span54, t110);
    			append_dev(span54, span51);
    			append_dev(span54, t111);
    			append_dev(span54, span52);
    			append_dev(span54, t113);
    			append_dev(span54, span53);
    			append_dev(div9, t115);
    			append_dev(div9, div8);
    			append_dev(div8, p7);
    			append_dev(div8, t117);
    			mount_component(knn, div8, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(knn.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(knn.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t11);
    			if (detaching) detach_dev(div9);
    			destroy_component(knn);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Home", $$slots, []);
    	$$self.$capture_state = () => ({ Knn });
    	return [];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    const cnnStore = writable([]);
    const svgStore = writable(undefined);

    const vSpaceAroundGapStore = writable(undefined);
    const hSpaceAroundGapStore = writable(undefined);

    const nodeCoordinateStore = writable([]);
    const selectedScaleLevelStore = writable(undefined);

    const cnnLayerRangesStore = writable({});
    const cnnLayerMinMaxStore = writable([]);

    const needRedrawStore = writable([undefined, undefined]);

    const detailedModeStore = writable(true);

    const shouldIntermediateAnimateStore = writable(false);

    const isInSoftmaxStore = writable(false);
    const softmaxDetailViewStore = writable({});
    const allowsSoftmaxAnimationStore = writable(false);

    const hoverInfoStore = writable({});

    const modalStore = writable({});

    const intermediateLayerPositionStore = writable({});

    // Enum of node types

    // Helper functions

    /**
     * Create a 2D array (matrix) with given size and default value.
     * 
     * @param {int} height Height (number of rows) for the matrix
     * @param {int} width Width (number of columns) for the matrix
     * @param {int} fill Default value to fill this matrix
     */
    const init2DArray = (height, width, fill) => {
      let array = [];
      // Itereate through rows
      for (let r = 0; r < height; r++) {
        let row = new Array(width).fill(fill);
        array.push(row);
      }
      return array;
    };

    /**
     * Dot product of two matrices.
     * @param {[[number]]} mat1 Matrix 1
     * @param {[[number]]} mat2 Matrix 2
     */
    const matrixDot = (mat1, mat2) => {
      console.assert(mat1.length === mat2.length, 'Dimension not matching');
      console.assert(mat1[0].length === mat2[0].length, 'Dimension not matching');

      let result = 0;
      for (let i = 0; i < mat1.length; i++){
        for (let j = 0; j < mat1[0].length; j++){
          result += mat1[i][j] * mat2[i][j];
        }
      }
      
      return result;
    };

    /**
     * 2D slice on a matrix.
     * @param {[[number]]} mat Matrix
     * @param {int} xs First dimension (row) starting index
     * @param {int} xe First dimension (row) ending index
     * @param {int} ys Second dimension (column) starting index
     * @param {int} ye Second dimension (column) ending index
     */
    const matrixSlice = (mat, xs, xe, ys, ye) => {
      return mat.slice(xs, xe).map(s => s.slice(ys, ye));
    };

    /**
     * Compute the maximum of a matrix.
     * @param {[[number]]} mat Matrix
     */
    const matrixMax = (mat) => {
      let curMax = -Infinity;
      for (let i = 0; i < mat.length; i++) {
        for (let j = 0; j < mat[0].length; j++) {
          if (mat[i][j] > curMax) {
            curMax = mat[i][j];
          }
        }
      }
      return curMax;
    };

    /**
     * Compute convolutions of one kernel on one matrix (one slice of a tensor).
     * @param {[[number]]} input Input, square matrix
     * @param {[[number]]} kernel Kernel weights, square matrix
     * @param {int} stride Stride size
     * @param {int} padding Padding size
     */
    const singleConv = (input, kernel, stride=1, padding=0) => {
      // TODO: implement padding

      // Only support square input and kernel
      console.assert(input.length === input[0].length,
         'Conv input is not square');
      console.assert(kernel.length === kernel[0].length,
        'Conv kernel is not square');

      let stepSize = (input.length - kernel.length) / stride + 1;

      let result = init2DArray(stepSize, stepSize, 0);

      // Window sliding
      for (let r = 0; r < stepSize; r++) {
        for (let c = 0; c < stepSize; c++) {
          let curWindow = matrixSlice(input, r * stride, r * stride + kernel.length,
            c * stride, c * stride + kernel.length);
          let dot = matrixDot(curWindow, kernel);
          result[r][c] = dot;
        }
      }
      return result;
    };

    /**
     * Max pool one matrix.
     * @param {[[number]]} mat Matrix
     * @param {int} kernelWidth Pooling kernel length (only supports 2)
     * @param {int} stride Pooling sliding stride (only supports 2)
     * @param {string} padding Pading method when encountering odd number mat,
     * currently this function only supports 'VALID'
     */
    const singleMaxPooling = (mat, kernelWidth=2, stride=2, padding='VALID') => {
      console.assert(kernelWidth === 2, 'Only supports kernen = [2,2]');
      console.assert(stride === 2, 'Only supports stride = 2');
      console.assert(padding === 'VALID', 'Only support valid padding');

      // Handle odd length mat
      // 'VALID': ignore edge rows and columns
      // 'SAME': add zero padding to make the mat have even length
      if (mat.length % 2 === 1 && padding === 'VALID') {
        mat = matrixSlice(mat, 0, mat.length - 1, 0, mat.length - 1);
      }

      let stepSize = (mat.length - kernelWidth) / stride + 1;
      let result = init2DArray(stepSize, stepSize, 0);

      for (let r = 0; r < stepSize; r++) {
        for (let c = 0; c < stepSize; c++) {
          let curWindow = matrixSlice(mat, r * stride, r * stride + kernelWidth,
            c * stride, c * stride + kernelWidth);
          result[r][c] = matrixMax(curWindow);
        }
     }
     return result;
    };

    function array1d(length, f) {
      return Array.from({length: length}, f ? ((v, i) => f(i)) : undefined);
    }

    function array2d(height, width, f) {
      return Array.from({length: height}, (v, i) => Array.from({length: width}, f ? ((w, j) => f(i, j)) : undefined));
    }

    function generateOutputMappings(stride, output, kernelLength, padded_input_size, dilation) {
      const outputMapping = array2d(output.length, output.length, (i, j) => array2d(kernelLength, kernelLength));
      for (let h_out = 0; h_out < output.length; h_out++) {
        for (let w_out = 0; w_out < output.length; w_out++) {
          for (let h_kern = 0; h_kern < kernelLength; h_kern++) {
            for (let w_kern = 0; w_kern < kernelLength; w_kern++) {
              const h_im = h_out * stride + h_kern * dilation;
              const w_im = w_out * stride + w_kern * dilation;
              outputMapping[h_out][w_out][h_kern][w_kern] = h_im * padded_input_size + w_im;
            }
          }
        }
      }
      return outputMapping;
    }

    function compute_input_multiplies_with_weight(hoverH, hoverW, 
                                                  padded_input_size, weight_dims, outputMappings, kernelLength) {
      const input_multiplies_with_weight = array1d(padded_input_size * padded_input_size);
      for (let h_weight = 0; h_weight < kernelLength; h_weight++) {
        for (let w_weight = 0; w_weight < kernelLength; w_weight++) {
          const flat_input = outputMappings[hoverH][hoverW][h_weight][w_weight];
          if (typeof flat_input === "undefined") continue;
          input_multiplies_with_weight[flat_input] = [h_weight, w_weight];
        }
      }
      return input_multiplies_with_weight;
    }

    function getMatrixSliceFromInputHighlights(matrix, highlights, kernelLength) {
      var indices = highlights.reduce((total, value, index) => {
      if (value != undefined) total.push(index);
        return total;
      }, []);
      return matrixSlice(matrix, Math.floor(indices[0] / matrix.length), Math.floor(indices[0] / matrix.length) + kernelLength, indices[0] % matrix.length, indices[0] % matrix.length + kernelLength);
    }

    function getMatrixSliceFromOutputHighlights(matrix, highlights) {
      var indices = highlights.reduce((total, value, index) => {
      if (value != false) total.push(index);
        return total;
      }, []);
      return matrixSlice(matrix, Math.floor(indices[0] / matrix.length), Math.floor(indices[0] / matrix.length) + 1, indices[0] % matrix.length, indices[0] % matrix.length + 1);
    }

    // Edit these values to change size of low-level conv visualization.
    function getVisualizationSizeConstraint(imageLength) {
      let sizeOfGrid = 150;
      let maxSizeOfGridCell = 20;
      return sizeOfGrid / imageLength > maxSizeOfGridCell ? maxSizeOfGridCell : sizeOfGrid / imageLength;
    }

    function getDataRange(image) {
      let maxRow = image.map(function(row){ return Math.max.apply(Math, row); });
      let max = Math.max.apply(null, maxRow);
      let minRow = image.map(function(row){ return Math.min.apply(Math, row); });
      let min = Math.min.apply(null, minRow);
      let range = {
        range: 2 * Math.max(Math.abs(min), Math.abs(max)),
        min: min,
        max: max
      };
      return range;
    }

    function gridData(image, constraint=getVisualizationSizeConstraint(image.length)) {
      // Constrain grids based on input image size.
      var data = new Array();
      var xpos = 1;
      var ypos = 1;
      var width = constraint;
      var height = constraint;
      for (var row = 0; row < image.length; row++) {
        data.push( new Array() );
        for (var column = 0; column < image[0].length; column++) {
          data[row].push({
            text: Math.round(image[row][column] * 100) / 100,
            row: row,
            col: column,
            x: xpos,
            y: ypos,
            width: width,
            height: height
          });
          xpos += width;
        }
        xpos = 1;
        ypos += height; 
      }
      return data;
    }

    /* src\detail-view\Dataview.svelte generated by Svelte v3.23.1 */
    const file$2 = "src\\detail-view\\Dataview.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let svg;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			attr_dev(svg, "id", "grid");
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			add_location(svg, file$2, 118, 2, 3947);
    			set_style(div, "display", "inline-block");
    			set_style(div, "vertical-align", "middle");
    			attr_dev(div, "class", "grid");
    			add_location(div, file$2, 116, 0, 3844);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			/*div_binding*/ ctx[10](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const textConstraintDivisor = 2.6;
    const standardCellColor = "ddd";

    function instance$3($$self, $$props, $$invalidate) {
    	let { data } = $$props;
    	let { highlights } = $$props;
    	let { isKernelMath } = $$props;
    	let { constraint } = $$props;
    	let { dataRange } = $$props;
    	let { outputLength = undefined } = $$props;
    	let { stride = undefined } = $$props;
    	let { colorScale = d3.interpolateRdBu } = $$props;
    	let { isInputLayer = false } = $$props;
    	let grid_final;
    	const dispatch = createEventDispatcher();
    	let oldHighlight = highlights;
    	let oldData = data;

    	const redraw = () => {
    		d3.select(grid_final).selectAll("#grid > *").remove();
    		const constrainedSvgSize = data.length * constraint + 2;
    		var grid = d3.select(grid_final).select("#grid").attr("width", constrainedSvgSize + "px").attr("height", constrainedSvgSize + "px").append("svg").attr("width", constrainedSvgSize + "px").attr("height", constrainedSvgSize + "px");
    		var row = grid.selectAll(".row").data(data).enter().append("g").attr("class", "row");

    		var column = row.selectAll(".square").data(function (d) {
    			return d;
    		}).enter().append("rect").attr("class", "square").attr("x", function (d) {
    			return d.x;
    		}).attr("y", function (d) {
    			return d.y;
    		}).attr("width", function (d) {
    			return d.width;
    		}).attr("height", function (d) {
    			return d.height;
    		}).style("opacity", 0.8).style("fill", function (d) {
    			let normalizedValue = d.text;

    			if (isInputLayer) {
    				normalizedValue = 1 - d.text;
    			} else {
    				normalizedValue = (d.text + dataRange / 2) / dataRange;
    			}

    			return colorScale(normalizedValue);
    		}).on("mouseover", function (d) {
    			if (data.length != outputLength) {
    				dispatch("message", {
    					hoverH: Math.min(Math.floor(d.row / stride), outputLength - 1),
    					hoverW: Math.min(Math.floor(d.col / stride), outputLength - 1)
    				});
    			} else {
    				dispatch("message", {
    					hoverH: Math.min(Math.floor(d.row / 1), outputLength - 1),
    					hoverW: Math.min(Math.floor(d.col / 1), outputLength - 1)
    				});
    			}
    		});

    		if (isKernelMath) {
    			var text = row.selectAll(".text").data(function (d) {
    				return d;
    			}).enter().append("text").attr("class", "text").style("font-size", Math.floor(constraint / textConstraintDivisor) + "px").attr("x", function (d) {
    				return d.x + d.width / 2;
    			}).attr("y", function (d) {
    				return d.y + d.height / 2;
    			}).style("fill", function (d) {
    				let normalizedValue = d.text;

    				if (isInputLayer) {
    					normalizedValue = 1 - d.text;
    				} else {
    					normalizedValue = (d.text + dataRange / 2) / dataRange;
    				}

    				if (normalizedValue < 0.2 || normalizedValue > 0.8) {
    					return "white";
    				} else {
    					return "black";
    				}
    			}).style("text-anchor", "middle").style("dominant-baseline", "middle").text(function (d) {
    				return d.text;
    			});
    		}
    	};

    	afterUpdate(() => {
    		if (data != oldData) {
    			redraw();
    			oldData = data;
    		}

    		if (highlights != oldHighlight) {
    			var grid = d3.select(grid_final).select("#grid").select("svg");

    			grid.selectAll(".square").style("stroke", d => isKernelMath || highlights.length && highlights[d.row * data.length + d.col]
    			? "black"
    			: null);

    			oldHighlight = highlights;
    		}
    	});

    	onMount(() => {
    		redraw();
    	});

    	const writable_props = [
    		"data",
    		"highlights",
    		"isKernelMath",
    		"constraint",
    		"dataRange",
    		"outputLength",
    		"stride",
    		"colorScale",
    		"isInputLayer"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dataview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Dataview", $$slots, []);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			grid_final = $$value;
    			$$invalidate(0, grid_final);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("highlights" in $$props) $$invalidate(2, highlights = $$props.highlights);
    		if ("isKernelMath" in $$props) $$invalidate(3, isKernelMath = $$props.isKernelMath);
    		if ("constraint" in $$props) $$invalidate(4, constraint = $$props.constraint);
    		if ("dataRange" in $$props) $$invalidate(5, dataRange = $$props.dataRange);
    		if ("outputLength" in $$props) $$invalidate(6, outputLength = $$props.outputLength);
    		if ("stride" in $$props) $$invalidate(7, stride = $$props.stride);
    		if ("colorScale" in $$props) $$invalidate(8, colorScale = $$props.colorScale);
    		if ("isInputLayer" in $$props) $$invalidate(9, isInputLayer = $$props.isInputLayer);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		highlights,
    		isKernelMath,
    		constraint,
    		dataRange,
    		outputLength,
    		stride,
    		colorScale,
    		isInputLayer,
    		onMount,
    		onDestroy,
    		beforeUpdate,
    		afterUpdate,
    		createEventDispatcher,
    		grid_final,
    		textConstraintDivisor,
    		standardCellColor,
    		dispatch,
    		oldHighlight,
    		oldData,
    		redraw
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("highlights" in $$props) $$invalidate(2, highlights = $$props.highlights);
    		if ("isKernelMath" in $$props) $$invalidate(3, isKernelMath = $$props.isKernelMath);
    		if ("constraint" in $$props) $$invalidate(4, constraint = $$props.constraint);
    		if ("dataRange" in $$props) $$invalidate(5, dataRange = $$props.dataRange);
    		if ("outputLength" in $$props) $$invalidate(6, outputLength = $$props.outputLength);
    		if ("stride" in $$props) $$invalidate(7, stride = $$props.stride);
    		if ("colorScale" in $$props) $$invalidate(8, colorScale = $$props.colorScale);
    		if ("isInputLayer" in $$props) $$invalidate(9, isInputLayer = $$props.isInputLayer);
    		if ("grid_final" in $$props) $$invalidate(0, grid_final = $$props.grid_final);
    		if ("oldHighlight" in $$props) oldHighlight = $$props.oldHighlight;
    		if ("oldData" in $$props) oldData = $$props.oldData;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		grid_final,
    		data,
    		highlights,
    		isKernelMath,
    		constraint,
    		dataRange,
    		outputLength,
    		stride,
    		colorScale,
    		isInputLayer,
    		div_binding
    	];
    }

    class Dataview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {
    			data: 1,
    			highlights: 2,
    			isKernelMath: 3,
    			constraint: 4,
    			dataRange: 5,
    			outputLength: 6,
    			stride: 7,
    			colorScale: 8,
    			isInputLayer: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dataview",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[1] === undefined && !("data" in props)) {
    			console.warn("<Dataview> was created without expected prop 'data'");
    		}

    		if (/*highlights*/ ctx[2] === undefined && !("highlights" in props)) {
    			console.warn("<Dataview> was created without expected prop 'highlights'");
    		}

    		if (/*isKernelMath*/ ctx[3] === undefined && !("isKernelMath" in props)) {
    			console.warn("<Dataview> was created without expected prop 'isKernelMath'");
    		}

    		if (/*constraint*/ ctx[4] === undefined && !("constraint" in props)) {
    			console.warn("<Dataview> was created without expected prop 'constraint'");
    		}

    		if (/*dataRange*/ ctx[5] === undefined && !("dataRange" in props)) {
    			console.warn("<Dataview> was created without expected prop 'dataRange'");
    		}
    	}

    	get data() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlights() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlights(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isKernelMath() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isKernelMath(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get constraint() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set constraint(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outputLength() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outputLength(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stride() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stride(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorScale() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorScale(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInputLayer() {
    		throw new Error("<Dataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInputLayer(value) {
    		throw new Error("<Dataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\KernelMathView.svelte generated by Svelte v3.23.1 */
    const file$3 = "src\\detail-view\\KernelMathView.svelte";

    function create_fragment$4(ctx) {
    	let div0;
    	let t;
    	let div1;
    	let svg_1;

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t = space();
    			div1 = element("div");
    			svg_1 = svg_element("svg");
    			attr_dev(div0, "class", "legend");
    			add_location(div0, file$3, 282, 0, 10824);
    			attr_dev(svg_1, "id", "grid");
    			attr_dev(svg_1, "width", "100%");
    			attr_dev(svg_1, "height", "100%");
    			add_location(svg_1, file$3, 289, 2, 10989);
    			attr_dev(div1, "class", "grid");
    			add_location(div1, file$3, 287, 0, 10942);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			/*div0_binding*/ ctx[10](div0);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);
    			append_dev(div1, svg_1);
    			/*div1_binding*/ ctx[11](div1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			/*div0_binding*/ ctx[10](null);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			/*div1_binding*/ ctx[11](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const textConstraintDivisor$1 = 2.6;

    function instance$4($$self, $$props, $$invalidate) {
    	let { data } = $$props;
    	let { kernel } = $$props;
    	let { constraint } = $$props;
    	let { dataRange } = $$props;
    	let { kernelRange } = $$props;
    	let { colorScale = d3.interpolateRdBu } = $$props;
    	let { kernelColorScale = d3.interpolateBrBG } = $$props;
    	let { isInputLayer = false } = $$props;
    	let gridFinal;
    	let legendFinal;
    	const multiplicationSymbolPadding = Math.floor(constraint / 3);
    	let oldData = data;
    	let oldKernel = kernel;

    	// Legend drawn similarly to legends in overview/intermediate-view.
    	const addOverlayGradient = (gradientID, stops, group) => {
    		if (group === undefined) {
    			group = svg;
    		}

    		// Create a gradient
    		let defs = group.append("defs").attr("class", "overlay-gradient");

    		let gradient = defs.append("linearGradient").attr("id", gradientID).attr("x1", "0%").attr("x2", "100%").attr("y1", "100%").attr("y2", "100%");

    		stops.forEach(s => {
    			gradient.append("stop").attr("offset", s.offset).attr("stop-color", s.color).attr("stop-opacity", s.opacity);
    		});
    	};

    	// Draw the legend for intermediate layer
    	const redrawDetailedConvViewLegend = arg => {
    		let legendHeight = arg.legendHeight,
    			range = arg.range,
    			minMax = arg.minMax,
    			width = arg.width,
    			colorScale = arg.colorScale,
    			gradientGap = arg.gradientGap;

    		d3.select(legendFinal).selectAll("#legend > *").remove();
    		let legend = d3.select(legendFinal).select("#legend").attr("width", 150 + "px").attr("height", 25 + "px").attr("align", "center").style("dominant-baseline", "middle");
    		let detailedViewKernel = legend.append("g").attr("transform", `translate(10, 0)`);

    		if (colorScale === undefined) {
    			colorScale = layerColorScales.conv;
    		}

    		if (gradientGap === undefined) {
    			gradientGap = 0;
    		}

    		// Add a legend color gradient
    		let gradientName = `url(#detailed-kernel-gradient)`;

    		let normalizedColor = v => colorScale(v * (1 - 2 * gradientGap) + gradientGap);

    		let leftValue = (minMax.min + range / 2) / range,
    			zeroValue = (0 + range / 2) / range,
    			rightValue = (minMax.max + range / 2) / range,
    			totalRange = minMax.max - minMax.min,
    			zeroLocation = (0 - minMax.min) / totalRange,
    			leftMidValue = leftValue + (zeroValue - leftValue) / 2,
    			rightMidValue = zeroValue + (rightValue - zeroValue) / 2;

    		let stops = [
    			{
    				offset: 0,
    				color: normalizedColor(leftValue),
    				opacity: 1
    			},
    			{
    				offset: zeroLocation / 2,
    				color: normalizedColor(leftMidValue),
    				opacity: 1
    			},
    			{
    				offset: zeroLocation,
    				color: normalizedColor(zeroValue),
    				opacity: 1
    			},
    			{
    				offset: zeroLocation + (1 - zeroValue) / 2,
    				color: normalizedColor(rightMidValue),
    				opacity: 1
    			},
    			{
    				offset: 1,
    				color: normalizedColor(rightValue),
    				opacity: 1
    			}
    		];

    		addOverlayGradient(`detailed-kernel-gradient`, stops, detailedViewKernel);
    		let legendScale = d3.scaleLinear().range([0, width - 1.2]).domain([minMax.min, minMax.max]);
    		let legendAxis = d3.axisBottom().scale(legendScale).tickFormat(d3.format(".2f")).tickValues([minMax.min, 0, minMax.max]);
    		let detailedLegend = detailedViewKernel.append("g").attr("id", `detailed-legend-0`);
    		let legendGroup = detailedLegend.append("g").attr("transform", `translate(0, ${legendHeight - 3})`).call(legendAxis);
    		legendGroup.selectAll("text").style("font-size", "9px").style("fill", "black");
    		legendGroup.selectAll("path, line").style("stroke", "black");
    		detailedLegend.append("rect").attr("width", width).attr("height", legendHeight).style("fill", gradientName);
    	};

    	// Draw the elementwise dot-product math.
    	const redraw = () => {
    		d3.select(gridFinal).selectAll("#grid > *").remove();

    		const constrainedSvgSize = kernel
    		? 2 * (data.length * constraint) + 2
    		: data.length * constraint + 2;

    		var grid = d3.select(gridFinal).select("#grid").attr("width", constrainedSvgSize + "px").attr("height", constrainedSvgSize + "px").append("svg").attr("width", constrainedSvgSize + "px").attr("height", constrainedSvgSize + "px");
    		var row = grid.selectAll(".row").data(data).enter().append("g").attr("class", "row");

    		var columns = row.selectAll(".square").data(function (d) {
    			return d;
    		}).enter();

    		// Draw cells for slice from input matrix.
    		columns.append("rect").attr("class", "square").attr("x", function (d) {
    			return d.x === 1
    			? d.x + multiplicationSymbolPadding
    			: d.x * 2 + multiplicationSymbolPadding;
    		}).attr("y", function (d) {
    			return d.y === 1 ? d.y : d.y * 2;
    		}).attr("width", function (d) {
    			return d.width;
    		}).attr("height", function (d) {
    			return d.height;
    		}).style("opacity", 0.5).style("fill", function (d) {
    			let normalizedValue = d.text;

    			if (isInputLayer) {
    				normalizedValue = 1 - d.text;
    			} else {
    				normalizedValue = (d.text + dataRange / 2) / dataRange;
    			}

    			return colorScale(normalizedValue);
    		}).style("stroke", "black");

    		// Draw cells for the kernel.
    		columns.append("rect").attr("class", "square").attr("x", function (d) {
    			return d.x === 1
    			? d.x + multiplicationSymbolPadding
    			: d.x * 2 + multiplicationSymbolPadding;
    		}).attr("y", function (d) {
    			return d.y === 1 ? d.y + d.height : d.y * 2 + d.height;
    		}).attr("width", function (d) {
    			return d.width;
    		}).attr("height", function (d) {
    			return d.height / 2;
    		}).style("opacity", 0.5).// Same colorscale as is used for the flatten layers.
    		style("fill", function (d) {
    			let normalizedValue = (kernel[d.row][d.col].text + kernelRange.range / 2) / kernelRange.range;
    			const gap = 0.2;
    			let normalizedValueWithGap = normalizedValue * (1 - 2 * gap) + gap;
    			return kernelColorScale(normalizedValueWithGap);
    		});

    		var texts = row.selectAll(".text").data(function (d) {
    			return d;
    		}).enter();

    		// Draw numbers from input matrix slice.
    		texts.append("text").attr("class", "text").style("font-size", Math.floor(constraint / textConstraintDivisor$1) + "px").attr("x", function (d) {
    			return d.x === 1
    			? d.x + d.width / 2 + multiplicationSymbolPadding
    			: d.x * 2 + d.width / 2 + multiplicationSymbolPadding;
    		}).attr("y", function (d) {
    			return d.y === 1 ? d.y + d.height / 2 : d.y * 2 + d.height / 2;
    		}).style("fill", function (d) {
    			let normalizedValue = d.text;

    			if (isInputLayer) {
    				normalizedValue = 1 - d.text;
    			} else {
    				normalizedValue = (d.text + dataRange / 2) / dataRange;
    			}

    			if (normalizedValue < 0.2 || normalizedValue > 0.8) {
    				if (isInputLayer && normalizedValue < 0.2) {
    					return "black";
    				}

    				return "white";
    			} else {
    				return "black";
    			}
    		}).style("text-anchor", "middle").style("dominant-baseline", "middle").text(function (d) {
    			return d.text;
    		});

    		// Attempted to use FontAwesome icons for the 'x', '+', and '=', but none of these strategies work: https://github.com/FortAwesome/Font-Awesome/issues/12268
    		// Draw 'x' to signify multiplication.
    		texts.append("text").attr("class", "text").style("font-size", Math.floor(constraint / textConstraintDivisor$1) + "px").attr("font-weight", 600).attr("x", function (d) {
    			return d.x === 1
    			? d.x + multiplicationSymbolPadding / 2
    			: d.x * 2 + multiplicationSymbolPadding / 2;
    		}).attr("y", function (d) {
    			return d.y === 1
    			? d.y + d.height + d.height / 4
    			: d.y * 2 + d.height + d.height / 4;
    		}).style("fill", "black").style("text-anchor", "middle").style("dominant-baseline", "middle").text(function (d) {
    			return "×";
    		});

    		// Draw kernel values.
    		texts.append("text").attr("class", "text").style("font-size", Math.floor(constraint / textConstraintDivisor$1) + "px").attr("x", function (d) {
    			return d.x === 1
    			? d.x + d.width / 2 + multiplicationSymbolPadding
    			: d.x * 2 + d.width / 2 + multiplicationSymbolPadding;
    		}).attr("y", function (d) {
    			return d.y === 1
    			? d.y + d.height + d.height / 4
    			: d.y * 2 + d.height + d.height / 4;
    		}).style("fill", function (d) {
    			let normalizedValue = (kernel[d.row][d.col].text + kernelRange.range / 2) / kernelRange.range;
    			const gap = 0.2;
    			let normalizedValueWithGap = normalizedValue * (1 - 2 * gap) + gap;

    			if (normalizedValueWithGap < 0.2 || normalizedValueWithGap > 0.8) {
    				return "white";
    			} else {
    				return "black";
    			}
    		}).style("text-anchor", "middle").style("dominant-baseline", "middle").text(function (d) {
    			return kernel[d.row][d.col].text;
    		});

    		// Draw '+' to signify the summing of products except for the last kernel cell where '=' is drawn.
    		texts.append("text").attr("class", "text").style("font-size", Math.floor(constraint / (textConstraintDivisor$1 - 1)) + "px").attr("x", function (d) {
    			return d.x === 1
    			? d.x + d.width + d.width / 2 + multiplicationSymbolPadding
    			: d.x * 2 + d.width + d.width / 2 + multiplicationSymbolPadding;
    		}).attr("y", function (d) {
    			return d.y === 1 ? d.y + d.height / 2 : d.y * 2 + d.height / 2;
    		}).style("text-anchor", "middle").style("dominant-baseline", "middle").text(function (d) {
    			return d.row == kernel.length - 1 && d.col == kernel.length - 1
    			? "="
    			: "+";
    		});
    	};

    	afterUpdate(() => {
    		if (data != oldData) {
    			redraw();
    			oldData = data;
    		}

    		if (kernel != oldKernel) {
    			/*
    redrawDetailedConvViewLegend({
        legendHeight: 5,
        range: kernelRange.range,
        minMax: {min: kernelRange.min, max: kernelRange.max},
        width: 130,
        colorScale: kernelColorScale,
        gradientGap: 0.35,
    });
    */
    			oldKernel = kernel;
    		}
    	});

    	onMount(() => {
    		redraw();
    	}); /*
    redrawDetailedConvViewLegend({
          legendHeight: 5,
          range: kernelRange.range,
          minMax: {min: kernelRange.min, max: kernelRange.max},
          width: 130,
          colorScale: kernelColorScale,
          gradientGap: 0.35,
    });
    */

    	const writable_props = [
    		"data",
    		"kernel",
    		"constraint",
    		"dataRange",
    		"kernelRange",
    		"colorScale",
    		"kernelColorScale",
    		"isInputLayer"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<KernelMathView> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("KernelMathView", $$slots, []);

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			legendFinal = $$value;
    			$$invalidate(1, legendFinal);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			gridFinal = $$value;
    			$$invalidate(0, gridFinal);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("data" in $$props) $$invalidate(2, data = $$props.data);
    		if ("kernel" in $$props) $$invalidate(3, kernel = $$props.kernel);
    		if ("constraint" in $$props) $$invalidate(4, constraint = $$props.constraint);
    		if ("dataRange" in $$props) $$invalidate(5, dataRange = $$props.dataRange);
    		if ("kernelRange" in $$props) $$invalidate(6, kernelRange = $$props.kernelRange);
    		if ("colorScale" in $$props) $$invalidate(7, colorScale = $$props.colorScale);
    		if ("kernelColorScale" in $$props) $$invalidate(8, kernelColorScale = $$props.kernelColorScale);
    		if ("isInputLayer" in $$props) $$invalidate(9, isInputLayer = $$props.isInputLayer);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		kernel,
    		constraint,
    		dataRange,
    		kernelRange,
    		colorScale,
    		kernelColorScale,
    		isInputLayer,
    		onMount,
    		afterUpdate,
    		gridFinal,
    		legendFinal,
    		textConstraintDivisor: textConstraintDivisor$1,
    		multiplicationSymbolPadding,
    		oldData,
    		oldKernel,
    		addOverlayGradient,
    		redrawDetailedConvViewLegend,
    		redraw
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(2, data = $$props.data);
    		if ("kernel" in $$props) $$invalidate(3, kernel = $$props.kernel);
    		if ("constraint" in $$props) $$invalidate(4, constraint = $$props.constraint);
    		if ("dataRange" in $$props) $$invalidate(5, dataRange = $$props.dataRange);
    		if ("kernelRange" in $$props) $$invalidate(6, kernelRange = $$props.kernelRange);
    		if ("colorScale" in $$props) $$invalidate(7, colorScale = $$props.colorScale);
    		if ("kernelColorScale" in $$props) $$invalidate(8, kernelColorScale = $$props.kernelColorScale);
    		if ("isInputLayer" in $$props) $$invalidate(9, isInputLayer = $$props.isInputLayer);
    		if ("gridFinal" in $$props) $$invalidate(0, gridFinal = $$props.gridFinal);
    		if ("legendFinal" in $$props) $$invalidate(1, legendFinal = $$props.legendFinal);
    		if ("oldData" in $$props) oldData = $$props.oldData;
    		if ("oldKernel" in $$props) oldKernel = $$props.oldKernel;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		gridFinal,
    		legendFinal,
    		data,
    		kernel,
    		constraint,
    		dataRange,
    		kernelRange,
    		colorScale,
    		kernelColorScale,
    		isInputLayer,
    		div0_binding,
    		div1_binding
    	];
    }

    class KernelMathView extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
    			data: 2,
    			kernel: 3,
    			constraint: 4,
    			dataRange: 5,
    			kernelRange: 6,
    			colorScale: 7,
    			kernelColorScale: 8,
    			isInputLayer: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "KernelMathView",
    			options,
    			id: create_fragment$4.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[2] === undefined && !("data" in props)) {
    			console.warn("<KernelMathView> was created without expected prop 'data'");
    		}

    		if (/*kernel*/ ctx[3] === undefined && !("kernel" in props)) {
    			console.warn("<KernelMathView> was created without expected prop 'kernel'");
    		}

    		if (/*constraint*/ ctx[4] === undefined && !("constraint" in props)) {
    			console.warn("<KernelMathView> was created without expected prop 'constraint'");
    		}

    		if (/*dataRange*/ ctx[5] === undefined && !("dataRange" in props)) {
    			console.warn("<KernelMathView> was created without expected prop 'dataRange'");
    		}

    		if (/*kernelRange*/ ctx[6] === undefined && !("kernelRange" in props)) {
    			console.warn("<KernelMathView> was created without expected prop 'kernelRange'");
    		}
    	}

    	get data() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernel() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernel(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get constraint() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set constraint(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernelRange() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernelRange(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorScale() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorScale(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernelColorScale() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernelColorScale(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInputLayer() {
    		throw new Error("<KernelMathView>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInputLayer(value) {
    		throw new Error("<KernelMathView>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\ConvolutionAnimator.svelte generated by Svelte v3.23.1 */
    const file$4 = "src\\detail-view\\ConvolutionAnimator.svelte";

    function create_fragment$5(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = /*image*/ ctx[2].length + "";
    	let t1;
    	let t2;
    	let t3_value = /*image*/ ctx[2][0].length + "";
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let div2;
    	let t7;
    	let t8;
    	let div4;
    	let div3;
    	let t9;
    	let t10_value = /*output*/ ctx[3].length + "";
    	let t10;
    	let t11;
    	let t12_value = /*output*/ ctx[3][0].length + "";
    	let t12;
    	let t13;
    	let t14;
    	let current;

    	const dataview0 = new Dataview({
    			props: {
    				data: /*testImage*/ ctx[11],
    				highlights: /*inputHighlights*/ ctx[9],
    				outputLength: /*output*/ ctx[3].length,
    				isKernelMath: false,
    				constraint: getVisualizationSizeConstraint(/*image*/ ctx[2].length),
    				dataRange: /*dataRange*/ ctx[4],
    				stride: /*stride*/ ctx[0],
    				colorScale: /*colorScale*/ ctx[5],
    				isInputLayer: /*isInputInputLayer*/ ctx[6]
    			},
    			$$inline: true
    		});

    	dataview0.$on("message", /*handleMouseover*/ ctx[14]);

    	const kernelmathview = new KernelMathView({
    			props: {
    				data: /*testInputMatrixSlice*/ ctx[7],
    				kernel: /*testKernel*/ ctx[13],
    				constraint: getVisualizationSizeConstraint(/*kernel*/ ctx[1].length),
    				dataRange: /*dataRange*/ ctx[4],
    				kernelRange: getDataRange(/*kernel*/ ctx[1]),
    				colorScale: /*colorScale*/ ctx[5],
    				isInputLayer: /*isInputInputLayer*/ ctx[6]
    			},
    			$$inline: true
    		});

    	const dataview1 = new Dataview({
    			props: {
    				data: /*testOutputMatrixSlice*/ ctx[8],
    				highlights: /*outputHighlights*/ ctx[10],
    				isKernelMath: true,
    				constraint: getVisualizationSizeConstraint(/*kernel*/ ctx[1].length),
    				dataRange: /*dataRange*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const dataview2 = new Dataview({
    			props: {
    				data: /*testOutput*/ ctx[12],
    				highlights: /*outputHighlights*/ ctx[10],
    				isKernelMath: false,
    				outputLength: /*output*/ ctx[3].length,
    				constraint: getVisualizationSizeConstraint(/*output*/ ctx[3].length),
    				dataRange: /*dataRange*/ ctx[4],
    				stride: /*stride*/ ctx[0]
    			},
    			$$inline: true
    		});

    	dataview2.$on("message", /*handleMouseover*/ ctx[14]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Input (");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			t4 = text(")");
    			t5 = space();
    			create_component(dataview0.$$.fragment);
    			t6 = space();
    			div2 = element("div");
    			create_component(kernelmathview.$$.fragment);
    			t7 = space();
    			create_component(dataview1.$$.fragment);
    			t8 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t9 = text("Output (");
    			t10 = text(t10_value);
    			t11 = text(", ");
    			t12 = text(t12_value);
    			t13 = text(")");
    			t14 = space();
    			create_component(dataview2.$$.fragment);
    			attr_dev(div0, "class", "header-text");
    			add_location(div0, file$4, 106, 2, 4124);
    			attr_dev(div1, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div1, file$4, 105, 0, 4082);
    			attr_dev(div2, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div2, file$4, 114, 0, 4530);
    			attr_dev(div3, "class", "header-text");
    			add_location(div3, file$4, 122, 2, 5083);
    			attr_dev(div4, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div4, file$4, 121, 0, 5041);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div1, t5);
    			mount_component(dataview0, div1, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div2, anchor);
    			mount_component(kernelmathview, div2, null);
    			append_dev(div2, t7);
    			mount_component(dataview1, div2, null);
    			insert_dev(target, t8, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, t9);
    			append_dev(div3, t10);
    			append_dev(div3, t11);
    			append_dev(div3, t12);
    			append_dev(div3, t13);
    			append_dev(div4, t14);
    			mount_component(dataview2, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*image*/ 4) && t1_value !== (t1_value = /*image*/ ctx[2].length + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*image*/ 4) && t3_value !== (t3_value = /*image*/ ctx[2][0].length + "")) set_data_dev(t3, t3_value);
    			const dataview0_changes = {};
    			if (dirty & /*testImage*/ 2048) dataview0_changes.data = /*testImage*/ ctx[11];
    			if (dirty & /*inputHighlights*/ 512) dataview0_changes.highlights = /*inputHighlights*/ ctx[9];
    			if (dirty & /*output*/ 8) dataview0_changes.outputLength = /*output*/ ctx[3].length;
    			if (dirty & /*image*/ 4) dataview0_changes.constraint = getVisualizationSizeConstraint(/*image*/ ctx[2].length);
    			if (dirty & /*dataRange*/ 16) dataview0_changes.dataRange = /*dataRange*/ ctx[4];
    			if (dirty & /*stride*/ 1) dataview0_changes.stride = /*stride*/ ctx[0];
    			if (dirty & /*colorScale*/ 32) dataview0_changes.colorScale = /*colorScale*/ ctx[5];
    			if (dirty & /*isInputInputLayer*/ 64) dataview0_changes.isInputLayer = /*isInputInputLayer*/ ctx[6];
    			dataview0.$set(dataview0_changes);
    			const kernelmathview_changes = {};
    			if (dirty & /*testInputMatrixSlice*/ 128) kernelmathview_changes.data = /*testInputMatrixSlice*/ ctx[7];
    			if (dirty & /*testKernel*/ 8192) kernelmathview_changes.kernel = /*testKernel*/ ctx[13];
    			if (dirty & /*kernel*/ 2) kernelmathview_changes.constraint = getVisualizationSizeConstraint(/*kernel*/ ctx[1].length);
    			if (dirty & /*dataRange*/ 16) kernelmathview_changes.dataRange = /*dataRange*/ ctx[4];
    			if (dirty & /*kernel*/ 2) kernelmathview_changes.kernelRange = getDataRange(/*kernel*/ ctx[1]);
    			if (dirty & /*colorScale*/ 32) kernelmathview_changes.colorScale = /*colorScale*/ ctx[5];
    			if (dirty & /*isInputInputLayer*/ 64) kernelmathview_changes.isInputLayer = /*isInputInputLayer*/ ctx[6];
    			kernelmathview.$set(kernelmathview_changes);
    			const dataview1_changes = {};
    			if (dirty & /*testOutputMatrixSlice*/ 256) dataview1_changes.data = /*testOutputMatrixSlice*/ ctx[8];
    			if (dirty & /*outputHighlights*/ 1024) dataview1_changes.highlights = /*outputHighlights*/ ctx[10];
    			if (dirty & /*kernel*/ 2) dataview1_changes.constraint = getVisualizationSizeConstraint(/*kernel*/ ctx[1].length);
    			if (dirty & /*dataRange*/ 16) dataview1_changes.dataRange = /*dataRange*/ ctx[4];
    			dataview1.$set(dataview1_changes);
    			if ((!current || dirty & /*output*/ 8) && t10_value !== (t10_value = /*output*/ ctx[3].length + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty & /*output*/ 8) && t12_value !== (t12_value = /*output*/ ctx[3][0].length + "")) set_data_dev(t12, t12_value);
    			const dataview2_changes = {};
    			if (dirty & /*testOutput*/ 4096) dataview2_changes.data = /*testOutput*/ ctx[12];
    			if (dirty & /*outputHighlights*/ 1024) dataview2_changes.highlights = /*outputHighlights*/ ctx[10];
    			if (dirty & /*output*/ 8) dataview2_changes.outputLength = /*output*/ ctx[3].length;
    			if (dirty & /*output*/ 8) dataview2_changes.constraint = getVisualizationSizeConstraint(/*output*/ ctx[3].length);
    			if (dirty & /*dataRange*/ 16) dataview2_changes.dataRange = /*dataRange*/ ctx[4];
    			if (dirty & /*stride*/ 1) dataview2_changes.stride = /*stride*/ ctx[0];
    			dataview2.$set(dataview2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dataview0.$$.fragment, local);
    			transition_in(kernelmathview.$$.fragment, local);
    			transition_in(dataview1.$$.fragment, local);
    			transition_in(dataview2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dataview0.$$.fragment, local);
    			transition_out(kernelmathview.$$.fragment, local);
    			transition_out(dataview1.$$.fragment, local);
    			transition_out(dataview2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(dataview0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div2);
    			destroy_component(kernelmathview);
    			destroy_component(dataview1);
    			if (detaching) detach_dev(t8);
    			if (detaching) detach_dev(div4);
    			destroy_component(dataview2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const padding = 0;

    function instance$5($$self, $$props, $$invalidate) {
    	let { stride } = $$props;
    	let { dilation } = $$props;
    	let { kernel } = $$props;
    	let { image } = $$props;
    	let { output } = $$props;
    	let { isPaused } = $$props;
    	let { dataRange } = $$props;
    	let { colorScale } = $$props;
    	let { isInputInputLayer = false } = $$props;
    	const dispatch = createEventDispatcher();
    	let padded_input_size = image.length + padding * 2;

    	// Dummy data for original state of component.
    	let testInputMatrixSlice = [];

    	for (let i = 0; i < kernel.length; i++) {
    		testInputMatrixSlice.push([]);

    		for (let j = 0; j < kernel.length; j++) {
    			testInputMatrixSlice[i].push(0);
    		}
    	}

    	testInputMatrixSlice = gridData(testInputMatrixSlice);
    	let testOutputMatrixSlice = gridData([0]);
    	let inputHighlights = [];
    	let outputHighlights = array1d(output.length * output.length, i => true);
    	let interval;
    	let counter;

    	// lots of replication between mouseover and start-conv. TODO: fix this.
    	function startConvolution(stride) {
    		counter = 0;
    		let outputMappings = generateOutputMappings(stride, output, kernel.length, padded_input_size, dilation);
    		if (stride <= 0) return;
    		if (interval) clearInterval(interval);

    		$$invalidate(18, interval = setInterval(
    			() => {
    				if (isPaused) return;
    				const flat_animated = counter % (output.length * output.length);
    				$$invalidate(10, outputHighlights = array1d(output.length * output.length, i => false));
    				const animatedH = Math.floor(flat_animated / output.length);
    				const animatedW = flat_animated % output.length;
    				$$invalidate(10, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    				$$invalidate(9, inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, padded_input_size, kernel.length, outputMappings, kernel.length));
    				const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernel.length);
    				$$invalidate(7, testInputMatrixSlice = gridData(inputMatrixSlice));
    				const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    				$$invalidate(8, testOutputMatrixSlice = gridData(outputMatrixSlice));
    				counter++;
    			},
    			250
    		));
    	}

    	function handleMouseover(event) {
    		let outputMappings = generateOutputMappings(stride, output, kernel.length, padded_input_size, dilation);
    		$$invalidate(10, outputHighlights = array1d(output.length * output.length, i => false));
    		const animatedH = event.detail.hoverH;
    		const animatedW = event.detail.hoverW;
    		$$invalidate(10, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    		$$invalidate(9, inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, padded_input_size, kernel.length, outputMappings, kernel.length));
    		const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernel.length);
    		$$invalidate(7, testInputMatrixSlice = gridData(inputMatrixSlice));
    		const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    		$$invalidate(8, testOutputMatrixSlice = gridData(outputMatrixSlice));
    		$$invalidate(15, isPaused = true);
    		dispatch("message", { text: isPaused });
    	}

    	startConvolution(stride);
    	let testImage = gridData(image);
    	let testOutput = gridData(output);
    	let testKernel = gridData(kernel);

    	const writable_props = [
    		"stride",
    		"dilation",
    		"kernel",
    		"image",
    		"output",
    		"isPaused",
    		"dataRange",
    		"colorScale",
    		"isInputInputLayer"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ConvolutionAnimator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ConvolutionAnimator", $$slots, []);

    	$$self.$set = $$props => {
    		if ("stride" in $$props) $$invalidate(0, stride = $$props.stride);
    		if ("dilation" in $$props) $$invalidate(16, dilation = $$props.dilation);
    		if ("kernel" in $$props) $$invalidate(1, kernel = $$props.kernel);
    		if ("image" in $$props) $$invalidate(2, image = $$props.image);
    		if ("output" in $$props) $$invalidate(3, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(15, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(4, dataRange = $$props.dataRange);
    		if ("colorScale" in $$props) $$invalidate(5, colorScale = $$props.colorScale);
    		if ("isInputInputLayer" in $$props) $$invalidate(6, isInputInputLayer = $$props.isInputInputLayer);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		array1d,
    		getMatrixSliceFromOutputHighlights,
    		compute_input_multiplies_with_weight,
    		getDataRange,
    		getVisualizationSizeConstraint,
    		generateOutputMappings,
    		getMatrixSliceFromInputHighlights,
    		gridData,
    		Dataview,
    		KernelMathView,
    		stride,
    		dilation,
    		kernel,
    		image,
    		output,
    		isPaused,
    		dataRange,
    		colorScale,
    		isInputInputLayer,
    		dispatch,
    		padding,
    		padded_input_size,
    		testInputMatrixSlice,
    		testOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		interval,
    		counter,
    		startConvolution,
    		handleMouseover,
    		testImage,
    		testOutput,
    		testKernel
    	});

    	$$self.$inject_state = $$props => {
    		if ("stride" in $$props) $$invalidate(0, stride = $$props.stride);
    		if ("dilation" in $$props) $$invalidate(16, dilation = $$props.dilation);
    		if ("kernel" in $$props) $$invalidate(1, kernel = $$props.kernel);
    		if ("image" in $$props) $$invalidate(2, image = $$props.image);
    		if ("output" in $$props) $$invalidate(3, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(15, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(4, dataRange = $$props.dataRange);
    		if ("colorScale" in $$props) $$invalidate(5, colorScale = $$props.colorScale);
    		if ("isInputInputLayer" in $$props) $$invalidate(6, isInputInputLayer = $$props.isInputInputLayer);
    		if ("padded_input_size" in $$props) padded_input_size = $$props.padded_input_size;
    		if ("testInputMatrixSlice" in $$props) $$invalidate(7, testInputMatrixSlice = $$props.testInputMatrixSlice);
    		if ("testOutputMatrixSlice" in $$props) $$invalidate(8, testOutputMatrixSlice = $$props.testOutputMatrixSlice);
    		if ("inputHighlights" in $$props) $$invalidate(9, inputHighlights = $$props.inputHighlights);
    		if ("outputHighlights" in $$props) $$invalidate(10, outputHighlights = $$props.outputHighlights);
    		if ("interval" in $$props) $$invalidate(18, interval = $$props.interval);
    		if ("counter" in $$props) counter = $$props.counter;
    		if ("testImage" in $$props) $$invalidate(11, testImage = $$props.testImage);
    		if ("testOutput" in $$props) $$invalidate(12, testOutput = $$props.testOutput);
    		if ("testKernel" in $$props) $$invalidate(13, testKernel = $$props.testKernel);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*image*/ 4) {
    			 padded_input_size = image.length + padding * 2;
    		}

    		if ($$self.$$.dirty & /*output*/ 8) {
    			 {
    				let outputHighlights = array1d(output.length * output.length, i => true);
    			}
    		}

    		if ($$self.$$.dirty & /*stride, image, output, kernel*/ 15) {
    			 {
    				startConvolution(stride);
    				$$invalidate(11, testImage = gridData(image));
    				$$invalidate(12, testOutput = gridData(output));
    				$$invalidate(13, testKernel = gridData(kernel));
    			}
    		}
    	};

    	return [
    		stride,
    		kernel,
    		image,
    		output,
    		dataRange,
    		colorScale,
    		isInputInputLayer,
    		testInputMatrixSlice,
    		testOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		testImage,
    		testOutput,
    		testKernel,
    		handleMouseover,
    		isPaused,
    		dilation
    	];
    }

    class ConvolutionAnimator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
    			stride: 0,
    			dilation: 16,
    			kernel: 1,
    			image: 2,
    			output: 3,
    			isPaused: 15,
    			dataRange: 4,
    			colorScale: 5,
    			isInputInputLayer: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ConvolutionAnimator",
    			options,
    			id: create_fragment$5.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*stride*/ ctx[0] === undefined && !("stride" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'stride'");
    		}

    		if (/*dilation*/ ctx[16] === undefined && !("dilation" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'dilation'");
    		}

    		if (/*kernel*/ ctx[1] === undefined && !("kernel" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'kernel'");
    		}

    		if (/*image*/ ctx[2] === undefined && !("image" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'image'");
    		}

    		if (/*output*/ ctx[3] === undefined && !("output" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'output'");
    		}

    		if (/*isPaused*/ ctx[15] === undefined && !("isPaused" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'isPaused'");
    		}

    		if (/*dataRange*/ ctx[4] === undefined && !("dataRange" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'dataRange'");
    		}

    		if (/*colorScale*/ ctx[5] === undefined && !("colorScale" in props)) {
    			console.warn("<ConvolutionAnimator> was created without expected prop 'colorScale'");
    		}
    	}

    	get stride() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stride(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dilation() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dilation(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernel() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernel(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get output() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set output(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPaused() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPaused(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorScale() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorScale(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInputInputLayer() {
    		throw new Error("<ConvolutionAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInputInputLayer(value) {
    		throw new Error("<ConvolutionAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\Convolutionview.svelte generated by Svelte v3.23.1 */

    const { console: console_1$1 } = globals;
    const file$5 = "src\\detail-view\\Convolutionview.svelte";

    // (110:0) {#if !isExited}
    function create_if_block$1(ctx) {
    	let div10;
    	let div9;
    	let div5;
    	let div0;
    	let t1;
    	let div4;
    	let div1;
    	let i0;
    	let t2;
    	let div2;

    	let raw_value = (/*isPaused*/ ctx[6]
    	? "<i class=\"fas fa-play-circle play-icon\"></i>"
    	: "<i class=\"fas fa-pause-circle\"></i>") + "";

    	let t3;
    	let div3;
    	let i1;
    	let t4;
    	let div6;
    	let t5;
    	let div8;
    	let img;
    	let img_src_value;
    	let t6;
    	let div7;
    	let span;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;

    	const convolutionanimator = new ConvolutionAnimator({
    			props: {
    				kernel: /*kernel*/ ctx[2],
    				image: /*input*/ ctx[1],
    				output: /*outputFinal*/ ctx[7],
    				stride: /*stride*/ ctx[8],
    				dilation,
    				isPaused: /*isPaused*/ ctx[6],
    				dataRange: /*dataRange*/ ctx[3],
    				colorScale: /*colorScale*/ ctx[4],
    				isInputInputLayer: /*isInputInputLayer*/ ctx[5]
    			},
    			$$inline: true
    		});

    	convolutionanimator.$on("message", /*handlePauseFromInteraction*/ ctx[10]);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			div0.textContent = "Convolution";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			i0 = element("i");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			i1 = element("i");
    			t4 = space();
    			div6 = element("div");
    			create_component(convolutionanimator.$$.fragment);
    			t5 = space();
    			div8 = element("div");
    			img = element("img");
    			t6 = space();
    			div7 = element("div");
    			span = element("span");
    			span.textContent = "Hover over";
    			t8 = text(" the matrices to change kernel position.");
    			attr_dev(div0, "class", "title-text svelte-1j8mhv0");
    			add_location(div0, file$5, 132, 8, 2965);
    			attr_dev(i0, "class", "fas fa-info-circle");
    			add_location(i0, file$5, 138, 12, 3171);
    			attr_dev(div1, "class", "control-button svelte-1j8mhv0");
    			attr_dev(div1, "title", "Jump to article section");
    			add_location(div1, file$5, 137, 10, 3073);
    			attr_dev(div2, "class", "play-button control-button svelte-1j8mhv0");
    			attr_dev(div2, "title", "Play animation");
    			add_location(div2, file$5, 141, 10, 3237);
    			attr_dev(i1, "class", "fas control-icon fa-times-circle");
    			add_location(i1, file$5, 148, 12, 3603);
    			attr_dev(div3, "class", "delete-button control-button svelte-1j8mhv0");
    			attr_dev(div3, "title", "Close");
    			add_location(div3, file$5, 147, 10, 3509);
    			attr_dev(div4, "class", "buttons svelte-1j8mhv0");
    			add_location(div4, file$5, 136, 8, 3040);
    			attr_dev(div5, "class", "control-pannel svelte-1j8mhv0");
    			add_location(div5, file$5, 130, 6, 2925);
    			attr_dev(div6, "class", "container is-centered svelte-1j8mhv0");
    			add_location(div6, file$5, 153, 6, 3709);
    			if (img.src !== (img_src_value = "/assets/img/pointer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pointer icon");
    			attr_dev(img, "class", "svelte-1j8mhv0");
    			add_location(img, file$5, 162, 8, 4112);
    			set_style(span, "font-weight", "600");
    			add_location(span, file$5, 164, 10, 4227);
    			attr_dev(div7, "class", "annotation-text");
    			add_location(div7, file$5, 163, 8, 4186);
    			attr_dev(div8, "class", "annotation svelte-1j8mhv0");
    			add_location(div8, file$5, 161, 6, 4078);
    			attr_dev(div9, "class", "box svelte-1j8mhv0");
    			add_location(div9, file$5, 128, 4, 2898);
    			attr_dev(div10, "class", "container svelte-1j8mhv0");
    			attr_dev(div10, "id", "detailview-container");
    			add_location(div10, file$5, 110, 2, 2296);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, div5);
    			append_dev(div5, div0);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, i0);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			div2.innerHTML = raw_value;
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, i1);
    			append_dev(div9, t4);
    			append_dev(div9, div6);
    			mount_component(convolutionanimator, div6, null);
    			append_dev(div9, t5);
    			append_dev(div9, div8);
    			append_dev(div8, img);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, span);
    			append_dev(div7, t8);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", handleScroll, false, false, false),
    					listen_dev(div2, "click", /*handleClickPause*/ ctx[9], false, false, false),
    					listen_dev(div3, "click", /*handleClickX*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*isPaused*/ 64) && raw_value !== (raw_value = (/*isPaused*/ ctx[6]
    			? "<i class=\"fas fa-play-circle play-icon\"></i>"
    			: "<i class=\"fas fa-pause-circle\"></i>") + "")) div2.innerHTML = raw_value;
    			const convolutionanimator_changes = {};
    			if (dirty & /*kernel*/ 4) convolutionanimator_changes.kernel = /*kernel*/ ctx[2];
    			if (dirty & /*input*/ 2) convolutionanimator_changes.image = /*input*/ ctx[1];
    			if (dirty & /*outputFinal*/ 128) convolutionanimator_changes.output = /*outputFinal*/ ctx[7];
    			if (dirty & /*isPaused*/ 64) convolutionanimator_changes.isPaused = /*isPaused*/ ctx[6];
    			if (dirty & /*dataRange*/ 8) convolutionanimator_changes.dataRange = /*dataRange*/ ctx[3];
    			if (dirty & /*colorScale*/ 16) convolutionanimator_changes.colorScale = /*colorScale*/ ctx[4];
    			if (dirty & /*isInputInputLayer*/ 32) convolutionanimator_changes.isInputInputLayer = /*isInputInputLayer*/ ctx[5];
    			convolutionanimator.$set(convolutionanimator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(convolutionanimator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(convolutionanimator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_component(convolutionanimator);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(110:0) {#if !isExited}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*isExited*/ ctx[0] && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*isExited*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isExited*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dilation = 1;

    function handleScroll() {
    	let svgHeight = Number(d3.select("#cnn-svg").style("height").replace("px", "")) + 150;
    	let scroll = new SmoothScroll("a[href*=\"#\"]", { offset: -svgHeight });
    	let anchor = document.querySelector(`#article-convolution`);
    	scroll.animateScroll(anchor);
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let { input } = $$props;
    	let { kernel } = $$props;
    	let { dataRange } = $$props;
    	let { colorScale = d3.interpolateRdBu } = $$props;
    	let { isInputInputLayer = false } = $$props;
    	let { isExited = false } = $$props;

    	// export let output;
    	const dispatch = createEventDispatcher();

    	let stride = 1;
    	var isPaused = false;
    	var outputFinal = singleConv(input, kernel, stride);

    	function handleClickPause() {
    		$$invalidate(6, isPaused = !isPaused);
    	}

    	function handlePauseFromInteraction(event) {
    		$$invalidate(6, isPaused = event.detail.text);
    	}

    	function handleClickX() {
    		$$invalidate(0, isExited = true);
    		dispatch("message", { text: isExited });
    	}

    	const writable_props = ["input", "kernel", "dataRange", "colorScale", "isInputInputLayer", "isExited"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$1.warn(`<Convolutionview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Convolutionview", $$slots, []);

    	$$self.$set = $$props => {
    		if ("input" in $$props) $$invalidate(1, input = $$props.input);
    		if ("kernel" in $$props) $$invalidate(2, kernel = $$props.kernel);
    		if ("dataRange" in $$props) $$invalidate(3, dataRange = $$props.dataRange);
    		if ("colorScale" in $$props) $$invalidate(4, colorScale = $$props.colorScale);
    		if ("isInputInputLayer" in $$props) $$invalidate(5, isInputInputLayer = $$props.isInputInputLayer);
    		if ("isExited" in $$props) $$invalidate(0, isExited = $$props.isExited);
    	};

    	$$self.$capture_state = () => ({
    		ConvolutionAnimator,
    		singleConv,
    		createEventDispatcher,
    		input,
    		kernel,
    		dataRange,
    		colorScale,
    		isInputInputLayer,
    		isExited,
    		dispatch,
    		stride,
    		dilation,
    		isPaused,
    		outputFinal,
    		handleClickPause,
    		handleScroll,
    		handlePauseFromInteraction,
    		handleClickX
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(1, input = $$props.input);
    		if ("kernel" in $$props) $$invalidate(2, kernel = $$props.kernel);
    		if ("dataRange" in $$props) $$invalidate(3, dataRange = $$props.dataRange);
    		if ("colorScale" in $$props) $$invalidate(4, colorScale = $$props.colorScale);
    		if ("isInputInputLayer" in $$props) $$invalidate(5, isInputInputLayer = $$props.isInputInputLayer);
    		if ("isExited" in $$props) $$invalidate(0, isExited = $$props.isExited);
    		if ("stride" in $$props) $$invalidate(8, stride = $$props.stride);
    		if ("isPaused" in $$props) $$invalidate(6, isPaused = $$props.isPaused);
    		if ("outputFinal" in $$props) $$invalidate(7, outputFinal = $$props.outputFinal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*input, kernel*/ 6) {
    			 if (stride > 0) {
    				try {
    					$$invalidate(7, outputFinal = singleConv(input, kernel, stride));
    				} catch {
    					console.log("Cannot handle stride of " + stride);
    				}
    			}
    		}
    	};

    	return [
    		isExited,
    		input,
    		kernel,
    		dataRange,
    		colorScale,
    		isInputInputLayer,
    		isPaused,
    		outputFinal,
    		stride,
    		handleClickPause,
    		handlePauseFromInteraction,
    		handleClickX
    	];
    }

    class Convolutionview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {
    			input: 1,
    			kernel: 2,
    			dataRange: 3,
    			colorScale: 4,
    			isInputInputLayer: 5,
    			isExited: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Convolutionview",
    			options,
    			id: create_fragment$6.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*input*/ ctx[1] === undefined && !("input" in props)) {
    			console_1$1.warn("<Convolutionview> was created without expected prop 'input'");
    		}

    		if (/*kernel*/ ctx[2] === undefined && !("kernel" in props)) {
    			console_1$1.warn("<Convolutionview> was created without expected prop 'kernel'");
    		}

    		if (/*dataRange*/ ctx[3] === undefined && !("dataRange" in props)) {
    			console_1$1.warn("<Convolutionview> was created without expected prop 'dataRange'");
    		}
    	}

    	get input() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernel() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernel(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get colorScale() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set colorScale(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isInputInputLayer() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isInputInputLayer(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isExited() {
    		throw new Error("<Convolutionview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isExited(value) {
    		throw new Error("<Convolutionview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\ActivationAnimator.svelte generated by Svelte v3.23.1 */
    const file$6 = "src\\detail-view\\ActivationAnimator.svelte";

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = /*image*/ ctx[0].length + "";
    	let t1;
    	let t2;
    	let t3_value = /*image*/ ctx[0][0].length + "";
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let div2;
    	let span;
    	let t7;
    	let t8;
    	let t9;
    	let t10;
    	let div4;
    	let div3;
    	let t11;
    	let t12_value = /*output*/ ctx[1].length + "";
    	let t12;
    	let t13;
    	let t14_value = /*output*/ ctx[1][0].length + "";
    	let t14;
    	let t15;
    	let t16;
    	let current;

    	const dataview0 = new Dataview({
    			props: {
    				data: /*gridImage*/ ctx[7],
    				highlights: /*inputHighlights*/ ctx[5],
    				outputLength: /*output*/ ctx[1].length,
    				isKernelMath: false,
    				constraint: getVisualizationSizeConstraint(/*image*/ ctx[0].length),
    				dataRange: /*dataRange*/ ctx[2],
    				stride: 1
    			},
    			$$inline: true
    		});

    	dataview0.$on("message", /*handleMouseover*/ ctx[9]);

    	const dataview1 = new Dataview({
    			props: {
    				data: gridData([[0]]),
    				highlights: /*outputHighlights*/ ctx[6],
    				isKernelMath: true,
    				constraint: 20,
    				dataRange: /*dataRange*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const dataview2 = new Dataview({
    			props: {
    				data: /*gridInputMatrixSlice*/ ctx[3],
    				highlights: /*outputHighlights*/ ctx[6],
    				isKernelMath: true,
    				constraint: 20,
    				dataRange: /*dataRange*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const dataview3 = new Dataview({
    			props: {
    				data: /*gridOutputMatrixSlice*/ ctx[4],
    				highlights: /*outputHighlights*/ ctx[6],
    				isKernelMath: true,
    				constraint: 20,
    				dataRange: /*dataRange*/ ctx[2]
    			},
    			$$inline: true
    		});

    	const dataview4 = new Dataview({
    			props: {
    				data: /*gridOutput*/ ctx[8],
    				highlights: /*outputHighlights*/ ctx[6],
    				isKernelMath: false,
    				outputLength: /*output*/ ctx[1].length,
    				constraint: getVisualizationSizeConstraint(/*output*/ ctx[1].length),
    				dataRange: /*dataRange*/ ctx[2],
    				stride: 1
    			},
    			$$inline: true
    		});

    	dataview4.$on("message", /*handleMouseover*/ ctx[9]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Input (");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			t4 = text(")");
    			t5 = space();
    			create_component(dataview0.$$.fragment);
    			t6 = space();
    			div2 = element("div");
    			span = element("span");
    			t7 = text("max(\r\n    ");
    			create_component(dataview1.$$.fragment);
    			t8 = text("\r\n    ,\r\n    ");
    			create_component(dataview2.$$.fragment);
    			t9 = text("\r\n    )\r\n    =\r\n    ");
    			create_component(dataview3.$$.fragment);
    			t10 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t11 = text("Output (");
    			t12 = text(t12_value);
    			t13 = text(", ");
    			t14 = text(t14_value);
    			t15 = text(")");
    			t16 = space();
    			create_component(dataview4.$$.fragment);
    			attr_dev(div0, "class", "header-text");
    			add_location(div0, file$6, 85, 2, 3209);
    			attr_dev(div1, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div1, file$6, 84, 0, 3167);
    			add_location(span, file$6, 92, 2, 3583);
    			attr_dev(div2, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div2, file$6, 91, 0, 3541);
    			attr_dev(div3, "class", "header-text");
    			add_location(div3, file$6, 106, 2, 4099);
    			attr_dev(div4, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div4, file$6, 105, 0, 4057);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div1, t5);
    			mount_component(dataview0, div1, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, span);
    			append_dev(span, t7);
    			mount_component(dataview1, span, null);
    			append_dev(span, t8);
    			mount_component(dataview2, span, null);
    			append_dev(span, t9);
    			mount_component(dataview3, span, null);
    			insert_dev(target, t10, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, t11);
    			append_dev(div3, t12);
    			append_dev(div3, t13);
    			append_dev(div3, t14);
    			append_dev(div3, t15);
    			append_dev(div4, t16);
    			mount_component(dataview4, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*image*/ 1) && t1_value !== (t1_value = /*image*/ ctx[0].length + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*image*/ 1) && t3_value !== (t3_value = /*image*/ ctx[0][0].length + "")) set_data_dev(t3, t3_value);
    			const dataview0_changes = {};
    			if (dirty & /*gridImage*/ 128) dataview0_changes.data = /*gridImage*/ ctx[7];
    			if (dirty & /*inputHighlights*/ 32) dataview0_changes.highlights = /*inputHighlights*/ ctx[5];
    			if (dirty & /*output*/ 2) dataview0_changes.outputLength = /*output*/ ctx[1].length;
    			if (dirty & /*image*/ 1) dataview0_changes.constraint = getVisualizationSizeConstraint(/*image*/ ctx[0].length);
    			if (dirty & /*dataRange*/ 4) dataview0_changes.dataRange = /*dataRange*/ ctx[2];
    			dataview0.$set(dataview0_changes);
    			const dataview1_changes = {};
    			if (dirty & /*outputHighlights*/ 64) dataview1_changes.highlights = /*outputHighlights*/ ctx[6];
    			if (dirty & /*dataRange*/ 4) dataview1_changes.dataRange = /*dataRange*/ ctx[2];
    			dataview1.$set(dataview1_changes);
    			const dataview2_changes = {};
    			if (dirty & /*gridInputMatrixSlice*/ 8) dataview2_changes.data = /*gridInputMatrixSlice*/ ctx[3];
    			if (dirty & /*outputHighlights*/ 64) dataview2_changes.highlights = /*outputHighlights*/ ctx[6];
    			if (dirty & /*dataRange*/ 4) dataview2_changes.dataRange = /*dataRange*/ ctx[2];
    			dataview2.$set(dataview2_changes);
    			const dataview3_changes = {};
    			if (dirty & /*gridOutputMatrixSlice*/ 16) dataview3_changes.data = /*gridOutputMatrixSlice*/ ctx[4];
    			if (dirty & /*outputHighlights*/ 64) dataview3_changes.highlights = /*outputHighlights*/ ctx[6];
    			if (dirty & /*dataRange*/ 4) dataview3_changes.dataRange = /*dataRange*/ ctx[2];
    			dataview3.$set(dataview3_changes);
    			if ((!current || dirty & /*output*/ 2) && t12_value !== (t12_value = /*output*/ ctx[1].length + "")) set_data_dev(t12, t12_value);
    			if ((!current || dirty & /*output*/ 2) && t14_value !== (t14_value = /*output*/ ctx[1][0].length + "")) set_data_dev(t14, t14_value);
    			const dataview4_changes = {};
    			if (dirty & /*gridOutput*/ 256) dataview4_changes.data = /*gridOutput*/ ctx[8];
    			if (dirty & /*outputHighlights*/ 64) dataview4_changes.highlights = /*outputHighlights*/ ctx[6];
    			if (dirty & /*output*/ 2) dataview4_changes.outputLength = /*output*/ ctx[1].length;
    			if (dirty & /*output*/ 2) dataview4_changes.constraint = getVisualizationSizeConstraint(/*output*/ ctx[1].length);
    			if (dirty & /*dataRange*/ 4) dataview4_changes.dataRange = /*dataRange*/ ctx[2];
    			dataview4.$set(dataview4_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dataview0.$$.fragment, local);
    			transition_in(dataview1.$$.fragment, local);
    			transition_in(dataview2.$$.fragment, local);
    			transition_in(dataview3.$$.fragment, local);
    			transition_in(dataview4.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dataview0.$$.fragment, local);
    			transition_out(dataview1.$$.fragment, local);
    			transition_out(dataview2.$$.fragment, local);
    			transition_out(dataview3.$$.fragment, local);
    			transition_out(dataview4.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(dataview0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div2);
    			destroy_component(dataview1);
    			destroy_component(dataview2);
    			destroy_component(dataview3);
    			if (detaching) detach_dev(t10);
    			if (detaching) detach_dev(div4);
    			destroy_component(dataview4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const padding$1 = 0;

    function instance$7($$self, $$props, $$invalidate) {
    	let { image } = $$props;
    	let { output } = $$props;
    	let { isPaused } = $$props;
    	let { dataRange } = $$props;
    	const dispatch = createEventDispatcher();
    	let padded_input_size = image.length + padding$1 * 2;
    	let gridInputMatrixSlice = gridData([[0]]);
    	let gridOutputMatrixSlice = gridData([[0]]);
    	let inputHighlights = array1d(image.length * image.length, i => true);
    	let outputHighlights = array1d(output.length * output.length, i => true);
    	let interval;
    	let counter;

    	// lots of replication between mouseover and start-relu. TODO: fix this.
    	function startRelu() {
    		counter = 0;
    		if (interval) clearInterval(interval);

    		$$invalidate(12, interval = setInterval(
    			() => {
    				if (isPaused) return;
    				const flat_animated = counter % (output.length * output.length);
    				$$invalidate(6, outputHighlights = array1d(output.length * output.length, i => false));
    				$$invalidate(5, inputHighlights = array1d(image.length * image.length, i => undefined));
    				const animatedH = Math.floor(flat_animated / output.length);
    				const animatedW = flat_animated % output.length;
    				$$invalidate(6, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    				$$invalidate(5, inputHighlights[animatedH * output.length + animatedW] = true, inputHighlights);
    				const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, 1);
    				$$invalidate(3, gridInputMatrixSlice = gridData(inputMatrixSlice));
    				const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    				$$invalidate(4, gridOutputMatrixSlice = gridData(outputMatrixSlice));
    				counter++;
    			},
    			250
    		));
    	}

    	function handleMouseover(event) {
    		$$invalidate(6, outputHighlights = array1d(output.length * output.length, i => false));
    		const animatedH = event.detail.hoverH;
    		const animatedW = event.detail.hoverW;
    		$$invalidate(6, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    		$$invalidate(5, inputHighlights = array1d(image.length * image.length, i => undefined));
    		$$invalidate(5, inputHighlights[animatedH * output.length + animatedW] = true, inputHighlights);
    		const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, 1);
    		$$invalidate(3, gridInputMatrixSlice = gridData(inputMatrixSlice));
    		const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    		$$invalidate(4, gridOutputMatrixSlice = gridData(outputMatrixSlice));
    		$$invalidate(10, isPaused = true);
    		dispatch("message", { text: isPaused });
    	}

    	startRelu();
    	let gridImage = gridData(image);
    	let gridOutput = gridData(output);
    	const writable_props = ["image", "output", "isPaused", "dataRange"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ActivationAnimator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("ActivationAnimator", $$slots, []);

    	$$self.$set = $$props => {
    		if ("image" in $$props) $$invalidate(0, image = $$props.image);
    		if ("output" in $$props) $$invalidate(1, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(10, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		array1d,
    		getMatrixSliceFromOutputHighlights,
    		getVisualizationSizeConstraint,
    		getMatrixSliceFromInputHighlights,
    		gridData,
    		Dataview,
    		image,
    		output,
    		isPaused,
    		dataRange,
    		dispatch,
    		padding: padding$1,
    		padded_input_size,
    		gridInputMatrixSlice,
    		gridOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		interval,
    		counter,
    		startRelu,
    		handleMouseover,
    		gridImage,
    		gridOutput
    	});

    	$$self.$inject_state = $$props => {
    		if ("image" in $$props) $$invalidate(0, image = $$props.image);
    		if ("output" in $$props) $$invalidate(1, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(10, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    		if ("padded_input_size" in $$props) padded_input_size = $$props.padded_input_size;
    		if ("gridInputMatrixSlice" in $$props) $$invalidate(3, gridInputMatrixSlice = $$props.gridInputMatrixSlice);
    		if ("gridOutputMatrixSlice" in $$props) $$invalidate(4, gridOutputMatrixSlice = $$props.gridOutputMatrixSlice);
    		if ("inputHighlights" in $$props) $$invalidate(5, inputHighlights = $$props.inputHighlights);
    		if ("outputHighlights" in $$props) $$invalidate(6, outputHighlights = $$props.outputHighlights);
    		if ("interval" in $$props) $$invalidate(12, interval = $$props.interval);
    		if ("counter" in $$props) counter = $$props.counter;
    		if ("gridImage" in $$props) $$invalidate(7, gridImage = $$props.gridImage);
    		if ("gridOutput" in $$props) $$invalidate(8, gridOutput = $$props.gridOutput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*image*/ 1) {
    			 padded_input_size = image.length + padding$1 * 2;
    		}

    		if ($$self.$$.dirty & /*image, output*/ 3) {
    			 {
    				let inputHighlights = array1d(image.length * image.length, i => true);
    				let outputHighlights = array1d(output.length * output.length, i => true);
    			}
    		}

    		if ($$self.$$.dirty & /*image, output*/ 3) {
    			 {
    				startRelu();
    				$$invalidate(7, gridImage = gridData(image));
    				$$invalidate(8, gridOutput = gridData(output));
    			}
    		}
    	};

    	return [
    		image,
    		output,
    		dataRange,
    		gridInputMatrixSlice,
    		gridOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		gridImage,
    		gridOutput,
    		handleMouseover,
    		isPaused
    	];
    }

    class ActivationAnimator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			image: 0,
    			output: 1,
    			isPaused: 10,
    			dataRange: 2
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ActivationAnimator",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*image*/ ctx[0] === undefined && !("image" in props)) {
    			console.warn("<ActivationAnimator> was created without expected prop 'image'");
    		}

    		if (/*output*/ ctx[1] === undefined && !("output" in props)) {
    			console.warn("<ActivationAnimator> was created without expected prop 'output'");
    		}

    		if (/*isPaused*/ ctx[10] === undefined && !("isPaused" in props)) {
    			console.warn("<ActivationAnimator> was created without expected prop 'isPaused'");
    		}

    		if (/*dataRange*/ ctx[2] === undefined && !("dataRange" in props)) {
    			console.warn("<ActivationAnimator> was created without expected prop 'dataRange'");
    		}
    	}

    	get image() {
    		throw new Error("<ActivationAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<ActivationAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get output() {
    		throw new Error("<ActivationAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set output(value) {
    		throw new Error("<ActivationAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPaused() {
    		throw new Error("<ActivationAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPaused(value) {
    		throw new Error("<ActivationAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<ActivationAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<ActivationAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\Activationview.svelte generated by Svelte v3.23.1 */
    const file$7 = "src\\detail-view\\Activationview.svelte";

    // (95:0) {#if !isExited}
    function create_if_block$2(ctx) {
    	let div10;
    	let div9;
    	let div5;
    	let div0;
    	let t1;
    	let div4;
    	let div1;
    	let i0;
    	let t2;
    	let div2;

    	let raw_value = (/*isPaused*/ ctx[4]
    	? "<i class=\"fas fa-play-circle play-icon\"></i>"
    	: "<i class=\"fas fa-pause-circle\"></i>") + "";

    	let t3;
    	let div3;
    	let i1;
    	let t4;
    	let div6;
    	let t5;
    	let div8;
    	let img;
    	let img_src_value;
    	let t6;
    	let div7;
    	let span;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;

    	const activationanimator = new ActivationAnimator({
    			props: {
    				image: /*input*/ ctx[0],
    				output: /*output*/ ctx[1],
    				isPaused: /*isPaused*/ ctx[4],
    				dataRange: /*dataRange*/ ctx[2]
    			},
    			$$inline: true
    		});

    	activationanimator.$on("message", /*handlePauseFromInteraction*/ ctx[6]);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			div0.textContent = "ReLU Activation";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			i0 = element("i");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			i1 = element("i");
    			t4 = space();
    			div6 = element("div");
    			create_component(activationanimator.$$.fragment);
    			t5 = space();
    			div8 = element("div");
    			img = element("img");
    			t6 = space();
    			div7 = element("div");
    			span = element("span");
    			span.textContent = "Hover over";
    			t8 = text(" the matrices to change pixel.");
    			attr_dev(div0, "class", "title-text svelte-1lq7956");
    			add_location(div0, file$7, 100, 8, 1910);
    			attr_dev(i0, "class", "fas fa-info-circle");
    			add_location(i0, file$7, 107, 12, 2122);
    			attr_dev(div1, "class", "control-button svelte-1lq7956");
    			attr_dev(div1, "title", "Jump to article section");
    			add_location(div1, file$7, 106, 10, 2024);
    			attr_dev(div2, "class", "play-button control-button svelte-1lq7956");
    			attr_dev(div2, "title", "Play animation");
    			add_location(div2, file$7, 110, 10, 2188);
    			attr_dev(i1, "class", "fas control-icon fa-times-circle");
    			add_location(i1, file$7, 117, 14, 2556);
    			attr_dev(div3, "class", "delete-button control-button svelte-1lq7956");
    			attr_dev(div3, "title", "Close");
    			add_location(div3, file$7, 116, 10, 2460);
    			attr_dev(div4, "class", "buttons svelte-1lq7956");
    			add_location(div4, file$7, 104, 8, 1989);
    			attr_dev(div5, "class", "control-pannel svelte-1lq7956");
    			add_location(div5, file$7, 98, 6, 1870);
    			attr_dev(div6, "class", "container is-centered is-vcentered svelte-1lq7956");
    			add_location(div6, file$7, 123, 6, 2664);
    			if (img.src !== (img_src_value = "/assets/img/pointer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pointer icon");
    			attr_dev(img, "class", "svelte-1lq7956");
    			add_location(img, file$7, 130, 8, 2936);
    			set_style(span, "font-weight", "600");
    			add_location(span, file$7, 132, 10, 3051);
    			attr_dev(div7, "class", "annotation-text");
    			add_location(div7, file$7, 131, 8, 3010);
    			attr_dev(div8, "class", "annotation svelte-1lq7956");
    			add_location(div8, file$7, 129, 6, 2902);
    			attr_dev(div9, "class", "box svelte-1lq7956");
    			add_location(div9, file$7, 96, 4, 1843);
    			attr_dev(div10, "class", "container svelte-1lq7956");
    			add_location(div10, file$7, 95, 2, 1814);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, div5);
    			append_dev(div5, div0);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, i0);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			div2.innerHTML = raw_value;
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, i1);
    			append_dev(div9, t4);
    			append_dev(div9, div6);
    			mount_component(activationanimator, div6, null);
    			append_dev(div9, t5);
    			append_dev(div9, div8);
    			append_dev(div8, img);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, span);
    			append_dev(div7, t8);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", handleScroll$1, false, false, false),
    					listen_dev(div2, "click", /*handleClickPause*/ ctx[5], false, false, false),
    					listen_dev(div3, "click", /*handleClickX*/ ctx[7], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*isPaused*/ 16) && raw_value !== (raw_value = (/*isPaused*/ ctx[4]
    			? "<i class=\"fas fa-play-circle play-icon\"></i>"
    			: "<i class=\"fas fa-pause-circle\"></i>") + "")) div2.innerHTML = raw_value;
    			const activationanimator_changes = {};
    			if (dirty & /*input*/ 1) activationanimator_changes.image = /*input*/ ctx[0];
    			if (dirty & /*output*/ 2) activationanimator_changes.output = /*output*/ ctx[1];
    			if (dirty & /*isPaused*/ 16) activationanimator_changes.isPaused = /*isPaused*/ ctx[4];
    			if (dirty & /*dataRange*/ 4) activationanimator_changes.dataRange = /*dataRange*/ ctx[2];
    			activationanimator.$set(activationanimator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activationanimator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activationanimator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_component(activationanimator);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(95:0) {#if !isExited}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*isExited*/ ctx[3] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*isExited*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isExited*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleScroll$1() {
    	let svgHeight = Number(d3.select("#cnn-svg").style("height").replace("px", "")) + 150;
    	let scroll = new SmoothScroll("a[href*=\"#\"]", { offset: -svgHeight });
    	let anchor = document.querySelector(`#article-relu`);
    	scroll.animateScroll(anchor);
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { input } = $$props;
    	let { output } = $$props;
    	let { dataRange } = $$props;
    	let { isExited } = $$props;
    	const dispatch = createEventDispatcher();
    	let isPaused = false;

    	function handleClickPause() {
    		$$invalidate(4, isPaused = !isPaused);
    	}

    	function handlePauseFromInteraction(event) {
    		$$invalidate(4, isPaused = event.detail.text);
    	}

    	function handleClickX() {
    		dispatch("message", { text: true });
    	}

    	const writable_props = ["input", "output", "dataRange", "isExited"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Activationview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Activationview", $$slots, []);

    	$$self.$set = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("output" in $$props) $$invalidate(1, output = $$props.output);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    		if ("isExited" in $$props) $$invalidate(3, isExited = $$props.isExited);
    	};

    	$$self.$capture_state = () => ({
    		ActivationAnimator,
    		createEventDispatcher,
    		input,
    		output,
    		dataRange,
    		isExited,
    		dispatch,
    		isPaused,
    		handleClickPause,
    		handlePauseFromInteraction,
    		handleClickX,
    		handleScroll: handleScroll$1
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("output" in $$props) $$invalidate(1, output = $$props.output);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    		if ("isExited" in $$props) $$invalidate(3, isExited = $$props.isExited);
    		if ("isPaused" in $$props) $$invalidate(4, isPaused = $$props.isPaused);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		input,
    		output,
    		dataRange,
    		isExited,
    		isPaused,
    		handleClickPause,
    		handlePauseFromInteraction,
    		handleClickX
    	];
    }

    class Activationview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			input: 0,
    			output: 1,
    			dataRange: 2,
    			isExited: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Activationview",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*input*/ ctx[0] === undefined && !("input" in props)) {
    			console.warn("<Activationview> was created without expected prop 'input'");
    		}

    		if (/*output*/ ctx[1] === undefined && !("output" in props)) {
    			console.warn("<Activationview> was created without expected prop 'output'");
    		}

    		if (/*dataRange*/ ctx[2] === undefined && !("dataRange" in props)) {
    			console.warn("<Activationview> was created without expected prop 'dataRange'");
    		}

    		if (/*isExited*/ ctx[3] === undefined && !("isExited" in props)) {
    			console.warn("<Activationview> was created without expected prop 'isExited'");
    		}
    	}

    	get input() {
    		throw new Error("<Activationview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Activationview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get output() {
    		throw new Error("<Activationview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set output(value) {
    		throw new Error("<Activationview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<Activationview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<Activationview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isExited() {
    		throw new Error("<Activationview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isExited(value) {
    		throw new Error("<Activationview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\PoolAnimator.svelte generated by Svelte v3.23.1 */
    const file$8 = "src\\detail-view\\PoolAnimator.svelte";

    function create_fragment$9(ctx) {
    	let div1;
    	let div0;
    	let t0;
    	let t1_value = /*testImage*/ ctx[9].length + "";
    	let t1;
    	let t2;
    	let t3_value = /*testImage*/ ctx[9][0].length + "";
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let div2;
    	let span;
    	let t7;
    	let t8;
    	let t9;
    	let div4;
    	let div3;
    	let t10;
    	let t11_value = /*testOutput*/ ctx[10].length + "";
    	let t11;
    	let t12;
    	let t13_value = /*testOutput*/ ctx[10][0].length + "";
    	let t13;
    	let t14;
    	let t15;
    	let current;

    	const dataview0 = new Dataview({
    			props: {
    				data: /*testImage*/ ctx[9],
    				highlights: /*inputHighlights*/ ctx[7],
    				outputLength: /*output*/ ctx[3].length,
    				isKernelMath: false,
    				constraint: getVisualizationSizeConstraint(/*image*/ ctx[2].length),
    				dataRange: /*dataRange*/ ctx[4],
    				stride: /*stride*/ ctx[0]
    			},
    			$$inline: true
    		});

    	dataview0.$on("message", /*handleMouseover*/ ctx[11]);

    	const dataview1 = new Dataview({
    			props: {
    				data: /*testInputMatrixSlice*/ ctx[5],
    				highlights: /*outputHighlights*/ ctx[8],
    				isKernelMath: true,
    				constraint: getVisualizationSizeConstraint(/*kernelLength*/ ctx[1]),
    				dataRange: /*dataRange*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const dataview2 = new Dataview({
    			props: {
    				data: /*testOutputMatrixSlice*/ ctx[6],
    				highlights: /*outputHighlights*/ ctx[8],
    				isKernelMath: true,
    				constraint: getVisualizationSizeConstraint(/*kernelLength*/ ctx[1]),
    				dataRange: /*dataRange*/ ctx[4]
    			},
    			$$inline: true
    		});

    	const dataview3 = new Dataview({
    			props: {
    				data: /*testOutput*/ ctx[10],
    				highlights: /*outputHighlights*/ ctx[8],
    				isKernelMath: false,
    				outputLength: /*output*/ ctx[3].length,
    				constraint: getVisualizationSizeConstraint(/*output*/ ctx[3].length),
    				dataRange: /*dataRange*/ ctx[4],
    				stride: /*stride*/ ctx[0]
    			},
    			$$inline: true
    		});

    	dataview3.$on("message", /*handleMouseover*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t0 = text("Input (");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			t4 = text(")");
    			t5 = space();
    			create_component(dataview0.$$.fragment);
    			t6 = space();
    			div2 = element("div");
    			span = element("span");
    			t7 = text("max(\r\n    ");
    			create_component(dataview1.$$.fragment);
    			t8 = text("\r\n    )\r\n    =\r\n    ");
    			create_component(dataview2.$$.fragment);
    			t9 = space();
    			div4 = element("div");
    			div3 = element("div");
    			t10 = text("Output (");
    			t11 = text(t11_value);
    			t12 = text(", ");
    			t13 = text(t13_value);
    			t14 = text(")");
    			t15 = space();
    			create_component(dataview3.$$.fragment);
    			attr_dev(div0, "class", "header-text");
    			add_location(div0, file$8, 99, 2, 3821);
    			attr_dev(div1, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div1, file$8, 98, 0, 3779);
    			add_location(span, file$8, 107, 2, 4210);
    			attr_dev(div2, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div2, file$8, 106, 0, 4168);
    			attr_dev(div3, "class", "header-text");
    			add_location(div3, file$8, 118, 2, 4671);
    			attr_dev(div4, "class", "column has-text-centered svelte-gz7a6i");
    			add_location(div4, file$8, 117, 0, 4629);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div1, t5);
    			mount_component(dataview0, div1, null);
    			insert_dev(target, t6, anchor);
    			insert_dev(target, div2, anchor);
    			append_dev(div2, span);
    			append_dev(span, t7);
    			mount_component(dataview1, span, null);
    			append_dev(span, t8);
    			mount_component(dataview2, span, null);
    			insert_dev(target, t9, anchor);
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div3);
    			append_dev(div3, t10);
    			append_dev(div3, t11);
    			append_dev(div3, t12);
    			append_dev(div3, t13);
    			append_dev(div3, t14);
    			append_dev(div4, t15);
    			mount_component(dataview3, div4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*testImage*/ 512) && t1_value !== (t1_value = /*testImage*/ ctx[9].length + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*testImage*/ 512) && t3_value !== (t3_value = /*testImage*/ ctx[9][0].length + "")) set_data_dev(t3, t3_value);
    			const dataview0_changes = {};
    			if (dirty & /*testImage*/ 512) dataview0_changes.data = /*testImage*/ ctx[9];
    			if (dirty & /*inputHighlights*/ 128) dataview0_changes.highlights = /*inputHighlights*/ ctx[7];
    			if (dirty & /*output*/ 8) dataview0_changes.outputLength = /*output*/ ctx[3].length;
    			if (dirty & /*image*/ 4) dataview0_changes.constraint = getVisualizationSizeConstraint(/*image*/ ctx[2].length);
    			if (dirty & /*dataRange*/ 16) dataview0_changes.dataRange = /*dataRange*/ ctx[4];
    			if (dirty & /*stride*/ 1) dataview0_changes.stride = /*stride*/ ctx[0];
    			dataview0.$set(dataview0_changes);
    			const dataview1_changes = {};
    			if (dirty & /*testInputMatrixSlice*/ 32) dataview1_changes.data = /*testInputMatrixSlice*/ ctx[5];
    			if (dirty & /*outputHighlights*/ 256) dataview1_changes.highlights = /*outputHighlights*/ ctx[8];
    			if (dirty & /*kernelLength*/ 2) dataview1_changes.constraint = getVisualizationSizeConstraint(/*kernelLength*/ ctx[1]);
    			if (dirty & /*dataRange*/ 16) dataview1_changes.dataRange = /*dataRange*/ ctx[4];
    			dataview1.$set(dataview1_changes);
    			const dataview2_changes = {};
    			if (dirty & /*testOutputMatrixSlice*/ 64) dataview2_changes.data = /*testOutputMatrixSlice*/ ctx[6];
    			if (dirty & /*outputHighlights*/ 256) dataview2_changes.highlights = /*outputHighlights*/ ctx[8];
    			if (dirty & /*kernelLength*/ 2) dataview2_changes.constraint = getVisualizationSizeConstraint(/*kernelLength*/ ctx[1]);
    			if (dirty & /*dataRange*/ 16) dataview2_changes.dataRange = /*dataRange*/ ctx[4];
    			dataview2.$set(dataview2_changes);
    			if ((!current || dirty & /*testOutput*/ 1024) && t11_value !== (t11_value = /*testOutput*/ ctx[10].length + "")) set_data_dev(t11, t11_value);
    			if ((!current || dirty & /*testOutput*/ 1024) && t13_value !== (t13_value = /*testOutput*/ ctx[10][0].length + "")) set_data_dev(t13, t13_value);
    			const dataview3_changes = {};
    			if (dirty & /*testOutput*/ 1024) dataview3_changes.data = /*testOutput*/ ctx[10];
    			if (dirty & /*outputHighlights*/ 256) dataview3_changes.highlights = /*outputHighlights*/ ctx[8];
    			if (dirty & /*output*/ 8) dataview3_changes.outputLength = /*output*/ ctx[3].length;
    			if (dirty & /*output*/ 8) dataview3_changes.constraint = getVisualizationSizeConstraint(/*output*/ ctx[3].length);
    			if (dirty & /*dataRange*/ 16) dataview3_changes.dataRange = /*dataRange*/ ctx[4];
    			if (dirty & /*stride*/ 1) dataview3_changes.stride = /*stride*/ ctx[0];
    			dataview3.$set(dataview3_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dataview0.$$.fragment, local);
    			transition_in(dataview1.$$.fragment, local);
    			transition_in(dataview2.$$.fragment, local);
    			transition_in(dataview3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dataview0.$$.fragment, local);
    			transition_out(dataview1.$$.fragment, local);
    			transition_out(dataview2.$$.fragment, local);
    			transition_out(dataview3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(dataview0);
    			if (detaching) detach_dev(t6);
    			if (detaching) detach_dev(div2);
    			destroy_component(dataview1);
    			destroy_component(dataview2);
    			if (detaching) detach_dev(t9);
    			if (detaching) detach_dev(div4);
    			destroy_component(dataview3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const padding$2 = 0;

    function instance$9($$self, $$props, $$invalidate) {
    	let { stride } = $$props;
    	let { dilation } = $$props;
    	let { kernelLength } = $$props;
    	let { image } = $$props;
    	let { output } = $$props;
    	let { isPaused } = $$props;
    	let { dataRange } = $$props;
    	const dispatch = createEventDispatcher();
    	let padded_input_size = image.length + padding$2 * 2;

    	// Dummy data for original state of component.
    	let testInputMatrixSlice = [];

    	for (let i = 0; i < kernelLength; i++) {
    		testInputMatrixSlice.push([]);

    		for (let j = 0; j < kernelLength; j++) {
    			testInputMatrixSlice[i].push(0);
    		}
    	}

    	testInputMatrixSlice = gridData(testInputMatrixSlice);
    	let testOutputMatrixSlice = gridData([[0]]);
    	let inputHighlights = [];
    	let outputHighlights = array1d(output.length * output.length, i => true);
    	let interval;
    	let counter;

    	// lots of replication between mouseover and start-pool. TODO: fix this.
    	function startMaxPool(stride) {
    		counter = 0;
    		let outputMappings = generateOutputMappings(stride, output, kernelLength, padded_input_size, dilation);
    		if (stride <= 0) return;
    		if (interval) clearInterval(interval);

    		$$invalidate(15, interval = setInterval(
    			() => {
    				if (isPaused) return;
    				const flat_animated = counter % (output.length * output.length);
    				$$invalidate(8, outputHighlights = array1d(output.length * output.length, i => false));
    				const animatedH = Math.floor(flat_animated / output.length);
    				const animatedW = flat_animated % output.length;
    				$$invalidate(8, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    				$$invalidate(7, inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, padded_input_size, kernelLength, outputMappings, kernelLength));
    				const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernelLength);
    				$$invalidate(5, testInputMatrixSlice = gridData(inputMatrixSlice));
    				const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    				$$invalidate(6, testOutputMatrixSlice = gridData(outputMatrixSlice));
    				counter++;
    			},
    			250
    		));
    	}

    	function handleMouseover(event) {
    		let outputMappings = generateOutputMappings(stride, output, kernelLength, padded_input_size, dilation);
    		$$invalidate(8, outputHighlights = array1d(output.length * output.length, i => false));
    		const animatedH = event.detail.hoverH;
    		const animatedW = event.detail.hoverW;
    		$$invalidate(8, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    		$$invalidate(7, inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, padded_input_size, kernelLength, outputMappings, kernelLength));
    		const inputMatrixSlice = getMatrixSliceFromInputHighlights(image, inputHighlights, kernelLength);
    		$$invalidate(5, testInputMatrixSlice = gridData(inputMatrixSlice));
    		const outputMatrixSlice = getMatrixSliceFromOutputHighlights(output, outputHighlights);
    		$$invalidate(6, testOutputMatrixSlice = gridData(outputMatrixSlice));
    		$$invalidate(12, isPaused = true);
    		dispatch("message", { text: isPaused });
    	}

    	startMaxPool(stride);
    	let testImage = gridData(image);
    	let testOutput = gridData(output);

    	const writable_props = [
    		"stride",
    		"dilation",
    		"kernelLength",
    		"image",
    		"output",
    		"isPaused",
    		"dataRange"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<PoolAnimator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("PoolAnimator", $$slots, []);

    	$$self.$set = $$props => {
    		if ("stride" in $$props) $$invalidate(0, stride = $$props.stride);
    		if ("dilation" in $$props) $$invalidate(13, dilation = $$props.dilation);
    		if ("kernelLength" in $$props) $$invalidate(1, kernelLength = $$props.kernelLength);
    		if ("image" in $$props) $$invalidate(2, image = $$props.image);
    		if ("output" in $$props) $$invalidate(3, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(12, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(4, dataRange = $$props.dataRange);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		array1d,
    		getMatrixSliceFromOutputHighlights,
    		compute_input_multiplies_with_weight,
    		getVisualizationSizeConstraint,
    		generateOutputMappings,
    		getMatrixSliceFromInputHighlights,
    		gridData,
    		Dataview,
    		stride,
    		dilation,
    		kernelLength,
    		image,
    		output,
    		isPaused,
    		dataRange,
    		dispatch,
    		padding: padding$2,
    		padded_input_size,
    		testInputMatrixSlice,
    		testOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		interval,
    		counter,
    		startMaxPool,
    		handleMouseover,
    		testImage,
    		testOutput
    	});

    	$$self.$inject_state = $$props => {
    		if ("stride" in $$props) $$invalidate(0, stride = $$props.stride);
    		if ("dilation" in $$props) $$invalidate(13, dilation = $$props.dilation);
    		if ("kernelLength" in $$props) $$invalidate(1, kernelLength = $$props.kernelLength);
    		if ("image" in $$props) $$invalidate(2, image = $$props.image);
    		if ("output" in $$props) $$invalidate(3, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(12, isPaused = $$props.isPaused);
    		if ("dataRange" in $$props) $$invalidate(4, dataRange = $$props.dataRange);
    		if ("padded_input_size" in $$props) padded_input_size = $$props.padded_input_size;
    		if ("testInputMatrixSlice" in $$props) $$invalidate(5, testInputMatrixSlice = $$props.testInputMatrixSlice);
    		if ("testOutputMatrixSlice" in $$props) $$invalidate(6, testOutputMatrixSlice = $$props.testOutputMatrixSlice);
    		if ("inputHighlights" in $$props) $$invalidate(7, inputHighlights = $$props.inputHighlights);
    		if ("outputHighlights" in $$props) $$invalidate(8, outputHighlights = $$props.outputHighlights);
    		if ("interval" in $$props) $$invalidate(15, interval = $$props.interval);
    		if ("counter" in $$props) counter = $$props.counter;
    		if ("testImage" in $$props) $$invalidate(9, testImage = $$props.testImage);
    		if ("testOutput" in $$props) $$invalidate(10, testOutput = $$props.testOutput);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*image*/ 4) {
    			 padded_input_size = image.length + padding$2 * 2;
    		}

    		if ($$self.$$.dirty & /*output*/ 8) {
    			 {
    				let outputHighlights = array1d(output.length * output.length, i => true);
    			}
    		}

    		if ($$self.$$.dirty & /*stride, image, output*/ 13) {
    			 {
    				startMaxPool(stride);
    				$$invalidate(9, testImage = gridData(image));
    				$$invalidate(10, testOutput = gridData(output));
    			}
    		}
    	};

    	return [
    		stride,
    		kernelLength,
    		image,
    		output,
    		dataRange,
    		testInputMatrixSlice,
    		testOutputMatrixSlice,
    		inputHighlights,
    		outputHighlights,
    		testImage,
    		testOutput,
    		handleMouseover,
    		isPaused,
    		dilation
    	];
    }

    class PoolAnimator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			stride: 0,
    			dilation: 13,
    			kernelLength: 1,
    			image: 2,
    			output: 3,
    			isPaused: 12,
    			dataRange: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PoolAnimator",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*stride*/ ctx[0] === undefined && !("stride" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'stride'");
    		}

    		if (/*dilation*/ ctx[13] === undefined && !("dilation" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'dilation'");
    		}

    		if (/*kernelLength*/ ctx[1] === undefined && !("kernelLength" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'kernelLength'");
    		}

    		if (/*image*/ ctx[2] === undefined && !("image" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'image'");
    		}

    		if (/*output*/ ctx[3] === undefined && !("output" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'output'");
    		}

    		if (/*isPaused*/ ctx[12] === undefined && !("isPaused" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'isPaused'");
    		}

    		if (/*dataRange*/ ctx[4] === undefined && !("dataRange" in props)) {
    			console.warn("<PoolAnimator> was created without expected prop 'dataRange'");
    		}
    	}

    	get stride() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stride(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dilation() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dilation(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernelLength() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernelLength(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get output() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set output(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPaused() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPaused(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<PoolAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<PoolAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\Poolview.svelte generated by Svelte v3.23.1 */

    const { console: console_1$2 } = globals;
    const file$9 = "src\\detail-view\\Poolview.svelte";

    // (139:0) {#if !isExited}
    function create_if_block$3(ctx) {
    	let div10;
    	let div9;
    	let div5;
    	let div0;
    	let t1;
    	let div4;
    	let div1;
    	let i0;
    	let t2;
    	let div2;

    	let raw_value = (/*isPaused*/ ctx[4]
    	? "<i class=\"fas fa-play-circle play-icon\"></i>"
    	: "<i class=\"fas fa-pause-circle\"></i>") + "";

    	let t3;
    	let div3;
    	let i1;
    	let t4;
    	let div6;
    	let t5;
    	let div8;
    	let img;
    	let img_src_value;
    	let t6;
    	let div7;
    	let span;
    	let t8;
    	let current;
    	let mounted;
    	let dispose;

    	const poolanimator = new PoolAnimator({
    			props: {
    				kernelLength: /*kernelLength*/ ctx[1],
    				image: /*input*/ ctx[0],
    				output: /*outputFinal*/ ctx[5],
    				stride: /*stride*/ ctx[6],
    				dilation: dilation$1,
    				isPaused: /*isPaused*/ ctx[4],
    				dataRange: /*dataRange*/ ctx[2]
    			},
    			$$inline: true
    		});

    	poolanimator.$on("message", /*handlePauseFromInteraction*/ ctx[8]);

    	const block = {
    		c: function create() {
    			div10 = element("div");
    			div9 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			div0.textContent = "Max Pooling";
    			t1 = space();
    			div4 = element("div");
    			div1 = element("div");
    			i0 = element("i");
    			t2 = space();
    			div2 = element("div");
    			t3 = space();
    			div3 = element("div");
    			i1 = element("i");
    			t4 = space();
    			div6 = element("div");
    			create_component(poolanimator.$$.fragment);
    			t5 = space();
    			div8 = element("div");
    			img = element("img");
    			t6 = space();
    			div7 = element("div");
    			span = element("span");
    			span.textContent = "Hover over";
    			t8 = text(" the matrices to change kernel position.");
    			attr_dev(div0, "class", "title-text svelte-kahisg");
    			add_location(div0, file$9, 160, 8, 3757);
    			attr_dev(i0, "class", "fas fa-info-circle");
    			add_location(i0, file$9, 167, 12, 3965);
    			attr_dev(div1, "class", "control-button svelte-kahisg");
    			attr_dev(div1, "title", "Jump to article section");
    			add_location(div1, file$9, 166, 10, 3867);
    			attr_dev(div2, "class", "play-button control-button svelte-kahisg");
    			attr_dev(div2, "title", "Play animation");
    			add_location(div2, file$9, 170, 10, 4031);
    			attr_dev(i1, "class", "fas control-icon fa-times-circle");
    			add_location(i1, file$9, 177, 12, 4397);
    			attr_dev(div3, "class", "delete-button control-button svelte-kahisg");
    			attr_dev(div3, "title", "Close");
    			add_location(div3, file$9, 176, 10, 4303);
    			attr_dev(div4, "class", "buttons svelte-kahisg");
    			add_location(div4, file$9, 164, 8, 3832);
    			attr_dev(div5, "class", "control-pannel svelte-kahisg");
    			add_location(div5, file$9, 158, 6, 3711);
    			attr_dev(div6, "class", "container is-centered is-vcentered svelte-kahisg");
    			add_location(div6, file$9, 183, 6, 4505);
    			if (img.src !== (img_src_value = "/assets/img/pointer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pointer icon");
    			attr_dev(img, "class", "svelte-kahisg");
    			add_location(img, file$9, 191, 8, 4853);
    			set_style(span, "font-weight", "600");
    			add_location(span, file$9, 193, 12, 4972);
    			attr_dev(div7, "class", "annotation-text");
    			add_location(div7, file$9, 192, 10, 4929);
    			attr_dev(div8, "class", "annotation svelte-kahisg");
    			add_location(div8, file$9, 190, 6, 4819);
    			attr_dev(div9, "class", "box svelte-kahisg");
    			add_location(div9, file$9, 156, 4, 3684);
    			attr_dev(div10, "class", "container svelte-kahisg");
    			add_location(div10, file$9, 139, 2, 3110);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div10, anchor);
    			append_dev(div10, div9);
    			append_dev(div9, div5);
    			append_dev(div5, div0);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, i0);
    			append_dev(div4, t2);
    			append_dev(div4, div2);
    			div2.innerHTML = raw_value;
    			append_dev(div4, t3);
    			append_dev(div4, div3);
    			append_dev(div3, i1);
    			append_dev(div9, t4);
    			append_dev(div9, div6);
    			mount_component(poolanimator, div6, null);
    			append_dev(div9, t5);
    			append_dev(div9, div8);
    			append_dev(div8, img);
    			append_dev(div8, t6);
    			append_dev(div8, div7);
    			append_dev(div7, span);
    			append_dev(div7, t8);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "click", handleScroll$2, false, false, false),
    					listen_dev(div2, "click", /*handleClickPause*/ ctx[7], false, false, false),
    					listen_dev(div3, "click", /*handleClickX*/ ctx[9], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*isPaused*/ 16) && raw_value !== (raw_value = (/*isPaused*/ ctx[4]
    			? "<i class=\"fas fa-play-circle play-icon\"></i>"
    			: "<i class=\"fas fa-pause-circle\"></i>") + "")) div2.innerHTML = raw_value;
    			const poolanimator_changes = {};
    			if (dirty & /*kernelLength*/ 2) poolanimator_changes.kernelLength = /*kernelLength*/ ctx[1];
    			if (dirty & /*input*/ 1) poolanimator_changes.image = /*input*/ ctx[0];
    			if (dirty & /*outputFinal*/ 32) poolanimator_changes.output = /*outputFinal*/ ctx[5];
    			if (dirty & /*isPaused*/ 16) poolanimator_changes.isPaused = /*isPaused*/ ctx[4];
    			if (dirty & /*dataRange*/ 4) poolanimator_changes.dataRange = /*dataRange*/ ctx[2];
    			poolanimator.$set(poolanimator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(poolanimator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(poolanimator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div10);
    			destroy_component(poolanimator);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(139:0) {#if !isExited}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = !/*isExited*/ ctx[3] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (!/*isExited*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isExited*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dilation$1 = 1;

    function handleScroll$2() {
    	let svgHeight = Number(d3.select("#cnn-svg").style("height").replace("px", "")) + 150;
    	let scroll = new SmoothScroll("a[href*=\"#\"]", { offset: -svgHeight });
    	let anchor = document.querySelector(`#article-pooling`);
    	scroll.animateScroll(anchor);
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { input } = $$props;
    	let { kernelLength } = $$props;
    	let { dataRange } = $$props;
    	let { isExited } = $$props;
    	const dispatch = createEventDispatcher();

    	// let isExited = false;
    	let stride = 2;

    	var isPaused = false;
    	var outputFinal = singleMaxPooling(input);

    	function handleClickPause() {
    		$$invalidate(4, isPaused = !isPaused);
    		console.log(isPaused);
    	}

    	function handlePauseFromInteraction(event) {
    		$$invalidate(4, isPaused = event.detail.text);
    	}

    	function handleClickX() {
    		dispatch("message", { text: true });
    	}

    	const writable_props = ["input", "kernelLength", "dataRange", "isExited"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$2.warn(`<Poolview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Poolview", $$slots, []);

    	$$self.$set = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("kernelLength" in $$props) $$invalidate(1, kernelLength = $$props.kernelLength);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    		if ("isExited" in $$props) $$invalidate(3, isExited = $$props.isExited);
    	};

    	$$self.$capture_state = () => ({
    		PoolAnimator,
    		singleMaxPooling,
    		createEventDispatcher,
    		input,
    		kernelLength,
    		dataRange,
    		isExited,
    		dispatch,
    		stride,
    		dilation: dilation$1,
    		isPaused,
    		outputFinal,
    		handleClickPause,
    		handlePauseFromInteraction,
    		handleClickX,
    		handleScroll: handleScroll$2
    	});

    	$$self.$inject_state = $$props => {
    		if ("input" in $$props) $$invalidate(0, input = $$props.input);
    		if ("kernelLength" in $$props) $$invalidate(1, kernelLength = $$props.kernelLength);
    		if ("dataRange" in $$props) $$invalidate(2, dataRange = $$props.dataRange);
    		if ("isExited" in $$props) $$invalidate(3, isExited = $$props.isExited);
    		if ("stride" in $$props) $$invalidate(6, stride = $$props.stride);
    		if ("isPaused" in $$props) $$invalidate(4, isPaused = $$props.isPaused);
    		if ("outputFinal" in $$props) $$invalidate(5, outputFinal = $$props.outputFinal);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*input*/ 1) {
    			// let dragging = false;
    			// let dragInfo = {x1: 0, x2: 0, y1: 0, y2: 0};
    			// let detailView = d3.select('#detailview').node();
    			 if (stride > 0) {
    				try {
    					$$invalidate(5, outputFinal = singleMaxPooling(input));
    				} catch {
    					console.log("Cannot handle stride of " + stride);
    				}
    			}
    		}
    	};

    	return [
    		input,
    		kernelLength,
    		dataRange,
    		isExited,
    		isPaused,
    		outputFinal,
    		stride,
    		handleClickPause,
    		handlePauseFromInteraction,
    		handleClickX
    	];
    }

    class Poolview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			input: 0,
    			kernelLength: 1,
    			dataRange: 2,
    			isExited: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Poolview",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*input*/ ctx[0] === undefined && !("input" in props)) {
    			console_1$2.warn("<Poolview> was created without expected prop 'input'");
    		}

    		if (/*kernelLength*/ ctx[1] === undefined && !("kernelLength" in props)) {
    			console_1$2.warn("<Poolview> was created without expected prop 'kernelLength'");
    		}

    		if (/*dataRange*/ ctx[2] === undefined && !("dataRange" in props)) {
    			console_1$2.warn("<Poolview> was created without expected prop 'dataRange'");
    		}

    		if (/*isExited*/ ctx[3] === undefined && !("isExited" in props)) {
    			console_1$2.warn("<Poolview> was created without expected prop 'isExited'");
    		}
    	}

    	get input() {
    		throw new Error("<Poolview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set input(value) {
    		throw new Error("<Poolview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernelLength() {
    		throw new Error("<Poolview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernelLength(value) {
    		throw new Error("<Poolview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dataRange() {
    		throw new Error("<Poolview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dataRange(value) {
    		throw new Error("<Poolview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isExited() {
    		throw new Error("<Poolview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isExited(value) {
    		throw new Error("<Poolview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\Softmaxview.svelte generated by Svelte v3.23.1 */
    const file$a = "src\\detail-view\\Softmaxview.svelte";

    function create_fragment$b(ctx) {
    	let div7;
    	let div6;
    	let div2;
    	let div0;
    	let i0;
    	let t0;
    	let div1;
    	let i1;
    	let t1;
    	let div3;
    	let t2;
    	let i2;
    	let t3;
    	let t4;
    	let t5;
    	let t6;
    	let svg_1;
    	let t7;
    	let div5;
    	let img;
    	let img_src_value;
    	let t8;
    	let div4;
    	let span;
    	let t10;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			i0 = element("i");
    			t0 = space();
    			div1 = element("div");
    			i1 = element("i");
    			t1 = space();
    			div3 = element("div");
    			t2 = text("Softmax Score for ");
    			i2 = element("i");
    			t3 = text("\"");
    			t4 = text(/*outputName*/ ctx[0]);
    			t5 = text("\"");
    			t6 = space();
    			svg_1 = svg_element("svg");
    			t7 = space();
    			div5 = element("div");
    			img = element("img");
    			t8 = space();
    			div4 = element("div");
    			span = element("span");
    			span.textContent = "Hover over";
    			t10 = text(" the numbers to highlight logit circles.");
    			attr_dev(i0, "class", "fas fa-info-circle");
    			add_location(i0, file$a, 261, 8, 7124);
    			attr_dev(div0, "class", "control-button svelte-1uac4ng");
    			attr_dev(div0, "title", "Jump to article section");
    			add_location(div0, file$a, 260, 6, 7030);
    			attr_dev(i1, "class", "fas control-icon fa-times-circle");
    			add_location(i1, file$a, 265, 8, 7272);
    			attr_dev(div1, "class", "delete-button control-button svelte-1uac4ng");
    			attr_dev(div1, "title", "Close");
    			add_location(div1, file$a, 264, 6, 7182);
    			attr_dev(div2, "class", "buttons svelte-1uac4ng");
    			add_location(div2, file$a, 259, 4, 7001);
    			add_location(i2, file$a, 270, 24, 7404);
    			attr_dev(div3, "class", "title-text svelte-1uac4ng");
    			add_location(div3, file$a, 269, 4, 7354);
    			attr_dev(svg_1, "id", "softmax-svg");
    			attr_dev(svg_1, "width", "470");
    			attr_dev(svg_1, "height", "105");
    			attr_dev(svg_1, "class", "svelte-1uac4ng");
    			add_location(svg_1, file$a, 273, 4, 7445);
    			if (img.src !== (img_src_value = "/assets/img/pointer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pointer icon");
    			attr_dev(img, "class", "svelte-1uac4ng");
    			add_location(img, file$a, 276, 6, 7533);
    			set_style(span, "font-weight", "600");
    			add_location(span, file$a, 278, 8, 7644);
    			attr_dev(div4, "class", "annotation-text");
    			add_location(div4, file$a, 277, 6, 7605);
    			attr_dev(div5, "class", "annotation svelte-1uac4ng");
    			add_location(div5, file$a, 275, 4, 7501);
    			attr_dev(div6, "class", "box svelte-1uac4ng");
    			add_location(div6, file$a, 257, 2, 6976);
    			attr_dev(div7, "class", "container");
    			add_location(div7, file$a, 256, 0, 6916);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div6);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, i0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, i1);
    			append_dev(div6, t1);
    			append_dev(div6, div3);
    			append_dev(div3, t2);
    			append_dev(div3, i2);
    			append_dev(i2, t3);
    			append_dev(i2, t4);
    			append_dev(i2, t5);
    			append_dev(div6, t6);
    			append_dev(div6, svg_1);
    			append_dev(div6, t7);
    			append_dev(div6, div5);
    			append_dev(div5, img);
    			append_dev(div5, t8);
    			append_dev(div5, div4);
    			append_dev(div4, span);
    			append_dev(div4, t10);
    			/*div7_binding*/ ctx[9](div7);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", handleScroll$3, false, false, false),
    					listen_dev(div1, "click", /*handleClickX*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*outputName*/ 1) set_data_dev(t4, /*outputName*/ ctx[0]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			/*div7_binding*/ ctx[9](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function handleScroll$3() {
    	let svgHeight = Number(d3.select("#cnn-svg").style("height").replace("px", "")) + 150;
    	let scroll = new SmoothScroll("a[href*=\"#\"]", { offset: -svgHeight });
    	let anchor = document.querySelector(`#article-softmax`);
    	scroll.animateScroll(anchor);
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { logits } = $$props;
    	let { logitColors } = $$props;
    	let { selectedI } = $$props;
    	let { highlightI = -1 } = $$props;
    	let { outputName } = $$props;
    	let { outputValue } = $$props;
    	let { startAnimation } = $$props;
    	let softmaxViewComponent;
    	let svg = null;
    	const dispatch = createEventDispatcher();

    	const formater = (n, d) => {
    		if (d === undefined) {
    			return d3.format(".2f")(n);
    		} else {
    			return d3.format(`.${d}f`)(n);
    		}
    	};

    	const mouseOverHandler = (d, i, g, curI) => {
    		$$invalidate(3, highlightI = curI);
    		dispatch("mouseOver", { curI });
    	};

    	const mouseLeaveHandler = (d, i, g, curI) => {
    		$$invalidate(3, highlightI = -1);
    		dispatch("mouseLeave", { curI });
    	};

    	const handleClickX = () => {
    		dispatch("xClicked", {});
    	};

    	onMount(() => {
    		$$invalidate(10, svg = d3.select(softmaxViewComponent).select("#softmax-svg"));
    		let formulaRightGroup = svg.append("g").attr("class", "formula-right").attr("transform", `translate(${10}, ${0})`).style("font-size", "15px");

    		// Denominator
    		let denominatorGroup = formulaRightGroup.append("g").attr("class", "denominator").attr("transform", `translate(${0}, ${58})`);

    		// Add the left (
    		denominatorGroup.append("text").attr("x", 0).attr("y", 0).style("fill", "gray").text("(");

    		// Need to loop through the logits array instead of data-binding because
    		// we want dynamic positioning based on prior '-' occurance
    		let curX = 8;

    		let numOfRows = 4;

    		logits.forEach((d, i) => {
    			if (i / numOfRows >= 1 && i % numOfRows === 0) {
    				curX = 8;
    			}

    			let curText = denominatorGroup.append("text").attr("x", curX).attr("y", Math.floor(i / numOfRows) * 20).style("cursor", "crosshair").style("pointer-events", "all").on("mouseover", (d, n, g) => mouseOverHandler(d, n, g, i)).on("mouseleave", (d, n, g) => mouseLeaveHandler(d, n, g, i)).text(`exp(`);
    			curText.append("tspan").attr("class", `formula-term-${i} formula-term`).attr("dx", "1").style("fill", logitColors[i]).style("fill-opacity", i === selectedI || startAnimation.hasInitialized ? 1 : 0).text(formater(d));
    			curText.append("tspan").attr("dx", "1").text(")");
    			let curBBox = curText.node().getBBox();
    			curX += curBBox.width + 4;

    			if (i !== logits.length - 1) {
    				denominatorGroup.append("text").attr("x", curX).attr("y", Math.floor(i / numOfRows) * 20).text("+");
    				curX += 14;
    			} else {
    				denominatorGroup.append("text").attr("x", curX - 2).attr("y", Math.floor(i / numOfRows) * 20).style("fill", "gray").text(")");
    			}
    		});

    		denominatorGroup.selectAll("text").data(logits).enter().append("text").attr("x", (d, i) => 40 * i).attr("y", 0).text(d => formater(d));

    		// Calculate the dynamic denominator group width
    		let denominatorGroupBBox = denominatorGroup.node().getBBox();

    		// Draw the fraction line
    		formulaRightGroup.append("line").attr("class", "separation-line").attr("x1", -5).attr("x2", denominatorGroupBBox.width + 5).attr("y1", 32).attr("y2", 32).style("stroke-width", 1.2).style("stroke", "gray");

    		// Draw the numerator
    		let numeratorGroup = formulaRightGroup.append("g").attr("class", "numerator-group").attr("transform", `translate(${0}, ${20})`);

    		let numeratorText = numeratorGroup.append("text").attr("x", denominatorGroupBBox.x + denominatorGroupBBox.width / 2).attr("y", 0).on("mouseover", (d, n, g) => mouseOverHandler(d, n, g, selectedI)).on("mouseleave", (d, n, g) => mouseLeaveHandler(d, n, g, selectedI)).style("pointer-events", "all").style("cursor", "crosshair").style("text-anchor", "middle").text("exp(");
    		numeratorText.append("tspan").attr("class", `formula-term-${selectedI} formula-term`).attr("dx", 1).style("fill", logitColors[selectedI]).text(`${formater(logits[selectedI])}`);
    		numeratorText.append("tspan").attr("dx", 1).text(")");

    		// Draw the left part of the formula
    		let formulaLeftGroup = svg.append("g").attr("class", "formula-left").attr("transform", `translate(${395}, ${32})`);

    		let softmaxText = formulaLeftGroup.append("text").attr("x", 20).attr("dominant-baseline", "middle").text(`${formater(outputValue, 4)}`);
    		let softmaxTextBBox = softmaxText.node().getBBox();
    		formulaLeftGroup.append("text").attr("dominant-baseline", "middle").attr("x", 0).attr("y", 0).style("fill", "gray").style("font-weight", "bold").text("=");
    	});

    	const writable_props = [
    		"logits",
    		"logitColors",
    		"selectedI",
    		"highlightI",
    		"outputName",
    		"outputValue",
    		"startAnimation"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Softmaxview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Softmaxview", $$slots, []);

    	function div7_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			softmaxViewComponent = $$value;
    			$$invalidate(1, softmaxViewComponent);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("logits" in $$props) $$invalidate(4, logits = $$props.logits);
    		if ("logitColors" in $$props) $$invalidate(5, logitColors = $$props.logitColors);
    		if ("selectedI" in $$props) $$invalidate(6, selectedI = $$props.selectedI);
    		if ("highlightI" in $$props) $$invalidate(3, highlightI = $$props.highlightI);
    		if ("outputName" in $$props) $$invalidate(0, outputName = $$props.outputName);
    		if ("outputValue" in $$props) $$invalidate(7, outputValue = $$props.outputValue);
    		if ("startAnimation" in $$props) $$invalidate(8, startAnimation = $$props.startAnimation);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		afterUpdate,
    		createEventDispatcher,
    		logits,
    		logitColors,
    		selectedI,
    		highlightI,
    		outputName,
    		outputValue,
    		startAnimation,
    		softmaxViewComponent,
    		svg,
    		dispatch,
    		formater,
    		mouseOverHandler,
    		mouseLeaveHandler,
    		handleClickX,
    		handleScroll: handleScroll$3
    	});

    	$$self.$inject_state = $$props => {
    		if ("logits" in $$props) $$invalidate(4, logits = $$props.logits);
    		if ("logitColors" in $$props) $$invalidate(5, logitColors = $$props.logitColors);
    		if ("selectedI" in $$props) $$invalidate(6, selectedI = $$props.selectedI);
    		if ("highlightI" in $$props) $$invalidate(3, highlightI = $$props.highlightI);
    		if ("outputName" in $$props) $$invalidate(0, outputName = $$props.outputName);
    		if ("outputValue" in $$props) $$invalidate(7, outputValue = $$props.outputValue);
    		if ("startAnimation" in $$props) $$invalidate(8, startAnimation = $$props.startAnimation);
    		if ("softmaxViewComponent" in $$props) $$invalidate(1, softmaxViewComponent = $$props.softmaxViewComponent);
    		if ("svg" in $$props) $$invalidate(10, svg = $$props.svg);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*highlightI, svg*/ 1032) {
    			 ((() => {
    				if (svg !== null) {
    					svg.selectAll(`.formula-term`).style("text-decoration", "none").style("font-weight", "normal");
    					svg.selectAll(`.formula-term-${highlightI}`).style("font-weight", "bold").style("text-decoration", "underline");
    				}
    			})());
    		}

    		if ($$self.$$.dirty & /*startAnimation, svg*/ 1280) {
    			 ((() => {
    				if (svg !== null) {
    					svg.select(`.formula-term-${startAnimation.i}`).transition("softmax-edge").duration(startAnimation.duration).style("fill-opacity", 1);
    				}
    			})());
    		}
    	};

    	return [
    		outputName,
    		softmaxViewComponent,
    		handleClickX,
    		highlightI,
    		logits,
    		logitColors,
    		selectedI,
    		outputValue,
    		startAnimation,
    		div7_binding
    	];
    }

    class Softmaxview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			logits: 4,
    			logitColors: 5,
    			selectedI: 6,
    			highlightI: 3,
    			outputName: 0,
    			outputValue: 7,
    			startAnimation: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Softmaxview",
    			options,
    			id: create_fragment$b.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*logits*/ ctx[4] === undefined && !("logits" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'logits'");
    		}

    		if (/*logitColors*/ ctx[5] === undefined && !("logitColors" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'logitColors'");
    		}

    		if (/*selectedI*/ ctx[6] === undefined && !("selectedI" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'selectedI'");
    		}

    		if (/*outputName*/ ctx[0] === undefined && !("outputName" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'outputName'");
    		}

    		if (/*outputValue*/ ctx[7] === undefined && !("outputValue" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'outputValue'");
    		}

    		if (/*startAnimation*/ ctx[8] === undefined && !("startAnimation" in props)) {
    			console.warn("<Softmaxview> was created without expected prop 'startAnimation'");
    		}
    	}

    	get logits() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logits(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get logitColors() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set logitColors(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get selectedI() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set selectedI(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlightI() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlightI(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outputName() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outputName(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outputValue() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outputValue(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get startAnimation() {
    		throw new Error("<Softmaxview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set startAnimation(value) {
    		throw new Error("<Softmaxview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\overview\Modal.svelte generated by Svelte v3.23.1 */
    const file$b = "src\\overview\\Modal.svelte";

    function create_fragment$c(ctx) {
    	let div9;
    	let div8;
    	let div0;
    	let t0;
    	let div7;
    	let header;
    	let p;
    	let t2;
    	let button0;
    	let t3;
    	let section;
    	let div4;
    	let div1;
    	let input0;
    	let t4;
    	let span0;
    	let i0;
    	let t5;
    	let div2;
    	let t7;
    	let div3;
    	let label;
    	let input1;
    	let t8;
    	let span3;
    	let span1;
    	let i1;
    	let t9;
    	let span2;
    	let t11;
    	let footer;
    	let div5;
    	let t12_value = /*errorInfo*/ ctx[5].error + "";
    	let t12;
    	let t13;
    	let div6;
    	let button1;
    	let t15;
    	let button2;
    	let t17;
    	let img;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div9 = element("div");
    			div8 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div7 = element("div");
    			header = element("header");
    			p = element("p");
    			p.textContent = "Add Input Image";
    			t2 = space();
    			button0 = element("button");
    			t3 = space();
    			section = element("section");
    			div4 = element("div");
    			div1 = element("div");
    			input0 = element("input");
    			t4 = space();
    			span0 = element("span");
    			i0 = element("i");
    			t5 = space();
    			div2 = element("div");
    			div2.textContent = "or";
    			t7 = space();
    			div3 = element("div");
    			label = element("label");
    			input1 = element("input");
    			t8 = space();
    			span3 = element("span");
    			span1 = element("span");
    			i1 = element("i");
    			t9 = space();
    			span2 = element("span");
    			span2.textContent = "Upload";
    			t11 = space();
    			footer = element("footer");
    			div5 = element("div");
    			t12 = text(t12_value);
    			t13 = space();
    			div6 = element("div");
    			button1 = element("button");
    			button1.textContent = "Cancel";
    			t15 = space();
    			button2 = element("button");
    			button2.textContent = "Add";
    			t17 = space();
    			img = element("img");
    			attr_dev(div0, "class", "modal-background");
    			add_location(div0, file$b, 151, 4, 3439);
    			attr_dev(p, "class", "modal-card-title svelte-1o5lxfe");
    			add_location(p, file$b, 155, 8, 3581);
    			attr_dev(button0, "class", "delete");
    			attr_dev(button0, "aria-label", "close");
    			add_location(button0, file$b, 156, 8, 3638);
    			attr_dev(header, "class", "modal-card-head svelte-1o5lxfe");
    			add_location(header, file$b, 154, 6, 3539);
    			attr_dev(input0, "class", "input small-font svelte-1o5lxfe");
    			attr_dev(input0, "type", "url");
    			attr_dev(input0, "placeholder", "Paste URL of image...");
    			add_location(input0, file$b, 164, 12, 3910);
    			attr_dev(i0, "class", "fas fa-link");
    			add_location(i0, file$b, 169, 14, 4113);
    			attr_dev(span0, "class", "icon small-font is-left svelte-1o5lxfe");
    			add_location(span0, file$b, 168, 12, 4059);
    			attr_dev(div1, "class", "control has-icons-left svelte-1o5lxfe");
    			toggle_class(div1, "is-loading", /*showLoading*/ ctx[3]);
    			add_location(div1, file$b, 161, 10, 3814);
    			attr_dev(div2, "class", "or-label svelte-1o5lxfe");
    			add_location(div2, file$b, 174, 10, 4195);
    			attr_dev(input1, "class", "file-input");
    			attr_dev(input1, "type", "file");
    			attr_dev(input1, "name", "image");
    			attr_dev(input1, "accept", ".png,.jpeg,.tiff,.jpg,.png");
    			add_location(input1, file$b, 178, 14, 4313);
    			attr_dev(i1, "class", "fas fa-upload");
    			add_location(i1, file$b, 184, 18, 4606);
    			attr_dev(span1, "class", "file-icon");
    			add_location(span1, file$b, 183, 16, 4562);
    			attr_dev(span2, "class", "file-label");
    			add_location(span2, file$b, 186, 16, 4678);
    			attr_dev(span3, "class", "file-cta small-font svelte-1o5lxfe");
    			add_location(span3, file$b, 182, 14, 4510);
    			attr_dev(label, "class", "file-label");
    			add_location(label, file$b, 177, 12, 4271);
    			attr_dev(div3, "class", "file");
    			add_location(div3, file$b, 176, 10, 4239);
    			attr_dev(div4, "class", "field svelte-1o5lxfe");
    			add_location(div4, file$b, 160, 8, 3783);
    			attr_dev(section, "class", "modal-card-body");
    			add_location(section, file$b, 159, 6, 3740);
    			attr_dev(div5, "class", "error-message svelte-1o5lxfe");
    			toggle_class(div5, "hidden", !/*errorInfo*/ ctx[5].show);
    			add_location(div5, file$b, 199, 8, 4909);
    			attr_dev(button1, "class", "button is-smaller svelte-1o5lxfe");
    			add_location(button1, file$b, 205, 10, 5077);
    			attr_dev(button2, "class", "button is-success is-smaller svelte-1o5lxfe");
    			add_location(button2, file$b, 210, 10, 5203);
    			attr_dev(div6, "class", "button-container");
    			add_location(div6, file$b, 204, 8, 5035);
    			attr_dev(footer, "class", "modal-card-foot svelte-1o5lxfe");
    			add_location(footer, file$b, 197, 6, 4865);
    			attr_dev(div7, "class", "modal-card svelte-1o5lxfe");
    			add_location(div7, file$b, 153, 4, 3507);
    			attr_dev(div8, "class", "modal");
    			attr_dev(div8, "id", "input-modal");
    			toggle_class(div8, "is-active", /*modalInfo*/ ctx[6].show);
    			add_location(div8, file$b, 147, 2, 3352);
    			set_style(img, "display", "none");
    			attr_dev(img, "id", "vali-image");
    			attr_dev(img, "alt", "hidden image");
    			add_location(img, file$b, 223, 2, 5459);
    			attr_dev(div9, "class", "modal-component");
    			add_location(div9, file$b, 144, 0, 3287);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div9, anchor);
    			append_dev(div9, div8);
    			append_dev(div8, div0);
    			append_dev(div8, t0);
    			append_dev(div8, div7);
    			append_dev(div7, header);
    			append_dev(header, p);
    			append_dev(header, t2);
    			append_dev(header, button0);
    			append_dev(div7, t3);
    			append_dev(div7, section);
    			append_dev(section, div4);
    			append_dev(div4, div1);
    			append_dev(div1, input0);
    			set_input_value(input0, /*inputValue*/ ctx[2]);
    			append_dev(div1, t4);
    			append_dev(div1, span0);
    			append_dev(span0, i0);
    			append_dev(div4, t5);
    			append_dev(div4, div2);
    			append_dev(div4, t7);
    			append_dev(div4, div3);
    			append_dev(div3, label);
    			append_dev(label, input1);
    			append_dev(label, t8);
    			append_dev(label, span3);
    			append_dev(span3, span1);
    			append_dev(span1, i1);
    			append_dev(span3, t9);
    			append_dev(span3, span2);
    			append_dev(div7, t11);
    			append_dev(div7, footer);
    			append_dev(footer, div5);
    			append_dev(div5, t12);
    			append_dev(footer, t13);
    			append_dev(footer, div6);
    			append_dev(div6, button1);
    			append_dev(div6, t15);
    			append_dev(div6, button2);
    			append_dev(div9, t17);
    			append_dev(div9, img);
    			/*img_binding*/ ctx[14](img);
    			/*div9_binding*/ ctx[15](div9);

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*crossClicked*/ ctx[10], false, false, false),
    					listen_dev(button0, "click", /*crossClicked*/ ctx[10], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(input1, "change", /*imageUpload*/ ctx[9], false, false, false),
    					listen_dev(input1, "change", /*input1_change_handler*/ ctx[13]),
    					listen_dev(button1, "click", /*crossClicked*/ ctx[10], false, false, false),
    					listen_dev(button2, "click", /*addClicked*/ ctx[11], false, false, false),
    					listen_dev(img, "error", /*errorCallback*/ ctx[7], false, false, false),
    					listen_dev(img, "load", /*loadCallback*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*inputValue*/ 4) {
    				set_input_value(input0, /*inputValue*/ ctx[2]);
    			}

    			if (dirty & /*showLoading*/ 8) {
    				toggle_class(div1, "is-loading", /*showLoading*/ ctx[3]);
    			}

    			if (dirty & /*errorInfo*/ 32 && t12_value !== (t12_value = /*errorInfo*/ ctx[5].error + "")) set_data_dev(t12, t12_value);

    			if (dirty & /*errorInfo*/ 32) {
    				toggle_class(div5, "hidden", !/*errorInfo*/ ctx[5].show);
    			}

    			if (dirty & /*modalInfo*/ 64) {
    				toggle_class(div8, "is-active", /*modalInfo*/ ctx[6].show);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div9);
    			/*img_binding*/ ctx[14](null);
    			/*div9_binding*/ ctx[15](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let modalComponent;
    	let valiImg;
    	let inputValue = "";
    	let showLoading = false;
    	let files;
    	let usingURL = true;
    	let errorInfo = { show: false, error: "" };
    	const dispatch = createEventDispatcher();
    	let modalInfo = { show: false };
    	modalStore.set(modalInfo);

    	modalStore.subscribe(value => {
    		$$invalidate(6, modalInfo = value);
    	});

    	const errorCallback = () => {
    		// The URL is invalid, show an error message on the UI
    		$$invalidate(3, showLoading = false);

    		$$invalidate(5, errorInfo.show = true, errorInfo);

    		$$invalidate(
    			5,
    			errorInfo.error = usingURL
    			? "We can't find the image at that URL."
    			: "Not a valid image file.",
    			errorInfo
    		);
    	};

    	const loadCallback = () => {
    		// The URL is valid, but we are not sure if loading it to canvas would be
    		// blocked by crossOrigin setting. Try it here before dispatch to parent.
    		// https://stackoverflow.com/questions/13674835/canvas-tainted-by-cross-origin-data
    		let canvas = document.createElement("canvas");

    		let context = canvas.getContext("2d");
    		canvas.width = valiImg.width;
    		canvas.height = valiImg.height;
    		context.drawImage(valiImg, 0, 0);

    		try {
    			context.getImageData(0, 0, valiImg.width, valiImg.height);

    			// If the foreign image does support CORS -> use this image
    			// dispatch to parent component to use the input image
    			$$invalidate(3, showLoading = false);

    			$$invalidate(6, modalInfo.show = false, modalInfo);
    			modalStore.set(modalInfo);
    			dispatch("urlTyped", { url: valiImg.src });
    			$$invalidate(2, inputValue = null);
    		} catch(err) {
    			// If the foreign image does not support CORS -> use this image
    			$$invalidate(3, showLoading = false);

    			$$invalidate(5, errorInfo.show = true, errorInfo);
    			$$invalidate(5, errorInfo.error = "No permission to load this image.", errorInfo);
    		}
    	};

    	const imageUpload = () => {
    		usingURL = false;
    		let reader = new FileReader();

    		reader.onload = event => {
    			$$invalidate(1, valiImg.src = event.target.result, valiImg);
    		};

    		reader.readAsDataURL(files[0]);
    	};

    	const crossClicked = () => {
    		$$invalidate(6, modalInfo.show = false, modalInfo);
    		modalStore.set(modalInfo);

    		// Dispatch the parent component
    		dispatch("xClicked", { preImage: modalInfo.preImage });
    	};

    	const addClicked = () => {
    		// Validate the input URL
    		$$invalidate(3, showLoading = true);

    		$$invalidate(5, errorInfo.show = false, errorInfo);
    		$$invalidate(1, valiImg.crossOrigin = "Anonymous", valiImg);
    		$$invalidate(1, valiImg.src = inputValue, valiImg);
    	};

    	onMount(() => {
    		let modal = d3.select(modalComponent).select("#input-modal");
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Modal", $$slots, []);

    	function input0_input_handler() {
    		inputValue = this.value;
    		$$invalidate(2, inputValue);
    	}

    	function input1_change_handler() {
    		files = this.files;
    		$$invalidate(4, files);
    	}

    	function img_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			valiImg = $$value;
    			$$invalidate(1, valiImg);
    		});
    	}

    	function div9_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			modalComponent = $$value;
    			$$invalidate(0, modalComponent);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		createEventDispatcher,
    		modalStore,
    		modalComponent,
    		valiImg,
    		inputValue,
    		showLoading,
    		files,
    		usingURL,
    		errorInfo,
    		dispatch,
    		modalInfo,
    		errorCallback,
    		loadCallback,
    		imageUpload,
    		crossClicked,
    		addClicked
    	});

    	$$self.$inject_state = $$props => {
    		if ("modalComponent" in $$props) $$invalidate(0, modalComponent = $$props.modalComponent);
    		if ("valiImg" in $$props) $$invalidate(1, valiImg = $$props.valiImg);
    		if ("inputValue" in $$props) $$invalidate(2, inputValue = $$props.inputValue);
    		if ("showLoading" in $$props) $$invalidate(3, showLoading = $$props.showLoading);
    		if ("files" in $$props) $$invalidate(4, files = $$props.files);
    		if ("usingURL" in $$props) usingURL = $$props.usingURL;
    		if ("errorInfo" in $$props) $$invalidate(5, errorInfo = $$props.errorInfo);
    		if ("modalInfo" in $$props) $$invalidate(6, modalInfo = $$props.modalInfo);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		modalComponent,
    		valiImg,
    		inputValue,
    		showLoading,
    		files,
    		errorInfo,
    		modalInfo,
    		errorCallback,
    		loadCallback,
    		imageUpload,
    		crossClicked,
    		addClicked,
    		input0_input_handler,
    		input1_change_handler,
    		img_binding,
    		div9_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$c.name
    		});
    	}
    }

    /* src\detail-view\HyperparameterDataview.svelte generated by Svelte v3.23.1 */
    const file$c = "src\\detail-view\\HyperparameterDataview.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let svg;

    	const block = {
    		c: function create() {
    			div = element("div");
    			svg = svg_element("svg");
    			attr_dev(svg, "id", "grid");
    			attr_dev(svg, "width", "100%");
    			attr_dev(svg, "height", "100%");
    			add_location(svg, file$c, 100, 2, 3188);
    			set_style(div, "display", "inline-block");
    			set_style(div, "vertical-align", "middle");
    			attr_dev(div, "class", "grid");
    			add_location(div, file$c, 98, 0, 3085);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, svg);
    			/*div_binding*/ ctx[8](div);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const standardCellColor$1 = "#ddd";
    const paddingCellColor = "#aaa";

    function instance$d($$self, $$props, $$invalidate) {
    	let { data } = $$props;
    	let { highlights } = $$props;
    	let { outputLength } = $$props;
    	let { stride } = $$props;
    	let { padding } = $$props;
    	let { isOutput = false } = $$props;
    	let { isStrideValid } = $$props;
    	let grid_final;
    	const dispatch = createEventDispatcher();
    	let oldHighlight = highlights;
    	let oldData = data;

    	const redraw = () => {
    		d3.select(grid_final).selectAll("#grid > *").remove();
    		var grid = d3.select(grid_final).select("#grid").attr("width", 200).attr("height", 200).append("svg").attr("width", 200).attr("height", 200);
    		var row = grid.selectAll(".row").data(data).enter().append("g").attr("class", "row");

    		var column = row.selectAll(".square").data(function (d) {
    			return d;
    		}).enter().append("rect").attr("class", "square").attr("x", function (d) {
    			return d.x;
    		}).attr("y", function (d) {
    			return d.y;
    		}).attr("width", function (d) {
    			return d.width;
    		}).attr("height", function (d) {
    			return d.height;
    		}).style("opacity", 0.5).style("stroke", "black").style("fill", function (d) {
    			// Colors cells appropriately that represent padding.
    			if (!isOutput && (d.row < padding || d.row > data.length - padding - 1 || d.col < padding || d.col > data.length - padding - 1)) {
    				return paddingCellColor;
    			}

    			return standardCellColor$1;
    		}).on("mouseover", function (d) {
    			if (!isStrideValid) return;

    			if (data.length != outputLength) {
    				dispatch("message", {
    					hoverH: Math.min(Math.floor(d.row / stride), outputLength - 1),
    					hoverW: Math.min(Math.floor(d.col / stride), outputLength - 1)
    				});
    			} else {
    				dispatch("message", {
    					hoverH: Math.min(Math.floor(d.row / 1), outputLength - 1),
    					hoverW: Math.min(Math.floor(d.col / 1), outputLength - 1)
    				});
    			}
    		});
    	};

    	afterUpdate(() => {
    		if (data != oldData) {
    			redraw();
    			oldData = data;
    		}

    		if (highlights != oldHighlight) {
    			var grid = d3.select(grid_final).select("#grid").select("svg");

    			grid.selectAll(".square").style("fill", function (d) {
    				if (highlights.length && highlights[d.row * data.length + d.col]) {
    					return "#FF2738";
    				} else {
    					// Colors cells appropriately that represent padding.
    					if (!isOutput && (d.row < padding || d.row > data.length - padding - 1 || d.col < padding || d.col > data.length - padding - 1)) {
    						return paddingCellColor;
    					}

    					return standardCellColor$1;
    				}
    			});

    			oldHighlight = highlights;
    		}
    	});

    	onMount(() => {
    		redraw();
    	});

    	const writable_props = [
    		"data",
    		"highlights",
    		"outputLength",
    		"stride",
    		"padding",
    		"isOutput",
    		"isStrideValid"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HyperparameterDataview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("HyperparameterDataview", $$slots, []);

    	function div_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			grid_final = $$value;
    			$$invalidate(0, grid_final);
    		});
    	}

    	$$self.$set = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("highlights" in $$props) $$invalidate(2, highlights = $$props.highlights);
    		if ("outputLength" in $$props) $$invalidate(3, outputLength = $$props.outputLength);
    		if ("stride" in $$props) $$invalidate(4, stride = $$props.stride);
    		if ("padding" in $$props) $$invalidate(5, padding = $$props.padding);
    		if ("isOutput" in $$props) $$invalidate(6, isOutput = $$props.isOutput);
    		if ("isStrideValid" in $$props) $$invalidate(7, isStrideValid = $$props.isStrideValid);
    	};

    	$$self.$capture_state = () => ({
    		data,
    		highlights,
    		outputLength,
    		stride,
    		padding,
    		isOutput,
    		isStrideValid,
    		onMount,
    		afterUpdate,
    		createEventDispatcher,
    		grid_final,
    		standardCellColor: standardCellColor$1,
    		paddingCellColor,
    		dispatch,
    		oldHighlight,
    		oldData,
    		redraw
    	});

    	$$self.$inject_state = $$props => {
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("highlights" in $$props) $$invalidate(2, highlights = $$props.highlights);
    		if ("outputLength" in $$props) $$invalidate(3, outputLength = $$props.outputLength);
    		if ("stride" in $$props) $$invalidate(4, stride = $$props.stride);
    		if ("padding" in $$props) $$invalidate(5, padding = $$props.padding);
    		if ("isOutput" in $$props) $$invalidate(6, isOutput = $$props.isOutput);
    		if ("isStrideValid" in $$props) $$invalidate(7, isStrideValid = $$props.isStrideValid);
    		if ("grid_final" in $$props) $$invalidate(0, grid_final = $$props.grid_final);
    		if ("oldHighlight" in $$props) oldHighlight = $$props.oldHighlight;
    		if ("oldData" in $$props) oldData = $$props.oldData;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		grid_final,
    		data,
    		highlights,
    		outputLength,
    		stride,
    		padding,
    		isOutput,
    		isStrideValid,
    		div_binding
    	];
    }

    class HyperparameterDataview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			data: 1,
    			highlights: 2,
    			outputLength: 3,
    			stride: 4,
    			padding: 5,
    			isOutput: 6,
    			isStrideValid: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HyperparameterDataview",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*data*/ ctx[1] === undefined && !("data" in props)) {
    			console.warn("<HyperparameterDataview> was created without expected prop 'data'");
    		}

    		if (/*highlights*/ ctx[2] === undefined && !("highlights" in props)) {
    			console.warn("<HyperparameterDataview> was created without expected prop 'highlights'");
    		}

    		if (/*outputLength*/ ctx[3] === undefined && !("outputLength" in props)) {
    			console.warn("<HyperparameterDataview> was created without expected prop 'outputLength'");
    		}

    		if (/*stride*/ ctx[4] === undefined && !("stride" in props)) {
    			console.warn("<HyperparameterDataview> was created without expected prop 'stride'");
    		}

    		if (/*padding*/ ctx[5] === undefined && !("padding" in props)) {
    			console.warn("<HyperparameterDataview> was created without expected prop 'padding'");
    		}

    		if (/*isStrideValid*/ ctx[7] === undefined && !("isStrideValid" in props)) {
    			console.warn("<HyperparameterDataview> was created without expected prop 'isStrideValid'");
    		}
    	}

    	get data() {
    		throw new Error("<HyperparameterDataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<HyperparameterDataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlights() {
    		throw new Error("<HyperparameterDataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlights(value) {
    		throw new Error("<HyperparameterDataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get outputLength() {
    		throw new Error("<HyperparameterDataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set outputLength(value) {
    		throw new Error("<HyperparameterDataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get stride() {
    		throw new Error("<HyperparameterDataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stride(value) {
    		throw new Error("<HyperparameterDataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<HyperparameterDataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<HyperparameterDataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isOutput() {
    		throw new Error("<HyperparameterDataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isOutput(value) {
    		throw new Error("<HyperparameterDataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStrideValid() {
    		throw new Error("<HyperparameterDataview>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStrideValid(value) {
    		throw new Error("<HyperparameterDataview>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\HyperparameterAnimator.svelte generated by Svelte v3.23.1 */
    const file$d = "src\\detail-view\\HyperparameterAnimator.svelte";

    function create_fragment$e(ctx) {
    	let div6;
    	let div2;
    	let div0;
    	let t0;
    	let t1_value = /*image*/ ctx[1].length - 2 * /*padding*/ ctx[3] + "";
    	let t1;
    	let t2;
    	let t3_value = /*image*/ ctx[1].length - 2 * /*padding*/ ctx[3] + "";
    	let t3;
    	let t4;
    	let br;
    	let t5;
    	let div1;
    	let t6;
    	let t7_value = /*image*/ ctx[1].length + "";
    	let t7;
    	let t8;
    	let t9_value = /*image*/ ctx[1].length + "";
    	let t9;
    	let t10;
    	let t11;
    	let t12;
    	let div5;
    	let div3;
    	let t13;
    	let t14_value = /*output*/ ctx[2].length + "";
    	let t14;
    	let t15;
    	let t16_value = /*output*/ ctx[2].length + "";
    	let t16;
    	let t17;
    	let t18;
    	let div4;
    	let t20;
    	let current;

    	const hyperparameterdataview0 = new HyperparameterDataview({
    			props: {
    				data: /*testImage*/ ctx[7],
    				highlights: /*inputHighlights*/ ctx[5],
    				outputLength: /*output*/ ctx[2].length,
    				stride: /*stride*/ ctx[0],
    				padding: /*padding*/ ctx[3],
    				isStrideValid: /*isStrideValid*/ ctx[4]
    			},
    			$$inline: true
    		});

    	hyperparameterdataview0.$on("message", /*handleMouseover*/ ctx[9]);

    	const hyperparameterdataview1 = new HyperparameterDataview({
    			props: {
    				data: /*testOutput*/ ctx[8],
    				highlights: /*outputHighlights*/ ctx[6],
    				outputLength: /*output*/ ctx[2].length,
    				stride: /*stride*/ ctx[0],
    				padding: /*padding*/ ctx[3],
    				isOutput: true,
    				isStrideValid: /*isStrideValid*/ ctx[4]
    			},
    			$$inline: true
    		});

    	hyperparameterdataview1.$on("message", /*handleMouseover*/ ctx[9]);

    	const block = {
    		c: function create() {
    			div6 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			t0 = text("Input (");
    			t1 = text(t1_value);
    			t2 = text(", ");
    			t3 = text(t3_value);
    			t4 = text(") ");
    			br = element("br");
    			t5 = space();
    			div1 = element("div");
    			t6 = text("After-padding (");
    			t7 = text(t7_value);
    			t8 = text(", ");
    			t9 = text(t9_value);
    			t10 = text(")");
    			t11 = space();
    			create_component(hyperparameterdataview0.$$.fragment);
    			t12 = space();
    			div5 = element("div");
    			div3 = element("div");
    			t13 = text("Output (");
    			t14 = text(t14_value);
    			t15 = text(", ");
    			t16 = text(t16_value);
    			t17 = text(")");
    			t18 = space();
    			div4 = element("div");
    			div4.textContent = " ";
    			t20 = space();
    			create_component(hyperparameterdataview1.$$.fragment);
    			add_location(br, file$d, 107, 73, 3755);
    			attr_dev(div0, "class", "header-text svelte-w25jpk");
    			add_location(div0, file$d, 106, 4, 3655);
    			attr_dev(div1, "class", "header-sub-text svelte-w25jpk");
    			add_location(div1, file$d, 109, 4, 3778);
    			attr_dev(div2, "class", "column has-text-centered svelte-w25jpk");
    			add_location(div2, file$d, 105, 2, 3611);
    			attr_dev(div3, "class", "header-text svelte-w25jpk");
    			set_style(div3, "padding-top", "27px");
    			add_location(div3, file$d, 116, 4, 4139);
    			attr_dev(div4, "class", "header-sub-text svelte-w25jpk");
    			add_location(div4, file$d, 119, 4, 4258);
    			attr_dev(div5, "class", "column has-text-centered svelte-w25jpk");
    			add_location(div5, file$d, 115, 2, 4095);
    			attr_dev(div6, "class", "wrapper svelte-w25jpk");
    			add_location(div6, file$d, 104, 0, 3586);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div6, anchor);
    			append_dev(div6, div2);
    			append_dev(div2, div0);
    			append_dev(div0, t0);
    			append_dev(div0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, t3);
    			append_dev(div0, t4);
    			append_dev(div0, br);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, t6);
    			append_dev(div1, t7);
    			append_dev(div1, t8);
    			append_dev(div1, t9);
    			append_dev(div1, t10);
    			append_dev(div2, t11);
    			mount_component(hyperparameterdataview0, div2, null);
    			append_dev(div6, t12);
    			append_dev(div6, div5);
    			append_dev(div5, div3);
    			append_dev(div3, t13);
    			append_dev(div3, t14);
    			append_dev(div3, t15);
    			append_dev(div3, t16);
    			append_dev(div3, t17);
    			append_dev(div5, t18);
    			append_dev(div5, div4);
    			append_dev(div5, t20);
    			mount_component(hyperparameterdataview1, div5, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*image, padding*/ 10) && t1_value !== (t1_value = /*image*/ ctx[1].length - 2 * /*padding*/ ctx[3] + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty & /*image, padding*/ 10) && t3_value !== (t3_value = /*image*/ ctx[1].length - 2 * /*padding*/ ctx[3] + "")) set_data_dev(t3, t3_value);
    			if ((!current || dirty & /*image*/ 2) && t7_value !== (t7_value = /*image*/ ctx[1].length + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty & /*image*/ 2) && t9_value !== (t9_value = /*image*/ ctx[1].length + "")) set_data_dev(t9, t9_value);
    			const hyperparameterdataview0_changes = {};
    			if (dirty & /*testImage*/ 128) hyperparameterdataview0_changes.data = /*testImage*/ ctx[7];
    			if (dirty & /*inputHighlights*/ 32) hyperparameterdataview0_changes.highlights = /*inputHighlights*/ ctx[5];
    			if (dirty & /*output*/ 4) hyperparameterdataview0_changes.outputLength = /*output*/ ctx[2].length;
    			if (dirty & /*stride*/ 1) hyperparameterdataview0_changes.stride = /*stride*/ ctx[0];
    			if (dirty & /*padding*/ 8) hyperparameterdataview0_changes.padding = /*padding*/ ctx[3];
    			if (dirty & /*isStrideValid*/ 16) hyperparameterdataview0_changes.isStrideValid = /*isStrideValid*/ ctx[4];
    			hyperparameterdataview0.$set(hyperparameterdataview0_changes);
    			if ((!current || dirty & /*output*/ 4) && t14_value !== (t14_value = /*output*/ ctx[2].length + "")) set_data_dev(t14, t14_value);
    			if ((!current || dirty & /*output*/ 4) && t16_value !== (t16_value = /*output*/ ctx[2].length + "")) set_data_dev(t16, t16_value);
    			const hyperparameterdataview1_changes = {};
    			if (dirty & /*testOutput*/ 256) hyperparameterdataview1_changes.data = /*testOutput*/ ctx[8];
    			if (dirty & /*outputHighlights*/ 64) hyperparameterdataview1_changes.highlights = /*outputHighlights*/ ctx[6];
    			if (dirty & /*output*/ 4) hyperparameterdataview1_changes.outputLength = /*output*/ ctx[2].length;
    			if (dirty & /*stride*/ 1) hyperparameterdataview1_changes.stride = /*stride*/ ctx[0];
    			if (dirty & /*padding*/ 8) hyperparameterdataview1_changes.padding = /*padding*/ ctx[3];
    			if (dirty & /*isStrideValid*/ 16) hyperparameterdataview1_changes.isStrideValid = /*isStrideValid*/ ctx[4];
    			hyperparameterdataview1.$set(hyperparameterdataview1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hyperparameterdataview0.$$.fragment, local);
    			transition_in(hyperparameterdataview1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hyperparameterdataview0.$$.fragment, local);
    			transition_out(hyperparameterdataview1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div6);
    			destroy_component(hyperparameterdataview0);
    			destroy_component(hyperparameterdataview1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const gridSize = 198;

    function instance$e($$self, $$props, $$invalidate) {
    	let { stride } = $$props;
    	let { dilation } = $$props;
    	let { kernel } = $$props;
    	let { image } = $$props;
    	let { output } = $$props;
    	let { isPaused } = $$props;
    	let { padding } = $$props;
    	let { isStrideValid } = $$props;
    	const dispatch = createEventDispatcher();
    	let inputHighlights = [];
    	let outputHighlights = array1d(output.length * output.length, i => true);
    	let interval;
    	let counter;

    	// lots of replication between mouseover and start-conv. TODO: fix this.
    	function startConvolution(stride) {
    		counter = 0;
    		$$invalidate(10, isPaused = false);
    		dispatch("message", { text: isPaused });
    		let outputMappings = generateOutputMappings(stride, output, kernel.length, image.length, dilation);
    		if (stride <= 0) return;
    		if (interval) clearInterval(interval);

    		$$invalidate(13, interval = setInterval(
    			() => {
    				if (isPaused || !isStrideValid) return;
    				const flat_animated = counter % (output.length * output.length);
    				$$invalidate(6, outputHighlights = array1d(output.length * output.length, i => false));
    				const animatedH = Math.floor(flat_animated / output.length);
    				const animatedW = flat_animated % output.length;
    				$$invalidate(6, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    				$$invalidate(5, inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, image.length, kernel.length, outputMappings, kernel.length));
    				counter++;
    			},
    			1000
    		));
    	}

    	function handleMouseover(event) {
    		let outputMappings = generateOutputMappings(stride, output, kernel.length, image.length, dilation);
    		$$invalidate(6, outputHighlights = array1d(output.length * output.length, i => false));
    		const animatedH = event.detail.hoverH;
    		const animatedW = event.detail.hoverW;
    		$$invalidate(6, outputHighlights[animatedH * output.length + animatedW] = true, outputHighlights);
    		$$invalidate(5, inputHighlights = compute_input_multiplies_with_weight(animatedH, animatedW, image.length, kernel.length, outputMappings, kernel.length));
    		$$invalidate(10, isPaused = true);
    		dispatch("message", { text: isPaused });
    	}

    	startConvolution(stride);
    	let testImage = gridData(image, gridSize / image.length);
    	let testOutput = gridData(output, gridSize / output.length);
    	let testKernel = gridData(kernel, gridSize / kernel.length);

    	const writable_props = [
    		"stride",
    		"dilation",
    		"kernel",
    		"image",
    		"output",
    		"isPaused",
    		"padding",
    		"isStrideValid"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<HyperparameterAnimator> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("HyperparameterAnimator", $$slots, []);

    	$$self.$set = $$props => {
    		if ("stride" in $$props) $$invalidate(0, stride = $$props.stride);
    		if ("dilation" in $$props) $$invalidate(11, dilation = $$props.dilation);
    		if ("kernel" in $$props) $$invalidate(12, kernel = $$props.kernel);
    		if ("image" in $$props) $$invalidate(1, image = $$props.image);
    		if ("output" in $$props) $$invalidate(2, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(10, isPaused = $$props.isPaused);
    		if ("padding" in $$props) $$invalidate(3, padding = $$props.padding);
    		if ("isStrideValid" in $$props) $$invalidate(4, isStrideValid = $$props.isStrideValid);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		array1d,
    		compute_input_multiplies_with_weight,
    		generateOutputMappings,
    		gridData,
    		HyperparameterDataview,
    		KernelMathView,
    		stride,
    		dilation,
    		kernel,
    		image,
    		output,
    		isPaused,
    		padding,
    		isStrideValid,
    		dispatch,
    		inputHighlights,
    		outputHighlights,
    		interval,
    		counter,
    		startConvolution,
    		handleMouseover,
    		gridSize,
    		testImage,
    		testOutput,
    		testKernel
    	});

    	$$self.$inject_state = $$props => {
    		if ("stride" in $$props) $$invalidate(0, stride = $$props.stride);
    		if ("dilation" in $$props) $$invalidate(11, dilation = $$props.dilation);
    		if ("kernel" in $$props) $$invalidate(12, kernel = $$props.kernel);
    		if ("image" in $$props) $$invalidate(1, image = $$props.image);
    		if ("output" in $$props) $$invalidate(2, output = $$props.output);
    		if ("isPaused" in $$props) $$invalidate(10, isPaused = $$props.isPaused);
    		if ("padding" in $$props) $$invalidate(3, padding = $$props.padding);
    		if ("isStrideValid" in $$props) $$invalidate(4, isStrideValid = $$props.isStrideValid);
    		if ("inputHighlights" in $$props) $$invalidate(5, inputHighlights = $$props.inputHighlights);
    		if ("outputHighlights" in $$props) $$invalidate(6, outputHighlights = $$props.outputHighlights);
    		if ("interval" in $$props) $$invalidate(13, interval = $$props.interval);
    		if ("counter" in $$props) counter = $$props.counter;
    		if ("testImage" in $$props) $$invalidate(7, testImage = $$props.testImage);
    		if ("testOutput" in $$props) $$invalidate(8, testOutput = $$props.testOutput);
    		if ("testKernel" in $$props) testKernel = $$props.testKernel;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*output*/ 4) {
    			 {
    				let outputHighlights = array1d(output.length * output.length, i => true);
    			}
    		}

    		if ($$self.$$.dirty & /*stride, image, output, kernel*/ 4103) {
    			 {
    				startConvolution(stride);
    				$$invalidate(7, testImage = gridData(image, gridSize / image.length));
    				$$invalidate(8, testOutput = gridData(output, gridSize / output.length));
    				testKernel = gridData(kernel, gridSize / kernel.length);
    			}
    		}
    	};

    	return [
    		stride,
    		image,
    		output,
    		padding,
    		isStrideValid,
    		inputHighlights,
    		outputHighlights,
    		testImage,
    		testOutput,
    		handleMouseover,
    		isPaused,
    		dilation,
    		kernel
    	];
    }

    class HyperparameterAnimator extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			stride: 0,
    			dilation: 11,
    			kernel: 12,
    			image: 1,
    			output: 2,
    			isPaused: 10,
    			padding: 3,
    			isStrideValid: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "HyperparameterAnimator",
    			options,
    			id: create_fragment$e.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*stride*/ ctx[0] === undefined && !("stride" in props)) {
    			console.warn("<HyperparameterAnimator> was created without expected prop 'stride'");
    		}

    		if (/*dilation*/ ctx[11] === undefined && !("dilation" in props)) {
    			console.warn("<HyperparameterAnimator> was created without expected prop 'dilation'");
    		}

    		if (/*kernel*/ ctx[12] === undefined && !("kernel" in props)) {
    			console.warn("<HyperparameterAnimator> was created without expected prop 'kernel'");
    		}

    		if (/*image*/ ctx[1] === undefined && !("image" in props)) {
    			console.warn("<HyperparameterAnimator> was created without expected prop 'image'");
    		}

    		if (/*output*/ ctx[2] === undefined && !("output" in props)) {
    			console.warn("<HyperparameterAnimator> was created without expected prop 'output'");
    		}

    		if (/*isPaused*/ ctx[10] === undefined && !("isPaused" in props)) {
    			console.warn("<HyperparameterAnimator> was created without expected prop 'isPaused'");
    		}

    		if (/*padding*/ ctx[3] === undefined && !("padding" in props)) {
    			console.warn("<HyperparameterAnimator> was created without expected prop 'padding'");
    		}

    		if (/*isStrideValid*/ ctx[4] === undefined && !("isStrideValid" in props)) {
    			console.warn("<HyperparameterAnimator> was created without expected prop 'isStrideValid'");
    		}
    	}

    	get stride() {
    		throw new Error("<HyperparameterAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set stride(value) {
    		throw new Error("<HyperparameterAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dilation() {
    		throw new Error("<HyperparameterAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dilation(value) {
    		throw new Error("<HyperparameterAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get kernel() {
    		throw new Error("<HyperparameterAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set kernel(value) {
    		throw new Error("<HyperparameterAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get image() {
    		throw new Error("<HyperparameterAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set image(value) {
    		throw new Error("<HyperparameterAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get output() {
    		throw new Error("<HyperparameterAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set output(value) {
    		throw new Error("<HyperparameterAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isPaused() {
    		throw new Error("<HyperparameterAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isPaused(value) {
    		throw new Error("<HyperparameterAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get padding() {
    		throw new Error("<HyperparameterAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set padding(value) {
    		throw new Error("<HyperparameterAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isStrideValid() {
    		throw new Error("<HyperparameterAnimator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isStrideValid(value) {
    		throw new Error("<HyperparameterAnimator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src\detail-view\Hyperparameterview.svelte generated by Svelte v3.23.1 */

    const { console: console_1$3 } = globals;
    const file$e = "src\\detail-view\\Hyperparameterview.svelte";

    function create_fragment$f(ctx) {
    	let div19;
    	let div18;
    	let div0;

    	let raw_value = (/*isPaused*/ ctx[4]
    	? "<i class=\"fas fa-play-circle play-icon\"></i>"
    	: "<i class=\"fas fa-pause-circle\"></i>") + "";

    	let t0;
    	let div17;
    	let div13;
    	let div3;
    	let div2;
    	let div1;
    	let label0;
    	let t2;
    	let input0;
    	let input0_max_value;
    	let t3;
    	let input1;
    	let input1_max_value;
    	let t4;
    	let div6;
    	let div5;
    	let div4;
    	let label1;
    	let t6;
    	let input2;
    	let input2_min_value;
    	let input2_max_value;
    	let t7;
    	let input3;
    	let input3_min_value;
    	let input3_max_value;
    	let t8;
    	let div9;
    	let div8;
    	let div7;
    	let label2;
    	let t10;
    	let input4;
    	let input4_min_value;
    	let t11;
    	let input5;
    	let input5_min_value;
    	let t12;
    	let div12;
    	let div11;
    	let div10;
    	let label3;
    	let t14;
    	let input6;
    	let input6_max_value;
    	let t15;
    	let input7;
    	let input7_max_value;
    	let t16;
    	let div16;
    	let t17;
    	let div15;
    	let img;
    	let img_src_value;
    	let t18;
    	let div14;
    	let span;
    	let t20;
    	let current;
    	let mounted;
    	let dispose;

    	const hyperparameteranimator = new HyperparameterAnimator({
    			props: {
    				kernel: /*kernel*/ ctx[7],
    				image: /*input*/ ctx[6],
    				output: /*outputFinal*/ ctx[8],
    				isStrideValid: /*isStrideValid*/ ctx[5],
    				stride: /*stride*/ ctx[3],
    				dilation: dilation$2,
    				padding: /*padding*/ ctx[2],
    				isPaused: /*isPaused*/ ctx[4]
    			},
    			$$inline: true
    		});

    	hyperparameteranimator.$on("message", /*handlePauseFromInteraction*/ ctx[11]);

    	const block = {
    		c: function create() {
    			div19 = element("div");
    			div18 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div17 = element("div");
    			div13 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Input Size:";
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			input1 = element("input");
    			t4 = space();
    			div6 = element("div");
    			div5 = element("div");
    			div4 = element("div");
    			label1 = element("label");
    			label1.textContent = "Padding:";
    			t6 = space();
    			input2 = element("input");
    			t7 = space();
    			input3 = element("input");
    			t8 = space();
    			div9 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			label2 = element("label");
    			label2.textContent = "Kernel Size:";
    			t10 = space();
    			input4 = element("input");
    			t11 = space();
    			input5 = element("input");
    			t12 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div10 = element("div");
    			label3 = element("label");
    			label3.textContent = "Stride:";
    			t14 = space();
    			input6 = element("input");
    			t15 = space();
    			input7 = element("input");
    			t16 = space();
    			div16 = element("div");
    			create_component(hyperparameteranimator.$$.fragment);
    			t17 = space();
    			div15 = element("div");
    			img = element("img");
    			t18 = space();
    			div14 = element("div");
    			span = element("span");
    			span.textContent = "Hover over";
    			t20 = text(" the matrices to change kernel position.");
    			attr_dev(div0, "class", "control-button svelte-159efdy");
    			add_location(div0, file$e, 151, 6, 3233);
    			attr_dev(label0, "class", "label svelte-159efdy");
    			add_location(label0, file$e, 163, 14, 3655);
    			attr_dev(div1, "class", "field-label is-normal svelte-159efdy");
    			add_location(div1, file$e, 162, 12, 3604);
    			attr_dev(input0, "class", "input is-very-small svelte-159efdy");
    			attr_dev(input0, "type", "number");
    			attr_dev(input0, "min", /*kernelSize*/ ctx[1]);
    			attr_dev(input0, "max", input0_max_value = 7);
    			add_location(input0, file$e, 165, 12, 3729);
    			attr_dev(div2, "class", "field is-horizontal svelte-159efdy");
    			add_location(div2, file$e, 161, 10, 3557);
    			attr_dev(input1, "type", "range");
    			attr_dev(input1, "min", /*kernelSize*/ ctx[1]);
    			attr_dev(input1, "max", input1_max_value = 7);
    			attr_dev(input1, "class", "svelte-159efdy");
    			add_location(input1, file$e, 169, 10, 3873);
    			attr_dev(div3, "class", "input-row");
    			add_location(div3, file$e, 160, 8, 3522);
    			attr_dev(label1, "class", "label svelte-159efdy");
    			add_location(label1, file$e, 176, 14, 4115);
    			attr_dev(div4, "class", "field-label is-normal svelte-159efdy");
    			add_location(div4, file$e, 175, 12, 4064);
    			attr_dev(input2, "class", "input is-very-small svelte-159efdy");
    			attr_dev(input2, "type", "number");
    			attr_dev(input2, "min", input2_min_value = 0);
    			attr_dev(input2, "max", input2_max_value = /*kernelSize*/ ctx[1] - 1);
    			add_location(input2, file$e, 178, 12, 4186);
    			attr_dev(div5, "class", "field is-horizontal svelte-159efdy");
    			add_location(div5, file$e, 174, 10, 4017);
    			attr_dev(input3, "type", "range");
    			attr_dev(input3, "min", input3_min_value = 0);
    			attr_dev(input3, "max", input3_max_value = /*kernelSize*/ ctx[1] - 1);
    			attr_dev(input3, "class", "svelte-159efdy");
    			add_location(input3, file$e, 182, 10, 4332);
    			attr_dev(div6, "class", "input-row");
    			add_location(div6, file$e, 173, 8, 3982);
    			attr_dev(label2, "class", "label svelte-159efdy");
    			add_location(label2, file$e, 189, 14, 4576);
    			attr_dev(div7, "class", "field-label is-normal svelte-159efdy");
    			add_location(div7, file$e, 188, 12, 4525);
    			attr_dev(input4, "class", "input is-very-small svelte-159efdy");
    			attr_dev(input4, "type", "number");
    			attr_dev(input4, "min", input4_min_value = /*padding*/ ctx[2] + 1);
    			attr_dev(input4, "max", /*inputSizeWithPadding*/ ctx[9]);
    			add_location(input4, file$e, 191, 12, 4651);
    			attr_dev(div8, "class", "field is-horizontal svelte-159efdy");
    			add_location(div8, file$e, 187, 10, 4478);
    			attr_dev(input5, "type", "range");
    			attr_dev(input5, "min", input5_min_value = /*padding*/ ctx[2] + 1);
    			attr_dev(input5, "max", /*inputSizeWithPadding*/ ctx[9]);
    			attr_dev(input5, "class", "svelte-159efdy");
    			add_location(input5, file$e, 195, 10, 4816);
    			attr_dev(div9, "class", "input-row");
    			add_location(div9, file$e, 186, 8, 4443);
    			attr_dev(label3, "class", "label svelte-159efdy");
    			add_location(label3, file$e, 202, 14, 5079);
    			attr_dev(div10, "class", "field-label is-normal svelte-159efdy");
    			add_location(div10, file$e, 201, 12, 5028);
    			attr_dev(input6, "class", "input is-very-small svelte-159efdy");
    			attr_dev(input6, "type", "number");
    			attr_dev(input6, "id", "strideNumber");
    			attr_dev(input6, "min", "1");
    			attr_dev(input6, "max", input6_max_value = Math.max(/*inputSizeWithPadding*/ ctx[9] - /*kernelSize*/ ctx[1] + 1, 2));
    			add_location(input6, file$e, 204, 12, 5149);
    			attr_dev(div11, "class", "field is-horizontal svelte-159efdy");
    			add_location(div11, file$e, 200, 10, 4981);
    			attr_dev(input7, "type", "range");
    			attr_dev(input7, "min", "1");
    			attr_dev(input7, "max", input7_max_value = Math.max(/*inputSizeWithPadding*/ ctx[9] - /*kernelSize*/ ctx[1] + 1, 2));
    			attr_dev(input7, "class", "svelte-159efdy");
    			add_location(input7, file$e, 208, 10, 5344);
    			attr_dev(div12, "class", "input-row");
    			add_location(div12, file$e, 199, 8, 4946);
    			attr_dev(div13, "class", "left-part svelte-159efdy");
    			add_location(div13, file$e, 158, 6, 3487);
    			if (img.src !== (img_src_value = "/assets/img/pointer.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "pointer icon");
    			attr_dev(img, "width", "25px");
    			attr_dev(img, "class", "svelte-159efdy");
    			add_location(img, file$e, 219, 12, 5837);
    			set_style(span, "font-weight", "600");
    			add_location(span, file$e, 221, 14, 5979);
    			attr_dev(div14, "class", "annotation-text-hyper svelte-159efdy");
    			add_location(div14, file$e, 220, 12, 5928);
    			attr_dev(div15, "class", "annotation svelte-159efdy");
    			add_location(div15, file$e, 218, 10, 5799);
    			attr_dev(div16, "class", "right-part svelte-159efdy");
    			add_location(div16, file$e, 213, 8, 5502);
    			attr_dev(div17, "class", "content-container svelte-159efdy");
    			add_location(div17, file$e, 157, 4, 3448);
    			attr_dev(div18, "class", "box svelte-159efdy");
    			add_location(div18, file$e, 149, 2, 3206);
    			attr_dev(div19, "class", "container has-text-centered");
    			attr_dev(div19, "id", "detailview-container");
    			add_location(div19, file$e, 148, 0, 3135);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div19, anchor);
    			append_dev(div19, div18);
    			append_dev(div18, div0);
    			div0.innerHTML = raw_value;
    			append_dev(div18, t0);
    			append_dev(div18, div17);
    			append_dev(div17, div13);
    			append_dev(div13, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, label0);
    			append_dev(div2, t2);
    			append_dev(div2, input0);
    			set_input_value(input0, /*inputSize*/ ctx[0]);
    			append_dev(div3, t3);
    			append_dev(div3, input1);
    			set_input_value(input1, /*inputSize*/ ctx[0]);
    			append_dev(div13, t4);
    			append_dev(div13, div6);
    			append_dev(div6, div5);
    			append_dev(div5, div4);
    			append_dev(div4, label1);
    			append_dev(div5, t6);
    			append_dev(div5, input2);
    			set_input_value(input2, /*padding*/ ctx[2]);
    			append_dev(div6, t7);
    			append_dev(div6, input3);
    			set_input_value(input3, /*padding*/ ctx[2]);
    			append_dev(div13, t8);
    			append_dev(div13, div9);
    			append_dev(div9, div8);
    			append_dev(div8, div7);
    			append_dev(div7, label2);
    			append_dev(div8, t10);
    			append_dev(div8, input4);
    			set_input_value(input4, /*kernelSize*/ ctx[1]);
    			append_dev(div9, t11);
    			append_dev(div9, input5);
    			set_input_value(input5, /*kernelSize*/ ctx[1]);
    			append_dev(div13, t12);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(div11, div10);
    			append_dev(div10, label3);
    			append_dev(div11, t14);
    			append_dev(div11, input6);
    			set_input_value(input6, /*stride*/ ctx[3]);
    			append_dev(div12, t15);
    			append_dev(div12, input7);
    			set_input_value(input7, /*stride*/ ctx[3]);
    			append_dev(div17, t16);
    			append_dev(div17, div16);
    			mount_component(hyperparameteranimator, div16, null);
    			append_dev(div16, t17);
    			append_dev(div16, div15);
    			append_dev(div15, img);
    			append_dev(div15, t18);
    			append_dev(div15, div14);
    			append_dev(div14, span);
    			append_dev(div14, t20);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*handleClickPause*/ ctx[10], false, false, false),
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[12]),
    					listen_dev(input1, "change", /*input1_change_input_handler*/ ctx[13]),
    					listen_dev(input1, "input", /*input1_change_input_handler*/ ctx[13]),
    					listen_dev(input2, "input", /*input2_input_handler*/ ctx[14]),
    					listen_dev(input3, "change", /*input3_change_input_handler*/ ctx[15]),
    					listen_dev(input3, "input", /*input3_change_input_handler*/ ctx[15]),
    					listen_dev(input4, "input", /*input4_input_handler*/ ctx[16]),
    					listen_dev(input5, "change", /*input5_change_input_handler*/ ctx[17]),
    					listen_dev(input5, "input", /*input5_change_input_handler*/ ctx[17]),
    					listen_dev(input6, "input", /*input6_input_handler*/ ctx[18]),
    					listen_dev(input7, "change", /*input7_change_input_handler*/ ctx[19]),
    					listen_dev(input7, "input", /*input7_change_input_handler*/ ctx[19])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*isPaused*/ 16) && raw_value !== (raw_value = (/*isPaused*/ ctx[4]
    			? "<i class=\"fas fa-play-circle play-icon\"></i>"
    			: "<i class=\"fas fa-pause-circle\"></i>") + "")) div0.innerHTML = raw_value;
    			if (!current || dirty & /*kernelSize*/ 2) {
    				attr_dev(input0, "min", /*kernelSize*/ ctx[1]);
    			}

    			if (dirty & /*inputSize*/ 1 && to_number(input0.value) !== /*inputSize*/ ctx[0]) {
    				set_input_value(input0, /*inputSize*/ ctx[0]);
    			}

    			if (!current || dirty & /*kernelSize*/ 2) {
    				attr_dev(input1, "min", /*kernelSize*/ ctx[1]);
    			}

    			if (dirty & /*inputSize*/ 1) {
    				set_input_value(input1, /*inputSize*/ ctx[0]);
    			}

    			if (!current || dirty & /*kernelSize*/ 2 && input2_max_value !== (input2_max_value = /*kernelSize*/ ctx[1] - 1)) {
    				attr_dev(input2, "max", input2_max_value);
    			}

    			if (dirty & /*padding*/ 4 && to_number(input2.value) !== /*padding*/ ctx[2]) {
    				set_input_value(input2, /*padding*/ ctx[2]);
    			}

    			if (!current || dirty & /*kernelSize*/ 2 && input3_max_value !== (input3_max_value = /*kernelSize*/ ctx[1] - 1)) {
    				attr_dev(input3, "max", input3_max_value);
    			}

    			if (dirty & /*padding*/ 4) {
    				set_input_value(input3, /*padding*/ ctx[2]);
    			}

    			if (!current || dirty & /*padding*/ 4 && input4_min_value !== (input4_min_value = /*padding*/ ctx[2] + 1)) {
    				attr_dev(input4, "min", input4_min_value);
    			}

    			if (!current || dirty & /*inputSizeWithPadding*/ 512) {
    				attr_dev(input4, "max", /*inputSizeWithPadding*/ ctx[9]);
    			}

    			if (dirty & /*kernelSize*/ 2 && to_number(input4.value) !== /*kernelSize*/ ctx[1]) {
    				set_input_value(input4, /*kernelSize*/ ctx[1]);
    			}

    			if (!current || dirty & /*padding*/ 4 && input5_min_value !== (input5_min_value = /*padding*/ ctx[2] + 1)) {
    				attr_dev(input5, "min", input5_min_value);
    			}

    			if (!current || dirty & /*inputSizeWithPadding*/ 512) {
    				attr_dev(input5, "max", /*inputSizeWithPadding*/ ctx[9]);
    			}

    			if (dirty & /*kernelSize*/ 2) {
    				set_input_value(input5, /*kernelSize*/ ctx[1]);
    			}

    			if (!current || dirty & /*inputSizeWithPadding, kernelSize*/ 514 && input6_max_value !== (input6_max_value = Math.max(/*inputSizeWithPadding*/ ctx[9] - /*kernelSize*/ ctx[1] + 1, 2))) {
    				attr_dev(input6, "max", input6_max_value);
    			}

    			if (dirty & /*stride*/ 8 && to_number(input6.value) !== /*stride*/ ctx[3]) {
    				set_input_value(input6, /*stride*/ ctx[3]);
    			}

    			if (!current || dirty & /*inputSizeWithPadding, kernelSize*/ 514 && input7_max_value !== (input7_max_value = Math.max(/*inputSizeWithPadding*/ ctx[9] - /*kernelSize*/ ctx[1] + 1, 2))) {
    				attr_dev(input7, "max", input7_max_value);
    			}

    			if (dirty & /*stride*/ 8) {
    				set_input_value(input7, /*stride*/ ctx[3]);
    			}

    			const hyperparameteranimator_changes = {};
    			if (dirty & /*kernel*/ 128) hyperparameteranimator_changes.kernel = /*kernel*/ ctx[7];
    			if (dirty & /*input*/ 64) hyperparameteranimator_changes.image = /*input*/ ctx[6];
    			if (dirty & /*outputFinal*/ 256) hyperparameteranimator_changes.output = /*outputFinal*/ ctx[8];
    			if (dirty & /*isStrideValid*/ 32) hyperparameteranimator_changes.isStrideValid = /*isStrideValid*/ ctx[5];
    			if (dirty & /*stride*/ 8) hyperparameteranimator_changes.stride = /*stride*/ ctx[3];
    			if (dirty & /*padding*/ 4) hyperparameteranimator_changes.padding = /*padding*/ ctx[2];
    			if (dirty & /*isPaused*/ 16) hyperparameteranimator_changes.isPaused = /*isPaused*/ ctx[4];
    			hyperparameteranimator.$set(hyperparameteranimator_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hyperparameteranimator.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hyperparameteranimator.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div19);
    			destroy_component(hyperparameteranimator);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const dilation$2 = 1;

    function generateSquareArray(arrayDim) {
    	let arr = [];

    	for (let i = 0; i < arrayDim; i++) {
    		arr.push([]);

    		for (let j = 0; j < arrayDim; j++) {
    			arr[i].push(0);
    		}
    	}

    	return arr;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let inputSize = 5;
    	let kernelSize = 2;
    	let padding = 0;
    	let stride = 1;
    	let isPaused = false;
    	let isStrideValid = true;

    	function handleClickPause() {
    		$$invalidate(4, isPaused = !isPaused);
    	}

    	function handlePauseFromInteraction(event) {
    		$$invalidate(4, isPaused = event.detail.text);
    	}

    	// Update input, kernel, and output as user adjusts hyperparameters.
    	let input = generateSquareArray(inputSize + padding * 2);

    	let kernel = generateSquareArray(kernelSize);
    	let outputFinal = singleConv(input, kernel, stride);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$3.warn(`<Hyperparameterview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Hyperparameterview", $$slots, []);

    	function input0_input_handler() {
    		inputSize = to_number(this.value);
    		$$invalidate(0, inputSize);
    	}

    	function input1_change_input_handler() {
    		inputSize = to_number(this.value);
    		$$invalidate(0, inputSize);
    	}

    	function input2_input_handler() {
    		padding = to_number(this.value);
    		$$invalidate(2, padding);
    	}

    	function input3_change_input_handler() {
    		padding = to_number(this.value);
    		$$invalidate(2, padding);
    	}

    	function input4_input_handler() {
    		kernelSize = to_number(this.value);
    		$$invalidate(1, kernelSize);
    	}

    	function input5_change_input_handler() {
    		kernelSize = to_number(this.value);
    		$$invalidate(1, kernelSize);
    	}

    	function input6_input_handler() {
    		stride = to_number(this.value);
    		$$invalidate(3, stride);
    	}

    	function input7_change_input_handler() {
    		stride = to_number(this.value);
    		$$invalidate(3, stride);
    	}

    	$$self.$capture_state = () => ({
    		HyperparameterAnimator,
    		singleConv,
    		inputSize,
    		kernelSize,
    		padding,
    		stride,
    		dilation: dilation$2,
    		isPaused,
    		isStrideValid,
    		generateSquareArray,
    		handleClickPause,
    		handlePauseFromInteraction,
    		input,
    		kernel,
    		outputFinal,
    		inputSizeWithPadding
    	});

    	$$self.$inject_state = $$props => {
    		if ("inputSize" in $$props) $$invalidate(0, inputSize = $$props.inputSize);
    		if ("kernelSize" in $$props) $$invalidate(1, kernelSize = $$props.kernelSize);
    		if ("padding" in $$props) $$invalidate(2, padding = $$props.padding);
    		if ("stride" in $$props) $$invalidate(3, stride = $$props.stride);
    		if ("isPaused" in $$props) $$invalidate(4, isPaused = $$props.isPaused);
    		if ("isStrideValid" in $$props) $$invalidate(5, isStrideValid = $$props.isStrideValid);
    		if ("input" in $$props) $$invalidate(6, input = $$props.input);
    		if ("kernel" in $$props) $$invalidate(7, kernel = $$props.kernel);
    		if ("outputFinal" in $$props) $$invalidate(8, outputFinal = $$props.outputFinal);
    		if ("inputSizeWithPadding" in $$props) $$invalidate(9, inputSizeWithPadding = $$props.inputSizeWithPadding);
    	};

    	let inputSizeWithPadding;

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*inputSize, padding*/ 5) {
    			 $$invalidate(9, inputSizeWithPadding = inputSize + 2 * padding);
    		}

    		if ($$self.$$.dirty & /*inputSize, padding*/ 5) {
    			 $$invalidate(6, input = generateSquareArray(inputSize + padding * 2));
    		}

    		if ($$self.$$.dirty & /*kernelSize*/ 2) {
    			 $$invalidate(7, kernel = generateSquareArray(kernelSize));
    		}

    		if ($$self.$$.dirty & /*stride, inputSizeWithPadding, kernelSize, input, kernel*/ 714) {
    			 if (stride > 0) {
    				const stepSize = (inputSizeWithPadding - kernelSize) / stride + 1;
    				let strideNumberInput = document.getElementById("strideNumber");

    				if (Number.isInteger(stepSize)) {
    					$$invalidate(8, outputFinal = singleConv(input, kernel, stride));

    					if (strideNumberInput != null) {
    						strideNumberInput.className = strideNumberInput.className.replace("is-danger", "");
    					}

    					$$invalidate(5, isStrideValid = true);
    				} else {
    					if (!strideNumberInput.className.includes("is-danger")) {
    						strideNumberInput.className += " is-danger";
    					}

    					$$invalidate(5, isStrideValid = false);
    					console.log("Cannot handle stride of " + stride);
    				}
    			}
    		}
    	};

    	return [
    		inputSize,
    		kernelSize,
    		padding,
    		stride,
    		isPaused,
    		isStrideValid,
    		input,
    		kernel,
    		outputFinal,
    		inputSizeWithPadding,
    		handleClickPause,
    		handlePauseFromInteraction,
    		input0_input_handler,
    		input1_change_input_handler,
    		input2_input_handler,
    		input3_change_input_handler,
    		input4_input_handler,
    		input5_change_input_handler,
    		input6_input_handler,
    		input7_change_input_handler
    	];
    }

    class Hyperparameterview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Hyperparameterview",
    			options,
    			id: create_fragment$f.name
    		});
    	}
    }

    /* src\article\Article.svelte generated by Svelte v3.23.1 */
    const file$f = "src\\article\\Article.svelte";

    function create_fragment$g(ctx) {
    	let body;
    	let div8;
    	let h20;
    	let t1;
    	let p0;
    	let t2;
    	let em0;
    	let t4;
    	let em1;
    	let t6;
    	let t7;
    	let p1;
    	let t9;
    	let ol0;
    	let li0;
    	let t10;
    	let strong0;
    	let t12;
    	let t13;
    	let li1;
    	let t14;
    	let strong1;
    	let t16;
    	let span0;
    	let t18;
    	let span1;
    	let t20;
    	let strong2;
    	let t22;
    	let t23;
    	let li2;
    	let t24;
    	let strong3;
    	let t26;
    	let t27;
    	let li3;
    	let strong4;
    	let t29;
    	let span2;
    	let t31;
    	let span3;
    	let t33;
    	let em2;
    	let t35;
    	let em3;
    	let t37;
    	let t38;
    	let li4;
    	let t39;
    	let strong5;
    	let t41;
    	let strong6;
    	let t43;
    	let t44;
    	let p2;
    	let t45;
    	let a0;
    	let t47;
    	let t48;
    	let p3;
    	let t49;
    	let a1;
    	let t51;
    	let t52;
    	let h21;
    	let t54;
    	let p4;
    	let t56;
    	let h40;
    	let t58;
    	let p5;
    	let t59;
    	let img0;
    	let img0_src_value;
    	let t60;
    	let t61;
    	let h41;
    	let t63;
    	let p6;
    	let t65;
    	let p7;
    	let t67;
    	let p8;
    	let t69;
    	let div1;
    	let img1;
    	let img1_src_value;
    	let t70;
    	let div0;
    	let t72;
    	let p9;
    	let t74;
    	let div3;
    	let img2;
    	let img2_src_value;
    	let t75;
    	let div2;
    	let t77;
    	let p10;
    	let t79;
    	let p11;
    	let t81;
    	let h60;
    	let t83;
    	let p12;
    	let t84;
    	let ol1;
    	let li5;
    	let strong7;
    	let t86;
    	let a2;
    	let t88;
    	let a3;
    	let t90;
    	let a4;
    	let t92;
    	let t93;
    	let li6;
    	let strong8;
    	let t95;
    	let a5;
    	let t97;
    	let t98;
    	let li7;
    	let strong9;
    	let t100;
    	let t101;
    	let h42;
    	let t103;
    	let h61;
    	let t105;
    	let p13;
    	let t106;
    	let a6;
    	let t108;
    	let em4;
    	let t110;
    	let a7;
    	let t112;
    	let t113;
    	let p14;
    	let t116;
    	let div5;
    	let img3;
    	let img3_src_value;
    	let t117;
    	let div4;
    	let t119;
    	let p15;
    	let t121;
    	let h62;
    	let t123;
    	let p16;
    	let t124;
    	let t125;
    	let span4;
    	let t127;
    	let span5;
    	let t129;
    	let t130;
    	let p17;
    	let t132;
    	let div7;
    	let img4;
    	let img4_src_value;
    	let t133;
    	let div6;
    	let t134;
    	let em5;
    	let t136;
    	let t137;
    	let h43;
    	let t139;
    	let p18;
    	let t141;
    	let p19;
    	let t143;
    	let p20;
    	let t145;
    	let h44;
    	let t147;
    	let p21;
    	let t149;
    	let h22;
    	let t151;
    	let ol2;
    	let li8;
    	let strong10;
    	let t153;
    	let img5;
    	let img5_src_value;
    	let t154;
    	let t155;
    	let li9;
    	let strong11;
    	let t157;
    	let img6;
    	let img6_src_value;
    	let t158;
    	let t159;
    	let li10;
    	let strong12;
    	let t161;
    	let img7;
    	let img7_src_value;
    	let t162;
    	let t163;
    	let li11;
    	let strong13;
    	let t165;
    	let img8;
    	let img8_src_value;
    	let t166;
    	let em6;
    	let t168;
    	let t169;
    	let li12;
    	let strong14;
    	let t171;
    	let img9;
    	let img9_src_value;
    	let t172;
    	let em7;
    	let t174;
    	let t175;
    	let h23;
    	let t177;
    	let ul;
    	let li13;
    	let t178;
    	let small0;
    	let t180;
    	let li14;
    	let em8;
    	let t182;
    	let small1;
    	let t184;
    	let li15;
    	let t185;
    	let em9;
    	let t187;
    	let small2;
    	let t189;
    	let li16;
    	let t190;
    	let em10;
    	let t192;
    	let small3;
    	let t194;
    	let li17;
    	let t195;
    	let em11;
    	let t197;
    	let small4;
    	let t199;
    	let li18;
    	let t200;
    	let em12;
    	let t202;
    	let small5;
    	let t204;
    	let li19;
    	let t205;
    	let small6;
    	let t207;
    	let li20;
    	let t208;
    	let small7;
    	let t210;
    	let h24;
    	let t212;
    	let p22;
    	let t213;
    	let a8;
    	let em13;
    	let t215;
    	let a9;
    	let em14;
    	let t217;
    	let a10;
    	let em15;
    	let t219;
    	let t220;
    	let h25;
    	let t222;
    	let p23;
    	let t223;
    	let a11;
    	let t225;
    	let a12;
    	let t227;
    	let a13;
    	let t229;
    	let a14;
    	let t231;
    	let a15;
    	let t233;
    	let a16;
    	let t235;
    	let a17;
    	let t237;
    	let a18;
    	let t239;
    	let current;
    	let mounted;
    	let dispose;
    	const hyperparameterview = new Hyperparameterview({ $$inline: true });

    	const block = {
    		c: function create() {
    			body = element("body");
    			div8 = element("div");
    			h20 = element("h2");
    			h20.textContent = "What is a Convolutional Neural Network?";
    			t1 = space();
    			p0 = element("p");
    			t2 = text("In machine learning, a classifier assigns a class label to a data point.  For example, an ");
    			em0 = element("em");
    			em0.textContent = "image classifier";
    			t4 = text(" produces a class label (e.g, bird, plane) for what objects exist within an image.  A ");
    			em1 = element("em");
    			em1.textContent = "convolutional neural network";
    			t6 = text(", or CNN for short, is a type of classifier, which excels at solving this problem!");
    			t7 = space();
    			p1 = element("p");
    			p1.textContent = "A CNN is a neural network: an algorithm used to recognize patterns in data. Neural Networks in general are composed of a collection of neurons that are organized in layers, each with their own learnable weights and biases.  Let’s break down a CNN into its basic building blocks.";
    			t9 = space();
    			ol0 = element("ol");
    			li0 = element("li");
    			t10 = text("A ");
    			strong0 = element("strong");
    			strong0.textContent = "tensor";
    			t12 = text(" can be thought of as an n-dimensional matrix.  In the CNN above, tensors will be 3-dimensional with the exception of the output layer.");
    			t13 = space();
    			li1 = element("li");
    			t14 = text("A ");
    			strong1 = element("strong");
    			strong1.textContent = "neuron";
    			t16 = text(" can be thought of as a function that takes in multiple inputs and yields a single output.  The outputs of neurons are represented above as the ");
    			span0 = element("span");
    			span0.textContent = "red";
    			t18 = text(" → ");
    			span1 = element("span");
    			span1.textContent = "blue";
    			t20 = space();
    			strong2 = element("strong");
    			strong2.textContent = "activation maps";
    			t22 = text(".");
    			t23 = space();
    			li2 = element("li");
    			t24 = text("A ");
    			strong3 = element("strong");
    			strong3.textContent = "layer";
    			t26 = text(" is simply a collection of neurons with the same operation, including the same hyperparameters.");
    			t27 = space();
    			li3 = element("li");
    			strong4 = element("strong");
    			strong4.textContent = "Kernel weights and biases";
    			t29 = text(", while unique to each neuron, are tuned during the training phase, and allow the classifier to adapt to the problem and dataset provided.  They are encoded in the visualization with a ");
    			span2 = element("span");
    			span2.textContent = "yellow";
    			t31 = text(" → ");
    			span3 = element("span");
    			span3.textContent = "green";
    			t33 = text(" diverging colorscale.  The specific values can be viewed in the ");
    			em2 = element("em");
    			em2.textContent = "Interactive Formula View";
    			t35 = text(" by clicking a neuron or by hovering over the kernel/bias in the ");
    			em3 = element("em");
    			em3.textContent = "Convolutional Elastic Explanation View";
    			t37 = text(".");
    			t38 = space();
    			li4 = element("li");
    			t39 = text("A CNN conveys a ");
    			strong5 = element("strong");
    			strong5.textContent = "differentiable score function";
    			t41 = text(", which is represented as ");
    			strong6 = element("strong");
    			strong6.textContent = "class scores";
    			t43 = text(" in the visualization on the output layer.");
    			t44 = space();
    			p2 = element("p");
    			t45 = text("If you have studied neural networks before, these terms may sound familiar to you.  So what makes a CNN different? CNNs utilize a special type of layer, aptly named a convolutional layer, that makes them well-positioned to learn from image and image-like data.  Regarding image data, CNNs can be used for many different computer vision tasks, such as ");
    			a0 = element("a");
    			a0.textContent = "image processing, classification, segmentation, and object detection";
    			t47 = text(".");
    			t48 = space();
    			p3 = element("p");
    			t49 = text("In CNN Explainer, you can see how a simple CNN can be used for image classification.  Because of the network’s simplicity, its performance isn’t perfect, but that’s okay! The network architecture, ");
    			a1 = element("a");
    			a1.textContent = "Tiny VGG";
    			t51 = text(", used in CNN Explainer contains many of the same layers and operations used in state-of-the-art CNNs today, but on a smaller scale.  This way, it will be easier to understand getting started.");
    			t52 = space();
    			h21 = element("h2");
    			h21.textContent = "What does each layer of the network do?";
    			t54 = space();
    			p4 = element("p");
    			p4.textContent = "Let’s walk through each layer in the network.  Feel free to interact with the visualization above by clicking and hovering over various parts of it as you read.";
    			t56 = space();
    			h40 = element("h4");
    			h40.textContent = "Input Layer";
    			t58 = space();
    			p5 = element("p");
    			t59 = text("The input layer (leftmost layer) represents the input image into the CNN.  Because we use RGB images as input, the input layer has three channels, corresponding to the red, green, and blue channels, respectively, which are shown in this layer. Use the color scale when you click on the ");
    			img0 = element("img");
    			t60 = text(" icon above to display detailed information (on this layer, and others).");
    			t61 = space();
    			h41 = element("h4");
    			h41.textContent = "Convolutional Layers";
    			t63 = space();
    			p6 = element("p");
    			p6.textContent = "The convolutional layers are the foundation of CNN, as they contain the learned kernels (weights), which extract features that distinguish different images from one another—this is what we want for classification!  As you interact with the convolutional layer, you will notice links between the previous layers and the convolutional layers.  Each link represents a unique kernel, which is used for the convolution operation to produce the current convolutional neuron’s output or activation map.";
    			t65 = space();
    			p7 = element("p");
    			p7.textContent = "The convolutional neuron performs an elementwise dot product with a unique kernel and the output of the previous layer’s corresponding neuron.  This will yield as many intermediate results as there are unique kernels.  The convolutional neuron is the result of all of the intermediate results summed together with the learned bias.";
    			t67 = space();
    			p8 = element("p");
    			p8.textContent = "For example, let’s look at the first convolutional layer in the Tiny VGG architecture above.  Notice that there are 10 neurons in this layer, but only 3 neurons in the previous layer.  In the Tiny VGG architecture, convolutional layers are fully-connected, meaning each neuron is connected to every other neuron in the previous layer.  Focusing on the output of the topmost convolutional neuron from the first convolutional layer, we see that there are 3 unique kernels when we hover over the activation map.";
    			t69 = space();
    			div1 = element("div");
    			img1 = element("img");
    			t70 = space();
    			div0 = element("div");
    			div0.textContent = "Figure 1.  As you hover over the activation map of the topmost node from the first convolutional layer, you can see that 3 kernels were applied to yield this activation map.  After clicking this activation map, you can see the convolution operation occuring with each unique kernel.";
    			t72 = space();
    			p9 = element("p");
    			p9.textContent = "The size of these kernels is a hyper-parameter specified by the designers of the network architecture.  In order to produce the output of the convolutional neuron (activation map), we must perform an elementwise dot product with the output of the previous layer and the unique kernel learned by the network.  In TinyVGG, the dot product operation uses a stride of 1, which means that the kernel is shifted over 1 pixel per dot product, but this is a hyperparameter that the network architecture designer can adjust to better fit their dataset.  We must do this for all 3 kernels, which will yield 3 intermediate results.";
    			t74 = space();
    			div3 = element("div");
    			img2 = element("img");
    			t75 = space();
    			div2 = element("div");
    			div2.textContent = "Figure 2. The kernel being applied to yield the topmost intermediate result for the discussed activation map.";
    			t77 = space();
    			p10 = element("p");
    			p10.textContent = "Then, an elementwise sum is performed containing all 3 intermediate results along with the bias the network has learned.  After this, the resulting 2-dimensional tensor will be the activation map viewable on the interface above for the topmost neuron in the first convolutional layer.  This same operation must be applied to produce each neuron’s activation map.";
    			t79 = space();
    			p11 = element("p");
    			p11.textContent = "With some simple math, we are able to deduce that there are 3 x 10 = 30 unique kernels, each of size 3x3, applied in the first convolutional layer.  The connectivity between the convolutional layer and the previous layer is a design decision when building a network architecture, which will affect the number of kernels per convolutional layer.  Click around the visualization to better understand the operations behind the convolutional layer.  See if you can follow the example above!";
    			t81 = space();
    			h60 = element("h6");
    			h60.textContent = "Understanding Hyperparameters";
    			t83 = space();
    			p12 = element("p");
    			create_component(hyperparameterview.$$.fragment);
    			t84 = space();
    			ol1 = element("ol");
    			li5 = element("li");
    			strong7 = element("strong");
    			strong7.textContent = "Padding";
    			t86 = text(" is often necessary when the kernel extends beyond the activation map.  Padding conserves data at the borders of activation maps, which leads to better performance, and it can help ");
    			a2 = element("a");
    			a2.textContent = "preserve the input's spatial size";
    			t88 = text(", which allows an architecture designer to build depper, higher performing networks.  There exist ");
    			a3 = element("a");
    			a3.textContent = "many padding techniques";
    			t90 = text(", but the most commonly used approach is zero-padding because of its performance, simplicity, and computational efficiency.  The technique involves adding zeros symmetrically around the edges of an input.  This approach is adopted by many high-performing CNNs such as ");
    			a4 = element("a");
    			a4.textContent = "AlexNet";
    			t92 = text(".");
    			t93 = space();
    			li6 = element("li");
    			strong8 = element("strong");
    			strong8.textContent = "Kernel size";
    			t95 = text(", often also referred to as filter size, refers to the dimensions of the sliding window over the input.  Choosing this hyperparameter has a massive impact on the image classification task.  For example, small kernel sizes are able to extract a much larger amount of information containing highly local features from the input.  As you can see on the visualization above, a smaller kernel size also leads to a smaller reduction in layer dimensions, which allows for a deeper architecture.  Conversely, a large kernel size extracts less information, which leads to a faster reduction in layer dimensions, often leading to worse performance.  Large kernels are better suited to extract features that are larger.  At the end of the day, choosing an appropriate kernel size will be dependent on your task and dataset, but generally, smaller kernel sizes lead to better performance for the image classification task because an architecture designer is able to stack ");
    			a5 = element("a");
    			a5.textContent = "more and more layers together to learn more and more complex features";
    			t97 = text("!");
    			t98 = space();
    			li7 = element("li");
    			strong9 = element("strong");
    			strong9.textContent = "Stride";
    			t100 = text(" indicates how many pixels the kernel should be shifted over at a time.  For example, as described in the convolutional layer example above, Tiny VGG uses a stride of 1 for its convolutional layers, which means that the dot product is performed on a 3x3 window of the input to yield an output value, then is shifted to the right by one pixel for every subsequent operation.  The impact stride has on a CNN is similar to kernel size.  As stride is decreased, more features are learned because more data is extracted, which also leads to larger output layers.  On the contrary, as stride is increased, this leads to more limited feature extraction and smaller output layer dimensions.  One responsibility of the architecture designer is to ensure that the kernel slides across the input symmetrically when implementing a CNN.  Use the hyperparameter visualization above to alter stride on various input/kernel dimensions to understand this constraint!");
    			t101 = space();
    			h42 = element("h4");
    			h42.textContent = "Activation Functions";
    			t103 = space();
    			h61 = element("h6");
    			h61.textContent = "ReLU";
    			t105 = space();
    			p13 = element("p");
    			t106 = text("Neural networks are extremely prevalent in modern technology—because they are so accurate!  The highest performing CNNs today consist of an absurd amount of layers, which are able to learn more and more features.  Part of the reason these groundbreaking CNNs are able to achieve such ");
    			a6 = element("a");
    			a6.textContent = "tremendous accuracies";
    			t108 = text(" is because of their non-linearity.  ReLU applies much-needed non-linearity into the model.  Non-linearity is necessary to produce non-linear decision boundaries, so that the output cannot be written as a linear combination of the inputs.  If a non-linear activation function was not present, deep CNN architectures would devolve into a single, equivalent convolutional layer, which would not perform nearly as well.  The ReLU activation function is specifically used as a non-linear activation function, as opposed to other non-linear functions such as ");
    			em4 = element("em");
    			em4.textContent = "Sigmoid";
    			t110 = text(" because it has been ");
    			a7 = element("a");
    			a7.textContent = "empirically observed";
    			t112 = text(" that CNNs using ReLU are faster to train than their counterparts.");
    			t113 = space();
    			p14 = element("p");

    			p14.textContent = `
  	The ReLU activation function is a one-to-one mathematical operation: ${/*reluEquation*/ ctx[1]}`;

    			t116 = space();
    			div5 = element("div");
    			img3 = element("img");
    			t117 = space();
    			div4 = element("div");
    			div4.textContent = "Figure 3. The ReLU activation function graphed, which disregards all negative data.";
    			t119 = space();
    			p15 = element("p");
    			p15.textContent = "This activation function is applied elementwise on every value from the input tensor.  For example, if applied ReLU on the value 2.24, the result would be 2.24, since 2.24 is larger than 0.  You can observe how this activation function is applied by clicking a ReLU neuron in the network above.  The Rectified Linear Activation function (ReLU) is performed after every convolutional layer in the network architecture outlined above.  Notice the impact this layer has on the activation map of various neurons throughout the network!";
    			t121 = space();
    			h62 = element("h6");
    			h62.textContent = "Softmax";
    			t123 = space();
    			p16 = element("p");
    			t124 = text(/*softmaxEquation*/ ctx[0]);
    			t125 = text("\r\n    \tA softmax operation serves a key purpose: making sure the CNN outputs sum to 1.  Because of this, softmax operations are useful to scale model outputs into probabilities.  Clicking on the last layer reveals the softmax operation in the network. Notice how the logits after flatten aren’t scaled between zero to one.  For a visual indication of the impact of each logit (unscaled scalar value), they are encoded using a ");
    			span4 = element("span");
    			span4.textContent = "light orange";
    			t127 = text(" → ");
    			span5 = element("span");
    			span5.textContent = "dark orange";
    			t129 = text(" color scale.  After passing through the softmax function, each class now corresponds to an appropriate probability!");
    			t130 = space();
    			p17 = element("p");
    			p17.textContent = "You might be thinking what the difference between standard normalization and softmax is—after all, both rescale the logits between 0 and 1.  Remember that backpropagation is a key aspect of training neural networks—we want the correct answer to have the largest “signal.” By using softmax, we are effectively “approximating” argmax while gaining differentiability.  Rescaling doesn’t weigh the max significantly higher than other logits, whereas softmax does.  Simply put, softmax is a “softer” argmax—see what we did there?";
    			t132 = space();
    			div7 = element("div");
    			img4 = element("img");
    			t133 = space();
    			div6 = element("div");
    			t134 = text("Figure 4. The ");
    			em5 = element("em");
    			em5.textContent = "Softmax Interactive Formula View";
    			t136 = text(" allows a user to interact with both the color encoded logits and formula to understand how the prediction scores after the flatten layer are normalized to yield classification scores.");
    			t137 = space();
    			h43 = element("h4");
    			h43.textContent = "Pooling Layers";
    			t139 = space();
    			p18 = element("p");
    			p18.textContent = "There are many types of pooling layers in different CNN architectures, but they all have the purpose of gradually decreasing the spatial extent of the network, which reduces the parameters and overall computation of the network.  The type of pooling used in the Tiny VGG architecture above is Max-Pooling.";
    			t141 = space();
    			p19 = element("p");
    			p19.textContent = "The Max-Pooling operation requires selecting a kernel size and a stride length during architecture design.  Once selected, the operation slides the kernel with the specified stride over the input while only selecting the largest value at each kernel slice from the input to yield a value for the output.  This process can be viewed by clicking a pooling neuron in the network above.";
    			t143 = space();
    			p20 = element("p");
    			p20.textContent = "In the Tiny VGG architecture above, the pooling layers use a 2x2 kernel and a stride of 2.  This operation with these specifications results in the discarding of 75% of activations.  By discarding so many values, Tiny VGG is more computationally efficient and avoids overfitting.";
    			t145 = space();
    			h44 = element("h4");
    			h44.textContent = "Flatten Layer";
    			t147 = space();
    			p21 = element("p");
    			p21.textContent = "This layer converts a three-dimensional layer in the network into a one-dimensional vector to fit the  input of a fully-connected layer for classification.  For example, a 5x5x2 tensor would be converted into a vector of size 50.  The previous convolutional layers of the network extracted the features from the input image, but now it is time to classify the features.  We use the softmax function to classify these features, which requires a 1-dimensional input.  This is why the flatten layer is necessary.  This layer can be viewed by clicking any output class.";
    			t149 = space();
    			h22 = element("h2");
    			h22.textContent = "Interactive features";
    			t151 = space();
    			ol2 = element("ol");
    			li8 = element("li");
    			strong10 = element("strong");
    			strong10.textContent = "Upload your own image";
    			t153 = text(" by selecting ");
    			img5 = element("img");
    			t154 = text(" to understand how your image is classified into the 10 classes.  By analyzing the neurons throughout the network, you can understand the activations maps and extracted features.");
    			t155 = space();
    			li9 = element("li");
    			strong11 = element("strong");
    			strong11.textContent = "Change the activation map colorscale";
    			t157 = text(" to better understand the impact of activations at different levels of abstraction by adjusting ");
    			img6 = element("img");
    			t158 = text(".");
    			t159 = space();
    			li10 = element("li");
    			strong12 = element("strong");
    			strong12.textContent = "Understand network details";
    			t161 = text(" such as layer dimensions and colorscales by clicking the ");
    			img7 = element("img");
    			t162 = text(" icon.");
    			t163 = space();
    			li11 = element("li");
    			strong13 = element("strong");
    			strong13.textContent = "Simulate network operations";
    			t165 = text(" by clicking the ");
    			img8 = element("img");
    			t166 = text(" button or interact with the layer slice in the ");
    			em6 = element("em");
    			em6.textContent = "Interactive Formula View";
    			t168 = text(" by hovering over portions of the input or output to understand the mappings and underlying operations.");
    			t169 = space();
    			li12 = element("li");
    			strong14 = element("strong");
    			strong14.textContent = "Learn layer functions";
    			t171 = text(" by clicking ");
    			img9 = element("img");
    			t172 = text(" from the ");
    			em7 = element("em");
    			em7.textContent = "Interactive Formula View";
    			t174 = text(" to read layer details from the article.");
    			t175 = space();
    			h23 = element("h2");
    			h23.textContent = "Video Tutorial";
    			t177 = space();
    			ul = element("ul");
    			li13 = element("li");
    			t178 = text("CNN Explainer Introduction\r\n        ");
    			small0 = element("small");
    			small0.textContent = "(0:00-0:22)";
    			t180 = space();
    			li14 = element("li");
    			em8 = element("em");
    			em8.textContent = "Overview";
    			t182 = space();
    			small1 = element("small");
    			small1.textContent = "(0:27-0:37)";
    			t184 = space();
    			li15 = element("li");
    			t185 = text("Convolutional ");
    			em9 = element("em");
    			em9.textContent = "Elastic Explanation View";
    			t187 = space();
    			small2 = element("small");
    			small2.textContent = "(0:37-0:46)";
    			t189 = space();
    			li16 = element("li");
    			t190 = text("Convolutional, ReLU, and Pooling ");
    			em10 = element("em");
    			em10.textContent = "Interactive Formula Views";
    			t192 = space();
    			small3 = element("small");
    			small3.textContent = "(0:46-1:21)";
    			t194 = space();
    			li17 = element("li");
    			t195 = text("Flatten ");
    			em11 = element("em");
    			em11.textContent = "Elastic Explanation View";
    			t197 = space();
    			small4 = element("small");
    			small4.textContent = "(1:22-1:41)";
    			t199 = space();
    			li18 = element("li");
    			t200 = text("Softmax ");
    			em12 = element("em");
    			em12.textContent = "Interactive Formula View";
    			t202 = space();
    			small5 = element("small");
    			small5.textContent = "(1:41-2:02)";
    			t204 = space();
    			li19 = element("li");
    			t205 = text("Engaging Learning Experience: Understanding Classification\r\n        ");
    			small6 = element("small");
    			small6.textContent = "(2:06-2:28)";
    			t207 = space();
    			li20 = element("li");
    			t208 = text("Interactive Tutorial Article\r\n        ");
    			small7 = element("small");
    			small7.textContent = "(2:29-2:54)";
    			t210 = space();
    			h24 = element("h2");
    			h24.textContent = "How is CNN Explainer implemented?";
    			t212 = space();
    			p22 = element("p");
    			t213 = text("CNN Explainer uses ");
    			a8 = element("a");
    			em13 = element("em");
    			em13.textContent = "TensorFlow.js";
    			t215 = text(", an in-browser GPU-accelerated deep learning library to load the pretrained model for visualization.  The entire interactive system is written in Javascript using ");
    			a9 = element("a");
    			em14 = element("em");
    			em14.textContent = "Svelte";
    			t217 = text(" as a framework and ");
    			a10 = element("a");
    			em15 = element("em");
    			em15.textContent = "D3.js";
    			t219 = text(" for visualizations. You only need a web browser to get started learning CNNs today!");
    			t220 = space();
    			h25 = element("h2");
    			h25.textContent = "Who developed CNN Explainer?";
    			t222 = space();
    			p23 = element("p");
    			t223 = text("CNN Explainer was created by \r\n      ");
    			a11 = element("a");
    			a11.textContent = "Jay Wang";
    			t225 = text(",\r\n      ");
    			a12 = element("a");
    			a12.textContent = "Robert Turko";
    			t227 = text(", \r\n      ");
    			a13 = element("a");
    			a13.textContent = "Omar Shaikh";
    			t229 = text(",\r\n      ");
    			a14 = element("a");
    			a14.textContent = "Haekyu Park";
    			t231 = text(",\r\n      ");
    			a15 = element("a");
    			a15.textContent = "Nilaksh Das";
    			t233 = text(",\r\n      ");
    			a16 = element("a");
    			a16.textContent = "Fred Hohman";
    			t235 = text(",\r\n      ");
    			a17 = element("a");
    			a17.textContent = "Minsuk Kahng";
    			t237 = text(", and\r\n      ");
    			a18 = element("a");
    			a18.textContent = "Polo Chau";
    			t239 = text(",\r\n      which was the result of a research collaboration between \r\n      Georgia Tech and Oregon State.  We thank Anmol Chhabria, Kaan Sancak, Kantwon Rogers, and the Georgia Tech Visualization Lab for their support and constructive feedback.  This work was supported in part by NSF grants IIS-1563816, CNS-1704701, NASA NSTRF, DARPA GARD, gifts from Intel, NVIDIA, Google, Amazon.");
    			attr_dev(h20, "class", "svelte-ixpg0w");
    			add_location(h20, file$f, 104, 4, 1913);
    			add_location(em0, file$f, 106, 92, 2064);
    			add_location(em1, file$f, 106, 203, 2175);
    			attr_dev(p0, "class", "svelte-ixpg0w");
    			add_location(p0, file$f, 105, 4, 1967);
    			attr_dev(p1, "class", "svelte-ixpg0w");
    			add_location(p1, file$f, 108, 3, 2307);
    			add_location(strong0, file$f, 112, 10, 2624);
    			attr_dev(li0, "class", "svelte-ixpg0w");
    			add_location(li0, file$f, 112, 4, 2618);
    			add_location(strong1, file$f, 113, 10, 2799);
    			set_style(span0, "color", "#FF7577");
    			add_location(span0, file$f, 113, 177, 2966);
    			set_style(span1, "color", "#60A7D7");
    			add_location(span1, file$f, 113, 224, 3013);
    			add_location(strong2, file$f, 113, 265, 3054);
    			attr_dev(li1, "class", "svelte-ixpg0w");
    			add_location(li1, file$f, 113, 4, 2793);
    			add_location(strong3, file$f, 114, 10, 3104);
    			attr_dev(li2, "class", "svelte-ixpg0w");
    			add_location(li2, file$f, 114, 4, 3098);
    			add_location(strong4, file$f, 115, 8, 3236);
    			set_style(span2, "color", "#BC8435");
    			add_location(span2, file$f, 115, 235, 3463);
    			set_style(span3, "color", "#39988F");
    			add_location(span3, file$f, 115, 285, 3513);
    			add_location(em2, file$f, 115, 391, 3619);
    			add_location(em3, file$f, 115, 489, 3717);
    			attr_dev(li3, "class", "svelte-ixpg0w");
    			add_location(li3, file$f, 115, 4, 3232);
    			add_location(strong5, file$f, 116, 24, 3796);
    			add_location(strong6, file$f, 116, 96, 3868);
    			attr_dev(li4, "class", "svelte-ixpg0w");
    			add_location(li4, file$f, 116, 4, 3776);
    			attr_dev(ol0, "class", "svelte-ixpg0w");
    			add_location(ol0, file$f, 111, 3, 2608);
    			attr_dev(a0, "href", "http://ijcsit.com/docs/Volume%207/vol7issue5/ijcsit20160705014.pdf");
    			attr_dev(a0, "title", "CNN Applications");
    			attr_dev(a0, "class", "svelte-ixpg0w");
    			add_location(a0, file$f, 119, 355, 4320);
    			attr_dev(p2, "class", "svelte-ixpg0w");
    			add_location(p2, file$f, 118, 3, 3960);
    			attr_dev(a1, "href", "http://cs231n.stanford.edu/");
    			attr_dev(a1, "title", "Tiny VGG Net presented by Stanford's CS231n");
    			attr_dev(a1, "class", "svelte-ixpg0w");
    			add_location(a1, file$f, 122, 201, 4717);
    			attr_dev(p3, "class", "svelte-ixpg0w");
    			add_location(p3, file$f, 121, 3, 4511);
    			attr_dev(h21, "class", "svelte-ixpg0w");
    			add_location(h21, file$f, 125, 6, 5038);
    			attr_dev(p4, "class", "svelte-ixpg0w");
    			add_location(p4, file$f, 126, 6, 5094);
    			attr_dev(h40, "id", "article-input");
    			attr_dev(h40, "class", "svelte-ixpg0w");
    			add_location(h40, file$f, 129, 6, 5284);
    			attr_dev(img0, "class", "is-rounded svelte-ixpg0w");
    			attr_dev(img0, "width", "12%");
    			attr_dev(img0, "height", "12%");
    			if (img0.src !== (img0_src_value = "/assets/figures/network_details.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "alt", "network details icon");
    			add_location(img0, file$f, 131, 293, 5629);
    			attr_dev(p5, "class", "svelte-ixpg0w");
    			add_location(p5, file$f, 130, 6, 5331);
    			attr_dev(h41, "id", "article-convolution");
    			attr_dev(h41, "class", "svelte-ixpg0w");
    			add_location(h41, file$f, 133, 6, 5850);
    			attr_dev(p6, "class", "svelte-ixpg0w");
    			add_location(p6, file$f, 134, 6, 5912);
    			attr_dev(p7, "class", "svelte-ixpg0w");
    			add_location(p7, file$f, 137, 3, 6438);
    			attr_dev(p8, "class", "svelte-ixpg0w");
    			add_location(p8, file$f, 140, 3, 6792);
    			if (img1.src !== (img1_src_value = "/assets/figures/convlayer_overview_demo.gif")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "clicking on topmost first conv. layer activation map");
    			attr_dev(img1, "width", "60%");
    			attr_dev(img1, "height", "60%");
    			attr_dev(img1, "align", "middle");
    			attr_dev(img1, "class", "svelte-ixpg0w");
    			add_location(img1, file$f, 144, 6, 7354);
    			attr_dev(div0, "class", "figure-caption svelte-ixpg0w");
    			add_location(div0, file$f, 145, 6, 7523);
    			attr_dev(div1, "class", "figure svelte-ixpg0w");
    			add_location(div1, file$f, 143, 4, 7326);
    			attr_dev(p9, "class", "svelte-ixpg0w");
    			add_location(p9, file$f, 150, 3, 7873);
    			if (img2.src !== (img2_src_value = "/assets/figures/convlayer_detailedview_demo.gif")) attr_dev(img2, "src", img2_src_value);
    			attr_dev(img2, "alt", "clicking on topmost first conv. layer activation map");
    			attr_dev(img2, "class", "svelte-ixpg0w");
    			add_location(img2, file$f, 154, 6, 8547);
    			attr_dev(div2, "class", "figure-caption svelte-ixpg0w");
    			add_location(div2, file$f, 155, 6, 8685);
    			attr_dev(div3, "class", "figure svelte-ixpg0w");
    			add_location(div3, file$f, 153, 4, 8519);
    			attr_dev(p10, "class", "svelte-ixpg0w");
    			add_location(p10, file$f, 159, 3, 8863);
    			attr_dev(p11, "class", "svelte-ixpg0w");
    			add_location(p11, file$f, 162, 3, 9248);
    			attr_dev(h60, "class", "svelte-ixpg0w");
    			add_location(h60, file$f, 165, 4, 9759);
    			attr_dev(p12, "class", "svelte-ixpg0w");
    			add_location(p12, file$f, 166, 4, 9803);
    			add_location(strong7, file$f, 170, 9, 9865);
    			attr_dev(a2, "href", "https://arxiv.org/pdf/1603.07285.pdf");
    			attr_dev(a2, "title", "See page 13");
    			attr_dev(a2, "class", "svelte-ixpg0w");
    			add_location(a2, file$f, 170, 214, 10070);
    			attr_dev(a3, "href", "https://arxiv.org/pdf/1811.11718.pdf");
    			attr_dev(a3, "title", "Outlines major padding techniques");
    			attr_dev(a3, "class", "svelte-ixpg0w");
    			add_location(a3, file$f, 170, 416, 10272);
    			attr_dev(a4, "href", "https://papers.nips.cc/paper/4824-imagenet-classification-with-deep-convolutional-neural-networks.pdf");
    			attr_dev(a4, "title", "AlexNet");
    			attr_dev(a4, "class", "svelte-ixpg0w");
    			add_location(a4, file$f, 170, 800, 10656);
    			attr_dev(li5, "class", "svelte-ixpg0w");
    			add_location(li5, file$f, 170, 5, 9861);
    			add_location(strong8, file$f, 171, 9, 10812);
    			attr_dev(a5, "href", "https://arxiv.org/pdf/1409.1556.pdf");
    			attr_dev(a5, "title", "Learn why deeper networks perform better!");
    			attr_dev(a5, "class", "svelte-ixpg0w");
    			add_location(a5, file$f, 171, 997, 11800);
    			attr_dev(li6, "class", "svelte-ixpg0w");
    			add_location(li6, file$f, 171, 5, 10808);
    			add_location(strong9, file$f, 172, 9, 11986);
    			attr_dev(li7, "class", "svelte-ixpg0w");
    			add_location(li7, file$f, 172, 5, 11982);
    			attr_dev(ol1, "class", "svelte-ixpg0w");
    			add_location(ol1, file$f, 169, 4, 9850);
    			attr_dev(h42, "class", "svelte-ixpg0w");
    			add_location(h42, file$f, 174, 4, 12980);
    			attr_dev(h61, "id", "article-relu");
    			attr_dev(h61, "class", "svelte-ixpg0w");
    			add_location(h61, file$f, 175, 4, 13015);
    			attr_dev(a6, "href", "https://arxiv.org/pdf/1512.03385.pdf");
    			attr_dev(a6, "title", "ResNet");
    			attr_dev(a6, "class", "svelte-ixpg0w");
    			add_location(a6, file$f, 177, 295, 13352);
    			add_location(em4, file$f, 177, 936, 13993);
    			attr_dev(a7, "href", "https://arxiv.org/pdf/1906.01975.pdf");
    			attr_dev(a7, "title", "See page 29");
    			attr_dev(a7, "class", "svelte-ixpg0w");
    			add_location(a7, file$f, 177, 973, 14030);
    			attr_dev(p13, "class", "svelte-ixpg0w");
    			add_location(p13, file$f, 176, 4, 13052);
    			attr_dev(p14, "class", "svelte-ixpg0w");
    			add_location(p14, file$f, 179, 4, 14203);
    			if (img3.src !== (img3_src_value = "/assets/figures/relu_graph.svg")) attr_dev(img3, "src", img3_src_value);
    			attr_dev(img3, "alt", "relu graph");
    			attr_dev(img3, "width", "30%");
    			attr_dev(img3, "height", "30%");
    			attr_dev(img3, "class", "svelte-ixpg0w");
    			add_location(img3, file$f, 183, 4, 14336);
    			attr_dev(div4, "class", "figure-caption svelte-ixpg0w");
    			add_location(div4, file$f, 184, 6, 14439);
    			attr_dev(div5, "class", "figure svelte-ixpg0w");
    			add_location(div5, file$f, 182, 4, 14310);
    			attr_dev(p15, "class", "svelte-ixpg0w");
    			add_location(p15, file$f, 188, 4, 14592);
    			attr_dev(h62, "id", "article-softmax");
    			attr_dev(h62, "class", "svelte-ixpg0w");
    			add_location(h62, file$f, 191, 4, 15147);
    			set_style(span4, "color", "#FFC385");
    			add_location(span4, file$f, 194, 424, 15643);
    			set_style(span5, "color", "#C44103");
    			add_location(span5, file$f, 194, 480, 15699);
    			attr_dev(p16, "class", "svelte-ixpg0w");
    			add_location(p16, file$f, 192, 4, 15190);
    			attr_dev(p17, "class", "svelte-ixpg0w");
    			add_location(p17, file$f, 196, 4, 15879);
    			if (img4.src !== (img4_src_value = "/assets/figures/softmax_animation.gif")) attr_dev(img4, "src", img4_src_value);
    			attr_dev(img4, "alt", "softmax interactive formula view");
    			attr_dev(img4, "class", "svelte-ixpg0w");
    			add_location(img4, file$f, 200, 4, 16473);
    			add_location(em5, file$f, 202, 22, 16632);
    			attr_dev(div6, "class", "figure-caption svelte-ixpg0w");
    			add_location(div6, file$f, 201, 6, 16580);
    			attr_dev(div7, "class", "figure svelte-ixpg0w");
    			add_location(div7, file$f, 199, 4, 16447);
    			attr_dev(h43, "id", "article-pooling");
    			attr_dev(h43, "class", "svelte-ixpg0w");
    			add_location(h43, file$f, 205, 4, 16889);
    			attr_dev(p18, "class", "svelte-ixpg0w");
    			add_location(p18, file$f, 206, 4, 16939);
    			attr_dev(p19, "class", "svelte-ixpg0w");
    			add_location(p19, file$f, 209, 4, 17270);
    			attr_dev(p20, "class", "svelte-ixpg0w");
    			add_location(p20, file$f, 212, 4, 17678);
    			attr_dev(h44, "id", "article-flatten");
    			attr_dev(h44, "class", "svelte-ixpg0w");
    			add_location(h44, file$f, 215, 4, 17983);
    			attr_dev(p21, "class", "svelte-ixpg0w");
    			add_location(p21, file$f, 216, 4, 18032);
    			attr_dev(h22, "class", "svelte-ixpg0w");
    			add_location(h22, file$f, 220, 4, 18634);
    			add_location(strong10, file$f, 222, 9, 18684);
    			attr_dev(img5, "class", "icon is-rounded svelte-ixpg0w");
    			if (img5.src !== (img5_src_value = "/assets/figures/upload_image_icon.png")) attr_dev(img5, "src", img5_src_value);
    			attr_dev(img5, "alt", "upload image icon");
    			add_location(img5, file$f, 222, 61, 18736);
    			attr_dev(li8, "class", "svelte-ixpg0w");
    			add_location(li8, file$f, 222, 5, 18680);
    			add_location(strong11, file$f, 223, 9, 19038);
    			attr_dev(img6, "class", "is-rounded svelte-ixpg0w");
    			attr_dev(img6, "width", "12%");
    			attr_dev(img6, "height", "12%");
    			if (img6.src !== (img6_src_value = "/assets/figures/heatmap_scale.png")) attr_dev(img6, "src", img6_src_value);
    			attr_dev(img6, "alt", "heatmap");
    			add_location(img6, file$f, 223, 158, 19187);
    			attr_dev(li9, "class", "svelte-ixpg0w");
    			add_location(li9, file$f, 223, 5, 19034);
    			add_location(strong12, file$f, 224, 9, 19318);
    			attr_dev(img7, "class", "is-rounded svelte-ixpg0w");
    			attr_dev(img7, "width", "12%");
    			attr_dev(img7, "height", "12%");
    			if (img7.src !== (img7_src_value = "/assets/figures/network_details.png")) attr_dev(img7, "src", img7_src_value);
    			attr_dev(img7, "alt", "network details icon");
    			add_location(img7, file$f, 224, 110, 19419);
    			attr_dev(li10, "class", "svelte-ixpg0w");
    			add_location(li10, file$f, 224, 5, 19314);
    			add_location(strong13, file$f, 225, 9, 19570);
    			attr_dev(img8, "class", "icon is-rounded svelte-ixpg0w");
    			if (img8.src !== (img8_src_value = "/assets/figures/play_button.png")) attr_dev(img8, "src", img8_src_value);
    			attr_dev(img8, "alt", "play icon");
    			add_location(img8, file$f, 225, 70, 19631);
    			add_location(em6, file$f, 225, 212, 19773);
    			attr_dev(li11, "class", "svelte-ixpg0w");
    			add_location(li11, file$f, 225, 5, 19566);
    			add_location(strong14, file$f, 226, 10, 19926);
    			attr_dev(img9, "class", "icon is-rounded svelte-ixpg0w");
    			if (img9.src !== (img9_src_value = "/assets/figures/info_button.png")) attr_dev(img9, "src", img9_src_value);
    			attr_dev(img9, "alt", "info icon");
    			add_location(img9, file$f, 226, 61, 19977);
    			add_location(em7, file$f, 226, 165, 20081);
    			attr_dev(li12, "class", "svelte-ixpg0w");
    			add_location(li12, file$f, 226, 6, 19922);
    			attr_dev(ol2, "class", "svelte-ixpg0w");
    			add_location(ol2, file$f, 221, 4, 18669);
    			attr_dev(h23, "class", "svelte-ixpg0w");
    			add_location(h23, file$f, 229, 4, 20179);
    			attr_dev(small0, "class", "svelte-ixpg0w");
    			add_location(small0, file$f, 233, 8, 20322);
    			attr_dev(li13, "class", "video-link svelte-ixpg0w");
    			add_location(li13, file$f, 231, 6, 20220);
    			add_location(em8, file$f, 236, 8, 20436);
    			attr_dev(small1, "class", "svelte-ixpg0w");
    			add_location(small1, file$f, 237, 8, 20463);
    			attr_dev(li14, "class", "video-link svelte-ixpg0w");
    			add_location(li14, file$f, 235, 6, 20369);
    			add_location(em9, file$f, 240, 22, 20591);
    			attr_dev(small2, "class", "svelte-ixpg0w");
    			add_location(small2, file$f, 241, 8, 20634);
    			attr_dev(li15, "class", "video-link svelte-ixpg0w");
    			add_location(li15, file$f, 239, 6, 20510);
    			add_location(em10, file$f, 244, 41, 20781);
    			attr_dev(small3, "class", "svelte-ixpg0w");
    			add_location(small3, file$f, 245, 8, 20825);
    			attr_dev(li16, "class", "video-link svelte-ixpg0w");
    			add_location(li16, file$f, 243, 6, 20681);
    			add_location(em11, file$f, 248, 16, 20947);
    			attr_dev(small4, "class", "svelte-ixpg0w");
    			add_location(small4, file$f, 249, 8, 20990);
    			attr_dev(li17, "class", "video-link svelte-ixpg0w");
    			add_location(li17, file$f, 247, 6, 20872);
    			add_location(em12, file$f, 252, 16, 21113);
    			attr_dev(small5, "class", "svelte-ixpg0w");
    			add_location(small5, file$f, 253, 8, 21156);
    			attr_dev(li18, "class", "video-link svelte-ixpg0w");
    			add_location(li18, file$f, 251, 6, 21037);
    			attr_dev(small6, "class", "svelte-ixpg0w");
    			add_location(small6, file$f, 257, 8, 21339);
    			attr_dev(li19, "class", "video-link svelte-ixpg0w");
    			add_location(li19, file$f, 255, 6, 21203);
    			attr_dev(small7, "class", "svelte-ixpg0w");
    			add_location(small7, file$f, 261, 8, 21492);
    			attr_dev(li20, "class", "video-link svelte-ixpg0w");
    			add_location(li20, file$f, 259, 6, 21386);
    			attr_dev(ul, "class", "svelte-ixpg0w");
    			add_location(ul, file$f, 230, 4, 20208);
    			attr_dev(h24, "class", "svelte-ixpg0w");
    			add_location(h24, file$f, 268, 4, 21684);
    			add_location(em13, file$f, 270, 62, 21799);
    			attr_dev(a8, "href", "https://js.tensorflow.org/");
    			attr_dev(a8, "class", "svelte-ixpg0w");
    			add_location(a8, file$f, 270, 25, 21762);
    			add_location(em14, file$f, 270, 282, 22019);
    			attr_dev(a9, "href", "https://svelte.dev/");
    			attr_dev(a9, "class", "svelte-ixpg0w");
    			add_location(a9, file$f, 270, 252, 21989);
    			add_location(em15, file$f, 270, 349, 22086);
    			attr_dev(a10, "href", "https://d3js.org/");
    			attr_dev(a10, "class", "svelte-ixpg0w");
    			add_location(a10, file$f, 270, 321, 22058);
    			attr_dev(p22, "class", "svelte-ixpg0w");
    			add_location(p22, file$f, 269, 4, 21732);
    			attr_dev(h25, "class", "svelte-ixpg0w");
    			add_location(h25, file$f, 273, 4, 22206);
    			attr_dev(a11, "href", "https://zijie.wang/");
    			attr_dev(a11, "class", "svelte-ixpg0w");
    			add_location(a11, file$f, 276, 6, 22297);
    			attr_dev(a12, "href", "https://www.linkedin.com/in/robert-turko/");
    			attr_dev(a12, "class", "svelte-ixpg0w");
    			add_location(a12, file$f, 277, 6, 22348);
    			attr_dev(a13, "href", "http://oshaikh.com/");
    			attr_dev(a13, "class", "svelte-ixpg0w");
    			add_location(a13, file$f, 278, 6, 22426);
    			attr_dev(a14, "href", "https://haekyu.com/");
    			attr_dev(a14, "class", "svelte-ixpg0w");
    			add_location(a14, file$f, 279, 6, 22480);
    			attr_dev(a15, "href", "http://nilakshdas.com/");
    			attr_dev(a15, "class", "svelte-ixpg0w");
    			add_location(a15, file$f, 280, 6, 22534);
    			attr_dev(a16, "href", "https://fredhohman.com/");
    			attr_dev(a16, "class", "svelte-ixpg0w");
    			add_location(a16, file$f, 281, 6, 22591);
    			attr_dev(a17, "href", "http://minsuk.com");
    			attr_dev(a17, "class", "svelte-ixpg0w");
    			add_location(a17, file$f, 282, 6, 22649);
    			attr_dev(a18, "href", "https://www.cc.gatech.edu/~dchau/");
    			attr_dev(a18, "class", "svelte-ixpg0w");
    			add_location(a18, file$f, 283, 6, 22706);
    			attr_dev(p23, "class", "svelte-ixpg0w");
    			add_location(p23, file$f, 274, 4, 22249);
    			attr_dev(div8, "id", "description");
    			attr_dev(div8, "class", "svelte-ixpg0w");
    			add_location(div8, file$f, 103, 2, 1885);
    			add_location(body, file$f, 102, 0, 1875);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, body, anchor);
    			append_dev(body, div8);
    			append_dev(div8, h20);
    			append_dev(div8, t1);
    			append_dev(div8, p0);
    			append_dev(p0, t2);
    			append_dev(p0, em0);
    			append_dev(p0, t4);
    			append_dev(p0, em1);
    			append_dev(p0, t6);
    			append_dev(div8, t7);
    			append_dev(div8, p1);
    			append_dev(div8, t9);
    			append_dev(div8, ol0);
    			append_dev(ol0, li0);
    			append_dev(li0, t10);
    			append_dev(li0, strong0);
    			append_dev(li0, t12);
    			append_dev(ol0, t13);
    			append_dev(ol0, li1);
    			append_dev(li1, t14);
    			append_dev(li1, strong1);
    			append_dev(li1, t16);
    			append_dev(li1, span0);
    			append_dev(li1, t18);
    			append_dev(li1, span1);
    			append_dev(li1, t20);
    			append_dev(li1, strong2);
    			append_dev(li1, t22);
    			append_dev(ol0, t23);
    			append_dev(ol0, li2);
    			append_dev(li2, t24);
    			append_dev(li2, strong3);
    			append_dev(li2, t26);
    			append_dev(ol0, t27);
    			append_dev(ol0, li3);
    			append_dev(li3, strong4);
    			append_dev(li3, t29);
    			append_dev(li3, span2);
    			append_dev(li3, t31);
    			append_dev(li3, span3);
    			append_dev(li3, t33);
    			append_dev(li3, em2);
    			append_dev(li3, t35);
    			append_dev(li3, em3);
    			append_dev(li3, t37);
    			append_dev(ol0, t38);
    			append_dev(ol0, li4);
    			append_dev(li4, t39);
    			append_dev(li4, strong5);
    			append_dev(li4, t41);
    			append_dev(li4, strong6);
    			append_dev(li4, t43);
    			append_dev(div8, t44);
    			append_dev(div8, p2);
    			append_dev(p2, t45);
    			append_dev(p2, a0);
    			append_dev(p2, t47);
    			append_dev(div8, t48);
    			append_dev(div8, p3);
    			append_dev(p3, t49);
    			append_dev(p3, a1);
    			append_dev(p3, t51);
    			append_dev(div8, t52);
    			append_dev(div8, h21);
    			append_dev(div8, t54);
    			append_dev(div8, p4);
    			append_dev(div8, t56);
    			append_dev(div8, h40);
    			append_dev(div8, t58);
    			append_dev(div8, p5);
    			append_dev(p5, t59);
    			append_dev(p5, img0);
    			append_dev(p5, t60);
    			append_dev(div8, t61);
    			append_dev(div8, h41);
    			append_dev(div8, t63);
    			append_dev(div8, p6);
    			append_dev(div8, t65);
    			append_dev(div8, p7);
    			append_dev(div8, t67);
    			append_dev(div8, p8);
    			append_dev(div8, t69);
    			append_dev(div8, div1);
    			append_dev(div1, img1);
    			append_dev(div1, t70);
    			append_dev(div1, div0);
    			append_dev(div8, t72);
    			append_dev(div8, p9);
    			append_dev(div8, t74);
    			append_dev(div8, div3);
    			append_dev(div3, img2);
    			append_dev(div3, t75);
    			append_dev(div3, div2);
    			append_dev(div8, t77);
    			append_dev(div8, p10);
    			append_dev(div8, t79);
    			append_dev(div8, p11);
    			append_dev(div8, t81);
    			append_dev(div8, h60);
    			append_dev(div8, t83);
    			append_dev(div8, p12);
    			mount_component(hyperparameterview, p12, null);
    			append_dev(div8, t84);
    			append_dev(div8, ol1);
    			append_dev(ol1, li5);
    			append_dev(li5, strong7);
    			append_dev(li5, t86);
    			append_dev(li5, a2);
    			append_dev(li5, t88);
    			append_dev(li5, a3);
    			append_dev(li5, t90);
    			append_dev(li5, a4);
    			append_dev(li5, t92);
    			append_dev(ol1, t93);
    			append_dev(ol1, li6);
    			append_dev(li6, strong8);
    			append_dev(li6, t95);
    			append_dev(li6, a5);
    			append_dev(li6, t97);
    			append_dev(ol1, t98);
    			append_dev(ol1, li7);
    			append_dev(li7, strong9);
    			append_dev(li7, t100);
    			append_dev(div8, t101);
    			append_dev(div8, h42);
    			append_dev(div8, t103);
    			append_dev(div8, h61);
    			append_dev(div8, t105);
    			append_dev(div8, p13);
    			append_dev(p13, t106);
    			append_dev(p13, a6);
    			append_dev(p13, t108);
    			append_dev(p13, em4);
    			append_dev(p13, t110);
    			append_dev(p13, a7);
    			append_dev(p13, t112);
    			append_dev(div8, t113);
    			append_dev(div8, p14);
    			append_dev(div8, t116);
    			append_dev(div8, div5);
    			append_dev(div5, img3);
    			append_dev(div5, t117);
    			append_dev(div5, div4);
    			append_dev(div8, t119);
    			append_dev(div8, p15);
    			append_dev(div8, t121);
    			append_dev(div8, h62);
    			append_dev(div8, t123);
    			append_dev(div8, p16);
    			append_dev(p16, t124);
    			append_dev(p16, t125);
    			append_dev(p16, span4);
    			append_dev(p16, t127);
    			append_dev(p16, span5);
    			append_dev(p16, t129);
    			append_dev(div8, t130);
    			append_dev(div8, p17);
    			append_dev(div8, t132);
    			append_dev(div8, div7);
    			append_dev(div7, img4);
    			append_dev(div7, t133);
    			append_dev(div7, div6);
    			append_dev(div6, t134);
    			append_dev(div6, em5);
    			append_dev(div6, t136);
    			append_dev(div8, t137);
    			append_dev(div8, h43);
    			append_dev(div8, t139);
    			append_dev(div8, p18);
    			append_dev(div8, t141);
    			append_dev(div8, p19);
    			append_dev(div8, t143);
    			append_dev(div8, p20);
    			append_dev(div8, t145);
    			append_dev(div8, h44);
    			append_dev(div8, t147);
    			append_dev(div8, p21);
    			append_dev(div8, t149);
    			append_dev(div8, h22);
    			append_dev(div8, t151);
    			append_dev(div8, ol2);
    			append_dev(ol2, li8);
    			append_dev(li8, strong10);
    			append_dev(li8, t153);
    			append_dev(li8, img5);
    			append_dev(li8, t154);
    			append_dev(ol2, t155);
    			append_dev(ol2, li9);
    			append_dev(li9, strong11);
    			append_dev(li9, t157);
    			append_dev(li9, img6);
    			append_dev(li9, t158);
    			append_dev(ol2, t159);
    			append_dev(ol2, li10);
    			append_dev(li10, strong12);
    			append_dev(li10, t161);
    			append_dev(li10, img7);
    			append_dev(li10, t162);
    			append_dev(ol2, t163);
    			append_dev(ol2, li11);
    			append_dev(li11, strong13);
    			append_dev(li11, t165);
    			append_dev(li11, img8);
    			append_dev(li11, t166);
    			append_dev(li11, em6);
    			append_dev(li11, t168);
    			append_dev(ol2, t169);
    			append_dev(ol2, li12);
    			append_dev(li12, strong14);
    			append_dev(li12, t171);
    			append_dev(li12, img9);
    			append_dev(li12, t172);
    			append_dev(li12, em7);
    			append_dev(li12, t174);
    			append_dev(div8, t175);
    			append_dev(div8, h23);
    			append_dev(div8, t177);
    			append_dev(div8, ul);
    			append_dev(ul, li13);
    			append_dev(li13, t178);
    			append_dev(li13, small0);
    			append_dev(ul, t180);
    			append_dev(ul, li14);
    			append_dev(li14, em8);
    			append_dev(li14, t182);
    			append_dev(li14, small1);
    			append_dev(ul, t184);
    			append_dev(ul, li15);
    			append_dev(li15, t185);
    			append_dev(li15, em9);
    			append_dev(li15, t187);
    			append_dev(li15, small2);
    			append_dev(ul, t189);
    			append_dev(ul, li16);
    			append_dev(li16, t190);
    			append_dev(li16, em10);
    			append_dev(li16, t192);
    			append_dev(li16, small3);
    			append_dev(ul, t194);
    			append_dev(ul, li17);
    			append_dev(li17, t195);
    			append_dev(li17, em11);
    			append_dev(li17, t197);
    			append_dev(li17, small4);
    			append_dev(ul, t199);
    			append_dev(ul, li18);
    			append_dev(li18, t200);
    			append_dev(li18, em12);
    			append_dev(li18, t202);
    			append_dev(li18, small5);
    			append_dev(ul, t204);
    			append_dev(ul, li19);
    			append_dev(li19, t205);
    			append_dev(li19, small6);
    			append_dev(ul, t207);
    			append_dev(ul, li20);
    			append_dev(li20, t208);
    			append_dev(li20, small7);
    			append_dev(div8, t210);
    			append_dev(div8, h24);
    			append_dev(div8, t212);
    			append_dev(div8, p22);
    			append_dev(p22, t213);
    			append_dev(p22, a8);
    			append_dev(a8, em13);
    			append_dev(p22, t215);
    			append_dev(p22, a9);
    			append_dev(a9, em14);
    			append_dev(p22, t217);
    			append_dev(p22, a10);
    			append_dev(a10, em15);
    			append_dev(p22, t219);
    			append_dev(div8, t220);
    			append_dev(div8, h25);
    			append_dev(div8, t222);
    			append_dev(div8, p23);
    			append_dev(p23, t223);
    			append_dev(p23, a11);
    			append_dev(p23, t225);
    			append_dev(p23, a12);
    			append_dev(p23, t227);
    			append_dev(p23, a13);
    			append_dev(p23, t229);
    			append_dev(p23, a14);
    			append_dev(p23, t231);
    			append_dev(p23, a15);
    			append_dev(p23, t233);
    			append_dev(p23, a16);
    			append_dev(p23, t235);
    			append_dev(p23, a17);
    			append_dev(p23, t237);
    			append_dev(p23, a18);
    			append_dev(p23, t239);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(li13, "click", /*currentPlayer*/ ctx[2].play(0), false, false, false),
    					listen_dev(li14, "click", /*currentPlayer*/ ctx[2].play(27), false, false, false),
    					listen_dev(li15, "click", /*currentPlayer*/ ctx[2].play(37), false, false, false),
    					listen_dev(li16, "click", /*currentPlayer*/ ctx[2].play(46), false, false, false),
    					listen_dev(li17, "click", /*currentPlayer*/ ctx[2].play(82), false, false, false),
    					listen_dev(li18, "click", /*currentPlayer*/ ctx[2].play(101), false, false, false),
    					listen_dev(li19, "click", /*currentPlayer*/ ctx[2].play(126), false, false, false),
    					listen_dev(li20, "click", /*currentPlayer*/ ctx[2].play(149), false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(hyperparameterview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(hyperparameterview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(body);
    			destroy_component(hyperparameterview);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let softmaxEquation = `$$\\text{Softmax}(x_{i}) = \\frac{\\exp(x_i)}{\\sum_j \\exp(x_j)}$$`;
    	let reluEquation = `$$\\text{ReLU}(x) = \\max(0,x)$$`;
    	let currentPlayer;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Article> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Article", $$slots, []);

    	$$self.$capture_state = () => ({
    		HyperparameterView: Hyperparameterview,
    		softmaxEquation,
    		reluEquation,
    		currentPlayer
    	});

    	$$self.$inject_state = $$props => {
    		if ("softmaxEquation" in $$props) $$invalidate(0, softmaxEquation = $$props.softmaxEquation);
    		if ("reluEquation" in $$props) $$invalidate(1, reluEquation = $$props.reluEquation);
    		if ("currentPlayer" in $$props) $$invalidate(2, currentPlayer = $$props.currentPlayer);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [softmaxEquation, reluEquation, currentPlayer];
    }

    class Article extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Article",
    			options,
    			id: create_fragment$g.name
    		});
    	}
    }

    /* global tf */

    // Network input image size
    const networkInputSize = 28;

    // Enum of node types
    const nodeType = {
      INPUT: 'input',
      CONV: 'conv',
      POOL: 'pool',
      RELU: 'relu',
      FC: 'fc',
      FLATTEN: 'flatten'
    };

    class Node {
      /**
       * Class structure for each neuron node.
       * 
       * @param {string} layerName Name of the node's layer.
       * @param {int} index Index of this node in its layer.
       * @param {string} type Node type {input, conv, pool, relu, fc}. 
       * @param {number} bias The bias assocated to this node.
       * @param {number[]} output Output of this node.
       */
      constructor(layerName, index, type, bias, output) {
        this.layerName = layerName;
        this.index = index;
        this.type = type;
        this.bias = bias;
        this.output = output;

        // Weights are stored in the links
        this.inputLinks = [];
        this.outputLinks = [];
      }
    }

    class Link {
      /**
       * Class structure for each link between two nodes.
       * 
       * @param {Node} source Source node.
       * @param {Node} dest Target node.
       * @param {number} weight Weight associated to this link. It can be a number,
       *  1D array, or 2D array.
       */
      constructor(source, dest, weight) {
        this.source = source;
        this.dest = dest;
        this.weight = weight;
      }
    }

    /**
     * Construct a CNN with given extracted outputs from every layer.
     * 
     * @param {number[][]} allOutputs Array of outputs for each layer.
     *  allOutputs[i][j] is the output for layer i node j.
     * @param {Model} model Loaded tf.js model.
     * @param {Tensor} inputImageTensor Loaded input image tensor.
     */
    const constructCNNFromOutputs = (allOutputs, model, inputImageTensor) => {
      let cnn = [];

      // Add the first layer (input layer)
      let inputLayer = [];
      let inputShape = model.layers[0].batchInputShape.slice(1);
      let inputImageArray = inputImageTensor.transpose([2, 0, 1]).arraySync();

      // First layer's three nodes' outputs are the channels of inputImageArray
      for (let i = 0; i < inputShape[2]; i++) {
        let node = new Node('input', i, nodeType.INPUT, 0, inputImageArray[i]);
        inputLayer.push(node);
      }
                                                                                                                       
      cnn.push(inputLayer);
      let curLayerIndex = 1;

      for (let l = 0; l < model.layers.length; l++) {
        let layer = model.layers[l];
        // Get the current output
        let outputs = allOutputs[l].squeeze();
        outputs = outputs.arraySync();

        let curLayerNodes = [];
        let curLayerType;

        // Identify layer type based on the layer name
        if (layer.name.includes('conv')) {
          curLayerType = nodeType.CONV;
        } else if (layer.name.includes('pool')) {
          curLayerType = nodeType.POOL;
        } else if (layer.name.includes('relu')) {
          curLayerType = nodeType.RELU;
        } else if (layer.name.includes('output')) {
          curLayerType = nodeType.FC;
        } else if (layer.name.includes('flatten')) {
          curLayerType = nodeType.FLATTEN;
        } else if (layer.name.includes('dense')){
          curLayerType = nodeType.FC;
        }
        else {
          console.log('Find unknown type');
        }

        // Construct this layer based on its layer type
        switch (curLayerType) {
          case nodeType.CONV: {
            let biases = layer.bias.val.arraySync();
            // The new order is [output_depth, input_depth, height, width]
            let weights = layer.kernel.val.transpose([3, 2, 0, 1]).arraySync();

            // Add nodes into this layer
            for (let i = 0; i < outputs.length; i++) {
              let node = new Node(layer.name, i, curLayerType, biases[i],
                outputs[i]);

              // Connect this node to all previous nodes (create links)
              // CONV layers have weights in links. Links are one-to-multiple.
              for (let j = 0; j < cnn[curLayerIndex - 1].length; j++) {
                let preNode = cnn[curLayerIndex - 1][j];
                let curLink = new Link(preNode, node, weights[i][j]);
                preNode.outputLinks.push(curLink);
                node.inputLinks.push(curLink);
              }
              curLayerNodes.push(node);
            }
            break;
          }
          case nodeType.FC: {
            let biases = layer.bias.val.arraySync();
            // The new order is [output_depth, input_depth]
            let weights = layer.kernel.val.transpose([1, 0]).arraySync();

            // Add nodes into this layer
            for (let i = 0; i < outputs.length; i++) {
              let node = new Node(layer.name, i, curLayerType, biases[i],
                outputs[i]);
              if(layer.name === 'dense_9'){
                node = new Node('output', i, curLayerType, biases[i],
                  outputs[i]);
              }
              // Connect this node to all previous nodes (create links)
              // FC layers have weights in links. Links are one-to-multiple.

              // Since we are visualizing the logit values, we need to track
              // the raw value before softmax
              let curLogit = 0;
              for (let j = 0; j < cnn[curLayerIndex - 1].length; j++) {
                let preNode = cnn[curLayerIndex - 1][j];
                let curLink = new Link(preNode, node, weights[i][j]);
                preNode.outputLinks.push(curLink);
                node.inputLinks.push(curLink);
                curLogit += preNode.output * weights[i][j];
              }
              curLogit += biases[i];
              node.logit = curLogit;
              curLayerNodes.push(node);
            }

            // Sort flatten layer based on the node TF index
            cnn[curLayerIndex - 1].sort((a, b) => a.realIndex - b.realIndex);
            break;
          }
          case nodeType.RELU:
          case nodeType.POOL: {
            // RELU and POOL have no bias nor weight
            let bias = 0;
            let weight = null;

            // Add nodes into this layer
            for (let i = 0; i < outputs.length; i++) {
              let node = new Node(layer.name, i, curLayerType, bias, outputs[i]);

              // RELU and POOL layers have no weights. Links are one-to-one
              let preNode = cnn[curLayerIndex - 1][i];
              let link = new Link(preNode, node, weight);
              preNode.outputLinks.push(link);
              node.inputLinks.push(link);

              curLayerNodes.push(node);
            }
            break;
          }
          case nodeType.FLATTEN: {
            // Flatten layer has no bias nor weights.
            let bias = 0;

            for (let i = 0; i < outputs.length; i++) {
              // Flatten layer has no weights. Links are multiple-to-one.
              // Use dummy weights to store the corresponding entry in the previsou
              // node as (row, column)
              // The flatten() in tf2.keras has order: channel -> row -> column
              let preNodeWidth = cnn[curLayerIndex - 1][0].output.length,
                preNodeNum = cnn[curLayerIndex - 1].length,
                preNodeIndex = i % preNodeNum,
                preNodeRow = Math.floor(Math.floor(i / preNodeNum) / preNodeWidth),
                preNodeCol = Math.floor(i / preNodeNum) % preNodeWidth,
                // Use channel, row, colume to compute the real index with order
                // row -> column -> channel
                curNodeRealIndex = preNodeIndex * (preNodeWidth * preNodeWidth) +
                  preNodeRow * preNodeWidth + preNodeCol;
              
              let node = new Node(layer.name, i, curLayerType,
                  bias, outputs[i]);
              
              // TF uses the (i) index for computation, but the real order should
              // be (curNodeRealIndex). We will sort the nodes using the real order
              // after we compute the logits in the output layer.
              node.realIndex = curNodeRealIndex;

              let link = new Link(cnn[curLayerIndex - 1][preNodeIndex],
                  node, [preNodeRow, preNodeCol]);

              cnn[curLayerIndex - 1][preNodeIndex].outputLinks.push(link);
              node.inputLinks.push(link);

              curLayerNodes.push(node);
            }

            // Sort flatten layer based on the node TF index
            curLayerNodes.sort((a, b) => a.index - b.index);
            break;
          }
          default:
            console.error('Encounter unknown layer type');
            break;
        }

        // Add current layer to the NN
        cnn.push(curLayerNodes);
        curLayerIndex++;
      }

      return cnn;
    };

    /**
     * Construct a CNN with given model and input.
     * 
     * @param {string} inputImageFile filename of input image.
     * @param {Model} model Loaded tf.js model.
     */
    const constructCNN = async (inputImageFile, model) => {
      // Load the image file
      let inputImageTensor = await getInputImageArray(inputImageFile, true);
      //inputImageTensor = tf.fill([inputImageTensor.shape[0], inputImageTensor.shape[1], 1], 0.5);
      // Need to feed the model with a batch
      let inputImageTensorBatch = tf.stack([inputImageTensor]);
      // To get intermediate layer outputs, we will iterate through all layers in
      // the model, and sequencially apply transformations.
      let preTensor = inputImageTensorBatch;
      let outputs = [];

      // Iterate through all layers, and build one model with that layer as output
      for (let l = 0; l < model.layers.length; l++) {
        let curTensor = model.layers[l].apply(preTensor);

        // Record the output tensor
        // Because there is only one element in the batch, we use squeeze()
        // We also want to use CHW order here
        let output = curTensor.squeeze();
        if (output.shape.length === 3) {
          output = output.transpose([2, 0, 1]);
        }
        outputs.push(output);

        // Update preTensor for next nesting iteration
        preTensor = curTensor;
      }

      let cnn = constructCNNFromOutputs(outputs, model, inputImageTensor);
      return cnn;
    };

    // Helper functions

    /**
     * Crop the largest central square of size 64x64x3 of a 3d array.
     * 
     * @param {[int8]} arr array that requires cropping and padding (if a 64x64 crop
     * is not present)
     * @returns 64x64x3 array
     */
    const cropCentralSquare = (arr) => {
      let width = arr.length;
      let height = arr[0].length;
      let croppedArray;

      // Crop largest square from image if the image is smaller than 64x64 and pad the
      // cropped image.
      if (width < networkInputSize || height < networkInputSize) {
        // TODO(robert): Finish the padding logic.  Pushing now for Omar to work on when he is ready.
        let cropDimensions = Math.min(width, height);
        let startXIdx = Math.floor(width / 2) - (cropDimensions / 2);
        let startYIdx = Math.floor(height / 2) - (cropDimensions / 2);
        let unpaddedSubarray = arr.slice(startXIdx, startXIdx + cropDimensions).map(i => i.slice(startYIdx, startYIdx + cropDimensions));
      } else {
        let startXIdx = Math.floor(width / 2) - Math.floor(networkInputSize / 2);
        let startYIdx = Math.floor(height / 2) - Math.floor(networkInputSize / 2);
        croppedArray = arr.slice(startXIdx, startXIdx + networkInputSize).map(i => i.slice(startYIdx, startYIdx + networkInputSize));
      }
      return croppedArray;
    };

    /**
     * Convert canvas image data into a 3D tensor with dimension [height, width, 3].
     * Recall that tensorflow uses NHWC order (batch, height, width, channel).
     * Each pixel is in 0-255 scale.
     * 
     * @param {[int8]} imageData Canvas image data
     * @param {int} width Canvas image width
     * @param {int} height Canvas image height
     */
    const imageDataTo3DTensor = (imageData, width, height, normalize=true) => {
      // Create array placeholder for the 3d array
      let imageArray = tf.fill([width, height, 1], 0).arraySync();

      // Iterate through the data to fill out channel arrays above
      for (let i = 0; i < imageData.length; i++) {
        let pixelIndex = Math.floor(i / 4),
          channelIndex = i % 4,
          row = width === height ? Math.floor(pixelIndex / width)
                                  : pixelIndex % width,
          column = width === height ? pixelIndex % width
                                  : Math.floor(pixelIndex / width);
        
        if (channelIndex < 1) { 
          let curEntry  = imageData[i];
          // Normalize the original pixel value from [0, 255] to [0, 1]
          if (normalize) {
            curEntry /= 255;
          }
          imageArray[row][column][channelIndex] = curEntry;
        }
      }

      // If the image is not 64x64, crop and or pad the image appropriately.
      if (width != networkInputSize && height != networkInputSize) {
        imageArray = cropCentralSquare(imageArray);
      }

      let tensor = tf.tensor3d(imageArray);
      return tensor;
    };

    /**
     * Get the 3D pixel value array of the given image file.
     * 
     * @param {string} imgFile File path to the image file
     * @returns A promise with the corresponding 3D array
     */
    const getInputImageArray = (imgFile, normalize=true) => {
      let canvas = document.createElement('canvas');
      canvas.style.cssText = 'display:none;';
      document.getElementsByTagName('body')[0].appendChild(canvas);
      let context = canvas.getContext('2d');

      return new Promise((resolve, reject) => {
        let inputImage = new Image();
        inputImage.crossOrigin = "Anonymous";
        inputImage.src = imgFile;
        let canvasImage;
        inputImage.onload = () => {
          canvas.width = inputImage.width;
          canvas.height = inputImage.height;
          // Resize the input image of the network if it is too large to simply crop
          // the center 64x64 portion in order to still provide a representative
          // input image into the network.
          if (inputImage.width > networkInputSize || inputImage.height > networkInputSize) {
            // Step 1 - Resize using smaller dimension to scale the image down. 
            let resizeCanvas = document.createElement('canvas'),
                resizeContext = resizeCanvas.getContext('2d');
            let smallerDimension = Math.min(inputImage.width, inputImage.height);
            const resizeFactor = (networkInputSize + 1) / smallerDimension;
            resizeCanvas.width = inputImage.width * resizeFactor;
            resizeCanvas.height = inputImage.height * resizeFactor;
            resizeContext.drawImage(inputImage, 0, 0, resizeCanvas.width,
              resizeCanvas.height);

            // Step 2 - Flip non-square images horizontally and rotate them 90deg since
            // non-square images are not stored upright.
            if (inputImage.width != inputImage.height) {
              context.translate(resizeCanvas.width, 0);
              context.scale(-1, 1);
              context.translate(resizeCanvas.width / 2, resizeCanvas.height / 2);
              context.rotate(90 * Math.PI / 180);
            }

            // Step 3 - Draw resized image on original canvas.
            if (inputImage.width != inputImage.height) {
              context.drawImage(resizeCanvas, -resizeCanvas.width / 2, -resizeCanvas.height / 2);
            } else {
              context.drawImage(resizeCanvas, 0, 0);
            }
            canvasImage = context.getImageData(0, 0, resizeCanvas.width,
              resizeCanvas.height);

          } else {
            context.drawImage(inputImage, 0, 0);
            canvasImage = context.getImageData(0, 0, inputImage.width,
              inputImage.height);
          }
          // Get image data and convert it to a 3D array
          let imageData = canvasImage.data;
          let imageWidth = canvasImage.width;
          let imageHeight = canvasImage.height;

          // Remove this newly created canvas element
          canvas.parentNode.removeChild(canvas);

          resolve(imageDataTo3DTensor(imageData, imageWidth, imageHeight, normalize));
        };
        inputImage.onerror = reject;
      })
    };

    /**
     * Wrapper to load a model.
     * 
     * @param {string} modelFile Filename of converted (through tensorflowjs.py)
     *  model json file.
     */
    const loadTrainedModel = (modelFile) => {
      return tf.loadLayersModel(modelFile);
    };

    /* global d3 */

    const layerColorScales$1 = {
      input: [d3.interpolateGreys, d3.interpolateGreys, d3.interpolateGreys],
      conv: d3.interpolateRdBu,
      relu: d3.interpolateRdBu,
      pool: d3.interpolateRdBu,
      fc: d3.interpolateGreys,
      weight: d3.interpolateBrBG,
      logit: d3.interpolateOranges
    };

    let nodeLength = 40;

    const overviewConfig = {
      nodeLength : nodeLength,
      plusSymbolRadius : nodeLength / 5,
      numLayers : 7,
      edgeOpacity : 0.8,
      edgeInitColor : 'rgb(230, 230, 230)',
      edgeHoverColor : 'rgb(130, 130, 130)',
      edgeHoverOuting : false,
      edgeStrokeWidth : 0.7,
      intermediateColor : 'gray',
      layerColorScales: layerColorScales$1,
      svgPaddings: {top: 25, bottom: 25, left: 50, right: 50},
      kernelRectLength: 8/3,
      gapRatio: 4,
      overlayRectOffset: 12,
      classLists: ['1', '2', '3', '4', '5',
        '6', '7', '8', '9', '10', '11', '12', '13', '14', '15']
    };

    // Configs
    const nodeLength$1 = overviewConfig.nodeLength;

    /**
     * Compute the [minimum, maximum] of a 1D or 2D array.
     * @param {[number]} array 
     */
    const getExtent = (array) => {
      let min = Infinity;
      let max = -Infinity;

      // Scalar
      if (array.length === undefined) {
        return [array, array];
      }

      // 1D array
      if (array[0].length === undefined) {
        for (let i = 0; i < array[0].length; i++) {
          if (array[i] < min) {
            min = array[i];
          } else if (array[i] > max) {
            max = array[i];
          }
        }
        return [min, max];
      }

      // 2D array
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[0].length; j++) {
          if (array[i][j] < min) {
            min = array[i][j];
          } else if (array[i][j] > max) {
            max = array[i][j];
          }
        }
      }
      return [min, max];
    };

    /**
     * Convert the svg element center coord to document absolute value
     * // Inspired by https://github.com/caged/d3-tip/blob/master/index.js#L286
     * @param {elem} elem 
     */
    const getMidCoords = (svg, elem) => {
      if (svg !== undefined) {
        let targetel = elem;
        while (targetel.getScreenCTM == null && targetel.parentNode != null) {
          targetel = targetel.parentNode;
        }
        // Get the absolute coordinate of the E point of element bbox
        let point = svg.node().ownerSVGElement.createSVGPoint();
        let matrix = targetel.getScreenCTM();
        let tbbox = targetel.getBBox();
        // let width = tbbox.width;
        let height = tbbox.height;

        point.x += 0;
        point.y -= height / 2;
        let bbox = point.matrixTransform(matrix);
        return {
          top: bbox.y,
          left: bbox.x
        };
      }
    };

    /**
     * Return the output knot (right boundary center)
     * @param {object} point {x: x, y:y}
     */
    const getOutputKnot = (point) => {
      return {
        x: point.x + nodeLength$1,
        y: point.y + nodeLength$1 / 2
      };
    };

    /**
     * Return the output knot (left boundary center)
     * @param {object} point {x: x, y:y}
     */
    const getInputKnot = (point) => {
      return {
        x: point.x,
        y: point.y + nodeLength$1 / 2
      }
    };

    /**
     * Compute edge data
     * @param {[[[number, number]]]} nodeCoordinate Constructed neuron svg locations
     * @param {[object]} cnn Constructed CNN model
     */
    const getLinkData = (nodeCoordinate, cnn) => {
      let linkData = [];
      // Create links backward (starting for the first conv layer)
      for (let l = 1; l < cnn.length; l++) {
        for (let n = 0; n < cnn[l].length; n++) {
          let isOutput = cnn[l][n].layerName === 'dense_8';
          let curTarget = getInputKnot(nodeCoordinate[l][n]);
          for (let p = 0; p < cnn[l][n].inputLinks.length; p++) {
            // Specially handle output layer (since we are ignoring the flatten)
            let inputNodeIndex = cnn[l][n].inputLinks[p].source.index;
            
            if (isOutput) {
              let flattenDimension = cnn[l-1][0].output.length *
                cnn[l-1][0].output.length;
              if (inputNodeIndex % flattenDimension !== 0){
                  continue;
              }
              inputNodeIndex = Math.floor(inputNodeIndex / flattenDimension);
            }
            let curSource = getOutputKnot(nodeCoordinate[l-1][inputNodeIndex]);
            let curWeight = cnn[l][n].inputLinks[p].weight;
            linkData.push({
              source: curSource,
              target: curTarget,
              weight: curWeight,
              targetLayerIndex: l,
              targetNodeIndex: n,
              sourceNodeIndex: inputNodeIndex
            });
          }
        }
      }
      return linkData;
    };


    /**
     * Color scale wrapper (support artificially lighter color!)
     * @param {function} colorScale D3 color scale function
     * @param {number} range Color range (max - min)
     * @param {number} value Color value
     * @param {number} gap Tail of the color scale to skip
     */
    const gappedColorScale = (colorScale, range, value, gap) => {
      if (gap === undefined) { gap = 0; }
      let normalizedValue = (value + range / 2) / range;
      return colorScale(normalizedValue * (1 - 2 * gap) + gap);
    };

    /* global d3, SmoothScroll */

    // Configs
    const layerColorScales$2 = overviewConfig.layerColorScales;
    const nodeLength$2 = overviewConfig.nodeLength;
    const numLayers = overviewConfig.numLayers;
    const edgeOpacity = overviewConfig.edgeOpacity;
    const edgeInitColor = overviewConfig.edgeInitColor;
    const edgeStrokeWidth = overviewConfig.edgeStrokeWidth;
    const svgPaddings = overviewConfig.svgPaddings;
    const gapRatio = overviewConfig.gapRatio;
    const classLists = overviewConfig.classLists;
    const formater = d3.format('.4f');

    // Shared variables
    let svg$1 = undefined;
    svgStore.subscribe( value => {svg$1 = value;} );

    let vSpaceAroundGap = undefined;
    vSpaceAroundGapStore.subscribe( value => {vSpaceAroundGap = value;} );

    let hSpaceAroundGap = undefined;
    hSpaceAroundGapStore.subscribe( value => {hSpaceAroundGap = value;} );

    let cnn = undefined;
    cnnStore.subscribe( value => {cnn = value;} );

    let nodeCoordinate = undefined;
    nodeCoordinateStore.subscribe( value => {nodeCoordinate = value;} );

    let selectedScaleLevel = undefined;
    selectedScaleLevelStore.subscribe( value => {selectedScaleLevel = value;} );

    let cnnLayerRanges = undefined;
    cnnLayerRangesStore.subscribe( value => {cnnLayerRanges = value;} );

    let cnnLayerMinMax = undefined;
    cnnLayerMinMaxStore.subscribe( value => {cnnLayerMinMax = value;} );

    let detailedMode = undefined;
    detailedModeStore.subscribe( value => {detailedMode = value;} );

    /**
     * Use bounded d3 data to draw one canvas
     * @param {object} d d3 data
     * @param {index} i d3 data index
     * @param {[object]} g d3 group
     * @param {number} range color range map (max - min)
     */
    const drawOutput = (d, i, g, range) => {
      let image = g[i];
      let colorScale = layerColorScales$2[d.type];

      if (d.type === 'input') {
        colorScale = colorScale[d.index];
      }

      // Set up a second convas in order to resize image
      let imageLength = d.output.length === undefined ? 1 : d.output.length;
      let bufferCanvas = document.createElement("canvas");
      let bufferContext = bufferCanvas.getContext("2d");
      bufferCanvas.width = imageLength;
      bufferCanvas.height = imageLength;

      // Fill image pixel array
      let imageSingle = bufferContext.getImageData(0, 0, imageLength, imageLength);
      let imageSingleArray = imageSingle.data;

      if (imageLength === 1) {
        imageSingleArray[0] = d.output;
      } else {
        for (let i = 0; i < imageSingleArray.length; i+=4) {
          let pixeIndex = Math.floor(i / 4);
          let row = Math.floor(pixeIndex / imageLength);
          let column = pixeIndex % imageLength;
          let color = undefined;
          if (d.type === 'input' || d.type === 'fc' ) {
            color = d3.rgb(colorScale(1 - d.output[row][column]));
          } else {
            color = d3.rgb(colorScale((d.output[row][column] + range / 2) / range));
          }

          imageSingleArray[i] = color.r;
          imageSingleArray[i + 1] = color.g;
          imageSingleArray[i + 2] = color.b;
          imageSingleArray[i + 3] = 255;
        }
      }

      // canvas.toDataURL() only exports image in 96 DPI, so we can hack it to have
      // higher DPI by rescaling the image using canvas magic
      let largeCanvas = document.createElement('canvas');
      largeCanvas.width = nodeLength$2 * 3;
      largeCanvas.height = nodeLength$2 * 3;
      let largeCanvasContext = largeCanvas.getContext('2d');

      // Use drawImage to resize the original pixel array, and put the new image
      // (canvas) into corresponding canvas
      bufferContext.putImageData(imageSingle, 0, 0);
      largeCanvasContext.drawImage(bufferCanvas, 0, 0, imageLength, imageLength,
        0, 0, nodeLength$2 * 3, nodeLength$2 * 3);
      
      let imageDataURL = largeCanvas.toDataURL();
      d3.select(image).attr('xlink:href', imageDataURL);

      // Destory the buffer canvas
      bufferCanvas.remove();
      largeCanvas.remove();
    };

    /**
     * Draw bar chart to encode the output value
     * @param {object} d d3 data
     * @param {index} i d3 data index
     * @param {[object]} g d3 group
     * @param {function} scale map value to length
     */
    const drawOutputScore = (d, i, g, scale) => {
      let group = d3.select(g[i]);
      group.select('rect.output-rect')
        .transition('output')
        .delay(500)
        .duration(800)
        .ease(d3.easeCubicIn)
        .attr('width', scale(d.output));
    };

    const drawCustomImage = (image, inputLayer) => {

      let imageWidth = image.width;
      // Set up a second convas in order to resize image
      let imageLength = inputLayer[0].output.length;
      let bufferCanvas = document.createElement("canvas");
      let bufferContext = bufferCanvas.getContext("2d");
      bufferCanvas.width = imageLength;
      bufferCanvas.height = imageLength;

      // Fill image pixel array
      let imageSingle = bufferContext.getImageData(0, 0, imageLength, imageLength);
      let imageSingleArray = imageSingle.data;

      for (let i = 0; i < imageSingleArray.length; i+=4) {
        let pixeIndex = Math.floor(i / 4);
        let row = Math.floor(pixeIndex / imageLength);
        let column = pixeIndex % imageLength;

        let red = inputLayer[0].output[row][column];
        let green = inputLayer[1].output[row][column];
        let blue = inputLayer[2].output[row][column];

        imageSingleArray[i] = red * 255;
        imageSingleArray[i + 1] = green * 255;
        imageSingleArray[i + 2] = blue * 255;
        imageSingleArray[i + 3] = 255;
      }

      // canvas.toDataURL() only exports image in 96 DPI, so we can hack it to have
      // higher DPI by rescaling the image using canvas magic
      let largeCanvas = document.createElement('canvas');
      largeCanvas.width = imageWidth * 3;
      largeCanvas.height = imageWidth * 3;
      let largeCanvasContext = largeCanvas.getContext('2d');

      // Use drawImage to resize the original pixel array, and put the new image
      // (canvas) into corresponding canvas
      bufferContext.putImageData(imageSingle, 0, 0);
      largeCanvasContext.drawImage(bufferCanvas, 0, 0, imageLength, imageLength,
        0, 0, imageWidth * 3, imageWidth * 3);
      
      let imageDataURL = largeCanvas.toDataURL();
      // d3.select(image).attr('xlink:href', imageDataURL);
      image.src = imageDataURL;

      // Destory the buffer canvas
      bufferCanvas.remove();
      largeCanvas.remove();
    };

    /**
     * Create color gradient for the legend
     * @param {[object]} g d3 group
     * @param {function} colorScale Colormap
     * @param {string} gradientName Label for gradient def
     * @param {number} min Min of legend value
     * @param {number} max Max of legend value
     */
    const getLegendGradient = (g, colorScale, gradientName, min, max) => {
      if (min === undefined) { min = 0; }
      if (max === undefined) { max = 1; }
      let gradient = g.append('defs')
        .append('svg:linearGradient')
        .attr('id', `${gradientName}`)
        .attr('x1', '0%')
        .attr('y1', '100%')
        .attr('x2', '100%')
        .attr('y2', '100%')
        .attr('spreadMethod', 'pad');
      let interpolation = 10;
      for (let i = 0; i < interpolation; i++) {
        let curProgress = i / (interpolation - 1);
        let curColor = colorScale(curProgress * (max - min) + min);
        gradient.append('stop')
          .attr('offset', `${curProgress * 100}%`)
          .attr('stop-color', curColor)
          .attr('stop-opacity', 1);
      }
    };

    /**
     * Draw the overview
     * @param {number} width Width of the cnn group
     * @param {number} height Height of the cnn group
     * @param {object} cnnGroup Group to appen cnn elements to
     * @param {function} nodeMouseOverHandler Callback func for mouseOver
     * @param {function} nodeMouseLeaveHandler Callback func for mouseLeave
     * @param {function} nodeClickHandler Callback func for click
     */
    const drawCNN = (width, height, cnnGroup, nodeMouseOverHandler,
      nodeMouseLeaveHandler, nodeClickHandler) => {
      // Draw the CNN
      // There are 8 short gaps and 5 long gaps
      hSpaceAroundGap = (width - nodeLength$2 * numLayers) / (6 + 3 * gapRatio);
      hSpaceAroundGapStore.set(hSpaceAroundGap);
      let leftAccuumulatedSpace = 0;

      // Iterate through the cnn to draw nodes in each layer
      for (let l = 0; l < cnn.length; l++) {
        let curLayer = cnn[l];
        let isOutput = curLayer[0].layerName === 'output';

        nodeCoordinate.push([]);

        // Compute the x coordinate of the whole layer
        // Output layer and conv layer has long gaps
        if (isOutput || curLayer[0].type === 'conv') {
          leftAccuumulatedSpace += hSpaceAroundGap * gapRatio;
        } else {
          leftAccuumulatedSpace += hSpaceAroundGap;
        }

        // All nodes share the same x coordiante (left in div style)
        let left = leftAccuumulatedSpace;

        let layerGroup = cnnGroup.append('g')
          .attr('class', 'cnn-layer-group')
          .attr('id', `cnn-layer-group-${l}`);

        vSpaceAroundGap = (height - nodeLength$2 * curLayer.length) /
          (curLayer.length + 1);
        vSpaceAroundGapStore.set(vSpaceAroundGap);

        let nodeGroups = layerGroup.selectAll('g.node-group')
          .data(curLayer, d => d.index)
          .enter()
          .append('g')
          .attr('class', 'node-group')
          .style('cursor', 'pointer')
          .style('pointer-events', 'all')
          .on('click', nodeClickHandler)
          .on('mouseover', nodeMouseOverHandler)
          .on('mouseleave', nodeMouseLeaveHandler)
          .classed('node-output', isOutput)
          .attr('id', (d, i) => {
            // Compute the coordinate
            // Not using transform on the group object because of a decade old
            // bug on webkit (safari)
            // https://bugs.webkit.org/show_bug.cgi?id=23113
            let top = i * nodeLength$2 + (i + 1) * vSpaceAroundGap;
            top += svgPaddings.top;
            nodeCoordinate[l].push({x: left, y: top});
            return `layer-${l}-node-${i}`
          });
        
        // Overwrite the mouseover and mouseleave function for output nodes to show
        // hover info in the UI
        layerGroup.selectAll('g.node-output')
          .on('mouseover', (d, i, g) => {
            nodeMouseOverHandler(d, i, g);
            hoverInfoStore.set( {show: true, text: `Output value: ${formater(d.output)}`} );
          })
          .on('mouseleave', (d, i, g) => {
            nodeMouseLeaveHandler(d, i, g);
            hoverInfoStore.set( {show: false, text: `Output value: ${formater(d.output)}`} );
          });
        
        if (curLayer[0].layerName === 'output') {
            nodeGroups.append('rect')
              .attr('class', 'output-rect')
              .attr('x', left)
              .attr('y', (d, i) => nodeCoordinate[l][i].y + nodeLength$2 / 2 + 8)
              .attr('height', nodeLength$2 / 4)
              .attr('width', 0)
              .style('fill', 'gray');
            nodeGroups.append('text')
              .attr('class', 'output-text')
              .attr('x', left)
              .attr('y', (d, i) => nodeCoordinate[l][i].y + nodeLength$2 / 2)
              .style('dominant-baseline', 'middle')
              .style('font-size', '11px')
              .style('fill', 'black')
              .style('opacity', 0.5)
              .text((d, i) => classLists[i]);
            // Add annotation text to tell readers the exact output probability
            // nodeGroups.append('text')
            //   .attr('class', 'annotation-text')
            //   .attr('id', (d, i) => `output-prob-${i}`)
            //   .attr('x', left)
            //   .attr('y', (d, i) => nodeCoordinate[l][i].y + 10)
            //   .text(d => `(${d3.format('.4f')(d.output)})`);
        } else if(curLayer[0].layerName === 'dense_8'){
            let colorScale = layerColorScales$2.conv;
            nodeGroups.append('circle')
            .attr('class', 'dense-circle')
            .attr('cx', left + nodeLength$2 / 2)
            .attr('cy', (d, i) => nodeCoordinate[l][i].y + nodeLength$2 / 2)
            .attr('r', nodeLength$2 / 2)
            .style('fill', colorScale(0.6));
            
            nodeGroups.append('circle')
            .attr('class', 'bounding')
            .attr('cx', left + nodeLength$2 / 2)
            .attr('cy', (d, i) => nodeCoordinate[l][i].y + nodeLength$2 / 2)
            .attr('r', nodeLength$2 / 2)
            .style('fill', 'none')
            .style('stroke', 'gray')
            .style('stroke-width', 1)
            .classed('hidden', true);
        }else {
            // Embed raster image in these groups
            nodeGroups.append('image')
            .attr('class', 'node-image')
            .attr('width', nodeLength$2)
            .attr('height', nodeLength$2)
            .attr('x', left)
            .attr('y', (d, i) => nodeCoordinate[l][i].y);
          
          // Add a rectangle to show the border
          nodeGroups.append('rect')
            .attr('class', 'bounding')
            .attr('width', nodeLength$2)
            .attr('height', nodeLength$2)
            .attr('x', left)
            .attr('y', (d, i) => nodeCoordinate[l][i].y)
            .style('fill', 'none')
            .style('stroke', 'gray')
            .style('stroke-width', 1)
            .classed('hidden', true);
        }
        leftAccuumulatedSpace += nodeLength$2;
      }

      // Share the nodeCoordinate
      nodeCoordinateStore.set(nodeCoordinate);

      // Compute the scale of the output score width (mapping the the node
      // width to the max output score)
      let outputRectScale = d3.scaleLinear()
            .domain(cnnLayerRanges.output)
            .range([0, nodeLength$2]);

      // Draw the canvas
      for (let l = 0; l < cnn.length; l++) {
        let range = cnnLayerRanges[selectedScaleLevel][l];
        svg$1.select(`g#cnn-layer-group-${l}`)
          .selectAll('image.node-image')
          .each((d, i, g) => drawOutput(d, i, g, range));
      }

      svg$1.selectAll('g.node-output').each(
        (d, i, g) => drawOutputScore(d, i, g, outputRectScale)
      );

      // Add layer label
      let layerNames = cnn.map(d => {
        if (d[0].layerName === 'output' || d[0].layerName === 'dense_8') {
          return {
            name: d[0].layerName,
            dimension: `(${d.length})`
          }
        } else {
          return {
            name: d[0].layerName,
            dimension: `(${d[0].output.length}, ${d[0].output.length}, ${d.length})`
          }
        }
      });

      let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
      let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
      
      let detailedLabels = svg$1.selectAll('g.layer-detailed-label')
        .data(layerNames)
        .enter()
        .append('g')
        .attr('class', 'layer-detailed-label')
        .attr('id', (d, i) => `layer-detailed-label-${i}`)
        .classed('hidden', !detailedMode)
        .attr('transform', (d, i) => {
          let x = nodeCoordinate[i][0].x + nodeLength$2 / 2;
          let y = (svgPaddings.top + vSpaceAroundGap) / 2 - 6;
          return `translate(${x}, ${y})`;
        })
        .style('cursor', d => d.name.includes('output') ? 'default' : 'help')
        .on('click', (d) => {
          let target = '';
          if (d.name.includes('conv')) { target = 'convolution'; }
          if (d.name.includes('relu')) { target = 'relu'; }
          if (d.name.includes('max_pool')) { target = 'pooling';}
          if (d.name.includes('input')) { target = 'input';}

          // Scroll to a article element
          let anchor = document.querySelector(`#article-${target}`);
          scroll.animateScroll(anchor);
        });
      
      detailedLabels.append('title')
        .text('Move to article section');
        
      detailedLabels.append('text')
        .style('opacity', 0.7)
        .style('dominant-baseline', 'middle')
        .append('tspan')
        .style('font-size', '12px')
        .text(d => d.name)
        .append('tspan')
        .style('font-size', '8px')
        .style('font-weight', 'normal')
        .attr('x', 0)
        .attr('dy', '1.5em')
        .text(d => d.dimension);
      
      let labels = svg$1.selectAll('g.layer-label')
        .data(layerNames)
        .enter()
        .append('g')
        .attr('class', 'layer-label')
        .attr('id', (d, i) => `layer-label-${i}`)
        .classed('hidden', detailedMode)
        .attr('transform', (d, i) => {
          let x = nodeCoordinate[i][0].x + nodeLength$2 / 2;
          let y = (svgPaddings.top + vSpaceAroundGap) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .style('cursor', d => d.name.includes('output') ? 'default' : 'help')
        .on('click', (d) => {
          let target = '';
          if (d.name.includes('conv')) { target = 'convolution'; }
          if (d.name.includes('relu')) { target = 'relu'; }
          if (d.name.includes('max_pool')) { target = 'pooling';}
          if (d.name.includes('input')) { target = 'input';}

          // Scroll to a article element
          let anchor = document.querySelector(`#article-${target}`);
          scroll.animateScroll(anchor);
        });
      
      labels.append('title')
        .text('Move to article section');
      
      labels.append('text')
        .style('dominant-baseline', 'middle')
        .style('opacity', 0.8)
        .text(d => {
          if (d.name.includes('conv')) { return 'conv' }
          if (d.name.includes('relu')) { return 'relu' }
          if (d.name.includes('max_pool')) { return 'max_pool'}
          return d.name
        });

      // Add layer color scale legends
      getLegendGradient(svg$1, layerColorScales$2.conv, 'convGradient');
      getLegendGradient(svg$1, layerColorScales$2.input[0], 'inputGradient');
      let legends = svg$1.append('g')
          .attr('class', 'color-legend')
          .attr('transform', `translate(${0}, ${
        svgPaddings.top + vSpaceAroundGap * (10) + vSpaceAroundGap +
        nodeLength$2 * 10
      })`);
      
      // drawLegends(legends, legendHeight);

      // Add edges between nodes
      let linkGen = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);
      
      let linkData = getLinkData(nodeCoordinate, cnn);

      let edgeGroup = cnnGroup.append('g')
        .attr('class', 'edge-group');
      
      edgeGroup.selectAll('path.edge')
        .data(linkData)
        .enter()
        .append('path')
        .attr('class', d =>
          `edge edge-${d.targetLayerIndex} edge-${d.targetLayerIndex}-${d.targetNodeIndex}`)
        .attr('id', d => 
          `edge-${d.targetLayerIndex}-${d.targetNodeIndex}-${d.sourceNodeIndex}`)
        .attr('d', d => linkGen({source: d.source, target: d.target}))
        .style('fill', 'none')
        .style('stroke-width', edgeStrokeWidth)
        .style('opacity', edgeOpacity)
        .style('stroke', edgeInitColor);

      // Add input channel annotations
      let inputAnnotation = cnnGroup.append('g')
        .attr('class', 'input-annotation');

      let redChannel = inputAnnotation.append('text')
        .attr('x', nodeCoordinate[0][0].x + nodeLength$2 / 2)
        .attr('y', nodeCoordinate[0][0].y + nodeLength$2 + 5)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle');
      
      // redChannel.append('tspan')
      //   .style('dominant-baseline', 'hanging')
      //   .style('fill', '#C95E67')
      //   .text('Red');
      
      redChannel.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text(' Input');

      // inputAnnotation.append('text')
      //   .attr('x', nodeCoordinate[0][1].x + nodeLength / 2)
      //   .attr('y', nodeCoordinate[0][1].y + nodeLength + 5)
      //   .attr('class', 'annotation-text')
      //   .style('dominant-baseline', 'hanging')
      //   .style('text-anchor', 'middle')
      //   .style('fill', '#3DB665')
      //   .text('Green');

      // inputAnnotation.append('text')
      //   .attr('x', nodeCoordinate[0][2].x + nodeLength / 2)
      //   .attr('y', nodeCoordinate[0][2].y + nodeLength + 5)
      //   .attr('class', 'annotation-text')
      //   .style('dominant-baseline', 'hanging')
      //   .style('text-anchor', 'middle')
      //   .style('fill', '#3F7FBC')
      //   .text('Blue');
    };

    /**
     * Update canvas values when user changes input image
     */
    const updateCNN = () => {
      // Compute the scale of the output score width (mapping the the node
      // width to the max output score)
      let outputRectScale = d3.scaleLinear()
          .domain(cnnLayerRanges.output)
          .range([0, nodeLength$2]);

      // Rebind the cnn data to layer groups layer by layer
      for (let l = 0; l < cnn.length; l++) {
        let curLayer = cnn[l];
        let range = cnnLayerRanges[selectedScaleLevel][l];
        let layerGroup = svg$1.select(`g#cnn-layer-group-${l}`);

        let nodeGroups = layerGroup.selectAll('g.node-group')
          .data(curLayer);

        if (l < cnn.length - 1) {
          // Redraw the canvas and output node
          nodeGroups.transition('disappear')
            .duration(300)
            .ease(d3.easeCubicOut)
            .style('opacity', 0)
            .on('end', function() {
              d3.select(this)
                .select('image.node-image')
                .each((d, i, g) => drawOutput(d, i, g, range));
              d3.select(this).transition('appear')
                .duration(700)
                .ease(d3.easeCubicIn)
                .style('opacity', 1);
            });
        } else {
          nodeGroups.each(
            (d, i, g) => drawOutputScore(d, i, g, outputRectScale)
          );
        }
      }

      // // Update the color scale legend
      // // Local legends
      // for (let i = 0; i < 2; i++){
      //   let start = 1 + i * 5;
      //   let range1 = cnnLayerRanges.local[start];
      //   let range2 = cnnLayerRanges.local[start + 2];

      //   let localLegendScale1 = d3.scaleLinear()
      //     .range([0, 2 * nodeLength + hSpaceAroundGap])
      //     .domain([-range1, range1]);
        
      //   let localLegendScale2 = d3.scaleLinear()
      //     .range([0, 3 * nodeLength + 2 * hSpaceAroundGap])
      //     .domain([-range2, range2]);

      //   let localLegendAxis1 = d3.axisBottom()
      //     .scale(localLegendScale1)
      //     .tickFormat(d3.format('.2f'))
      //     .tickValues([-range1, 0, range1]);
        
      //   let localLegendAxis2 = d3.axisBottom()
      //     .scale(localLegendScale2)
      //     .tickFormat(d3.format('.2f'))
      //     .tickValues([-range2, 0, range2]);
        
      //   svg.select(`g#local-legend-${i}-1`).select('g').call(localLegendAxis1);
      //   svg.select(`g#local-legend-${i}-2`).select('g').call(localLegendAxis2);
      // }

      // // Module legend
      // for (let i = 0; i < 2; i++){
      //   let start = 1 + i * 5;
      //   let range = cnnLayerRanges.local[start];

      //   let moduleLegendScale = d3.scaleLinear()
      //     .range([0, 5 * nodeLength + 3 * hSpaceAroundGap +
      //       1 * hSpaceAroundGap * gapRatio - 1.2])
      //     .domain([-range, range]);

      //   let moduleLegendAxis = d3.axisBottom()
      //     .scale(moduleLegendScale)
      //     .tickFormat(d3.format('.2f'))
      //     .tickValues([-range, -(range / 2), 0, range/2, range]);
        
      //   svg.select(`g#module-legend-${i}`).select('g').call(moduleLegendAxis);
      // }

      // // Global legend
      // let start = 1;
      // let range = cnnLayerRanges.global[start];

      // let globalLegendScale = d3.scaleLinear()
      //   .range([0, 10 * nodeLength + 6 * hSpaceAroundGap +
      //     3 * hSpaceAroundGap * gapRatio - 1.2])
      //   .domain([-range, range]);

      // let globalLegendAxis = d3.axisBottom()
      //   .scale(globalLegendScale)
      //   .tickFormat(d3.format('.2f'))
      //   .tickValues([-range, -(range / 2), 0, range/2, range]);

      // svg.select(`g#global-legend`).select('g').call(globalLegendAxis);

      // // Output legend
      // let outputLegendAxis = d3.axisBottom()
      //   .scale(outputRectScale)
      //   .tickFormat(d3.format('.1f'))
      //   .tickValues([0, cnnLayerRanges.output[1]]);
      
      // svg.select('g#output-legend').select('g').call(outputLegendAxis);
    };

    /**
     * Update the ranges for current CNN layers
     */
    const updateCNNLayerRanges = () => {
      // Iterate through all nodes to find a output ranges for each layer
      let cnnLayerRangesLocal = [1];
      let curRange = undefined;

      // Also track the min/max of each layer (avoid computing during intermediate
      // layer)
      cnnLayerMinMax = [];

      for (let l = 0; l < cnn.length - 1; l++) {
        let curLayer = cnn[l];

        // Compute the min max
        let outputExtents = curLayer.map(l => getExtent(l.output));
        let aggregatedExtent = outputExtents.reduce((acc, cur) => {
          return [Math.min(acc[0], cur[0]), Math.max(acc[1], cur[1])];
        });
        cnnLayerMinMax.push({min: aggregatedExtent[0], max: aggregatedExtent[1]});

        // conv layer refreshes curRange counting
        if (curLayer[0].type === 'conv' || curLayer[0].type === 'fc') {
          aggregatedExtent = aggregatedExtent.map(Math.abs);
          // Plus 0.1 to offset the rounding error (avoid black color)
          curRange = 2 * (0.1 + 
            Math.round(Math.max(...aggregatedExtent) * 1000) / 1000);
        }

        if (curRange !== undefined){
          cnnLayerRangesLocal.push(curRange);
        }
      }

      // Finally, add the output layer range
      cnnLayerRangesLocal.push(1);
      cnnLayerMinMax.push({min: 0, max: 1});

      // Support different levels of scales (1) lcoal, (2) component, (3) global
      let cnnLayerRangesComponent = [1];
      let numOfComponent = (numLayers - 2) / 2;
      for (let i = 0; i < numOfComponent; i++) {
        let curArray = cnnLayerRangesLocal.slice(1 + 2 * i, 1 + 2 * i + 2);
        let maxRange = Math.max(...curArray);
        for (let j = 0; j < 5; j++) {
          cnnLayerRangesComponent.push(maxRange);
        }
      }
      cnnLayerRangesComponent.push(1);

      let cnnLayerRangesGlobal = [1];
      let maxRange = Math.max(...cnnLayerRangesLocal.slice(1,
        cnnLayerRangesLocal.length - 1));
      for (let i = 0; i < numLayers - 2; i++) {
        cnnLayerRangesGlobal.push(maxRange);
      }
      cnnLayerRangesGlobal.push(1);

      // Update the ranges dictionary
      cnnLayerRanges.local = cnnLayerRangesLocal;
      cnnLayerRanges.module = cnnLayerRangesComponent;
      cnnLayerRanges.global = cnnLayerRangesGlobal;
      cnnLayerRanges.output = [0, d3.max(cnn[cnn.length - 1].map(d => d.output))];

      cnnLayerRangesStore.set(cnnLayerRanges);
      cnnLayerMinMaxStore.set(cnnLayerMinMax);
    };

    /* global d3 */

    // Configs
    const layerColorScales$3 = overviewConfig.layerColorScales;
    const nodeLength$3 = overviewConfig.nodeLength;
    const intermediateColor = overviewConfig.intermediateColor;
    const svgPaddings$1 = overviewConfig.svgPaddings;

    // Shared variables
    let svg$2 = undefined;
    svgStore.subscribe( value => {svg$2 = value;} );

    let vSpaceAroundGap$1 = undefined;
    vSpaceAroundGapStore.subscribe( value => {vSpaceAroundGap$1 = value;} );

    /**
     * Move one layer horizontally
     * @param {object} arg Multiple arguments {
     *   layerIndex: current layer index
     *   targetX: destination x
     *   disable: make this layer unresponsible
     *   delay: animation delay
     *   opacity: change the current layer's opacity
     *   specialIndex: avoid manipulating `specialIndex`th node
     *   onEndFunc: call this function when animation finishes
     *   transitionName: animation ID
     * }
     */
    const moveLayerX = (arg) => {
      let layerIndex = arg.layerIndex;
      let targetX = arg.targetX;
      let disable = arg.disable;
      let delay = arg.delay;
      let opacity = arg.opacity;
      let specialIndex = arg.specialIndex;
      let onEndFunc = arg.onEndFunc;
      let transitionName = arg.transitionName === undefined ? 'move' : arg.transitionName;
      let duration = arg.duration === undefined ? 500 : arg.duration;

      // Move the selected layer
      let curLayer = svg$2.select(`g#cnn-layer-group-${layerIndex}`);
      curLayer.selectAll('g.node-group').each((d, i, g) => {
        d3.select(g[i])
          .style('cursor', disable && i !== specialIndex ? 'default' : 'pointer')
          .style('pointer-events', disable && i !== specialIndex ? 'none' : 'all')
          .select('image')
          .transition(transitionName)
          .ease(d3.easeCubicInOut)
          .delay(delay)
          .duration(duration)
          .attr('x', targetX);
        
        d3.select(g[i])
          .style('cursor', disable && i !== specialIndex ? 'default' : 'pointer')
          .style('pointer-events', disable && i !== specialIndex ? 'none' : 'all')
          .select('circle.dense-circle')
          .transition(transitionName)
          .delay(delay)
          .duration(duration)
          .attr('cx', targetX + nodeLength$3 / 2);
        
        d3.select(g[i])
          .select('rect.bounding')
          .transition(transitionName)
          .ease(d3.easeCubicInOut)
          .delay(delay)
          .duration(duration)
          .attr('x', targetX);
        
        d3.select(g[i])
          .select('circle.bounding')
          .transition(transitionName)
          .delay(delay)
          .duration(duration)
          .attr('cx', targetX + nodeLength$3 / 2);  
        
        if (opacity !== undefined && i !== specialIndex) {
          d3.select(g[i])
            .select('image')
            .style('opacity', opacity);
        }
      });
      svg$2.selectAll();
      // Also move the layer labels
      svg$2.selectAll(`g#layer-label-${layerIndex}`)
        .transition(transitionName)
        .ease(d3.easeCubicInOut)
        .delay(delay)
        .duration(duration)
        .attr('transform', () => {
          let x = targetX + nodeLength$3 / 2;
          let y = (svgPaddings$1.top + vSpaceAroundGap$1) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .on('end', onEndFunc);

      svg$2.selectAll(`g#layer-detailed-label-${layerIndex}`)
        .transition(transitionName)
        .ease(d3.easeCubicInOut)
        .delay(delay)
        .duration(duration)
        .attr('transform', () => {
          let x = targetX + nodeLength$3 / 2;
          let y = (svgPaddings$1.top + vSpaceAroundGap$1) / 2 - 6;
          return `translate(${x}, ${y})`;
        })
        .on('end', onEndFunc);
    };

    /**
     * Append a gradient definition to `group`
     * @param {string} gradientID CSS ID for the gradient def
     * @param {[{offset: number, color: string, opacity: number}]} stops Gradient stops
     * @param {element} group Element to append def to
     */
    const addOverlayGradient = (gradientID, stops, group) => {
      if (group === undefined) {
        group = svg$2;
      }

      // Create a gradient
      let defs = group.append("defs")
        .attr('class', 'overlay-gradient');

      let gradient = defs.append("linearGradient")
        .attr("id", gradientID)
        .attr("x1", "0%")
        .attr("x2", "100%")
        .attr("y1", "100%")
        .attr("y2", "100%");
      
      stops.forEach(s => {
        gradient.append('stop')
          .attr('offset', s.offset)
          .attr('stop-color', s.color)
          .attr('stop-opacity', s.opacity);
      });
    };

    /**
     * Draw the legend for intermediate layer
     * @param {object} arg 
     * {
     *   legendHeight: height of the legend rectangle
     *   curLayerIndex: the index of selected layer
     *   range: colormap range
     *   group: group to append the legend
     *   minMax: {min: min value, max: max value}
     *   width: width of the legend
     *   x: x position of the legend
     *   y: y position of the legend
     *   isInput: if the legend is for the input layer (special handle black to
     *      white color scale)
     *   colorScale: d3 color scale
     *   gradientAppendingName: name of the appending gradient
     *   gradientGap: gap to make the color lighter
     * }
     */
    const drawIntermediateLayerLegend = (arg) => {
      let legendHeight = arg.legendHeight,
        curLayerIndex = arg.curLayerIndex,
        range = arg.range,
        group = arg.group,
        minMax = arg.minMax,
        width = arg.width,
        x = arg.x,
        y = arg.y,
        isInput = arg.isInput,
        colorScale = arg.colorScale,
        gradientAppendingName = arg.gradientAppendingName,
        gradientGap = arg.gradientGap;
      
      if (colorScale === undefined) { colorScale = layerColorScales$3.conv; }
      if (gradientGap === undefined) { gradientGap = 0; }
      
      // Add a legend color gradient
      let gradientName = 'url(#inputGradient)';
      let normalizedColor = v => colorScale(v * (1 - 2 * gradientGap) + gradientGap);

      if (!isInput) {
        let leftValue = (minMax.min + range / 2) / range,
          zeroValue = (0 + range / 2) / range,
          rightValue = (minMax.max + range / 2) / range,
          totalRange = minMax.max - minMax.min,
          zeroLocation = (0 - minMax.min) / totalRange,
          leftMidValue = leftValue + (zeroValue - leftValue)/2,
          rightMidValue = zeroValue + (rightValue - zeroValue)/2;

        let stops = [
          {offset: 0, color: normalizedColor(leftValue), opacity: 1},
          {offset: zeroLocation / 2,
            color: normalizedColor(leftMidValue),
            opacity: 1},
          {offset: zeroLocation,
            color: normalizedColor(zeroValue),
            opacity: 1},
          {offset: zeroLocation + (1 - zeroValue) / 2,
            color: normalizedColor(rightMidValue),
            opacity: 1},
          {offset: 1, color: normalizedColor(rightValue), opacity: 1}
        ];

        if (gradientAppendingName === undefined) {
          addOverlayGradient('intermediate-legend-gradient', stops, group);
          gradientName = 'url(#intermediate-legend-gradient)';
        } else {
          addOverlayGradient(`${gradientAppendingName}`, stops, group);
          gradientName = `url(#${gradientAppendingName})`;
        }
      }

      let legendScale = d3.scaleLinear()
        .range([0, width - 1.2])
        .domain(isInput ? [0, range] : [minMax.min, minMax.max]);

      let legendAxis = d3.axisBottom()
        .scale(legendScale)
        .tickFormat(d3.format(isInput ? 'd' : '.2f'))
        .tickValues(isInput ? [0, range] : [minMax.min, 0, minMax.max]);
      
      let intermediateLegend = group.append('g')
        .attr('class', `intermediate-legend-${curLayerIndex - 1}`)
        .attr('transform', `translate(${x}, ${y})`);
      
      let legendGroup = intermediateLegend.append('g')
        .attr('transform', `translate(0, ${legendHeight - 3})`)
        .call(legendAxis);
      
      legendGroup.selectAll('text')
        .style('font-size', '9px')
        .style('fill', intermediateColor);
      
      legendGroup.selectAll('path, line')
        .style('stroke', intermediateColor);

      intermediateLegend.append('rect')
        .attr('width', width)
        .attr('height', legendHeight)
        .attr('transform', `rotate(${isInput ? 180 : 0},
      ${width / 2}, ${legendHeight / 2})`)
        .style('fill', gradientName);
    };

    /**
     * Draw an very neat arrow!
     * @param {object} arg 
     * {
     *   group: element to append this arrow to
     *   sx: source x
     *   sy: source y
     *   tx: target x
     *   ty: target y
     *   dr: radius of curve (I'm using a circle)
     *   hFlip: the direction to choose the circle (there are always two ways)
     * }
     */
    const drawArrow = (arg) => {
      let group = arg.group,
        sx = arg.sx,
        sy = arg.sy,
        tx = arg.tx,
        ty = arg.ty,
        dr = arg.dr,
        hFlip = arg.hFlip,
        marker = arg.marker === undefined ? 'marker' : arg.marker;

      /* Cool graphics trick -> merge translate and scale together
      translateX = (1 - scaleX) * tx,
      translateY = (1 - scaleY) * ty;
      */
      
      let arrow = group.append('g')
        .attr('class', 'arrow-group');

      arrow.append('path')
        .attr("d", `M${sx},${sy}A${dr},${dr} 0 0,${hFlip ? 0 : 1} ${tx},${ty}`)
        .attr('marker-end', `url(#${marker})`)
        .style('stroke', 'gray')
        .style('fill', 'none');
    };

    /* global d3 */

    // Configs
    const layerColorScales$4 = overviewConfig.layerColorScales;
    const nodeLength$4 = overviewConfig.nodeLength;
    const plusSymbolRadius = overviewConfig.plusSymbolRadius;
    const numLayers$1 = overviewConfig.numLayers;
    const intermediateColor$1 = overviewConfig.intermediateColor;
    const kernelRectLength = overviewConfig.kernelRectLength;
    const svgPaddings$2 = overviewConfig.svgPaddings;
    const gapRatio$1 = overviewConfig.gapRatio;
    const overlayRectOffset = overviewConfig.overlayRectOffset;
    const formater$1 = d3.format('.4f');
    let isEndOfAnimation = false;

    // Shared variables
    let svg$3 = undefined;
    svgStore.subscribe( value => {svg$3 = value;} );

    let vSpaceAroundGap$2 = undefined;
    vSpaceAroundGapStore.subscribe( value => {vSpaceAroundGap$2 = value;} );

    let hSpaceAroundGap$1 = undefined;
    hSpaceAroundGapStore.subscribe( value => {hSpaceAroundGap$1 = value;} );

    let cnn$1 = undefined;
    cnnStore.subscribe( value => {cnn$1 = value;} );

    let nodeCoordinate$1 = undefined;
    nodeCoordinateStore.subscribe( value => {nodeCoordinate$1 = value;} );

    let selectedScaleLevel$1 = undefined;
    selectedScaleLevelStore.subscribe( value => {selectedScaleLevel$1 = value;} );

    let cnnLayerRanges$1 = undefined;
    cnnLayerRangesStore.subscribe( value => {cnnLayerRanges$1 = value;} );

    let cnnLayerMinMax$1 = undefined;
    cnnLayerMinMaxStore.subscribe( value => {cnnLayerMinMax$1 = value;} );

    let needRedraw = [undefined, undefined];
    needRedrawStore.subscribe( value => {needRedraw = value;} );

    let shouldIntermediateAnimate = undefined;
    shouldIntermediateAnimateStore.subscribe(value => {
      shouldIntermediateAnimate = value;
    });

    let detailedMode$1 = undefined;
    detailedModeStore.subscribe( value => {detailedMode$1 = value;} );

    let intermediateLayerPosition = undefined;
    intermediateLayerPositionStore.subscribe ( value => {intermediateLayerPosition = value;} );

    // let curRightX = 0;

    /**
     * Draw the intermediate layer activation heatmaps
     * @param {element} image Neuron heatmap image
     * @param {number} range Colormap range
     * @param {function} colorScale Colormap
     * @param {number} length Image length
     * @param {[[number]]} dataMatrix Heatmap matrix
     */
    const drawIntermidiateImage = (image, range, colorScale, length,
      dataMatrix) => {
      // Set up a buffer convas in order to resize image
      let imageLength = length;
      let bufferCanvas = document.createElement("canvas");
      let bufferContext = bufferCanvas.getContext("2d");
      bufferCanvas.width = imageLength;
      bufferCanvas.height = imageLength;

      // Fill image pixel array
      let imageSingle = bufferContext.getImageData(0, 0, imageLength, imageLength);
      let imageSingleArray = imageSingle.data;

      for (let i = 0; i < imageSingleArray.length; i+=4) {
        let pixeIndex = Math.floor(i / 4);
        let row = Math.floor(pixeIndex / imageLength);
        let column = pixeIndex % imageLength;
        let color = d3.rgb(colorScale((dataMatrix[row][column] + range / 2) / range));

        imageSingleArray[i] = color.r;
        imageSingleArray[i + 1] = color.g;
        imageSingleArray[i + 2] = color.b;
        imageSingleArray[i + 3] = 255;
      }

      // canvas.toDataURL() only exports image in 96 DPI, so we can hack it to have
      // higher DPI by rescaling the image using canvas magic
      let largeCanvas = document.createElement('canvas');
      largeCanvas.width = nodeLength$4 * 3;
      largeCanvas.height = nodeLength$4 * 3;
      let largeCanvasContext = largeCanvas.getContext('2d');

      // Use drawImage to resize the original pixel array, and put the new image
      // (canvas) into corresponding canvas
      bufferContext.putImageData(imageSingle, 0, 0);
      largeCanvasContext.drawImage(bufferCanvas, 0, 0, imageLength, imageLength,
        0, 0, nodeLength$4 * 3, nodeLength$4 * 3);
      
      let imageDataURL = largeCanvas.toDataURL();
      image.attr('xlink:href', imageDataURL);

      // Destory the buffer canvas
      bufferCanvas.remove();
      largeCanvas.remove();
    };

    /**
     * Create a node group for the intermediate layer
     * @param {number} curLayerIndex Intermediate layer index
     * @param {number} selectedI Clicked node index
     * @param {element} groupLayer Group element
     * @param {number} x Node's x
     * @param {number} y Node's y
     * @param {number} nodeIndex Node's index
     * @param {function} intermediateNodeMouseOverHandler Mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler Mouse leave handler
     * @param {function} intermediateNodeClicked Mouse click handler
     * @param {bool} interaction Whether support interaction
     */
    const createIntermediateNode = (curLayerIndex, selectedI, groupLayer, x, y,
      nodeIndex, stride, intermediateNodeMouseOverHandler,
      intermediateNodeMouseLeaveHandler, intermediateNodeClicked, interaction) => {
      let newNode = groupLayer.append('g')
        .datum(cnn$1[curLayerIndex - 1][nodeIndex])
        .attr('class', 'intermediate-node')
        .attr('cursor', interaction ? 'pointer': 'default')
        .attr('pointer-events', interaction ? 'all': 'none')
        .attr('node-index', nodeIndex)
        .on('mouseover', intermediateNodeMouseOverHandler)
        .on('mouseleave', intermediateNodeMouseLeaveHandler)
        .on('click', (d, g, i) => intermediateNodeClicked(d, g, i, selectedI,
          curLayerIndex));
      
      newNode.append('image')
        .attr('width', nodeLength$4)
        .attr('height', nodeLength$4)
        .attr('x', x)
        .attr('y', y);

      // Overlay the image with a mask of many small rectangles
      let strideTime = Math.floor(nodeLength$4 / stride);
      let overlayGroup = newNode.append('g')
        .attr('class', 'overlay-group')
        .attr('transform', `translate(${x}, ${y})`);
      
      for (let i = 0; i < strideTime; i++) {
        for (let j = 0; j < strideTime; j++) {
          overlayGroup.append('rect')
            .attr('class', `mask-overlay mask-${i}-${j}`)
            .attr('width', stride)
            .attr('height', stride)
            .attr('x', i * stride)
            .attr('y', j * stride)
            .style('fill', 'var(--light-gray)')
            .style('stroke', 'var(--light-gray)')
            .style('opacity', 1);
        }
      }

      // Add a rectangle to show the border
      newNode.append('rect')
        .attr('class', 'bounding')
        .attr('width', nodeLength$4)
        .attr('height', nodeLength$4)
        .attr('x', x)
        .attr('y', y)
        .style('fill', 'none')
        .style('stroke', intermediateColor$1)
        .style('stroke-width', 1);
      
      return newNode;
    };

    const startOutputAnimation = (kernelGroup, tickTime1D, stride, delay,
      curLayerIndex) => {
      const slidingAnimation = () => {
        let originX = +kernelGroup.attr('data-origin-x');
        let originY = +kernelGroup.attr('data-origin-y');
        let oldTick = +kernelGroup.attr('data-tick');
        let i = (oldTick) % tickTime1D;
        let j = Math.floor((oldTick) / tickTime1D);
        let x = originX + i * stride;
        let y = originY + j * stride;
        let newTick = (oldTick + 1) % (tickTime1D * tickTime1D);

        // Remove one mask rect at each tick
        svg$3.selectAll(`rect.mask-${i}-${j}`)
          .transition('window-sliding-mask')
          .delay(delay + 100)
          .duration(300)
          .style('opacity', 0);

          kernelGroup.attr('data-tick', newTick)
          .transition('window-sliding-input')
          .delay(delay)
          .duration(200)
          .attr('transform', `translate(${x}, ${y})`)
          .on('end', () => {
            if (newTick === 0) {
              /* Uncomment to wrap the sliding
              svg.selectAll(`rect.mask-overlay`)
                .transition('window-sliding-mask')
                .delay(delay - 200)
                .duration(300)
                .style('opacity', 1);
              */

              // Stop the animation
              // Be careful with animation racing so call this function here instead
              // of under selectALL
              if (!isEndOfAnimation) {
                animationButtonClicked(curLayerIndex);
              }
            }
            if (shouldIntermediateAnimate) {
              slidingAnimation();
            }
          });
      };
      slidingAnimation();
    };

    const startIntermediateAnimation = (kernelGroupInput, kernelGroupResult,
      tickTime1D, stride) => {
      let delay = 200;
      const slidingAnimation = () => {
        let originX = +kernelGroupInput.attr('data-origin-x');
        let originY = +kernelGroupInput.attr('data-origin-y');
        let originXResult = +kernelGroupResult.attr('data-origin-x');
        let oldTick = +kernelGroupInput.attr('data-tick');
        let i = (oldTick) % tickTime1D;
        let j = Math.floor((oldTick) / tickTime1D);
        let x = originX + i * stride;
        let y = originY + j * stride;
        let xResult = originXResult + (oldTick % tickTime1D) * stride;
        let newTick = (oldTick + 1) % (tickTime1D * tickTime1D);

        // Remove one mask rect at each tick
        svg$3.selectAll(`rect.mask-${i}-${j}`)
          .transition('window-sliding-mask')
          .delay(delay + 100)
          .duration(300)
          .style('opacity', 0);

        kernelGroupInput.attr('data-tick', newTick)
          .transition('window-sliding-input')
          .delay(delay)
          .duration(200)
          .attr('transform', `translate(${x}, ${y})`);

        kernelGroupResult.attr('data-tick', newTick)
          .transition('window-sliding-result')
          .delay(delay)
          .duration(200)
          .attr('transform', `translate(${xResult}, ${y})`)
          .on('end', () => {
            /* Uncomment to wrap the sliding
            if (newTick === 0) {
              svg.selectAll(`rect.mask-overlay`)
                .transition('window-sliding-mask')
                .delay(delay - 200)
                .duration(300)
                .style('opacity', 1);
            }
            */
            if (shouldIntermediateAnimate) {
              slidingAnimation();
            }
          });
      };
      slidingAnimation();
    };

    const animationButtonClicked = (curLayerIndex) => {
      if (d3.event !== null) {
        d3.event.stopPropagation();
      }
      
      let delay = 200;
      let tickTime1D = nodeLength$4 / (kernelRectLength * 3);
      let stride = kernelRectLength * 3; 

      if (isEndOfAnimation) {
        // Start the animation
        shouldIntermediateAnimateStore.set(true);

        // Show kernel
        svg$3.selectAll('.kernel-clone')
          .transition()
          .duration(300)
          .style('opacity', 1);

        // Restore the mask
        svg$3.selectAll(`rect.mask-overlay`)
          .transition()
          .duration(300)
          .style('opacity', 1);

        // Start the intermediate animation
        for (let i  = 0; i < nodeCoordinate$1[curLayerIndex - 1].length; i++) {
          startIntermediateAnimation(d3.select(`.kernel-input-${i}`),
            d3.select(`.kernel-result-${i}`), tickTime1D, stride);
        }

        // Start the output animation
        startOutputAnimation(d3.select('.kernel-output'),
          tickTime1D, stride, delay, curLayerIndex);
        
        // Change the flow edge style
        svg$3.selectAll('path.flow-edge')
          .attr('stroke-dasharray', '4 2')
          .attr('stroke-dashoffset', 0)
          .each((d, i, g) => animateEdge(d, i, g, 0 - 1000));

        // Change button icon
        svg$3.select('.animation-control-button')
          .attr('xlink:href', '/assets/img/fast_forward.svg');
        
        isEndOfAnimation = false;

      } else {
        // End the animation
        shouldIntermediateAnimateStore.set(false);
        
        // Show all intermediate and output results
        svg$3.selectAll(`rect.mask-overlay`)
          .transition('skip')
          .duration(600)
          .style('opacity', 0);
        
        // Move kernel to the beginning to prepare for the next animation
        let kernelClones = svg$3.selectAll('.kernel-clone');
        kernelClones.attr('data-tick', 0)
          .transition('skip')
          .duration(300)
          .style('opacity', 0)
          .on('end', (d, i, g) => {
            let element = d3.select(g[i]);
            let originX = +element.attr('data-origin-x');
            let originY = +element.attr('data-origin-y');
            element.attr('transform', `translate(${originX}, ${originY})`);
          });
        
        // Change flow edge style
        svg$3.selectAll('path.flow-edge')
          .interrupt()
          .attr('stroke-dasharray', '0 0');
        
        // Change button icon
        svg$3.select('.animation-control-button')
          .attr('xlink:href', '/assets/img/redo.svg');
        
        isEndOfAnimation = true;
      }
    };

    const animateEdge = (d, i, g, dashoffset) => {
      let curPath = d3.select(g[i]);
      curPath.transition()
        .duration(60000)
        .ease(d3.easeLinear)
        .attr('stroke-dashoffset', dashoffset)
        .on('end', (d, i, g) => {
          if (shouldIntermediateAnimate) {
            animateEdge(d, i, g, dashoffset - 2000);
          }
        });
    };

    /**
     * Draw one intermediate layer
     * @param {number} curLayerIndex 
     * @param {number} leftX X value of intermediate layer left border
     * @param {number} rightX X value of intermediate layer right border
     * @param {number} rightStart X value of right component starting anchor
     * @param {number} intermediateGap The inner gap
     * @param {number} d Clicked node bounded data
     * @param {number} i Clicked node index
     * @param {function} intermediateNodeMouseOverHandler Mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler Mouse leave handler
     * @param {function} intermediateNodeClicked Mouse click handler
     */
    const drawIntermediateLayer = (curLayerIndex, leftX, rightX, rightStart,
      intermediateGap, d, i, intermediateNodeMouseOverHandler,
      intermediateNodeMouseLeaveHandler, intermediateNodeClicked) => {
      
      // curRightX = rightStart;

      // Add the intermediate layer
      let intermediateLayer = svg$3.append('g')
        .attr('class', 'intermediate-layer')
        .style('opacity', 0);
      
      // Recovert the animation counter
      isEndOfAnimation = false;
      
      // Tried to add a rectangle to block the intermediate because of webkit's
      // horrible support (decade old bug) for foreignObject. It doesnt work either.
      // https://bugs.webkit.org/show_bug.cgi?id=23113
      // (1). ForeignObject's inside position is wrong on webkit
      // (2). 'opacity' of ForeignObject doesn't work on webkit
      // (3). ForeignObject always show up at the front regardless the svg
      //      stacking order on webkit

      let intermediateX1 = leftX + nodeLength$4 + intermediateGap;
      let intermediateX2 = intermediateX1 + nodeLength$4 + intermediateGap * 1.5;

      let range = cnnLayerRanges$1[selectedScaleLevel$1][curLayerIndex];
      let colorScale = layerColorScales$4[d.type];
      let intermediateMinMax = [];
      
      // Copy the previsious layer to construct foreignObject placeholder
      // Also add edges from/to the intermediate layer in this loop
      let linkData = [];

      // Accumulate the intermediate sum
      // let itnermediateSumMatrix = init2DArray(d.output.length,
      //  d.output.length, 0);

      // Compute the min max of all kernel weights in the intermediate layer
      let kernelExtents = d.inputLinks.map(link => getExtent(link.weight));
      let kernelExtent = kernelExtents.reduce((acc, cur) => {
        return [Math.min(acc[0], cur[0]), Math.max(acc[1], cur[1])];
      });
      let kernelRange = 2 * (Math.round(
        Math.max(...kernelExtent.map(Math.abs)) * 1000) / 1000);
      let kernelColorGap = 0.2;

      // Compute stride for the kernel animation
      let stride = kernelRectLength * 3; 

      // Also add the overlay mask on the output node
      let outputY = nodeCoordinate$1[curLayerIndex][i].y;
      let curNode = svg$3.select(`#layer-${curLayerIndex}-node-${i}`);
      let outputOverlayGroup = curNode.append('g')
        .attr('class', 'overlay-group')
        .attr('transform', `translate(${rightX}, ${outputY})`);

      let strideTime = Math.floor(nodeLength$4 / stride);
      
      for (let i = 0; i < strideTime; i++) {
        for (let j = 0; j < strideTime; j++) {
          outputOverlayGroup.append('rect')
            .attr('class', `mask-overlay mask-${i}-${j}`)
            .attr('width', stride)
            .attr('height', stride)
            .attr('x', i * stride)
            .attr('y', j * stride)
            .style('fill', 'var(--light-gray)')
            .style('stroke', 'var(--light-gray)')
            .style('opacity', 1);
        }
      }

      // Make sure the bounding box is on top of other things
      curNode.select('rect.bounding').raise();

      // Add sliding kernel for the output node
      let kernelGroup = intermediateLayer.append('g')
        .attr('class', `kernel kernel-output kernel-clone`)
        .attr('transform', `translate(${rightX}, ${outputY})`);

      kernelGroup.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', kernelRectLength * 3)
        .attr('height', kernelRectLength * 3)
        .attr('fill', 'none')
        .attr('stroke', intermediateColor$1);
      
      kernelGroup.attr('data-tick', 0)
        .attr('data-origin-x', rightX)
        .attr('data-origin-y', outputY);

      let delay = 200;
      let tickTime1D = nodeLength$4 / (kernelRectLength * 3);

      startOutputAnimation(kernelGroup, tickTime1D, stride, delay, curLayerIndex);

      // First intermediate layer
      nodeCoordinate$1[curLayerIndex - 1].forEach((n, ni) => {

        // Compute the intermediate value
        let inputMatrix = cnn$1[curLayerIndex - 1][ni].output;
        let kernelMatrix = cnn$1[curLayerIndex][i].inputLinks[ni].weight;
        let interMatrix = singleConv(inputMatrix, kernelMatrix);

        // Compute the intermediate layer min max
        intermediateMinMax.push(getExtent(interMatrix));

        // Update the intermediate sum
        // itnermediateSumMatrix = matrixAdd(itnermediateSumMatrix, interMatrix);

        // Layout the canvas and rect
        let newNode = createIntermediateNode(curLayerIndex, i, intermediateLayer,
          intermediateX1, n.y, ni, stride, intermediateNodeMouseOverHandler,
          intermediateNodeMouseLeaveHandler, intermediateNodeClicked, true);
        
        // Draw the image
        let image = newNode.select('image');
        drawIntermidiateImage(image, range, colorScale, d.output.length,
          interMatrix);      

        // Edge: input -> intermediate1
        linkData.push({
          source: getOutputKnot({x: leftX, y: n.y}),
          target: getInputKnot({x: intermediateX1, y: n.y}),
          name: `input-${ni}-inter1-${ni}`
        });

        // Edge: intermediate1 -> intermediate2-1
        linkData.push({
          source: getOutputKnot({x: intermediateX1, y: n.y}),
          target: getInputKnot({x: intermediateX2,
            y: nodeCoordinate$1[curLayerIndex][i].y}),
          name: `inter1-${ni}-inter2-1`
        });

        // Create a small kernel illustration
        // Here we minus 2 because of no padding
        // let tickTime1D = nodeLength / (kernelRectLength) - 2;
        let kernelRectX = leftX - kernelRectLength * 3 * 2;
        let kernelGroup = intermediateLayer.append('g')
          .attr('class', `kernel kernel-${ni}`)
          .attr('transform', `translate(${kernelRectX}, ${n.y})`);

        let weightText = 'Kernel weights: [';
        let f2 = d3.format('.2f');
        for (let r = 0; r < kernelMatrix.length; r++) {
          for (let c = 0; c < kernelMatrix[0].length; c++) {
            kernelGroup.append('rect')
              .attr('class', 'kernel')
              .attr('x', kernelRectLength * c)
              .attr('y', kernelRectLength * r)
              .attr('width', kernelRectLength)
              .attr('height', kernelRectLength)
              .attr('fill', gappedColorScale(layerColorScales$4.weight, kernelRange,
                kernelMatrix[r][c], kernelColorGap));

            let sep = '';
            if (c === 0 && r == 0) { sep = ''; }
            else if (c === 0) { sep = '; '; }
            else { sep = ', '; }
            weightText = weightText.concat(sep, `${f2(kernelMatrix[r][c])}`);
          }
        }
        weightText = weightText.concat(']');

        kernelGroup.append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', kernelRectLength * 3)
          .attr('height', kernelRectLength * 3)
          .attr('fill', 'none')
          .attr('stroke', intermediateColor$1);
        
        kernelGroup.style('pointer-events', 'all')
          .style('cursor', 'crosshair')
          .on('mouseover', () => {
            hoverInfoStore.set( {show: true, text: weightText} );
          })
          .on('mouseleave', () => {
            hoverInfoStore.set( {show: false, text: weightText} );
          })
          .on('click', () => {d3.event.stopPropagation();});

        // Sliding the kernel on the input channel and result channel at the same
        // time
        let kernelGroupInput = kernelGroup.clone(true)
          .style('pointer-events', 'none')
          .style('cursor', 'pointer')
          .classed('kernel-clone', true)
          .classed(`kernel-input-${ni}`, true);

        kernelGroupInput.style('opacity', 0.9)
          .selectAll('rect.kernel')
          .style('opacity', 0.7);

        kernelGroupInput.attr('transform', `translate(${leftX}, ${n.y})`)
          .attr('data-tick', 0)
          .attr('data-origin-x', leftX)
          .attr('data-origin-y', n.y);

        let kernelGroupResult = kernelGroup.clone(true)
          .style('pointer-events', 'none')
          .style('cursor', 'pointer')
          .classed('kernel-clone', true)
          .classed(`kernel-result-${ni}`, true);

        kernelGroupResult.style('opacity', 0.9)
          .selectAll('rect.kernel')
          .style('fill', 'none');

        kernelGroupResult.attr('transform',
          `translate(${intermediateX1}, ${n.y})`)
          .attr('data-origin-x', intermediateX1)
          .attr('data-origin-y', n.y);
        
        startIntermediateAnimation(kernelGroupInput, kernelGroupResult, tickTime1D,
          stride);
      });

      // Aggregate the intermediate min max
      let aggregatedExtent = intermediateMinMax.reduce((acc, cur) => {
        return [Math.min(acc[0], cur[0]), Math.max(acc[1], cur[1])];
      });
      let aggregatedMinMax = {min: aggregatedExtent[0], max: aggregatedExtent[1]};

      // Draw the plus operation symbol
      let symbolY = nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 / 2;
      let symbolRectHeight = 1;
      let symbolGroup = intermediateLayer.append('g')
        .attr('class', 'plus-symbol')
        .attr('transform', `translate(${intermediateX2 + plusSymbolRadius}, ${symbolY})`);
      
      symbolGroup.append('rect')
        .attr('x', -plusSymbolRadius)
        .attr('y', -plusSymbolRadius)
        .attr('width', 2 * plusSymbolRadius)
        .attr('height', 2 * plusSymbolRadius)
        .attr('rx', 3)
        .attr('ry', 3)
        .style('fill', 'none')
        .style('stroke', intermediateColor$1);
      
      symbolGroup.append('rect')
        .attr('x', -(plusSymbolRadius - 3))
        .attr('y', -symbolRectHeight / 2)
        .attr('width', 2 * (plusSymbolRadius - 3))
        .attr('height', symbolRectHeight)
        .style('fill', intermediateColor$1);

      symbolGroup.append('rect')
        .attr('x', -symbolRectHeight / 2)
        .attr('y', -(plusSymbolRadius - 3))
        .attr('width', symbolRectHeight)
        .attr('height', 2 * (plusSymbolRadius - 3))
        .style('fill', intermediateColor$1);

      // Place the bias rectangle below the plus sign if user clicks the firrst
      // conv node
      if (i == 0) {
        // Add bias symbol to the plus symbol
        symbolGroup.append('circle')
            .attr('cx', 0)
            .attr('cy', nodeLength$4 / 2 + kernelRectLength)
            .attr('r', 4)
            .style('stroke', intermediateColor$1)
            .style('cursor', 'crosshair')
            .style('fill', gappedColorScale(layerColorScales$4.weight, kernelRange,
              d.bias, kernelColorGap))
            .on('mouseover', () => {
              hoverInfoStore.set( {show: true, text: `Bias: ${formater$1(d.bias)}`} );
            })
            .on('mouseleave', () => {
              hoverInfoStore.set( {show: false, text: `Bias: ${formater$1(d.bias)}`} );
            });

        // Link from bias to the plus symbol
        linkData.push({
          source: {x: intermediateX2 + plusSymbolRadius,
            y: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4},
          target: {x: intermediateX2 + plusSymbolRadius,
            y: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 / 2 + plusSymbolRadius},
          name: `bias-plus`
        });
      } else {
        // Add bias symbol to the plus symbol
        symbolGroup.append('circle')
          .attr('cx', 0)
          .attr('cy', -nodeLength$4 / 2 - kernelRectLength)
          .attr('r', 4)
          .style('stroke', intermediateColor$1)
          .style('cursor', 'crosshair')
          .style('fill', gappedColorScale(layerColorScales$4.weight, kernelRange,
            d.bias, kernelColorGap))
          .on('mouseover', () => {
            hoverInfoStore.set( {show: true, text: `Bias: ${formater$1(d.bias)}`} );
          })
          .on('mouseleave', () => {
            hoverInfoStore.set( {show: false, text: `Bias: ${formater$1(d.bias)}`} );
          });
        
        // Link from bias to the plus symbol
        linkData.push({
          source: {x: intermediateX2 + plusSymbolRadius,
            y: nodeCoordinate$1[curLayerIndex][i].y},
          target: {x: intermediateX2 + plusSymbolRadius,
            y: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 / 2 - plusSymbolRadius},
          name: `bias-plus`
        });
      }

      // Link from the plus symbol to the output
      linkData.push({
        source: getOutputKnot({x: intermediateX2 + 2 * plusSymbolRadius - nodeLength$4,
          y: nodeCoordinate$1[curLayerIndex][i].y}),
        target: getInputKnot({x: rightX,
          y: nodeCoordinate$1[curLayerIndex][i].y}),
        name: `symbol-output`
      });
      
      // Output -> next layer
      linkData.push({
        source: getOutputKnot({x: rightX,
          y: nodeCoordinate$1[curLayerIndex][i].y}),
        target: getInputKnot({x: rightStart,
          y: nodeCoordinate$1[curLayerIndex][i].y}),
        name: `output-next`
      });

      // Draw the layer label
      intermediateLayer.append('g')
        .attr('class', 'layer-intermediate-label layer-label')
        .attr('transform', () => {
          let x = intermediateX1 + nodeLength$4 / 2;
          let y = (svgPaddings$2.top + vSpaceAroundGap$2) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .classed('hidden', detailedMode$1)
        .append('text')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .style('font-weight', 800)
        .style('opacity', '0.8')
        .text('intermediate');
      
      intermediateLayer.append('g')
        .attr('class', 'animation-control')
        .attr('transform', () => {
          let x = intermediateX1 + nodeLength$4 / 2;
          let y = (svgPaddings$2.top + vSpaceAroundGap$2) / 2 - 4;
          return `translate(${x}, ${y})`;
        })
        .on('click', () => animationButtonClicked(curLayerIndex))
        .append('image')
        .attr('class', 'animation-control-button')
        .attr('xlink:href', '/assets/img/fast_forward.svg')
        .attr('x', 50)
        .attr('y', 0)
        .attr('height', 13)
        .attr('width', 13);

      // Draw the detailed model layer label
      intermediateLayer.append('g')
        .attr('class', 'layer-intermediate-label layer-detailed-label')
        .attr('transform', () => {
          let x = intermediateX1 + nodeLength$4 / 2;
          let y = (svgPaddings$2.top + vSpaceAroundGap$2) / 2 - 5;
          return `translate(${x}, ${y})`;
        })
        .classed('hidden', !detailedMode$1)
        .append('text')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .style('opacity', '0.7')
        .style('font-weight', 800)
        .append('tspan')
        .text('intermediate')
        .append('tspan')
        .style('font-size', '8px')
        .style('font-weight', 'normal')
        .attr('x', 0)
        .attr('dy', '1.5em')
        .text(`(${cnn$1[curLayerIndex][0].output.length},
      ${cnn$1[curLayerIndex][0].output[0].length},
      ${cnn$1[curLayerIndex].length})`);

      // Draw the edges
      let linkGen = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);
      
      let edgeGroup = intermediateLayer.append('g')
        .attr('class', 'edge-group')
        .lower();
      
      let dashoffset = 0;

      edgeGroup.selectAll('path')
        .data(linkData)
        .enter()
        .append('path')
        .classed('flow-edge', d => d.name !== 'output-next')
        .attr('id', d => `edge-${d.name}`)
        .attr('d', d => linkGen({source: d.source, target: d.target}))
        .style('fill', 'none')
        .style('stroke-width', 1)
        .style('stroke', intermediateColor$1);

      edgeGroup.select('#edge-output-next')
        .style('opacity', 0.1);
      
      edgeGroup.selectAll('path.flow-edge')
        .attr('stroke-dasharray', '4 2')
        .attr('stroke-dashoffset', 0)
        .each((d, i, g) => animateEdge(d, i, g, dashoffset - 1000));
      
      return {intermediateLayer: intermediateLayer,
        intermediateMinMax: aggregatedMinMax,
        kernelRange: kernelRange,
        kernelMinMax: {min: kernelExtent[0], max: kernelExtent[1]}};
    };

    /**
     * Add an annotation for the kernel and the sliding
     * @param {object} arg 
     * {
     *  leftX: X value of the left border of intermedaite layer
     *  group: element group
     *  intermediateGap: the inner gap of intermediate layer
     *  isFirstConv: if this intermediate layer is after the first layer
     *  i: index of the selected node
     * }
     */
    const drawIntermediateLayerAnnotation = (arg) => {
      let leftX = arg.leftX,
        curLayerIndex = arg.curLayerIndex,
        group = arg.group,
        intermediateGap = arg.intermediateGap,
        isFirstConv = arg.isFirstConv,
        i = arg.i;

      let kernelAnnotation = group.append('g')
        .attr('class', 'kernel-annotation');
      
      kernelAnnotation.append('text')
        .text('Kernel')
        .attr('class', 'annotation-text')
        .attr('x', leftX - 5 * kernelRectLength * 3)
        .attr('y', nodeCoordinate$1[curLayerIndex - 1][0].y + kernelRectLength * 3)
        .style('dominant-baseline', 'baseline')
        .style('text-anchor', 'end');

      let sliderX, sliderY, arrowSX, arrowSY, dr;
      let sliderX2, sliderY2, arrowSX2, arrowSY2, dr2, arrowTX2, arrowTY2;
      
      if (isFirstConv) {
        sliderX = leftX;
        sliderY = nodeCoordinate$1[curLayerIndex - 1][0].y - nodeLength$4 -
          kernelRectLength * 3;
        arrowSX = leftX - 5;
        arrowSY = nodeCoordinate$1[curLayerIndex - 1][0].y - nodeLength$4 -
          kernelRectLength * 3 + 5;
        dr = 20;

        sliderX2 = leftX;
        sliderY2 = nodeCoordinate$1[curLayerIndex - 1][0].y + nodeLength$4 +
          kernelRectLength * 3;
        arrowSX2 = leftX - kernelRectLength * 3;
        arrowSY2 = nodeCoordinate$1[curLayerIndex - 1][0].y + nodeLength$4 + 15;
        arrowTX2 = leftX - 13;
        arrowTY2 =  nodeCoordinate$1[curLayerIndex - 1][0].y + 20;
        dr2 = 35;
      } else {
        sliderX = leftX - 3 * kernelRectLength * 3;
        sliderY = nodeCoordinate$1[curLayerIndex - 1][0].y + nodeLength$4 / 3;
        arrowSX = leftX - 2 * kernelRectLength * 3 - 5;
        arrowSY = nodeCoordinate$1[curLayerIndex - 1][0].y + nodeLength$4 - 10;
        dr = 50;

        sliderX2 = leftX - 3 * kernelRectLength * 3;
        sliderY2 = nodeCoordinate$1[curLayerIndex - 1][2].y - 3;
        arrowTX2 = leftX - kernelRectLength * 3 - 4;
        arrowTY2 = nodeCoordinate$1[curLayerIndex - 1][2].y + kernelRectLength * 3 + 6;
        arrowSX2 = leftX - kernelRectLength * 3 - 13;
        arrowSY2 = nodeCoordinate$1[curLayerIndex - 1][2].y + 26;
        dr2 = 20;
      }

      let slideText = kernelAnnotation.append('text')
        .attr('x', sliderX)
        .attr('y', sliderY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', isFirstConv ? 'start' : 'end');
      
      slideText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('Slide kernel over input channel');

      slideText.append('tspan')
        .attr('x', sliderX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('to get intermediate result');

      // slideText.append('tspan')
      //   .attr('x', sliderX)
      //   .attr('dy', '1em')
      //   .style('dominant-baseline', 'hanging')
      //   .text('');

      slideText.append('tspan')
        .attr('x', sliderX)
        .attr('dy', '1.2em')
        .style('dominant-baseline', 'hanging')
        .style('font-weight', 700)
        .text('Click ');
      
      slideText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('font-weight', 400)
        .text('to learn more');

      drawArrow({
        group: group,
        tx: leftX - 7,
        ty: nodeCoordinate$1[curLayerIndex - 1][0].y + nodeLength$4 / 2 - 5,
        sx: arrowSX,
        sy: arrowSY,
        hFlip: isFirstConv,
        dr: dr,
        marker: 'marker'
      });

      // Add kernel annotation
      let slideText2 = kernelAnnotation.append('text')
        .attr('x', sliderX2)
        .attr('y', sliderY2)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', isFirstConv ? 'start' : 'end');

      slideText2.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('Each input chanel');

      slideText2.append('tspan')
        .attr('x', sliderX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('gets a different kernel');

      slideText2.append('tspan')
        .attr('x', sliderX)
        .attr('dy', '1.3em')
        .style('font-weight', 700)
        .style('dominant-baseline', 'hanging')
        .text('Hover over ');

      slideText2.append('tspan')
        .style('font-weight', 400)
        .style('dominant-baseline', 'hanging')
        .text('to see value!');

      drawArrow({
        group: group,
        tx: arrowTX2,
        ty: arrowTY2,
        sx: arrowSX2,
        sy: arrowSY2,
        dr: dr2,
        hFlip: !isFirstConv,
        marker: 'marker'
      });


      // Add annotation for the sum operation
      let plusAnnotation = group.append('g')
        .attr('class', 'plus-annotation');
      
      let intermediateX2 = leftX + 2 * nodeLength$4 + 2.5 * intermediateGap;
      let textX = intermediateX2;
      let textY = nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 +
          kernelRectLength * 3;
      
      // Special case 1: first node
      if (i === 0) { textX += 30; }

      // Special case 2: last node 
      if (i === 9) {
        textX = intermediateX2 + plusSymbolRadius - 10;
        textY -= 2.5 * nodeLength$4;
      }

      let plusText = plusAnnotation.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'start');
      
      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('Add up all intermediate');
      
      plusText.append('tspan')
        .attr('x', textX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('results and then add bias');
      
      if (i === 9) {
        drawArrow({
          group: group,
          sx: intermediateX2 + 50,
          sy: nodeCoordinate$1[curLayerIndex][i].y - (nodeLength$4 / 2 + kernelRectLength * 2),
          tx: intermediateX2 + 2 * plusSymbolRadius + 5,
          ty: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 / 2 - plusSymbolRadius,
          dr: 50,
          hFlip: false,
          marker: 'marker-alt'
        });
      } else {
        drawArrow({
          group: group,
          sx: intermediateX2 + 35,
          sy: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 + kernelRectLength * 2,
          tx: intermediateX2 + 2 * plusSymbolRadius + 5,
          ty: nodeCoordinate$1[curLayerIndex][i].y + nodeLength$4 / 2 + plusSymbolRadius,
          dr: 30,
          hFlip: true,
          marker: 'marker-alt'
        });
      }

      // Add annotation for the bias
      let biasTextY = nodeCoordinate$1[curLayerIndex][i].y;
      if (i === 0) {
        biasTextY += nodeLength$4 + 3 * kernelRectLength;
      } else {
        biasTextY -= 2 * kernelRectLength + 5;
      }
      plusAnnotation.append('text')
        .attr('class', 'annotation-text')
        .attr('x', intermediateX2 + plusSymbolRadius)
        .attr('y', biasTextY)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', i === 0 ? 'hanging' : 'baseline')
        .text('Bias');
    };

    /**
     * Append a filled rectangle under a pair of nodes.
     * @param {number} curLayerIndex Index of the selected layer
     * @param {number} i Index of the selected node
     * @param {number} leftX X value of the left border of intermediate layer
     * @param {number} intermediateGap Inner gap of this intermediate layer
     * @param {number} padding Padding around the rect
     * @param {function} intermediateNodeMouseOverHandler Mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler Mouse leave handler
     * @param {function} intermediateNodeClicked Mouse click handler
     */
    const addUnderneathRect = (curLayerIndex, i, leftX,
      intermediateGap, padding, intermediateNodeMouseOverHandler,
      intermediateNodeMouseLeaveHandler, intermediateNodeClicked) => {
      // Add underneath rects
      let underGroup = svg$3.select('g.underneath');

      for (let n = 0; n < cnn$1[curLayerIndex - 1].length; n++) {
        underGroup.append('rect')
          .attr('class', 'underneath-gateway')
          .attr('id', `underneath-gateway-${n}`)
          .attr('x', leftX - padding)
          .attr('y', nodeCoordinate$1[curLayerIndex - 1][n].y - padding)
          .attr('width', (2 * nodeLength$4 + intermediateGap) + 2 * padding)
          .attr('height', nodeLength$4 + 2 * padding)
          .attr('rx', 10)
          .style('fill', 'rgba(160, 160, 160, 0.2)')
          .style('opacity', 0);
        
        // Register new events for input layer nodes
        svg$3.select(`g#layer-${curLayerIndex - 1}-node-${n}`)
          .style('pointer-events', 'all')
          .style('cursor', 'pointer')
          .on('mouseover', intermediateNodeMouseOverHandler)
          .on('mouseleave', intermediateNodeMouseLeaveHandler)
          .on('click', (d, ni, g) => intermediateNodeClicked(d, ni, g,
            i, curLayerIndex));
          // .on('click', (d, i) => {console.log(i)});
      }
      underGroup.lower();
    };

    /**
     * Add an overlaying rect
     * @param {string} gradientName Gradient name of overlay rect
     * @param {number} x X value of the overlaying rect
     * @param {number} y Y value of the overlaying rect
     * @param {number} width Rect width
     * @param {number} height Rect height
     */
    const addOverlayRect = (gradientName, x, y, width, height) => {
      if (svg$3.select('.intermediate-layer-overlay').empty()) {
        svg$3.append('g').attr('class', 'intermediate-layer-overlay');
      }

      let intermediateLayerOverlay = svg$3.select('.intermediate-layer-overlay');

      let overlayRect = intermediateLayerOverlay.append('rect')
        .attr('class', 'overlay')
        .style('fill', `url(#${gradientName})`)
        .style('stroke', 'none')
        .attr('width', width)
        .attr('height', height)
        .attr('x', x)
        .attr('y', y)
        .style('opacity', 0);
      
      overlayRect.transition('move')
        .duration(800)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /**
     * Redraw the layer if needed (entering the intermediate view to make sure
     * all layers have the same color scale)
     * @param {number} curLayerIndex Index of the selected layer
     * @param {number} i Index of the selected node
     */
    const redrawLayerIfNeeded = (curLayerIndex, i) => {
      // Determine the range for this layerview, and redraw the layer with
      // smaller range so all layers have the same range
      let rangePre = cnnLayerRanges$1[selectedScaleLevel$1][curLayerIndex - 1];
      let rangeCur = cnnLayerRanges$1[selectedScaleLevel$1][curLayerIndex];
      let range = Math.max(rangePre, rangeCur);

      if (rangePre > rangeCur) {
        // Redraw the current layer (selected node)
        svg$3.select(`g#layer-${curLayerIndex}-node-${i}`)
          .select('image.node-image')
          .each((d, g, i) => drawOutput(d, g, i, range));
        
        // Record the change so we will re-redraw the layer when user quits
        // the intermediate view
        needRedraw = [curLayerIndex, i];
        needRedrawStore.set(needRedraw);
        
      } else if (rangePre < rangeCur) {
        // Redraw the previous layer (whole layer)
        svg$3.select(`g#cnn-layer-group-${curLayerIndex - 1}`)
          .selectAll('image.node-image')
          .each((d, g, i) => drawOutput(d, g, i, range));

        // Record the change so we will re-redraw the layer when user quits
        // the intermediate view
        needRedraw = [curLayerIndex - 1, undefined];
        needRedrawStore.set(needRedraw);
      }

      // Compute the min, max value of all nodes in pre-layer and the selected
      // node of cur-layer
      let min = cnnLayerMinMax$1[curLayerIndex - 1].min,
        max = cnnLayerMinMax$1[curLayerIndex - 1].max;

      // Selected node
      let n = cnn$1[curLayerIndex][i];
      for (let r = 0; r < n.output.length; r++) {
        for (let c = 0; c < n.output[0].length; c++) {
          if (n.output[r][c] < min) { min = n.output[r][c]; }
          if (n.output[r][c] > max) { max = n.output[r][c]; }
        }
      }

      return {range: range, minMax: {min: min, max: max}};
    };

    /**
     * Draw the intermediate layer before conv_1_1
     * @param {number} curLayerIndex Index of the selected layer
     * @param {object} d Bounded d3 data
     * @param {number} i Index of the selected node
     * @param {number} width CNN group width
     * @param {number} height CNN group height
     * @param {function} intermediateNodeMouseOverHandler mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler mouse leave handler
     * @param {function} intermediateNodeClicked node clicking handler
     */
    const drawConv1 = (curLayerIndex, d, i, width, height,
      intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
      intermediateNodeClicked) => {
      // Compute the target location
      let targetX = nodeCoordinate$1[curLayerIndex - 1][0].x + 2 * nodeLength$4 +
        2 * hSpaceAroundGap$1 * gapRatio$1 + plusSymbolRadius * 2;
      let intermediateGap = (hSpaceAroundGap$1 * gapRatio$1 * 2) / 3;
      let leftX = nodeCoordinate$1[curLayerIndex - 1][0].x;

      // Record the left x position for dynamic detial view positioning
      intermediateLayerPosition['conv2d_8'] = targetX + nodeLength$4;
      intermediateLayerPositionStore.set(intermediateLayerPosition);

      // Hide the edges
      svg$3.select('g.edge-group')
        .style('visibility', 'hidden');

      // Move the selected layer
      moveLayerX({layerIndex: curLayerIndex, targetX: targetX, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});

      // Compute the gap in the right shrink region
      let rightStart = targetX + nodeLength$4 + hSpaceAroundGap$1 * gapRatio$1;
      let rightGap = (width - rightStart - 10 * nodeLength$4) / 10;

      // Move the right layers
      for (let i = curLayerIndex + 1; i < numLayers$1; i++) {
        let curX = rightStart + (i - (curLayerIndex + 1)) * (nodeLength$4 + rightGap);
        moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
      }

      // Add an overlay gradient and rect
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 0.85},
      {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
      {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 1}];
      addOverlayGradient('overlay-gradient', stops);

      addOverlayRect('overlay-gradient', rightStart - overlayRectOffset / 2,
      0, width - rightStart + overlayRectOffset,
      height + svgPaddings$2.top + svgPaddings$2.bottom);

      // Draw the intermediate layer
      let {intermediateLayer, intermediateMinMax, kernelRange, kernelMinMax} =
      drawIntermediateLayer(curLayerIndex, leftX, targetX, rightStart,
        intermediateGap, d, i, intermediateNodeMouseOverHandler,
        intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
      addUnderneathRect(curLayerIndex, i, leftX, intermediateGap, 8,
        intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
        intermediateNodeClicked);

      // Compute the selected node's min max
      // Selected node
      let min = Infinity, max = -Infinity;
      let n = cnn$1[curLayerIndex][i];
      for (let r = 0; r < n.output.length; r++) {
      for (let c = 0; c < n.output[0].length; c++) {
        if (n.output[r][c] < min) { min = n.output[r][c]; }
        if (n.output[r][c] > max) { max = n.output[r][c]; }
      }
      }

      let finalMinMax = {
      min: Math.min(min, intermediateMinMax.min),
      max: Math.max(max, intermediateMinMax.max)
      };

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$3.append('g')
      .attr('class', 'intermediate-layer-annotation')
      .style('opacity', 0);

      drawIntermediateLayerAnnotation({
        leftX: leftX,
        curLayerIndex: curLayerIndex,
        group: intermediateLayerAnnotation,
        intermediateGap: intermediateGap,
        isFirstConv: true,
        i: i
      });

      let range = cnnLayerRanges$1.local[curLayerIndex];

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: 1,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        isInput: true,
        x: leftX,
        y: svgPaddings$2.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$4 * 10 - 25
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        minMax: finalMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: nodeCoordinate$1[curLayerIndex - 1][0].x,
        y: svgPaddings$2.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$4 * 10
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: kernelRange,
        minMax: kernelMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: targetX + nodeLength$4 - (2 * nodeLength$4 + intermediateGap),
        y: svgPaddings$2.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$4 * 10,
        gradientAppendingName: 'kernelColorGradient',
        colorScale: layerColorScales$4.weight,
        gradientGap: 0.2
      });

      // Show everything
      svg$3.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /**
     * Draw the intermediate layer before conv_1_2
     * @param {number} curLayerIndex Index of the selected layer
     * @param {object} d Bounded d3 data
     * @param {number} i Index of the selected node
     * @param {number} width CNN group width
     * @param {number} height CNN group height
     * @param {function} intermediateNodeMouseOverHandler mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler mouse leave handler
     * @param {function} intermediateNodeClicked node clicking handler
     */
    const drawConv2 = (curLayerIndex, d, i, width, height,
      intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
      intermediateNodeClicked) => {
      let targetX = nodeCoordinate$1[curLayerIndex - 1][0].x + 2 * nodeLength$4 +
        2 * hSpaceAroundGap$1 * gapRatio$1 + plusSymbolRadius * 2;
      let intermediateGap = (hSpaceAroundGap$1 * gapRatio$1 * 2) / 3;

      // Record the left x position for dynamic detial view positioning
      intermediateLayerPosition['conv_1_2'] = targetX + nodeLength$4;
      intermediateLayerPositionStore.set(intermediateLayerPosition);

      // Make sure two layers have the same range
      let {range, minMax} = redrawLayerIfNeeded(curLayerIndex, i);

      // Hide the edges
      svg$3.select('g.edge-group')
        .style('visibility', 'hidden');

      // Move the selected layer
      moveLayerX({layerIndex: curLayerIndex, targetX: targetX, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});

      // Compute the gap in the right shrink region
      let rightStart = targetX + nodeLength$4 + hSpaceAroundGap$1 * gapRatio$1;
      let rightGap = (width - rightStart - 8 * nodeLength$4) / 8;

      // Move the right layers
      for (let i = curLayerIndex + 1; i < numLayers$1; i++) {
        let curX = rightStart + (i - (curLayerIndex + 1)) * (nodeLength$4 + rightGap);
        moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
      }

      // Add an overlay
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 0.85},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 1}];
      addOverlayGradient('overlay-gradient-right', stops);

      let leftRightRatio = (2 * nodeLength$4 + hSpaceAroundGap$1 * gapRatio$1) /
        (8 * nodeLength$4 + intermediateGap * 7);
      let endingGradient = 0.85 + (0.95 - 0.85) * leftRightRatio;
      stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: endingGradient},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 0.85}];
      addOverlayGradient('overlay-gradient-left', stops);

      addOverlayRect('overlay-gradient-right', rightStart - overlayRectOffset / 2,
        0, width - rightStart + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);

      addOverlayRect('overlay-gradient-left', nodeCoordinate$1[0][0].x - overlayRectOffset / 2,
        0, nodeLength$4 * 2 + hSpaceAroundGap$1 * gapRatio$1 + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);

      // Draw the intermediate layer
      let leftX = nodeCoordinate$1[curLayerIndex - 1][0].x;
      let {intermediateLayer, intermediateMinMax, kernelRange, kernelMinMax} =
        drawIntermediateLayer(curLayerIndex, leftX, targetX, rightStart,
          intermediateGap, d, i, intermediateNodeMouseOverHandler,
          intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
      addUnderneathRect(curLayerIndex, i, leftX, intermediateGap, 5,
        intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
        intermediateNodeClicked);

      // After getting the intermediateMinMax, we can finally aggregate it with
      // the preLayer minmax, curLayer minmax
      let finalMinMax = {
        min: Math.min(minMax.min, intermediateMinMax.min),
        max: Math.max(minMax.max, intermediateMinMax.max)
      };

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$3.append('g')
        .attr('class', 'intermediate-layer-annotation')
        .style('opacity', 0);

      drawIntermediateLayerAnnotation({
        leftX: leftX,
        curLayerIndex: curLayerIndex,
        group: intermediateLayerAnnotation,
        intermediateGap: intermediateGap,
        i: i
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        minMax: finalMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: leftX,
        y: svgPaddings$2.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$4 * 10
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: kernelRange,
        minMax: kernelMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: targetX + nodeLength$4 - (2 * nodeLength$4 + intermediateGap),
        y: svgPaddings$2.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$4 * 10,
        gradientAppendingName: 'kernelColorGradient',
        colorScale: layerColorScales$4.weight,
        gradientGap: 0.2
      });

      // Show everything
      svg$3.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /**
     * Draw the intermediate layer before conv_2_1
     * @param {number} curLayerIndex Index of the selected layer
     * @param {object} d Bounded d3 data
     * @param {number} i Index of the selected node
     * @param {number} width CNN group width
     * @param {number} height CNN group height
     * @param {function} intermediateNodeMouseOverHandler mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler mouse leave handler
     * @param {function} intermediateNodeClicked node clicking handler
     */
    const drawConv3 = (curLayerIndex, d, i, width, height,
      intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
      intermediateNodeClicked) => {

      let targetX = nodeCoordinate$1[curLayerIndex][0].x;
      let leftX = targetX - (1 * nodeLength$4 +
        2 * hSpaceAroundGap$1 * gapRatio$1 + plusSymbolRadius * 1);
      let intermediateGap = (hSpaceAroundGap$1 * gapRatio$1 * 2) / 3;

      // Record the left x position for dynamic detial view positioning
      intermediateLayerPosition['conv2d_9'] = targetX + nodeLength$4;
      intermediateLayerPositionStore.set(intermediateLayerPosition);

      // Hide the edges
      svg$3.select('g.edge-group')
        .style('visibility', 'hidden');

      // Make sure two layers have the same range
      let {range, minMax} = redrawLayerIfNeeded(curLayerIndex, i);

      // Move the previous layer
      moveLayerX({layerIndex: curLayerIndex - 1, targetX: leftX,
        disable: true, delay: 0});

      moveLayerX({layerIndex: curLayerIndex,
        targetX: targetX, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});

      // Compute the gap in the left shrink region
      let leftEnd = leftX - hSpaceAroundGap$1;
      let leftGap = (leftEnd - nodeCoordinate$1[0][0].x - 2 * nodeLength$4) / 5;
      let rightStart = nodeCoordinate$1[curLayerIndex][0].x +
        nodeLength$4 + hSpaceAroundGap$1;

      // Move the left layers
      for (let i = 0; i < curLayerIndex - 1; i++) {
        let curX = nodeCoordinate$1[0][0].x + i * (nodeLength$4 + leftGap);
        moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
      }

      // Add an overlay
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 1},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.9},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 0.85}];
      addOverlayGradient('overlay-gradient-left', stops);

      stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 0.85},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 1}];
      addOverlayGradient('overlay-gradient-right', stops);

      addOverlayRect('overlay-gradient-left', nodeCoordinate$1[0][0].x - overlayRectOffset / 2,
        0, leftEnd - nodeCoordinate$1[0][0].x + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);
      
      addOverlayRect('overlay-gradient-right', rightStart - overlayRectOffset / 2,
        0, width - rightStart + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);
      
      // Draw the intermediate layer
      let {intermediateLayer, intermediateMinMax, kernelRange, kernelMinMax} =
        drawIntermediateLayer(curLayerIndex, leftX,
          nodeCoordinate$1[curLayerIndex][0].x, rightStart, intermediateGap,
          d, i, intermediateNodeMouseOverHandler,
          intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
      addUnderneathRect(curLayerIndex, i, leftX, intermediateGap, 5,
        intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
        intermediateNodeClicked);
              
      // After getting the intermediateMinMax, we can finally aggregate it with
      // the preLayer minmax, curLayer minmax
      let finalMinMax = {
        min: Math.min(minMax.min, intermediateMinMax.min),
        max: Math.max(minMax.max, intermediateMinMax.max)
      };

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$3.append('g')
        .attr('class', 'intermediate-layer-annotation')
        .style('opacity', 0);

      drawIntermediateLayerAnnotation({
        leftX: leftX,
        curLayerIndex: curLayerIndex,
        group: intermediateLayerAnnotation,
        intermediateGap: intermediateGap,
        i: i
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        minMax: finalMinMax,
        x: leftX,
        y: svgPaddings$2.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$4 * 15
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: kernelRange,
        minMax: kernelMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: targetX + nodeLength$4 - (2 * nodeLength$4 + intermediateGap),
        y: svgPaddings$2.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$4 * 15,
        gradientAppendingName: 'kernelColorGradient',
        colorScale: layerColorScales$4.weight,
        gradientGap: 0.2
      });

      // Show everything
      svg$3.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /**
     * Draw the intermediate layer before conv_2_2
     * @param {number} curLayerIndex Index of the selected layer
     * @param {object} d Bounded d3 data
     * @param {number} i Index of the selected node
     * @param {number} width CNN group width
     * @param {number} height CNN group height
     * @param {function} intermediateNodeMouseOverHandler mouse over handler
     * @param {function} intermediateNodeMouseLeaveHandler mouse leave handler
     * @param {function} intermediateNodeClicked node clicking handler
     */
    const drawConv4 = (curLayerIndex, d, i, width, height,
      intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
      intermediateNodeClicked) => {
      let targetX = nodeCoordinate$1[curLayerIndex][0].x;
      let leftX = targetX - (2 * nodeLength$4 +
        2 * hSpaceAroundGap$1 * gapRatio$1 + plusSymbolRadius * 2);
      let intermediateGap = (hSpaceAroundGap$1 * gapRatio$1 * 2) / 3;

      // Record the left x position for dynamic detial view positioning
      intermediateLayerPosition['conv_2_2'] = leftX;
      intermediateLayerPositionStore.set(intermediateLayerPosition);

      // Hide the edges
      svg$3.select('g.edge-group')
        .style('visibility', 'hidden');

      // Make sure two layers have the same range
      let {range, minMax} = redrawLayerIfNeeded(curLayerIndex, i);

      // Move the previous layer
      moveLayerX({layerIndex: curLayerIndex - 1, targetX: leftX,
        disable: true, delay: 0});

      moveLayerX({layerIndex: curLayerIndex,
        targetX: targetX, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});

      // Compute the gap in the left shrink region
      let leftEnd = leftX - hSpaceAroundGap$1;
      let leftGap = (leftEnd - nodeCoordinate$1[0][0].x - 7 * nodeLength$4) / 7;
      let rightStart = targetX + nodeLength$4 + hSpaceAroundGap$1;

      // Move the left layers
      for (let i = 0; i < curLayerIndex - 1; i++) {
        let curX = nodeCoordinate$1[0][0].x + i * (nodeLength$4 + leftGap);
        moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
      }

      // Add an overlay
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 1},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 0.85}];
      addOverlayGradient('overlay-gradient-left', stops);

      stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 0.85},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 1}];
      addOverlayGradient('overlay-gradient-right', stops);

      addOverlayRect('overlay-gradient-left', nodeCoordinate$1[0][0].x - overlayRectOffset / 2,
        0, leftEnd - nodeCoordinate$1[0][0].x + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);
      
      addOverlayRect('overlay-gradient-right', rightStart - overlayRectOffset / 2,
        0, width - rightStart + overlayRectOffset,
        height + svgPaddings$2.top + svgPaddings$2.bottom);
      
      // Draw the intermediate layer
      let {intermediateLayer, intermediateMinMax, kernelRange, kernelMinMax} =
        drawIntermediateLayer(curLayerIndex, leftX,
          nodeCoordinate$1[curLayerIndex][0].x, rightStart, intermediateGap,
          d, i, intermediateNodeMouseOverHandler,
          intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
      addUnderneathRect(curLayerIndex, i, leftX, intermediateGap, 5,
        intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler,
        intermediateNodeClicked);
              
      // After getting the intermediateMinMax, we can finally aggregate it with
      // the preLayer minmax, curLayer minmax
      let finalMinMax = {
        min: Math.min(minMax.min, intermediateMinMax.min),
        max: Math.max(minMax.max, intermediateMinMax.max)
      };

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$3.append('g')
        .attr('class', 'intermediate-layer-annotation')
        .style('opacity', 0);

      drawIntermediateLayerAnnotation({
        leftX: leftX,
        curLayerIndex: curLayerIndex,
        group: intermediateLayerAnnotation,
        intermediateGap: intermediateGap,
        i: i
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        group: intermediateLayer,
        minMax: finalMinMax,
        width: 2 * nodeLength$4 + intermediateGap,
        x: leftX,
        y: svgPaddings$2.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$4 * 10
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: kernelRange,
        minMax: kernelMinMax,
        group: intermediateLayer,
        width: 2 * nodeLength$4 + intermediateGap,
        x: targetX + nodeLength$4 - (2 * nodeLength$4 + intermediateGap),
        y: svgPaddings$2.top + vSpaceAroundGap$2 * (10) + vSpaceAroundGap$2 + 
          nodeLength$4 * 10,
        gradientAppendingName: 'kernelColorGradient',
        colorScale: layerColorScales$4.weight,
        gradientGap: 0.2
      });

      // Show everything
      svg$3.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /* global d3, SmoothScroll */

    // Configs
    const layerColorScales$5 = overviewConfig.layerColorScales;
    const nodeLength$5 = overviewConfig.nodeLength;
    const plusSymbolRadius$1 = overviewConfig.plusSymbolRadius;
    const intermediateColor$2 = overviewConfig.intermediateColor;
    const kernelRectLength$1 = overviewConfig.kernelRectLength;
    const svgPaddings$3 = overviewConfig.svgPaddings;
    const gapRatio$2 = overviewConfig.gapRatio;
    const classList = overviewConfig.classLists;
    const formater$2 = d3.format('.4f');

    // Shared variables
    let svg$4 = undefined;
    svgStore.subscribe( value => {svg$4 = value;} );

    let vSpaceAroundGap$3 = undefined;
    vSpaceAroundGapStore.subscribe( value => {vSpaceAroundGap$3 = value;} );

    let hSpaceAroundGap$2 = undefined;
    hSpaceAroundGapStore.subscribe( value => {hSpaceAroundGap$2 = value;} );

    let cnn$2 = undefined;
    cnnStore.subscribe( value => {cnn$2 = value;} );

    let nodeCoordinate$2 = undefined;
    nodeCoordinateStore.subscribe( value => {nodeCoordinate$2 = value;} );

    let selectedScaleLevel$2 = undefined;
    selectedScaleLevelStore.subscribe( value => {selectedScaleLevel$2 = value;} );

    let cnnLayerRanges$2 = undefined;
    cnnLayerRangesStore.subscribe( value => {cnnLayerRanges$2 = value;} );

    let cnnLayerMinMax$2 = undefined;
    cnnLayerMinMaxStore.subscribe( value => {cnnLayerMinMax$2 = value;} );

    let isInSoftmax = undefined;
    isInSoftmaxStore.subscribe( value => {isInSoftmax = value;} );

    let allowsSoftmaxAnimation = undefined;
    allowsSoftmaxAnimationStore.subscribe( value => {allowsSoftmaxAnimation = value;} );

    let softmaxDetailViewInfo = undefined;
    softmaxDetailViewStore.subscribe( value => {softmaxDetailViewInfo = value;} );

    let hoverInfo = undefined;
    hoverInfoStore.subscribe( value => {hoverInfo = value;} );

    let detailedMode$2 = undefined;
    detailedModeStore.subscribe( value => {detailedMode$2 = value;} );
      const layerIndexDict = {
        'input': 0,
        'conv2d_8': 1,
        'max_pooling2d_8': 2,
        'conv2d_9': 3,
        'max_pooling2d_9': 4,
        'dense_8': 5,
        'output': 6,
      };
    let hasInitialized = false;
    let logits = [];
    let flattenFactoredFDict = {};

    const moveLegend = (d, i, g, moveX, duration, restore) => {
      let legend = d3.select(g[i]);

      if (!restore) {
        let previousTransform = legend.attr('transform');
        let previousLegendX = +previousTransform.replace(/.*\(([\d\.]+),.*/, '$1');
        let previousLegendY = +previousTransform.replace(/.*,\s([\d\.]+)\)/, '$1');
      
        legend.transition('softmax')
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .attr('transform', `translate(${previousLegendX - moveX}, ${previousLegendY})`);
        
        // If not in restore mode, we register the previous location to the DOM element
        legend.attr('data-preX', previousLegendX);
        legend.attr('data-preY', previousLegendY);
      } else {
        // Restore the recorded location
        let previousLegendX = +legend.attr('data-preX');
        let previousLegendY = +legend.attr('data-preY');

        legend.transition('softmax')
          .duration(duration)
          .ease(d3.easeCubicInOut)
          .attr('transform', `translate(${previousLegendX}, ${previousLegendY})`);
      }
    };

    const logitCircleMouseOverHandler = (i) => {
      // Update the hover info UI
      hoverInfoStore.set({
        show: true,
        text: `Logit: ${formater$2(logits[i])}`
      });

      // Highlight the text in the detail view
      softmaxDetailViewInfo.highlightI = i;
      softmaxDetailViewStore.set(softmaxDetailViewInfo);

      let logitLayer = svg$4.select('.logit-layer');
      let logitLayerLower = svg$4.select('.underneath');
      let intermediateLayer = svg$4.select('.intermediate-layer');

      // Highlight the circle
      logitLayer.select(`#logit-circle-${i}`)
        .style('stroke-width', 2);

      // Highlight the associated plus symbol
      intermediateLayer.select(`#plus-symbol-clone-${i}`)
        .style('opacity', 1)
        .select('circle')
        .style('fill', d => d.fill);
      
      // Raise the associated edge group
      logitLayerLower.select(`#logit-lower-${i}`).raise();

      // Highlight the associated edges
      logitLayerLower.selectAll(`.softmax-abstract-edge-${i}`)
        .style('stroke-width', 0.8)
        .style('stroke', '#E0E0E0');

      logitLayerLower.selectAll(`.softmax-edge-${i}`)
        .style('stroke-width', 1)
        .style('stroke', '#E0E0E0');
      
      logitLayerLower.selectAll(`.logit-output-edge-${i}`)
        .style('stroke-width', 3)
        .style('stroke', '#E0E0E0');

      logitLayer.selectAll(`.logit-output-edge-${i}`)
        .style('stroke-width', 3)
        .style('stroke', '#E0E0E0');
    };

    const logitCircleMouseLeaveHandler = (i) => {
      // screenshot
      // return;

      // Update the hover info UI
      hoverInfoStore.set({
        show: false,
        text: `Logit: ${formater$2(logits[i])}`
      });

      // Dehighlight the text in the detail view
      softmaxDetailViewInfo.highlightI = -1;
      softmaxDetailViewStore.set(softmaxDetailViewInfo);

      let logitLayer = svg$4.select('.logit-layer');
      let logitLayerLower = svg$4.select('.underneath');
      let intermediateLayer = svg$4.select('.intermediate-layer');

      // Restore the circle
      logitLayer.select(`#logit-circle-${i}`)
        .style('stroke-width', 1);

      // Restore the associated plus symbol
      intermediateLayer.select(`#plus-symbol-clone-${i}`)
        .style('opacity', 0.2);

      // Restore the associated edges
      logitLayerLower.selectAll(`.softmax-abstract-edge-${i}`)
        .style('stroke-width', 0.2)
        .style('stroke', '#EDEDED');

      logitLayerLower.selectAll(`.softmax-edge-${i}`)
        .style('stroke-width', 0.2)
        .style('stroke', '#F1F1F1');

      logitLayerLower.selectAll(`.logit-output-edge-${i}`)
        .style('stroke-width', 1.2)
        .style('stroke', '#E5E5E5');
      
      logitLayer.selectAll(`.logit-output-edge-${i}`)
        .style('stroke-width', 1.2)
        .style('stroke', '#E5E5E5');
    };

    // This function is binded to the detail view in Overview.svelte
    const softmaxDetailViewMouseOverHandler = (event) => {
      logitCircleMouseOverHandler(event.detail.curI);
    };

    // This function is binded to the detail view in Overview.svelte
    const softmaxDetailViewMouseLeaveHandler = (event) => {
      logitCircleMouseLeaveHandler(event.detail.curI);
    };

    const drawLogitLayer = (arg) => {
      let curLayerIndex = arg.curLayerIndex,
        moveX = arg.moveX,
        softmaxLeftMid = arg.softmaxLeftMid,
        selectedI = arg.selectedI,
        intermediateX1 = arg.intermediateX1,
        intermediateX2 = arg.intermediateX2,
        pixelWidth = arg.pixelWidth,
        pixelHeight = arg.pixelHeight,
        topY = arg.topY,
        bottomY = arg.bottomY,
        softmaxX = arg.softmaxX,
        middleGap = arg.middleGap,
        middleRectHeight = arg.middleRectHeight,
        symbolGroup = arg.symbolGroup,
        symbolX = arg.symbolX,
        flattenRange = arg.flattenRange;

      let logitLayer = svg$4.select('.intermediate-layer')
        .append('g')
        .attr('class', 'logit-layer')
        .raise();
      
      // Minotr layer ordering change
      let tempClone = svg$4.select('.intermediate-layer')
        .select('.flatten-layer')
        .select('.plus-symbol')
        .clone(true)
        .attr('class', 'temp-clone-plus-symbol')
        .attr('transform', `translate(${symbolX - moveX},
      ${nodeCoordinate$2[curLayerIndex][selectedI].y + nodeLength$5 / 2})`)
        // Cool hack -> d3 clone doesnt clone events, make the front object pointer
        // event transparent so users can trigger the underlying object's event!
        .style('pointer-events', 'none')
        .remove();

      let tempPlusSymbol = logitLayer.append(() => tempClone.node());
      
      svg$4.select('.softmax-symbol').raise();

      let logitLayerLower = svg$4.select('.underneath')
        .append('g')
        .attr('class', 'logit-layer-lower')
        .lower();
      
      // Use circles to encode logit values
      let centerX = softmaxLeftMid - moveX * 4 / 5;

      // Get all logits
      logits = [];
      for (let i = 0; i < cnn$2[layerIndexDict['output']].length; i++) {
        logits.push(cnn$2[layerIndexDict['output']][i].logit);
      }

      // Construct a color scale for the logit values
      let logitColorScale = d3.scaleLinear()
        .domain(d3.extent(logits))
        .range([0.2, 1]);
      
      // Draw the current logit circle before animation
      let logitRadius = 8;
      logitLayer.append('circle')
        .attr('class', 'logit-circle')
        .attr('id', `logit-circle-${selectedI}`)
        .attr('cx', centerX)
        .attr('cy', nodeCoordinate$2[curLayerIndex][selectedI].y + nodeLength$5 / 2)
        .attr('r', logitRadius)
        .style('fill', layerColorScales$5.logit(logitColorScale(logits[selectedI])))
        .style('cursor', 'crosshair')
        .style('pointer-events', 'all')
        .style('stroke', intermediateColor$2)
        .on('mouseover', () => logitCircleMouseOverHandler(selectedI))
        .on('mouseleave', () => logitCircleMouseLeaveHandler(selectedI))
        .on('click', () => { d3.event.stopPropagation(); });
      
      // Show the logit circle corresponding label
      let softmaxDetailAnnotation = svg$4.select('.intermediate-layer-annotation')
        .select('.softmax-detail-annoataion');

      softmaxDetailAnnotation.select(`#logit-text-${selectedI}`)
        .style('opacity', 1);

      tempPlusSymbol.raise();

      // Draw another line from plus symbol to softmax symbol
      logitLayer.append('line')
        .attr('class', `logit-output-edge-${selectedI}`)
        .attr('x1', intermediateX2 - moveX + plusSymbolRadius$1 * 2)
        .attr('x2', softmaxX)
        .attr('y1', nodeCoordinate$2[curLayerIndex][selectedI].y + nodeLength$5 / 2)
        .attr('y2', nodeCoordinate$2[curLayerIndex][selectedI].y + nodeLength$5 / 2)
        .style('fill', 'none')
        .style('stroke', '#EAEAEA')
        .style('stroke-width', '1.2')
        .lower();

      // Add the flatten to logit links
      let linkData = [];
      let flattenLength = cnn$2.flatten.length / cnn$2[1].length;
      let underneathIs = [...Array(cnn$2[layerIndexDict['output']].length).keys()]
        .filter(d => d != selectedI);
      let curIIndex = 0;
      let linkGen = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);

      const drawOneEdgeGroup = () => {
        // Only draw the new group if it is in the softmax mode
        if (!allowsSoftmaxAnimation) {
          svg$4.select('.underneath')
            .selectAll(`.logit-lower`)
            .remove();
          return;
        }

        let curI = underneathIs[curIIndex];

        let curEdgeGroup = svg$4.select('.underneath')
          .select(`#logit-lower-${curI}`);
        
        if (curEdgeGroup.empty()) {
          curEdgeGroup = svg$4.select('.underneath')
            .append('g')
            .attr('class', 'logit-lower')
            .attr('id', `logit-lower-${curI}`)
            .style('opacity', 0);

          // Hack: now show all edges, only draw 1/3 of the actual edges
          // for (let f = 0; f < flattenLength; f += 3) {
          //   let loopFactors = [0, 9];
          //   loopFactors.forEach(l => {
          //     let factoredF = f + l * flattenLength;
        
          //     // Flatten -> output
          //     linkData.push({
          //       source: {x: intermediateX1 + pixelWidth + 3 - moveX,
          //         y:  l === 0 ? topY + f * pixelHeight : bottomY + f * pixelHeight},
          //       target: {x: intermediateX2 - moveX,
          //         y: nodeCoordinate[curLayerIndex][curI].y + nodeLength / 2},
          //       index: factoredF,
          //       weight: cnn.flatten[factoredF].outputLinks[curI].weight,
          //       color: '#F1F1F1',
          //       width: 0.5,
          //       opacity: 1,
          //       class: `softmax-edge-${curI}`
          //     });
          //   });
          // }

          // Draw middle rect to logits
          for (let vi = 0; vi < cnn$2[curLayerIndex-1].length; vi++) {
            linkData.push({
              source: {x: intermediateX1 + 1.5 * nodeLength$5 - moveX,
                y: nodeCoordinate$2[curLayerIndex-1][vi].y + nodeLength$5 / 2},
              target: {x: intermediateX2 - moveX,
                y: nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2},
              index: -1,
              color: '#EDEDED',
              width: 0.5,
              opacity: 1,
              class: `softmax-abstract-edge-${curI}`
            });
          }

          // Render the edges on the underneath layer
          curEdgeGroup.selectAll(`path.softmax-edge-${curI}`)
            .data(linkData)
            .enter()
            .append('path')
            .attr('class', d => d.class)
            .attr('id', d => `edge-${d.name}`)
            .attr('d', d => linkGen({source: d.source, target: d.target}))
            .style('fill', 'none')
            .style('stroke-width', d => d.width)
            .style('stroke', d => d.color === undefined ? intermediateColor$2 : d.color)
            .style('opacity', d => d.opacity)
            .style('pointer-events', 'none');
        }
        
        let curNodeGroup = logitLayer.append('g')
          .attr('class', `logit-layer-${curI}`)
          .style('opacity', 0);
        
        // Draw the plus symbol
        let symbolClone = symbolGroup.clone(true)
          .style('opacity', 0);

        // Change the style of the clone
        symbolClone.attr('class', 'plus-symbol-clone')
          .attr('id', `plus-symbol-clone-${curI}`)
          .select('circle')
          .datum({fill: gappedColorScale(layerColorScales$5.weight,
            flattenRange, cnn$2[layerIndexDict['output']][curI].bias, 0.35)})
          .style('pointer-events', 'none')
          .style('fill', '#E5E5E5');

        symbolClone.attr('transform', `translate(${symbolX},
      ${nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2})`);
        
        // Draw the outter link using only merged path
        let outputEdgeD1 = linkGen({
          source: {
            x: intermediateX2 - moveX + plusSymbolRadius$1 * 2,
            y: nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2
          },
          target: {
            x: centerX + logitRadius,
            y: nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2
          }
        });

        let outputEdgeD2 = linkGen({
          source: {
            x: centerX + logitRadius,
            y: nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2
          },
          target: {
            x: softmaxX,
            y: nodeCoordinate$2[curLayerIndex][selectedI].y + nodeLength$5 / 2
          }
        });

        // There are ways to combine these two paths into one. However, the animation
        // for merged path is not continuous, so we use two saperate paths here.

        let outputEdge1 = logitLayerLower.append('path')
          .attr('class', `logit-output-edge-${curI}`)
          .attr('d', outputEdgeD1)
          .style('fill', 'none')
          .style('stroke', '#EAEAEA')
          .style('stroke-width', '1.2');

        let outputEdge2 = logitLayerLower.append('path')
          .attr('class', `logit-output-edge-${curI}`)
          .attr('d', outputEdgeD2)
          .style('fill', 'none')
          .style('stroke', '#EAEAEA')
          .style('stroke-width', '1.2');
        
        let outputEdgeLength1 = outputEdge1.node().getTotalLength();
        let outputEdgeLength2 = outputEdge2.node().getTotalLength();
        let totalLength = outputEdgeLength1 + outputEdgeLength2;
        let totalDuration = hasInitialized ? 500 : 800;
        let opacityDuration = hasInitialized ? 400 : 600;

        outputEdge1.attr('stroke-dasharray', outputEdgeLength1 + ' ' + outputEdgeLength1)
          .attr('stroke-dashoffset', outputEdgeLength1);
        
        outputEdge2.attr('stroke-dasharray', outputEdgeLength2 + ' ' + outputEdgeLength2)
          .attr('stroke-dashoffset', outputEdgeLength2);

        outputEdge1.transition('softmax-output-edge')
          .duration(outputEdgeLength1 / totalLength * totalDuration)
          .attr('stroke-dashoffset', 0);

        outputEdge2.transition('softmax-output-edge')
          .delay(outputEdgeLength1 / totalLength * totalDuration)
          .duration(outputEdgeLength2 / totalLength * totalDuration)
          .attr('stroke-dashoffset', 0);
        
        // Draw the logit circle
        curNodeGroup.append('circle')
          .attr('class', 'logit-circle')
          .attr('id', `logit-circle-${curI}`)
          .attr('cx', centerX)
          .attr('cy', nodeCoordinate$2[curLayerIndex][curI].y + nodeLength$5 / 2)
          .attr('r', 7)
          .style('fill', layerColorScales$5.logit(logitColorScale(logits[curI])))
          .style('stroke', intermediateColor$2)
          .style('cursor', 'crosshair')
          .on('mouseover', () => logitCircleMouseOverHandler(curI))
          .on('mouseleave', () => logitCircleMouseLeaveHandler(curI))
          .on('click', () => { d3.event.stopPropagation(); });
        
        // Show the element in the detailed view
        softmaxDetailViewInfo.startAnimation = {
          i: curI,
          duration: opacityDuration,
          // Always show the animation
          hasInitialized: false
        };
        softmaxDetailViewStore.set(softmaxDetailViewInfo);

        // Show the elements with animation    
        curNodeGroup.transition('softmax-edge')
          .duration(opacityDuration)
          .style('opacity', 1);

        if ((selectedI < 3 && curI == 14) || (selectedI >= 3 && curI == 0)) {
          // Show the hover text
          softmaxDetailAnnotation.select('.softmax-detail-hover-annotation')
            .transition('softmax-edge')
            .duration(opacityDuration)
            .style('opacity', 1);
        }

        softmaxDetailAnnotation.select(`#logit-text-${curI}`)
          .transition('softmax-edge')
          .duration(opacityDuration)
          .style('opacity', 1);
        
        curEdgeGroup.transition('softmax-edge')
          .duration(opacityDuration)
          .style('opacity', 1)
          .on('end', () => {
            // Recursive animaiton
            curIIndex ++;
            if (curIIndex < underneathIs.length) {
              linkData = [];
              drawOneEdgeGroup();
            } else {
              hasInitialized = true;
              softmaxDetailViewInfo.hasInitialized = true;
              softmaxDetailViewStore.set(softmaxDetailViewInfo);
            }
          });
        
        symbolClone.transition('softmax-edge')
          .duration(opacityDuration)
          .style('opacity', 0.2);
      };

      // Show the softmax detail view
      let anchorElement = svg$4.select('.intermediate-layer')
        .select('.layer-label').node();
      let pos = getMidCoords(svg$4, anchorElement);
      let wholeSvg = d3.select('#cnn-svg');
      let svgYMid = +wholeSvg.style('height').replace('px', '') / 2;
      let detailViewTop = 100 + svgYMid - 192 / 2;

      const detailview = document.getElementById('detailview');
      detailview.style.top = `${detailViewTop}px`;
      detailview.style.left = `${pos.left - 490 - 50}px`;
      detailview.style.position = 'absolute';

      softmaxDetailViewStore.set({
        show: true,
        logits: logits,
        logitColors: logits.map(d => layerColorScales$5.logit(logitColorScale(d))),
        selectedI: selectedI,
        highlightI: -1,
        outputName: classList[selectedI],
        outputValue: cnn$2[layerIndexDict['output']][selectedI].output,
        startAnimation: {i: -1, duration: 0, hasInitialized: hasInitialized}
      });

      drawOneEdgeGroup();

      // Draw logit circle color scale
      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: d3.extent(logits)[1] - d3.extent(logits)[0],
        minMax: {min: d3.extent(logits)[0], max: d3.extent(logits)[1]},
        group: logitLayer,
        width: softmaxX - (intermediateX2 + plusSymbolRadius$1 * 2 - moveX + 5),
        gradientAppendingName: 'flatten-logit-gradient',
        gradientGap: 0.1,
        colorScale: layerColorScales$5.logit,
        x: intermediateX2 + plusSymbolRadius$1 * 2 - moveX + 5,
        y: svgPaddings$3.top + vSpaceAroundGap$3 * (10) + vSpaceAroundGap$3 + 
          nodeLength$5 * 15
      });

      // Draw logit layer label
      let logitLabel = logitLayer.append('g')
        .attr('class', 'layer-label')
        .classed('hidden', detailedMode$2)
        .attr('transform', () => {
          let x = centerX;
          let y = (svgPaddings$3.top + vSpaceAroundGap$3) / 2 + 5;
          return `translate(${x}, ${y})`;
        });

      logitLabel.append('text')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .style('opacity', 0.8)
        .style('font-weight', 800)
        .text('logit');
    };

    const removeLogitLayer = () => {
      svg$4.select('.logit-layer').remove();
      svg$4.select('.logit-layer-lower').remove();
      svg$4.selectAll('.plus-symbol-clone').remove();

      // Instead of removing the paths, we hide them, so it is faster to load in
      // the future
      svg$4.select('.underneath')
        .selectAll('.logit-lower')
        .style('opacity', 0);

      softmaxDetailViewStore.set({
          show: false,
          logits: []
      });
    };

    const softmaxClicked = (arg) => {
      let curLayerIndex = arg.curLayerIndex,
        moveX = arg.moveX,
        symbolX = arg.symbolX,
        symbolY = arg.symbolY,
        outputX = arg.outputX,
        outputY = arg.outputY,
        softmaxLeftMid = arg.softmaxLeftMid,
        selectedI = arg.selectedI,
        intermediateX1 = arg.intermediateX1,
        intermediateX2 = arg.intermediateX2,
        pixelWidth = arg.pixelWidth,
        pixelHeight = arg.pixelHeight,
        topY = arg.topY,
        bottomY = arg.bottomY,
        middleGap = arg.middleGap,
        middleRectHeight = arg.middleRectHeight,
        softmaxX = arg.softmaxX,
        softmaxTextY = arg.softmaxTextY,
        softmaxWidth = arg.softmaxWidth,
        symbolGroup = arg.symbolGroup,
        flattenRange = arg.flattenRange;

      let duration = 600;
      let centerX = softmaxLeftMid - moveX * 4 / 5;
      d3.event.stopPropagation();

      // Clean up the logit elemends before moving anything
      if (isInSoftmax) {
        allowsSoftmaxAnimationStore.set(false);
        removeLogitLayer();
      } else {
        allowsSoftmaxAnimationStore.set(true);
      }

      // Move the overlay gradient
      svg$4.select('.intermediate-layer-overlay')
        .select('rect.overlay')
        .transition('softmax')
        .ease(d3.easeCubicInOut)
        .duration(duration)
        .attr('transform', `translate(${isInSoftmax ? 0 : -moveX}, ${0})`);

      // Move the legends
      svg$4.selectAll(`.intermediate-legend-${curLayerIndex - 1}`)
        .each((d, i, g) => moveLegend(d, i, g, moveX, duration, isInSoftmax));

      svg$4.select('.intermediate-layer')
        .select(`.layer-label`)
        .each((d, i, g) => moveLegend(d, i, g, moveX, duration, isInSoftmax));

      svg$4.select('.intermediate-layer')
        .select(`.layer-detailed-label`)
        .each((d, i, g) => moveLegend(d, i, g, moveX, duration, isInSoftmax));

      // Also move all layers on the left
      for (let i = curLayerIndex - 1; i >= 0; i--) {
        let curLayer = svg$4.select(`g#cnn-layer-group-${i}`);
        let previousX;
        if(i === 5){
          previousX = +curLayer.select('circle.dense-circle').attr('cx') - nodeLength$5 / 2;
        }else {
          previousX = +curLayer.select('image').attr('x');
        }
        let newX = isInSoftmax ? previousX + moveX : previousX - moveX;
        moveLayerX({
          layerIndex: i,
          targetX: newX,
          disable: true,
          delay: 0,
          transitionName: 'softmax',
          duration: duration
        });
      }

      // Hide the sum up annotation
      svg$4.select('.plus-annotation')
        .transition('softmax')
        .duration(duration)
        .style('opacity', isInSoftmax ? 1 : 0)
        .style('pointer-events', isInSoftmax ? 'all' : 'none');

      // Hide the softmax annotation
      let softmaxAnnotation = svg$4.select('.softmax-annotation')
        .style('pointer-events', isInSoftmax ? 'all' : 'none');
      
      let softmaxDetailAnnotation = softmaxAnnotation.selectAll('.softmax-detail-annoataion')
        .data([0])
        .enter()
        .append('g')
        .attr('class', 'softmax-detail-annoataion');

      // Remove the detailed annoatioan when quitting the detail view
      if (isInSoftmax) {
        softmaxAnnotation.selectAll('.softmax-detail-annoataion').remove();
      }

      softmaxAnnotation.select('.arrow-group')
        .transition('softmax')
        .duration(duration)
        .style('opacity', isInSoftmax ? 1 : 0);

      softmaxAnnotation.select('.annotation-text')
        .style('cursor', 'help')
        .style('pointer-events', 'all')
        .on('click', () => {
          d3.event.stopPropagation();
          // Scroll to the article element
          document.querySelector(`#article-softmax`).scrollIntoView({ 
            behavior: 'smooth' 
          });
        })
        .transition('softmax')
        .duration(duration)
        .style('opacity', isInSoftmax ? 1 : 0)
        .on('end', () => {
          if (!isInSoftmax) {
            // Add new annotation for the softmax button
            let textX = softmaxX + softmaxWidth / 2;
            let textY = softmaxTextY - 10;

            if (selectedI === 0) {
              textY = softmaxTextY + 70;
            }

            let text = softmaxDetailAnnotation.append('text')
              .attr('x', textX)
              .attr('y', textY)
              .attr('class', 'annotation-text softmax-detail-text')
              .style('dominant-baseline', 'baseline')
              .style('text-anchor', 'middle')
              .text('Normalize ');
            
            text.append('tspan') 
              .attr('dx', 1)
              .style('fill', '#E56014')
              .text('logits');
            
            text.append('tspan')
              .attr('dx', 1)
              .text(' into');

            text.append('tspan')
              .attr('x', textX)
              .attr('dy', '1.1em')
              .text('class probabilities');

            if (selectedI === 0) {
              drawArrow({
                group: softmaxDetailAnnotation,
                sx: softmaxX + softmaxWidth / 2 - 5,
                sy: softmaxTextY + 44,
                tx: softmaxX + softmaxWidth / 2,
                ty: textY - 12,
                dr: 50,
                hFlip: true,
                marker: 'marker-alt'
              });
            } else {
              drawArrow({
                group: softmaxDetailAnnotation,
                sx: softmaxX + softmaxWidth / 2 - 5,
                sy: softmaxTextY + 4,
                tx: softmaxX + softmaxWidth / 2,
                ty: symbolY - plusSymbolRadius$1 - 4,
                dr: 50,
                hFlip: true,
                marker: 'marker-alt'
              });
            }

            // Add annotation for the logit layer label
            textX = centerX + 45;
            textY = (svgPaddings$3.top + vSpaceAroundGap$3) / 2 + 5;
            let arrowTX = centerX + 20;
            let arrowTY = (svgPaddings$3.top + vSpaceAroundGap$3) / 2 + 5;

            softmaxDetailAnnotation.append('g')
              .attr('class', 'layer-detailed-label')
              .attr('transform', () => {
                let x = centerX;
                let y = (svgPaddings$3.top + vSpaceAroundGap$3) / 2 - 5;
                return `translate(${x}, ${y})`;
              })
              .classed('hidden', !detailedMode$2)
              .append('text')
              // .attr('x', centerX)
              // .attr('y',  (svgPaddings.top + vSpaceAroundGap) / 2 - 6)
              .style('opacity', 0.7)
              .style('dominant-baseline', 'middle')
              .style('font-size', '12px')
              .style('font-weight', '800')
              .append('tspan')
              .attr('x', 0)
              .text('logit')
              .append('tspan')
              .attr('x', 0)
              .style('font-size', '8px')
              .style('font-weight', 'normal')
              .attr('dy', '1.5em')
              .text('(10)');

            softmaxDetailAnnotation.append('text')
              .attr('class', 'annotation-text')
              .attr('x', textX)
              .attr('y', (svgPaddings$3.top + vSpaceAroundGap$3) / 2 + 3)
              .style('text-anchor', 'start')
              .text('Before')
              .append('tspan')
              .attr('x', textX)
              .attr('dy', '1em')
              .text('normalization');


            drawArrow({
              group: softmaxDetailAnnotation,
              tx: arrowTX,
              ty: arrowTY,
              sx: textX - 6,
              sy: textY + 2,
              dr: 60,
              hFlip: false,
              marker: 'marker-alt'
            });

            softmaxDetailAnnotation.append('text')
              .attr('class', 'annotation-text')
              .attr('x', nodeCoordinate$2[layerIndexDict['output']][0].x - 35)
              .attr('y', (svgPaddings$3.top + vSpaceAroundGap$3) / 2 + 3)
              .style('text-anchor', 'end')
              .text('After')
              .append('tspan')
              .attr('x', nodeCoordinate$2[layerIndexDict['output']][0].x - 35)
              .attr('dy', '1em')
              .text('normalization');

            drawArrow({
              group: softmaxDetailAnnotation,
              tx: nodeCoordinate$2[layerIndexDict['output']][0].x - 8,
              ty: arrowTY,
              sx: nodeCoordinate$2[layerIndexDict['output']][0].x - 27,
              sy: textY + 2,
              dr: 60,
              hFlip: true,
              marker: 'marker-alt'
            });

            // Add annotation for the logit circle
            for (let i = 0; i < 15; i++) {
              softmaxDetailAnnotation.append('text')
                .attr('x', centerX)
                .attr('y', nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2 + 8)
                .attr('class', 'annotation-text softmax-detail-text')
                .attr('id', `logit-text-${i}`)
                .style('text-anchor', 'middle')
                .style('dominant-baseline', 'hanging')
                .style('opacity', 0)
                .text(`${classList[i]}`);
            }

            let hoverTextGroup = softmaxDetailAnnotation.append('g')
              .attr('class', 'softmax-detail-hover-annotation')
              .style('opacity', 0);

            textX = centerX + 50;
            textY = nodeCoordinate$2[curLayerIndex][0].y + nodeLength$5 / 2;

            if (selectedI < 3) {
              textY = nodeCoordinate$2[curLayerIndex][14].y + nodeLength$5 / 2;
            }

            // Add annotation to prompt user to check the logit value
            let hoverText = hoverTextGroup.append('text')
              .attr('x', textX)
              .attr('y', textY)
              .attr('class', 'annotation-text softmax-detail-text softmax-hover-text')
              .style('text-anchor', 'start')
              .style('dominant-baseline', 'baseline')
              .append('tspan')
              .style('font-weight', 700)
              .style('dominant-baseline', 'baseline')
              .text(`Hover over `)
              .append('tspan')
              .style('font-weight', 400)
              .style('dominant-baseline', 'baseline')
              .text('to see');
            
            hoverText.append('tspan')
              .style('dominant-baseline', 'baseline')
              .attr('x', textX)
              .attr('dy', '1em')
              .text('its ');

            hoverText.append('tspan')
              .style('dominant-baseline', 'baseline')
              .attr('dx', 1)
              .style('fill', '#E56014')
              .text('logit');
            
            hoverText.append('tspan')
              .style('dominant-baseline', 'baseline')
              .attr('dx', 1)
              .text(' value');
            
            drawArrow({
              group: hoverTextGroup,
              tx: centerX + 15,
              ty: textY,
              sx: textX - 8,
              sy: textY + 2,
              dr: 60,
              hFlip: false
            });
          }
        });

      // Hide the annotation
      svg$4.select('.flatten-annotation')
        .transition('softmax')
        .duration(duration)
        .style('opacity', isInSoftmax ? 1 : 0)
        .style('pointer-events', isInSoftmax ? 'all' : 'none');

      // Move the left part of faltten layer elements
      let flattenLeftPart = svg$4.select('.flatten-layer-left');
      flattenLeftPart.transition('softmax')
        .duration(duration)
        .ease(d3.easeCubicInOut)
        .attr('transform', `translate(${isInSoftmax ? 0 : -moveX}, ${0})`)
        .on('end', () => {
          // Add the logit layer
          if (!isInSoftmax) {
            let logitArg = {
              curLayerIndex: curLayerIndex,
              moveX: moveX,
              softmaxLeftMid: softmaxLeftMid,
              selectedI: selectedI,
              intermediateX1: intermediateX1,
              intermediateX2: intermediateX2,
              pixelWidth: pixelWidth,
              pixelHeight: pixelHeight,
              topY: topY,
              bottomY: bottomY,
              middleGap: middleGap,
              middleRectHeight: middleRectHeight,
              softmaxX: softmaxX,
              symbolGroup: symbolGroup,
              symbolX: symbolX,
              flattenRange: flattenRange
            };
            drawLogitLayer(logitArg);
          }

          // Redraw the line from the plus symbol to the output node
          if (!isInSoftmax) {
            let newLine = flattenLeftPart.select('.edge-group')
              .append('line')
              .attr('class', 'symbol-output-line')
              .attr('x1', symbolX)
              .attr('y1', symbolY)
              .attr('x2', outputX + moveX)
              .attr('y2', outputY)
              .style('stroke-width', 1.2)
              .style('stroke', '#E5E5E5')
              .style('opacity', 0);
            
            newLine.transition('softmax')
              .delay(duration / 3)
              .duration(duration * 2 / 3)
              .style('opacity', 1);
          } else {
            flattenLeftPart.select('.symbol-output-line').remove();
          }
          
          isInSoftmax = !isInSoftmax;
          isInSoftmaxStore.set(isInSoftmax);
        });
    };

    /**
     * Draw the flatten layer before output layer
     * @param {number} curLayerIndex Index of the selected layer
     * @param {object} d Bounded d3 data
     * @param {number} i Index of the selected node
     * @param {number} width CNN group width
     * @param {number} height CNN group height
     */
    const drawOutFlatten = (curLayerIndex, d, i, width, height) => {
      // Show the output legend
      svg$4.selectAll('.output-legend')
        .classed('hidden', false);

      let pixelWidth = nodeLength$5 / 2;
      let pixelHeight = 1.1;
      let totalLength = (2 * nodeLength$5 +
        2 * hSpaceAroundGap$2 * gapRatio$2 + pixelWidth);
      let leftX = nodeCoordinate$2[curLayerIndex][0].x - totalLength;
      // let intermediateGap = (hSpaceAroundGap * gapRatio * 4) / 2;
      let intermediateGap = totalLength / 2 - 3 * nodeLength$5;
      const minimumGap = 20;
      let linkGen = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);

      // Hide the edges
      svg$4.select('g.edge-group')
        .style('visibility', 'hidden');

      // Move the previous layer
      moveLayerX({layerIndex: curLayerIndex - 1, targetX: leftX,
        disable: true, delay: 0});

      // Disable the current layer (output layer)
      moveLayerX({layerIndex: curLayerIndex,
        targetX: nodeCoordinate$2[curLayerIndex][0].x, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});
      
      // Compute the gap in the left shrink region
      let leftEnd = leftX - hSpaceAroundGap$2;
      let leftGap = (leftEnd - nodeCoordinate$2[0][0].x - 10 * nodeLength$5) / 10;

      // Different from other intermediate view, we push the left part dynamically
      // 1. If there is enough space, we fix the first layer position and move all
      // other layers;
      // 2. If there is not enough space, we maintain the minimum gap and push all
      // left layers to the left (could be out-of-screen)
      if (leftGap > minimumGap) {
        // Move the left layers
        for (let i = 0; i < curLayerIndex - 1; i++) {
          let curX = nodeCoordinate$2[0][0].x + i * (nodeLength$5 + leftGap);
          moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
        }
      } else {
        leftGap = minimumGap;
        let curLeftBound = leftX - leftGap * 2 - nodeLength$5;
        // Move the left layers
        for (let i = curLayerIndex - 2; i >= 0; i--) {
          moveLayerX({layerIndex: i, targetX: curLeftBound, disable: true, delay: 0});
          curLeftBound = curLeftBound - leftGap - nodeLength$5;
        }
      }

      // Add an overlay
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 1},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 0.85}];
      addOverlayGradient('overlay-gradient-left', stops);

      let intermediateLayerOverlay = svg$4.append('g')
        .attr('class', 'intermediate-layer-overlay');

      intermediateLayerOverlay.append('rect')
        .attr('class', 'overlay')
        .style('fill', 'url(#overlay-gradient-left)')
        .style('stroke', 'none')
        .attr('width', leftX + svgPaddings$3.left - (leftGap * 2) + 3)
        .attr('height', height + svgPaddings$3.top + svgPaddings$3.bottom)
        .attr('x', -svgPaddings$3.left)
        .attr('y', 0)
        .style('opacity', 0);
      
      intermediateLayerOverlay.selectAll('rect.overlay')
        .transition('move')
        .duration(800)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);

      // Add the intermediate layer
      let intermediateLayer = svg$4.append('g')
        .attr('class', 'intermediate-layer')
        .style('opacity', 0);
      
      let intermediateX1 = leftX;
      let intermediateX2 = intermediateX1 + 2 * intermediateGap + pixelWidth;
      let range = cnnLayerRanges$2[selectedScaleLevel$2][curLayerIndex - 1];
      let colorScale = layerColorScales$5.conv;
      let linkData = [];

      let flattenLayer = intermediateLayer.append('g')
        .attr('class', 'flatten-layer');
      
      let flattenLayerLeftPart = flattenLayer.append('g')
        .attr('class', 'flatten-layer-left');
      
      let topY = nodeCoordinate$2[curLayerIndex - 1][0].y;
      let bottomY = nodeCoordinate$2[curLayerIndex - 1][9].y + nodeLength$5;
      
      let Ys = [];
      for (let n = 0; n < cnn$2[curLayerIndex - 1].length; n++) {
          Ys.push(nodeCoordinate$2[curLayerIndex - 1][n].y + nodeLength$5 / 2);
      }

      // Compute the pre-layer gap
      let preLayerDimension = cnn$2[curLayerIndex - 1][0].output.length;

      // Compute the weight color scale
      let flattenExtent = d3.extent(cnn$2[curLayerIndex-1].slice(0)
        .map(d => d.outputLinks[i].weight)
        .concat(cnn$2[curLayerIndex-1].slice(9)
          .map(d => d.outputLinks[i].weight)));

      let flattenRange = 2 * (Math.round(
        Math.max(...flattenExtent.map(Math.abs)) * 1000) / 1000);

      let flattenMouseOverHandler = (d) => {
        let index = d.index;
        // Screenshot
        // console.log(index);

        // Update the hover info UI
        if (d.weight === undefined) {
          hoverInfo = {
            show: true,
            text: `Pixel value: ${formater$2(flattenFactoredFDict[index])}`
          };
        } else {
          hoverInfo = {
            show: true,
            text: `Weight: ${formater$2(d.weight)}`
          };
        }
        hoverInfoStore.set(hoverInfo);

        flattenLayerLeftPart.select(`#edge-flatten-${index}`)
          .raise()
          .style('stroke', intermediateColor$2)
          .style('stroke-width', 1);

        flattenLayerLeftPart.select(`#edge-flatten-${index}-output`)
          .raise()
          .style('stroke-width', 1)
          .style('stroke', da => gappedColorScale(layerColorScales$5.weight,
            flattenRange, da.weight, 0.1));

        flattenLayerLeftPart.select(`#bounding-${index}`)
          .raise()
          .style('opacity', 1);
      };

      let flattenMouseLeaveHandler = (d) => {
        let index = d.index;

        // screenshot
        // if (index === 70) {return;}

        // Update the hover info UI
        if (d.weight === undefined) {
          hoverInfo = {
            show: false,
            text: `Pixel value: ${formater$2(flattenFactoredFDict[index])}`
          };
        } else {
          hoverInfo = {
            show: false,
            text: `Weight: ${formater$2(d.weight)}`
          };
        }
        hoverInfoStore.set(hoverInfo);

        flattenLayerLeftPart.select(`#edge-flatten-${index}`)
          .style('stroke-width', 0.6)
          .style('stroke', '#E5E5E5');

        flattenLayerLeftPart.select(`#edge-flatten-${index}-output`)
          .style('stroke-width', 0.6)
          .style('stroke', da => gappedColorScale(layerColorScales$5.weight,
            flattenRange, da.weight, 0.35));

        flattenLayerLeftPart.select(`#bounding-${index}`)
          .raise()
          .style('opacity', 0);
      };

      flattenFactoredFDict = {};
      for (let f = 0; f < 10; f++) {
          let factoredF = f;
          flattenFactoredFDict[factoredF] = cnn$2[curLayerIndex-1][factoredF].output;
          linkData.push({
            target: {x: intermediateX2,
              //nodeCoordinate[curLayerIndex][i].x - nodeLength,
              y: nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2},
            source: {x: leftX + nodeLength$5 + 3,
              y: nodeCoordinate$2[curLayerIndex - 1][f].y + nodeLength$5 / 2},
            index: factoredF,
            weight: cnn$2[curLayerIndex-1][factoredF].outputLinks[i].weight,
            name: `flatten-${factoredF}-output`,
            color: gappedColorScale(layerColorScales$5.weight,
              flattenRange, cnn$2[curLayerIndex-1][factoredF].outputLinks[i].weight, 0.35),
            width: 1,
            opacity: 1,
            class: `flatten-output`
          });

          // Add original pixel bounding box
          // let loc = cnn.flatten[factoredF].inputLinks[0].weight;
          // flattenLayerLeftPart.append('rect')
          //   .attr('id', `bounding-${factoredF}`)
          //   .attr('class', 'flatten-bounding')
          //   .attr('x', leftX + loc[1] * boundingBoxLength)
          //   .attr('y', nodeCoordinate[curLayerIndex - 1][l].y + loc[0] * boundingBoxLength)
          //   .attr('width', boundingBoxLength)
          //   .attr('height', boundingBoxLength)
          //   .style('fill', 'none')
          //   .style('stroke', intermediateColor)
          //   .style('stroke-length', '0.5')
          //   .style('pointer-events', 'all')
          //   .style('cursor', 'crosshair')
          //   .style('opacity', 0)
          //   .on('mouseover', () => flattenMouseOverHandler({index: factoredF}))
          //   .on('mouseleave', () => flattenMouseLeaveHandler({index: factoredF}))
          //   .on('click', () => {d3.event.stopPropagation()});
      }
      

      // Compute the middle gap
      let middleGap = 5;
      let middleRectHeight = (10 * nodeLength$5 + (10 - 1) * vSpaceAroundGap$3 - 5 * (8 + 1)) / 8;


      // Draw the plus operation symbol
      let symbolX = intermediateX2 + plusSymbolRadius$1;
      let symbolY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2;
      let symbolRectHeight = 1;
      let symbolGroup = flattenLayerLeftPart.append('g')
        .attr('class', 'plus-symbol')
        .attr('transform', `translate(${symbolX}, ${symbolY})`);
      
      symbolGroup.append('rect')
        .attr('x', -plusSymbolRadius$1)
        .attr('y', -plusSymbolRadius$1)
        .attr('width', plusSymbolRadius$1 * 2)
        .attr('height', plusSymbolRadius$1 * 2)
        .attr('rx', 3)
        .attr('ry', 3)
        .style('fill', 'none')
        .style('stroke', intermediateColor$2);
      
      symbolGroup.append('rect')
        .attr('x', -(plusSymbolRadius$1 - 3))
        .attr('y', -symbolRectHeight / 2)
        .attr('width', 2 * (plusSymbolRadius$1 - 3))
        .attr('height', symbolRectHeight)
        .style('fill', intermediateColor$2);

      symbolGroup.append('rect')
        .attr('x', -symbolRectHeight / 2)
        .attr('y', -(plusSymbolRadius$1 - 3))
        .attr('width', symbolRectHeight)
        .attr('height', 2 * (plusSymbolRadius$1 - 3))
        .style('fill', intermediateColor$2);

      // Place the bias rectangle below the plus sign if user clicks the first
      // conv node (no need now, since we added annotaiton for softmax to make it
      // look better aligned)
      // Add bias symbol to the plus symbol
      symbolGroup.append('circle')
        .attr('cx', 0)
        .attr('cy', -nodeLength$5 / 2 - 0.5 * kernelRectLength$1)
        .attr('r', kernelRectLength$1 * 1.5)
        .style('stroke', intermediateColor$2)
        .style('cursor', 'crosshair')
        .style('fill', gappedColorScale(layerColorScales$5.weight,
            flattenRange, d.bias, 0.35))
        .on('mouseover', () => {
          hoverInfoStore.set( {show: true, text: `Bias: ${formater$2(d.bias)}`} );
        })
        .on('mouseleave', () => {
          hoverInfoStore.set( {show: false, text: `Bias: ${formater$2(d.bias)}`} );
        })
        .on('click', () => { d3.event.stopPropagation(); });
      
      // Link from bias to the plus symbol
      symbolGroup.append('path')
        .attr('d', linkGen({
          source: { x: 0, y: 0 },
          target: { x: 0, y: -nodeLength$5 / 2 - 0.5 * kernelRectLength$1 }
        }))
        .attr('id', 'bias-plus')
        .attr('stroke-width', 1.2)
        .attr('stroke', '#E5E5E5')
        .lower();

      // Link from the plus symbol to the output
      linkData.push({
        source: getOutputKnot({x: intermediateX2 + 2 * plusSymbolRadius$1 - nodeLength$5,
          y: nodeCoordinate$2[curLayerIndex][i].y}),
        target: getInputKnot({x: nodeCoordinate$2[curLayerIndex][i].x - 3,
          y: nodeCoordinate$2[curLayerIndex][i].y}),
        name: `symbol-output`,
        width: 1.2,
        color: '#E5E5E5'
      });

      // Draw softmax operation symbol
      let softmaxWidth = 55;
      let emptySpace = ((totalLength - 2 * nodeLength$5 - 2 * intermediateGap)
        - softmaxWidth) / 2;
      let symbolEndX = intermediateX2 + plusSymbolRadius$1 * 2;
      let softmaxX = emptySpace + symbolEndX;
      let softmaxLeftMid = emptySpace / 2 + symbolEndX;
      let softmaxTextY = nodeCoordinate$2[curLayerIndex][i].y - 2 * kernelRectLength$1 - 6;
      let moveX = (intermediateX2 - (intermediateX1 + pixelWidth + 3)) * 2 / 3;

      let softmaxArg = {
        curLayerIndex: curLayerIndex,
        moveX: moveX,
        symbolX: symbolX,
        symbolY: symbolY,
        outputX: nodeCoordinate$2[curLayerIndex][i].x,
        outputY: symbolY,
        softmaxLeftMid: softmaxLeftMid,
        selectedI: i,
        intermediateX1: intermediateX1,
        intermediateX2: intermediateX2,
        pixelWidth: pixelWidth,
        pixelHeight: pixelHeight,
        topY: topY,
        bottomY: bottomY,
        middleGap: middleGap,
        middleRectHeight: middleRectHeight,
        softmaxX: softmaxX,
        softmaxWidth: softmaxWidth,
        softmaxTextY: softmaxTextY,
        symbolGroup: symbolGroup,
        flattenRange: flattenRange
      };

      let softmaxSymbol = intermediateLayer.append('g')
        .attr('class', 'softmax-symbol')
        .attr('transform', `translate(${softmaxX}, ${symbolY})`)
        .style('pointer-event', 'all')
        .style('cursor', 'pointer')
        .on('click', () => softmaxClicked(softmaxArg));
      
      softmaxSymbol.append('rect')
        .attr('x', 0)
        .attr('y', -plusSymbolRadius$1)
        .attr('width', softmaxWidth)
        .attr('height', plusSymbolRadius$1 * 2)
        .attr('stroke', intermediateColor$2)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('fill', '#FAFAFA');
      
      softmaxSymbol.append('text')
        .attr('x', 5)
        .attr('y', 1)
        .style('dominant-baseline', 'middle')
        .style('font-size', '12px')
        .style('opacity', 0.5)
        .text('softmax');

      // Draw the layer label
      let layerLabel = intermediateLayer.append('g')
        .attr('class', 'layer-label')
        .classed('hidden', detailedMode$2)
        .attr('transform', () => {
          let x = leftX + nodeLength$5 + (4 * hSpaceAroundGap$2 * gapRatio$2 +
            pixelWidth) / 2;
          let y = (svgPaddings$3.top + vSpaceAroundGap$3) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .style('cursor', 'help')
        .on('click', () => {
          d3.event.stopPropagation();
          // Scroll to the article element
          document.querySelector(`#article-flatten`).scrollIntoView({ 
            behavior: 'smooth' 
          });
        });
      
      layerLabel.append('text')
        .style('dominant-baseline', 'middle')
        .style('opacity', 0.8)
        .style('font-weight', 800)
        .text('flatten');

      let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
      let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
        
      // let detailedLabelGroup = intermediateLayer.append('g')
      //   .attr('transform', () => {
      //     let x = intermediateX1 + pixelWidth / 2;
      //     let y = (svgPaddings.top + vSpaceAroundGap) / 2 - 5;
      //     return `translate(${x}, ${y})`;
      //   })
      //   .attr('class', 'layer-detailed-label')
      //   .classed('hidden', !detailedMode)
      //   .style('cursor', 'help')
      //   .on('click', () => {
      //     d3.event.stopPropagation();
      //     // Scroll to the article element
      //     let anchor = document.querySelector(`#article-flatten`);
      //     scroll.animateScroll(anchor);
      //   });
      
      // detailedLabelGroup.append('title')
      //   .text('Move to article section');

      // let detailedLabelText = detailedLabelGroup.append('text')
      //   .style('text-anchor', 'middle')
      //   .style('dominant-baseline', 'middle')
      //   .style('opacity', '0.7')
      //   .style('font-weight', 800)
      //   .append('tspan')
      //   .text('flatten');
      
      // let dimension = cnn[layerIndexDict['max_pooling2d_9']].length * 
      //   cnn[layerIndexDict['max_pooling2d_9']][0].output.length *
      //   cnn[layerIndexDict['max_pooling2d_9']][0].output[0].length;
      

      // detailedLabelText.append('tspan')
      //   .attr('x', 0)
      //   .attr('dy', '1.5em')
      //   .style('font-size', '8px')
      //   .style('font-weight', 'normal')
      //   .text(`(${dimension})`);

      // Add edges between nodes
      let edgeGroup = flattenLayerLeftPart.append('g')
        .attr('class', 'edge-group')
        .lower();
      
      edgeGroup.selectAll('path')
        .data(linkData)
        .enter()
        .append('path')
        .attr('class', d => d.class)
        .attr('id', d => `edge-${d.name}`)
        .attr('d', d => linkGen({source: d.source, target: d.target}))
        .style('fill', 'none')
        .style('stroke-width', d => d.width)
        .style('stroke', d => d.color === undefined ? intermediateColor$2 : d.color)
        .style('opacity', d => d.opacity);
      
      edgeGroup.selectAll('path.flatten-abstract-output')
        .lower();

      edgeGroup.selectAll('path.flatten,path.flatten-output')
        .style('cursor', 'crosshair')
        .style('pointer-events', 'all')
        .on('mouseover', flattenMouseOverHandler)
        .on('mouseleave', flattenMouseLeaveHandler)
        .on('click', () => { d3.event.stopPropagation(); });
      
      // Add legend
      let min_layer_index = curLayerIndex - 1;
      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        minMax: cnnLayerMinMax$2[min_layer_index],
        group: intermediateLayer,
        width: intermediateGap + nodeLength$5 - 3,
        x: leftX,
        y: svgPaddings$3.top + vSpaceAroundGap$3 * (10) + vSpaceAroundGap$3 + 
          nodeLength$5 * 15
      });

      // drawIntermediateLayerLegend({
      //   legendHeight: 5,
      //   curLayerIndex: curLayerIndex,
      //   range: flattenRange,
      //   minMax: {min: flattenExtent[0], max: flattenExtent[1]},
      //   group: intermediateLayer,
      //   width: intermediateGap - 3 - 5,
      //   gradientAppendingName: 'flatten-weight-gradient',
      //   gradientGap: 0.1,
      //   colorScale: layerColorScales.weight,
      //   x: leftX + intermediateGap + nodeLength + pixelWidth + 3,
      //   y: svgPaddings.top + vSpaceAroundGap * (10) + vSpaceAroundGap + 
      //     nodeLength * 15
      // });

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$4.append('g')
        .attr('class', 'intermediate-layer-annotation')
        .style('opacity', 0);

      // Add annotation for the sum operation
      let plusAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'plus-annotation');
      
      // let textX = nodeCoordinate[curLayerIndex][i].x - 50;
      let textX = intermediateX2;
      let textY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 +
        kernelRectLength$1 * 3;
      let arrowSY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 +
        kernelRectLength$1 * 2;
      let arrowTY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2 +
        plusSymbolRadius$1;

      if (i == 9) {
        textY -= 110;
        arrowSY -= 70;
        arrowTY -= 18;
      }

      let plusText = plusAnnotation.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle');
      
      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('Add up all products');
      
      plusText.append('tspan')
        .attr('x', textX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('(');

      plusText.append('tspan')
        .style('fill', '#66a3c8')
        .style('dominant-baseline', 'hanging')
        .text('element');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text(' × ');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('fill', '#b58946')
        .text('weight');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text(')');

      plusText.append('tspan')
        .attr('x', textX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('and then ');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('fill', '#479d94')
        .text('bias');
      
      drawArrow({
        group: plusAnnotation,
        sx: intermediateX2 - 2 * plusSymbolRadius$1 - 3,
        sy: arrowSY,
        tx: intermediateX2 - 5,
        ty: arrowTY,
        dr: 30,
        hFlip: i === 9,
        marker: 'marker-alt'
      });

      // Add annotation for the bias
      let biasTextY = nodeCoordinate$2[curLayerIndex][i].y;
      biasTextY -= 2 * kernelRectLength$1 + 4;
      
      flattenLayerLeftPart.append('text')
        .attr('class', 'annotation-text')
        .attr('x', intermediateX2 + plusSymbolRadius$1)
        .attr('y', biasTextY)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'baseline')
        .text('Bias');
      
      // Add annotation for the softmax symbol
      let softmaxAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'softmax-annotation');
      
      softmaxAnnotation.append('text')
        .attr('x', softmaxX + softmaxWidth / 2)
        .attr('y', softmaxTextY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'baseline')
        .style('text-anchor', 'middle')
        .style('font-weight', 700)
        .text('Click ')
        .append('tspan')
        .attr('dx', 1)
        .style('font-weight', 400)
        .text('to learn more');

      drawArrow({
        group: softmaxAnnotation,
        sx: softmaxX + softmaxWidth / 2 - 5,
        sy: softmaxTextY + 4,
        tx: softmaxX + softmaxWidth / 2,
        ty: symbolY - plusSymbolRadius$1 - 4,
        dr: 50,
        hFlip: true
      });


      // Add annotation for the output neuron
      let outputAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'output-annotation');
      
      outputAnnotation.append('text')
        .attr('x', nodeCoordinate$2[curLayerIndex][i].x)
        .attr('y', nodeCoordinate$2[curLayerIndex][i].y + 10)
        .attr('class', 'annotation-text')
        .text(`(${d3.format('.4f')(cnn$2[curLayerIndex][i].output)})`);


      // Show everything
      svg$4.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    const drawFlatten = (curLayerIndex, d, i, width, height) => {
      // Show the output legend
      svg$4.selectAll('.output-legend')
        .classed('hidden', false);

      let pixelWidth = nodeLength$5 / 2;
      let pixelHeight = 1.1;
      let totalLength = (2 * nodeLength$5 +
        2.5 * hSpaceAroundGap$2 * gapRatio$2 + pixelWidth);
      let leftX = nodeCoordinate$2[curLayerIndex][0].x - totalLength;
      // let intermediateGap = (hSpaceAroundGap * gapRatio * 4) / 2;
      let intermediateGap = totalLength / 2 - 3 * nodeLength$5;
      const minimumGap = 20;
      let linkGen = d3.linkHorizontal()
        .x(d => d.x)
        .y(d => d.y);

      // Hide the edges
      svg$4.select('g.edge-group')
        .style('visibility', 'hidden');

      // Move the previous layer
      moveLayerX({layerIndex: curLayerIndex - 1, targetX: leftX,
        disable: true, delay: 0});

      // Disable the current layer (output layer)
      moveLayerX({layerIndex: curLayerIndex,
        targetX: nodeCoordinate$2[curLayerIndex][0].x, disable: true,
        delay: 0, opacity: 0.15, specialIndex: i});
      
      // Compute the gap in the left shrink region
      let leftEnd = leftX - hSpaceAroundGap$2;
      let leftGap = (leftEnd - nodeCoordinate$2[0][0].x - 10 * nodeLength$5) / 10;

      // Different from other intermediate view, we push the left part dynamically
      // 1. If there is enough space, we fix the first layer position and move all
      // other layers;
      // 2. If there is not enough space, we maintain the minimum gap and push all
      // left layers to the left (could be out-of-screen)
      if (leftGap > minimumGap) {
        // Move the left layers
        for (let i = 0; i < curLayerIndex - 1; i++) {
          let curX = nodeCoordinate$2[0][0].x + i * (nodeLength$5 + leftGap);
          moveLayerX({layerIndex: i, targetX: curX, disable: true, delay: 0});
        }
      } else {
        leftGap = minimumGap;
        let curLeftBound = leftX - leftGap * 2 - nodeLength$5;
        // Move the left layers
        for (let i = curLayerIndex - 2; i >= 0; i--) {
          moveLayerX({layerIndex: i, targetX: curLeftBound, disable: true, delay: 0});
          curLeftBound = curLeftBound - leftGap - nodeLength$5;
        }
      }

      // Add an overlay
      let stops = [{offset: '0%', color: 'rgb(250, 250, 250)', opacity: 1},
        {offset: '50%', color: 'rgb(250, 250, 250)', opacity: 0.95},
        {offset: '100%', color: 'rgb(250, 250, 250)', opacity: 0.85}];
      addOverlayGradient('overlay-gradient-left', stops);

      let intermediateLayerOverlay = svg$4.append('g')
        .attr('class', 'intermediate-layer-overlay');

      intermediateLayerOverlay.append('rect')
        .attr('class', 'overlay')
        .style('fill', 'url(#overlay-gradient-left)')
        .style('stroke', 'none')
        .attr('width', leftX + svgPaddings$3.left - (leftGap * 2) + 5)
        .attr('height', height + svgPaddings$3.top + svgPaddings$3.bottom)
        .attr('x', -svgPaddings$3.left)
        .attr('y', 0)
        .style('opacity', 0);
      
      intermediateLayerOverlay.append('rect')
        .attr('class', 'overlay')
        .style('fill', 'url(#overlay-gradient-left)')
        .style('stroke', 'none')
        .attr('width', totalLength)
        .attr('height', height + svgPaddings$3.top + svgPaddings$3.bottom)
        .attr('x', nodeCoordinate$2[curLayerIndex][0].x + nodeLength$5 + 5)
        .attr('y', 0)
        .style('opacity', 0);
      
      intermediateLayerOverlay.selectAll('rect.overlay')
        .transition('move')
        .duration(800)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);

      // Add the intermediate layer
      let intermediateLayer = svg$4.append('g')
        .attr('class', 'intermediate-layer')
        .style('opacity', 0);
      
      let intermediateX1 = leftX + nodeLength$5 + intermediateGap;
      let intermediateX2 = intermediateX1 + intermediateGap + pixelWidth;
      let range = cnnLayerRanges$2[selectedScaleLevel$2][curLayerIndex - 1];
      let colorScale = layerColorScales$5.conv;
      let flattenLength = cnn$2.flatten.length / cnn$2[1].length;
      console.log(flattenLength);
      let linkData = [];

      let flattenLayer = intermediateLayer.append('g')
        .attr('class', 'flatten-layer');
      
      let flattenLayerLeftPart = flattenLayer.append('g')
        .attr('class', 'flatten-layer-left');
      
      let topY = nodeCoordinate$2[curLayerIndex - 1][0].y;
      let bottomY = nodeCoordinate$2[curLayerIndex - 1][9].y + nodeLength$5 -
            flattenLength * pixelHeight;
      
      let Ys = [];
      for (let n = 0; n < cnn$2[curLayerIndex - 1].length; n++) {
        if(n < cnn$2[curLayerIndex - 1].length / 2){
          Ys.push(nodeCoordinate$2[curLayerIndex - 1][n].y);
        }else {
          Ys.push(nodeCoordinate$2[curLayerIndex - 1][n].y + nodeLength$5 - flattenLength * pixelHeight);
        }
      }

      // Compute the pre-layer gap
      let preLayerDimension = cnn$2[curLayerIndex - 1][0].output.length;
      let preLayerGap = nodeLength$5 / (2 * preLayerDimension);

      // Compute bounding box length
      let boundingBoxLength = nodeLength$5 / preLayerDimension;

      // Compute the weight color scale
      let flattenExtent = d3.extent(cnn$2.flatten.slice(flattenLength)
        .map(d => d.outputLinks[i].weight)
        .concat(cnn$2.flatten.slice(9 * flattenLength, 10 * flattenLength)
          .map(d => d.outputLinks[i].weight)));

      let flattenRange = 2 * (Math.round(
        Math.max(...flattenExtent.map(Math.abs)) * 1000) / 1000);

      let flattenMouseOverHandler = (d) => {
        let index = d.index;
        // Screenshot
        // console.log(index);

        // Update the hover info UI
        if (d.weight === undefined) {
          hoverInfo = {
            show: true,
            text: `Pixel value: ${formater$2(flattenFactoredFDict[index])}`
          };
        } else {
          hoverInfo = {
            show: true,
            text: `Weight: ${formater$2(d.weight)}`
          };
        }
        hoverInfoStore.set(hoverInfo);

        flattenLayerLeftPart.select(`#edge-flatten-${index}`)
          .raise()
          .style('stroke', intermediateColor$2)
          .style('stroke-width', 1);

        flattenLayerLeftPart.select(`#edge-flatten-${index}-output`)
          .raise()
          .style('stroke-width', 1)
          .style('stroke', da => gappedColorScale(layerColorScales$5.weight,
            flattenRange, da.weight, 0.1));

        flattenLayerLeftPart.select(`#bounding-${index}`)
          .raise()
          .style('opacity', 1);
      };

      let flattenMouseLeaveHandler = (d) => {
        let index = d.index;

        // screenshot
        // if (index === 70) {return;}

        // Update the hover info UI
        if (d.weight === undefined) {
          hoverInfo = {
            show: false,
            text: `Pixel value: ${formater$2(flattenFactoredFDict[index])}`
          };
        } else {
          hoverInfo = {
            show: false,
            text: `Weight: ${formater$2(d.weight)}`
          };
        }
        hoverInfoStore.set(hoverInfo);

        flattenLayerLeftPart.select(`#edge-flatten-${index}`)
          .style('stroke-width', 0.6)
          .style('stroke', '#E5E5E5');

        flattenLayerLeftPart.select(`#edge-flatten-${index}-output`)
          .style('stroke-width', 0.6)
          .style('stroke', da => gappedColorScale(layerColorScales$5.weight,
            flattenRange, da.weight, 0.35));

        flattenLayerLeftPart.select(`#bounding-${index}`)
          .raise()
          .style('opacity', 0);
      };

      flattenFactoredFDict = {};
      for (let f = 0; f < flattenLength; f++) {
        let loopFactors = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
        loopFactors.forEach(l => {
          let factoredF = f + l * flattenLength;
          flattenFactoredFDict[factoredF] = cnn$2.flatten[factoredF].output;
          flattenLayerLeftPart.append('rect')
            .attr('x', intermediateX1)
            // .attr('y', l === 0 ? topY + f * pixelHeight : bottomY + f * pixelHeight)
            .attr('y', Ys[l] + f * pixelHeight)
            .attr('width', pixelWidth)
            .attr('height', pixelHeight)
            .style('cursor', 'crosshair')
            .style('fill', colorScale((cnn$2.flatten[factoredF].output + range / 2) / range))
            .on('mouseover', () => flattenMouseOverHandler({index: factoredF}))
            .on('mouseleave', () => flattenMouseLeaveHandler({index: factoredF}))
            .on('click', () => { d3.event.stopPropagation(); });

          // Flatten -> output
          linkData.push({
            source: {x: intermediateX1 + pixelWidth + 3,
              // y:  l === 0 ? topY + f * pixelHeight : bottomY + f * pixelHeight
              y: Ys[l] + f * pixelHeight},
            target: {x: intermediateX2,
              //nodeCoordinate[curLayerIndex][i].x - nodeLength,
              y: nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2},
            index: factoredF,
            weight: cnn$2.flatten[factoredF].outputLinks[i].weight,
            name: `flatten-${factoredF}-output`,
            color: gappedColorScale(layerColorScales$5.weight,
              flattenRange, cnn$2.flatten[factoredF].outputLinks[i].weight, 0.35),
            width: 0.6,
            opacity: 1,
            class: `flatten-output`
          });

          // Pre-layer -> flatten
          let row = Math.floor(f / preLayerDimension);
          linkData.push({
            target: {x: intermediateX1 - 3,
              // y:  l === 0 ? topY + f * pixelHeight : bottomY + f * pixelHeight
              y: Ys[l] + f * pixelHeight},
            source: {x: leftX + nodeLength$5 + 3,
              y: nodeCoordinate$2[curLayerIndex - 1][l].y + (2 * row + 1) * preLayerGap},
            index: factoredF,
            name: `flatten-${factoredF}`,
            color: '#E5E5E5',
            // color: gappedColorScale(layerColorScales.conv,
            //   2 * Math.max(Math.abs(cnnLayerMinMax[10].max), Math.abs(cnnLayerMinMax[10].min)),
            //   cnn.flatten[factoredF].output, 0.2),
            width: 0.6,
            opacity: 1,
            class: `flatten`
          });

          // Add original pixel bounding box
          let loc = cnn$2.flatten[factoredF].inputLinks[0].weight;
          flattenLayerLeftPart.append('rect')
            .attr('id', `bounding-${factoredF}`)
            .attr('class', 'flatten-bounding')
            .attr('x', leftX + loc[1] * boundingBoxLength)
            .attr('y', nodeCoordinate$2[curLayerIndex - 1][l].y + loc[0] * boundingBoxLength)
            .attr('width', boundingBoxLength)
            .attr('height', boundingBoxLength)
            .style('fill', 'none')
            .style('stroke', intermediateColor$2)
            .style('stroke-length', '0.5')
            .style('pointer-events', 'all')
            .style('cursor', 'crosshair')
            .style('opacity', 0)
            .on('mouseover', () => flattenMouseOverHandler({index: factoredF}))
            .on('mouseleave', () => flattenMouseLeaveHandler({index: factoredF}))
            .on('click', () => {d3.event.stopPropagation();});
        }); 
      }
      

      // Use abstract symbol to represent the flatten nodes in between (between
      // the first and the last nodes)
      // Compute the average value of input node and weights
      // 由于目前每个节点都显示了flatten值，已不需要middle nodes


      // let meanValues = [];
      // for (let n = 1; n < cnn[curLayerIndex - 1].length - 1; n++) {
      //   /*
      //   let meanOutput = d3.mean(cnn.flatten.slice(flattenLength * n,
      //     flattenLength * (n + 1)).map(d => d.output));
      //   let meanWeight= d3.mean(cnn.flatten.slice(flattenLength * n,
      //     flattenLength * (n + 1)).map(d => d.outputLinks[i].weight));
      //   meanValues.push({index: n, output: meanOutput, weight: meanWeight});
      //   */
      //   meanValues.push({index: n});
      // }

      // Compute the middle gap
      let middleGap = 5;
      let middleRectHeight = (10 * nodeLength$5 + (10 - 1) * vSpaceAroundGap$3 -
        pixelHeight * flattenLength * 2 - 5 * (8 + 1)) / 8;

      // Add middle nodes
      // meanValues.forEach((v, vi) => {
      //   // Add a small rectangle
      //   flattenLayerLeftPart.append('rect')
      //     .attr('x', intermediateX1 + pixelWidth / 4)
      //     .attr('y', topY + flattenLength * pixelHeight + middleGap * (vi + 1) +
      //       middleRectHeight * vi)
      //     .attr('width', pixelWidth / 2)
      //     .attr('height', middleRectHeight)
      //     // .style('fill', colorScale((v.output + range / 2) / range));
      //     .style('fill', '#E5E5E5');
        
      //   // Add a triangle next to the input node
      //   flattenLayerLeftPart.append('polyline')
      //     .attr('points',
      //       `${leftX + nodeLength + 3}
      //       ${nodeCoordinate[curLayerIndex - 1][v.index].y},
      //       ${leftX + nodeLength + 10}
      //       ${nodeCoordinate[curLayerIndex - 1][v.index].y + nodeLength / 2},
      //       ${leftX + nodeLength + 3}
      //       ${nodeCoordinate[curLayerIndex - 1][v.index].y + nodeLength}`)
      //     .style('fill', '#E5E5E5')
      //     .style('opacity', 1);
        
      //   // Input -> flatten
      //   linkData.push({
      //     source: {x: leftX + nodeLength + 10,
      //       y: nodeCoordinate[curLayerIndex - 1][v.index].y + nodeLength / 2},
      //     target: {x: intermediateX1 - 3,
      //       y: topY + flattenLength * pixelHeight + middleGap * (vi + 1) +
      //         middleRectHeight * (vi + 0.5)},
      //     index: -1,
      //     width: 1,
      //     opacity: 1,
      //     name: `flatten-abstract-${v.index}`,
      //     color: '#E5E5E5',
      //     class: `flatten-abstract`
      //   });

      //   // Flatten -> output
      //   linkData.push({
      //     source: {x: intermediateX1 + pixelWidth + 3,
      //     y: topY + flattenLength * pixelHeight + middleGap * (vi + 1) +
      //       middleRectHeight * (vi + 0.5)},
      //     target: {x: intermediateX2,
      //     y: nodeCoordinate[curLayerIndex][i].y + nodeLength / 2},
      //     index: -1,
      //     name: `flatten-abstract-${v.index}-output`,
      //     // color: gappedColorScale(layerColorScales.weight, flattenRange,
      //     //   v.weight, 0.35),
      //     color: '#E5E5E5',
      //     weight: v.weight,
      //     width: 1,
      //     opacity: 1,
      //     class: `flatten-abstract-output`
      //   });
      // })

      // Draw the plus operation symbol
      let symbolX = intermediateX2 + plusSymbolRadius$1;
      let symbolY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2;
      let symbolRectHeight = 1;
      let symbolGroup = flattenLayerLeftPart.append('g')
        .attr('class', 'plus-symbol')
        .attr('transform', `translate(${symbolX}, ${symbolY})`);
      
      symbolGroup.append('rect')
        .attr('x', -plusSymbolRadius$1)
        .attr('y', -plusSymbolRadius$1)
        .attr('width', plusSymbolRadius$1 * 2)
        .attr('height', plusSymbolRadius$1 * 2)
        .attr('rx', 3)
        .attr('ry', 3)
        .style('fill', 'none')
        .style('stroke', intermediateColor$2);
      
      symbolGroup.append('rect')
        .attr('x', -(plusSymbolRadius$1 - 3))
        .attr('y', -symbolRectHeight / 2)
        .attr('width', 2 * (plusSymbolRadius$1 - 3))
        .attr('height', symbolRectHeight)
        .style('fill', intermediateColor$2);

      symbolGroup.append('rect')
        .attr('x', -symbolRectHeight / 2)
        .attr('y', -(plusSymbolRadius$1 - 3))
        .attr('width', symbolRectHeight)
        .attr('height', 2 * (plusSymbolRadius$1 - 3))
        .style('fill', intermediateColor$2);

      // Place the bias rectangle below the plus sign if user clicks the first
      // conv node (no need now, since we added annotaiton for softmax to make it
      // look better aligned)
      // Add bias symbol to the plus symbol
      symbolGroup.append('circle')
        .attr('cx', 0)
        .attr('cy', -nodeLength$5 / 2 - 0.5 * kernelRectLength$1)
        .attr('r', kernelRectLength$1 * 1.5)
        .style('stroke', intermediateColor$2)
        .style('cursor', 'crosshair')
        .style('fill', gappedColorScale(layerColorScales$5.weight,
            flattenRange, d.bias, 0.35))
        .on('mouseover', () => {
          hoverInfoStore.set( {show: true, text: `Bias: ${formater$2(d.bias)}`} );
        })
        .on('mouseleave', () => {
          hoverInfoStore.set( {show: false, text: `Bias: ${formater$2(d.bias)}`} );
        })
        .on('click', () => { d3.event.stopPropagation(); });
      
      // Link from bias to the plus symbol
      symbolGroup.append('path')
        .attr('d', linkGen({
          source: { x: 0, y: 0 },
          target: { x: 0, y: -nodeLength$5 / 2 - 0.5 * kernelRectLength$1 }
        }))
        .attr('id', 'bias-plus')
        .attr('stroke-width', 1.2)
        .attr('stroke', '#E5E5E5')
        .lower();

      // Link from the plus symbol to the output
      linkData.push({
        source: getOutputKnot({x: intermediateX2 + 2 * plusSymbolRadius$1 - nodeLength$5,
          y: nodeCoordinate$2[curLayerIndex][i].y}),
        target: getInputKnot({x: nodeCoordinate$2[curLayerIndex][i].x - 3,
          y: nodeCoordinate$2[curLayerIndex][i].y}),
        name: `symbol-output`,
        width: 1.2,
        color: '#E5E5E5'
      });

      // Draw softmax operation symbol
      let softmaxWidth = 55;
      let emptySpace = ((totalLength - 2 * nodeLength$5 - 2 * intermediateGap)
        - softmaxWidth) / 2;
      let symbolEndX = intermediateX2 + plusSymbolRadius$1 * 2;
      let softmaxX = emptySpace + symbolEndX;
      let softmaxLeftMid = emptySpace / 2 + symbolEndX;
      let softmaxTextY = nodeCoordinate$2[curLayerIndex][i].y - 2 * kernelRectLength$1 - 6;
      let moveX = (intermediateX2 - (intermediateX1 + pixelWidth + 3)) * 2 / 3;

      let softmaxArg = {
        curLayerIndex: curLayerIndex,
        moveX: moveX,
        symbolX: symbolX,
        symbolY: symbolY,
        outputX: nodeCoordinate$2[curLayerIndex][i].x,
        outputY: symbolY,
        softmaxLeftMid: softmaxLeftMid,
        selectedI: i,
        intermediateX1: intermediateX1,
        intermediateX2: intermediateX2,
        pixelWidth: pixelWidth,
        pixelHeight: pixelHeight,
        topY: topY,
        bottomY: bottomY,
        middleGap: middleGap,
        middleRectHeight: middleRectHeight,
        softmaxX: softmaxX,
        softmaxWidth: softmaxWidth,
        softmaxTextY: softmaxTextY,
        symbolGroup: symbolGroup,
        flattenRange: flattenRange
      };

      let softmaxSymbol = intermediateLayer.append('g')
        .attr('class', 'softmax-symbol')
        .attr('transform', `translate(${softmaxX}, ${symbolY})`)
        .style('pointer-event', 'all')
        .style('cursor', 'pointer');
        // .on('click', () => softmaxClicked(softmaxArg));
      
      softmaxSymbol.append('rect')
        .attr('x', 0)
        .attr('y', -plusSymbolRadius$1)
        .attr('width', softmaxWidth)
        .attr('height', plusSymbolRadius$1 * 2)
        .attr('stroke', intermediateColor$2)
        .attr('rx', 2)
        .attr('ry', 2)
        .attr('fill', '#FAFAFA');
      
      softmaxSymbol.append('text')
        .attr('x', 15)
        .attr('y', 1)
        .style('dominant-baseline', 'middle')
        .style('font-size', '14px')
        .style('opacity', 0.5)
        .text('relu');

      // Draw the layer label
      let layerLabel = intermediateLayer.append('g')
        .attr('class', 'layer-label')
        .classed('hidden', detailedMode$2)
        .attr('transform', () => {
          let x = leftX + nodeLength$5 + (4 * hSpaceAroundGap$2 * gapRatio$2 +
            pixelWidth) / 2;
          let y = (svgPaddings$3.top + vSpaceAroundGap$3) / 2 + 5;
          return `translate(${x}, ${y})`;
        })
        .style('cursor', 'help')
        .on('click', () => {
          d3.event.stopPropagation();
          // Scroll to the article element
          document.querySelector(`#article-flatten`).scrollIntoView({ 
            behavior: 'smooth' 
          });
        });
      
      layerLabel.append('text')
        .style('dominant-baseline', 'middle')
        .style('opacity', 0.8)
        .style('font-weight', 800)
        .text('flatten');

      let svgHeight = Number(d3.select('#cnn-svg').style('height').replace('px', '')) + 150;
      let scroll = new SmoothScroll('a[href*="#"]', {offset: -svgHeight});
        
      let detailedLabelGroup = intermediateLayer.append('g')
        .attr('transform', () => {
          let x = intermediateX1 + pixelWidth / 2;
          let y = (svgPaddings$3.top + vSpaceAroundGap$3) / 2 - 5;
          return `translate(${x}, ${y})`;
        })
        .attr('class', 'layer-detailed-label')
        .classed('hidden', !detailedMode$2)
        .style('cursor', 'help')
        .on('click', () => {
          d3.event.stopPropagation();
          // Scroll to the article element
          let anchor = document.querySelector(`#article-flatten`);
          scroll.animateScroll(anchor);
        });
      
      detailedLabelGroup.append('title')
        .text('Move to article section');

      let detailedLabelText = detailedLabelGroup.append('text')
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'middle')
        .style('opacity', '0.7')
        .style('font-weight', 800)
        .append('tspan')
        .text('flatten');
      
      let dimension = cnn$2[layerIndexDict['max_pooling2d_9']].length * 
        cnn$2[layerIndexDict['max_pooling2d_9']][0].output.length *
        cnn$2[layerIndexDict['max_pooling2d_9']][0].output[0].length;
      

      detailedLabelText.append('tspan')
        .attr('x', 0)
        .attr('dy', '1.5em')
        .style('font-size', '8px')
        .style('font-weight', 'normal')
        .text(`(${dimension})`);

      // Add edges between nodes
      let edgeGroup = flattenLayerLeftPart.append('g')
        .attr('class', 'edge-group')
        .lower();
      
      edgeGroup.selectAll('path')
        .data(linkData)
        .enter()
        .append('path')
        .attr('class', d => d.class)
        .attr('id', d => `edge-${d.name}`)
        .attr('d', d => linkGen({source: d.source, target: d.target}))
        .style('fill', 'none')
        .style('stroke-width', d => d.width)
        .style('stroke', d => d.color === undefined ? intermediateColor$2 : d.color)
        .style('opacity', d => d.opacity);
      
      edgeGroup.selectAll('path.flatten-abstract-output')
        .lower();

      edgeGroup.selectAll('path.flatten,path.flatten-output')
        .style('cursor', 'crosshair')
        .style('pointer-events', 'all')
        .on('mouseover', flattenMouseOverHandler)
        .on('mouseleave', flattenMouseLeaveHandler)
        .on('click', () => { d3.event.stopPropagation(); });
      
      // Add legend
      let min_layer_index = curLayerIndex - 1;
      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: range,
        minMax: cnnLayerMinMax$2[min_layer_index],
        group: intermediateLayer,
        width: intermediateGap + nodeLength$5 - 3,
        x: leftX,
        y: svgPaddings$3.top + vSpaceAroundGap$3 * (10) + vSpaceAroundGap$3 + 
          nodeLength$5 * 15
      });

      drawIntermediateLayerLegend({
        legendHeight: 5,
        curLayerIndex: curLayerIndex,
        range: flattenRange,
        minMax: {min: flattenExtent[0], max: flattenExtent[1]},
        group: intermediateLayer,
        width: intermediateGap - 3 - 5,
        gradientAppendingName: 'flatten-weight-gradient',
        gradientGap: 0.1,
        colorScale: layerColorScales$5.weight,
        x: leftX + intermediateGap + nodeLength$5 + pixelWidth + 3,
        y: svgPaddings$3.top + vSpaceAroundGap$3 * (10) + vSpaceAroundGap$3 + 
          nodeLength$5 * 15
      });

      // Add annotation to the intermediate layer
      let intermediateLayerAnnotation = svg$4.append('g')
        .attr('class', 'intermediate-layer-annotation')
        .style('opacity', 0);

      // Add annotation for the sum operation
      let plusAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'plus-annotation');
      
      // let textX = nodeCoordinate[curLayerIndex][i].x - 50;
      let textX = intermediateX2;
      let textY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 +
        kernelRectLength$1 * 3;
      let arrowSY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 +
        kernelRectLength$1 * 2;
      let arrowTY = nodeCoordinate$2[curLayerIndex][i].y + nodeLength$5 / 2 +
        plusSymbolRadius$1;

      if (i == 9) {
        textY -= 110;
        arrowSY -= 70;
        arrowTY -= 18;
      }

      let plusText = plusAnnotation.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle');
      
      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('Add up all products');
      
      plusText.append('tspan')
        .attr('x', textX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('(');

      plusText.append('tspan')
        .style('fill', '#66a3c8')
        .style('dominant-baseline', 'hanging')
        .text('element');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text(' × ');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('fill', '#b58946')
        .text('weight');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text(')');

      plusText.append('tspan')
        .attr('x', textX)
        .attr('dy', '1em')
        .style('dominant-baseline', 'hanging')
        .text('and then ');

      plusText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('fill', '#479d94')
        .text('bias');
      
      drawArrow({
        group: plusAnnotation,
        sx: intermediateX2 - 2 * plusSymbolRadius$1 - 3,
        sy: arrowSY,
        tx: intermediateX2 - 5,
        ty: arrowTY,
        dr: 30,
        hFlip: i === 9,
        marker: 'marker-alt'
      });

      // Add annotation for the bias
      let biasTextY = nodeCoordinate$2[curLayerIndex][i].y;
      biasTextY -= 2 * kernelRectLength$1 + 4;
      
      flattenLayerLeftPart.append('text')
        .attr('class', 'annotation-text')
        .attr('x', intermediateX2 + plusSymbolRadius$1)
        .attr('y', biasTextY)
        .style('text-anchor', 'middle')
        .style('dominant-baseline', 'baseline')
        .text('Bias');
      
      // Add annotation for the softmax symbol
      let softmaxAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'softmax-annotation');
      
      // softmaxAnnotation.append('text')
      //   .attr('x', softmaxX + softmaxWidth / 2)
      //   .attr('y', softmaxTextY)
      //   .attr('class', 'annotation-text')
      //   .style('dominant-baseline', 'baseline')
      //   .style('text-anchor', 'middle')
      //   .style('font-weight', 700)
      //   .text('Click ')
      //   .append('tspan')
      //   .attr('dx', 1)
      //   .style('font-weight', 400)
      //   .text('to learn more');

      // drawArrow({
      //   group: softmaxAnnotation,
      //   sx: softmaxX + softmaxWidth / 2 - 5,
      //   sy: softmaxTextY + 4,
      //   tx: softmaxX + softmaxWidth / 2,
      //   ty: symbolY - plusSymbolRadius - 4,
      //   dr: 50,
      //   hFlip: true
      // });

      // Add annotation for the flatten layer
      let flattenAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'flatten-annotation');
      
      textX = leftX - 80;
      textY = nodeCoordinate$2[curLayerIndex - 1][0].y;

      let flattenText = flattenAnnotation.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle');

      let tempTspan = flattenText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .style('font-weight', 700)
        .text('Hover over ');
      
      tempTspan.append('tspan')
        .attr('dx', 1)
        .style('font-weight', 400)
        .style('dominant-baseline', 'hanging')
        .text('matrix to');
      
      flattenText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .attr('x', textX)
        .attr('dy', '1em')
        .text('see how it is flattened');
      
      flattenText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .attr('x', textX)
        .attr('dy', '1em')
        .text('into a 1D array!');

      drawArrow({
        group: flattenAnnotation,
        sx: textX + 45,
        sy: textY + nodeLength$5 * 0.4 + 12,
        tx: leftX - 10,
        ty: textY + nodeLength$5 / 2,
        dr: 80,
        hFlip: true
      });

      // Add annotation to explain the middle images
      textY = nodeCoordinate$2[curLayerIndex - 1][1].y;

      let middleText = flattenAnnotation.append('text')
        .attr('x', textX)
        .attr('y', textY)
        .attr('class', 'annotation-text')
        .style('dominant-baseline', 'hanging')
        .style('text-anchor', 'middle');

      middleText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .text('Same flattening');
      
      middleText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .attr('x', textX)
        .attr('dy', '1em')
        .text('operation for');

      middleText.append('tspan')
        .style('dominant-baseline', 'hanging')
        .attr('x', textX)
        .attr('dy', '1em')
        .text('each neuron');

      drawArrow({
        group: flattenAnnotation,
        sx: textX + 39,
        sy: textY + 25,
        tx: leftX - 10,
        ty: textY + nodeLength$5 / 2 - 2,
        dr: 80,
        hFlip: true,
        marker: 'marker-alt'
      });


      // Add annotation for the output neuron
      let outputAnnotation = intermediateLayerAnnotation.append('g')
        .attr('class', 'output-annotation');
      
      outputAnnotation.append('text')
        .attr('x', nodeCoordinate$2[curLayerIndex][i].x)
        .attr('y', nodeCoordinate$2[curLayerIndex][i].y - 10)
        .attr('class', 'annotation-text')
        .text(`(${d3.format('.4f')(cnn$2[curLayerIndex][i].output)})`);


      /* Prototype of using arc to represent the flatten layer (future)
      let pie = d3.pie()
        .padAngle(0)
        .sort(null)
        .value(d => d.output)
        .startAngle(0)
        .endAngle(-Math.PI);

      let radius = 490 / 2;
      let arc = d3.arc()
        .innerRadius(radius - 20)
        .outerRadius(radius);

      let arcs = pie(cnn.flatten);
      console.log(arcs);

      let test = svg.append('g')
        .attr('class', 'test')
        .attr('transform', 'translate(500, 250)');

      test.selectAll("path")
        .data(arcs)
        .join("path")
          .attr('class', 'arc')
          .attr("fill", d => colorScale((d.value + range/2) / range))
          .attr("d", arc);
      */

      // Show everything
      svg$4.selectAll('g.intermediate-layer, g.intermediate-layer-annotation')
        .transition()
        .delay(500)
        .duration(500)
        .ease(d3.easeCubicInOut)
        .style('opacity', 1);
    };

    /* src\overview\Overview.svelte generated by Svelte v3.23.1 */

    const { Object: Object_1$2, console: console_1$4 } = globals;

    const file$g = "src\\overview\\Overview.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[84] = list[i];
    	child_ctx[86] = i;
    	return child_ctx;
    }

    // (1517:6) {#each imageOptions as image, i}
    function create_each_block$1(ctx) {
    	let div;
    	let img;
    	let img_src_value;
    	let img_title_value;
    	let img_data_imagename_value;
    	let t;
    	let div_data_imagename_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			img = element("img");
    			t = space();
    			if (img.src !== (img_src_value = "/assets/img/" + /*image*/ ctx[84].file)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "image option");
    			attr_dev(img, "title", img_title_value = /*image*/ ctx[84].class);
    			attr_dev(img, "data-imagename", img_data_imagename_value = /*image*/ ctx[84].file);
    			attr_dev(img, "class", "svelte-1t9jxuh");
    			add_location(img, file$g, 1522, 10, 50349);
    			attr_dev(div, "class", "image-container svelte-1t9jxuh");
    			attr_dev(div, "data-imagename", div_data_imagename_value = /*image*/ ctx[84].file);
    			toggle_class(div, "inactive", /*selectedImage*/ ctx[7] !== /*image*/ ctx[84].file);
    			toggle_class(div, "disabled", /*disableControl*/ ctx[6]);
    			add_location(div, file$g, 1517, 8, 50100);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, img);
    			append_dev(div, t);

    			if (!mounted) {
    				dispose = listen_dev(
    					div,
    					"click",
    					function () {
    						if (is_function(/*disableControl*/ ctx[6]
    						? click_handler
    						: /*imageOptionClicked*/ ctx[16])) (/*disableControl*/ ctx[6]
    						? click_handler
    						: /*imageOptionClicked*/ ctx[16]).apply(this, arguments);
    					},
    					false,
    					false,
    					false
    				);

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*selectedImage, imageOptions*/ 16512) {
    				toggle_class(div, "inactive", /*selectedImage*/ ctx[7] !== /*image*/ ctx[84].file);
    			}

    			if (dirty[0] & /*disableControl*/ 64) {
    				toggle_class(div, "disabled", /*disableControl*/ ctx[6]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(1517:6) {#each imageOptions as image, i}",
    		ctx
    	});

    	return block;
    }

    // (1624:39) 
    function create_if_block_3(ctx) {
    	let current;

    	const softmaxview = new Softmaxview({
    			props: {
    				logits: /*softmaxDetailViewInfo*/ ctx[3].logits,
    				logitColors: /*softmaxDetailViewInfo*/ ctx[3].logitColors,
    				selectedI: /*softmaxDetailViewInfo*/ ctx[3].selectedI,
    				highlightI: /*softmaxDetailViewInfo*/ ctx[3].highlightI,
    				outputName: /*softmaxDetailViewInfo*/ ctx[3].outputName,
    				outputValue: /*softmaxDetailViewInfo*/ ctx[3].outputValue,
    				startAnimation: /*softmaxDetailViewInfo*/ ctx[3].startAnimation
    			},
    			$$inline: true
    		});

    	softmaxview.$on("xClicked", /*handleExitFromDetiledSoftmaxView*/ ctx[23]);
    	softmaxview.$on("mouseOver", softmaxDetailViewMouseOverHandler);
    	softmaxview.$on("mouseLeave", softmaxDetailViewMouseLeaveHandler);

    	const block = {
    		c: function create() {
    			create_component(softmaxview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(softmaxview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const softmaxview_changes = {};
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 8) softmaxview_changes.logits = /*softmaxDetailViewInfo*/ ctx[3].logits;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 8) softmaxview_changes.logitColors = /*softmaxDetailViewInfo*/ ctx[3].logitColors;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 8) softmaxview_changes.selectedI = /*softmaxDetailViewInfo*/ ctx[3].selectedI;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 8) softmaxview_changes.highlightI = /*softmaxDetailViewInfo*/ ctx[3].highlightI;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 8) softmaxview_changes.outputName = /*softmaxDetailViewInfo*/ ctx[3].outputName;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 8) softmaxview_changes.outputValue = /*softmaxDetailViewInfo*/ ctx[3].outputValue;
    			if (dirty[0] & /*softmaxDetailViewInfo*/ 8) softmaxview_changes.startAnimation = /*softmaxDetailViewInfo*/ ctx[3].startAnimation;
    			softmaxview.$set(softmaxview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(softmaxview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(softmaxview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(softmaxview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(1624:39) ",
    		ctx
    	});

    	return block;
    }

    // (1619:67) 
    function create_if_block_2(ctx) {
    	let current;

    	const poolview = new Poolview({
    			props: {
    				input: /*nodeData*/ ctx[8][0].input,
    				kernelLength: 2,
    				dataRange: /*nodeData*/ ctx[8].colorRange,
    				isExited: /*isExitedFromDetailedView*/ ctx[10]
    			},
    			$$inline: true
    		});

    	poolview.$on("message", /*handleExitFromDetiledPoolView*/ ctx[21]);

    	const block = {
    		c: function create() {
    			create_component(poolview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(poolview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const poolview_changes = {};
    			if (dirty[0] & /*nodeData*/ 256) poolview_changes.input = /*nodeData*/ ctx[8][0].input;
    			if (dirty[0] & /*nodeData*/ 256) poolview_changes.dataRange = /*nodeData*/ ctx[8].colorRange;
    			if (dirty[0] & /*isExitedFromDetailedView*/ 1024) poolview_changes.isExited = /*isExitedFromDetailedView*/ ctx[10];
    			poolview.$set(poolview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(poolview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(poolview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(poolview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(1619:67) ",
    		ctx
    	});

    	return block;
    }

    // (1614:67) 
    function create_if_block_1(ctx) {
    	let current;

    	const activationview = new Activationview({
    			props: {
    				input: /*nodeData*/ ctx[8][0].input,
    				output: /*nodeData*/ ctx[8][0].output,
    				dataRange: /*nodeData*/ ctx[8].colorRange,
    				isExited: /*isExitedFromDetailedView*/ ctx[10]
    			},
    			$$inline: true
    		});

    	activationview.$on("message", /*handleExitFromDetiledActivationView*/ ctx[22]);

    	const block = {
    		c: function create() {
    			create_component(activationview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(activationview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const activationview_changes = {};
    			if (dirty[0] & /*nodeData*/ 256) activationview_changes.input = /*nodeData*/ ctx[8][0].input;
    			if (dirty[0] & /*nodeData*/ 256) activationview_changes.output = /*nodeData*/ ctx[8][0].output;
    			if (dirty[0] & /*nodeData*/ 256) activationview_changes.dataRange = /*nodeData*/ ctx[8].colorRange;
    			if (dirty[0] & /*isExitedFromDetailedView*/ 1024) activationview_changes.isExited = /*isExitedFromDetailedView*/ ctx[10];
    			activationview.$set(activationview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(activationview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(activationview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(activationview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(1614:67) ",
    		ctx
    	});

    	return block;
    }

    // (1606:2) {#if selectedNode.data && selectedNode.data.type === 'conv' && selectedNodeIndex != -1}
    function create_if_block$4(ctx) {
    	let current;

    	const convolutionview = new Convolutionview({
    			props: {
    				input: /*nodeData*/ ctx[8][/*selectedNodeIndex*/ ctx[9]].input,
    				kernel: /*nodeData*/ ctx[8][/*selectedNodeIndex*/ ctx[9]].kernel,
    				dataRange: /*nodeData*/ ctx[8].colorRange,
    				colorScale: /*nodeData*/ ctx[8].inputIsInputLayer
    				? /*layerColorScales*/ ctx[13].input[0]
    				: /*layerColorScales*/ ctx[13].conv,
    				isInputInputLayer: /*nodeData*/ ctx[8].inputIsInputLayer,
    				isExited: /*isExitedFromCollapse*/ ctx[11]
    			},
    			$$inline: true
    		});

    	convolutionview.$on("message", /*handleExitFromDetiledConvView*/ ctx[20]);

    	const block = {
    		c: function create() {
    			create_component(convolutionview.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(convolutionview, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const convolutionview_changes = {};
    			if (dirty[0] & /*nodeData, selectedNodeIndex*/ 768) convolutionview_changes.input = /*nodeData*/ ctx[8][/*selectedNodeIndex*/ ctx[9]].input;
    			if (dirty[0] & /*nodeData, selectedNodeIndex*/ 768) convolutionview_changes.kernel = /*nodeData*/ ctx[8][/*selectedNodeIndex*/ ctx[9]].kernel;
    			if (dirty[0] & /*nodeData*/ 256) convolutionview_changes.dataRange = /*nodeData*/ ctx[8].colorRange;

    			if (dirty[0] & /*nodeData*/ 256) convolutionview_changes.colorScale = /*nodeData*/ ctx[8].inputIsInputLayer
    			? /*layerColorScales*/ ctx[13].input[0]
    			: /*layerColorScales*/ ctx[13].conv;

    			if (dirty[0] & /*nodeData*/ 256) convolutionview_changes.isInputInputLayer = /*nodeData*/ ctx[8].inputIsInputLayer;
    			if (dirty[0] & /*isExitedFromCollapse*/ 2048) convolutionview_changes.isExited = /*isExitedFromCollapse*/ ctx[11];
    			convolutionview.$set(convolutionview_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(convolutionview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(convolutionview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(convolutionview, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(1606:2) {#if selectedNode.data && selectedNode.data.type === 'conv' && selectedNodeIndex != -1}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div7;
    	let div5;
    	let div1;
    	let t0;
    	let div0;
    	let img;
    	let img_src_value;
    	let t1;
    	let span0;
    	let i0;
    	let t2;
    	let i1;
    	let div0_data_imagename_value;
    	let t3;
    	let button0;
    	let span1;
    	let i2;
    	let t4;
    	let span2;
    	let t5_value = /*hoverInfo*/ ctx[4].text + "";
    	let t5;
    	let t6;
    	let div4;
    	let button1;
    	let span3;
    	let i3;
    	let t7;
    	let span4;
    	let t9;
    	let div3;
    	let span5;
    	let i4;
    	let t10;
    	let div2;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let t14;
    	let div6;
    	let svg_1;
    	let t15;
    	let div8;
    	let current_block_type_index;
    	let if_block;
    	let t16;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*imageOptions*/ ctx[14];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const if_block_creators = [create_if_block$4, create_if_block_1, create_if_block_2, create_if_block_3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*selectedNode*/ ctx[5].data && /*selectedNode*/ ctx[5].data.type === "conv" && /*selectedNodeIndex*/ ctx[9] != -1) return 0;
    		if (/*selectedNode*/ ctx[5].data && /*selectedNode*/ ctx[5].data.type === "relu") return 1;
    		if (/*selectedNode*/ ctx[5].data && /*selectedNode*/ ctx[5].data.type === "pool") return 2;
    		if (/*softmaxDetailViewInfo*/ ctx[3].show) return 3;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const modal = new Modal({ $$inline: true });
    	modal.$on("xClicked", /*handleModalCanceled*/ ctx[18]);
    	modal.$on("urlTyped", /*handleCustomImage*/ ctx[19]);

    	const block = {
    		c: function create() {
    			div7 = element("div");
    			div5 = element("div");
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			div0 = element("div");
    			img = element("img");
    			t1 = space();
    			span0 = element("span");
    			i0 = element("i");
    			t2 = space();
    			i1 = element("i");
    			t3 = space();
    			button0 = element("button");
    			span1 = element("span");
    			i2 = element("i");
    			t4 = space();
    			span2 = element("span");
    			t5 = text(t5_value);
    			t6 = space();
    			div4 = element("div");
    			button1 = element("button");
    			span3 = element("span");
    			i3 = element("i");
    			t7 = space();
    			span4 = element("span");
    			span4.textContent = "Show detail";
    			t9 = space();
    			div3 = element("div");
    			span5 = element("span");
    			i4 = element("i");
    			t10 = space();
    			div2 = element("div");
    			select = element("select");
    			option0 = element("option");
    			option0.textContent = "Unit";
    			option1 = element("option");
    			option1.textContent = "Module";
    			option2 = element("option");
    			option2.textContent = "Global";
    			t14 = space();
    			div6 = element("div");
    			svg_1 = svg_element("svg");
    			t15 = space();
    			div8 = element("div");
    			if (if_block) if_block.c();
    			t16 = space();
    			create_component(modal.$$.fragment);
    			attr_dev(img, "class", "custom-image svelte-1t9jxuh");
    			if (img.src !== (img_src_value = "/assets/img/plus.svg")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "plus button");
    			attr_dev(img, "title", "Add new input image");
    			attr_dev(img, "data-imagename", "custom");
    			add_location(img, file$g, 1536, 10, 50826);
    			attr_dev(i0, "class", "fas fa-circle fa-stack-2x");
    			add_location(i0, file$g, 1544, 12, 51125);
    			attr_dev(i1, "class", "fas fa-pen fa-stack-1x fa-inverse");
    			add_location(i1, file$g, 1545, 12, 51180);
    			attr_dev(span0, "class", "fa-stack edit-icon svelte-1t9jxuh");
    			toggle_class(span0, "hidden", /*customImageURL*/ ctx[12] === null);
    			add_location(span0, file$g, 1542, 10, 51026);
    			attr_dev(div0, "class", "image-container svelte-1t9jxuh");
    			attr_dev(div0, "data-imagename", div0_data_imagename_value = "custom");
    			toggle_class(div0, "inactive", /*selectedImage*/ ctx[7] !== "custom");
    			toggle_class(div0, "disabled", /*disableControl*/ ctx[6]);
    			add_location(div0, file$g, 1530, 8, 50579);
    			attr_dev(i2, "class", "fas fa-crosshairs ");
    			add_location(i2, file$g, 1554, 10, 51474);
    			attr_dev(span1, "class", "icon");
    			set_style(span1, "margin-right", "5px");
    			add_location(span1, file$g, 1553, 8, 51416);
    			attr_dev(span2, "id", "hover-label-text");
    			add_location(span2, file$g, 1556, 8, 51535);
    			attr_dev(button0, "class", "button is-very-small is-link is-light svelte-1t9jxuh");
    			attr_dev(button0, "id", "hover-label");
    			set_style(button0, "opacity", /*hoverInfo*/ ctx[4].show ? 1 : 0);
    			add_location(button0, file$g, 1550, 6, 51276);
    			attr_dev(div1, "class", "left-control svelte-1t9jxuh");
    			add_location(div1, file$g, 1515, 4, 50024);
    			attr_dev(i3, "class", "fas fa-eye");
    			add_location(i3, file$g, 1570, 10, 51910);
    			attr_dev(span3, "class", "icon");
    			add_location(span3, file$g, 1569, 8, 51879);
    			attr_dev(span4, "id", "hover-label-text");
    			add_location(span4, file$g, 1572, 8, 51963);
    			attr_dev(button1, "class", "button is-very-small svelte-1t9jxuh");
    			attr_dev(button1, "id", "detailed-button");
    			button1.disabled = /*disableControl*/ ctx[6];
    			toggle_class(button1, "is-activated", /*detailedMode*/ ctx[2]);
    			add_location(button1, file$g, 1564, 6, 51682);
    			attr_dev(i4, "class", "fas fa-palette");
    			add_location(i4, file$g, 1580, 10, 52199);
    			attr_dev(span5, "class", "icon is-left");
    			add_location(span5, file$g, 1579, 8, 52160);
    			option0.__value = "local";
    			option0.value = option0.__value;
    			add_location(option0, file$g, 1586, 12, 52401);
    			option1.__value = "module";
    			option1.value = option1.__value;
    			add_location(option1, file$g, 1587, 12, 52450);
    			option2.__value = "global";
    			option2.value = option2.__value;
    			add_location(option2, file$g, 1588, 12, 52502);
    			attr_dev(select, "id", "level-select");
    			select.disabled = /*disableControl*/ ctx[6];
    			attr_dev(select, "class", "svelte-1t9jxuh");
    			if (/*selectedScaleLevel*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[24].call(select));
    			add_location(select, file$g, 1584, 10, 52290);
    			attr_dev(div2, "class", "select svelte-1t9jxuh");
    			add_location(div2, file$g, 1583, 8, 52258);
    			attr_dev(div3, "class", "control is-very-small has-icons-left svelte-1t9jxuh");
    			attr_dev(div3, "title", "Change color scale range");
    			add_location(div3, file$g, 1577, 6, 52058);
    			attr_dev(div4, "class", "right-control svelte-1t9jxuh");
    			add_location(div4, file$g, 1562, 4, 51645);
    			attr_dev(div5, "class", "control-container svelte-1t9jxuh");
    			add_location(div5, file$g, 1513, 2, 49985);
    			attr_dev(svg_1, "id", "cnn-svg");
    			attr_dev(svg_1, "class", "svelte-1t9jxuh");
    			add_location(svg_1, file$g, 1598, 4, 52650);
    			attr_dev(div6, "class", "cnn svelte-1t9jxuh");
    			add_location(div6, file$g, 1597, 2, 52627);
    			attr_dev(div7, "class", "overview svelte-1t9jxuh");
    			add_location(div7, file$g, 1510, 0, 49924);
    			attr_dev(div8, "id", "detailview");
    			add_location(div8, file$g, 1604, 0, 52719);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div7, anchor);
    			append_dev(div7, div5);
    			append_dev(div5, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t0);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t1);
    			append_dev(div0, span0);
    			append_dev(span0, i0);
    			append_dev(span0, t2);
    			append_dev(span0, i1);
    			append_dev(div1, t3);
    			append_dev(div1, button0);
    			append_dev(button0, span1);
    			append_dev(span1, i2);
    			append_dev(button0, t4);
    			append_dev(button0, span2);
    			append_dev(span2, t5);
    			append_dev(div5, t6);
    			append_dev(div5, div4);
    			append_dev(div4, button1);
    			append_dev(button1, span3);
    			append_dev(span3, i3);
    			append_dev(button1, t7);
    			append_dev(button1, span4);
    			append_dev(div4, t9);
    			append_dev(div4, div3);
    			append_dev(div3, span5);
    			append_dev(span5, i4);
    			append_dev(div3, t10);
    			append_dev(div3, div2);
    			append_dev(div2, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			select_option(select, /*selectedScaleLevel*/ ctx[1]);
    			append_dev(div7, t14);
    			append_dev(div7, div6);
    			append_dev(div6, svg_1);
    			/*div7_binding*/ ctx[25](div7);
    			insert_dev(target, t15, anchor);
    			insert_dev(target, div8, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div8, null);
    			}

    			insert_dev(target, t16, anchor);
    			mount_component(modal, target, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(
    						div0,
    						"click",
    						function () {
    							if (is_function(/*disableControl*/ ctx[6]
    							? click_handler_1
    							: /*customImageClicked*/ ctx[17])) (/*disableControl*/ ctx[6]
    							? click_handler_1
    							: /*customImageClicked*/ ctx[17]).apply(this, arguments);
    						},
    						false,
    						false,
    						false
    					),
    					listen_dev(button1, "click", /*detailedButtonClicked*/ ctx[15], false, false, false),
    					listen_dev(select, "change", /*select_change_handler*/ ctx[24])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty[0] & /*imageOptions, selectedImage, disableControl, imageOptionClicked*/ 82112) {
    				each_value = /*imageOptions*/ ctx[14];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t0);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}

    			if (dirty[0] & /*customImageURL*/ 4096) {
    				toggle_class(span0, "hidden", /*customImageURL*/ ctx[12] === null);
    			}

    			if (dirty[0] & /*selectedImage*/ 128) {
    				toggle_class(div0, "inactive", /*selectedImage*/ ctx[7] !== "custom");
    			}

    			if (dirty[0] & /*disableControl*/ 64) {
    				toggle_class(div0, "disabled", /*disableControl*/ ctx[6]);
    			}

    			if ((!current || dirty[0] & /*hoverInfo*/ 16) && t5_value !== (t5_value = /*hoverInfo*/ ctx[4].text + "")) set_data_dev(t5, t5_value);

    			if (!current || dirty[0] & /*hoverInfo*/ 16) {
    				set_style(button0, "opacity", /*hoverInfo*/ ctx[4].show ? 1 : 0);
    			}

    			if (!current || dirty[0] & /*disableControl*/ 64) {
    				prop_dev(button1, "disabled", /*disableControl*/ ctx[6]);
    			}

    			if (dirty[0] & /*detailedMode*/ 4) {
    				toggle_class(button1, "is-activated", /*detailedMode*/ ctx[2]);
    			}

    			if (!current || dirty[0] & /*disableControl*/ 64) {
    				prop_dev(select, "disabled", /*disableControl*/ ctx[6]);
    			}

    			if (dirty[0] & /*selectedScaleLevel*/ 2) {
    				select_option(select, /*selectedScaleLevel*/ ctx[1]);
    			}

    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(div8, null);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(modal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(modal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div7);
    			destroy_each(each_blocks, detaching);
    			/*div7_binding*/ ctx[25](null);
    			if (detaching) detach_dev(t15);
    			if (detaching) detach_dev(div8);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}

    			if (detaching) detach_dev(t16);
    			destroy_component(modal, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const click_handler = () => {
    	
    };

    const click_handler_1 = () => {
    	
    };

    function instance$h($$self, $$props, $$invalidate) {
    	let overviewComponent;
    	let scaleLevelSet = new Set(["local", "module", "global"]);
    	let selectedScaleLevel = "local";
    	selectedScaleLevelStore.set(selectedScaleLevel);
    	let previousSelectedScaleLevel = selectedScaleLevel;
    	let wholeSvg = undefined;
    	let svg = undefined;

    	// Configs
    	const layerColorScales = overviewConfig.layerColorScales;

    	const nodeLength = overviewConfig.nodeLength;
    	const plusSymbolRadius = overviewConfig.plusSymbolRadius;
    	const numLayers = overviewConfig.numLayers;
    	const edgeOpacity = overviewConfig.edgeOpacity;
    	const edgeInitColor = overviewConfig.edgeInitColor;
    	const edgeHoverColor = overviewConfig.edgeHoverColor;
    	const edgeHoverOuting = overviewConfig.edgeHoverOuting;
    	const edgeStrokeWidth = overviewConfig.edgeStrokeWidth;
    	const intermediateColor = overviewConfig.intermediateColor;
    	const kernelRectLength = overviewConfig.kernelRectLength;
    	const svgPaddings = overviewConfig.svgPaddings;
    	const gapRatio = overviewConfig.gapRatio;
    	const overlayRectOffset = overviewConfig.overlayRectOffset;
    	const classLists = overviewConfig.classLists;

    	// Shared properties
    	let needRedraw = [undefined, undefined];

    	needRedrawStore.subscribe(value => {
    		needRedraw = value;
    	});

    	let nodeCoordinate = undefined;

    	nodeCoordinateStore.subscribe(value => {
    		nodeCoordinate = value;
    	});

    	let cnnLayerRanges = undefined;

    	cnnLayerRangesStore.subscribe(value => {
    		cnnLayerRanges = value;
    	});

    	let cnnLayerMinMax = undefined;

    	cnnLayerMinMaxStore.subscribe(value => {
    		cnnLayerMinMax = value;
    	});

    	let detailedMode = undefined;

    	detailedModeStore.subscribe(value => {
    		$$invalidate(2, detailedMode = value);
    	});

    	let shouldIntermediateAnimate = undefined;

    	shouldIntermediateAnimateStore.subscribe(value => {
    		shouldIntermediateAnimate = value;
    	});

    	let vSpaceAroundGap = undefined;

    	vSpaceAroundGapStore.subscribe(value => {
    		vSpaceAroundGap = value;
    	});

    	let hSpaceAroundGap = undefined;

    	hSpaceAroundGapStore.subscribe(value => {
    		hSpaceAroundGap = value;
    	});

    	let isInSoftmax = undefined;

    	isInSoftmaxStore.subscribe(value => {
    		isInSoftmax = value;
    	});

    	let softmaxDetailViewInfo = undefined;

    	softmaxDetailViewStore.subscribe(value => {
    		$$invalidate(3, softmaxDetailViewInfo = value);
    	});

    	let modalInfo = undefined;

    	modalStore.subscribe(value => {
    		modalInfo = value;
    	});

    	let hoverInfo = undefined;

    	hoverInfoStore.subscribe(value => {
    		$$invalidate(4, hoverInfo = value);
    	});

    	let intermediateLayerPosition = undefined;

    	intermediateLayerPositionStore.subscribe(value => {
    		intermediateLayerPosition = value;
    	});

    	let width = undefined;
    	let height = undefined;
    	let model = undefined;
    	let selectedNode = { layerName: "", index: -1, data: null };
    	let isInIntermediateView = false;
    	let isInActPoolDetailView = false;
    	let actPoolDetailViewNodeIndex = -1;
    	let actPoolDetailViewLayerIndex = -1;
    	let detailedViewNum = undefined;
    	let disableControl = false;

    	// Wait to load
    	let cnn = undefined;

    	let detailedViewAbsCoords = {
    		1: [600, 270, 490, 290],
    		2: [500, 270, 490, 290],
    		3: [700, 270, 490, 290],
    		4: [600, 270, 490, 290],
    		5: [650, 270, 490, 290],
    		6: [775, 270, 490, 290],
    		7: [100, 270, 490, 290],
    		8: [60, 270, 490, 290],
    		9: [200, 270, 490, 290],
    		10: [300, 270, 490, 290]
    	};

    	const layerIndexDict1 = {
    		"input": 0,
    		"conv_1_1": 1,
    		"relu_1_1": 2,
    		"conv_1_2": 3,
    		"relu_1_2": 4,
    		"max_pool_1": 5,
    		"conv_2_1": 6,
    		"relu_2_1": 7,
    		"conv_2_2": 8,
    		"relu_2_2": 9,
    		"max_pool_2": 10,
    		"output": 11
    	};

    	const layerIndexDict = {
    		"input": 0,
    		"conv2d_8": 1,
    		"max_pooling2d_8": 2,
    		"conv2d_9": 3,
    		"max_pooling2d_9": 4,
    		"dense_8": 5,
    		"output": 6
    	};

    	const layerLegendDict = {
    		0: {
    			local: "input-legend",
    			module: "input-legend",
    			global: "input-legend"
    		},
    		1: {
    			local: "local-legend-0-1",
    			module: "module-legend-0",
    			global: "global-legend"
    		},
    		2: {
    			local: "local-legend-0-1",
    			module: "module-legend-0",
    			global: "global-legend"
    		},
    		3: {
    			local: "local-legend-0-2",
    			module: "module-legend-0",
    			global: "global-legend"
    		},
    		4: {
    			local: "local-legend-0-2",
    			module: "module-legend-0",
    			global: "global-legend"
    		},
    		5: {
    			local: "local-legend-0-2",
    			module: "module-legend-0",
    			global: "global-legend"
    		},
    		6: {
    			local: "local-legend-1-1",
    			module: "module-legend-1",
    			global: "global-legend"
    		},
    		7: {
    			local: "local-legend-1-1",
    			module: "module-legend-1",
    			global: "global-legend"
    		},
    		8: {
    			local: "local-legend-1-2",
    			module: "module-legend-1",
    			global: "global-legend"
    		},
    		9: {
    			local: "local-legend-1-2",
    			module: "module-legend-1",
    			global: "global-legend"
    		},
    		10: {
    			local: "local-legend-1-2",
    			module: "module-legend-1",
    			global: "global-legend"
    		},
    		11: {
    			local: "output-legend",
    			module: "output-legend",
    			global: "output-legend"
    		}
    	};

    	let imageOptions = [
    		{ file: "boat_1.jpeg", class: "lifeboat" },
    		{ file: "bug_1.jpeg", class: "ladybug" },
    		{ file: "pizza_1.jpeg", class: "pizza" },
    		{
    			file: "pepper_1.jpeg",
    			class: "bell pepper"
    		},
    		{ file: "bus_1.jpeg", class: "bus" },
    		{ file: "koala_1.jpeg", class: "koala" },
    		{
    			file: "espresso_1.jpeg",
    			class: "espresso"
    		},
    		{ file: "panda_1.jpeg", class: "red panda" },
    		{ file: "orange_1.jpeg", class: "orange" },
    		{ file: "car_1.jpeg", class: "sport car" }
    	];

    	let selectedImage = imageOptions[6].file;
    	let nodeData;
    	let selectedNodeIndex = -1;
    	let isExitedFromDetailedView = true;
    	let isExitedFromCollapse = true;
    	let customImageURL = null;

    	// Helper functions
    	const selectedScaleLevelChanged = () => {
    		if (svg !== undefined) {
    			if (!scaleLevelSet.add(selectedScaleLevel)) {
    				console.error("Encounter unknown scale level!");
    			}

    			// Update nodes and legends
    			if (selectedScaleLevel != previousSelectedScaleLevel) {
    				// We can simply redraw all nodes using the new color scale, or we can
    				// make it faster by only redraw certian nodes
    				let updatingLayerIndexDict = {
    					local: {
    						module: [1, 2, 8, 9, 10],
    						global: [1, 2, 3, 4, 5, 8, 9, 10]
    					},
    					module: {
    						local: [1, 2, 8, 9, 10],
    						global: [1, 2, 3, 4, 5, 8, 9, 10]
    					},
    					global: {
    						local: [1, 2, 3, 4, 5, 8, 9, 10],
    						module: [1, 2, 3, 4, 5]
    					}
    				};

    				let updatingLayerIndex = updatingLayerIndexDict[previousSelectedScaleLevel][selectedScaleLevel];

    				updatingLayerIndex.forEach(l => {
    					let range = cnnLayerRanges[selectedScaleLevel][l];
    					svg.select(`#cnn-layer-group-${l}`).selectAll(".node-image").each((d, i, g) => drawOutput(d, i, g, range));
    				});

    				// Hide previous legend
    				svg.selectAll(`.${previousSelectedScaleLevel}-legend`).classed("hidden", true);

    				// Show selected legends
    				svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", !detailedMode);
    			}

    			previousSelectedScaleLevel = selectedScaleLevel;
    			selectedScaleLevelStore.set(selectedScaleLevel);
    		}
    	};

    	const intermediateNodeMouseOverHandler = (d, i, g) => {
    		if (detailedViewNum !== undefined) {
    			return;
    		}

    		svg.select(`rect#underneath-gateway-${d.index}`).style("opacity", 1);
    	};

    	const intermediateNodeMouseLeaveHandler = (d, i, g) => {
    		// return;
    		if (detailedViewNum !== undefined) {
    			return;
    		}

    		svg.select(`rect#underneath-gateway-${d.index}`).style("opacity", 0);
    	};

    	const intermediateNodeClicked = (d, i, g, selectedI, curLayerIndex) => {
    		d3.event.stopPropagation();
    		$$invalidate(11, isExitedFromCollapse = false);

    		// Use this event to trigger the detailed view
    		if (detailedViewNum === d.index) {
    			// Setting this for testing purposes currently.
    			$$invalidate(9, selectedNodeIndex = -1);

    			// User clicks this node again -> rewind
    			detailedViewNum = undefined;

    			svg.select(`rect#underneath-gateway-${d.index}`).style("opacity", 0);
    		} else // We need to show a new detailed view (two cases: if we need to close the
    		// old detailed view or not)
    		{
    			// Setting this for testing purposes currently.
    			$$invalidate(9, selectedNodeIndex = d.index);

    			let inputMatrix = d.output;
    			let kernelMatrix = d.outputLinks[selectedI].weight;

    			// let interMatrix = singleConv(inputMatrix, kernelMatrix);
    			let colorScale = layerColorScales.conv;

    			// Compute the color range
    			let rangePre = cnnLayerRanges[selectedScaleLevel][curLayerIndex - 1];

    			let rangeCur = cnnLayerRanges[selectedScaleLevel][curLayerIndex];
    			let range = Math.max(rangePre, rangeCur);

    			// User triggers a different detailed view
    			if (detailedViewNum !== undefined) {
    				// Change the underneath highlight
    				svg.select(`rect#underneath-gateway-${detailedViewNum}`).style("opacity", 0);

    				svg.select(`rect#underneath-gateway-${d.index}`).style("opacity", 1);
    			}

    			// Dynamically position the detail view
    			let wholeSvg = d3.select("#cnn-svg");

    			let svgYMid = +wholeSvg.style("height").replace("px", "") / 2;
    			let svgWidth = +wholeSvg.style("width").replace("px", "");
    			let detailViewTop = 100 + svgYMid - 250 / 2;
    			let positionX = intermediateLayerPosition[Object.keys(layerIndexDict)[curLayerIndex]];
    			let posX = 0;

    			if (curLayerIndex > 6) {
    				posX = (positionX - svgPaddings.left) / 2;
    				posX = svgPaddings.left + posX - 486 / 2;
    			} else {
    				posX = (svgWidth + svgPaddings.right - positionX) / 2;
    				posX = positionX + posX - 486 / 2;
    			}

    			const detailview = document.getElementById("detailview");
    			detailview.style.top = `${detailViewTop}px`;
    			detailview.style.left = `${posX}px`;
    			detailview.style.position = "absolute";
    			detailedViewNum = d.index;

    			// Send the currently used color range to detailed view
    			$$invalidate(8, nodeData.colorRange = range, nodeData);

    			$$invalidate(8, nodeData.inputIsInputLayer = curLayerIndex <= 1, nodeData);
    		}
    	};

    	// The order of the if/else statements in this function is very critical
    	const emptySpaceClicked = () => {
    		// If detail view -> rewind to intermediate view
    		if (detailedViewNum !== undefined) {
    			// Setting this for testing purposes currently.
    			$$invalidate(9, selectedNodeIndex = -1);

    			// User clicks this node again -> rewind
    			svg.select(`rect#underneath-gateway-${detailedViewNum}`).style("opacity", 0);

    			detailedViewNum = undefined;
    		} else // If softmax view -> rewind to flatten layer view
    		if (isInSoftmax) {
    			svg.select(".softmax-symbol").dispatch("click");
    		} else // If intermediate view -> rewind to overview
    		if (isInIntermediateView) {
    			let curLayerIndex = layerIndexDict[selectedNode.layerName];
    			quitIntermediateView(curLayerIndex, selectedNode.domG, selectedNode.domI);
    			d3.select(selectedNode.domG[selectedNode.domI]).dispatch("mouseleave");
    		} else // If pool/act detail view -> rewind to overview
    		if (isInActPoolDetailView) {
    			quitActPoolDetailView();
    		}
    	};

    	const prepareToEnterIntermediateView = (d, g, i, curLayerIndex) => {
    		isInIntermediateView = true;

    		// Hide all legends
    		svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", true);

    		svg.selectAll(".input-legend").classed("hidden", true);
    		svg.selectAll(".output-legend").classed("hidden", true);

    		// Hide the input annotation
    		svg.select(".input-annotation").classed("hidden", true);

    		// Highlight the previous layer and this node
    		svg.select(`g#cnn-layer-group-${curLayerIndex - 1}`).selectAll("rect.bounding").style("stroke-width", 2);

    		d3.select(g[i]).select("rect.bounding").style("stroke-width", 2);

    		// Disable control panel UI
    		// d3.select('#level-select').property('disabled', true);
    		// d3.selectAll('.image-container')
    		//   .style('cursor', 'not-allowed')
    		//   .on('mouseclick', () => {});
    		$$invalidate(6, disableControl = true);

    		// Allow infinite animation loop
    		shouldIntermediateAnimateStore.set(true);

    		// Highlight the labels
    		svg.selectAll(`g#layer-label-${curLayerIndex - 1},
      g#layer-detailed-label-${curLayerIndex - 1},
      g#layer-label-${curLayerIndex},
      g#layer-detailed-label-${curLayerIndex}`).style("font-weight", "800");

    		// Register a handler on the svg element so user can click empty space to quit
    		// the intermediate view
    		d3.select("#cnn-svg").on("click", emptySpaceClicked);
    	};

    	const quitActPoolDetailView = () => {
    		isInActPoolDetailView = false;
    		actPoolDetailViewNodeIndex = -1;
    		let layerIndex = layerIndexDict[selectedNode.layerName];
    		let nodeIndex = selectedNode.index;
    		svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", true);

    		selectedNode.data.inputLinks.forEach(link => {
    			let layerIndex = layerIndexDict[link.source.layerName];
    			let nodeIndex = link.source.index;
    			svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", true);
    		});

    		// Clean up the underneath rects
    		svg.select("g.underneath").selectAll("rect").remove();

    		// Show all edges
    		let unimportantEdges = svg.select("g.edge-group").selectAll(".edge").filter(d => {
    			return d.targetLayerIndex !== actPoolDetailViewLayerIndex;
    		}).style("visibility", null);

    		// Recover control UI
    		$$invalidate(6, disableControl = false);

    		// Show legends if in detailed mode
    		svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", !detailedMode);

    		svg.selectAll(".input-legend").classed("hidden", !detailedMode);
    		svg.selectAll(".output-legend").classed("hidden", !detailedMode);

    		// Also dehighlight the edge
    		let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");

    		edgeGroup.selectAll(`path.edge-${layerIndex}-${nodeIndex}`).transition().ease(d3.easeCubicOut).duration(200).style("stroke", edgeInitColor).style("stroke-width", edgeStrokeWidth).style("opacity", edgeOpacity);

    		// Remove the overlay rect
    		svg.selectAll("g.intermediate-layer-overlay, g.intermediate-layer-annotation").transition("remove").duration(500).ease(d3.easeCubicInOut).style("opacity", 0).on("end", (d, i, g) => {
    			svg.selectAll("g.intermediate-layer-overlay, g.intermediate-layer-annotation").remove();
    			svg.selectAll("defs.overlay-gradient").remove();
    			svg.select(".input-annotation").classed("hidden", false);
    		});

    		// Turn the fade out nodes back
    		svg.select(`g#cnn-layer-group-${layerIndex}`).selectAll("g.node-group").each((sd, si, sg) => {
    			d3.select(sg[si]).style("pointer-events", "all");
    		});

    		svg.select(`g#cnn-layer-group-${layerIndex - 1}`).selectAll("g.node-group").each((sd, si, sg) => {
    			// Recover the old events
    			d3.select(sg[si]).style("pointer-events", "all").on("mouseover", nodeMouseOverHandler).on("mouseleave", nodeMouseLeaveHandler).on("click", nodeClickHandler);
    		});

    		// Deselect the node
    		$$invalidate(5, selectedNode.layerName = "", selectedNode);

    		$$invalidate(5, selectedNode.index = -1, selectedNode);
    		$$invalidate(5, selectedNode.data = null, selectedNode);
    		actPoolDetailViewLayerIndex = -1;
    	};

    	const actPoolDetailViewPreNodeMouseOverHandler = (d, i, g) => {
    		// Highlight the edges
    		let layerIndex = layerIndexDict[d.layerName];

    		let nodeIndex = d.index;
    		let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");
    		edgeGroup.selectAll(`path.edge-${actPoolDetailViewLayerIndex}-${nodeIndex}`).raise().transition().ease(d3.easeCubicInOut).duration(400).style("stroke", edgeHoverColor).style("stroke-width", "1").style("opacity", 1);

    		// Highlight its border
    		d3.select(g[i]).select("rect.bounding").classed("hidden", false);

    		// Highlight node's pair
    		let associatedLayerIndex = layerIndex - 1;

    		if (layerIndex === actPoolDetailViewLayerIndex - 1) {
    			associatedLayerIndex = layerIndex + 1;
    		}

    		svg.select(`g#layer-${associatedLayerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", false);
    	};

    	const actPoolDetailViewPreNodeMouseLeaveHandler = (d, i, g) => {
    		// De-highlight the edges
    		let layerIndex = layerIndexDict[d.layerName];

    		let nodeIndex = d.index;
    		let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");
    		edgeGroup.selectAll(`path.edge-${actPoolDetailViewLayerIndex}-${nodeIndex}`).transition().ease(d3.easeCubicOut).duration(200).style("stroke", edgeInitColor).style("stroke-width", edgeStrokeWidth).style("opacity", edgeOpacity);

    		// De-highlight its border
    		d3.select(g[i]).select("rect.bounding").classed("hidden", true);

    		// De-highlight node's pair
    		let associatedLayerIndex = layerIndex - 1;

    		if (layerIndex === actPoolDetailViewLayerIndex - 1) {
    			associatedLayerIndex = layerIndex + 1;
    		}

    		svg.select(`g#layer-${associatedLayerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", true);
    	};

    	const actPoolDetailViewPreNodeClickHandler = (d, i, g) => {
    		let layerIndex = layerIndexDict[d.layerName];
    		let nodeIndex = d.index;

    		// Click the pre-layer node in detail view has the same effect as clicking
    		// the cur-layer node, which is to open a new detail view window
    		svg.select(`g#layer-${layerIndex + 1}-node-${nodeIndex}`).node().dispatchEvent(new Event("click"));
    	};

    	const enterDetailView = (curLayerIndex, i) => {
    		isInActPoolDetailView = true;
    		actPoolDetailViewNodeIndex = i;
    		actPoolDetailViewLayerIndex = curLayerIndex;

    		// Dynamically position the detail view
    		let wholeSvg = d3.select("#cnn-svg");

    		let svgYMid = +wholeSvg.style("height").replace("px", "") / 2;
    		let svgWidth = +wholeSvg.style("width").replace("px", "");
    		let detailViewTop = 100 + svgYMid - 260 / 2;
    		let posX = 0;

    		if (curLayerIndex > 5) {
    			posX = nodeCoordinate[curLayerIndex - 1][0].x + 50;
    			posX = posX / 2 - 500 / 2;
    		} else {
    			posX = (svgWidth - nodeCoordinate[curLayerIndex][0].x - nodeLength) / 2;
    			posX = nodeCoordinate[curLayerIndex][0].x + nodeLength + posX - 500 / 2;
    		}

    		const detailview = document.getElementById("detailview");
    		detailview.style.top = `${detailViewTop}px`;
    		detailview.style.left = `${posX}px`;
    		detailview.style.position = "absolute";

    		// Hide all edges
    		let unimportantEdges = svg.select("g.edge-group").selectAll(".edge").filter(d => {
    			return d.targetLayerIndex !== curLayerIndex;
    		}).style("visibility", "hidden");

    		// Disable UI
    		$$invalidate(6, disableControl = true);

    		// Hide input annotaitons
    		svg.select(".input-annotation").classed("hidden", true);

    		// Hide legends
    		svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", true);

    		svg.selectAll(".input-legend").classed("hidden", true);
    		svg.selectAll(".output-legend").classed("hidden", true);
    		svg.select(`#${layerLegendDict[curLayerIndex][selectedScaleLevel]}`).classed("hidden", false);

    		// Add overlay rects
    		let leftX = nodeCoordinate[curLayerIndex - 1][i].x;

    		// +5 to cover the detailed mode long label
    		let rightStart = nodeCoordinate[curLayerIndex][i].x + nodeLength + 5;

    		// Compute the left and right overlay rect width
    		let rightWidth = width - rightStart - overlayRectOffset / 2;

    		let leftWidth = leftX - nodeCoordinate[0][0].x;

    		// The overlay rects should be symmetric
    		if (rightWidth > leftWidth) {
    			let stops = [
    				{
    					offset: "0%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.85
    				},
    				{
    					offset: "50%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.9
    				},
    				{
    					offset: "100%",
    					color: "rgb(250, 250, 250)",
    					opacity: 1
    				}
    			];

    			addOverlayGradient("overlay-gradient-right", stops);
    			let leftEndOpacity = 0.85 + (0.95 - 0.85) * (leftWidth / rightWidth);

    			stops = [
    				{
    					offset: "0%",
    					color: "rgb(250, 250, 250)",
    					opacity: leftEndOpacity
    				},
    				{
    					offset: "100%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.85
    				}
    			];

    			addOverlayGradient("overlay-gradient-left", stops);
    		} else {
    			let stops = [
    				{
    					offset: "0%",
    					color: "rgb(250, 250, 250)",
    					opacity: 1
    				},
    				{
    					offset: "50%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.9
    				},
    				{
    					offset: "100%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.85
    				}
    			];

    			addOverlayGradient("overlay-gradient-left", stops);
    			let rightEndOpacity = 0.85 + (0.95 - 0.85) * (rightWidth / leftWidth);

    			stops = [
    				{
    					offset: "0%",
    					color: "rgb(250, 250, 250)",
    					opacity: 0.85
    				},
    				{
    					offset: "100%",
    					color: "rgb(250, 250, 250)",
    					opacity: rightEndOpacity
    				}
    			];

    			addOverlayGradient("overlay-gradient-right", stops);
    		}

    		addOverlayRect("overlay-gradient-right", rightStart + overlayRectOffset / 2 + 0.5, 0, rightWidth, height + svgPaddings.top);
    		addOverlayRect("overlay-gradient-left", nodeCoordinate[0][0].x - overlayRectOffset / 2, 0, leftWidth, height + svgPaddings.top);
    		svg.selectAll("rect.overlay").on("click", emptySpaceClicked);

    		// Add underneath rectangles
    		let underGroup = svg.select("g.underneath");

    		let padding = 7;

    		for (let n = 0; n < cnn[curLayerIndex - 1].length; n++) {
    			underGroup.append("rect").attr("class", "underneath-gateway").attr("id", `underneath-gateway-${n}`).attr("x", nodeCoordinate[curLayerIndex - 1][n].x - padding).attr("y", nodeCoordinate[curLayerIndex - 1][n].y - padding).attr("width", 2 * nodeLength + hSpaceAroundGap + 2 * padding).attr("height", nodeLength + 2 * padding).attr("rx", 10).style("fill", "rgba(160, 160, 160, 0.3)").style("opacity", 0);

    			// Update the event functions for these two layers
    			svg.select(`g#layer-${curLayerIndex - 1}-node-${n}`).style("pointer-events", "all").style("cursor", "pointer").on("mouseover", actPoolDetailViewPreNodeMouseOverHandler).on("mouseleave", actPoolDetailViewPreNodeMouseLeaveHandler).on("click", actPoolDetailViewPreNodeClickHandler);
    		}

    		underGroup.lower();

    		// Highlight the selcted pair
    		underGroup.select(`#underneath-gateway-${i}`).style("opacity", 1);
    	};

    	const quitIntermediateView = (curLayerIndex, g, i) => {
    		// If it is the softmax detail view, quit that view first
    		if (isInSoftmax) {
    			svg.select(".logit-layer").remove();
    			svg.select(".logit-layer-lower").remove();
    			svg.selectAll(".plus-symbol-clone").remove();

    			// Instead of removing the paths, we hide them, so it is faster to load in
    			// the future
    			svg.select(".underneath").selectAll(".logit-lower").style("opacity", 0);

    			softmaxDetailViewStore.set({ show: false, logits: [] });
    			allowsSoftmaxAnimationStore.set(false);
    		}

    		isInSoftmaxStore.set(false);
    		isInIntermediateView = false;

    		// Show the legend
    		svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", !detailedMode);

    		svg.selectAll(".input-legend").classed("hidden", !detailedMode);
    		svg.selectAll(".output-legend").classed("hidden", !detailedMode);

    		// Recover control panel UI
    		$$invalidate(6, disableControl = false);

    		// Recover the input layer node's event
    		for (let n = 0; n < cnn[curLayerIndex - 1].length; n++) {
    			svg.select(`g#layer-${curLayerIndex - 1}-node-${n}`).on("mouseover", nodeMouseOverHandler).on("mouseleave", nodeMouseLeaveHandler).on("click", nodeClickHandler);
    		}

    		// Clean up the underneath rects
    		svg.select("g.underneath").selectAll("rect").remove();

    		detailedViewNum = undefined;

    		// Highlight the previous layer and this node
    		svg.select(`g#cnn-layer-group-${curLayerIndex - 1}`).selectAll("rect.bounding").style("stroke-width", 1);

    		d3.select(g[i]).select("rect.bounding").style("stroke-width", 1);

    		// Highlight the labels
    		svg.selectAll(`g#layer-label-${curLayerIndex - 1},
      g#layer-detailed-label-${curLayerIndex - 1},
      g#layer-label-${curLayerIndex},
      g#layer-detailed-label-${curLayerIndex}`).style("font-weight", "normal");

    		// Also unclick the node
    		// Record the current clicked node
    		$$invalidate(5, selectedNode.layerName = "", selectedNode);

    		$$invalidate(5, selectedNode.index = -1, selectedNode);
    		$$invalidate(5, selectedNode.data = null, selectedNode);
    		$$invalidate(11, isExitedFromCollapse = true);

    		// Remove the intermediate layer
    		let intermediateLayer = svg.select("g.intermediate-layer");

    		// Kill the infinite animation loop
    		shouldIntermediateAnimateStore.set(false);

    		intermediateLayer.transition("remove").duration(500).ease(d3.easeCubicInOut).style("opacity", 0).on("end", (d, i, g) => {
    			d3.select(g[i]).remove();
    		});

    		// Remove the output node overlay mask
    		svg.selectAll(".overlay-group").remove();

    		// Remove the overlay rect
    		svg.selectAll("g.intermediate-layer-overlay, g.intermediate-layer-annotation").transition("remove").duration(500).ease(d3.easeCubicInOut).style("opacity", 0).on("end", (d, i, g) => {
    			svg.selectAll("g.intermediate-layer-overlay, g.intermediate-layer-annotation").remove();
    			svg.selectAll("defs.overlay-gradient").remove();
    		});

    		// Recover the layer if we have drdrawn it
    		if (needRedraw[0] !== undefined) {
    			let redrawRange = cnnLayerRanges[selectedScaleLevel][needRedraw[0]];

    			if (needRedraw[1] !== undefined) {
    				svg.select(`g#layer-${needRedraw[0]}-node-${needRedraw[1]}`).select("image.node-image").each((d, i, g) => drawOutput(d, i, g, redrawRange));
    			} else {
    				svg.select(`g#cnn-layer-group-${needRedraw[0]}`).selectAll("image.node-image").each((d, i, g) => drawOutput(d, i, g, redrawRange));
    			}
    		}

    		// Move all layers to their original place
    		for (let i = 0; i < numLayers; i++) {
    			moveLayerX({
    				layerIndex: i,
    				targetX: nodeCoordinate[i][0].x,
    				disable: false,
    				delay: 500,
    				opacity: 1
    			});
    		}

    		moveLayerX({
    			layerIndex: numLayers - 2,
    			targetX: nodeCoordinate[numLayers - 2][0].x,
    			opacity: 1,
    			disable: false,
    			delay: 500,
    			onEndFunc: () => {
    				// Show all edges on the last moving animation end
    				svg.select("g.edge-group").style("visibility", "visible");

    				// Recover the input annotation
    				svg.select(".input-annotation").classed("hidden", false);
    			}
    		});
    	};

    	const nodeClickHandler = (d, i, g) => {
    		d3.event.stopPropagation();
    		let nodeIndex = d.index;

    		// Record the current clicked node
    		$$invalidate(5, selectedNode.layerName = d.layerName, selectedNode);

    		$$invalidate(5, selectedNode.index = d.index, selectedNode);
    		$$invalidate(5, selectedNode.data = d, selectedNode);
    		$$invalidate(5, selectedNode.domI = i, selectedNode);
    		$$invalidate(5, selectedNode.domG = g, selectedNode);

    		// Record data for detailed view.
    		if (d.type === "conv" || d.type === "relu" || d.type === "pool") {
    			let data = [];

    			for (let j = 0; j < d.inputLinks.length; j++) {
    				data.push({
    					input: d.inputLinks[j].source.output,
    					kernel: d.inputLinks[j].weight,
    					output: d.inputLinks[j].dest.output
    				});
    			}

    			let curLayerIndex = layerIndexDict[d.layerName];
    			data.colorRange = cnnLayerRanges[selectedScaleLevel][curLayerIndex];
    			data.isInputInputLayer = curLayerIndex <= 1;
    			$$invalidate(8, nodeData = data);
    		}

    		let curLayerIndex = layerIndexDict[d.layerName];

    		if (d.type == "relu" || d.type == "pool") {
    			$$invalidate(10, isExitedFromDetailedView = false);

    			if (!isInActPoolDetailView) {
    				// Enter the act pool detail view
    				enterDetailView(curLayerIndex, d.index);
    			} else {
    				if (d.index === actPoolDetailViewNodeIndex) {
    					// Quit the act pool detail view
    					quitActPoolDetailView();
    				} else {
    					// Switch the detail view input to the new clicked pair
    					// Remove the previous selection effect
    					svg.select(`g#layer-${curLayerIndex}-node-${actPoolDetailViewNodeIndex}`).select("rect.bounding").classed("hidden", true);

    					svg.select(`g#layer-${curLayerIndex - 1}-node-${actPoolDetailViewNodeIndex}`).select("rect.bounding").classed("hidden", true);
    					let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");
    					edgeGroup.selectAll(`path.edge-${curLayerIndex}-${actPoolDetailViewNodeIndex}`).transition().ease(d3.easeCubicOut).duration(200).style("stroke", edgeInitColor).style("stroke-width", edgeStrokeWidth).style("opacity", edgeOpacity);
    					let underGroup = svg.select("g.underneath");
    					underGroup.select(`#underneath-gateway-${actPoolDetailViewNodeIndex}`).style("opacity", 0);

    					// Add selection effect on the new selected pair
    					svg.select(`g#layer-${curLayerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", false);

    					svg.select(`g#layer-${curLayerIndex - 1}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", false);
    					edgeGroup.selectAll(`path.edge-${curLayerIndex}-${nodeIndex}`).raise().transition().ease(d3.easeCubicInOut).duration(400).style("stroke", edgeHoverColor).style("stroke-width", "1").style("opacity", 1);
    					underGroup.select(`#underneath-gateway-${nodeIndex}`).style("opacity", 1);
    					actPoolDetailViewNodeIndex = nodeIndex;
    				}
    			}
    		}

    		// Enter the second view (layer-view) when user clicks a conv node
    		if ((d.type === "conv" || d.layerName === "output" || d.type === "fc") && !isInIntermediateView) {
    			prepareToEnterIntermediateView(d, g, nodeIndex, curLayerIndex);

    			if (d.layerName === "conv2d_8") {
    				drawConv1(curLayerIndex, d, nodeIndex, width, height, intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
    			} else if (d.layerName === "conv_1_2") {
    				drawConv2(curLayerIndex, d, nodeIndex, width, height, intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
    			} else if (d.layerName === "conv2d_9") {
    				drawConv3(curLayerIndex, d, nodeIndex, width, height, intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
    			} else if (d.layerName === "conv_2_2") {
    				drawConv4(curLayerIndex, d, nodeIndex, width, height, intermediateNodeMouseOverHandler, intermediateNodeMouseLeaveHandler, intermediateNodeClicked);
    			} else if (d.layerName === "dense_8") {
    				drawFlatten(curLayerIndex, d, nodeIndex, width, height);
    			} else if (d.layerName === "output") {
    				drawOutFlatten(curLayerIndex, d, nodeIndex, width, height);
    			}
    		} else // Quit the layerview
    		if ((d.type === "conv" || d.layerName === "output") && isInIntermediateView) {
    			quitIntermediateView(curLayerIndex, g, i);
    		}
    	};

    	const nodeMouseOverHandler = (d, i, g) => {
    		// if (isInIntermediateView || isInActPoolDetailView) { return; }
    		if (isInIntermediateView) {
    			return;
    		}

    		// Highlight the edges
    		let layerIndex = layerIndexDict[d.layerName];

    		let nodeIndex = d.index;
    		let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");
    		edgeGroup.selectAll(`path.edge-${layerIndex}-${nodeIndex}`).raise().transition().ease(d3.easeCubicInOut).duration(400).style("stroke", edgeHoverColor).style("stroke-width", "1").style("opacity", 1);

    		// Highlight its border
    		d3.select(g[i]).select("rect.bounding").classed("hidden", false);

    		d3.select(g[i]).select("circle.bounding").classed("hidden", false);

    		// Highlight source's border
    		if (d.inputLinks.length === 1) {
    			let link = d.inputLinks[0];
    			let layerIndex = layerIndexDict[link.source.layerName];
    			let nodeIndex = link.source.index;
    			svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", false);
    			svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("circle.bounding").classed("hidden", false);
    		} else {
    			svg.select(`g#cnn-layer-group-${layerIndex - 1}`).selectAll("g.node-group").selectAll("rect.bounding").classed("hidden", false);
    			svg.select(`g#cnn-layer-group-${layerIndex - 1}`).selectAll("g.node-group").selectAll("circle.bounding").classed("hidden", false);
    		}

    		// Highlight the output text
    		if (d.layerName === "output") {
    			d3.select(g[i]).select(".output-text").style("opacity", 0.8).style("text-decoration", "underline");
    		}
    	}; /* Use the following commented code if we have non-linear model
    d.inputLinks.forEach(link => {
      let layerIndex = layerIndexDict[link.source.layerName];
      let nodeIndex = link.source.index;
      svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`)
        .select('rect.bounding')
        .classed('hidden', false);
    });
    */

    	const nodeMouseLeaveHandler = (d, i, g) => {
    		// Screenshot
    		// return;
    		if (isInIntermediateView) {
    			return;
    		}

    		// Keep the highlight if user has clicked
    		if (isInActPoolDetailView || (d.layerName !== selectedNode.layerName || d.index !== selectedNode.index)) {
    			let layerIndex = layerIndexDict[d.layerName];
    			let nodeIndex = d.index;
    			let edgeGroup = svg.select("g.cnn-group").select("g.edge-group");
    			edgeGroup.selectAll(`path.edge-${layerIndex}-${nodeIndex}`).transition().ease(d3.easeCubicOut).duration(200).style("stroke", edgeInitColor).style("stroke-width", edgeStrokeWidth).style("opacity", edgeOpacity);
    			d3.select(g[i]).select("rect.bounding").classed("hidden", true);
    			d3.select(g[i]).select("circle.bounding").classed("hidden", true);

    			if (d.inputLinks.length === 1) {
    				let link = d.inputLinks[0];
    				let layerIndex = layerIndexDict[link.source.layerName];
    				let nodeIndex = link.source.index;
    				svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("rect.bounding").classed("hidden", true);
    				svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`).select("circle.bounding").classed("hidden", true);
    			} else {
    				svg.select(`g#cnn-layer-group-${layerIndex - 1}`).selectAll("g.node-group").selectAll("rect.bounding").classed("hidden", d => d.layerName !== selectedNode.layerName || d.index !== selectedNode.index);
    				svg.select(`g#cnn-layer-group-${layerIndex - 1}`).selectAll("g.node-group").selectAll("circle.bounding").classed("hidden", d => d.layerName !== selectedNode.layerName || d.index !== selectedNode.index);
    			}

    			// Dehighlight the output text
    			if (d.layerName === "output") {
    				d3.select(g[i]).select(".output-text").style("fill", "black").style("opacity", 0.5).style("text-decoration", "none");
    			}
    		} /* Use the following commented code if we have non-linear model
    d.inputLinks.forEach(link => {
      let layerIndex = layerIndexDict[link.source.layerName];
      let nodeIndex = link.source.index;
      svg.select(`g#layer-${layerIndex}-node-${nodeIndex}`)
        .select('rect.bounding')
        .classed('hidden', true);
    });
    */
    	};

    	let logits = [-4.28, 2.96, -0.38, 5.24, -7.56, -3.43, 8.63, 2.63, 6.3, 0.68];
    	let selectedI = 4;

    	onMount(async () => {
    		// Create SVG
    		wholeSvg = d3.select(overviewComponent).select("#cnn-svg");

    		svg = wholeSvg.append("g").attr("class", "main-svg").attr("transform", `translate(${svgPaddings.left}, 0)`);
    		svgStore.set(svg);
    		width = Number(wholeSvg.style("width").replace("px", "")) - svgPaddings.left - svgPaddings.right;
    		height = Number(wholeSvg.style("height").replace("px", "")) - svgPaddings.top - svgPaddings.bottom;
    		let cnnGroup = svg.append("g").attr("class", "cnn-group");
    		let underGroup = svg.append("g").attr("class", "underneath");
    		let svgYMid = +wholeSvg.style("height").replace("px", "") / 2;

    		detailedViewAbsCoords = {
    			1: [600, 100 + svgYMid - 220 / 2, 490, 290],
    			2: [500, 100 + svgYMid - 220 / 2, 490, 290],
    			3: [700, 100 + svgYMid - 220 / 2, 490, 290],
    			4: [600, 100 + svgYMid - 220 / 2, 490, 290],
    			5: [650, 100 + svgYMid - 220 / 2, 490, 290],
    			6: [850, 100 + svgYMid - 220 / 2, 490, 290],
    			7: [100, 100 + svgYMid - 220 / 2, 490, 290],
    			8: [60, 100 + svgYMid - 220 / 2, 490, 290],
    			9: [200, 100 + svgYMid - 220 / 2, 490, 290],
    			10: [300, 100 + svgYMid - 220 / 2, 490, 290]
    		};

    		// Define global arrow marker end
    		svg.append("defs").append("marker").attr("id", "marker").attr("viewBox", "0 -5 10 10").attr("refX", 6).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").style("stroke-width", 1.2).style("fill", "gray").style("stroke", "gray").attr("d", "M0,-5L10,0L0,5");

    		// Alternative arrow head style for non-interactive annotation
    		svg.append("defs").append("marker").attr("id", "marker-alt").attr("viewBox", "0 -5 10 10").attr("refX", 6).attr("refY", 0).attr("markerWidth", 6).attr("markerHeight", 6).attr("orient", "auto").append("path").style("fill", "none").style("stroke", "gray").style("stroke-width", 2).attr("d", "M-5,-10L10,0L-5,10");

    		console.time("Construct cnn");
    		model = await loadTrainedModel("/assets/data/model.json");
    		cnn = await constructCNN(`/assets/img/${selectedImage}`, model);
    		console.timeEnd("Construct cnn");

    		// Ignore the flatten layer for now
    		let flatten = cnn[cnn.length - 3];

    		cnn.splice(cnn.length - 3, 1);
    		cnn.flatten = flatten;
    		console.log(cnn);
    		cnnStore.set(cnn);
    		updateCNNLayerRanges();

    		// Create and draw the CNN view
    		drawCNN(width, height, cnnGroup, nodeMouseOverHandler, nodeMouseLeaveHandler, nodeClickHandler);
    	});

    	const detailedButtonClicked = () => {
    		$$invalidate(2, detailedMode = !detailedMode);
    		detailedModeStore.set(detailedMode);

    		if (!isInIntermediateView) {
    			// Show the legend
    			svg.selectAll(`.${selectedScaleLevel}-legend`).classed("hidden", !detailedMode);

    			svg.selectAll(".input-legend").classed("hidden", !detailedMode);
    			svg.selectAll(".output-legend").classed("hidden", !detailedMode);
    		}

    		// Switch the layer name
    		svg.selectAll(".layer-detailed-label").classed("hidden", !detailedMode);

    		svg.selectAll(".layer-label").classed("hidden", detailedMode);
    	};

    	const imageOptionClicked = async e => {
    		let newImageName = d3.select(e.target).attr("data-imageName");

    		if (newImageName !== selectedImage) {
    			$$invalidate(7, selectedImage = newImageName);

    			// Re-compute the CNN using the new input image
    			cnn = await constructCNN(`/assets/img/${selectedImage}`, model);

    			// Ignore the flatten layer for now
    			let flatten = cnn[cnn.length - 2];

    			cnn.splice(cnn.length - 2, 1);
    			cnn.flatten = flatten;
    			cnnStore.set(cnn);

    			// Update all scales used in the CNN view
    			updateCNNLayerRanges();

    			updateCNN();
    		}
    	};

    	const customImageClicked = () => {
    		// Case 1: there is no custom image -> show the modal to get user input
    		if (customImageURL === null) {
    			modalInfo.show = true;
    			modalInfo.preImage = selectedImage;
    			modalStore.set(modalInfo);
    		} else // Case 2: there is an existing custom image, not the focus -> switch to this image
    		if (selectedImage !== "custom") {
    			let fakeEvent = { detail: { url: customImageURL } };
    			handleCustomImage(fakeEvent);
    		} else // Case 3: there is an existing custom image, and its the focus -> let user
    		// upload a new image
    		{
    			modalInfo.show = true;
    			modalInfo.preImage = selectedImage;
    			modalStore.set(modalInfo);
    		}

    		if (selectedImage !== "custom") {
    			$$invalidate(7, selectedImage = "custom");
    		}
    	};

    	const handleModalCanceled = event => {
    		// User cancels the modal without a successful image, so we restore the
    		// previous selected image as input
    		$$invalidate(7, selectedImage = event.detail.preImage);
    	};

    	const handleCustomImage = async event => {
    		// User gives a valid image URL
    		$$invalidate(12, customImageURL = event.detail.url);

    		// Re-compute the CNN using the new input image
    		cnn = await constructCNN(customImageURL, model);

    		// Ignore the flatten layer for now
    		let flatten = cnn[cnn.length - 2];

    		cnn.splice(cnn.length - 2, 1);
    		cnn.flatten = flatten;
    		cnnStore.set(cnn);

    		// Update the UI
    		let customImageSlot = d3.select(overviewComponent).select(".custom-image").node();

    		drawCustomImage(customImageSlot, cnn[0]);

    		// Update all scales used in the CNN view
    		updateCNNLayerRanges();

    		updateCNN();
    	};

    	function handleExitFromDetiledConvView(event) {
    		if (event.detail.text) {
    			detailedViewNum = undefined;
    			svg.select(`rect#underneath-gateway-${selectedNodeIndex}`).style("opacity", 0);
    			$$invalidate(9, selectedNodeIndex = -1);
    		}
    	}

    	function handleExitFromDetiledPoolView(event) {
    		if (event.detail.text) {
    			quitActPoolDetailView();
    			$$invalidate(10, isExitedFromDetailedView = true);
    		}
    	}

    	function handleExitFromDetiledActivationView(event) {
    		if (event.detail.text) {
    			quitActPoolDetailView();
    			$$invalidate(10, isExitedFromDetailedView = true);
    		}
    	}

    	function handleExitFromDetiledSoftmaxView(event) {
    		$$invalidate(3, softmaxDetailViewInfo.show = false, softmaxDetailViewInfo);
    		softmaxDetailViewStore.set(softmaxDetailViewInfo);
    	}

    	const writable_props = [];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1$4.warn(`<Overview> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Overview", $$slots, []);

    	function select_change_handler() {
    		selectedScaleLevel = select_value(this);
    		$$invalidate(1, selectedScaleLevel);
    	}

    	function div7_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			overviewComponent = $$value;
    			$$invalidate(0, overviewComponent);
    		});
    	}

    	$$self.$capture_state = () => ({
    		onMount,
    		cnnStore,
    		svgStore,
    		vSpaceAroundGapStore,
    		hSpaceAroundGapStore,
    		nodeCoordinateStore,
    		selectedScaleLevelStore,
    		cnnLayerRangesStore,
    		needRedrawStore,
    		cnnLayerMinMaxStore,
    		detailedModeStore,
    		shouldIntermediateAnimateStore,
    		isInSoftmaxStore,
    		softmaxDetailViewStore,
    		hoverInfoStore,
    		allowsSoftmaxAnimationStore,
    		modalStore,
    		intermediateLayerPositionStore,
    		ConvolutionView: Convolutionview,
    		ActivationView: Activationview,
    		PoolView: Poolview,
    		SoftmaxView: Softmaxview,
    		Modal,
    		Article,
    		loadTrainedModel,
    		constructCNN,
    		overviewConfig,
    		addOverlayRect,
    		drawConv1,
    		drawConv2,
    		drawConv3,
    		drawConv4,
    		moveLayerX,
    		addOverlayGradient,
    		drawFlatten,
    		softmaxDetailViewMouseOverHandler,
    		softmaxDetailViewMouseLeaveHandler,
    		drawOutFlatten,
    		drawOutput,
    		drawCNN,
    		updateCNN,
    		updateCNNLayerRanges,
    		drawCustomImage,
    		overviewComponent,
    		scaleLevelSet,
    		selectedScaleLevel,
    		previousSelectedScaleLevel,
    		wholeSvg,
    		svg,
    		layerColorScales,
    		nodeLength,
    		plusSymbolRadius,
    		numLayers,
    		edgeOpacity,
    		edgeInitColor,
    		edgeHoverColor,
    		edgeHoverOuting,
    		edgeStrokeWidth,
    		intermediateColor,
    		kernelRectLength,
    		svgPaddings,
    		gapRatio,
    		overlayRectOffset,
    		classLists,
    		needRedraw,
    		nodeCoordinate,
    		cnnLayerRanges,
    		cnnLayerMinMax,
    		detailedMode,
    		shouldIntermediateAnimate,
    		vSpaceAroundGap,
    		hSpaceAroundGap,
    		isInSoftmax,
    		softmaxDetailViewInfo,
    		modalInfo,
    		hoverInfo,
    		intermediateLayerPosition,
    		width,
    		height,
    		model,
    		selectedNode,
    		isInIntermediateView,
    		isInActPoolDetailView,
    		actPoolDetailViewNodeIndex,
    		actPoolDetailViewLayerIndex,
    		detailedViewNum,
    		disableControl,
    		cnn,
    		detailedViewAbsCoords,
    		layerIndexDict1,
    		layerIndexDict,
    		layerLegendDict,
    		imageOptions,
    		selectedImage,
    		nodeData,
    		selectedNodeIndex,
    		isExitedFromDetailedView,
    		isExitedFromCollapse,
    		customImageURL,
    		selectedScaleLevelChanged,
    		intermediateNodeMouseOverHandler,
    		intermediateNodeMouseLeaveHandler,
    		intermediateNodeClicked,
    		emptySpaceClicked,
    		prepareToEnterIntermediateView,
    		quitActPoolDetailView,
    		actPoolDetailViewPreNodeMouseOverHandler,
    		actPoolDetailViewPreNodeMouseLeaveHandler,
    		actPoolDetailViewPreNodeClickHandler,
    		enterDetailView,
    		quitIntermediateView,
    		nodeClickHandler,
    		nodeMouseOverHandler,
    		nodeMouseLeaveHandler,
    		logits,
    		selectedI,
    		detailedButtonClicked,
    		imageOptionClicked,
    		customImageClicked,
    		handleModalCanceled,
    		handleCustomImage,
    		handleExitFromDetiledConvView,
    		handleExitFromDetiledPoolView,
    		handleExitFromDetiledActivationView,
    		handleExitFromDetiledSoftmaxView
    	});

    	$$self.$inject_state = $$props => {
    		if ("overviewComponent" in $$props) $$invalidate(0, overviewComponent = $$props.overviewComponent);
    		if ("scaleLevelSet" in $$props) scaleLevelSet = $$props.scaleLevelSet;
    		if ("selectedScaleLevel" in $$props) $$invalidate(1, selectedScaleLevel = $$props.selectedScaleLevel);
    		if ("previousSelectedScaleLevel" in $$props) previousSelectedScaleLevel = $$props.previousSelectedScaleLevel;
    		if ("wholeSvg" in $$props) wholeSvg = $$props.wholeSvg;
    		if ("svg" in $$props) svg = $$props.svg;
    		if ("needRedraw" in $$props) needRedraw = $$props.needRedraw;
    		if ("nodeCoordinate" in $$props) nodeCoordinate = $$props.nodeCoordinate;
    		if ("cnnLayerRanges" in $$props) cnnLayerRanges = $$props.cnnLayerRanges;
    		if ("cnnLayerMinMax" in $$props) cnnLayerMinMax = $$props.cnnLayerMinMax;
    		if ("detailedMode" in $$props) $$invalidate(2, detailedMode = $$props.detailedMode);
    		if ("shouldIntermediateAnimate" in $$props) shouldIntermediateAnimate = $$props.shouldIntermediateAnimate;
    		if ("vSpaceAroundGap" in $$props) vSpaceAroundGap = $$props.vSpaceAroundGap;
    		if ("hSpaceAroundGap" in $$props) hSpaceAroundGap = $$props.hSpaceAroundGap;
    		if ("isInSoftmax" in $$props) isInSoftmax = $$props.isInSoftmax;
    		if ("softmaxDetailViewInfo" in $$props) $$invalidate(3, softmaxDetailViewInfo = $$props.softmaxDetailViewInfo);
    		if ("modalInfo" in $$props) modalInfo = $$props.modalInfo;
    		if ("hoverInfo" in $$props) $$invalidate(4, hoverInfo = $$props.hoverInfo);
    		if ("intermediateLayerPosition" in $$props) intermediateLayerPosition = $$props.intermediateLayerPosition;
    		if ("width" in $$props) width = $$props.width;
    		if ("height" in $$props) height = $$props.height;
    		if ("model" in $$props) model = $$props.model;
    		if ("selectedNode" in $$props) $$invalidate(5, selectedNode = $$props.selectedNode);
    		if ("isInIntermediateView" in $$props) isInIntermediateView = $$props.isInIntermediateView;
    		if ("isInActPoolDetailView" in $$props) isInActPoolDetailView = $$props.isInActPoolDetailView;
    		if ("actPoolDetailViewNodeIndex" in $$props) actPoolDetailViewNodeIndex = $$props.actPoolDetailViewNodeIndex;
    		if ("actPoolDetailViewLayerIndex" in $$props) actPoolDetailViewLayerIndex = $$props.actPoolDetailViewLayerIndex;
    		if ("detailedViewNum" in $$props) detailedViewNum = $$props.detailedViewNum;
    		if ("disableControl" in $$props) $$invalidate(6, disableControl = $$props.disableControl);
    		if ("cnn" in $$props) cnn = $$props.cnn;
    		if ("detailedViewAbsCoords" in $$props) detailedViewAbsCoords = $$props.detailedViewAbsCoords;
    		if ("imageOptions" in $$props) $$invalidate(14, imageOptions = $$props.imageOptions);
    		if ("selectedImage" in $$props) $$invalidate(7, selectedImage = $$props.selectedImage);
    		if ("nodeData" in $$props) $$invalidate(8, nodeData = $$props.nodeData);
    		if ("selectedNodeIndex" in $$props) $$invalidate(9, selectedNodeIndex = $$props.selectedNodeIndex);
    		if ("isExitedFromDetailedView" in $$props) $$invalidate(10, isExitedFromDetailedView = $$props.isExitedFromDetailedView);
    		if ("isExitedFromCollapse" in $$props) $$invalidate(11, isExitedFromCollapse = $$props.isExitedFromCollapse);
    		if ("customImageURL" in $$props) $$invalidate(12, customImageURL = $$props.customImageURL);
    		if ("logits" in $$props) logits = $$props.logits;
    		if ("selectedI" in $$props) selectedI = $$props.selectedI;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*selectedScaleLevel*/ 2) {
    			 (selectedScaleLevelChanged());
    		}
    	};

    	return [
    		overviewComponent,
    		selectedScaleLevel,
    		detailedMode,
    		softmaxDetailViewInfo,
    		hoverInfo,
    		selectedNode,
    		disableControl,
    		selectedImage,
    		nodeData,
    		selectedNodeIndex,
    		isExitedFromDetailedView,
    		isExitedFromCollapse,
    		customImageURL,
    		layerColorScales,
    		imageOptions,
    		detailedButtonClicked,
    		imageOptionClicked,
    		customImageClicked,
    		handleModalCanceled,
    		handleCustomImage,
    		handleExitFromDetiledConvView,
    		handleExitFromDetiledPoolView,
    		handleExitFromDetiledActivationView,
    		handleExitFromDetiledSoftmaxView,
    		select_change_handler,
    		div7_binding
    	];
    }

    class Overview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {}, [-1, -1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Overview",
    			options,
    			id: create_fragment$h.name
    		});
    	}
    }

    /* src\views\Explainer.svelte generated by Svelte v3.23.1 */
    const file$h = "src\\views\\Explainer.svelte";

    function create_fragment$i(ctx) {
    	let div;
    	let current;
    	const overview = new Overview({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(overview.$$.fragment);
    			attr_dev(div, "id", "explainer");
    			attr_dev(div, "class", "svelte-132ryia");
    			add_location(div, file$h, 29, 0, 589);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(overview, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(overview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(overview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(overview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	const View = {
    		OVERVIEW: "overview",
    		LAYERVIEW: "layerview",
    		DETAILVIEW: "detailview"
    	};

    	let mainView = View.OVERVIEW;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Explainer> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Explainer", $$slots, []);
    	$$self.$capture_state = () => ({ Overview, cnnStore, View, mainView });

    	$$self.$inject_state = $$props => {
    		if ("mainView" in $$props) mainView = $$props.mainView;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [];
    }

    class Explainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Explainer",
    			options,
    			id: create_fragment$i.name
    		});
    	}
    }

    const routes = {
      '/': Home,
      '/cnn': Explainer
    };

    /* src\App.svelte generated by Svelte v3.23.1 */
    const file$i = "src\\App.svelte";

    function create_fragment$j(ctx) {
    	let div2;
    	let div0;
    	let a0;
    	let t1;
    	let ul;
    	let li0;
    	let a1;
    	let link_action;
    	let t3;
    	let li1;
    	let a2;
    	let t5;
    	let div1;
    	let current;
    	let mounted;
    	let dispose;
    	const router = new Router({ props: { routes }, $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "Home";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "CNN";
    			t3 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "RNN";
    			t5 = space();
    			div1 = element("div");
    			create_component(router.$$.fragment);
    			attr_dev(a0, "href", "/");
    			attr_dev(a0, "class", "home_icon svelte-u2nbhu");
    			attr_dev(a0, "rel", "prefetch");
    			add_location(a0, file$i, 50, 4, 1054);
    			attr_dev(a1, "href", "/cnn");
    			attr_dev(a1, "rel", "prefetch");
    			attr_dev(a1, "class", "svelte-u2nbhu");
    			add_location(a1, file$i, 53, 8, 1155);
    			add_location(li0, file$i, 52, 6, 1141);
    			attr_dev(a2, "href", "blog");
    			attr_dev(a2, "class", "svelte-u2nbhu");
    			add_location(a2, file$i, 56, 8, 1236);
    			add_location(li1, file$i, 55, 6, 1222);
    			attr_dev(ul, "class", "menu_ul svelte-u2nbhu");
    			add_location(ul, file$i, 51, 4, 1113);
    			attr_dev(div0, "class", "page_header svelte-u2nbhu");
    			add_location(div0, file$i, 49, 2, 1023);
    			attr_dev(div1, "class", "content svelte-u2nbhu");
    			add_location(div1, file$i, 61, 2, 1298);
    			attr_dev(div2, "id", "app-page");
    			attr_dev(div2, "class", "svelte-u2nbhu");
    			add_location(div2, file$i, 48, 0, 1000);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div0, a0);
    			append_dev(div0, t1);
    			append_dev(div0, ul);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			mount_component(router, div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = action_destroyer(link_action = link.call(null, a1));
    				mounted = true;
    			}
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(router);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);
    	$$self.$capture_state = () => ({ Router, link, routes });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$j.name
    		});
    	}
    }

    const app = new App({
      target: document.body,
      props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
