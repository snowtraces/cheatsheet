{
    let view = {
        el: '#main',
        template: `
        <div id="home-wrapper" class="w w--home">
            <div id="title">
                <h1>Snow's Cheatsheets</h1>
            </div>
            <div id="search">
                <input type="search" name="keyword">
            </div>
            <div id="recomment-list">
                \${data.map(item => \`<div class=item value="\${item}">\${item}</div>\`).join('')}
            </div>
            <div id="lastest-list">

            </div>
        </div>`,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        }
    }

    let model = {
        data: [
            'markdown', 'mysql', 'bash', 'vim',
            'powershell', 'git', 'es6', 'regex',
            'awk', 'sed', 'redis', "springCloud",
            "java8", "golang", "RESTful", "项目规范",
            "数据密集型应用", "beautifulCode", "Lisp",
        ]
    }

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.nav()
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
            this.loadIndex()
        },
        bindEvents() {
            $.bindEvent('#recomment-list > .item', 'click', (e) => {
                let item = e.target;
                let value = item.getAttribute('value');
                window.eventHub.emit('open-sheet', [value, true])
            })
            $.bindEvent('#go-home', 'click', (e) => {
                window.eventHub.emit('open-home', true)
            })
            $.bindEvent('a', 'click', (e) => {
                let a = e.target
                let aLink = a.getAttribute('href')
                if (aLink && aLink.startsWith('#')) {
                    // find id and go
                    e.preventDefault()
                    e.stopPropagation()
                    window.scrollTo({ top: el(aLink).offsetTop, left: 0, behavior: 'auto' })
                }
            })
        },
        bindEventHub() {
            window.eventHub.on('open-home', (logStat) => {
                this.view.render(this.model.data);
                this.bindEvents();
                if (logStat) {
                    history.pushState({ 'page_id': 'home' }, null, './')
                }
            })
        },
        nav() {
            let path = window.location.href
            let url_segs = path.split('#')
            if (url_segs.length >= 2) {
                let page = url_segs[1]
                window.eventHub.emit('open-sheet', [page, false])
            }
        },
        /**
         * 搜索
         */
        loadIndex() {
            $.get(`./data/idx/sen.json`).then((rawText) => {
                log(rawText)
            })
        }
    }

    controller.init(view, model)
}
