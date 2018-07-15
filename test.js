const test = require('ava');
const lavine = require('.');

test('empty', async t => {
    await lavine([]).then(() => t.pass());
});
