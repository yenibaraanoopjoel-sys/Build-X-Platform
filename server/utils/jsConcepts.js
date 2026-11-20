/**
 * ============================================================================
 * JAVASCRIPT CORE CONCEPTS DEMONSTRATION & UTILITIES
 * ============================================================================
 * This module provides clean, tested implementations demonstrating core JS principles:
 * 1. Closures
 * 2. Event Loop (Microtasks vs Macrotasks)
 * 3. Hoisting behavior
 * 4. Promises vs Callbacks
 * 5. Async / Await with robust error propagation
 */

// ----------------------------------------------------------------------------
// 1. CLOSURES
// A closure gives a function access to its outer scope even after the outer
// function has returned. Used here for private token counters & rate limiters.
// ----------------------------------------------------------------------------
function createRateLimiter(maxRequests = 5, windowMs = 60000) {
  let requestTimestamps = []; // Enclosed private variable

  return function checkLimit() {
    const now = Date.now();
    // Prune timestamps outside window
    requestTimestamps = requestTimestamps.filter((ts) => now - ts < windowMs);

    if (requestTimestamps.length >= maxRequests) {
      return { allowed: false, remaining: 0, resetInMs: windowMs - (now - requestTimestamps[0]) };
    }

    requestTimestamps.push(now);
    return { allowed: true, remaining: maxRequests - requestTimestamps.length };
  };
}

// ----------------------------------------------------------------------------
// 2. HOISTING
// Demonstrates var vs let/const hoisting (Declaration hoisted vs Temporal Dead Zone)
// and function declaration hoisting vs function expression.
// ----------------------------------------------------------------------------
function demonstrateHoisting() {
  // Function declarations are fully hoisted with definition
  const result = hoistedFunction();

  function hoistedFunction() {
    return "Function declaration is hoisted to the top of its scope!";
  }

  // var is hoisted as undefined; let/const are in the Temporal Dead Zone (TDZ)
  return {
    hoistedFunctionResult: result,
    explanation: "Function declarations are hoisted with implementation; let/const stay uninitialized in TDZ."
  };
}

// ----------------------------------------------------------------------------
// 3. PROMISES VS CALLBACKS
// Demonstrating converting legacy Node error-first callback pattern into Promises
// ----------------------------------------------------------------------------
function callbackStyleAsync(val, callback) {
  setTimeout(() => {
    if (val < 0) {
      return callback(new Error("Value cannot be negative"));
    }
    callback(null, val * 2);
  }, 10);
}

function promiseStyleAsync(val) {
  return new Promise((resolve, reject) => {
    callbackStyleAsync(val, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });
  });
}

// ----------------------------------------------------------------------------
// 4. ASYNC / AWAIT WITH PARALLEL PROMISE CONCURRENCY
// Demonstrating sequential vs parallel asynchronous workflows
// ----------------------------------------------------------------------------
async function executeParallelWorkflows(items) {
  try {
    // Parallel execution via Promise.all (Microtask queue resolution)
    const results = await Promise.all(
      items.map(async (item) => {
        const processed = await promiseStyleAsync(item);
        return { item, processed, status: "fulfilled" };
      })
    );
    return results;
  } catch (error) {
    console.error("Parallel workflow error caught:", error.message);
    throw error;
  }
}

// ----------------------------------------------------------------------------
// 5. EVENT LOOP DEMONSTRATION
// Macro-task (setTimeout) vs Micro-task (Promise.resolve) execution ordering
// Microtasks always drain completely before the next macrotask is processed.
// ----------------------------------------------------------------------------
function simulateEventLoopOrder() {
  const executionOrder = [];

  executionOrder.push("1. Synchronous Execution");

  setTimeout(() => {
    executionOrder.push("4. Macrotask (setTimeout callback)");
  }, 0);

  Promise.resolve().then(() => {
    executionOrder.push("2. Microtask 1 (Promise.then)");
  }).then(() => {
    executionOrder.push("3. Microtask 2 (Chained Promise)");
  });

  return executionOrder;
}

module.exports = {
  createRateLimiter,
  demonstrateHoisting,
  callbackStyleAsync,
  promiseStyleAsync,
  executeParallelWorkflows,
  simulateEventLoopOrder,
};
