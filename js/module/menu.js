{
    let view = {
        el: '#sheet-nav',
        template: `
        <div class="nav-wrapper">
            <div class="nav-title mini">菜单</div>
            <div class="nav-content hide">\${data}</div>
        </div>
        `,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        },
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
            $.bindEvent('.nav-title', 'click', () => {
                let isShow = $.el('.nav-content').classList.contains('show')
                if (isShow) {
                    $.el('.nav-content').classList.remove('show')
                    $.el('.nav-content').classList.add('hide')
                    $.el('.nav-title').classList.add('mini')
                } else {
                    $.el('.nav-content').classList.remove('hide')
                    $.el('.nav-content').classList.add('show')
                    $.el('.nav-title').classList.remove('mini')
                }
            })

            $.bindEventForce('.nav-item', 'click', (e) => {
                this.idJump(e.target.dataset.id)
            })

        },
        bindEventHub() {
            window.eventHub.on('buildNav', () => {
                // 遍历dom生成菜单
                let hList = [...($.elAll('#sheet-body h2, #sheet-body h3') || [])]
                // [tag, txt, id, pid]

                let lastH2Id = 'default'
                let items = hList
                    .filter(item => item.innerText)
                    .map(item => {
                        let tagName = item.tagName
                        if (tagName === 'H2') {
                            lastH2Id = item.id
                            return [tagName, item.innerText, item.id, null]
                        } else {
                            return [tagName, item.innerText, item.id, lastH2Id]
                        }
                    })

                this.view.render(
                    items.map(item => `
                    <div class="nav-item nav-type-${item[0]}" data-id="${item[2]}" data-pid="${item[3] ? item[3] : ''}">
                        ${item[1]}
                    </div>
                `).join('')
                )
            })
        },
        idJump(id) {
            let target = $.el(`#${id}`)
            target.scrollIntoView(true)
        }
    }

    controller.init(view, model)
}