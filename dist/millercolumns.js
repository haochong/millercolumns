(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.data.item', function() {

    var items = $.cache('column').get('items') || {}
      , itemsIndex = $.cache('column').get('itemsIndex') || {}
      , updateItemCache = function() {
          $.cache('column').set('items', items)
          $.cache('column').set('itemsIndex', itemsIndex)
      }

    $.radio('column.data.item.list').subscribe(function(data) {

        var id = data && data.id 
          , callback = data && data.callback 
          , errorKey = 'column.data.item.list error'
          , errorValue = ''

        if(callback && {}.toString.call(callback) === '[object Function]') {
            $.radio('log').broadcast({
                key: 'column.data.item.list ',
                value: itemsIndex[id]
            })
            callback({
                id: id,
                items: items,
                itemsIndex: itemsIndex[id]
            })
            
        } else {
            errorValue = ' callback function'
        }

        if(errorValue) {
            $.radio('log').broadcast({
                key: errorKey,
                value: errorValue
            })
        }

    })

    $.radio('column.data.item.add').subscribe(function(data){
        var parent = data && data.parent
          , key = data && data.key
          , value = data && data.value

        if(!items[key]) {
            if(!itemsIndex[parent]) {
                itemsIndex[parent] = []
            }
            itemsIndex[parent].push(key)
        }

        items[key] = { content: value }
        $.radio('log').broadcast({
            key: 'column.data.item.add',
            value: data
        })

        updateItemCache()
    })

    $.radio('column.data.item.move').subscribe(function(data) {
        var moduleKey = 'column.data.item.move'
          , id = data && data.id
          , fromWrap = data && data.fromWrap
          , toWrap = data && data.toWrap
          , toEl = data && data.toEl

        $.radio('log').broadcast({
            key: moduleKey,
            value: id
        })

        itemsIndex[fromWrap].splice(itemsIndex[fromWrap].indexOf(id), 1)

        if(!itemsIndex[toWrap]) { 
            itemsIndex[toWrap] = []
        }

        itemsIndex[toWrap].splice(itemsIndex[toWrap].indexOf(toEl), 0, id);

        updateItemCache()
    })

    $.radio('column.data.item.remove').subscribe(function(data){
        var parent = data && data.parent
          , key = data && data.key

        delete items[key]
        itemsIndex[parent].splice(itemsIndex[parent].indexOf(key), 1)
        updateItemCache()
    })

}, this);

;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.events', function() {

var resizeTimer;
$(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        $.radio('column.resize').broadcast()
    }, 300);
});

$('.events-wrap').on('click', function(e) {
    var el = $(e.target)
      , eventKey = el.data('event-key')
      , eventWrap = el.data('event-wrap') || '.events-wrap'

    if(eventKey) {
        $.radio(eventKey).broadcast({
            wrap: el.closest(eventWrap),
            timestamp: +new Date()
        })
    } else {
        $.radio('log').broadcast({ 
            key:'column.events warn',
            value: ' no event key'
        })
    }
})

$.radio('column.events.drag.bind').subscribe(function(data) {
    var wrap = data && data.wrap

    $(wrap).dagron({
        handle: '.handle'
        , target: '.droptarget'
        , start: function (el) {
            // el is the item you started dragging
            if($(el).hasClass('item-open')) {
                $.radio('column.item.close').broadcast({
                    wrap: $(el)
                })
            }
        }
        , drag: function (el) {
            // el is dragged element
            $(el).addClass('dragging')
            console.log('dragging',el);
        }
        , drop: function (el) {
            // el is the target the dragged item was dropped on
            $.radio('column.item.move').broadcast({
                el: $('.dragging'),
                target: el
            })
            console.log('drop ',el);
        }
        , enter: function (el) {
            // el is the element target you entered into
            $('.drag-enter').removeClass('drag-enter')
            $(el).addClass('drag-enter')
            console.log('enter ',el);
        }
        , leave: function (el) {
            // el is the item left from
            console.log('leave ',el);
        }
        , end: function (el) {
            // el is the element you stopped dragging
            console.log('end dragg ',el);
            $('.drag-enter').removeClass('drag-enter')
        }
    })

    $.radio('log').broadcast({
        key: 'column.events.bind.drag',
        value: wrap
    })

})

}, this);
;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.header.set', function() {

var moduleKey = 'column.header.set'
  , errorKey = moduleKey + ' error'
  , errorValue = ''

$.radio(moduleKey).subscribe(function(data) {
    var value = data && data.value

    if(value) {
        $('.column-view-header h2').html(value)
    } else {
        errorValue = 'empty header value'
    }

    if(errorValue) {
        $.radio('log').broadcast({
            key: errorKey,
            value: errorValue
        })
    }

    $.radio('log').broadcast({
        key: moduleKey,
        value: value
    })

})

}, this);
;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.add', function() {

$.radio('column.item.add').subscribe(function(data) {
    var wrap = data && data.wrap
    , parent = wrap && wrap.data('id')
    , listWrap = wrap.find('.list')
    , id = data && data.id
    , content = data && data.content
    , btnRemoveHtml = ' <a href="javascript:;" class="btn-item-remove" data-event-key="column.item.remove" data-event-wrap=".item">x</a>'
    , btnEditHtml = ' <a href="javascript:;" class="btn-item-edit" data-event-key="column.item.edit" data-event-wrap=".item">edit</a>'
    , actionWrap = '<div class="action-wrap">' + btnEditHtml + btnRemoveHtml + '</div>'
    , errorKey = 'column.item.add error'
    , contentHtml = '<div data-event-key="column.item.open" data-event-wrap=".item" class="content handle">' + content + '</div>'
    , liClass = content ? 'item draggables droptarget' : 'item item-edit droptarget'
    , liId = content ? id : require('uuid-v4')()
    , liHtml = '<li data-id="'+liId+'" class="' + liClass + '">' + contentHtml + actionWrap + '</li>'
    , errorValue

    if(!wrap) {
        errorValue = 'column wrap not found error'
    }

    if(wrap) {

        listWrap.append(liHtml)

        if(!content) {
            $.radio('column.item.edit').broadcast({
                wrap: listWrap
            })
        }

    } else {
        $.radio('log').broadcast({
            key: errorKey,
            value: errorValue
        })
    }

})

}, this);
;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.close', function() {

    var moduleKey = 'column.item.close'

    // TODO : close item
    $.radio(moduleKey).subscribe(function(data) {
        var wrap = data && data.wrap
          , parent = wrap.closest('.list-wrap')
          , next = parent.next()

        while(next.length) {
            next.remove()
            next = parent.next()
        }

        wrap.removeClass('item-open').removeClass('item-open-old')
        $('.item-open').addClass('item-open-old')
        
    })

}, this);

;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.toolbar', function() {

    $.radio('column.item.create').subscribe(function(data) {
        var wrap = data && data.wrap

        console.log('create ', wrap)

        if(wrap) {

            $.radio('column.item.add').broadcast({
                wrap: wrap,
                content: ''
            })

        } else {
            $.radio('log').broadcast({
                key: 'column.item.create error ',
                value: ' no wrap found'
            })
        }
    })

}, this);

;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.edit', function() {

    var moduleKey = 'column.item.edit'

    $.radio(moduleKey).subscribe(function(data) {
        var wrap = data && data.wrap
          , editEl = wrap.find('.item-edit')
          , contentEl
          , inputHtml
          , saveItem = function(el) {
              var itemEl = $(el)

              if(!itemEl.hasClass('item-edit')) {
                  itemEl = itemEl.closest('.item-edit')
              }

              $.radio('column.item.save').broadcast({
                  wrap: $(el).closest('.list-wrap'),
                  el: itemEl
              })
          }
          , keyboardHandler = function(e) {
              if(13 === e.keyCode) {
                  saveItem(e.target)
              }
          }

        if(wrap) {

            if(!editEl.length) {
                editEl = wrap
                editEl.addClass('item-edit')
            }

            if(editEl) {

                contentEl = editEl.find('.content')
                inputHtml = '<div class="item-edit-input-wrap"><input class="item-edit-input" value="' + contentEl.html() + '" /></div>'
                editEl.append(inputHtml)
                editEl.find('.item-edit-input').on('keypress', keyboardHandler).focus()

                contentEl.hide()
                editEl.find('.action-wrap').hide()

            } else {
                $.radio('log').broadcast({
                    key: moduleKey + ' error',
                    value: '.item-edit element not exist'
                })
            }
        } else {
            $.radio('log').broadcast({
                key: moduleKey + ' error',
                value: 'wrap not exist'
            })
        }
    })

}, this);

;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.list', function() {

    var moduleKey = 'column.item.list'

    $.radio(moduleKey).subscribe(function(data) {

        var id = data && data.id
          , items = data && data.items
          , itemsIndex = data && data.itemsIndex
          , len = items && itemsIndex && itemsIndex.length
          , i = 0
          , newWrap
          , wrapHtml

        wrapHtml = '<div class="list-wrap" data-id="' + id + '">'
        wrapHtml += '<ul class="list"></ul>'
        wrapHtml += '</div></div>'

        $('.column-view-wrap').append(wrapHtml)
        newWidth = $('.list-wrap').length * 310
        $('.column-view-wrap').css({
            width: newWidth
        })

        $.radio('column.resize').broadcast()

        window.scrollTo(newWidth, 0)

        newWrap = $('.list-wrap').last()

        if(len) {
            for(; i < len; i++) {
                $.radio('column.item.add').broadcast({
                    parent: 0,
                    id: itemsIndex[i],
                    wrap: newWrap,
                    content: items[itemsIndex[i]].content
                })
            }
        } else {
            $.radio('log').broadcast({
                key: 'column.init',
                value: ' empty column'
            })
        }

        $.radio('column.item.add').broadcast({
            wrap: newWrap,
            content: ''
        })

        $.radio('column.events.drag.bind').broadcast({
            wrap: newWrap.find('.draggables')
        })

        $.radio('log').broadcast({
            key: moduleKey,
            value: data
        })
    })

}, this);
;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.move', function() {

    var moduleKey = 'column.item.move'
      , errorKey = moduleKey + ' error'
      , errorValue

    $.radio(moduleKey).subscribe(function(data) {
        var el = data && data.el
          , fromWrap = $(el).closest('.list-wrap')
          , toEl = data && $(data.target)
          , toWrap

        $(el).removeClass('dragging')

        if(!fromWrap.length) {
            errorValue = 'from wrap not found'
        }
        if(!toEl.length) {
            errorValue = 'to el not found'
        }

        if(!$(toEl).hasClass('list-wrap')) {
            toWrap = $(toEl).closest('.list-wrap')
        }

        $.radio('log').broadcast({
            key: moduleKey + ' from',
            value: fromWrap
        })

        $.radio('log').broadcast({
            key: moduleKey + ' to',
            value: toWrap
        })

        $.radio('column.data.item.move').broadcast({
            id: el.data('id'),
            fromWrap: fromWrap.data('id'),
            toEl: toEl.data('id'),
            toWrap: toWrap.data('id')
        })

        $(el).insertBefore($(toEl))

        if(errorValue) {
            $.radio('log').broadcast({
                key: errorKey,
                value: errorValue
            })
        }

    })

}, this);

;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.open', function() {

    var moduleKey = 'column.item.open'

    $.radio(moduleKey).subscribe(function(data) {
        var wrap = data && data.wrap
          , parent = wrap.closest('.list-wrap')
          , id = wrap.data('id')
          , itemEdit = $('.item-edit.draggables')

        if(wrap.hasClass('item-open') && !wrap.hasClass('item-open-old')) {
            $.radio('column.item.edit').broadcast({
                wrap: wrap
            })
            $.radio('log').broadcast({
                key: moduleKey,
                value: 'click current opened item will edit it'
            })
            return
        }

        if(itemEdit.length) {
            $.radio('column.item.save').broadcast({
                wrap: itemEdit.closest('.list-wrap'),
                el: itemEdit
            })
        }

        $.radio('column.item.close').broadcast({
            wrap: parent.find('.item-open')
        })

        $.radio('column.header.set').broadcast({
            value: wrap.find('.content').html()
        })

        wrap.addClass('item-open')

        $.radio('column.data.item.list').broadcast({
            id: id,
            callback: function(data) {
                $.radio('column.item.list').broadcast(data)
            }
        })

        $.radio('log').broadcast({
            key: moduleKey,
            value: id
        })
    })

}, this);
;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.remove', function() {

    $.radio('column.item.remove').subscribe(function(data) {
        var wrap = data && data.wrap
          , parent = wrap.closest('.list-wrap').data('id')
          , id = wrap.data('id')

        if(wrap && id) {
            wrap.remove()

            $.radio('column.data.item.remove').broadcast({
                key: id,
                parent: parent
            })
            
        }
    })

}, this);
;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.save', function() {

    $.radio('column.item.save').subscribe(function(data) {
        var wrap = data && data.wrap
          , editItem = data && data.el
          , parent = wrap.data('id')
          , editId = editItem.length && editItem.data('id')
          , input = editItem.length && editItem.find('.item-edit-input')
          , value = input && input.val()
          , errorKey = 'column.item.save error'
          , errorValue

          if(input.length) {
              if(value) {
                  $.radio('log').broadcast({
                      key: 'column.item.save',
                      value: input
                  })

                  if(!editId) {
                      errorValue = 'editId not exist'
                  }

                  if(!input) {
                      errorValue = 'input not exist'
                  }

                  if(!errorValue) {
                      $.radio('column.data.item.add').broadcast({
                          parent: parent,
                          key: editId,
                          value: value
                      })
                  }

                  input && input.length && input.remove()

                  editItem.find('.content').html(value).show()
                  wrap.find('.action-wrap').show()
                  editItem.removeClass('item-edit')
                  editItem.data('id', editId)
                  editItem.addClass('draggable')
                  $.radio('column.events.drag.bind').broadcast({
                      wrap: editItem
                  })

                  if(!wrap.find('.item-edit').length) {
                      console.log(wrap.find('.item-edit'))
                      $.radio('column.item.add').broadcast({
                          wrap: wrap,
                          content: ''
                      })
                  }
                  

              } else {
                  errorValue = 'input value empty'
              }
          } else {
              errorValue = 'input el not exists'
          }

          if(errorValue) {
              $.radio('log').broadcast({
                  key: errorKey,
                  value: errorValue
              })
          }
    })
    
}, this);

;(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.resize', function() {

    var moduleKey = 'column.resize'
      , wrapHeight

    $.radio(moduleKey).subscribe(function(data) {

        wrapHeight = $.viewport().height - $('.column-view-header').height() - $('.column-view-footer').height()

        $('.column-view-wrap').css({
            height: wrapHeight
        })

        $.radio('log').broadcast({
            key: moduleKey,
            value: ' set list-wrap height to viewport height ' + wrapHeight
        })
        
    })

}, this);
