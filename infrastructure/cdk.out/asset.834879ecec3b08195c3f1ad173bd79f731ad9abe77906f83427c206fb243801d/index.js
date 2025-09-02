"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../backend/node_modules/lodash.merge/index.js
var require_lodash = __commonJS({
  "../backend/node_modules/lodash.merge/index.js"(exports2, module2) {
    var LARGE_ARRAY_SIZE = 200;
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var HOT_COUNT = 800;
    var HOT_SPAN = 16;
    var MAX_SAFE_INTEGER = 9007199254740991;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var asyncTag = "[object AsyncFunction]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var genTag = "[object GeneratorFunction]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var nullTag = "[object Null]";
    var objectTag = "[object Object]";
    var proxyTag = "[object Proxy]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var undefinedTag = "[object Undefined]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root = freeGlobal || freeSelf || Function("return this")();
    var freeExports = typeof exports2 == "object" && exports2 && !exports2.nodeType && exports2;
    var freeModule = freeExports && typeof module2 == "object" && module2 && !module2.nodeType && module2;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = (function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    })();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function getValue(object, key) {
      return object == null ? void 0 : object[key];
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    var arrayProto = Array.prototype;
    var funcProto = Function.prototype;
    var objectProto = Object.prototype;
    var coreJsData = root["__core-js_shared__"];
    var funcToString = funcProto.toString;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var maskSrcKey = (function() {
      var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
      return uid ? "Symbol(src)_1." + uid : "";
    })();
    var nativeObjectToString = objectProto.toString;
    var objectCtorString = funcToString.call(Object);
    var reIsNative = RegExp(
      "^" + funcToString.call(hasOwnProperty).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"
    );
    var Buffer2 = moduleExports ? root.Buffer : void 0;
    var Symbol2 = root.Symbol;
    var Uint8Array2 = root.Uint8Array;
    var allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : void 0;
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    var objectCreate = Object.create;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var splice = arrayProto.splice;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    var defineProperty = (function() {
      try {
        var func = getNative(Object, "defineProperty");
        func({}, "", {});
        return func;
      } catch (e) {
      }
    })();
    var nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : void 0;
    var nativeMax = Math.max;
    var nativeNow = Date.now;
    var Map2 = getNative(root, "Map");
    var nativeCreate = getNative(Object, "create");
    var baseCreate = /* @__PURE__ */ (function() {
      function object() {
      }
      return function(proto) {
        if (!isObject(proto)) {
          return {};
        }
        if (objectCreate) {
          return objectCreate(proto);
        }
        object.prototype = proto;
        var result = new object();
        object.prototype = void 0;
        return result;
      };
    })();
    function Hash(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function hashClear() {
      this.__data__ = nativeCreate ? nativeCreate(null) : {};
      this.size = 0;
    }
    function hashDelete(key) {
      var result = this.has(key) && delete this.__data__[key];
      this.size -= result ? 1 : 0;
      return result;
    }
    function hashGet(key) {
      var data = this.__data__;
      if (nativeCreate) {
        var result = data[key];
        return result === HASH_UNDEFINED ? void 0 : result;
      }
      return hasOwnProperty.call(data, key) ? data[key] : void 0;
    }
    function hashHas(key) {
      var data = this.__data__;
      return nativeCreate ? data[key] !== void 0 : hasOwnProperty.call(data, key);
    }
    function hashSet(key, value) {
      var data = this.__data__;
      this.size += this.has(key) ? 0 : 1;
      data[key] = nativeCreate && value === void 0 ? HASH_UNDEFINED : value;
      return this;
    }
    Hash.prototype.clear = hashClear;
    Hash.prototype["delete"] = hashDelete;
    Hash.prototype.get = hashGet;
    Hash.prototype.has = hashHas;
    Hash.prototype.set = hashSet;
    function ListCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function listCacheClear() {
      this.__data__ = [];
      this.size = 0;
    }
    function listCacheDelete(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        return false;
      }
      var lastIndex = data.length - 1;
      if (index == lastIndex) {
        data.pop();
      } else {
        splice.call(data, index, 1);
      }
      --this.size;
      return true;
    }
    function listCacheGet(key) {
      var data = this.__data__, index = assocIndexOf(data, key);
      return index < 0 ? void 0 : data[index][1];
    }
    function listCacheHas(key) {
      return assocIndexOf(this.__data__, key) > -1;
    }
    function listCacheSet(key, value) {
      var data = this.__data__, index = assocIndexOf(data, key);
      if (index < 0) {
        ++this.size;
        data.push([key, value]);
      } else {
        data[index][1] = value;
      }
      return this;
    }
    ListCache.prototype.clear = listCacheClear;
    ListCache.prototype["delete"] = listCacheDelete;
    ListCache.prototype.get = listCacheGet;
    ListCache.prototype.has = listCacheHas;
    ListCache.prototype.set = listCacheSet;
    function MapCache(entries) {
      var index = -1, length = entries == null ? 0 : entries.length;
      this.clear();
      while (++index < length) {
        var entry = entries[index];
        this.set(entry[0], entry[1]);
      }
    }
    function mapCacheClear() {
      this.size = 0;
      this.__data__ = {
        "hash": new Hash(),
        "map": new (Map2 || ListCache)(),
        "string": new Hash()
      };
    }
    function mapCacheDelete(key) {
      var result = getMapData(this, key)["delete"](key);
      this.size -= result ? 1 : 0;
      return result;
    }
    function mapCacheGet(key) {
      return getMapData(this, key).get(key);
    }
    function mapCacheHas(key) {
      return getMapData(this, key).has(key);
    }
    function mapCacheSet(key, value) {
      var data = getMapData(this, key), size = data.size;
      data.set(key, value);
      this.size += data.size == size ? 0 : 1;
      return this;
    }
    MapCache.prototype.clear = mapCacheClear;
    MapCache.prototype["delete"] = mapCacheDelete;
    MapCache.prototype.get = mapCacheGet;
    MapCache.prototype.has = mapCacheHas;
    MapCache.prototype.set = mapCacheSet;
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    function stackGet(key) {
      return this.__data__.get(key);
    }
    function stackHas(key) {
      return this.__data__.has(key);
    }
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map2 || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    function assignMergeValue(object, key, value) {
      if (value !== void 0 && !eq(object[key], value) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    function assignValue(object, key, value) {
      var objValue = object[key];
      if (!(hasOwnProperty.call(object, key) && eq(objValue, value)) || value === void 0 && !(key in object)) {
        baseAssignValue(object, key, value);
      }
    }
    function assocIndexOf(array, key) {
      var length = array.length;
      while (length--) {
        if (eq(array[length][0], key)) {
          return length;
        }
      }
      return -1;
    }
    function baseAssignValue(object, key, value) {
      if (key == "__proto__" && defineProperty) {
        defineProperty(object, key, {
          "configurable": true,
          "enumerable": true,
          "value": value,
          "writable": true
        });
      } else {
        object[key] = value;
      }
    }
    var baseFor = createBaseFor();
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    function baseIsNative(value) {
      if (!isObject(value) || isMasked(value)) {
        return false;
      }
      var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
      return pattern.test(toSource(value));
    }
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object), result = [];
      for (var key in object) {
        if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
    function baseMerge(object, source, srcIndex, customizer, stack) {
      if (object === source) {
        return;
      }
      baseFor(source, function(srcValue, key) {
        stack || (stack = new Stack());
        if (isObject(srcValue)) {
          baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
        } else {
          var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : void 0;
          if (newValue === void 0) {
            newValue = srcValue;
          }
          assignMergeValue(object, key, newValue);
        }
      }, keysIn);
    }
    function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
      var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
      if (stacked) {
        assignMergeValue(object, key, stacked);
        return;
      }
      var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : void 0;
      var isCommon = newValue === void 0;
      if (isCommon) {
        var isArr = isArray(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
        newValue = srcValue;
        if (isArr || isBuff || isTyped) {
          if (isArray(objValue)) {
            newValue = objValue;
          } else if (isArrayLikeObject(objValue)) {
            newValue = copyArray(objValue);
          } else if (isBuff) {
            isCommon = false;
            newValue = cloneBuffer(srcValue, true);
          } else if (isTyped) {
            isCommon = false;
            newValue = cloneTypedArray(srcValue, true);
          } else {
            newValue = [];
          }
        } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
          newValue = objValue;
          if (isArguments(objValue)) {
            newValue = toPlainObject(objValue);
          } else if (!isObject(objValue) || isFunction(objValue)) {
            newValue = initCloneObject(srcValue);
          }
        } else {
          isCommon = false;
        }
      }
      if (isCommon) {
        stack.set(srcValue, newValue);
        mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
        stack["delete"](srcValue);
      }
      assignMergeValue(object, key, newValue);
    }
    function baseRest(func, start) {
      return setToString(overRest(func, start, identity), func + "");
    }
    var baseSetToString = !defineProperty ? identity : function(func, string) {
      return defineProperty(func, "toString", {
        "configurable": true,
        "enumerable": false,
        "value": constant(string),
        "writable": true
      });
    };
    function cloneBuffer(buffer, isDeep) {
      if (isDeep) {
        return buffer.slice();
      }
      var length = buffer.length, result = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
      buffer.copy(result);
      return result;
    }
    function cloneArrayBuffer(arrayBuffer) {
      var result = new arrayBuffer.constructor(arrayBuffer.byteLength);
      new Uint8Array2(result).set(new Uint8Array2(arrayBuffer));
      return result;
    }
    function cloneTypedArray(typedArray, isDeep) {
      var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
      return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
    }
    function copyArray(source, array) {
      var index = -1, length = source.length;
      array || (array = Array(length));
      while (++index < length) {
        array[index] = source[index];
      }
      return array;
    }
    function copyObject(source, props, object, customizer) {
      var isNew = !object;
      object || (object = {});
      var index = -1, length = props.length;
      while (++index < length) {
        var key = props[index];
        var newValue = customizer ? customizer(object[key], source[key], key, object, source) : void 0;
        if (newValue === void 0) {
          newValue = source[key];
        }
        if (isNew) {
          baseAssignValue(object, key, newValue);
        } else {
          assignValue(object, key, newValue);
        }
      }
      return object;
    }
    function createAssigner(assigner) {
      return baseRest(function(object, sources) {
        var index = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : void 0, guard = length > 2 ? sources[2] : void 0;
        customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : void 0;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          customizer = length < 3 ? void 0 : customizer;
          length = 1;
        }
        object = Object(object);
        while (++index < length) {
          var source = sources[index];
          if (source) {
            assigner(object, source, index, customizer);
          }
        }
        return object;
      });
    }
    function createBaseFor(fromRight) {
      return function(object, iteratee, keysFunc) {
        var index = -1, iterable = Object(object), props = keysFunc(object), length = props.length;
        while (length--) {
          var key = props[fromRight ? length : ++index];
          if (iteratee(iterable[key], key, iterable) === false) {
            break;
          }
        }
        return object;
      };
    }
    function getMapData(map, key) {
      var data = map.__data__;
      return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
    }
    function getNative(object, key) {
      var value = getValue(object, key);
      return baseIsNative(value) ? value : void 0;
    }
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    function initCloneObject(object) {
      return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
    }
    function isIndex(value, length) {
      var type = typeof value;
      length = length == null ? MAX_SAFE_INTEGER : length;
      return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
    }
    function isIterateeCall(value, index, object) {
      if (!isObject(object)) {
        return false;
      }
      var type = typeof index;
      if (type == "number" ? isArrayLike(object) && isIndex(index, object.length) : type == "string" && index in object) {
        return eq(object[index], value);
      }
      return false;
    }
    function isKeyable(value) {
      var type = typeof value;
      return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
    }
    function isMasked(func) {
      return !!maskSrcKey && maskSrcKey in func;
    }
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    function overRest(func, start, transform) {
      start = nativeMax(start === void 0 ? func.length - 1 : start, 0);
      return function() {
        var args = arguments, index = -1, length = nativeMax(args.length - start, 0), array = Array(length);
        while (++index < length) {
          array[index] = args[start + index];
        }
        index = -1;
        var otherArgs = Array(start + 1);
        while (++index < start) {
          otherArgs[index] = args[index];
        }
        otherArgs[start] = transform(array);
        return apply(func, this, otherArgs);
      };
    }
    function safeGet(object, key) {
      if (key === "constructor" && typeof object[key] === "function") {
        return;
      }
      if (key == "__proto__") {
        return;
      }
      return object[key];
    }
    var setToString = shortOut(baseSetToString);
    function shortOut(func) {
      var count = 0, lastCalled = 0;
      return function() {
        var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
        lastCalled = stamp;
        if (remaining > 0) {
          if (++count >= HOT_COUNT) {
            return arguments[0];
          }
        } else {
          count = 0;
        }
        return func.apply(void 0, arguments);
      };
    }
    function toSource(func) {
      if (func != null) {
        try {
          return funcToString.call(func);
        } catch (e) {
        }
        try {
          return func + "";
        } catch (e) {
        }
      }
      return "";
    }
    function eq(value, other) {
      return value === other || value !== value && other !== other;
    }
    var isArguments = baseIsArguments(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    var isArray = Array.isArray;
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    function isArrayLikeObject(value) {
      return isObjectLike(value) && isArrayLike(value);
    }
    var isBuffer = nativeIsBuffer || stubFalse;
    function isFunction(value) {
      if (!isObject(value)) {
        return false;
      }
      var tag = baseGetTag(value);
      return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
    }
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    function isObject(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    function isPlainObject(value) {
      if (!isObjectLike(value) || baseGetTag(value) != objectTag) {
        return false;
      }
      var proto = getPrototype(value);
      if (proto === null) {
        return true;
      }
      var Ctor = hasOwnProperty.call(proto, "constructor") && proto.constructor;
      return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
    }
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    function toPlainObject(value) {
      return copyObject(value, keysIn(value));
    }
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }
    var merge3 = createAssigner(function(object, source, srcIndex) {
      baseMerge(object, source, srcIndex);
    });
    function constant(value) {
      return function() {
        return value;
      };
    }
    function identity(value) {
      return value;
    }
    function stubFalse() {
      return false;
    }
    module2.exports = merge3;
  }
});

// ../backend/src/handlers/contacts/lookup.handler.ts
var lookup_handler_exports = {};
__export(lookup_handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(lookup_handler_exports);

// ../backend/src/shared/http.ts
var json = (statusCode, body) => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body)
});
var parse = (s) => {
  if (!s) return {};
  try {
    return JSON.parse(s);
  } catch {
    return {};
  }
};

// ../backend/node_modules/@aws-lambda-powertools/logger/lib/esm/constants.js
var LogJsonIndent = {
  PRETTY: 4,
  COMPACT: 0
};
var LogLevel = {
  TRACE: "TRACE",
  DEBUG: "DEBUG",
  INFO: "INFO",
  WARN: "WARN",
  ERROR: "ERROR",
  SILENT: "SILENT",
  CRITICAL: "CRITICAL"
};
var LogLevelThreshold = {
  TRACE: 6,
  DEBUG: 8,
  INFO: 12,
  WARN: 16,
  ERROR: 20,
  CRITICAL: 24,
  SILENT: 28
};
var ReservedKeys = [
  "level",
  "message",
  "sampling_rate",
  "service",
  "timestamp"
];
var UncaughtErrorLogMessage = "Uncaught error detected, flushing log buffer before exit";

// ../backend/node_modules/@aws-lambda-powertools/commons/lib/esm/constants.js
var POWERTOOLS_DEV_ENV_VAR = "POWERTOOLS_DEV";
var XRAY_TRACE_ID_ENV_VAR = "_X_AMZN_TRACE_ID";

// ../backend/node_modules/@aws-lambda-powertools/commons/lib/esm/envUtils.js
var getStringFromEnv = ({ key, defaultValue, errorMessage }) => {
  const value = process.env[key];
  if (value === void 0) {
    if (defaultValue !== void 0) {
      return defaultValue;
    }
    if (errorMessage) {
      throw new Error(errorMessage);
    }
    throw new Error(`Environment variable ${key} is required`);
  }
  return value.trim();
};
var getNumberFromEnv = ({ key, defaultValue, errorMessage }) => {
  const value = getStringFromEnv({
    key,
    defaultValue: String(defaultValue),
    errorMessage
  });
  const parsedValue = Number(value);
  if (Number.isNaN(parsedValue)) {
    throw new Error(`Environment variable ${key} must be a number`);
  }
  return parsedValue;
};
var truthyValues = /* @__PURE__ */ new Set(["1", "y", "yes", "t", "true", "on"]);
var falsyValues = /* @__PURE__ */ new Set(["0", "n", "no", "f", "false", "off"]);
var getBooleanFromEnv = ({ key, defaultValue, errorMessage, extendedParsing }) => {
  const value = getStringFromEnv({
    key,
    defaultValue: String(defaultValue),
    errorMessage
  });
  const parsedValue = value.toLowerCase();
  if (extendedParsing) {
    if (truthyValues.has(parsedValue)) {
      return true;
    }
    if (falsyValues.has(parsedValue)) {
      return false;
    }
  }
  if (parsedValue !== "true" && parsedValue !== "false") {
    throw new Error(`Environment variable ${key} must be a boolean`);
  }
  return parsedValue === "true";
};
var isDevMode = () => {
  try {
    return getBooleanFromEnv({
      key: POWERTOOLS_DEV_ENV_VAR,
      extendedParsing: true
    });
  } catch {
    return false;
  }
};
var getXrayTraceDataFromEnv = () => {
  const xRayTraceEnv = getStringFromEnv({
    key: XRAY_TRACE_ID_ENV_VAR,
    defaultValue: ""
  });
  if (xRayTraceEnv === "") {
    return void 0;
  }
  if (!xRayTraceEnv.includes("=")) {
    return {
      Root: xRayTraceEnv
    };
  }
  const xRayTraceData = {};
  for (const field of xRayTraceEnv.split(";")) {
    const [key, value] = field.split("=");
    xRayTraceData[key] = value;
  }
  return xRayTraceData;
};
var getXRayTraceIdFromEnv = () => {
  const xRayTraceData = getXrayTraceDataFromEnv();
  return xRayTraceData?.Root;
};

// ../backend/node_modules/@aws-lambda-powertools/logger/lib/esm/formatter/LogFormatter.js
var LogFormatter = class {
  /**
   * Format an error into a loggable object.
   *
   * @example
   * ```json
   * {
   *   "name": "Error",
   *   "location": "file.js:1",
   *   "message": "An error occurred",
   *   "stack": "Error: An error occurred\n    at file.js:1\n    at file.js:2\n    at file.js:3",
   *   "cause": {
   *     "name": "OtherError",
   *     "location": "file.js:2",
   *     "message": "Another error occurred",
   *     "stack": "Error: Another error occurred\n    at file.js:2\n    at file.js:3\n    at file.js:4"
   *   }
   * }
   * ```
   *
   * @param error - Error to format
   */
  formatError(error) {
    const { name, message, stack, cause, ...errorAttributes } = error;
    const formattedError = {
      name,
      location: this.getCodeLocation(error.stack),
      message,
      stack: isDevMode() && typeof stack === "string" ? stack?.split("\n") : stack,
      cause: cause instanceof Error ? this.formatError(cause) : cause
    };
    for (const key in error) {
      if (typeof key === "string" && !["name", "message", "stack", "cause"].includes(key)) {
        formattedError[key] = errorAttributes[key];
      }
    }
    return formattedError;
  }
  /**
   * Format a date into an ISO 8601 string with the configured timezone.
   *
   * The timezone is read from the `TZ` environment variable, if present.
   * Otherwise, the timezone defaults to ':UTC'.
   *
   * @param now - The date to format
   */
  formatTimestamp(now) {
    const defaultTimezone = "UTC";
    const configuredTimezone = getStringFromEnv({
      key: "TZ",
      defaultValue: ""
    });
    if (configuredTimezone && !configuredTimezone.includes(defaultTimezone))
      return this.#generateISOTimestampWithOffset(now, configuredTimezone);
    return now.toISOString();
  }
  /**
   * Get the location of an error from a stack trace.
   *
   * @param stack - stack trace to parse
   */
  getCodeLocation(stack) {
    if (!stack) {
      return "";
    }
    const stackLines = stack.split("\n");
    const regex = /\(([^)]*?):(\d+?):(\d+?)\)\\?$/;
    for (const item of stackLines) {
      const match = regex.exec(item);
      if (Array.isArray(match)) {
        return `${match[1]}:${Number(match[2])}`;
      }
    }
    return "";
  }
  /**
   * Create a new Intl.DateTimeFormat object configured with the specified time zone
   * and formatting options.
   *
   * The time is displayed in 24-hour format (hour12: false).
   *
   * @param timezone - IANA time zone identifier (e.g., "Asia/Dhaka").
   */
  #getDateFormatter = (timezone) => {
    const twoDigitFormatOption = "2-digit";
    const validTimeZone = Intl.supportedValuesOf("timeZone").includes(timezone) ? timezone : "UTC";
    return new Intl.DateTimeFormat("en", {
      hourCycle: "h23",
      year: "numeric",
      month: twoDigitFormatOption,
      day: twoDigitFormatOption,
      hour: twoDigitFormatOption,
      minute: twoDigitFormatOption,
      second: twoDigitFormatOption,
      timeZone: validTimeZone
    });
  };
  /**
   * Generate an ISO 8601 timestamp string with the specified time zone and the local time zone offset.
   *
   * @param date - date to format
   * @param timezone - IANA time zone identifier (e.g., "Asia/Dhaka").
   */
  #generateISOTimestampWithOffset(date, timezone) {
    const { year, month, day, hour, minute, second } = this.#getDateFormatter(timezone).formatToParts(date).reduce((acc, item) => {
      acc[item.type] = item.value;
      return acc;
    }, {});
    const datePart = `${year}-${month}-${day}T${hour}:${minute}:${second}`;
    const offset = -date.getTimezoneOffset();
    const offsetSign = offset >= 0 ? "+" : "-";
    const offsetHours = Math.abs(Math.floor(offset / 60)).toString().padStart(2, "0");
    const offsetMinutes = Math.abs(offset % 60).toString().padStart(2, "0");
    const millisecondPart = date.getMilliseconds().toString().padStart(3, "0");
    const offsetPart = `${offsetSign}${offsetHours}:${offsetMinutes}`;
    return `${datePart}.${millisecondPart}${offsetPart}`;
  }
};

// ../backend/node_modules/@aws-lambda-powertools/logger/lib/esm/formatter/LogItem.js
var import_lodash = __toESM(require_lodash(), 1);
var LogItem = class {
  /**
   * The attributes of the log item.
   */
  attributes = {};
  /**
   * Constructor for LogItem.
   *
   * Attributes are added in the following order:
   * - Standard keys provided by the logger (e.g. `message`, `level`, `timestamp`)
   * - Persistent attributes provided by developer, not formatted (done later)
   * - Ephemeral attributes provided as parameters for a single log item (done later)
   *
   * @param params - The parameters for the LogItem.
   */
  constructor(params) {
    this.setAttributes(params.attributes);
  }
  /**
   * Add attributes to the log item.
   *
   * @param attributes - The attributes to add to the log item.
   */
  addAttributes(attributes) {
    (0, import_lodash.default)(this.attributes, attributes);
    return this;
  }
  /**
   * Get the attributes of the log item.
   */
  getAttributes() {
    return this.attributes;
  }
  /**
   * Prepare the log item for printing.
   *
   * This operation removes empty keys from the log item, see {@link removeEmptyKeys | removeEmptyKeys()} for more information.
   */
  prepareForPrint() {
    this.attributes = this.removeEmptyKeys(this.getAttributes());
  }
  /**
   * Remove empty keys from the log item, where empty keys are defined as keys with
   * values of `undefined`, empty strings (`''`), or `null`.
   *
   * @param attributes - The attributes to remove empty keys from.
   */
  removeEmptyKeys(attributes) {
    const newAttributes = {};
    for (const key in attributes) {
      if (attributes[key] !== void 0 && attributes[key] !== "" && attributes[key] !== null) {
        newAttributes[key] = attributes[key];
      }
    }
    return newAttributes;
  }
  /**
   * Replace the attributes of the log item.
   *
   * @param attributes - The attributes to set for the log item.
   */
  setAttributes(attributes) {
    this.attributes = attributes;
  }
};

// ../backend/node_modules/@aws-lambda-powertools/logger/lib/esm/Logger.js
var import_node_console = require("node:console");
var import_node_crypto = require("node:crypto");

// ../backend/node_modules/@aws-lambda-powertools/commons/lib/esm/version.js
var PT_VERSION = "2.25.2";

// ../backend/node_modules/@aws-lambda-powertools/commons/lib/esm/awsSdkUtils.js
var EXEC_ENV = process.env.AWS_EXECUTION_ENV || "NA";

// ../backend/node_modules/@aws-lambda-powertools/commons/lib/esm/middleware/constants.js
var PREFIX = "powertools-for-aws";
var TRACER_KEY = `${PREFIX}.tracer`;
var METRICS_KEY = `${PREFIX}.metrics`;
var LOGGER_KEY = `${PREFIX}.logger`;
var IDEMPOTENCY_KEY = `${PREFIX}.idempotency`;

// ../backend/node_modules/@aws-lambda-powertools/commons/lib/esm/typeUtils.js
var isString = (value) => {
  return typeof value === "string";
};
var isNull = (value) => {
  return Object.is(value, null);
};
var isNullOrUndefined = (value) => {
  return isNull(value) || Object.is(value, void 0);
};

// ../backend/node_modules/@aws-lambda-powertools/commons/lib/esm/Utility.js
var Utility = class {
  #initializationType;
  coldStart = true;
  defaultServiceName = "service_undefined";
  constructor() {
    this.#initializationType = this.getInitializationType();
    if (this.#initializationType !== "on-demand") {
      this.coldStart = false;
    }
  }
  /**
   * Get the value of the `AWS_LAMBDA_INITIALIZATION_TYPE` environment variable.
   */
  getInitializationType() {
    const envVarValue = process.env.AWS_LAMBDA_INITIALIZATION_TYPE?.trim();
    if (envVarValue === "on-demand") {
      return "on-demand";
    }
    if (envVarValue === "provisioned-concurrency") {
      return "provisioned-concurrency";
    }
    return "unknown";
  }
  /**
   * Get the cold start status of the current execution environment.
   *
   * The method also flips the cold start status to `false` after the first invocation.
   */
  getColdStart() {
    if (this.#initializationType !== "on-demand") {
      return false;
    }
    if (this.coldStart) {
      this.coldStart = false;
      return true;
    }
    return false;
  }
  /**
   * Validate that the service name provided is valid.
   * Used internally during initialization.
   *
   * @param serviceName Service name to validate
   */
  isValidServiceName(serviceName) {
    return typeof serviceName === "string" && serviceName.trim().length > 0;
  }
};

// ../backend/node_modules/@aws-lambda-powertools/commons/lib/esm/index.js
if (!process.env.AWS_SDK_UA_APP_ID) {
  process.env.AWS_SDK_UA_APP_ID = `PT/TEST/${PT_VERSION}`;
} else {
  process.env.AWS_SDK_UA_APP_ID = `${process.env.AWS_SDK_UA_APP_ID}/PT/TEST/${PT_VERSION}`;
}

// ../backend/node_modules/@aws-lambda-powertools/logger/lib/esm/Logger.js
var import_lodash2 = __toESM(require_lodash(), 1);

// ../backend/node_modules/@aws-lambda-powertools/logger/lib/esm/formatter/PowertoolsLogFormatter.js
var PowertoolsLogFormatter = class extends LogFormatter {
  /**
   * List of keys to order log attributes by.
   *
   * This can be a set of keys or an array of keys.
   */
  #logRecordOrder;
  constructor(options) {
    super();
    this.#logRecordOrder = options?.logRecordOrder;
  }
  /**
   * It formats key-value pairs of log attributes.
   *
   * @param {UnformattedAttributes} attributes - unformatted attributes
   * @param {LogAttributes} additionalLogAttributes - additional log attributes
   */
  formatAttributes(attributes, additionalLogAttributes) {
    const baseAttributes = {
      level: attributes.logLevel,
      message: attributes.message,
      timestamp: this.formatTimestamp(attributes.timestamp),
      service: attributes.serviceName,
      cold_start: attributes.lambdaContext?.coldStart,
      function_arn: attributes.lambdaContext?.invokedFunctionArn,
      function_memory_size: attributes.lambdaContext?.memoryLimitInMB,
      function_name: attributes.lambdaContext?.functionName,
      function_request_id: attributes.lambdaContext?.awsRequestId,
      sampling_rate: attributes.sampleRateValue,
      xray_trace_id: attributes.xRayTraceId
    };
    if (this.#logRecordOrder === void 0) {
      return new LogItem({ attributes: baseAttributes }).addAttributes(additionalLogAttributes);
    }
    const orderedAttributes = {};
    for (const key of this.#logRecordOrder) {
      if (key in baseAttributes && !(key in orderedAttributes)) {
        orderedAttributes[key] = baseAttributes[key];
      } else if (key in additionalLogAttributes && !(key in orderedAttributes)) {
        orderedAttributes[key] = additionalLogAttributes[key];
      }
    }
    for (const key in baseAttributes) {
      if (!(key in orderedAttributes)) {
        orderedAttributes[key] = baseAttributes[key];
      }
    }
    for (const key in additionalLogAttributes) {
      if (!(key in orderedAttributes)) {
        orderedAttributes[key] = additionalLogAttributes[key];
      }
    }
    const powertoolsLogItem = new LogItem({
      attributes: orderedAttributes
    });
    return powertoolsLogItem;
  }
};

// ../backend/node_modules/@aws-lambda-powertools/logger/lib/esm/logBuffer.js
var SizedItem = class {
  value;
  logLevel;
  byteSize;
  constructor(value, logLevel) {
    if (!isString(value)) {
      throw new Error("Value should be a string");
    }
    this.value = value;
    this.logLevel = logLevel;
    this.byteSize = Buffer.byteLength(value);
  }
};
var SizedSet = class extends Set {
  currentBytesSize = 0;
  hasEvictedLog = false;
  /**
   * Adds an item to the set and updates the current byte size.
   *
   * @param item - The item to add
   */
  add(item) {
    this.currentBytesSize += item.byteSize;
    super.add(item);
    return this;
  }
  /**
   * Deletes an item from the set and updates the current byte size.
   *
   * @param item - The item to delete
   */
  delete(item) {
    const wasDeleted = super.delete(item);
    if (wasDeleted) {
      this.currentBytesSize -= item.byteSize;
    }
    return wasDeleted;
  }
  /**
   * Clears all items from the set and resets the current byte size.
   */
  clear() {
    super.clear();
    this.currentBytesSize = 0;
  }
  /**
   * Removes the first item from the set and returns it.
   */
  shift() {
    const firstElement = this.values().next().value;
    if (firstElement) {
      this.delete(firstElement);
    }
    return firstElement;
  }
};
var CircularMap = class extends Map {
  #maxBytesSize;
  #onBufferOverflow;
  constructor({ maxBytesSize, onBufferOverflow }) {
    super();
    this.#maxBytesSize = maxBytesSize;
    this.#onBufferOverflow = onBufferOverflow;
  }
  /**
   * Adds an item to the buffer, evicting older items if necessary.
   *
   * @param key - The key to associate with the item
   * @param value - The item to add
   * @param logLevel - The log level of the item
   */
  setItem(key, value, logLevel) {
    const item = new SizedItem(value, logLevel);
    if (item.byteSize > this.#maxBytesSize) {
      throw new Error("Item too big");
    }
    const buffer = this.get(key) || new SizedSet();
    if (buffer.currentBytesSize + item.byteSize >= this.#maxBytesSize) {
      this.#deleteFromBufferUntilSizeIsLessThanMax(buffer, item);
      if (this.#onBufferOverflow) {
        this.#onBufferOverflow();
      }
    }
    buffer.add(item);
    super.set(key, buffer);
    return this;
  }
  /**
   * Deletes an item from the buffer.
   *
   * @param key - The key associated with the item
   * @param value - The item to delete
   */
  #deleteFromBufferUntilSizeIsLessThanMax(buffer, item) {
    while (buffer.currentBytesSize + item.byteSize >= this.#maxBytesSize) {
      buffer.shift();
      buffer.hasEvictedLog = true;
    }
  }
};

// ../backend/node_modules/@aws-lambda-powertools/logger/lib/esm/Logger.js
var Logger = class _Logger extends Utility {
  /**
   * Console instance used to print logs.
   *
   * In AWS Lambda, we create a new instance of the Console class so that we can have
   * full control over the output of the logs. In testing environments, we use the
   * default console instance.
   *
   * This property is initialized in the constructor in `setOptions()`.
   */
  console;
  /**
   * Custom config service instance used to configure the logger.
   */
  customConfigService;
  /**
   * Whether to print the Lambda invocation event in the logs.
   */
  logEvent = false;
  /**
   * Formatter used to format the log items.
   * @default new PowertoolsLogFormatter()
   */
  logFormatter;
  /**
   * JSON indentation used to format the logs.
   */
  logIndentation = LogJsonIndent.COMPACT;
  /**
   * Log level used internally by the current instance of Logger.
   */
  logLevel = LogLevelThreshold.INFO;
  /**
   * Advanced Logging Control Log Level
   * If not a valid value this will be left undefined, even if the
   * environment variable AWS_LAMBDA_LOG_LEVEL is set
   */
  #alcLogLevel;
  /**
   * Persistent log attributes that will be logged in all log items.
   */
  persistentLogAttributes = {};
  /**
   * Standard attributes managed by Powertools that will be logged in all log items.
   */
  powertoolsLogData = {
    sampleRateValue: 0
  };
  /**
   * Temporary log attributes that can be appended with `appendKeys()` method.
   */
  temporaryLogAttributes = {};
  /**
   * Buffer used to store logs until the logger is initialized.
   *
   * Sometimes we need to log warnings before the logger is fully initialized, however we can't log them
   * immediately because the logger is not ready yet. This buffer stores those logs until the logger is ready.
   */
  #initBuffer = [];
  /**
   * Flag used to determine if the logger is initialized.
   */
  #isInitialized = false;
  /**
   * Map used to hold the list of keys and their type.
   *
   * Because keys of different types can be overwritten, we keep a list of keys that were added and their last
   * type. We then use this map at log preparation time to pick the last one.
   */
  #keys = /* @__PURE__ */ new Map();
  /**
   * This is the initial log leval as set during the initialization of the logger.
   *
   * We keep this value to be able to reset the log level to the initial value when the sample rate is refreshed.
   */
  #initialLogLevel = LogLevelThreshold.INFO;
  /**
   * Replacer function used to serialize the log items.
   */
  #jsonReplacerFn;
  /**
   * Buffer configuration options.
   */
  #bufferConfig = {
    enabled: false,
    flushOnErrorLog: true,
    maxBytes: 20480,
    bufferAtVerbosity: LogLevelThreshold.DEBUG
  };
  /**
   * Contains buffered logs, grouped by `_X_AMZN_TRACE_ID`, each group with a max size of `maxBufferBytesSize`
   */
  #buffer;
  /**
   * Search function for the correlation ID.
   */
  #correlationIdSearchFn;
  /**
   * The debug sampling rate configuration.
   */
  #debugLogSampling = {
    /**
     * The sampling rate value used to determine if the log level should be set to DEBUG.
     */
    sampleRateValue: 0,
    /**
     * The number of times the debug sampling rate has been refreshed.
     *
     * We use this to determine if we should refresh it again.
     */
    refreshedTimes: 0
  };
  /**
   * Map used to store the warning messages that have already been logged.
   */
  #warnOnceMap = /* @__PURE__ */ new Map();
  /**
   * Log level used by the current instance of Logger.
   *
   * Returns the log level as a number. The higher the number, the less verbose the logs.
   * To get the log level name, use the {@link getLevelName()} method.
   */
  get level() {
    return this.logLevel;
  }
  constructor(options = {}) {
    super();
    const { customConfigService, ...rest } = options;
    this.customConfigService = customConfigService ? customConfigService : void 0;
    this.setOptions(rest);
    this.#isInitialized = true;
    for (const [level, log] of this.#initBuffer) {
      this.printLog(level, this.createAndPopulateLogItem(...log));
    }
    this.#initBuffer = [];
  }
  /**
   * Add the current Lambda function's invocation context data to the powertoolLogData property of the instance.
   * This context data will be part of all printed log items.
   *
   * @param context - The Lambda function's invocation context.
   */
  addContext(context) {
    this.addToPowertoolsLogData({
      lambdaContext: {
        invokedFunctionArn: context.invokedFunctionArn,
        coldStart: this.getColdStart(),
        awsRequestId: context.awsRequestId,
        memoryLimitInMB: context.memoryLimitInMB,
        functionName: context.functionName,
        functionVersion: context.functionVersion
      }
    });
  }
  /**
   * @deprecated This method is deprecated and will be removed in the future major versions, please use {@link appendPersistentKeys() `appendPersistentKeys()`} instead.
   */
  addPersistentLogAttributes(attributes) {
    this.appendPersistentKeys(attributes);
  }
  /**
   * Add the given temporary attributes (key-value pairs) to all log items generated by this Logger instance.
   *
   * If the key already exists in the attributes, it will be overwritten. If the key is one of `level`, `message`, `sampling_rate`,
   * `service`, or `timestamp` we will log a warning and drop the value.
   *
   * @param attributes - The attributes to add to all log items.
   */
  appendKeys(attributes) {
    this.#appendKeys(attributes, "temp");
  }
  /**
   * Add the given persistent attributes (key-value pairs) to all log items generated by this Logger instance.
   *
   * If the key already exists in the attributes, it will be overwritten. If the key is one of `level`, `message`, `sampling_rate`,
   * `service`, or `timestamp` we will log a warning and drop the value.
   *
   * @param attributes - The attributes to add to all log items.
   */
  appendPersistentKeys(attributes) {
    this.#appendKeys(attributes, "persistent");
  }
  /**
   * Create a separate Logger instance, identical to the current one.
   * It's possible to overwrite the new instance options by passing them.
   *
   * @param options - The options to initialize the child logger with.
   */
  createChild(options = {}) {
    const childLogger = this.createLogger(
      // Merge parent logger options with options passed to createChild,
      // the latter having precedence.
      (0, import_lodash2.default)({}, {
        logLevel: this.getLevelName(),
        serviceName: this.powertoolsLogData.serviceName,
        sampleRateValue: this.#debugLogSampling.sampleRateValue,
        logFormatter: this.getLogFormatter(),
        customConfigService: this.getCustomConfigService(),
        environment: this.powertoolsLogData.environment,
        persistentLogAttributes: this.persistentLogAttributes,
        jsonReplacerFn: this.#jsonReplacerFn,
        correlationIdSearchFn: this.#correlationIdSearchFn,
        ...this.#bufferConfig.enabled && {
          logBufferOptions: {
            maxBytes: this.#bufferConfig.maxBytes,
            bufferAtVerbosity: this.getLogLevelNameFromNumber(this.#bufferConfig.bufferAtVerbosity),
            flushOnErrorLog: this.#bufferConfig.flushOnErrorLog
          }
        }
      }, options)
    );
    if (this.powertoolsLogData.lambdaContext)
      childLogger.addContext(this.powertoolsLogData.lambdaContext);
    if (this.temporaryLogAttributes) {
      childLogger.appendKeys(this.temporaryLogAttributes);
    }
    return childLogger;
  }
  /**
   * Print a log item with level CRITICAL.
   *
   * @param input - The log message.
   * @param extraInput - The extra input to log.
   */
  critical(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.CRITICAL, input, extraInput);
  }
  /**
   * Print a log item with level DEBUG.
   *
   * @param input
   * @param extraInput - The extra input to log.
   */
  debug(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.DEBUG, input, extraInput);
  }
  /**
   * Print a log item with level ERROR.
   *
   * @param input - The log message.
   * @param extraInput - The extra input to log.
   */
  error(input, ...extraInput) {
    if (this.#bufferConfig.enabled && this.#bufferConfig.flushOnErrorLog) {
      this.flushBuffer();
    }
    this.processLogItem(LogLevelThreshold.ERROR, input, extraInput);
  }
  /**
   * Get the log level name of the current instance of Logger.
   *
   * Returns the log level name, i.e. `INFO`, `DEBUG`, etc.
   * To get the log level as a number, use the {@link Logger.level} property.
   */
  getLevelName() {
    return this.getLogLevelNameFromNumber(this.logLevel);
  }
  /**
   * Return a boolean value. True means that the Lambda invocation events
   * are printed in the logs.
   */
  getLogEvent() {
    return this.logEvent;
  }
  /**
   * Return the persistent log attributes, which are the attributes
   * that will be logged in all log items.
   */
  getPersistentLogAttributes() {
    return this.persistentLogAttributes;
  }
  /**
   * Print a log item with level INFO.
   *
   * @param input - The log message.
   * @param extraInput - The extra input to log.
   */
  info(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.INFO, input, extraInput);
  }
  /**
   * Class method decorator that adds the current Lambda function context as extra
   * information in all log items.
   *
   * This decorator is useful when you want to enrich your logs with information
   * from the function context, such as the function name, version, and request ID, and more.
   *
   * @example
   * ```typescript
   * import { Logger } from '@aws-lambda-powertools/logger';
   * import type { LambdaInterface } from '@aws-lambda-powertools/commons/types';
   *
   * const logger = new Logger({ serviceName: 'serverlessAirline' });
   *
   * class Lambda implements LambdaInterface {
   *   // Decorate your handler class method
   *   ⁣@logger.injectLambdaContext()
   *   public async handler(_event: unknown, _context: unknown): Promise<void> {
   *     logger.info('This is an INFO log with some context');
   *   }
   * }
   *
   * const handlerClass = new Lambda();
   * export const handler = handlerClass.handler.bind(handlerClass);
   * ```
   *
   * The decorator can also be used to log the Lambda invocation event; this can be configured both via
   * the `logEvent` parameter and the `POWERTOOLS_LOGGER_LOG_EVENT` environment variable. When both
   * are set, the `logEvent` parameter takes precedence.
   *
   * Additionally, the decorator can be used to reset the temporary keys added with the `appendKeys()` method
   * after the invocation, or to flush the buffer when an uncaught error is thrown in the handler.
   *
   * @see https://www.typescriptlang.org/docs/handbook/decorators.html#method-decorators
   *
   * @param options.logEvent - When `true` the logger will log the event.
   * @param options.resetKeys - When `true` the logger will clear temporary keys added with {@link Logger.appendKeys() `appendKeys()`} method.
   * @param options.flushBufferOnUncaughtError - When `true` the logger will flush the buffer when an uncaught error is thrown in the handler.
   */
  injectLambdaContext(options) {
    return (_target, _propertyKey, descriptor) => {
      const originalMethod = descriptor.value;
      const loggerRef = this;
      descriptor.value = async function(...args) {
        loggerRef.refreshSampleRateCalculation();
        loggerRef.addContext(args[1]);
        loggerRef.logEventIfEnabled(args[0], options?.logEvent);
        if (options?.correlationIdPath) {
          loggerRef.setCorrelationId(args[0], options?.correlationIdPath);
        }
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          if (options?.flushBufferOnUncaughtError) {
            loggerRef.flushBuffer();
            loggerRef.error({
              message: UncaughtErrorLogMessage,
              error
            });
          }
          throw error;
        } finally {
          if (options?.clearState || options?.resetKeys)
            loggerRef.resetKeys();
          loggerRef.clearBuffer();
        }
      };
    };
  }
  /**
   * @deprecated This method is deprecated and will be removed in the future major versions. Use {@link resetKeys()} instead.
   */
  /* v8 ignore start */
  static injectLambdaContextAfterOrOnError(logger2, _persistentAttributes, options) {
    if (options && (options.clearState || options?.resetKeys)) {
      logger2.resetKeys();
    }
  }
  /* v8 ignore stop */
  /**
   * @deprecated - This method is deprecated and will be removed in the next major version.
   */
  /* v8 ignore start */
  static injectLambdaContextBefore(logger2, event, context, options) {
    logger2.addContext(context);
    logger2.logEventIfEnabled(event, options?.logEvent);
  }
  /* v8 ignore stop */
  /**
   * Log the AWS Lambda event payload for the current invocation if the environment variable `POWERTOOLS_LOGGER_LOG_EVENT` is set to `true`.
   *
   * @example
   * ```ts
   * process.env.POWERTOOLS_LOGGER_LOG_EVENT = 'true';
   *
   * import { Logger } from '@aws-lambda-powertools/logger';
   *
   * const logger = new Logger();
   *
   * export const handler = async (event) => {
   *   logger.logEventIfEnabled(event);
   *   // ... your handler code
   * }
   * ```
   *
   * @param event - The AWS Lambda event payload.
   * @param overwriteValue - Overwrite the environment variable value.
   */
  logEventIfEnabled(event, overwriteValue) {
    if (!this.shouldLogEvent(overwriteValue))
      return;
    this.info("Lambda invocation event", { event });
  }
  /**
   * This method allows recalculating the initial sampling decision for changing
   * the log level to DEBUG based on a sample rate value used during initialization,
   * potentially yielding a different outcome.
   *
   * This only works for warm starts, because we don't to avoid double sampling.
   */
  refreshSampleRateCalculation() {
    if (this.#debugLogSampling.refreshedTimes === 0) {
      this.#debugLogSampling.refreshedTimes++;
      return;
    }
    if (this.#shouldEnableDebugSampling() && this.logLevel > LogLevelThreshold.TRACE) {
      this.setLogLevel("DEBUG");
      this.debug("Setting log level to DEBUG due to sampling rate");
    } else {
      this.setLogLevel(this.getLogLevelNameFromNumber(this.#initialLogLevel));
    }
  }
  /**
   * Remove temporary attributes based on provided keys to all log items generated by this Logger instance.
   *
   * @param keys - The keys to remove.
   */
  removeKeys(keys) {
    for (const key of keys) {
      this.temporaryLogAttributes[key] = void 0;
      if (this.persistentLogAttributes[key]) {
        this.#keys.set(key, "persistent");
      } else {
        this.#keys.delete(key);
      }
    }
  }
  /**
   * Remove the given keys from the persistent keys.
   *
   * @example
   * ```typescript
   * import { Logger } from '@aws-lambda-powertools/logger';
   *
   * const logger = new Logger({
   *   persistentKeys: {
   *     environment: 'prod',
   *   },
   * });
   *
   * logger.removePersistentKeys(['environment']);
   * ```
   *
   * @param keys - The keys to remove from the persistent attributes.
   */
  removePersistentKeys(keys) {
    for (const key of keys) {
      this.persistentLogAttributes[key] = void 0;
      if (this.temporaryLogAttributes[key]) {
        this.#keys.set(key, "temp");
      } else {
        this.#keys.delete(key);
      }
    }
  }
  /**
   * @deprecated This method is deprecated and will be removed in the future major versions. Use {@link removePersistentKeys()} instead.
   */
  removePersistentLogAttributes(keys) {
    this.removePersistentKeys(keys);
  }
  /**
   * Remove all temporary log attributes added with {@link appendKeys() `appendKeys()`} method.
   */
  resetKeys() {
    for (const key of Object.keys(this.temporaryLogAttributes)) {
      if (this.persistentLogAttributes[key]) {
        this.#keys.set(key, "persistent");
      } else {
        this.#keys.delete(key);
      }
    }
    this.temporaryLogAttributes = {};
  }
  /**
   * Set the log level for this Logger instance.
   *
   * If the log level is set using AWS Lambda Advanced Logging Controls, it sets it
   * instead of the given log level to avoid data loss.
   *
   * @param logLevel The log level to set, i.e. `error`, `warn`, `info`, `debug`, etc.
   */
  setLogLevel(logLevel) {
    if (this.awsLogLevelShortCircuit(logLevel))
      return;
    if (this.isValidLogLevel(logLevel)) {
      this.logLevel = LogLevelThreshold[logLevel];
    } else {
      throw new Error(`Invalid log level: ${logLevel}`);
    }
  }
  /**
   * @deprecated This method is deprecated and will be removed in the future major versions, please use {@link appendPersistentKeys() `appendPersistentKeys()`} instead.
   */
  setPersistentLogAttributes(attributes) {
    this.persistentLogAttributes = attributes;
  }
  /**
   * Check whether the current Lambda invocation event should be printed in the logs or not.
   *
   * @param overwriteValue - Overwrite the environment variable value.
   */
  shouldLogEvent(overwriteValue) {
    if (typeof overwriteValue === "boolean") {
      return overwriteValue;
    }
    return this.getLogEvent();
  }
  /**
   * Print a log item with level TRACE.
   *
   * @param input - The log message.
   * @param extraInput - The extra input to log.
   */
  trace(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.TRACE, input, extraInput);
  }
  /**
   * Print a log item with level WARN.
   *
   * @param input - The log message.
   * @param extraInput - The extra input to log.
   */
  warn(input, ...extraInput) {
    this.processLogItem(LogLevelThreshold.WARN, input, extraInput);
  }
  /**
   * Log a warning message once per unique message.
   *
   * @param message - The log message.
   */
  #warnOnce(message) {
    if (this.#warnOnceMap.has(message))
      return;
    this.#warnOnceMap.set(message, true);
    this.warn(message);
  }
  /**
   * Factory method for instantiating logger instances. Used by `createChild` method.
   * Important for customization and subclassing. It allows subclasses, like `MyOwnLogger`,
   * to override its behavior while keeping the main business logic in `createChild` intact.
   *
   * @example
   * ```typescript
   * // MyOwnLogger subclass
   * class MyOwnLogger extends Logger {
   *   protected createLogger(options?: ConstructorOptions): MyOwnLogger {
   *     return new MyOwnLogger(options);
   *   }
   *   // No need to re-implement business logic from `createChild` and keep track on changes
   *   public createChild(options?: ConstructorOptions): MyOwnLogger {
   *     return super.createChild(options) as MyOwnLogger;
   *   }
   * }
   * ```
   *
   * @param options - Logger configuration options.
   */
  createLogger(options) {
    return new _Logger(options);
  }
  /**
   * A custom JSON replacer function that is used to serialize the log items.
   *
   * By default, we already extend the default serialization behavior to handle `BigInt` and `Error` objects, as well as remove circular references.
   * When a custom JSON replacer function is passed to the Logger constructor, it will be called **before** our custom rules for each key-value pair in the object being stringified.
   *
   * This allows you to customize the serialization while still benefiting from the default behavior.
   *
   * @see {@link ConstructorOptions.jsonReplacerFn}
   */
  getJsonReplacer() {
    const references = /* @__PURE__ */ new WeakSet();
    return (key, value) => {
      let replacedValue = value;
      if (this.#jsonReplacerFn)
        replacedValue = this.#jsonReplacerFn?.(key, replacedValue);
      if (replacedValue instanceof Error) {
        replacedValue = this.getLogFormatter().formatError(replacedValue);
      }
      if (typeof replacedValue === "bigint") {
        return replacedValue.toString();
      }
      if (typeof replacedValue === "object" && replacedValue !== null) {
        if (references.has(replacedValue)) {
          return;
        }
        references.add(replacedValue);
      }
      return replacedValue;
    };
  }
  /**
   * Store information that is printed in all log items.
   *
   * @param attributes - The attributes to add to all log items.
   */
  addToPowertoolsLogData(attributes) {
    (0, import_lodash2.default)(this.powertoolsLogData, attributes);
  }
  /**
   * Shared logic for adding keys to the logger instance.
   *
   * @param attributes - The attributes to add to the log item.
   * @param type - The type of the attributes to add.
   */
  #appendKeys(attributes, type) {
    for (const attributeKey of Object.keys(attributes)) {
      if (this.#checkReservedKeyAndWarn(attributeKey) === false) {
        this.#keys.set(attributeKey, type);
      }
    }
    if (type === "temp") {
      (0, import_lodash2.default)(this.temporaryLogAttributes, attributes);
    } else {
      (0, import_lodash2.default)(this.persistentLogAttributes, attributes);
    }
  }
  awsLogLevelShortCircuit(selectedLogLevel) {
    if (this.#alcLogLevel !== void 0) {
      this.logLevel = LogLevelThreshold[this.#alcLogLevel];
      if (this.isValidLogLevel(selectedLogLevel) && this.logLevel > LogLevelThreshold[selectedLogLevel]) {
        this.#warnOnce(`Current log level (${selectedLogLevel}) does not match AWS Lambda Advanced Logging Controls minimum log level (${this.#alcLogLevel}). This can lead to data loss, consider adjusting them.`);
      }
      return true;
    }
    return false;
  }
  /**
   * Create a log item and populate it with the given log level, input, and extra input.
   */
  createAndPopulateLogItem(logLevel, input, extraInput) {
    const unformattedBaseAttributes = {
      logLevel: this.getLogLevelNameFromNumber(logLevel),
      timestamp: /* @__PURE__ */ new Date(),
      xRayTraceId: getXRayTraceIdFromEnv(),
      ...this.getPowertoolsLogData(),
      message: ""
    };
    const additionalAttributes = this.#createAdditionalAttributes();
    this.#processMainInput(input, unformattedBaseAttributes, additionalAttributes);
    this.#processExtraInput(extraInput, additionalAttributes);
    return this.getLogFormatter().formatAttributes(unformattedBaseAttributes, additionalAttributes);
  }
  /**
   * Create additional attributes from persistent and temporary keys
   */
  #createAdditionalAttributes() {
    const attributes = {};
    for (const [key, type] of this.#keys) {
      if (!this.#checkReservedKeyAndWarn(key)) {
        attributes[key] = type === "persistent" ? this.persistentLogAttributes[key] : this.temporaryLogAttributes[key];
      }
    }
    return attributes;
  }
  /**
   * Process the main input message and add it to the attributes
   */
  #processMainInput(input, baseAttributes, additionalAttributes) {
    if (typeof input === "string") {
      baseAttributes.message = input;
      return;
    }
    const { message, ...rest } = input;
    baseAttributes.message = message;
    for (const [key, value] of Object.entries(rest)) {
      if (!this.#checkReservedKeyAndWarn(key)) {
        additionalAttributes[key] = value;
      }
    }
  }
  /**
   * Process extra input items and add them to additional attributes
   */
  #processExtraInput(extraInput, additionalAttributes) {
    for (const item of extraInput) {
      if (isNullOrUndefined(item)) {
        continue;
      }
      if (item instanceof Error) {
        additionalAttributes.error = item;
      } else if (typeof item === "string") {
        additionalAttributes.extra = item;
      } else {
        this.#processExtraObject(item, additionalAttributes);
      }
    }
  }
  /**
   * Process an extra input object and add its properties to additional attributes
   */
  #processExtraObject(item, additionalAttributes) {
    for (const [key, value] of Object.entries(item)) {
      if (!this.#checkReservedKeyAndWarn(key)) {
        additionalAttributes[key] = value;
      }
    }
  }
  /**
   * Make a new debug log sampling decision based on the sample rate value.
   */
  #shouldEnableDebugSampling() {
    return this.#debugLogSampling.sampleRateValue && (0, import_node_crypto.randomInt)(0, 100) / 100 <= this.#debugLogSampling.sampleRateValue;
  }
  /**
   * Check if a given key is reserved and warn the user if it is.
   *
   * @param key - The key to check
   */
  #checkReservedKeyAndWarn(key) {
    if (ReservedKeys.includes(key)) {
      this.warn(`The key "${key}" is a reserved key and will be dropped.`);
      return true;
    }
    return false;
  }
  /**
   * Get the custom config service, an abstraction used to fetch environment variables.
   */
  getCustomConfigService() {
    return this.customConfigService;
  }
  /**
   * Get the instance of a service that formats the structure of a
   * log item's keys and values in the desired way.
   */
  getLogFormatter() {
    return this.logFormatter;
  }
  /**
   * Get the log level name from the log level number.
   *
   * For example, if the log level is 16, it will return 'WARN'.
   *
   * @param logLevel - The log level to get the name of
   */
  getLogLevelNameFromNumber(logLevel) {
    let found;
    for (const [key, value] of Object.entries(LogLevelThreshold)) {
      if (value === logLevel) {
        found = key;
        break;
      }
    }
    return found;
  }
  /**
   * Get information that will be added in all log item by
   * this Logger instance (different from user-provided persistent attributes).
   */
  getPowertoolsLogData() {
    return this.powertoolsLogData;
  }
  /**
   * Check if a given log level is valid.
   *
   * @param logLevel - The log level to check
   */
  isValidLogLevel(logLevel) {
    return typeof logLevel === "string" && logLevel in LogLevelThreshold;
  }
  /**
   * Check if a given sample rate value is valid.
   *
   * @param sampleRateValue - The sample rate value to check
   */
  isValidSampleRate(sampleRateValue) {
    return typeof sampleRateValue === "number" && 0 <= sampleRateValue && sampleRateValue <= 1;
  }
  /**
   * Print a given log with given log level.
   *
   * @param logLevel - The log level
   * @param log - The log item to print
   */
  printLog(logLevel, log) {
    log.prepareForPrint();
    const consoleMethod = logLevel === LogLevelThreshold.CRITICAL ? "error" : this.getLogLevelNameFromNumber(logLevel).toLowerCase();
    this.console[consoleMethod](JSON.stringify(log.getAttributes(), this.getJsonReplacer(), this.logIndentation));
  }
  /**
   * Print or buffer a given log with given log level.
   *
   * @param logLevel - The log level threshold
   * @param input - The log message
   * @param extraInput - The extra input to log
   */
  processLogItem(logLevel, input, extraInput) {
    const traceId = getXRayTraceIdFromEnv();
    if (traceId !== void 0 && this.shouldBufferLog(traceId, logLevel)) {
      try {
        this.bufferLogItem(traceId, this.createAndPopulateLogItem(logLevel, input, extraInput), logLevel);
      } catch (error) {
        this.printLog(LogLevelThreshold.WARN, this.createAndPopulateLogItem(LogLevelThreshold.WARN, `Unable to buffer log: ${error.message}`, [error]));
        this.printLog(logLevel, this.createAndPopulateLogItem(logLevel, input, extraInput));
      }
      return;
    }
    if (logLevel >= this.logLevel) {
      if (this.#isInitialized) {
        this.printLog(logLevel, this.createAndPopulateLogItem(logLevel, input, extraInput));
      } else {
        this.#initBuffer.push([logLevel, [logLevel, input, extraInput]]);
      }
    }
  }
  /**
   * Initialize the console property as an instance of the internal version of Console() class (PR #748)
   * or as the global node console if the `POWERTOOLS_DEV' env variable is set and has truthy value.
   */
  setConsole() {
    if (!isDevMode()) {
      this.console = new import_node_console.Console({
        stdout: process.stdout,
        stderr: process.stderr
      });
    } else {
      this.console = console;
    }
    this.console.trace = (message, ...optionalParams) => {
      this.console.log(message, ...optionalParams);
    };
  }
  /**
   * Set the initial Logger log level based on the following order:
   * 1. If a log level is set using AWS Lambda Advanced Logging Controls, it sets it.
   * 2. If a log level is passed to the constructor, it sets it.
   * 3. If a log level is set via custom config service, it sets it.
   * 4. If a log level is set via env variables, it sets it.
   *
   * If none of the above is true, the default log level applies (`INFO`).
   *
   * @param logLevel - Log level passed to the constructor
   */
  setInitialLogLevel(logLevel) {
    const constructorLogLevel = logLevel?.toUpperCase();
    if (this.awsLogLevelShortCircuit(constructorLogLevel)) {
      this.#initialLogLevel = this.logLevel;
      return;
    }
    if (this.isValidLogLevel(constructorLogLevel)) {
      this.logLevel = LogLevelThreshold[constructorLogLevel];
      this.#initialLogLevel = this.logLevel;
      return;
    }
    const customConfigValue = this.getCustomConfigService()?.getLogLevel()?.toUpperCase();
    if (this.isValidLogLevel(customConfigValue)) {
      this.logLevel = LogLevelThreshold[customConfigValue];
      this.#initialLogLevel = this.logLevel;
      return;
    }
    const logLevelVariable = getStringFromEnv({
      key: "POWERTOOLS_LOG_LEVEL",
      defaultValue: ""
    });
    const logLevelVariableAlias = getStringFromEnv({
      key: "LOG_LEVEL",
      defaultValue: ""
    });
    const logLevelValue = logLevelVariable !== "" ? logLevelVariable : logLevelVariableAlias;
    if (this.isValidLogLevel(logLevelValue)) {
      this.logLevel = LogLevelThreshold[logLevelValue];
      this.#initialLogLevel = this.logLevel;
    }
  }
  /**
   * Set the sample rate value with the following priority:
   * 1. Constructor value
   * 2. Custom config service value
   * 3. Environment variable value
   * 4. Default value (zero)
   *
   * @param sampleRateValue - The sample rate value
   */
  setInitialSampleRate(sampleRateValue) {
    const constructorValue = sampleRateValue;
    const customConfigValue = this.getCustomConfigService()?.getSampleRateValue();
    const sampleRateEnvVariable = getNumberFromEnv({
      key: "POWERTOOLS_LOGGER_SAMPLE_RATE",
      defaultValue: 0
    });
    for (const value of [
      constructorValue,
      customConfigValue,
      sampleRateEnvVariable
    ]) {
      if (this.isValidSampleRate(value)) {
        this.#debugLogSampling.sampleRateValue = value;
        this.powertoolsLogData.sampleRateValue = value;
        if (this.#shouldEnableDebugSampling() && this.logLevel > LogLevelThreshold.TRACE) {
          this.setLogLevel("DEBUG");
          this.debug("Setting log level to DEBUG due to sampling rate");
        }
        break;
      }
    }
  }
  /**
   * If the log event feature is enabled via env variable, it sets a property that tracks whether
   * the event passed to the Lambda function handler should be logged or not.
   */
  setLogEvent() {
    this.logEvent = getBooleanFromEnv({
      key: "POWERTOOLS_LOGGER_LOG_EVENT",
      defaultValue: false
    });
  }
  /**
   * Set the log formatter instance, in charge of giving a custom format
   * to the structured logs, and optionally the ordering for keys within logs.
   *
   * @param logFormatter - The log formatter
   * @param logRecordOrder - Optional list of keys to specify order in logs
   */
  setLogFormatter(logFormatter, logRecordOrder) {
    this.logFormatter = logFormatter ?? new PowertoolsLogFormatter({
      logRecordOrder
    });
  }
  /**
   * If the `POWERTOOLS_DEV` env variable is set,
   * add JSON indentation for pretty printing logs.
   */
  setLogIndentation() {
    if (isDevMode()) {
      this.logIndentation = LogJsonIndent.PRETTY;
    }
  }
  /**
   * Configure the Logger instance settings that will affect the Logger's behaviour
   * and the content of all logs.
   *
   * @param options - Options to configure the Logger instance
   */
  setOptions(options) {
    const {
      logLevel,
      serviceName,
      sampleRateValue,
      logFormatter,
      persistentKeys,
      persistentLogAttributes,
      // deprecated in favor of persistentKeys
      environment,
      jsonReplacerFn,
      logRecordOrder,
      logBufferOptions,
      correlationIdSearchFn
    } = options;
    if (persistentLogAttributes && persistentKeys) {
      this.warn("Both persistentLogAttributes and persistentKeys options were provided. Using persistentKeys as persistentLogAttributes is deprecated and will be removed in future releases");
    }
    this.setPowertoolsLogData(serviceName, environment, persistentKeys || persistentLogAttributes);
    const lambdaLogLevel = getStringFromEnv({
      key: "AWS_LAMBDA_LOG_LEVEL",
      defaultValue: ""
    });
    const AlcLogLevel = lambdaLogLevel === "FATAL" ? "CRITICAL" : lambdaLogLevel;
    if (this.isValidLogLevel(AlcLogLevel)) {
      this.#alcLogLevel = AlcLogLevel;
    }
    this.setLogEvent();
    this.setInitialLogLevel(logLevel);
    this.setInitialSampleRate(sampleRateValue);
    this.setLogFormatter(logFormatter, logRecordOrder);
    this.setConsole();
    this.setLogIndentation();
    this.#jsonReplacerFn = jsonReplacerFn;
    this.#setLogBuffering(logBufferOptions);
    this.#correlationIdSearchFn = correlationIdSearchFn;
    return this;
  }
  /**
   * Add important data to the Logger instance that will affect the content of all logs.
   *
   * @param serviceName - The service name
   * @param environment - The environment
   * @param persistentKeys - The persistent log attributes
   */
  setPowertoolsLogData(serviceName, environment, persistentKeys) {
    this.addToPowertoolsLogData({
      awsRegion: getStringFromEnv({
        key: "AWS_REGION",
        defaultValue: ""
      }),
      environment: environment || this.getCustomConfigService()?.getCurrentEnvironment() || getStringFromEnv({
        key: "ENVIRONMENT",
        defaultValue: ""
      }),
      serviceName: serviceName || this.getCustomConfigService()?.getServiceName() || getStringFromEnv({
        key: "POWERTOOLS_SERVICE_NAME",
        defaultValue: ""
      }) || this.defaultServiceName
    });
    persistentKeys && this.appendPersistentKeys(persistentKeys);
  }
  /**
   * Configure the buffer settings for the Logger instance.
   *
   * @param options - Options to configure the Logger instance
   */
  #setLogBuffering(options) {
    if (options === void 0) {
      return;
    }
    this.#bufferConfig.enabled = options?.enabled !== false;
    if (this.#bufferConfig.enabled === false)
      return;
    if (options?.maxBytes !== void 0) {
      this.#bufferConfig.maxBytes = options.maxBytes;
    }
    this.#buffer = new CircularMap({
      maxBytesSize: this.#bufferConfig.maxBytes
    });
    if (options?.flushOnErrorLog === false) {
      this.#bufferConfig.flushOnErrorLog = false;
    }
    const bufferAtLogLevel = options?.bufferAtVerbosity?.toUpperCase();
    if (this.isValidLogLevel(bufferAtLogLevel)) {
      this.#bufferConfig.bufferAtVerbosity = LogLevelThreshold[bufferAtLogLevel];
    }
    if (this.#alcLogLevel !== void 0 && LogLevelThreshold[this.#alcLogLevel] > this.#bufferConfig.bufferAtVerbosity) {
      this.#warnOnce("Advanced Loggging Controls (ALC) Log Level is less verbose than Log Buffering Log Level. Buffered logs will be filtered by ALC");
    }
  }
  /**
   * Add a log to the buffer.
   *
   * @param xrayTraceId - `_X_AMZN_TRACE_ID` of the request
   * @param log - Log to be buffered
   * @param logLevel - The level of log to be buffered
   */
  bufferLogItem(xrayTraceId, log, logLevel) {
    log.prepareForPrint();
    if (this.#buffer?.has(xrayTraceId) === false) {
      this.#buffer?.clear();
    }
    this.#buffer?.setItem(xrayTraceId, JSON.stringify(log.getAttributes(), this.getJsonReplacer(), this.logIndentation), logLevel);
  }
  /**
   * Flush all logs in the request buffer.
   *
   * This is called automatically when you use the {@link injectLambdaContext | `@logger.injectLambdaContext()`} decorator and
   * your function throws an error.
   */
  flushBuffer() {
    const traceId = getXRayTraceIdFromEnv();
    if (traceId === void 0) {
      return;
    }
    const buffer = this.#buffer?.get(traceId);
    if (buffer === void 0) {
      return;
    }
    for (const item of buffer) {
      const consoleMethod = this.getLogLevelNameFromNumber(item.logLevel).toLowerCase();
      this.console[consoleMethod](item.value);
    }
    if (buffer.hasEvictedLog) {
      this.printLog(LogLevelThreshold.WARN, this.createAndPopulateLogItem(LogLevelThreshold.WARN, "Some logs are not displayed because they were evicted from the buffer. Increase buffer size to store more logs in the buffer", []));
    }
    if (this.#alcLogLevel !== void 0 && LogLevelThreshold[this.#alcLogLevel] > this.#bufferConfig.bufferAtVerbosity) {
      this.#warnOnce("Advanced Loggging Controls (ALC) Log Level is less verbose than Log Buffering Log Level. Some logs might be missing.");
    }
    this.#buffer?.delete(traceId);
  }
  /**
   * Empties the buffer for the current request
   */
  clearBuffer() {
    const traceId = getXRayTraceIdFromEnv();
    if (traceId === void 0) {
      return;
    }
    this.#buffer?.delete(traceId);
  }
  /**
   * Test if the log meets the criteria to be buffered.
   *
   * @param traceId - `_X_AMZN_TRACE_ID` of the request
   * @param logLevel - The level of the log being considered
   */
  shouldBufferLog(traceId, logLevel) {
    return this.#bufferConfig.enabled && traceId !== void 0 && logLevel <= this.#bufferConfig.bufferAtVerbosity;
  }
  /**
   * Set the correlation ID for the log item.
   *
   * This method can be used to set the correlation ID for the log item or to search for the correlation ID in the event.
   *
   * @example
   * ```typescript
   * import { Logger } from '@aws-lambda-powertools/logger';
   *
   * const logger = new Logger();
   * logger.setCorrelationId('my-correlation-id'); // sets the correlation ID directly with the first argument as value
   * ```
   *
   * @example
   * ```typescript
   * import { Logger } from '@aws-lambda-powertools/logger';
   * import { search } from '@aws-lambda-powertools/logger/correlationId';
   *
   * const logger = new Logger({ correlationIdSearchFn: search });
   * logger.setCorrelationId(event, 'requestContext.requestId'); // sets the correlation ID from the event using JMSPath expression
   * ```
   *
   * @param value - The value to set as the correlation ID or the event to search for the correlation ID
   * @param correlationIdPath - Optional JMESPath expression to extract the correlation ID for the payload
   */
  setCorrelationId(value, correlationIdPath) {
    if (typeof correlationIdPath === "string") {
      if (!this.#correlationIdSearchFn) {
        this.#warnOnce("correlationIdPath is set but no search function was provided. The correlation ID will not be added to the log attributes.");
        return;
      }
      const correlationId = this.#correlationIdSearchFn(correlationIdPath, value);
      if (correlationId)
        this.appendKeys({ correlation_id: correlationId });
      return;
    }
    this.appendKeys({ correlation_id: value });
  }
  /**
   * Get the correlation ID from the log attributes.
   */
  getCorrelationId() {
    return this.temporaryLogAttributes.correlation_id;
  }
};

// ../backend/src/shared/logger.ts
var toLogLevel = (v) => {
  switch ((v ?? "").toUpperCase()) {
    case "TRACE":
      return LogLevel.TRACE;
    case "DEBUG":
      return LogLevel.DEBUG;
    case "INFO":
      return LogLevel.INFO;
    case "WARN":
    case "WARNING":
      return LogLevel.WARN;
    case "ERROR":
      return LogLevel.ERROR;
    default:
      return LogLevel.INFO;
  }
};
var logger = new Logger({
  serviceName: "chatshyld",
  logLevel: toLogLevel(process.env.LOG_LEVEL)
});

// ../backend/src/phone_directory/phone_directory.repo.ts
var import_lib_dynamodb2 = require("@aws-sdk/lib-dynamodb");

// ../backend/src/shared/dynamodb.ts
var import_client_dynamodb = require("@aws-sdk/client-dynamodb");
var import_lib_dynamodb = require("@aws-sdk/lib-dynamodb");

// ../backend/src/shared/config.ts
var cfg = {
  region: process.env.AWS_REGION ?? "ap-southeast-2",
  usersTable: process.env.USERS_TABLE,
  phoneGsi: process.env.PHONE_GSI ?? "gsi_phone",
  jwtSecret: process.env.JWT_SECRET,
  jwtTtlSec: parseInt(process.env.JWT_TTL_SEC || "7200", 10),
  refreshTable: process.env.REFRESH_TABLE,
  refreshTtlDays: parseInt(process.env.REFRESH_TTL_DAYS || "30", 10),
  refreshPepper: process.env.REFRESH_PEPPER,
  avatarsBucket: process.env.AVATARS_BUCKET,
  avatarMaxBytes: process.env.AVATAR_MAX_BYTES || "2097152",
  phoneDirTable: process.env.PHONE_DIR_TABLE,
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    verifySid: process.env.TWILIO_VERIFY_SID
  }
};

// ../backend/src/shared/dynamodb.ts
var dynamoClient = new import_client_dynamodb.DynamoDBClient({ region: cfg.region });
var dynamoDoc = import_lib_dynamodb.DynamoDBDocumentClient.from(dynamoClient);

// ../backend/src/phone_directory/phone_directory.repo.ts
var batchGetByPhones = async (phones) => {
  const uniq = Array.from(new Set(phones)).map((p) => ({ phone: p }));
  const out = [];
  for (let i = 0; i < uniq.length; i += 100) {
    const chunk = uniq.slice(i, i + 100);
    let unprocessed = { [cfg.phoneDirTable]: { Keys: chunk } };
    do {
      const resp = await dynamoDoc.send(
        new import_lib_dynamodb2.BatchGetCommand({
          RequestItems: {
            [cfg.phoneDirTable]: { Keys: unprocessed[cfg.phoneDirTable].Keys }
          }
        })
      );
      out.push(
        ...resp.Responses?.[cfg.phoneDirTable] ?? []
      );
      unprocessed = resp.UnprocessedKeys ?? {};
    } while (unprocessed && Object.keys(unprocessed).length);
  }
  return out;
};

// ../backend/src/users/user.repo.ts
var import_lib_dynamodb3 = require("@aws-sdk/lib-dynamodb");
var batchGetByIds = async (ids) => {
  const uniq = Array.from(new Set(ids)).map((id) => ({ userId: id }));
  const out = [];
  for (let i = 0; i < uniq.length; i += 100) {
    const chunk = uniq.slice(i, i + 100);
    let unprocessed = { [cfg.usersTable]: { Keys: chunk } };
    do {
      const r = await dynamoDoc.send(
        new import_lib_dynamodb3.BatchGetCommand({
          RequestItems: {
            [cfg.usersTable]: { Keys: unprocessed[cfg.usersTable].Keys }
          }
        })
      );
      out.push(...r.Responses?.[cfg.usersTable] ?? []);
      unprocessed = r.UnprocessedKeys ?? {};
    } while (unprocessed && Object.keys(unprocessed).length);
  }
  return out;
};

// ../backend/src/handlers/contacts/lookup.handler.ts
var isE164 = (s) => typeof s === "string" && /^\+[1-9]\d{6,15}$/.test(s);
var handler = async (event) => {
  try {
    logger.info({ message: "lookup:start" });
    const raw = event.body ?? "";
    const ctype = event.headers?.["content-type"] ?? event.headers?.["Content-Type"];
    logger.info({ message: "lookup:req", len: raw.length, ctype });
    const body = parse(raw);
    const incoming = Array.isArray(body?.phones) ? body.phones : [];
    const phones = incoming.filter(isE164);
    if (phones.length === 0) {
      logger.warn({
        message: "lookup:empty_or_invalid",
        incomingCount: incoming.length
      });
      return json(200, { users: [], count: 0 });
    }
    logger.info({
      message: "lookup:validated",
      count: phones.length,
      sample: phones.slice(0, 5)
    });
    const mappings = await batchGetByPhones(phones);
    const ids = Array.from(new Set(mappings.map((m) => m.userId)));
    if (ids.length === 0) return json(200, { users: [], count: 0 });
    const users = await batchGetByIds(ids);
    return json(200, {
      users: users.map((u) => ({
        userId: u.userId,
        phone: u.phone,
        name: u.name ?? null,
        photoKey: u.photoKey ?? null,
        createdAt: u.createdAt
      })),
      count: users.length
    });
  } catch (e) {
    logger.error({ message: "contacts/lookup failed", err: e?.message });
    return json(500, { error: "internal_error" });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
