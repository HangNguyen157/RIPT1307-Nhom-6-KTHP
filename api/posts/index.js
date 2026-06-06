'use strict';
let __create = Object.create;
let __defProp = Object.defineProperty;
let __getOwnPropDesc = Object.getOwnPropertyDescriptor;
let __getOwnPropNames = Object.getOwnPropertyNames;
let __getProtoOf = Object.getPrototypeOf;
let __hasOwnProp = Object.prototype.hasOwnProperty;
let __commonJS = (cb, mod) =>
  function __require() {
    return (
      mod ||
        (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod),
      mod.exports
    );
  };
let __export = (target, all) => {
  for (let name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
let __copyProps = (to, from, except, desc) => {
  if ((from && typeof from === 'object') || typeof from === 'function') {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, {
          get: () => from[key],
          enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable,
        });
  }
  return to;
};
let __toESM = (mod, isNodeMode, target) => (
  (target = mod != null ? __create(__getProtoOf(mod)) : {}),
  __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule
      ? __defProp(target, 'default', { value: mod, enumerable: true })
      : target,
    mod,
  )
);
let __toCommonJS = (mod) =>
  __copyProps(__defProp({}, '__esModule', { value: true }), mod);

// node_modules/@umijs/preset-umi/dist/features/apiRoute/utils.js
let require_utils = __commonJS({
  'node_modules/@umijs/preset-umi/dist/features/apiRoute/utils.js'(
    exports2,
    module2,
  ) {
    let __defProp2 = Object.defineProperty;
    let __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    let __getOwnPropNames2 = Object.getOwnPropertyNames;
    let __hasOwnProp2 = Object.prototype.hasOwnProperty;
    let __export2 = (target, all) => {
      for (let name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    let __copyProps2 = (to, from, except, desc) => {
      if ((from && typeof from === 'object') || typeof from === 'function') {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, {
              get: () => from[key],
              enumerable:
                !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable,
            });
      }
      return to;
    };
    let __toCommonJS2 = (mod) =>
      __copyProps2(__defProp2({}, '__esModule', { value: true }), mod);
    let utils_exports = {};
    __export2(utils_exports, {
      esbuildIgnorePathPrefixPlugin: () => esbuildIgnorePathPrefixPlugin,
      matchApiRoute: () => matchApiRoute2,
    });
    module2.exports = __toCommonJS2(utils_exports);
    function esbuildIgnorePathPrefixPlugin() {
      return {
        name: 'ignore-path-prefix',
        setup(build) {
          build.onResolve({ filter: /^@fs/ }, (args) => ({
            path: args.path.replace(/^@fs/, ''),
          }));
        },
      };
    }
    function matchApiRoute2(apiRoutes2, path) {
      if (path.startsWith('/')) path = path.substring(1);
      if (path.startsWith('api/')) path = path.substring(4);
      const pathSegments = path.split('/').filter((p) => p !== '');
      if (
        pathSegments.length === 0 ||
        (pathSegments.length === 1 && pathSegments[0] === 'api')
      ) {
        const route2 = apiRoutes2.find((r) => r.path === '/');
        if (route2) return { route: route2, params: {} };
        else return void 0;
      }
      const params = {};
      const route = apiRoutes2.find((route2) => {
        const routePathSegments = route2.path
          .split('/')
          .filter((p) => p !== '');
        if (routePathSegments.length !== pathSegments.length) return false;
        for (let i = 0; i < routePathSegments.length; i++) {
          const routePathSegment = routePathSegments[i];
          if (routePathSegment.match(/^\[.*]$/)) {
            params[routePathSegment.substring(1, routePathSegment.length - 1)] =
              pathSegments[i];
            if (i == routePathSegments.length - 1) return true;
            continue;
          }
          if (routePathSegment !== pathSegments[i]) return false;
          if (i == routePathSegments.length - 1) return true;
        }
      });
      if (route) return { route, params };
    }
  },
});

// node_modules/@umijs/preset-umi/dist/features/apiRoute/request.js
let require_request = __commonJS({
  'node_modules/@umijs/preset-umi/dist/features/apiRoute/request.js'(
    exports2,
    module2,
  ) {
    let __defProp2 = Object.defineProperty;
    let __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    let __getOwnPropNames2 = Object.getOwnPropertyNames;
    let __hasOwnProp2 = Object.prototype.hasOwnProperty;
    let __export2 = (target, all) => {
      for (let name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    let __copyProps2 = (to, from, except, desc) => {
      if ((from && typeof from === 'object') || typeof from === 'function') {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, {
              get: () => from[key],
              enumerable:
                !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable,
            });
      }
      return to;
    };
    let __toCommonJS2 = (mod) =>
      __copyProps2(__defProp2({}, '__esModule', { value: true }), mod);
    let request_exports = {};
    __export2(request_exports, {
      default: () => request_default,
      parseMultipart: () => parseMultipart,
      parseUrlEncoded: () => parseUrlEncoded,
    });
    module2.exports = __toCommonJS2(request_exports);
    let import_utils = require_utils();
    let UmiApiRequest3 = class {
      _req;
      _params = {};
      constructor(req, apiRoutes2) {
        this._req = req;
        const m = (0, import_utils.matchApiRoute)(
          apiRoutes2,
          this.pathName || '',
        );
        if (m) this._params = m.params;
      }
      get params() {
        return this._params;
      }
      _body = null;
      get body() {
        return this._body;
      }
      get headers() {
        return this._req.headers;
      }
      get method() {
        return this._req.method;
      }
      get query() {
        let _a, _b;
        return (
          ((_b = (_a = this._req.url) == null ? void 0 : _a.split('?')[1]) ==
          null
            ? void 0
            : _b.split('&').reduce((acc, cur) => {
                const [key, value] = cur.split('=');
                const k = acc[key];
                if (k) {
                  if (k instanceof Array) {
                    k.push(value);
                  } else {
                    acc[key] = [k, value];
                  }
                } else {
                  acc[key] = value;
                }
                return acc;
              }, {})) || {}
        );
      }
      get cookies() {
        let _a;
        return (_a = this._req.headers.cookie) == null
          ? void 0
          : _a.split(';').reduce((acc, cur) => {
              const [key, value] = cur.split('=');
              acc[key.trim()] = value;
              return acc;
            }, {});
      }
      get url() {
        return this._req.url;
      }
      get pathName() {
        let _a;
        return (_a = this._req.url) == null ? void 0 : _a.split('?')[0];
      }
      readBody() {
        if (this._req.headers['content-length'] === '0') {
          return Promise.resolve();
        }
        return new Promise((resolve, reject) => {
          let body = [];
          this._req.on('data', (chunk) => {
            body.push(chunk);
          });
          this._req.on('end', () => {
            let _a, _b;
            const bodyBuffer = Buffer.concat(body);
            switch (
              (_a = this._req.headers['content-type']) == null
                ? void 0
                : _a.split(';')[0]
            ) {
              case 'application/json':
                try {
                  this._body = JSON.parse(bodyBuffer.toString());
                } catch (e) {
                  this._body = body;
                }
                break;
              case 'multipart/form-data':
                const boundary =
                  (_b = this.headers['content-type']) == null
                    ? void 0
                    : _b.split('boundary=')[1];
                if (!boundary) {
                  this._body = body;
                  break;
                }
                this._body = parseMultipart(bodyBuffer, boundary);
                break;
              case 'application/x-www-form-urlencoded':
                this._body = parseUrlEncoded(bodyBuffer.toString());
                break;
              default:
                this._body = body;
                break;
            }
            resolve();
          });
          this._req.on('error', reject);
        });
      }
    };
    function parseMultipart(body, boundary) {
      const hexBoundary = Buffer.from(`--${boundary}`, 'utf-8').toString('hex');
      return body
        .toString('hex')
        .split(hexBoundary)
        .reduce((acc, cur) => {
          let _a, _b;
          const [hexMeta, hexValue] = cur.split(
            Buffer.from('\r\n\r\n').toString('hex'),
          );
          const meta = Buffer.from(hexMeta, 'hex').toString('utf-8');
          const name =
            (_a = meta.split('name="')[1]) == null ? void 0 : _a.split('"')[0];
          if (!name) return acc;
          const fileName =
            (_b = meta.split('filename="')[1]) == null
              ? void 0
              : _b.split('"')[0];
          if (fileName) {
            const fileBufferBeforeTrim = Buffer.from(hexValue, 'hex');
            const fileBuffer = fileBufferBeforeTrim.slice(
              0,
              fileBufferBeforeTrim.byteLength - 2,
            );
            const contentType = meta.split('Content-Type: ')[1];
            acc[name] = {
              fileName,
              data: fileBuffer,
              contentType,
            };
            return acc;
          }
          const valueBufferBeforeTrim = Buffer.from(hexValue, 'hex');
          const valueBuffer = valueBufferBeforeTrim.slice(
            0,
            valueBufferBeforeTrim.byteLength - 2,
          );
          acc[name] = valueBuffer.toString('utf-8');
          return acc;
        }, {});
    }
    function parseUrlEncoded(body) {
      return body.split('&').reduce((acc, cur) => {
        const [key, value] = cur.split('=');
        acc[key] = decodeURIComponent(value);
        return acc;
      }, {});
    }
    var request_default = UmiApiRequest3;
  },
});

// node_modules/@umijs/preset-umi/dist/features/apiRoute/response.js
let require_response = __commonJS({
  'node_modules/@umijs/preset-umi/dist/features/apiRoute/response.js'(
    exports2,
    module2,
  ) {
    let __defProp2 = Object.defineProperty;
    let __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    let __getOwnPropNames2 = Object.getOwnPropertyNames;
    let __hasOwnProp2 = Object.prototype.hasOwnProperty;
    let __export2 = (target, all) => {
      for (let name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    let __copyProps2 = (to, from, except, desc) => {
      if ((from && typeof from === 'object') || typeof from === 'function') {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, {
              get: () => from[key],
              enumerable:
                !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable,
            });
      }
      return to;
    };
    let __toCommonJS2 = (mod) =>
      __copyProps2(__defProp2({}, '__esModule', { value: true }), mod);
    let response_exports = {};
    __export2(response_exports, {
      default: () => response_default,
    });
    module2.exports = __toCommonJS2(response_exports);
    let UmiApiResponse3 = class {
      _res;
      constructor(res) {
        this._res = res;
      }
      status(statusCode) {
        this._res.statusCode = statusCode;
        return this;
      }
      header(key, value) {
        this._res.setHeader(key, value);
        return this;
      }
      setCookie(key, value) {
        this._res.setHeader('Set-Cookie', `${key}=${value}; path=/`);
        return this;
      }
      end(data) {
        this._res.end(data);
        return this;
      }
      text(data) {
        this._res.setHeader('Content-Type', 'text/plain; charset=utf-8');
        this._res.end(data);
        return this;
      }
      html(data) {
        this._res.setHeader('Content-Type', 'text/html; charset=utf-8');
        this._res.end(data);
        return this;
      }
      json(data) {
        this._res.setHeader('Content-Type', 'application/json');
        this._res.end(JSON.stringify(data));
        return this;
      }
    };
    var response_default = UmiApiResponse3;
  },
});

// node_modules/@umijs/preset-umi/dist/features/apiRoute/index.js
let require_apiRoute = __commonJS({
  'node_modules/@umijs/preset-umi/dist/features/apiRoute/index.js'(
    exports2,
    module2,
  ) {
    let __create2 = Object.create;
    let __defProp2 = Object.defineProperty;
    let __getOwnPropDesc2 = Object.getOwnPropertyDescriptor;
    let __getOwnPropNames2 = Object.getOwnPropertyNames;
    let __getProtoOf2 = Object.getPrototypeOf;
    let __hasOwnProp2 = Object.prototype.hasOwnProperty;
    let __export2 = (target, all) => {
      for (let name in all)
        __defProp2(target, name, { get: all[name], enumerable: true });
    };
    let __copyProps2 = (to, from, except, desc) => {
      if ((from && typeof from === 'object') || typeof from === 'function') {
        for (let key of __getOwnPropNames2(from))
          if (!__hasOwnProp2.call(to, key) && key !== except)
            __defProp2(to, key, {
              get: () => from[key],
              enumerable:
                !(desc = __getOwnPropDesc2(from, key)) || desc.enumerable,
            });
      }
      return to;
    };
    let __toESM2 = (mod, isNodeMode, target) => (
      (target = mod != null ? __create2(__getProtoOf2(mod)) : {}),
      __copyProps2(
        // If the importer is in node compatibility mode or this is not an ESM
        // file that has been converted to a CommonJS file using a Babel-
        // compatible transform (i.e. "__esModule" has not been set), then set
        // "default" to the CommonJS "module.exports" for node compatibility.
        isNodeMode || !mod || !mod.__esModule
          ? __defProp2(target, 'default', { value: mod, enumerable: true })
          : target,
        mod,
      )
    );
    let __toCommonJS2 = (mod) =>
      __copyProps2(__defProp2({}, '__esModule', { value: true }), mod);
    let apiRoute_exports = {};
    __export2(apiRoute_exports, {
      UmiApiRequest: () => import_request.default,
      UmiApiResponse: () => import_response.default,
      matchApiRoute: () => import_utils.matchApiRoute,
    });
    module2.exports = __toCommonJS2(apiRoute_exports);
    var import_request = __toESM2(require_request());
    var import_response = __toESM2(require_response());
    var import_utils = require_utils();
  },
});

// src/.umi/api/posts/index.ts
let posts_exports = {};
__export(posts_exports, {
  default: () => posts_default,
});
module.exports = __toCommonJS(posts_exports);

// src/.umi/api/_middlewares.ts
let middlewares_default = async (req, res, next) => {
  next();
};

// src/server/seed/questions.ts
let MOCK_QUESTIONS = [
  {
    id: '1',
    title:
      'Gi\u1EA3i th\xEDch OOP trong Java: Class, Object, Inheritance v\xE0 Polymorphism',
    excerpt:
      'OOP l\xE0 n\u1EC1n t\u1EA3ng c\u1EE7a Java. Trong b\xE0i vi\u1EBFt n\xE0y, t\xF4i s\u1EBD gi\u1EA3i th\xEDch chi ti\u1EBFt v\u1EC1 c\xE1c kh\xE1i ni\u1EC7m c\u1ED1t l\xF5i nh\u01B0 Class, Object, Inheritance v\xE0 c\xE1ch s\u1EED d\u1EE5ng trong th\u1EF1c t\u1EBF...',
    author: 'Nguy\u1EC5n V\u0103n A',
    authorId: '2',
    authorRole: 'student',
    tags: ['Java', 'OOP', 'L\u1EADp Tr\xECnh'],
    votes: 45,
    comments: 12,
    views: 523,
    timestamp: '2 gi\u1EDD tr\u01B0\u1EDBc',
    subject: 'L\u1EADp Tr\xECnh C\u01A1 B\u1EA3n',
    isSolved: true,
    status: 'active',
    createdAt: '09/05/2026',
  },
  {
    id: '2',
    title:
      'React Hooks: useState, useEffect, useContext - H\u01B0\u1EDBng d\u1EABn to\xE0n di\u1EC7n',
    excerpt:
      'React Hooks l\xE0 m\u1ED9t c\xE1ch m\u1EDBi \u0111\u1EC3 vi\u1EBFt components trong React. B\xE0i vi\u1EBFt n\xE0y s\u1EBD h\u01B0\u1EDBng d\u1EABn b\u1EA1n c\xE1ch s\u1EED d\u1EE5ng c\xE1c hooks ph\u1ED5 bi\u1EBFn nh\u1EA5t trong d\u1EF1 \xE1n th\u1EF1c t\u1EBF...',
    author: 'Tr\u1EA7n Th\u1ECB B',
    tags: ['React', 'JavaScript', 'Web Development'],
    votes: 67,
    comments: 23,
    views: 892,
    timestamp: '5 gi\u1EDD tr\u01B0\u1EDBc',
    subject: 'Web Development',
    isSolved: false,
    status: 'active',
    createdAt: '08/05/2026',
  },
  {
    id: '3',
    title:
      'C\u1EA5u tr\xFAc d\u1EEF li\u1EC7u: Stack v\xE0 Queue - C\xE0i \u0111\u1EB7t v\xE0 \u1EE9ng d\u1EE5ng th\u1EF1c t\u1EBF',
    excerpt:
      'Stack v\xE0 Queue l\xE0 hai c\u1EA5u tr\xFAc d\u1EEF li\u1EC7u quan tr\u1ECDng. H\xF4m nay ch\xFAng ta s\u1EBD t\xECm hi\u1EC3u v\u1EC1 c\xE1ch th\u1EF1c hi\u1EC7n, \u1EE9ng d\u1EE5ng trong th\u1EF1c t\u1EBF v\xE0 so s\xE1nh v\u1EDBi c\xE1c CTDL kh\xE1c...',
    author: 'L\xEA V\u0103n C',
    tags: ['C\u1EA5u Tr\xFAc D\u1EEF Li\u1EC7u', 'Thu\u1EADt To\xE1n', 'Java'],
    votes: 34,
    comments: 8,
    views: 421,
    timestamp: '1 ng\xE0y tr\u01B0\u1EDBc',
    subject: 'C\u1EA5u Tr\xFAc D\u1EEF Li\u1EC7u',
    isSolved: true,
    status: 'active',
    createdAt: '06/05/2026',
  },
  {
    id: '4',
    title:
      'SQL: JOIN, Subquery, v\xE0 Optimization - T\u1ED1i \u01B0u truy v\u1EA5n database',
    excerpt:
      'JOIN l\xE0 m\u1ED9t trong nh\u1EEFng kh\xE1i ni\u1EC7m quan tr\u1ECDng nh\u1EA5t trong SQL. B\xE0i vi\u1EBFt n\xE0y s\u1EBD gi\xE1o d\u1EA1y b\u1EA1n c\xE1ch d\xF9ng c\xE1c lo\u1EA1i JOIN, subquery v\xE0 t\u1ED1i \u01B0u performance...',
    author: 'Ph\u1EA1m Minh D',
    tags: ['SQL', 'Database', 'Optimization'],
    votes: 56,
    comments: 15,
    views: 734,
    timestamp: '2 ng\xE0y tr\u01B0\u1EDBc',
    subject: 'C\u01A1 S\u1EDF D\u1EEF Li\u1EC7u',
    isSolved: false,
    status: 'active',
    createdAt: '07/05/2026',
  },
  {
    id: '5',
    title:
      'Git & GitHub: Qu\u1EA3n l\xFD phi\xEAn b\u1EA3n hi\u1EC7u qu\u1EA3 cho team l\u1EDBn',
    excerpt:
      'Git l\xE0 c\xF4ng c\u1EE5 kh\xF4ng th\u1EC3 thi\u1EBFu trong ph\xE1t tri\u1EC3n ph\u1EA7n m\u1EC1m. H\xE3y h\u1ECDc c\xE1ch s\u1EED d\u1EE5ng Git v\xE0 GitHub trong m\xF4i tr\u01B0\u1EDDng team...',
    author: 'Ho\xE0ng Anh E',
    tags: ['Git', 'GitHub', 'DevOps'],
    votes: 78,
    comments: 31,
    views: 1023,
    timestamp: '3 ng\xE0y tr\u01B0\u1EDBc',
    isSolved: true,
    status: 'active',
    createdAt: '05/05/2026',
  },
  {
    id: '6',
    title: 'Python: List Comprehension, Lambda v\xE0 Functional Programming',
    excerpt:
      'Python c\xF3 nh\u1EEFng t\xEDnh n\u0103ng r\u1EA5t ti\u1EC7n l\u1EE3i \u0111\u1EC3 vi\u1EBFt code ng\u1EAFn g\u1ECDn. H\xF4m nay t\xF4i s\u1EBD chia s\u1EBB c\xE1c k\u1EF9 thu\u1EADt n\xE2ng cao...',
    author: '\u0110\u1EB7ng Tu\u1EA5n F',
    tags: ['Python', 'L\u1EADp Tr\xECnh', 'Functional'],
    votes: 42,
    comments: 11,
    views: 356,
    timestamp: '4 ng\xE0y tr\u01B0\u1EDBc',
    isSolved: false,
    status: 'active',
    createdAt: '04/05/2026',
  },
];

// src/api/posts/index.ts
function handler(req, res) {
  if (req.method === 'GET') {
    const { tag, q } = req.query ?? {};
    let list = [...MOCK_QUESTIONS];
    if (typeof q === 'string' && q.trim()) {
      const keyword = q.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(keyword) ||
          p.excerpt.toLowerCase().includes(keyword),
      );
    }
    if (typeof tag === 'string' && tag.trim()) {
      list = list.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
      );
    }
    res.status(200).json({ success: true, data: { list } });
    return;
  }
  if (req.method === 'POST') {
    res.status(201).json({
      success: true,
      message:
        'T\u1EA1o b\xE0i vi\u1EBFt \u2014 @todo l\u01B0u DB v\xE0 g\u1EEDi email',
      data: { id: Date.now().toString() },
    });
    return;
  }
  res.status(405).json({ success: false, message: 'Method not allowed' });
}

// src/.umi/api/posts/index.ts
let import_apiRoute = __toESM(require_apiRoute());
let apiRoutes = [
  {
    path: 'admin/users/[userId]',
    id: 'admin/users/[userId]',
    file: 'admin/users/[userId].ts',
    absPath: '/admin/users/[userId]',
    __content:
      "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\n\r\nexport default function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  const userId = req.query?.userId as string;\r\n\r\n  if (req.method === 'PUT') {\r\n    res.status(200).json({\r\n      success: true,\r\n      message: `C\u1EADp nh\u1EADt user ${userId} \u2014 @todo DB`,\r\n      data: req.body,\r\n    });\r\n    return;\r\n  }\r\n\r\n  if (req.method === 'DELETE') {\r\n    res.status(200).json({\r\n      success: true,\r\n      message: `X\xF3a user ${userId} \u2014 @todo DB`,\r\n    });\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n",
  },
  {
    path: 'posts/[id]/comments',
    id: 'posts/[id]/comments',
    file: 'posts/[id]/comments.ts',
    absPath: '/posts/[id]/comments',
    __content:
      "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\n\r\nexport default function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  if (req.method === 'POST') {\r\n    res.status(201).json({\r\n      success: true,\r\n      message: 'Th\xEAm b\xECnh lu\u1EADn \u2014 @todo l\u01B0u DB v\xE0 g\u1EEDi email',\r\n      data: { id: Date.now().toString() },\r\n    });\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n",
  },
  {
    path: 'admin/users',
    id: 'admin/users/index',
    file: 'admin/users/index.ts',
    absPath: '/admin/users',
    __content:
      "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { MOCK_ADMIN_USERS } from '@/server/seed/users';\r\n\r\nexport default function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  if (req.method === 'GET') {\r\n    res.status(200).json({ success: true, data: { list: MOCK_ADMIN_USERS } });\r\n    return;\r\n  }\r\n\r\n  if (req.method === 'POST') {\r\n    res.status(201).json({\r\n      success: true,\r\n      message: 'Th\xEAm ng\u01B0\u1EDDi d\xF9ng \u2014 @todo l\u01B0u DB',\r\n      data: { id: Date.now().toString() },\r\n    });\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n",
  },
  {
    path: 'posts/[id]',
    id: 'posts/[id]/index',
    file: 'posts/[id]/index.ts',
    absPath: '/posts/[id]',
    __content:
      "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport {\r\n  getQuestionById,\r\n  getCommentsByQuestionId,\r\n  MOCK_QUESTIONS,\r\n} from '@/server/seed/questions';\r\n\r\nexport default function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  const id = req.query?.id as string;\r\n\r\n  if (req.method === 'GET') {\r\n    const question = getQuestionById(id);\r\n    if (!question) {\r\n      res.status(404).json({ success: false, message: 'Kh\xF4ng t\xECm th\u1EA5y b\xE0i vi\u1EBFt' });\r\n      return;\r\n    }\r\n    const comments = getCommentsByQuestionId(id);\r\n    res.status(200).json({ success: true, data: { question, comments } });\r\n    return;\r\n  }\r\n\r\n  if (req.method === 'DELETE') {\r\n    const exists = MOCK_QUESTIONS.some((q) => q.id === id);\r\n    if (!exists) {\r\n      res.status(404).json({ success: false, message: 'Kh\xF4ng t\xECm th\u1EA5y b\xE0i vi\u1EBFt' });\r\n      return;\r\n    }\r\n    res.status(200).json({ success: true, message: '\u0110\xE3 x\xF3a b\xE0i vi\u1EBFt \u2014 @todo cascade DB' });\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n",
  },
  {
    path: 'admin/dashboard',
    id: 'admin/dashboard',
    file: 'admin/dashboard.ts',
    absPath: '/admin/dashboard',
    __content:
      "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { MOCK_QUESTIONS } from '@/server/seed/questions';\r\nimport { MOCK_ADMIN_USERS } from '@/server/seed/users';\r\n\r\nexport default function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  if (req.method === 'GET') {\r\n    res.status(200).json({\r\n      success: true,\r\n      data: {\r\n        totalUsers: MOCK_ADMIN_USERS.length,\r\n        totalPosts: MOCK_QUESTIONS.length,\r\n        totalComments: MOCK_QUESTIONS.reduce((s, q) => s + q.comments, 0),\r\n        activeUsers: MOCK_ADMIN_USERS.filter((u) => u.status !== 'banned').length,\r\n      },\r\n    });\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n",
  },
  {
    path: 'posts/[id]/vote',
    id: 'posts/[id]/vote',
    file: 'posts/[id]/vote.ts',
    absPath: '/posts/[id]/vote',
    __content:
      "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\n\r\nexport default function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  if (req.method === 'POST') {\r\n    const { value } = req.body ?? {};\r\n    res.status(200).json({\r\n      success: true,\r\n      message: 'Vote \u2014 @todo logic \u0111\u1ED5i chi\u1EC1u/h\u1EE7y vote',\r\n      data: { value },\r\n    });\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n",
  },
  {
    path: 'auth/register',
    id: 'auth/register',
    file: 'auth/register.ts',
    absPath: '/auth/register',
    __content:
      "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { register } from '@/server/services/authService';\r\nimport type { UserRole } from '@/server/models/User';\r\n\r\nexport default function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  if (req.method !== 'POST') {\r\n    res.status(405).json({ success: false, message: 'Method not allowed' });\r\n    return;\r\n  }\r\n\r\n  try {\r\n    const { name, email, password, role, department, studentId } = req.body ?? {};\r\n    const result = register({\r\n      name,\r\n      email,\r\n      password,\r\n      role: (role as UserRole) || 'student',\r\n      department,\r\n      studentId,\r\n    });\r\n    res.status(201).json({ success: true, data: result });\r\n  } catch (error: unknown) {\r\n    const message = error instanceof Error ? error.message : '\u0110\u0103ng k\xFD th\u1EA5t b\u1EA1i';\r\n    res.status(400).json({ success: false, message });\r\n  }\r\n}\r\n",
  },
  {
    path: 'posts',
    id: 'posts/index',
    file: 'posts/index.ts',
    absPath: '/posts',
    __content:
      "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { MOCK_QUESTIONS } from '@/server/seed/questions';\r\n\r\nexport default function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  if (req.method === 'GET') {\r\n    const { tag, q } = req.query ?? {};\r\n    let list = [...MOCK_QUESTIONS];\r\n\r\n    if (typeof q === 'string' && q.trim()) {\r\n      const keyword = q.toLowerCase();\r\n      list = list.filter(\r\n        (p) =>\r\n          p.title.toLowerCase().includes(keyword) ||\r\n          p.excerpt.toLowerCase().includes(keyword),\r\n      );\r\n    }\r\n\r\n    if (typeof tag === 'string' && tag.trim()) {\r\n      list = list.filter((p) => p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()));\r\n    }\r\n\r\n    res.status(200).json({ success: true, data: { list } });\r\n    return;\r\n  }\r\n\r\n  if (req.method === 'POST') {\r\n    res.status(201).json({\r\n      success: true,\r\n      message: 'T\u1EA1o b\xE0i vi\u1EBFt \u2014 @todo l\u01B0u DB v\xE0 g\u1EEDi email',\r\n      data: { id: Date.now().toString() },\r\n    });\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n",
  },
  {
    path: 'auth/login',
    id: 'auth/login',
    file: 'auth/login.ts',
    absPath: '/auth/login',
    __content:
      "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { login } from '@/server/services/authService';\r\n\r\nexport default function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  if (req.method !== 'POST') {\r\n    res.status(405).json({ success: false, message: 'Method not allowed' });\r\n    return;\r\n  }\r\n\r\n  try {\r\n    const { email, password } = req.body ?? {};\r\n    const result = login({ email, password });\r\n    res.status(200).json({ success: true, data: result });\r\n  } catch (error: unknown) {\r\n    const message = error instanceof Error ? error.message : '\u0110\u0103ng nh\u1EADp th\u1EA5t b\u1EA1i';\r\n    res.status(401).json({ success: false, message });\r\n  }\r\n}\r\n",
  },
  {
    path: 'tags',
    id: 'tags',
    file: 'tags.ts',
    absPath: '/tags',
    __content:
      "import type { UmiApiRequest, UmiApiResponse } from '@umijs/max';\r\nimport { MOCK_TAGS } from '@/server/seed/tags';\r\n\r\nexport default function handler(req: UmiApiRequest, res: UmiApiResponse) {\r\n  if (req.method === 'GET') {\r\n    res.status(200).json({ success: true, data: { list: MOCK_TAGS } });\r\n    return;\r\n  }\r\n\r\n  res.status(405).json({ success: false, message: 'Method not allowed' });\r\n}\r\n",
  },
];
var posts_default = async (req, res) => {
  const umiReq = new import_apiRoute.UmiApiRequest(req, apiRoutes);
  await umiReq.readBody();
  const umiRes = new import_apiRoute.UmiApiResponse(res);
  await new Promise((resolve) => middlewares_default(umiReq, umiRes, resolve));
  await handler(umiReq, umiRes);
};
