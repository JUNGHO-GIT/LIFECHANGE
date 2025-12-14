/**
 * @file fetch.ts
 * @description Node.js 16에서 글로벌 fetch/Headers가 없어 google-auth-library가 실패하는 케이스 방지
 * @author Jungho
 * @since 2025-12-14
 */

import fetch, { Headers, Request, Response } from "node-fetch";

const g = globalThis as typeof globalThis & {
	fetch?: typeof globalThis.fetch;
	Headers?: typeof globalThis.Headers;
	Request?: typeof globalThis.Request;
	Response?: typeof globalThis.Response;
};

const fetchPolyfill = fetch as unknown as typeof globalThis.fetch;
const HeadersPolyfill = Headers as unknown as typeof globalThis.Headers;
const RequestPolyfill = Request as unknown as typeof globalThis.Request;
const ResponsePolyfill = Response as unknown as typeof globalThis.Response;

typeof g.fetch !== `function` && (g.fetch = fetchPolyfill);
typeof g.Headers !== `function` && (g.Headers = HeadersPolyfill);
typeof g.Request !== `function` && (g.Request = RequestPolyfill);
typeof g.Response !== `function` && (g.Response = ResponsePolyfill);
