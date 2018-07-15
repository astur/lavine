const whiler = require('whiler');

module.exports = (source, concurrency) => {
    source = (Array.isArray(source) ? source : [source]).filter(f => typeof f === 'function');
    concurrency = Number.isInteger(concurrency) && concurrency > 1 ? concurrency : 1;
    const getWorker = () => source.shift() || null;
    const thread = () => {
        const worker = getWorker();
        if(worker === null) return false;
        return whiler(worker).then(
            () => false,
            () => true,
        );
    };
    const flow = () => whiler(thread);
    const flows = [...Array(concurrency)].map(() => flow());
    return Promise.all(flows);
};
