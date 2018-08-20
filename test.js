/* eslint no-use-extend-native/no-use-extend-native: off */
const test = require('ava');
const lavine = require('.');
const delay = require('delay');

test('empty', async t => {
    await lavine(null).then(() => t.pass());
    await lavine('bad').then(() => t.pass());
    await lavine([]).then(() => t.pass());
});

test('single', async t => {
    const log = [];
    await lavine([() => false]).then(() => t.pass());
    await lavine([() => ''.throwHere()]).then(() => t.pass());
    await lavine(['bad']).then(() => t.pass());
    await lavine([false]).then(() => t.pass());
    await lavine([
        () => {
            log.push('ok');
        },
    ]);
    t.deepEqual(log, ['ok']);
});

test('multi', async t => {
    const log = [];
    await lavine([
        'bad',
        false,
        () => {
            log.push(1);
            ''.throwHere();
        },
        () => {
            log.push(2);
        },
        () => {
            t.fail();
        },
    ]);
    t.deepEqual(log, [1, 2]);
});

test('async', async t => {
    const log = [];
    await lavine([
        async () => {
            await delay(10);
            log.push(1);
            ''.throwHere();
        },
        async () => {
            await delay(10);
            log.push(2);
        },
        async () => {
            await delay(10);
            t.fail();
        },
    ]);
    t.deepEqual(log, [1, 2]);
});

test('concurrency', async t => {
    const log = [];
    await lavine([
        async () => {
            await delay(40);
            log.push(1);
            ''.throwHere();
        },
        async () => {
            await delay(10);
            log.push(2);
            ''.throwHere();
        },
        async () => {
            await delay(10);
            log.push(3);
        },
        async () => {
            await delay(10);
            log.push(4);
        },
        async () => {
            await delay(10);
            t.fail();
        },
        async () => {
            await delay(10);
            t.fail();
        },
    ], 2);
    t.deepEqual(log, [2, 3, 1, 4]);
});

test('auto concurrency', async t => {
    const ts = Date.now();
    await lavine([
        async () => {
            await delay(50);
        },
        async () => {
            await delay(50);
        },
    ], 0);
    t.true(Date.now() - ts < 80);
});

test('factory', async t => {
    const log = [];
    await lavine(() => () => false).then(() => t.pass());
    await lavine(() => () => {
        log.push(1);
    }, 3);
    t.deepEqual(log, [1, 1, 1]);
});
