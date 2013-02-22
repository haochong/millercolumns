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
          , columnWidth = $('.list-wrap').width()
          , i = 0
          , newWrap

        newWrap = $('<div class="list-wrap"></div>')
        newWrap.data('id', id)
        newWrap.append('<ul class="list"></ul>')
        
        $('.column-view').append(newWrap)

        newWidth = $('.list-wrap').length * columnWidth
        $('.column-view').css({
            width: newWidth
        })

        // Todo : iscroll 
        //newWrap.scrollTo(newWidth, 0)

        $.radio('column.resize').broadcast()

        if(len) {
            for(; i < len; i++) {
                
                $.radio('log').broadcast({
                    key: moduleKey,
                    value: ' adding ' + itemsIndex[i]
                })

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
