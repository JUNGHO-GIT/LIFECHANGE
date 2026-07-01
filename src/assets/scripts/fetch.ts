/**
 * @file fetch.ts
 * @description 런타임에 글로벌 fetch/Headers 가 없을 때만 node-fetch 로 폴리필(bun/node>=18 네이티브 보존)
 * @author Jungho
 * @since 2025-12-14
 */

// ---------------------------------------------------------------------------------------------
const g = globalThis as typeof globalThis & {
  fetch?: typeof globalThis.fetch;
  Blob?: typeof globalThis.Blob;
  File?: typeof globalThis.File;
  FormData?: typeof globalThis.FormData;
  Headers?: typeof globalThis.Headers;
  Request?: typeof globalThis.Request;
  Response?: typeof globalThis.Response;
};

// ---------------------------------------------------------------------------------------------
// 네이티브 fetch 가 있으면 node-fetch 를 아예 로드하지 않는다. 없을 때만 동적 import 로 폴리필.
if (typeof g.fetch !== `function`) {
  const nf = await import(`node-fetch`);
  const { Blob, File, FormData, Headers, Request, Response } = nf;

  const fetchPolyfill = nf.default as unknown as typeof globalThis.fetch;
  const BlobPolyfill = Blob as unknown as typeof globalThis.Blob;
  const FilePolyfill = File as unknown as typeof globalThis.File;
  const FormDataPolyfill = FormData as unknown as typeof globalThis.FormData;
  const HeadersPolyfill = Headers as unknown as typeof globalThis.Headers;
  const RequestPolyfill = Request as unknown as typeof globalThis.Request;
  const ResponsePolyfill = Response as unknown as typeof globalThis.Response;

  g.fetch = fetchPolyfill;
  typeof g.Blob !== `function` && (g.Blob = BlobPolyfill);
  typeof g.File !== `function` && (g.File = FilePolyfill);
  typeof g.FormData !== `function` && (g.FormData = FormDataPolyfill);
  typeof g.Headers !== `function` && (g.Headers = HeadersPolyfill);
  typeof g.Request !== `function` && (g.Request = RequestPolyfill);
  typeof g.Response !== `function` && (g.Response = ResponsePolyfill);
}

// 동적 import 의 top-level await 가 모듈 컨텍스트를 요구하므로 모듈로 표식한다 ---------------------------
export {};
