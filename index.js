const whiler = require('whiler');

module.exports = source => {
    const getWorker = () => source && source.shift ? source.shift() || null : null;
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
