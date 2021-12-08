{
    let view = {
        el: '#sheet-nav',
        template: `
        <div class="nav-wrapper">
            <div class="nav-btn">
                <div class="nav-btn__item nav-btn-top">顶</div>
                <div class="nav-btn__item nav-btn-menu">菜</div>
            </div>
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
            $.bindEvent('.nav-btn-menu', 'click', () => {
                let isShow = $.el('.nav-content').classList.contains('show')
                if (isShow) {
                    $.el('.nav-content').classList.remove('show')
                    $.el('.nav-content').classList.add('hide')
                    $.el('.nav-btn-menu').classList.remove('active')
                } else {
                    $.el('.nav-content').classList.remove('hide')
                    $.el('.nav-content').classList.add('show')
                    $.el('.nav-btn-menu').classList.add('active')
                    window.eventHub.emit('show-sheet')
                }
            })
            $.bindEvent('.nav-btn-top', 'click', () => {
                document.body.scrollIntoView({ behavior: "smooth" })
            })

            $.bindEventForce('.nav-item', 'click', (e) => {
                this.idJump(e.target.dataset.id)
            })

            $.bindEventForce('.next-ctrl', 'click', (_, from) => {
                console.log(from)
                console.log(from.parentNode.dataset.id)

                let children = $.elAll(`[data-pid="${from.parentNode.dataset.id}"]`)
                children.forEach(child => {
                    if (child.classList.contains('hide')) {
                        child.classList.remove('hide')
                        from.innerText = "-"
                    } else {
                        child.classList.add('hide')
                        from.innerText = "+"
                    }
                })
            })

        },
        bindEventHub() {
            window.eventHub.on('buildNav', () => {
                // 遍历dom生成菜单
                let hList = [...($.elAll('#sheet-body h2, #sheet-body h3') || [])]
                // [tag, txt, id, pid]

                let lastH2Id = 'default'
                let h2Count = 0;
                let items = hList
                    .filter(item => item.innerText)
                    .map(item => {
                        let tagName = item.tagName
                        if (tagName === 'H2') {
                            lastH2Id = item.id
                            h2Count++;
                            return [tagName, item.innerText, item.id, null]
                        } else {
                            return [tagName, item.innerText, item.id, lastH2Id]
                        }
                    })

                this.view.render(
                    items.map(item => `
                    <div class="nav-item nav-type-${item[0]} ${item[0] === 'H2' ? '' : (h2Count > 3) ? 'hide' : ''}" title="${item[1]}" data-id="${item[2]}" data-pid="${item[3] ? item[3] : ''}">
                    <span class="next-ctrl">${item[0] === 'H2' ? ((h2Count > 3) ? '+' : '-') : ''}</span> ${item[1]}
                    </div>
                `).join('')
                )
            })
        },
        idJump(id) {
            if (!id) return
            let target = $.el(`#${id}`)
            target.scrollIntoView({ behavior: "smooth" })
        }
    }

    controller.init(view, model)
}