{
    let view = {
        el: '#main',
        template: ``,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        }
    }

    let model = {
    }

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            this.nav()
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {

            $.bindEvent('#go-home', 'click', (e) => {
                window.eventHub.emit('open-home', true)
            })
            $.bindEvent('#go-back', 'click', (e) => {
                history.go(-1)
            })
        },
        bindEventHub() {
    
        },
        nav() {
            let path = window.location.href
            let url_segs = path.split('#')
            if (url_segs.length >= 2) {
                let page = url_segs[1].substring(1)
                window.eventHub.emit('open-sheet', [page, false])
            }
        },
    }

    controller.init(view, model)
}
