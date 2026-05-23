var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/_internal/utils.mjs
// @__NO_SIDE_EFFECTS__
function createNotImplementedError(name) {
  return new Error(`[unenv] ${name} is not implemented yet!`);
}
__name(createNotImplementedError, "createNotImplementedError");
// @__NO_SIDE_EFFECTS__
function notImplemented(name) {
  const fn = /* @__PURE__ */ __name(() => {
    throw /* @__PURE__ */ createNotImplementedError(name);
  }, "fn");
  return Object.assign(fn, { __unenv__: true });
}
__name(notImplemented, "notImplemented");
// @__NO_SIDE_EFFECTS__
function notImplementedClass(name) {
  return class {
    __unenv__ = true;
    constructor() {
      throw new Error(`[unenv] ${name} is not implemented yet!`);
    }
  };
}
__name(notImplementedClass, "notImplementedClass");

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/perf_hooks/performance.mjs
var _timeOrigin = globalThis.performance?.timeOrigin ?? Date.now();
var _performanceNow = globalThis.performance?.now ? globalThis.performance.now.bind(globalThis.performance) : () => Date.now() - _timeOrigin;
var nodeTiming = {
  name: "node",
  entryType: "node",
  startTime: 0,
  duration: 0,
  nodeStart: 0,
  v8Start: 0,
  bootstrapComplete: 0,
  environment: 0,
  loopStart: 0,
  loopExit: 0,
  idleTime: 0,
  uvMetricsInfo: {
    loopCount: 0,
    events: 0,
    eventsWaiting: 0
  },
  detail: void 0,
  toJSON() {
    return this;
  }
};
var PerformanceEntry = class {
  static {
    __name(this, "PerformanceEntry");
  }
  __unenv__ = true;
  detail;
  entryType = "event";
  name;
  startTime;
  constructor(name, options) {
    this.name = name;
    this.startTime = options?.startTime || _performanceNow();
    this.detail = options?.detail;
  }
  get duration() {
    return _performanceNow() - this.startTime;
  }
  toJSON() {
    return {
      name: this.name,
      entryType: this.entryType,
      startTime: this.startTime,
      duration: this.duration,
      detail: this.detail
    };
  }
};
var PerformanceMark = class PerformanceMark2 extends PerformanceEntry {
  static {
    __name(this, "PerformanceMark");
  }
  entryType = "mark";
  constructor() {
    super(...arguments);
  }
  get duration() {
    return 0;
  }
};
var PerformanceMeasure = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceMeasure");
  }
  entryType = "measure";
};
var PerformanceResourceTiming = class extends PerformanceEntry {
  static {
    __name(this, "PerformanceResourceTiming");
  }
  entryType = "resource";
  serverTiming = [];
  connectEnd = 0;
  connectStart = 0;
  decodedBodySize = 0;
  domainLookupEnd = 0;
  domainLookupStart = 0;
  encodedBodySize = 0;
  fetchStart = 0;
  initiatorType = "";
  name = "";
  nextHopProtocol = "";
  redirectEnd = 0;
  redirectStart = 0;
  requestStart = 0;
  responseEnd = 0;
  responseStart = 0;
  secureConnectionStart = 0;
  startTime = 0;
  transferSize = 0;
  workerStart = 0;
  responseStatus = 0;
};
var PerformanceObserverEntryList = class {
  static {
    __name(this, "PerformanceObserverEntryList");
  }
  __unenv__ = true;
  getEntries() {
    return [];
  }
  getEntriesByName(_name, _type) {
    return [];
  }
  getEntriesByType(type) {
    return [];
  }
};
var Performance = class {
  static {
    __name(this, "Performance");
  }
  __unenv__ = true;
  timeOrigin = _timeOrigin;
  eventCounts = /* @__PURE__ */ new Map();
  _entries = [];
  _resourceTimingBufferSize = 0;
  navigation = void 0;
  timing = void 0;
  timerify(_fn, _options) {
    throw createNotImplementedError("Performance.timerify");
  }
  get nodeTiming() {
    return nodeTiming;
  }
  eventLoopUtilization() {
    return {};
  }
  markResourceTiming() {
    return new PerformanceResourceTiming("");
  }
  onresourcetimingbufferfull = null;
  now() {
    if (this.timeOrigin === _timeOrigin) {
      return _performanceNow();
    }
    return Date.now() - this.timeOrigin;
  }
  clearMarks(markName) {
    this._entries = markName ? this._entries.filter((e) => e.name !== markName) : this._entries.filter((e) => e.entryType !== "mark");
  }
  clearMeasures(measureName) {
    this._entries = measureName ? this._entries.filter((e) => e.name !== measureName) : this._entries.filter((e) => e.entryType !== "measure");
  }
  clearResourceTimings() {
    this._entries = this._entries.filter((e) => e.entryType !== "resource" || e.entryType !== "navigation");
  }
  getEntries() {
    return this._entries;
  }
  getEntriesByName(name, type) {
    return this._entries.filter((e) => e.name === name && (!type || e.entryType === type));
  }
  getEntriesByType(type) {
    return this._entries.filter((e) => e.entryType === type);
  }
  mark(name, options) {
    const entry = new PerformanceMark(name, options);
    this._entries.push(entry);
    return entry;
  }
  measure(measureName, startOrMeasureOptions, endMark) {
    let start;
    let end;
    if (typeof startOrMeasureOptions === "string") {
      start = this.getEntriesByName(startOrMeasureOptions, "mark")[0]?.startTime;
      end = this.getEntriesByName(endMark, "mark")[0]?.startTime;
    } else {
      start = Number.parseFloat(startOrMeasureOptions?.start) || this.now();
      end = Number.parseFloat(startOrMeasureOptions?.end) || this.now();
    }
    const entry = new PerformanceMeasure(measureName, {
      startTime: start,
      detail: {
        start,
        end
      }
    });
    this._entries.push(entry);
    return entry;
  }
  setResourceTimingBufferSize(maxSize) {
    this._resourceTimingBufferSize = maxSize;
  }
  addEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.addEventListener");
  }
  removeEventListener(type, listener, options) {
    throw createNotImplementedError("Performance.removeEventListener");
  }
  dispatchEvent(event) {
    throw createNotImplementedError("Performance.dispatchEvent");
  }
  toJSON() {
    return this;
  }
};
var PerformanceObserver = class {
  static {
    __name(this, "PerformanceObserver");
  }
  __unenv__ = true;
  static supportedEntryTypes = [];
  _callback = null;
  constructor(callback) {
    this._callback = callback;
  }
  takeRecords() {
    return [];
  }
  disconnect() {
    throw createNotImplementedError("PerformanceObserver.disconnect");
  }
  observe(options) {
    throw createNotImplementedError("PerformanceObserver.observe");
  }
  bind(fn) {
    return fn;
  }
  runInAsyncScope(fn, thisArg, ...args) {
    return fn.call(thisArg, ...args);
  }
  asyncId() {
    return 0;
  }
  triggerAsyncId() {
    return 0;
  }
  emitDestroy() {
    return this;
  }
};
var performance = globalThis.performance && "addEventListener" in globalThis.performance ? globalThis.performance : new Performance();

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/polyfill/performance.mjs
globalThis.performance = performance;
globalThis.Performance = Performance;
globalThis.PerformanceEntry = PerformanceEntry;
globalThis.PerformanceMark = PerformanceMark;
globalThis.PerformanceMeasure = PerformanceMeasure;
globalThis.PerformanceObserver = PerformanceObserver;
globalThis.PerformanceObserverEntryList = PerformanceObserverEntryList;
globalThis.PerformanceResourceTiming = PerformanceResourceTiming;

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
import { Writable } from "node:stream";

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/mock/noop.mjs
var noop_default = Object.assign(() => {
}, { __unenv__: true });

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/console.mjs
var _console = globalThis.console;
var _ignoreErrors = true;
var _stderr = new Writable();
var _stdout = new Writable();
var log = _console?.log ?? noop_default;
var info = _console?.info ?? log;
var trace = _console?.trace ?? info;
var debug = _console?.debug ?? log;
var table = _console?.table ?? log;
var error = _console?.error ?? log;
var warn = _console?.warn ?? error;
var createTask = _console?.createTask ?? /* @__PURE__ */ notImplemented("console.createTask");
var clear = _console?.clear ?? noop_default;
var count = _console?.count ?? noop_default;
var countReset = _console?.countReset ?? noop_default;
var dir = _console?.dir ?? noop_default;
var dirxml = _console?.dirxml ?? noop_default;
var group = _console?.group ?? noop_default;
var groupEnd = _console?.groupEnd ?? noop_default;
var groupCollapsed = _console?.groupCollapsed ?? noop_default;
var profile = _console?.profile ?? noop_default;
var profileEnd = _console?.profileEnd ?? noop_default;
var time = _console?.time ?? noop_default;
var timeEnd = _console?.timeEnd ?? noop_default;
var timeLog = _console?.timeLog ?? noop_default;
var timeStamp = _console?.timeStamp ?? noop_default;
var Console = _console?.Console ?? /* @__PURE__ */ notImplementedClass("console.Console");
var _times = /* @__PURE__ */ new Map();
var _stdoutErrorHandler = noop_default;
var _stderrErrorHandler = noop_default;

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/console.mjs
var workerdConsole = globalThis["console"];
var {
  assert,
  clear: clear2,
  // @ts-expect-error undocumented public API
  context,
  count: count2,
  countReset: countReset2,
  // @ts-expect-error undocumented public API
  createTask: createTask2,
  debug: debug2,
  dir: dir2,
  dirxml: dirxml2,
  error: error2,
  group: group2,
  groupCollapsed: groupCollapsed2,
  groupEnd: groupEnd2,
  info: info2,
  log: log2,
  profile: profile2,
  profileEnd: profileEnd2,
  table: table2,
  time: time2,
  timeEnd: timeEnd2,
  timeLog: timeLog2,
  timeStamp: timeStamp2,
  trace: trace2,
  warn: warn2
} = workerdConsole;
Object.assign(workerdConsole, {
  Console,
  _ignoreErrors,
  _stderr,
  _stderrErrorHandler,
  _stdout,
  _stdoutErrorHandler,
  _times
});
var console_default = workerdConsole;

// ../../../AppData/Roaming/npm/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-console
globalThis.console = console_default;

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/hrtime.mjs
var hrtime = /* @__PURE__ */ Object.assign(/* @__PURE__ */ __name(function hrtime2(startTime) {
  const now = Date.now();
  const seconds = Math.trunc(now / 1e3);
  const nanos = now % 1e3 * 1e6;
  if (startTime) {
    let diffSeconds = seconds - startTime[0];
    let diffNanos = nanos - startTime[0];
    if (diffNanos < 0) {
      diffSeconds = diffSeconds - 1;
      diffNanos = 1e9 + diffNanos;
    }
    return [diffSeconds, diffNanos];
  }
  return [seconds, nanos];
}, "hrtime"), { bigint: /* @__PURE__ */ __name(function bigint() {
  return BigInt(Date.now() * 1e6);
}, "bigint") });

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
import { EventEmitter } from "node:events";

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/read-stream.mjs
var ReadStream = class {
  static {
    __name(this, "ReadStream");
  }
  fd;
  isRaw = false;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  setRawMode(mode) {
    this.isRaw = mode;
    return this;
  }
};

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/tty/write-stream.mjs
var WriteStream = class {
  static {
    __name(this, "WriteStream");
  }
  fd;
  columns = 80;
  rows = 24;
  isTTY = false;
  constructor(fd) {
    this.fd = fd;
  }
  clearLine(dir3, callback) {
    callback && callback();
    return false;
  }
  clearScreenDown(callback) {
    callback && callback();
    return false;
  }
  cursorTo(x, y, callback) {
    callback && typeof callback === "function" && callback();
    return false;
  }
  moveCursor(dx, dy, callback) {
    callback && callback();
    return false;
  }
  getColorDepth(env2) {
    return 1;
  }
  hasColors(count3, env2) {
    return false;
  }
  getWindowSize() {
    return [this.columns, this.rows];
  }
  write(str, encoding, cb) {
    if (str instanceof Uint8Array) {
      str = new TextDecoder().decode(str);
    }
    try {
      console.log(str);
    } catch {
    }
    cb && typeof cb === "function" && cb();
    return false;
  }
};

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/node-version.mjs
var NODE_VERSION = "22.14.0";

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/unenv/dist/runtime/node/internal/process/process.mjs
var Process = class _Process extends EventEmitter {
  static {
    __name(this, "Process");
  }
  env;
  hrtime;
  nextTick;
  constructor(impl) {
    super();
    this.env = impl.env;
    this.hrtime = impl.hrtime;
    this.nextTick = impl.nextTick;
    for (const prop of [...Object.getOwnPropertyNames(_Process.prototype), ...Object.getOwnPropertyNames(EventEmitter.prototype)]) {
      const value = this[prop];
      if (typeof value === "function") {
        this[prop] = value.bind(this);
      }
    }
  }
  // --- event emitter ---
  emitWarning(warning, type, code) {
    console.warn(`${code ? `[${code}] ` : ""}${type ? `${type}: ` : ""}${warning}`);
  }
  emit(...args) {
    return super.emit(...args);
  }
  listeners(eventName) {
    return super.listeners(eventName);
  }
  // --- stdio (lazy initializers) ---
  #stdin;
  #stdout;
  #stderr;
  get stdin() {
    return this.#stdin ??= new ReadStream(0);
  }
  get stdout() {
    return this.#stdout ??= new WriteStream(1);
  }
  get stderr() {
    return this.#stderr ??= new WriteStream(2);
  }
  // --- cwd ---
  #cwd = "/";
  chdir(cwd2) {
    this.#cwd = cwd2;
  }
  cwd() {
    return this.#cwd;
  }
  // --- dummy props and getters ---
  arch = "";
  platform = "";
  argv = [];
  argv0 = "";
  execArgv = [];
  execPath = "";
  title = "";
  pid = 200;
  ppid = 100;
  get version() {
    return `v${NODE_VERSION}`;
  }
  get versions() {
    return { node: NODE_VERSION };
  }
  get allowedNodeEnvironmentFlags() {
    return /* @__PURE__ */ new Set();
  }
  get sourceMapsEnabled() {
    return false;
  }
  get debugPort() {
    return 0;
  }
  get throwDeprecation() {
    return false;
  }
  get traceDeprecation() {
    return false;
  }
  get features() {
    return {};
  }
  get release() {
    return {};
  }
  get connected() {
    return false;
  }
  get config() {
    return {};
  }
  get moduleLoadList() {
    return [];
  }
  constrainedMemory() {
    return 0;
  }
  availableMemory() {
    return 0;
  }
  uptime() {
    return 0;
  }
  resourceUsage() {
    return {};
  }
  // --- noop methods ---
  ref() {
  }
  unref() {
  }
  // --- unimplemented methods ---
  umask() {
    throw createNotImplementedError("process.umask");
  }
  getBuiltinModule() {
    return void 0;
  }
  getActiveResourcesInfo() {
    throw createNotImplementedError("process.getActiveResourcesInfo");
  }
  exit() {
    throw createNotImplementedError("process.exit");
  }
  reallyExit() {
    throw createNotImplementedError("process.reallyExit");
  }
  kill() {
    throw createNotImplementedError("process.kill");
  }
  abort() {
    throw createNotImplementedError("process.abort");
  }
  dlopen() {
    throw createNotImplementedError("process.dlopen");
  }
  setSourceMapsEnabled() {
    throw createNotImplementedError("process.setSourceMapsEnabled");
  }
  loadEnvFile() {
    throw createNotImplementedError("process.loadEnvFile");
  }
  disconnect() {
    throw createNotImplementedError("process.disconnect");
  }
  cpuUsage() {
    throw createNotImplementedError("process.cpuUsage");
  }
  setUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.setUncaughtExceptionCaptureCallback");
  }
  hasUncaughtExceptionCaptureCallback() {
    throw createNotImplementedError("process.hasUncaughtExceptionCaptureCallback");
  }
  initgroups() {
    throw createNotImplementedError("process.initgroups");
  }
  openStdin() {
    throw createNotImplementedError("process.openStdin");
  }
  assert() {
    throw createNotImplementedError("process.assert");
  }
  binding() {
    throw createNotImplementedError("process.binding");
  }
  // --- attached interfaces ---
  permission = { has: /* @__PURE__ */ notImplemented("process.permission.has") };
  report = {
    directory: "",
    filename: "",
    signal: "SIGUSR2",
    compact: false,
    reportOnFatalError: false,
    reportOnSignal: false,
    reportOnUncaughtException: false,
    getReport: /* @__PURE__ */ notImplemented("process.report.getReport"),
    writeReport: /* @__PURE__ */ notImplemented("process.report.writeReport")
  };
  finalization = {
    register: /* @__PURE__ */ notImplemented("process.finalization.register"),
    unregister: /* @__PURE__ */ notImplemented("process.finalization.unregister"),
    registerBeforeExit: /* @__PURE__ */ notImplemented("process.finalization.registerBeforeExit")
  };
  memoryUsage = Object.assign(() => ({
    arrayBuffers: 0,
    rss: 0,
    external: 0,
    heapTotal: 0,
    heapUsed: 0
  }), { rss: /* @__PURE__ */ __name(() => 0, "rss") });
  // --- undefined props ---
  mainModule = void 0;
  domain = void 0;
  // optional
  send = void 0;
  exitCode = void 0;
  channel = void 0;
  getegid = void 0;
  geteuid = void 0;
  getgid = void 0;
  getgroups = void 0;
  getuid = void 0;
  setegid = void 0;
  seteuid = void 0;
  setgid = void 0;
  setgroups = void 0;
  setuid = void 0;
  // internals
  _events = void 0;
  _eventsCount = void 0;
  _exiting = void 0;
  _maxListeners = void 0;
  _debugEnd = void 0;
  _debugProcess = void 0;
  _fatalException = void 0;
  _getActiveHandles = void 0;
  _getActiveRequests = void 0;
  _kill = void 0;
  _preload_modules = void 0;
  _rawDebug = void 0;
  _startProfilerIdleNotifier = void 0;
  _stopProfilerIdleNotifier = void 0;
  _tickCallback = void 0;
  _disconnect = void 0;
  _handleQueue = void 0;
  _pendingMessage = void 0;
  _channel = void 0;
  _send = void 0;
  _linkedBinding = void 0;
};

// ../../../AppData/Roaming/npm/node_modules/wrangler/node_modules/@cloudflare/unenv-preset/dist/runtime/node/process.mjs
var globalProcess = globalThis["process"];
var getBuiltinModule = globalProcess.getBuiltinModule;
var workerdProcess = getBuiltinModule("node:process");
var unenvProcess = new Process({
  env: globalProcess.env,
  hrtime,
  // `nextTick` is available from workerd process v1
  nextTick: workerdProcess.nextTick
});
var { exit, features, platform } = workerdProcess;
var {
  _channel,
  _debugEnd,
  _debugProcess,
  _disconnect,
  _events,
  _eventsCount,
  _exiting,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _handleQueue,
  _kill,
  _linkedBinding,
  _maxListeners,
  _pendingMessage,
  _preload_modules,
  _rawDebug,
  _send,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  arch,
  argv,
  argv0,
  assert: assert2,
  availableMemory,
  binding,
  channel,
  chdir,
  config,
  connected,
  constrainedMemory,
  cpuUsage,
  cwd,
  debugPort,
  disconnect,
  dlopen,
  domain,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exitCode,
  finalization,
  getActiveResourcesInfo,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getMaxListeners,
  getuid,
  hasUncaughtExceptionCaptureCallback,
  hrtime: hrtime3,
  initgroups,
  kill,
  listenerCount,
  listeners,
  loadEnvFile,
  mainModule,
  memoryUsage,
  moduleLoadList,
  nextTick,
  off,
  on,
  once,
  openStdin,
  permission,
  pid,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  reallyExit,
  ref,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  send,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setMaxListeners,
  setSourceMapsEnabled,
  setuid,
  setUncaughtExceptionCaptureCallback,
  sourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  throwDeprecation,
  title,
  traceDeprecation,
  umask,
  unref,
  uptime,
  version,
  versions
} = unenvProcess;
var _process = {
  abort,
  addListener,
  allowedNodeEnvironmentFlags,
  hasUncaughtExceptionCaptureCallback,
  setUncaughtExceptionCaptureCallback,
  loadEnvFile,
  sourceMapsEnabled,
  arch,
  argv,
  argv0,
  chdir,
  config,
  connected,
  constrainedMemory,
  availableMemory,
  cpuUsage,
  cwd,
  debugPort,
  dlopen,
  disconnect,
  emit,
  emitWarning,
  env,
  eventNames,
  execArgv,
  execPath,
  exit,
  finalization,
  features,
  getBuiltinModule,
  getActiveResourcesInfo,
  getMaxListeners,
  hrtime: hrtime3,
  kill,
  listeners,
  listenerCount,
  memoryUsage,
  nextTick,
  on,
  off,
  once,
  pid,
  platform,
  ppid,
  prependListener,
  prependOnceListener,
  rawListeners,
  release,
  removeAllListeners,
  removeListener,
  report,
  resourceUsage,
  setMaxListeners,
  setSourceMapsEnabled,
  stderr,
  stdin,
  stdout,
  title,
  throwDeprecation,
  traceDeprecation,
  umask,
  uptime,
  version,
  versions,
  // @ts-expect-error old API
  domain,
  initgroups,
  moduleLoadList,
  reallyExit,
  openStdin,
  assert: assert2,
  binding,
  send,
  exitCode,
  channel,
  getegid,
  geteuid,
  getgid,
  getgroups,
  getuid,
  setegid,
  seteuid,
  setgid,
  setgroups,
  setuid,
  permission,
  mainModule,
  _events,
  _eventsCount,
  _exiting,
  _maxListeners,
  _debugEnd,
  _debugProcess,
  _fatalException,
  _getActiveHandles,
  _getActiveRequests,
  _kill,
  _preload_modules,
  _rawDebug,
  _startProfilerIdleNotifier,
  _stopProfilerIdleNotifier,
  _tickCallback,
  _disconnect,
  _handleQueue,
  _pendingMessage,
  _channel,
  _send,
  _linkedBinding
};
var process_default = _process;

// ../../../AppData/Roaming/npm/node_modules/wrangler/_virtual_unenv_global_polyfill-@cloudflare-unenv-preset-node-process
globalThis.process = process_default;

// src/index.ts
import { WorkflowEntrypoint } from "cloudflare:workers";
var src_default = {
  async fetch(request, env2, ctx) {
    const url = new URL(request.url);
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization"
        }
      });
    }
    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json"
    };
    try {
      if (request.method === "GET" && url.pathname === "/api/projects") {
        const author = url.searchParams.get("author");
        const showTrash = url.searchParams.get("show_trash") === "true";
        const authHeader = request.headers.get("Authorization");
        const isAuthorized = authHeader === `Bearer ${env2.WORKER_SECRET}`;
        const SUPER_ADMIN = "rscbadmin@rotaract.com";
        if (isAuthorized && showTrash) {
          try {
            await env2.DB.prepare(`
              DELETE FROM projects 
              WHERE status = 'trash' 
              AND datetime(updated_at) < datetime('now', '-30 days')
            `).run();
          } catch (e) {
            console.error("Auto-purge failed:", e);
          }
        }
        let query = "SELECT p.*, (SELECT COUNT(*) FROM comments c WHERE c.project_id = p.id) as comment_count FROM projects p";
        let params = [];
        let conditions = [];
        if (!isAuthorized || isAuthorized && !showTrash) {
          conditions.push("(p.status IS NULL OR LOWER(p.status) != 'trash')");
        }
        if (author) {
          conditions.push("p.author_email = ?");
          params.push(author);
        }
        if (conditions.length > 0) {
          query += " WHERE " + conditions.join(" AND ");
        }
        query += " ORDER BY p.created_at DESC";
        const results = await env2.DB.prepare(query).bind(...params).all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/team") {
        const results = await env2.DB.prepare("SELECT * FROM team_members ORDER BY order_index ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/past-presidents") {
        const results = await env2.DB.prepare("SELECT * FROM past_presidents ORDER BY order_index ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/gallery") {
        const results = await env2.DB.prepare("SELECT * FROM gallery_slides ORDER BY order_index ASC, created_at ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/partners") {
        const results = await env2.DB.prepare("SELECT * FROM partners ORDER BY order_index ASC, created_at ASC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "POST" && url.pathname === "/api/contact") {
        const body = await request.json();
        if (!body.name || !body.email || !body.message) {
          return new Response(JSON.stringify({ error: "Missing fields" }), { status: 400, headers });
        }
        await env2.DB.prepare("INSERT INTO contact_submissions (name, email, message, phone, reason) VALUES (?, ?, ?, ?, ?)").bind(body.name, body.email, body.message, body.phone || null, body.reason || "General Inquiry").run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchMedia = url.pathname.match(/^\/media\/(.+)$/);
      if (matchMedia && request.method === "GET") {
        const key = matchMedia[1];
        const object = await env2.MEDIA_BUCKET.get(key);
        if (!object) return new Response("Not found", { status: 404 });
        const mediaHeaders = new Headers();
        object.writeHttpMetadata(mediaHeaders);
        mediaHeaders.set("Access-Control-Allow-Origin", "*");
        mediaHeaders.set("etag", object.httpEtag);
        return new Response(object.body, { headers: mediaHeaders });
      }
      const matchCommentsPublic = url.pathname.match(/^\/api\/projects\/(\d+)\/comments$/);
      if (matchCommentsPublic && request.method === "GET") {
        const projectId = matchCommentsPublic[1];
        const comments = await env2.DB.prepare("SELECT * FROM comments WHERE project_id = ? ORDER BY created_at DESC").bind(projectId).all();
        return new Response(JSON.stringify(comments.results), { headers });
      }
      const matchLike = url.pathname.match(/^\/api\/projects\/(\d+)\/like$/);
      if (matchLike && request.method === "POST") {
        const projectId = matchLike[1];
        await env2.DB.prepare("UPDATE projects SET likes = coalesce(likes, 0) + 1 WHERE id = ?").bind(projectId).run();
        const updated = await env2.DB.prepare("SELECT likes FROM projects WHERE id = ?").bind(projectId).first();
        return new Response(JSON.stringify(updated), { headers });
      }
      if (request.method === "POST" && url.pathname === "/api/newsletter/subscribe") {
        const body = await request.json();
        if (!body.email) {
          return new Response(JSON.stringify({ error: "Email is required" }), { status: 400, headers });
        }
        const forceResubscribe = body.forceResubscribe !== false;
        const token = crypto.randomUUID();
        const clerkId = body.clerk_id || null;
        try {
          if (forceResubscribe) {
            await env2.DB.prepare(`
              INSERT INTO newsletter_subscribers (email, name, token, clerk_id, subscribed)
              VALUES (?, ?, ?, ?, 1)
              ON CONFLICT(email) DO UPDATE SET
                subscribed=1,
                clerk_id=COALESCE(EXCLUDED.clerk_id, newsletter_subscribers.clerk_id),
                token=COALESCE(newsletter_subscribers.token, EXCLUDED.token)
            `).bind(body.email.toLowerCase().trim(), body.name || null, token, clerkId).run();
          } else {
            await env2.DB.prepare(`
              INSERT INTO newsletter_subscribers (email, name, token, clerk_id, subscribed)
              VALUES (?, ?, ?, ?, 1)
              ON CONFLICT(email) DO UPDATE SET
                clerk_id=COALESCE(EXCLUDED.clerk_id, newsletter_subscribers.clerk_id),
                token=COALESCE(newsletter_subscribers.token, EXCLUDED.token)
            `).bind(body.email.toLowerCase().trim(), body.name || null, token, clerkId).run();
          }
          return new Response(JSON.stringify({ success: true, message: "Subscribed" }), { headers });
        } catch (e) {
          return new Response(JSON.stringify({ error: e.message }), { status: 500, headers });
        }
      }
      if (request.method === "GET" && url.pathname === "/api/newsletter/lookup") {
        const clerkId = url.searchParams.get("clerk_id");
        if (!clerkId) return new Response(JSON.stringify({ error: "clerk_id required" }), { status: 400, headers });
        const user = await env2.DB.prepare("SELECT * FROM newsletter_subscribers WHERE clerk_id = ?").bind(clerkId).first();
        if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404, headers });
        return new Response(JSON.stringify(user), { headers });
      }
      if (request.method === "DELETE" && url.pathname === "/api/newsletter/subscriber") {
        const clerkId = url.searchParams.get("clerk_id");
        if (!clerkId) return new Response(JSON.stringify({ error: "clerk_id required" }), { status: 400, headers });
        const result = await env2.DB.prepare("DELETE FROM newsletter_subscribers WHERE clerk_id = ?").bind(clerkId).run();
        return new Response(JSON.stringify({ success: true, deleted: result.meta.changes > 0 }), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/newsletter/unsubscribe") {
        const token = url.searchParams.get("token");
        if (!token || token === "undefined" || token === "null") {
          return new Response(JSON.stringify({ error: "Invalid or missing token" }), { status: 400, headers });
        }
        const result = await env2.DB.prepare("UPDATE newsletter_subscribers SET subscribed=0 WHERE token=?").bind(token).run();
        if (result.meta.changes === 0) {
          return new Response(JSON.stringify({ error: "Token not found" }), { status: 404, headers });
        }
        return new Response(JSON.stringify({ success: true, message: "Unsubscribed" }), { headers });
      }
      const auth = request.headers.get("Authorization");
      if (auth !== `Bearer ${env2.WORKER_SECRET}`) {
        return new Response(JSON.stringify({ error: "Unauthorized", received: auth }), { status: 401, headers });
      }
      if (request.method === "POST" && url.pathname === "/api/projects") {
        const body = await request.json();
        const authorEmail = body.author_email;
        if (!authorEmail) {
          return new Response(JSON.stringify({ error: "Unauthorized: author_email is required." }), { status: 401, headers });
        }
        const admin = await env2.DB.prepare("SELECT role FROM authorized_admins WHERE email = ?").bind(authorEmail).first();
        if (!admin) {
          if (body.type !== "blog") {
            return new Response(JSON.stringify({ error: "Unauthorized: Only whitelisted admins can manage projects/events." }), { status: 403, headers });
          }
        } else if (admin.role === "blogger" && body.type !== "blog") {
          return new Response(JSON.stringify({ error: "Forbidden: Bloggers can only create blog posts." }), { status: 403, headers });
        }
        const slug = body.slug || `post-${Date.now()}`;
        const existing = await env2.DB.prepare("SELECT id FROM projects WHERE slug = ?").bind(slug).first();
        if (existing) {
          return new Response(JSON.stringify({
            error: `Slug collision: The URL slug '${slug}' is already taken.`,
            details: `A project with slug '${slug}' already exists in the database. Please choose a different title or slug.`,
            colliding_slug: slug
          }), { status: 409, headers });
        }
        const result = await env2.DB.prepare(
          "INSERT INTO projects (title, slug, category, year, description, image_url, content, type, status, author_email, gallery_urls, rsvp_link, event_date, featured_links) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        ).bind(
          body.title || "Untitled",
          slug,
          body.category || "General",
          body.year || (/* @__PURE__ */ new Date()).getFullYear().toString(),
          body.description || "",
          body.image_url || null,
          body.content || "",
          body.type || "project",
          body.status || "completed",
          body.author_email || null,
          typeof body.gallery_urls === "string" ? body.gallery_urls : JSON.stringify(body.gallery_urls || []),
          body.rsvp_link || null,
          body.event_date || null,
          typeof body.featured_links === "string" ? body.featured_links : JSON.stringify(body.featured_links || [])
        ).run();
        const insertedId = result.meta.last_row_id;
        if (env2.EVENT_REMINDER_WORKFLOW && (body.type === "blog" || body.type === "project" || body.type === "event")) {
          try {
            await env2.EVENT_REMINDER_WORKFLOW.create({
              id: `event-${insertedId}`,
              params: { eventId: insertedId, type: body.type }
            });
            console.log(`[Workflow] Spawned workflow for event-${insertedId} (type: ${body.type})`);
          } catch (err) {
            console.error(`[Workflow] Failed to trigger workflow:`, err.message);
          }
        }
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchProject = url.pathname.match(/^\/api\/projects\/(\d+)$/);
      if (matchProject) {
        const id = matchProject[1];
        if (request.method === "GET") {
          const result = await env2.DB.prepare("SELECT p.*, (SELECT COUNT(*) FROM comments c WHERE c.project_id = p.id) as comment_count FROM projects p WHERE p.id=?").bind(id).first();
          if (!result) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
          return new Response(JSON.stringify(result), { headers });
        }
        if (request.method === "PUT" || request.method === "DELETE") {
          const body = await (request.method === "PUT" ? request.clone().json() : {});
          const userEmail = body.author_email || url.searchParams.get("user_email");
          if (!userEmail) {
            return new Response(JSON.stringify({ error: "user_email is required for this operation." }), { status: 400, headers });
          }
          const project = await env2.DB.prepare("SELECT author_email FROM projects WHERE id = ?").bind(id).first();
          if (!project) return new Response(JSON.stringify({ error: "Project not found" }), { status: 404, headers });
          const admin = await env2.DB.prepare("SELECT role FROM authorized_admins WHERE email = ?").bind(userEmail).first();
          const isMasterAdmin = userEmail.toLowerCase() === "rscbadmin@rotaract.com";
          if (!admin && !isMasterAdmin && project.author_email !== userEmail) {
            return new Response(JSON.stringify({ error: "Unauthorized: Access Denied." }), { status: 403, headers });
          }
          if (admin && admin.role !== "admin" && !isMasterAdmin && project.author_email !== userEmail) {
            return new Response(JSON.stringify({ error: "Forbidden: You can only manage your own content." }), { status: 403, headers });
          }
          if (request.method === "PUT") {
            await env2.DB.prepare(
              "UPDATE projects SET title=?, slug=?, category=?, year=?, description=?, image_url=?, content=?, type=?, status=?, gallery_urls=?, rsvp_link=?, event_date=?, featured_links=?, updated_at=datetime('now') WHERE id=?"
            ).bind(
              body.title || "Untitled",
              body.slug || "unknown",
              body.category || "General",
              body.year || "2024",
              body.description || "",
              body.image_url || null,
              body.content || "",
              body.type || "project",
              body.status || "completed",
              typeof body.gallery_urls === "string" ? body.gallery_urls : JSON.stringify(body.gallery_urls || []),
              body.rsvp_link || null,
              body.event_date || null,
              typeof body.featured_links === "string" ? body.featured_links : JSON.stringify(body.featured_links || []),
              id
            ).run();
            if (env2.EVENT_REMINDER_WORKFLOW) {
              const numId = parseInt(id);
              try {
                const existing = await env2.EVENT_REMINDER_WORKFLOW.get(`event-${numId}`);
                if (existing) {
                  await existing.terminate();
                  console.log(`[Workflow] Terminated existing workflow for event-${numId}`);
                }
              } catch (e) {
              }
              if (body.status !== "trash" && body.status !== "draft" && (body.type === "blog" || body.type === "project" || body.type === "event")) {
                try {
                  await env2.EVENT_REMINDER_WORKFLOW.create({
                    id: `event-${numId}`,
                    params: { eventId: numId, type: body.type }
                  });
                  console.log(`[Workflow] Spawned updated workflow for event-${numId} (type: ${body.type})`);
                } catch (err) {
                  console.error(`[Workflow] Failed to spawn updated workflow:`, err.message);
                }
              }
            }
            return new Response(JSON.stringify({ success: true }), { headers });
          }
          if (request.method === "DELETE") {
            await env2.DB.prepare("DELETE FROM projects WHERE id=?").bind(id).run();
            if (env2.EVENT_REMINDER_WORKFLOW) {
              const numId = parseInt(id);
              try {
                const existing = await env2.EVENT_REMINDER_WORKFLOW.get(`event-${numId}`);
                if (existing) {
                  await existing.terminate();
                  console.log(`[Workflow] Terminated workflow for deleted event-${numId}`);
                }
              } catch (e) {
              }
            }
            return new Response(JSON.stringify({ success: true }), { headers });
          }
        }
      }
      if (request.method === "POST" && url.pathname === "/api/team") {
        const body = await request.json();
        await env2.DB.prepare("UPDATE team_members SET order_index = order_index + 1 WHERE order_index >= ?").bind(body.order_index || 0).run();
        await env2.DB.prepare(
          "INSERT INTO team_members (name, role, period, image_url, bio, order_index) VALUES (?, ?, ?, ?, ?, ?)"
        ).bind(body.name, body.role, body.period, body.image_url || null, body.bio || null, body.order_index || 0).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchTeam = url.pathname.match(/^\/api\/team\/(\d+)$/);
      if (matchTeam) {
        const id = matchTeam[1];
        if (request.method === "GET") {
          const result = await env2.DB.prepare("SELECT * FROM team_members WHERE id=?").bind(id).first();
          if (!result) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
          return new Response(JSON.stringify(result), { headers });
        }
        if (request.method === "PUT") {
          const body = await request.json();
          const oldMember = await env2.DB.prepare("SELECT order_index FROM team_members WHERE id=?").bind(id).first();
          if (oldMember) {
            const oldIndex = oldMember.order_index;
            const newIndex = body.order_index || 0;
            if (oldIndex !== newIndex) {
              if (newIndex < oldIndex) {
                await env2.DB.prepare("UPDATE team_members SET order_index = order_index + 1 WHERE order_index >= ? AND order_index < ?").bind(newIndex, oldIndex).run();
              } else {
                await env2.DB.prepare("UPDATE team_members SET order_index = order_index - 1 WHERE order_index > ? AND order_index <= ?").bind(oldIndex, newIndex).run();
              }
            }
          }
          await env2.DB.prepare(
            "UPDATE team_members SET name=?, role=?, period=?, image_url=?, bio=?, order_index=? WHERE id=?"
          ).bind(body.name, body.role, body.period, body.image_url || null, body.bio || null, body.order_index || 0, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (request.method === "DELETE") {
          const oldMember = await env2.DB.prepare("SELECT order_index FROM team_members WHERE id=?").bind(id).first();
          if (oldMember) {
            const oldIndex = oldMember.order_index;
            await env2.DB.prepare("UPDATE team_members SET order_index = order_index - 1 WHERE order_index > ?").bind(oldIndex).run();
          }
          await env2.DB.prepare("DELETE FROM team_members WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }
      if (request.method === "POST" && url.pathname === "/api/team/reorder") {
        const body = await request.json();
        const statements = body.map(
          (item) => env2.DB.prepare("UPDATE team_members SET order_index = ? WHERE id = ?").bind(item.order_index, item.id)
        );
        await env2.DB.batch(statements);
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/authorized-admins") {
        const results = await env2.DB.prepare("SELECT * FROM authorized_admins ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/authorized-admins/check") {
        const email = url.searchParams.get("email");
        if (!email) return new Response(JSON.stringify({ role: null }), { headers });
        const admin = await env2.DB.prepare("SELECT role FROM authorized_admins WHERE email = ?").bind(email).first();
        return new Response(JSON.stringify({ role: admin?.role || null }), { headers });
      }
      if (request.method === "POST" && url.pathname === "/api/authorized-admins") {
        const body = await request.json();
        const exists = await env2.DB.prepare("SELECT id FROM authorized_admins WHERE email=?").bind(body.email).first();
        if (exists) {
          return new Response(JSON.stringify({ error: "Email already authorized" }), { status: 400, headers });
        }
        await env2.DB.prepare("INSERT INTO authorized_admins (email, role, name) VALUES (?, ?, ?)").bind(body.email, body.role || "editor", body.name || null).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchAdmins = url.pathname.match(/^\/api\/authorized-admins\/(\d+)$/);
      if (matchAdmins && request.method === "DELETE") {
        await env2.DB.prepare("DELETE FROM authorized_admins WHERE id=?").bind(matchAdmins[1]).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      if (request.method === "POST" && url.pathname === "/api/past-presidents") {
        const body = await request.json();
        await env2.DB.prepare("UPDATE past_presidents SET order_index = order_index + 1 WHERE order_index >= ?").bind(body.order_index || 0).run();
        await env2.DB.prepare(
          "INSERT INTO past_presidents (name, period, image_url, order_index) VALUES (?, ?, ?, ?)"
        ).bind(body.name, body.period, body.image_url || null, body.order_index || 0).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchPastPres = url.pathname.match(/^\/api\/past-presidents\/(\d+)$/);
      if (matchPastPres) {
        const id = matchPastPres[1];
        if (request.method === "GET") {
          const result = await env2.DB.prepare("SELECT * FROM past_presidents WHERE id=?").bind(id).first();
          if (!result) return new Response(JSON.stringify({ error: "Not found" }), { status: 404, headers });
          return new Response(JSON.stringify(result), { headers });
        }
        if (request.method === "PUT") {
          const body = await request.json();
          const oldMember = await env2.DB.prepare("SELECT order_index FROM past_presidents WHERE id=?").bind(id).first();
          if (oldMember) {
            const oldIndex = oldMember.order_index;
            const newIndex = body.order_index || 0;
            if (oldIndex !== newIndex) {
              if (newIndex < oldIndex) {
                await env2.DB.prepare("UPDATE past_presidents SET order_index = order_index + 1 WHERE order_index >= ? AND order_index < ?").bind(newIndex, oldIndex).run();
              } else {
                await env2.DB.prepare("UPDATE past_presidents SET order_index = order_index - 1 WHERE order_index > ? AND order_index <= ?").bind(oldIndex, newIndex).run();
              }
            }
          }
          await env2.DB.prepare(
            "UPDATE past_presidents SET name=?, period=?, image_url=?, order_index=? WHERE id=?"
          ).bind(body.name, body.period, body.image_url || null, body.order_index || 0, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (request.method === "DELETE") {
          const oldMember = await env2.DB.prepare("SELECT order_index FROM past_presidents WHERE id=?").bind(id).first();
          if (oldMember) {
            const oldIndex = oldMember.order_index;
            await env2.DB.prepare("UPDATE past_presidents SET order_index = order_index - 1 WHERE order_index > ?").bind(oldIndex).run();
          }
          await env2.DB.prepare("DELETE FROM past_presidents WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }
      if (request.method === "POST" && url.pathname === "/api/past-presidents/reorder") {
        const body = await request.json();
        const statements = body.map(
          (item) => env2.DB.prepare("UPDATE past_presidents SET order_index = ? WHERE id = ?").bind(item.order_index, item.id)
        );
        await env2.DB.batch(statements);
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/messages") {
        const results = await env2.DB.prepare("SELECT * FROM contact_submissions ORDER BY created_at DESC").all();
        return new Response(JSON.stringify(results.results || []), { headers });
      }
      const matchMessage = url.pathname.match(/^\/api\/messages\/(\d+)$/);
      if (matchMessage && request.method === "PUT") {
        const id = matchMessage[1];
        const body = await request.json();
        await env2.DB.prepare("UPDATE contact_submissions SET status=? WHERE id=?").bind(body.status, id).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      if (request.method === "POST" && url.pathname === "/api/upload") {
        const contentType = request.headers.get("Content-Type") || "";
        if (!contentType.includes("multipart/form-data")) {
          return new Response(JSON.stringify({ error: "Only multipart/form-data is supported" }), { status: 400, headers });
        }
        const formData = await request.formData();
        const file = formData.get("file");
        if (!file) {
          return new Response(JSON.stringify({ error: "No file provided" }), { status: 400, headers });
        }
        const key = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        await env2.MEDIA_BUCKET.put(key, await file.arrayBuffer(), {
          httpMetadata: { contentType: file.type }
        });
        const baseUrl = new URL(request.url).origin;
        const publicUrl = `${baseUrl}/media/${key}`;
        return new Response(JSON.stringify({ url: publicUrl, key }), { headers });
      }
      const matchComments = url.pathname.match(/^\/api\/projects\/(\d+)\/comments$/);
      if (matchComments && request.method === "POST") {
        const projectId = matchComments[1];
        const body = await request.json();
        await env2.DB.prepare(
          "INSERT INTO comments (project_id, user_name, user_email, user_image, content) VALUES (?, ?, ?, ?, ?)"
        ).bind(projectId, body.user_name, body.user_email, body.user_image || null, body.content).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      if (request.method === "POST" && url.pathname === "/api/gallery") {
        const body = await request.json();
        if (!body.title || !body.image_url) {
          return new Response(JSON.stringify({ error: "title and image_url are required" }), { status: 400, headers });
        }
        const countResult = await env2.DB.prepare("SELECT COUNT(*) as count FROM gallery_slides").first();
        const nextOrder = body.order_index ?? (countResult?.count ?? 0);
        await env2.DB.prepare(
          "INSERT INTO gallery_slides (title, caption, image_url, order_index) VALUES (?, ?, ?, ?)"
        ).bind(body.title, body.caption || "", body.image_url, nextOrder).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchGallery = url.pathname.match(/^\/api\/gallery\/(\d+)$/);
      if (matchGallery) {
        const id = matchGallery[1];
        if (request.method === "PUT") {
          const body = await request.json();
          await env2.DB.prepare(
            "UPDATE gallery_slides SET title=?, caption=?, image_url=?, order_index=? WHERE id=?"
          ).bind(body.title, body.caption || "", body.image_url, body.order_index ?? 0, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (request.method === "DELETE") {
          await env2.DB.prepare("DELETE FROM gallery_slides WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }
      if (request.method === "POST" && url.pathname === "/api/partners") {
        const body = await request.json();
        if (!body.name || !body.image_url) {
          return new Response(JSON.stringify({ error: "name and image_url are required" }), { status: 400, headers });
        }
        const countResult = await env2.DB.prepare("SELECT COUNT(*) as count FROM partners").first();
        const nextOrder = body.order_index ?? (countResult?.count ?? 0);
        await env2.DB.prepare(
          "INSERT INTO partners (name, image_url, order_index) VALUES (?, ?, ?)"
        ).bind(body.name, body.image_url, nextOrder).run();
        return new Response(JSON.stringify({ success: true }), { headers });
      }
      const matchPartner = url.pathname.match(/^\/api\/partners\/(\d+)$/);
      if (matchPartner) {
        const id = matchPartner[1];
        if (request.method === "PUT") {
          const body = await request.json();
          await env2.DB.prepare(
            "UPDATE partners SET name=?, image_url=?, order_index=? WHERE id=?"
          ).bind(body.name, body.image_url, body.order_index ?? 0, id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
        if (request.method === "DELETE") {
          await env2.DB.prepare("DELETE FROM partners WHERE id=?").bind(id).run();
          return new Response(JSON.stringify({ success: true }), { headers });
        }
      }
      if (request.method === "GET" && url.pathname === "/api/newsletter/subscribers") {
        const results = await env2.DB.prepare(
          "SELECT email, name, token FROM newsletter_subscribers WHERE subscribed=1 ORDER BY created_at DESC"
        ).all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "GET" && url.pathname === "/api/newsletter/unsubscribed") {
        const results = await env2.DB.prepare(
          "SELECT email, name, token, created_at FROM newsletter_subscribers WHERE subscribed=0 ORDER BY created_at DESC"
        ).all();
        return new Response(JSON.stringify(results.results), { headers });
      }
      if (request.method === "DELETE" && url.pathname === "/api/newsletter/purge") {
        await env2.DB.prepare("DELETE FROM newsletter_subscribers").run();
        return new Response(JSON.stringify({ success: true, message: "All subscribers purged" }), { headers });
      }
      return new Response(JSON.stringify({ error: "Not found", path: url.pathname }), { status: 404, headers });
    } catch (err) {
      console.error("Worker Error:", err.message, err.stack);
      return new Response(JSON.stringify({
        error: err.message,
        stack: err.stack,
        details: "Check worker logs for more info"
      }), { status: 500, headers });
    }
  },
  // --- AUTOMATED CRON JOB ---
  // This runs automatically based on the schedule set in wrangler.toml (e.g., once a day)
  async scheduled(event, env2, ctx) {
    console.log("[Cron] Checking for upcoming event reminders...");
    const siteUrl = env2.SITE_URL || "https://rcsb-website.pages.dev";
    try {
      const res = await fetch(`${siteUrl}/api/newsletter/reminders`, {
        method: "POST",
        headers: {
          "x-internal-key": env2.WORKER_SECRET
        }
      });
      if (res.ok) {
        const data = await res.json();
        console.log("[Cron] Reminder check completed:", data);
      } else {
        const errText = await res.text();
        console.error("[Cron] Reminder check failed:", errText);
      }
    } catch (err) {
      console.error("[Cron] Network error during reminder check:", err);
    }
  }
};
var EventReminderWorkflow = class extends WorkflowEntrypoint {
  static {
    __name(this, "EventReminderWorkflow");
  }
  async run(event, step) {
    const { eventId, type } = event.payload || {};
    console.log(`[Workflow] Started EventReminderWorkflow. Payload: ${JSON.stringify(event.payload)}`);
    if (!eventId) {
      console.warn("[Workflow] Error: eventId is missing in the payload. Stopping workflow.");
      return;
    }
    const ONE_DAY = 24 * 60 * 60 * 1e3;
    await step.do("Send initial creation email", async () => {
      const siteUrl = this.env.SITE_URL || "https://rcsb-website.pages.dev";
      const response = await fetch(`${siteUrl}/api/newsletter/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-internal-key": this.env.WORKER_SECRET
        },
        body: JSON.stringify({ eventId, isNewPost: true })
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send initial creation email: ${errorText}`);
      }
      return { status: "sent" };
    });
    if (type === "blog") {
      console.log(`[Workflow] Blog creation email sent. Exiting workflow for blog ID: ${eventId}`);
      return;
    }
    let eventDetails = await step.do("Fetch event details", async () => {
      return await getEventFromDb(this.env.DB, eventId);
    });
    if (!eventDetails || eventDetails.status === "trash" || !eventDetails.event_date) {
      console.log(`[Workflow] Event/Project ${eventId} has no event date or is inactive. Exiting.`);
      return;
    }
    let eventTime = new Date(eventDetails.event_date).getTime();
    let twoDaysNear = eventTime - 2 * ONE_DAY;
    while (Date.now() < twoDaysNear) {
      let nextSleepTarget = Math.min(Date.now() + 2 * ONE_DAY, twoDaysNear);
      console.log(`[Workflow] Sleeping until next 2-day milestone: ${new Date(nextSleepTarget).toISOString()}`);
      await step.sleepUntil("Wait for next 2-day milestone", new Date(nextSleepTarget));
      eventDetails = await step.do("Re-fetch event details after 2-day sleep", async () => {
        return await getEventFromDb(this.env.DB, eventId);
      });
      if (!eventDetails || eventDetails.status === "trash" || !eventDetails.event_date) {
        console.log(`[Workflow] Event ${eventId} became inactive or date was cleared. Exiting.`);
        return;
      }
      eventTime = new Date(eventDetails.event_date).getTime();
      twoDaysNear = eventTime - 2 * ONE_DAY;
      const daysRemaining = Math.max(1, Math.round((eventTime - Date.now()) / ONE_DAY));
      await step.do("Send periodic update reminder", async () => {
        const siteUrl = this.env.SITE_URL || "https://rcsb-website.pages.dev";
        const response = await fetch(`${siteUrl}/api/newsletter/reminders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-key": this.env.WORKER_SECRET
          },
          body: JSON.stringify({ eventId, daysRemaining })
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to send periodic reminder: ${errorText}`);
        }
        return { status: "sent", daysRemaining };
      });
    }
    while (Date.now() < eventTime) {
      let nextSleepTarget = Math.min(Date.now() + ONE_DAY, eventTime);
      console.log(`[Workflow] Sleeping until next daily milestone: ${new Date(nextSleepTarget).toISOString()}`);
      await step.sleepUntil("Wait for daily milestone", new Date(nextSleepTarget));
      eventDetails = await step.do("Re-verify event details during countdown", async () => {
        return await getEventFromDb(this.env.DB, eventId);
      });
      if (!eventDetails || eventDetails.status === "trash" || !eventDetails.event_date) {
        console.log(`[Workflow] Event ${eventId} became inactive during countdown. Exiting.`);
        return;
      }
      eventTime = new Date(eventDetails.event_date).getTime();
      const daysRemaining = Math.max(1, Math.round((eventTime - Date.now()) / ONE_DAY));
      await step.do("Send daily countdown reminder", async () => {
        const siteUrl = this.env.SITE_URL || "https://rcsb-website.pages.dev";
        const response = await fetch(`${siteUrl}/api/newsletter/reminders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-key": this.env.WORKER_SECRET
          },
          body: JSON.stringify({ eventId, daysRemaining })
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to send daily countdown: ${errorText}`);
        }
        return { status: "sent", daysRemaining };
      });
    }
    const recapTime = eventTime + 4 * ONE_DAY;
    if (Date.now() < recapTime) {
      console.log(`[Workflow] Sleeping until 4 days post-event: ${new Date(recapTime).toISOString()}`);
      await step.sleepUntil("Wait for 4-day post-event recap", new Date(recapTime));
      eventDetails = await step.do("Re-fetch event details for recap", async () => {
        return await getEventFromDb(this.env.DB, eventId);
      });
      if (!eventDetails || eventDetails.status === "trash") {
        console.log(`[Workflow] Event ${eventId} is deleted. Skipping post-event recap.`);
        return;
      }
      await step.do("Send post-event recap", async () => {
        const siteUrl = this.env.SITE_URL || "https://rcsb-website.pages.dev";
        const response = await fetch(`${siteUrl}/api/newsletter/reminders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-key": this.env.WORKER_SECRET
          },
          body: JSON.stringify({ eventId, isPostEvent: true })
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to send post-event recap: ${errorText}`);
        }
        return { status: "sent" };
      });
    }
  }
};
async function getEventFromDb(db, eventId) {
  return await db.prepare("SELECT status, type, event_date, title, slug FROM projects WHERE id = ?").bind(eventId).first();
}
__name(getEventFromDb, "getEventFromDb");

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env2, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env2);
  } catch (e) {
    const error3 = reduceError(e);
    return Response.json(error3, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-wx64Yi/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// ../../../AppData/Roaming/npm/node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env2, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env2, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env2, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env2, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-wx64Yi/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env2, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env2, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env2, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env2, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env2, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env2, ctx) => {
      this.env = env2;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  EventReminderWorkflow,
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
