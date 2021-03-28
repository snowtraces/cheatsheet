{
    let view = {
        el: '#loading',
        template: ``,
        timeout: null,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        },
        show() {
            this.timeout = setTimeout(() => {
                $.el(this.el).classList.remove('hide') 
            }, 200);
        },
        hide() {
            clearTimeout(this.timeout)
            $.el(this.el).classList.add('hide')
        }
    }

    let model = {}

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {

        },
        bindEventHub() {
            window.eventHub.on('loadingOn', () => {
                this.view.show()
            })
            window.eventHub.on('loadingOff', () => {
                this.view.hide()
            })
        }
    }

    controller.init(view, model)
}