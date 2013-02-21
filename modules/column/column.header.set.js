(function(name, definition, context) {
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
