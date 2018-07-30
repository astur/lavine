# lavine

Easy way to run worker function in loop and change worker when running one becomes obsolete.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]

## Install

```bash
npm install lavine
```

## Usage

```js
const lavine = require('lavine');

lavine(source, concurrency); // returns promise
```

`source` - array of worker functions or factory-function (sync or async) returning worker function. These two examples are equivalent:

```js
lavine([worker1, worker2, worker3]);
```

```js
const workers = [worker1, worker2, worker3];

lavine(() => workers.shift() || null);
```

If `source` is not an array and not a function, `lavine` does nothing and returns immediately.

`concurrency` - positive number determining how many worker functions may be run in parallel. Defaults to 1. Wrong `concurrency` values turns into 1. Worker obtained from `source` can't be run in parallel with itself, so real `concurrency` can't be more then length of source array. If `concurrency` is 0 and `source` is an array, `concurrency` will be length of array. 

Worker function may be sync or async, it does not matter (but usually it is async). It takes no parameters and returns no real data, only control values. It exists for the sake of side effects. Worker function can finish in one of these three ways:

* returns `true` or promise of `true` - means it is ok and `lavine` must run same worker again.
* throws or rejects error or anything - means this worker becomes obsolete and `lavine` must run next worker from source (if present).
* returns `false` or promise of `false` - means all work is done and `lavine` may finish it's work (or finish work of this one of parallel flows).

## Use cases

### Repeat same worker in serial

In this case `lavine` works as async while-cycle

```js
const worker = () => {
    // Take one task from some bunch
    // (queue, predefined array, anything else...)

    // Do the task

    // Save result somewhere
    // (database, file,  anything else...)

    // It may be delayed with 'p-min-delay' or 'unquick'

    // return true if there is more tasks to do
    // or
    // return false if all tasks done
};

lavine([worker]);
// or
// lavine(() => worker);
```

### Repeat same worker in limited parallel

In this case `lavine` runs several independent async while-cycles with same worker.

```js
const worker = () => {/* See above */};

lavine(() => worker, concurrency);
// It is pretty much the same as this:
// Promise.all([...Array(concurrency)].map(() => lavine(() => worker), 0);
```

Note that if one worker returns `false` only one of parallel flows will be stopped. But if workers in all flows get tasks from same source it means that all of them will return `false` after source is depleted.

### Work with initialized sessions

When doing in cycle network task that requires initialized session and when session expires it must be reinitialized.

```js
const worker = (session) => {
    // Same as above but using session

    // return true or false in same cases as above
    // throw/reject if session expired
    // it does not matter what exactly to throw/reject
};
const init = () => {
    // Do something and returns initialized session
    // For example, authorize on site and returns cookies
    // Let's return falsy value if authorization is impossible
};

lavine(() => {
    const session = init();
    if (!session) return null;
    return () => worker(session);
});
```

### Work with proxy list

When doing in cycle network task that requires proxy and when particular proxy becomes blocked it most be replaced on next one from proxy list.

```js
const proxyList = [
    'http://s1.myproxy.com',
    'http://s2.myproxy.com',
    'http://s3.myproxy.com',
    'http://s4.myproxy.com',
    'http://s5.myproxy.com',
];

const worker = (proxy) => {
    // Same as above but using proxy

    // return true or false in same cases as above
    // throw/reject if proxy blocked
    // it does not matter what exactly to throw/reject
};

lavine(proxyList.map(proxy => () => worker(proxy)), concurrency);
```

Note that if `concurrency` is less then `proxyList.length` and no one proxy will be blocked then rest of `proxyList` will never be used.

## License

MIT

[npm-url]: https://npmjs.org/package/lavine
[npm-image]: https://badge.fury.io/js/lavine.svg
[travis-url]: https://travis-ci.org/astur/lavine
[travis-image]: https://travis-ci.org/astur/lavine.svg?branch=master