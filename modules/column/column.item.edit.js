(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.edit', function() {

    var moduleKey = 'column.item.edit'

    $.radio(moduleKey).subscribe(function(data) {
        var wrap = data && data.wrap
          , editEl = wrap.find('.item-edit')
          , contentEl
          , inputHtml
          , saveItem = function(el) {
              var itemEl = $(el)

              if(!itemEl.hasClass('item-edit')) {
                  itemEl = itemEl.closest('.item-edit')
              }

              $.radio('column.item.save').broadcast({
                  wrap: $(el).closest('.list-wrap'),
                  el: itemEl
              })
          }
          , keyboardHandler = function(e) {
              if(13 === e.keyCode) {
                  saveItem(e.target)
              }
          }

        if(wrap) {

            if(!editEl.length) {
                editEl = wrap
                editEl.addClass('item-edit')
            }

            if(editEl) {

                contentEl = editEl.find('.content')
                inputHtml = '<div class="item-edit-input-wrap"><input class="item-edit-input" value="' + contentEl.html() + '" /></div>'
                editEl.append(inputHtml)
                editEl.find('.item-edit-input').on('keypress', keyboardHandler).focus()

                contentEl.hide()
                editEl.find('.action-wrap').hide()

            } else {
                $.radio('log').broadcast({
                    key: moduleKey + ' error',
                    value: '.item-edit element not exist'
                })
            }
        } else {
            $.radio('log').broadcast({
                key: moduleKey + ' error',
                value: 'wrap not exist'
            })
        }
    })

}, this);

