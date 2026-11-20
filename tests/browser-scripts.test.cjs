const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const root = path.join(__dirname, "..");
const bibsearch = fs.readFileSync(path.join(root, "assets/js/bibsearch.js"), "utf8").replace(/^import .*;\r?\n/, "");

function bibliography(hash = "", highlights = false) {
  const events = {};
  const timers = new Map();
  const classes = new Set();
  let timerId = 0;
  const input = { value: "", addEventListener: (name, fn) => (events[name] = fn) };
  const item = {
    innerText: "Albert Einstein",
    classList: { add: (name) => classes.add(name), remove: (name) => classes.delete(name) },
  };
  const window = { location: { hash }, addEventListener: (name, fn) => (events[name] = fn) };
  vm.runInNewContext(bibsearch, {
    window,
    CSS: { highlights },
    document: {
      addEventListener: (name, fn) => (events[name] = fn),
      getElementById: () => input,
      querySelectorAll: (selector) => (selector === "h2.bibliography" ? [] : [item]),
    },
    highlightSearchTerm: ({ search }) => (item.innerText.toLowerCase().includes(search) ? [] : [item]),
    clearTimeout: (id) => timers.delete(id),
    setTimeout: (fn, delay) => {
      assert.equal(delay, 300);
      timers.set(++timerId, fn);
      return timerId;
    },
  });
  events.DOMContentLoaded();
  return { events, timers, classes, input, window };
}

test("mixed-case search links work with and without highlights", () => {
  for (const highlights of [true, false]) {
    const page = bibliography("#Einstein", highlights);
    assert.equal(page.input.value, "Einstein");
    assert.equal(page.classes.has("unloaded"), false);
  }
});

test("typing waits and only the latest search runs", () => {
  const page = bibliography();
  page.events.input.call({ value: "Einstein" });
  page.events.input.call({ value: "missing" });
  assert.equal(page.classes.has("unloaded"), false);
  assert.equal(page.timers.size, 1);
  const run = [...page.timers.values()][0];
  assert.equal(typeof run, "function");
  run();
  assert.equal(page.classes.has("unloaded"), true);
  page.events.input.call({ value: "" });
  [...page.timers.values()].at(-1)();
  assert.equal(page.classes.has("unloaded"), false);
});

test("following a search link cancels pending input filtering", () => {
  const page = bibliography();
  page.events.input.call({ value: "missing" });
  page.window.location.hash = "#Einstein";
  page.events.hashchange();
  assert.equal(page.timers.size, 0);
  assert.equal(page.classes.has("unloaded"), false);
});

test("consent restores saved choices and follows later changes", () => {
  const source = fs.readFileSync(path.join(root, "_scripts/cookie-consent-setup.js"), "utf8").replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n/, "");
  for (const savedChoice of [true, false]) {
    let accepted = savedChoice;
    let config;
    const window = {
      CookieConsent: {
        acceptedCategory: (name) => {
          assert.equal(name, "analytics");
          return accepted;
        },
        run: (options) => {
          config = options;
          options.onConsent();
        },
      },
    };
    vm.runInNewContext(source, { window });
    assert.equal(window.dataLayer[0][2].analytics_storage, "denied");
    assert.equal(window.dataLayer.at(-1)[2].analytics_storage, savedChoice ? "granted" : "denied");
    accepted = !savedChoice;
    config.onChange();
    assert.equal(window.dataLayer.at(-1)[2].analytics_storage, accepted ? "granted" : "denied");
    assert.equal(window.dataLayer.at(-1)[2].ad_storage, "denied");
  }
});
