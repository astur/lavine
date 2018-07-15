const whiler = require('whiler');

module.exports = source => {
    source = (Array.isArray(source) ? source : [source]).filter(f => typeof f === 'function');
    const getWorker = () => source.shift() || null;
    const thread = () => {
        const worker = getWorker();
        if(worker === null) return false;
        return whiler(worker).then(
            () => false,
            () => true,
        );
    };
    return whiler(thread);
};
