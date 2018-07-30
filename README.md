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

## License

MIT

[npm-url]: https://npmjs.org/package/lavine
[npm-image]: https://badge.fury.io/js/lavine.svg
[travis-url]: https://travis-ci.org/astur/lavine
[travis-image]: https://travis-ci.org/astur/lavine.svg?branch=master