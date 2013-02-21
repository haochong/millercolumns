(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.resize', function() {

    var moduleKey = 'column.resize'

    $.radio(moduleKey).subscribe(function(data) {

        $('.column-view-wrap').css({
            height: $.viewport().height - $('.column-view-header').height() - $('.column-view-footer').height()
        })

        $.radio('log').broadcast({
            key: moduleKey,
            value: ' set list-wrap height to viewport height ' + viewportHeight
        })
        
    })

}, this);
