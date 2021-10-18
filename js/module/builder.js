{
    let view = {
        el: '#main',
        template: ``,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        }
    }

    let model = {
        pages: [
            'markdown', 'mysql', 'bash', 'vim',
            'powershell', 'git', 'es6', 'regex',
            'awk', 'cron', 'redis', 'springCloud',
            'java8', 'golang', 'RESTful', '项目规范',
            '数据密集型应用', 'beautifulCode', 'Lisp', '设计模式',
            'nginx', 'CSS', 'xargs', 'JVM',
            '分布式事务', '算法', 'C语言'],
        htmlMap: {}
    }

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            syncLoad(['./js/3rdparty/jszip.min.js', './js/util/saveData.js'], loadScript)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            $.el('#build-html').classList.remove('hide')            

            // 静态页面生成
            $.bindEvent('#build-html', 'click', () => {
                // 首页开始
                // 1. 获取当前页面
                this.model.htmlMap['index'] = '<!DOCTYPE html>\n' + $.el('html').outerHTML
                    .replace(/<script[^>]*main\.js[^>]*><\/script>/, '')
                    .replace(/<script[^>]*nav\.js[^>]*><\/script>/, '')
                    .replace(/<script[^>]*builder\.js[^>]*><\/script>/, '')
                    .replace(/<div class="item" value="(.*)">(\n.*\n\s+)<\/div>/g, '<a class="item" value="$1" href="./$1.html">$2</a>')
                    .replace(/id="go-back"/, 'id="go-back" onclick="history.go(-1)"')
                    .replace(/<div id="go-home">首页<\/div>/, '<a id="go-home" href="./index.html">首页</a>')
                    .replace(/script src=".\//g, 'script src="../' )
                    .replace(/rel="stylesheet" href=".\//g, 'rel="stylesheet" href="../' )
                    .replace(/let isHtml = false/g, 'let isHtml = true' )
                    .replace(/.*id="build-html".*/, '' )

                // 2. 切换页面
                window.eventHub.emit('open-sheet', [this.model.pages[0], true])

            })
        },
        arrRemove(arr, val) {
            var index = arr.indexOf(val);
            if (index > -1) {
                arr.splice(index, 1);
            }
        },
        zipFileAndDownload() {
            let zip = new JSZip();
            Object.keys(this.model.htmlMap).forEach(key => {
                let value = this.model.htmlMap[key]
                zip.file(`${key}.html`, value)
            })

            zip.generateAsync({ type: "blob" })
                .then(function (content) {
                    saveData.setDataConver({
                        name: `html.zip`,
                        data: content
                    })
                });
        },
        bindEventHub() {
            window.eventHub.on('loadingOff', (type) => {
                this.model.htmlMap[type] = '<!DOCTYPE html>\n' + $.el('html').outerHTML
                    .replace(/<script[^>]*main\.js[^>]*><\/script>/, '')
                    .replace(/<script[^>]*nav\.js[^>]*><\/script>/, '')
                    .replace(/<script[^>]*builder\.js[^>]*><\/script>/, '')
                    .replace(/id="go-back"/, 'id="go-back" onclick="history.go(-1)"')
                    .replace(/<div id="go-home">首页<\/div>/, '<a id="go-home" href="./index.html">首页</a>')
                    .replace(/script src=".\//g, 'script src="../' )
                    .replace(/rel="stylesheet" href=".\//g, 'rel="stylesheet" href="../' )
                    .replace(/let isHtml = false/g, 'let isHtml = true' )
                    .replace(/class="sheet-section" style="width:[^\"]*transform[^\"]*"/g, 'class="sheet-section" ' )
                    .replace(/.*id="build-html".*/, '' )

                this.arrRemove(this.model.pages, type)
                if (this.model.pages.length) {
                    window.eventHub.emit('open-sheet', [this.model.pages[0], true])
                } else {
                    // 页面遍历结束
                    // $.log(JSON.stringify(this.model.htmlMap, null, 2))
                    this.zipFileAndDownload()
                }
            })
        }
    }

    controller.init(view, model)
}
