(function(name, definition, context) {
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
