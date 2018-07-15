const test = require('ava');
const lavine = require('.');

test('empty', async t => {
    await lavine(null).then(() => t.pass());
    await lavine('bad').then(() => t.pass());
    await lavine([]).then(() => t.pass());
});

test('single', async t => {
    await lavine([() => false]).then(() => t.pass());
    await lavine([() => ''.throwHere()]).then(() => t.pass());
});

test('multi', async t => {
    const log = [];
    await lavine([
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
