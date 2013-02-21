(function(name, definition, context) {
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

