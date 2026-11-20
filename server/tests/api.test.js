/**
 * Automated Unit & Integration Tests
 * Tests JavaScript core utilities, Rate Limiting, Prompt Injection defense, and Schema Validation
 */

const {
  createRateLimiter,
  demonstrateHoisting,
  promiseStyleAsync,
  executeParallelWorkflows,
  simulateEventLoopOrder,
} = require("../utils/jsConcepts");

const { rateLimiter, sanitizeInput, validateBody } = require("../middleware/security");

describe("1. JavaScript Core Concepts Unit Tests", () => {
  test("Closures: Rate limiter maintains private enclosed state", () => {
    const limiter = createRateLimiter(2, 5000);
    const firstCall = limiter();
    const secondCall = limiter();
    const thirdCall = limiter();

    expect(firstCall.allowed).toBe(true);
    expect(secondCall.allowed).toBe(true);
    expect(thirdCall.allowed).toBe(false);
    expect(thirdCall.remaining).toBe(0);
  });

  test("Hoisting: Function declarations are hoisted to top of scope", () => {
    const result = demonstrateHoisting();
    expect(result.hoistedFunctionResult).toContain("Function declaration is hoisted");
  });

  test("Promises: Converts callback-style into resolved Promise", async () => {
    const result = await promiseStyleAsync(21);
    expect(result).toBe(42);
  });

  test("Async / Await: Concurrently processes microtask promises", async () => {
    const results = await executeParallelWorkflows([1, 2, 3]);
    expect(results.length).toBe(3);
    expect(results[0].processed).toBe(2);
    expect(results[1].processed).toBe(4);
    expect(results[2].processed).toBe(6);
  });

  test("Event Loop: Synchronous code executes before macrotasks", () => {
    const order = simulateEventLoopOrder();
    expect(order[0]).toContain("1. Synchronous Execution");
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
    const next = jest.fn();

    sanitizeInput(req, res, next);
    expect(req.body.$gt).toBeUndefined();
    expect(req.body.nested.$ne).toBeUndefined();
    expect(req.body.nested.legitimate).toBe("ok");
    expect(next).toHaveBeenCalled();
  });

  test("Body Validator rejects missing required fields with 400", () => {
    const req = { body: { title: "New Project" } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    const validator = validateBody(["title", "description"]);
    validator(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: "Validation Error",
      })
    );
    expect(next).not.toHaveBeenCalled();
  });
});
