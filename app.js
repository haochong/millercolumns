(function (name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('app', function() {

    $.domReady(function(){

        $.radio('log').subscribe(function(data) {
            var key = data && data.key
              , value = data && data.value

            console && console.log(key, value)
        })

        $script.path('modules/')

        $script(['column'], function() {
            $.radio('log').broadcast({
                key: 'column',
                value: 'module loaded'
            })
        })

    })

}, this);
