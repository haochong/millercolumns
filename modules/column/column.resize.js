(function(name, definition, context) {
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