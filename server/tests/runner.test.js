/**
 * BuildX Automated Test Suite (Native Node.js Test Runner)
 */
const { test, describe } = require("node:test");
const assert = require("node:assert");

const {
  createRateLimiter,
  demonstrateHoisting,
  promiseStyleAsync,
  executeParallelWorkflows,
  simulateEventLoopOrder,
} = require("../utils/jsConcepts");

const { sanitizeInput, validateBody } = require("../middleware/security");

describe("1. JavaScript Core Concepts Unit Tests", () => {
  test("Closures: Rate limiter maintains private enclosed state", () => {
    const limiter = createRateLimiter(2, 5000);
    const firstCall = limiter();
    const secondCall = limiter();
    const thirdCall = limiter();

    assert.strictEqual(firstCall.allowed, true);
    assert.strictEqual(secondCall.allowed, true);
    assert.strictEqual(thirdCall.allowed, false);
    assert.strictEqual(thirdCall.remaining, 0);
  });

  test("Hoisting: Function declarations are hoisted to top of scope", () => {
    const result = demonstrateHoisting();
    assert.ok(result.hoistedFunctionResult.includes("Function declaration is hoisted"));
  });

  test("Promises: Converts callback-style into resolved Promise", async () => {
    const result = await promiseStyleAsync(21);
    assert.strictEqual(result, 42);
  });

  test("Async / Await: Concurrently processes microtask promises", async () => {
    const results = await executeParallelWorkflows([1, 2, 3]);
    assert.strictEqual(results.length, 3);
    assert.strictEqual(results[0].processed, 2);
    assert.strictEqual(results[1].processed, 4);
    assert.strictEqual(results[2].processed, 6);
  });

  test("Event Loop: Synchronous code executes before macrotasks", () => {
    const order = simulateEventLoopOrder();
    assert.ok(order[0].includes("1. Synchronous Execution"));
  });
});

describe("2. Security & Sanitization Middleware Tests", () => {
  test("Sanitizer strips NoSQL injection dollar operators", () => {
    const req = {
      body: {
        username: "admin",
        $gt: "",
        nested: { $ne: null, legitimate: "ok" },
      },
    };
    const res = {};
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    sanitizeInput(req, res, next);
    assert.strictEqual(req.body.$gt, undefined);
    assert.strictEqual(req.body.nested.$ne, undefined);
    assert.strictEqual(req.body.nested.legitimate, "ok");
    assert.strictEqual(nextCalled, true);
  });

  test("Body Validator rejects missing required fields with 400", () => {
    const req = { body: { title: "New Project" } };
    let capturedStatus = null;
    let capturedJson = null;
    const res = {
      status: (code) => {
        capturedStatus = code;
        return {
          json: (data) => { capturedJson = data; }
        };
      },
    };
    let nextCalled = false;
    const next = () => { nextCalled = true; };

    const validator = validateBody(["title", "description"]);
    validator(req, res, next);

    assert.strictEqual(capturedStatus, 400);
    assert.strictEqual(capturedJson.error, "Validation Error");
    assert.strictEqual(nextCalled, false);
  });
});

