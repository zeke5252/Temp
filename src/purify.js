const purify = require("purify-css")
const htmlFiles = ['*.html'];
const cssFiles = ['*.css'];
const opts = {
    output: 'purified.css'
};
purify(htmlFiles, cssFiles, opts, function (res) {
    log(res);
});