{
    let view = {
        el: '#main',
        template: `
        <div id="sheet-wrapper" class="w">
            <div id="sheet-title">
                <h1>\${data.meta.title}<span> cheatsheet</span></h1>
            </div>
            <div id="sheet-body">
                \${data.text}
            </div>
        </div>`,
        render(data) {
            $.el(this.el).innerHTML = $.evalTemplate(this.template, data)
        }
    }

    let model = {}

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            // this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            window.onresize = this.initSectionPosition
        },
        bindEventHub() {
            window.eventHub.on('open-sheet', (value) => {
                $.get(`./data/${value}.md`).then((rawText) => {
                    this.view.render(this.parseMarkdown(rawText))
                    this.initSectionPosition()
                    syncLoad(['./js/3rdparty/prism.js'], loadScript)
                })
            })
        },
        parseMarkdown(rawText) {
            if (!rawText) return '';
            let result = {}
            let resultList = []


            let PAIR_CHARS = ['---', '~~~', '```']
            let lines = rawText.split('\n');

            let section_status = false;
            let section_title = null;
            let block_status = false;
            let block_type = null;
            let data_cache = []
            let item_cache = []
            let current_pair = null

            lines.forEach(line => {
                _line = line.trim()
                if (!_line) return;

                if (_line === '---') {
                    block_status = !block_status;
                    if (!block_status) {
                        // 数据块结束
                        let data_block = data_cache.join('\n');
                        data_cache = []
                        current_pair = null;
                        // TOOD 解析meta
                        result.meta = this.metaParser(data_block)
                        result
                    } else {
                        current_pair = '---'
                    }
                } else if (_line.startsWith('~~~') || _line.startsWith('```')) {
                    let _pair = _line.substr(0, 3)
                    if (block_status) {
                        if (current_pair === _pair) {
                            block_status = !block_status;
                            // 数据库结束
                            let data_block = data_cache.join('\n');
                            data_cache = []
                            current_pair = null;

                            if (block_type) {
                                item_cache.push(`<pre class="language-${block_type}"><code class="language-${block_type}">${this.html2Escape(data_block)}</code></pre>`)
                            } else {
                                item_cache.push(`<pre class="language-"><code class="language-">${this.html2Escape(data_block)}</code></pre>`)
                            }
                        } else {
                            // 在其他块中，什么都不做
                            data_cache.push(line);
                        }
                    } else {
                        block_status = !block_status;
                        current_pair = _pair
                        block_type = _line.substr(3) || ''
                    }
                } else if (!block_status && _line.startsWith('|')) {
                    // TODO 解析table

                } else if (!block_status && _line.startsWith('###')) {
                    // TODO 标题
                    if (_line.startsWith('### ')) {
                        if (!section_status) {
                            // section 开始
                            section_status = true;
                            section_title = _line.substr(4)
                        } else {
                            // section 结束
                            section_status = false;
                            resultList.push(`
                            <div class="sheet-section">
                            <div class="section-title"><h3>${section_title}</h3></div>
                                <div class="section-body">
                                    ${item_cache.join('\n')}
                                </div>
                            </div>`)

                            item_cache = []
                        }
                    } else if (_line.startsWith('#### ')) {
                        // TODO 子标题
                    }


                } else {
                    data_cache.push(line)
                }

            })

            result.text = resultList.join('\n');
            return result;
        },
        html2Escape(sHtml) {
            return sHtml.replace(/[<>&"]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]; });
        },
        initSectionPosition() {
            let idx = 0;
            let column_size = 3;
            let idxToYOffset = {};
            let totalWidth = el('#sheet-body').offsetWidth
            if (totalWidth < 900) {
                column_size = 2
            };
            if (totalWidth < 600) {
                column_size = 1
            }
            let singleWidth = (totalWidth - 20 * (column_size - 1)) / column_size
            $.elAll('#sheet-body > .sheet-section').forEach(section => {
                let colIdx = this.getIdxOfMinValue(idxToYOffset, column_size)
                let height = section.offsetHeight;

                let top = idxToYOffset[colIdx] || 0;
                let left = (colIdx) * (20 + singleWidth);
                section.setAttribute('style', `width: ${singleWidth}px;top: ${top}px; left:${left}px`);

                idxToYOffset[colIdx] = (idxToYOffset[colIdx] || 0) + height;
                idx++;
            })

            let maxOffset = idxToYOffset[this.getIdxOfMaxValue(idxToYOffset, column_size)];
            el('#sheet-body').setAttribute('style', `height: ${maxOffset}px`);
        },
        metaParser(metaText) {
            let lineList = metaText.split('\n');
            let regexedList = lineList
                .filter(line => !/^\s*$/.test(line))
                .map(line => /^(\s*)([^\s:]+):?\s*(.*)/.exec(line));
    
            let meta = {}
            let offsex_off_array = 1;
            regexedList.forEach((matched, idx) => {
                let title = matched[2]
                if (title === '-') {
                    let lastTitle = regexedList[idx - offsex_off_array][2];
                    meta[lastTitle] = meta[lastTitle] || []
                    meta[lastTitle].push(matched[3])
                    offsex_off_array++;
                } else {
                    meta[title] = matched[3]
                    offsex_off_array = 1
                }
            });
            return meta;
        },
        getIdxOfMaxValue(source, size) {
            let max = -1;
            let idx = 0;
            for (let i = 0; i < size; i++) {
                let value = source[i] || 0
                if (value > max) {
                    max = value
                    idx = i
                }
            }

            return idx;
        },
        getIdxOfMinValue(source, size) {
            let min = Infinity;
            let idx = 0;
            for (let i = 0; i < size; i++) {
                let value = source[i] || 0
                if (value < min) {
                    min = value
                    idx = i
                }
            }

            return idx;
        }
    }

    controller.init(view, model)
}
