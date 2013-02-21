(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.save', function() {

    $.radio('column.item.save').subscribe(function(data) {
        var wrap = data && data.wrap
          , editItem = data && data.el
          , parent = wrap.data('id')
          //, editItem = wrap.find('.item-edit')
          , editId = editItem.length && editItem.data('id')
          , input = editItem.length && editItem.find('.item-edit-input')
          , value = input && input.val()
          , errorKey = 'column.item.save error'
          , errorValue

          if(input.length) {
              if(value) {
                  $.radio('log').broadcast({
                      key: 'column.item.save',
                      value: input
                  })

                  if(!editId) {
                      errorValue = 'editId not exist'
                  }

                  if(!input) {
                      errorValue = 'input not exist'
                  }

                  if(!errorValue) {
                      $.radio('column.data.item.add').broadcast({
                          parent: parent,
                          key: editId,
                          value: value
                      })
                  }

                  input && input.length && input.remove()

                  editItem.find('.content').html(value).show()
                  wrap.find('.action-wrap').show()
                  editItem.removeClass('item-edit')
                  editItem.data('id', editId)
                  editItem.addClass('draggable')
                  $.radio('column.events.drag.bind').broadcast({
                      wrap: editItem
                  })

                  if(!wrap.find('.item-edit').length) {
                      console.log(wrap.find('.item-edit'))
                      $.radio('column.item.add').broadcast({
                          wrap: wrap,
                          content: ''
                      })
                  }
                  

              } else {
                  errorValue = 'input value empty'
              }
          } else {
              errorValue = 'input el not exists'
          }

          if(errorValue) {
              $.radio('log').broadcast({
                  key: errorKey,
                  value: errorValue
              })
          }
    })
    
}, this);

