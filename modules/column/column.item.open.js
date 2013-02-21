(function(name, definition, context) {
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
