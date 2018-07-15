const test = require('ava');
const lavine = require('.');
const delay = require('delay');

test('empty', async t => {
    await lavine(null).then(() => t.pass());
    await lavine('bad').then(() => t.pass());
    await lavine([]).then(() => t.pass());
});

test('single', async t => {
    await lavine([() => false]).then(() => t.pass());
    await lavine([() => ''.throwHere()]).then(() => t.pass());
    await lavine(['bad']).then(() => t.pass());
    await lavine([false]).then(() => t.pass());
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
