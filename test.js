const test = require('ava');
const lavine = require('.');

test('empty', async t => {
    await lavine(null).then(() => t.pass());
    await lavine('bad').then(() => t.pass());
    await lavine([]).then(() => t.pass());
});
