(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.data.item', function() {

    var items = $.cache('column').get('items') || {}
      , itemsIndex = $.cache('column').get('itemsIndex') || {}
      , updateItemCache = function() {
          $.cache('column').set('items', items)
          $.cache('column').set('itemsIndex', itemsIndex)
      }

    $.radio('column.data.item.list').subscribe(function(data) {

        var id = data && data.id 
          , callback = data && data.callback 
          , errorKey = 'column.data.item.list error'
          , errorValue = ''

        if(callback && {}.toString.call(callback) === '[object Function]') {
            $.radio('log').broadcast({
                key: 'column.data.item.list ',
                value: itemsIndex[id]
            })
            callback({
                id: id,
                items: items,
                itemsIndex: itemsIndex[id]
            })
            
        } else {
            errorValue = ' callback function'
        }

        if(errorValue) {
            $.radio('log').broadcast({
                key: errorKey,
                value: errorValue
            })
        }

    })

    $.radio('column.data.item.add').subscribe(function(data){
        var parent = data && data.parent
          , key = data && data.key
          , value = data && data.value

        if(!items[key]) {
            if(!itemsIndex[parent]) {
                itemsIndex[parent] = []
            }
            itemsIndex[parent].push(key)
        }

        items[key] = { content: value }
        $.radio('log').broadcast({
            key: 'column.data.item.add',
            value: data
        })

        updateItemCache()
    })

    $.radio('column.data.item.move').subscribe(function(data) {
        var moduleKey = 'column.data.item.move'
          , id = data && data.id
          , fromWrap = data && data.fromWrap
          , toWrap = data && data.toWrap
          , toEl = data && data.toEl

        $.radio('log').broadcast({
            key: moduleKey,
            value: id
        })

        itemsIndex[fromWrap].splice(itemsIndex[fromWrap].indexOf(id), 1)

        if(!itemsIndex[toWrap]) { 
            itemsIndex[toWrap] = []
        }

        itemsIndex[toWrap].splice(itemsIndex[toWrap].indexOf(toEl), 0, id);

        updateItemCache()
    })

    $.radio('column.data.item.remove').subscribe(function(data){
        var parent = data && data.parent
          , key = data && data.key

        delete items[key]
        itemsIndex[parent].splice(itemsIndex[parent].indexOf(key), 1)
        updateItemCache()
    })

}, this);

