const whiler = require('whiler');

module.exports = (source, concurrency) => {
    const isA = Array.isArray(source);
    if(!isA && typeof source !== 'function') return Promise.resolve();
    source = isA ? source.filter(f => typeof f === 'function') : source;
    if(isA && (concurrency === 0 || concurrency > source.length)) concurrency = source.length;
    if(!Number.isInteger(concurrency) || concurrency < 0) concurrency = 1;
    const getWorker = isA ? () => source.shift() || null : source;
    const thread = async () => {
        const worker = await getWorker();
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
