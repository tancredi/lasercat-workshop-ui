function resize () {
    var body = document.body;

    body.removeAttribute('style');

    if (body.offsetHeight < window.innerHeight) {
        body.style.height = window.innerHeight + 'px';
    }
}

module.exports = {
    resize: resize
};