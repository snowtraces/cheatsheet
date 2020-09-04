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
                \${data.map(item => \`<div class=item value=\${item}>\${item}</div>\`).join('')}
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
            'powershell', 'css', 'es6', 'regex'
        ]
    }

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            $.bindEvent('#recomment-list > .item', 'click', (e) => {
                let item = e.target;
                let value = item.getAttribute('value');
                window.eventHub.emit('open-sheet', value)
            })

        },
        bindEventHub() {

        }
    }

    controller.init(view, model)
}
