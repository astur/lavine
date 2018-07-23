const whiler = require('whiler');

module.exports = (source, concurrency) => {
    if(!Array.isArray(source) && typeof source !== 'function') return Promise.resolve();
    source = (Array.isArray(source) ? source : [source]).filter(f => typeof f === 'function');
    if(concurrency === 0 || concurrency > source.length) concurrency = source.length;
    if(!Number.isInteger(concurrency) || concurrency < 0) concurrency = 1;
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
