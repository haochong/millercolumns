(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.toolbar', function() {

    $.radio('column.item.create').subscribe(function(data) {
        var wrap = data && data.wrap

        console.log('create ', wrap)

        if(wrap) {

            $.radio('column.item.add').broadcast({
                wrap: wrap,
                content: ''
            })

        } else {
            $.radio('log').broadcast({
                key: 'column.item.create error ',
                value: ' no wrap found'
            })
        }
    })

}, this);

