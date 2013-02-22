(function(name, definition, context) {
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

