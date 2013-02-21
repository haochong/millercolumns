(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column', function() {

    $script.path('modules/column/')
    
    var columnModules = [
        'column.header.set',
        'column.item.add',
        'column.item.create',
        'column.item.remove',
        'column.item.list',
        'column.item.open',
        'column.item.close',
        'column.item.move',
        'column.item.save',
        'column.item.edit',
        'column.data.item',
        'column.events',
    ]

    $script(columnModules, function() {
        $('.loading').hide()
        $.radio('column.data.item.list').broadcast({
            id: 0,
            callback: function(data) {
                $.radio('column.item.list').broadcast(data)
            }
        })
    })
    
}, this);
