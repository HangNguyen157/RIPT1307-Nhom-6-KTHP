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

// src/.umi/api/auth/register.ts
let register_exports = {};
__export(register_exports, {
  default: () => register_default,
});
module.exports = __toCommonJS(register_exports);

// src/.umi/api/_middlewares.ts
let middlewares_default = async (req, res, next) => {
  next();
};

// src/server/seed/users.ts
let MOCK_USERS = [
  {
    id: '1',
    name: 'Nguy\u1EC5n V\u0103n Admin',
    email: 'admin@ptit.edu.vn',
    role: 'admin',
    department: 'Ban Qu\u1EA3n Tr\u1ECB',
    reputation: 9999,
    posts: 150,
    answers: 320,
    votes: 1250,
    followers: 500,
    following: 50,
    joinDate: '2023-01-01',
    badges: ['admin', 'top-contributor', 'helpful'],
    status: 'active',
  },
  {
    id: '2',
    name: 'Tr\u1EA7n Th\u1ECB H\u01B0\u01A1ng',
    email: 'huong@student.ptit.edu.vn',
    role: 'student',
    department: 'C\xF4ng Ngh\u1EC7 Th\xF4ng Tin',
    major: 'L\u1EADp Tr\xECnh Web',
    studentId: 'B21DCCN123',
    bio: 'Sinh vi\xEAn n\u0103m 3 ng\xE0nh CNTT, \u0111am m\xEA Web Development v\xE0 AI',
    reputation: 1250,
    posts: 28,
    answers: 45,
    votes: 320,
    followers: 89,
    following: 34,
    joinDate: '2024-09-01',
    badges: ['first-question', 'helpful', '100-votes'],
    status: 'active',
  },
  {
    id: '3',
    name: 'PGS.TS L\xEA Minh \u0110\u1EE9c',
    email: 'duc.lm@ptit.edu.vn',
    role: 'teacher',
    department: 'Khoa CNTT',
    major: 'Khoa h\u1ECDc m\xE1y t\xEDnh',
    bio: 'Gi\u1EA3ng vi\xEAn m\xF4n CTDL, Gi\u1EA3i Thu\u1EADt, AI. C\xF3 15 n\u0103m kinh nghi\u1EC7m gi\u1EA3ng d\u1EA1y.',
    reputation: 5430,
    posts: 85,
    answers: 210,
    votes: 870,
    followers: 342,
    following: 15,
    joinDate: '2023-06-15',
    badges: ['teacher', 'expert', 'top-contributor', 'advisor'],
    status: 'active',
  },
];
let MOCK_ADMIN_USERS = [
  ...MOCK_USERS,
  {
    id: '4',
    name: 'Ho\xE0ng V\u0103n B\xECnh',
    email: 'binh@student.ptit.edu.vn',
    role: 'student',
    reputation: 980,
    posts: 35,
    answers: 0,
    votes: 0,
    followers: 0,
    following: 0,
    joinDate: '20/09/2024',
    badges: [],
    status: 'banned',
  },
  {
    id: '5',
    name: 'Nguy\u1EC5n Minh Ch\xE2u',
    email: 'chau@ptit.edu.vn',
    role: 'teacher',
    reputation: 870,
    posts: 42,
    answers: 0,
    votes: 0,
    followers: 0,
    following: 0,
    joinDate: '01/08/2023',
    badges: [],
    status: 'active',
  },
  {
    id: '6',
    name: 'Ph\u1EA1m Th\u1ECB Lan',
    email: 'lan@student.ptit.edu.vn',
    role: 'student',
    reputation: 320,
    posts: 8,
    answers: 0,
    votes: 0,
    followers: 0,
    following: 0,
    joinDate: '05/10/2024',
    badges: [],
    status: 'active',
  },
];

// src/server/services/authService.ts
function createToken(userId) {
  return `mock_token_${userId}`;
}
function register(input) {
  const newUser = {
    id: Date.now().toString(),
    name: input.name,
    email: input.email,
    role: input.role,
    department: input.department,
    studentId: input.studentId,
    reputation: 10,
    posts: 0,
    answers: 0,
    votes: 0,
    followers: 0,
    following: 0,
    joinDate: /* @__PURE__ */ new Date().toISOString().split('T')[0],
    badges: ['newcomer'],
    status: 'active',
  };
  return { user: newUser, token: createToken(newUser.id) };
}

// src/api/auth/register.ts
function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ success: false, message: 'Method not allowed' });
    return;
  }
  try {
    const { name, email, password, role, department, studentId } =
      req.body ?? {};
    const result = register({
      name,
      email,
      password,
      role: role || 'student',
      department,
      studentId,
    });
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : '\u0110\u0103ng k\xFD th\u1EA5t b\u1EA1i';
    res.status(400).json({ success: false, message });
  }
}

// src/.umi/api/auth/register.ts
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
var register_default = async (req, res) => {
  const umiReq = new import_apiRoute.UmiApiRequest(req, apiRoutes);
  await umiReq.readBody();
  const umiRes = new import_apiRoute.UmiApiResponse(res);
  await new Promise((resolve) => middlewares_default(umiReq, umiRes, resolve));
  await handler(umiReq, umiRes);
};
