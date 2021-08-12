let jsList = [
    './js/util/function.js',
    './js/util/event-hub.js',
    './js/3rdparty/prism.js',


    './js/module/loading.js',
    './js/module/home.js',
    './js/module/cheatsheet.js',
]

let developModel = false;

let cssList = [
    './css/main.css',
    './css/prism.css',
]

let version = developModel ? new Date().getTime() : '2021081201';

function loadScript(url) {
    let script = document.createElement('script');
    script.src = `${url}?version=${version}`;
    let body = document.querySelector('body');
    body.append(script);
    
    return script;
}
function loadCss(url) {
    let link = document.createElement('link');
    link.rel = 'stylesheet'
    link.href = `${url}?version=${version}`;
    let head = document.querySelector('head');
    head.append(link);

    return link;
}

function syncLoad(urlList, loadFunction) {
    let len = urlList.length;
    if (len === 0) {
        return
    }
    let el = loadFunction(urlList[0]);
    el.onload = () => {
        urlList.shift()
        syncLoad(urlList, loadFunction)
    }
}

window.onload = function () {
    syncLoad(cssList, loadCss)
    syncLoad(jsList, loadScript)
}
