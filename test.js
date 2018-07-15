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
