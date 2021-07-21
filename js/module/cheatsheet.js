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

    let model = {
        meta: { column_size: 2 },
        column_size: {}
    }

    let controller = {
        init(view, model) {
            this.view = view
            this.model = model
            // this.view.render(this.model.data)
            this.bindEvents()
            this.bindEventHub()
        },
        bindEvents() {
            window.onresize = () => this.initSectionPosition.call(this)
        },
        bindEventHub() {
            window.eventHub.on('open-sheet', (data) => {
                // 加载过渡
                window.eventHub.emit('loadingOn')

                let logStat = data[1]
                let value = data[0]
                if (logStat) {
                    history.pushState({ 'page_id': value }, null, './#/' + value)
                }

                $.get(`./data/${value}.md`).then((rawText) => {
                    this.view.render(this.parseMarkdown(rawText))
                    this.initSectionPosition()
                    syncLoad(['./js/3rdparty/prism.js'], loadScript)

                    // 结束过渡
                    window.eventHub.emit('loadingOff')
                })
            })
        },
        parseMarkdown(rawText) {
            if (!rawText) return '';
            let result = {}
            let h2_section = []
            let h3_section = []

            let lines = rawText.split('\n');

            let h2_section_title = null;
            let h3_section_title = null;
            let block_status = false;
            let table_status = false;
            let list_status = false;
            let block_type = null;
            let data_cache = []
            let item_cache = []
            let current_pair = null

            lines.forEach(line => {
                _line = line.trim()
                // if (!block_status && !_line) return;


                if (table_status && !_line.startsWith('|')) {
                    // table 结束
                    if (data_cache.length > 0) {
                        item_cache.push(`${this.tableParser(data_cache)}`)
                        data_cache = []
                    }
                    table_status = false;
                }

                if (list_status && !_line.startsWith('- ')) {
                    // table 结束
                    if (data_cache.length > 0) {
                        item_cache.push(`${this.listParser(data_cache)}`)
                        data_cache = []
                    }
                    list_status = false;
                }


                if (_line === '---') {
                    block_status = !block_status;
                    if (!block_status) {
                        // 数据块结束
                        let data_block = data_cache.join('\n');
                        data_cache = []
                        current_pair = null;
                        // TOOD 解析meta
                        this.model.meta = result.meta = this.metaParser(data_block)
                    } else {
                        current_pair = '---'
                    }
                } else if (_line.startsWith('~~~') || _line.startsWith('```')) {
                    let _pair = _line.substr(0, 3)
                    if (block_status) {
                        if (current_pair === _pair) {
                            block_status = !block_status;
                            // 数据块结束
                            let data_block = data_cache.join('\n');
                            data_cache = []
                            current_pair = null;

                            let style = ''
                            if (this.model.meta.font_size) {
                                style = `font-size: ${this.model.meta.font_size} !important;`
                            }
                            if (block_type) {
                                item_cache.push(`<pre class="language-${block_type}"><code class="language-${block_type}" style="${style}">${this.html2Escape(data_block)}</code></pre>`)
                            } else {
                                item_cache.push(`<pre class="language-"><code class="language-" style="${style}">${this.html2Escape(data_block)}</code></pre>`)
                            }
                        } else {
                            // 在其他块中，什么都不做
                            data_cache.push(line);
                        }
                    } else {
                        let linesText = this.mergeTextLines(data_cache);
                        data_cache = []
                        if (linesText) {
                            item_cache.push(linesText)
                        }

                        block_status = !block_status;
                        current_pair = _pair
                        block_type = _line.substr(3) || ''
                    }
                } else if (!block_status && _line.startsWith('|')) {
                    // 解析table
                    if (!table_status) {
                        // 开始table
                        let linesText = this.mergeTextLines(data_cache);
                        data_cache = []
                        if (linesText) {
                            item_cache.push(linesText)
                        }

                        table_status = true
                    }
                    data_cache.push(line)
                } else if (!block_status && _line.startsWith('- ')) {
                    // 解析列表
                    if (!list_status) {
                        // 开始list
                        let linesText = this.mergeTextLines(data_cache);
                        data_cache = []
                        if (linesText) {
                            item_cache.push(linesText)
                        }

                        list_status = true
                    }
                    data_cache.push(line)

                } else if (!block_status && _line.startsWith('##')) {
                    // 标题
                    if (_line.startsWith('## ')) {
                        // section 结束
                        let linesText = this.mergeTextLines(data_cache);
                        data_cache = []
                        if (linesText) {
                            item_cache.push(linesText)
                        }

                        if (item_cache.length > 0) {
                            h3_section.push(`
                            <div class="sheet-section">
                            <div class="section-title"><h3>${this.parserText(h3_section_title)}</h3></div>
                                <div class="section-body">
                                    ${item_cache.join('\n')}
                                </div>
                            </div>`)

                            item_cache = []
                        }

                        if (h3_section.length > 0) {
                            h2_section.push(`
                            <div class="h2-section" id="${h2_section_title}">
                                ${h2_section_title ? `<div class='h2-section-title'><h2 id="${h2_section_title}">${this.parserText(h2_section_title)}</h2></div>` : ''}
                                ${h3_section.join('\n')}
                            </div>
                            `)
                            h3_section = []
                            h3_section_title = ''
                        }
                        h2_section_title = _line.substr(3)

                    } else if (_line.startsWith('### ')) {
                        // section 结束
                        let linesText = this.mergeTextLines(data_cache);
                        data_cache = []
                        if (linesText) {
                            item_cache.push(linesText)
                        }

                        if (item_cache.length > 0) {
                            h3_section.push(`
                            <div class="sheet-section">
                            <div class="section-title"><h3>${this.parserText(h3_section_title)}</h3></div>
                                <div class="section-body">
                                    ${item_cache.join('\n')}
                                </div>
                            </div>`)

                            item_cache = []
                        }
                        h3_section_title = _line.substr(4)
                    } else if (_line.startsWith('#### ')) {
                        // 子标题
                        let linesText = this.mergeTextLines(data_cache);
                        data_cache = []
                        if (linesText) {
                            item_cache.push(linesText)
                        }

                        item_cache.push(`<h4>${this.parserText(_line.substr(5))}</h4>`);
                    }

                } else if (!block_status && _line.startsWith('{')) {
                    // 配置
                    let pair = _line.substring(1, _line.length - 1).split(/:\s*/)
                    if (pair[0] === 'column_size') {
                        if (h2_section_title) {
                            this.model.column_size[h2_section_title] = parseInt(pair[1])
                        }
                    }

                } else {
                    data_cache.push(line)
                }

            })
            // 结束处理
            if (table_status) {
                // table 结束
                if (data_cache.length > 0) {
                    item_cache.push(`${this.tableParser(data_cache)}`)
                    data_cache = []
                }
            }

            if (list_status) {
                // list 结束
                if (data_cache.length > 0) {
                    item_cache.push(`${this.listParser(data_cache)}`)
                    data_cache = []
                }
            }

            let linesText = this.mergeTextLines(data_cache);
            data_cache = []
            if (linesText) {
                item_cache.push(linesText)
            }

            if (item_cache.length > 0) {
                h3_section.push(`
                <div class="sheet-section">
                <div class="section-title"><h3>${this.parserText(h3_section_title)}</h3></div>
                    <div class="section-body">
                        ${item_cache.join('\n')}
                    </div>
                </div>`)
            }

            if (h3_section.length > 0) {
                h2_section.push(`
                <div class="h2-section"  id="${h2_section_title}">
                    ${h2_section_title ? `<div class='h2-section-title'><h2 id="${this.parserText(h2_section_title)}">${h2_section_title}</h2></div>` : ''}
                    ${h3_section.join('\n')}
                </div>
                `)
            }

            result.text = h2_section.join('\n');
            return result;
        },
        html2Escape(sHtml) {
            return sHtml.replace(/[<>&"]/g, function (c) { return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]; });
        },
        mergeTextLines(lines) {
            if (!lines || lines.length === 0) return '';
            let mergeLines = []
            let cache = []
            lines.forEach(line => {
                let is_blank = /^\s*$/.test(line)
                if (is_blank) {
                    // 空行弹出缓存数据
                    if (cache.length > 0) {
                        mergeLines.push(cache.join(""));
                        cache = [];
                    }
                } else {
                    cache.push(line.trim());
                }
            })

            if (cache.length > 0) {
                mergeLines.push(cache.join(""));
            }

            if (mergeLines.length > 0) {
                return mergeLines.map(data => `<p>${this.parserText(data)}</p>`).join('\n')
            } else {
                return ''
            }
        },
        parserText(rawText) {
            if (!rawText) {
                return ''
            }

            // text = this.html2Escape(rawText)
            text = rawText

            // `分块处理
            let dataList = []
            let blockStatus = false;
            let lastChar = '';
            let cache = []
            for (let c of text) {
                if (c === '`' && !blockStatus) {
                    // on block
                    if (cache.length) {
                        dataList.push(this.mdFormate(cache.join('')))
                        cache = []
                    }
                    blockStatus = true
                    dataList.push('<code>')
                } else if (c === '`' && blockStatus) {
                    // off block
                    if (cache.length) {
                        dataList.push(this.html2Escape(cache.join('')))
                        cache = []
                    }
                    blockStatus = false
                    dataList.push('</code>')
                } else {
                    // others
                    cache.push(c)
                }
                lastChar = c
            }

            if (cache.length) {
                dataList.push(this.mdFormate(cache.join('')))
            }

            return dataList.join('')
        },
        mdFormate(text) {
            // 强调
            text = text.replace(/([^*])?\*\*([^*]+)\*\*([^*])?/g, '$1<em>$2</em>$3')
            // 斜体
            text = text.replace(/(([^_\w]|^)+)_([^_]+)_(([^_\w]|$)+)/g, '$1<i>$3</i>$4')
            text = text.replace(/([^*])?\*([^*]+)\*([^*])?/g, '$1<i>$2</i>$3')
            // 超链接
            text = text.replace(/\[([^\]]+)\]\(([^\)]+)\)/g, '<a title="$1" href="$2" target="_blank">$1</a>')
            // 序号
            text = text.replace(/\[(\d+)\]/g, '<span class=sn>$1</span>')

            // 自动高亮
            // `分块处理
            // debugger
            let dataList = []
            /**
             *  <  >  </  >
             * -------------
             *  1  2  3   4
             */
            let blockStatus = 0;
            let cache = []
            let lastChar = '';
            for (let c of text) {
                if (c === '<' && blockStatus === 0) {
                    // on block
                    if (cache.length) {
                        dataList.push(this.highlight(cache.join(""), this.model.meta.auto_highlight))
                        cache = []
                    }
                    blockStatus++
                } else if (c === '>' && blockStatus != 0) {
                    blockStatus++
                    if (blockStatus === 4) {
                        // off block
                        dataList.push(cache.join(''))
                        cache = []
                        blockStatus = 0
                    }
                } else if (c === '/') {
                    if (lastChar && lastChar === '<') {
                        blockStatus++
                    }
                }
                lastChar = c
                cache.push(c)
            }

            if (cache.length) {
                dataList.push(this.highlight(cache.join(""), this.model.meta.auto_highlight))
            }

            text = dataList.join('')

            return text
        },
        listParser(listLines) {
            let count = 0;
            let lastLevel = -1;
            let dataResult = [];
            listLines.forEach(line => {
                let matched = line.match(/^\s+/);
                let level = matched ? matched[0].length : 0;
                if (level !== lastLevel) {
                    if (lastLevel === -1) {
                        // 列表开始
                        dataResult.push('<ul>');
                        count++;
                    } else {
                        // 层级变化，结束上一层级，开启下一层级
                        if (lastLevel > level) {
                            dataResult.push('</ul>');
                            count--;
                        } else {
                            dataResult.push('<ul>');
                            count++;
                        }
                    }
                }
                dataResult.push(`<li>${this.parserText(line.substr(2 + level))}</li>`);
                lastLevel = level;
            })

            for (let i = 0; i < count; i++) {
                dataResult.push('</ul>');
            }

            return dataResult.join('')
        },
        highlight(inString, withHight) {
            if (withHight) {
                return inString.replace(
                    /([^\w]?)((\w|-|\/|\.|=|_|\+|@)(\w|\s|-|\/|\.|=|_|>|<|\+|@|…)+(\w|-|\/|\.|=|_|\+|@))([^\w]?)/g,
                    '$1<code>$2</code>$6')
            } else {
                return inString;
            }
        },
        singleCharSplit(inString, dimiter, blockChars) {
            let resultArray = [];
            if (!inString) {
                return resultArray;
            }
            let inBlock = false;
            let lastChar = ''
            let cache = []
            for (let c of inString) {
                if (blockChars && blockChars.includes(c)) {
                    inBlock = !inBlock;
                }

                if (inBlock) {
                    // 在块内，直接跳过
                    cache.push(c);
                } else {
                    if (c === dimiter) {
                        // 分隔符
                        if ('\\' === lastChar) {
                            // 被转义
                            cache.push(c);
                        } else {
                            // 分割
                            if (cache.length) {
                                resultArray.push(cache.join(''));
                                cache = [];
                            }
                        }
                    } else {
                        // 普通字符
                        cache.push(c);
                    }
                }

                lastChar = c;
            }
            return resultArray;
        },
        tableParser(tableLines) {
            // TODO 表对齐规则
            // 表数据
            let data_rows = tableLines.map(row => {
                data_row = this.singleCharSplit(row, '|')
                return data_row.map(data => data.trim().replace(/\\(\|)/g, '$1'))
            })

            // 表头
            let table_header = [];
            if (data_rows.length >= 2) {
                let row_idx_of_1 = data_rows[1];
                if (/^-+$/.test(row_idx_of_1.join(''))) {
                    table_header = data_rows[0];
                    data_rows.shift()
                    data_rows.shift()
                }
            }

            // 转换成html
            return `
            <table>
                <thead>
                    <tr>
                        ${table_header.map(title => `<th>${title}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                ${data_rows.map(row =>
                /^-+$/.test(row.join(''))
                    ? ''
                    : `<tr>${row.map(data => `<td>${this.parserText(data)}</td>`).join('')}</tr>`).join('')
                }
                </tbody>
            </table>`
        },
        initSectionPosition() {
            let default_column_size = this.model.meta.column_size || 2;
            let column_size = default_column_size;
            let idxToYOffset = {};
            if (!el('#sheet-body')) {
                return
            }
            let totalWidth = el('#sheet-body').offsetWidth
            if (totalWidth < 900) {
                column_size = Math.min(2, column_size - 1)
            };
            if (totalWidth < 600) {
                column_size = Math.min(1, column_size - 1)
            }
            column_size = column_size <= 0 ? 1 : column_size

            let singleWidth = (totalWidth - 20 * (column_size - 1)) / column_size

            let default_top = 0


            $.elAll('#sheet-body .h2-section').forEach(h2_section => {
                // 区块自定义列宽
                let { h2_column_szie, h2_singleWidth }
                    = this.initH2SectionWidth(column_size, singleWidth, h2_section, totalWidth)
                // 初始化高度
                h2_section.querySelectorAll('.sheet-section').forEach(section => {
                    section.setAttribute('style', `width: ${h2_singleWidth}px`);
                })
            })

            $.elAll('#sheet-body .h2-section').forEach(h2_section => {
                // 区块自定义列宽
                let { h2_column_szie, h2_singleWidth }
                    = this.initH2SectionWidth(column_size, singleWidth, h2_section, totalWidth)

                let h2_section_title = h2_section.querySelector('.h2-section-title')
                default_top += (h2_section_title ? h2_section_title.offsetHeight : 0)
                h2_section.querySelectorAll('.sheet-section').forEach(section => {
                    let colIdx = this.getIdxOfMinValue(idxToYOffset, h2_column_szie)
                    let height = section.offsetHeight;

                    let top = idxToYOffset[colIdx] || default_top;
                    let left = (colIdx) * (20 + h2_singleWidth);
                    section.setAttribute('style', `width: ${h2_singleWidth}px;top: ${top}px; left:${left}px`);

                    idxToYOffset[colIdx] = (idxToYOffset[colIdx] || default_top) + height;
                })

                let maxOffset = idxToYOffset[this.getIdxOfMaxValue(idxToYOffset, h2_column_szie)];
                h2_section.setAttribute('style', `height: ${maxOffset}px`);
                idxToYOffset = {}
                default_top = 0
            })
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
        },
        initH2SectionWidth(column_size, singleWidth, h2_section, totalWidth) {
            let h2_column_szie = column_size
            let h2_singleWidth = singleWidth
            let h2_id = h2_section.getAttribute('id')
            if (h2_id && this.model.column_size[h2_id]) {
                h2_column_szie = this.model.column_size[h2_id]
                if (totalWidth < 900) {
                    h2_column_szie = Math.min(2, h2_column_szie - 1)
                };
                if (totalWidth < 600) {
                    h2_column_szie = Math.min(1, h2_column_szie - 1)
                }

                h2_column_szie = h2_column_szie <= 0 ? 1 : h2_column_szie

                h2_singleWidth = (totalWidth - 20 * (h2_column_szie - 1)) / h2_column_szie
            }
            return { h2_column_szie, h2_singleWidth }
        }
    }

    controller.init(view, model)
}


