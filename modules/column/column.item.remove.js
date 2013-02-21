(function(name, definition, context) {
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
