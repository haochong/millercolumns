(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.item.add', function() {

$.radio('column.item.add').subscribe(function(data) {
    var wrap = data && data.wrap
    , parent = wrap && wrap.data('id')
    , listWrap = wrap.find('.list')
    , id = data && data.id
    , content = data && data.content
    , btnRemoveHtml = ' <a href="javascript:;" class="btn-item-remove" data-event-key="column.item.remove" data-event-wrap=".item">x</a>'
    , btnEditHtml = ' <a href="javascript:;" class="btn-item-edit" data-event-key="column.item.edit" data-event-wrap=".item">edit</a>'
    , actionWrap = '<div class="action-wrap">' + btnEditHtml + btnRemoveHtml + '</div>'
    , errorKey = 'column.item.add error'
    , contentHtml = '<div data-event-key="column.item.open" data-event-wrap=".item" class="content handle">' + content + '</div>'
    , liClass = content ? 'item draggables droptarget' : 'item item-edit droptarget'
    , liId = content ? id : require('uuid-v4')()
    , liHtml = '<li data-id="'+liId+'" class="' + liClass + '">' + contentHtml + actionWrap + '</li>'
    , errorValue

    if(!wrap) {
        errorValue = 'column wrap not found error'
    }

    if(wrap) {

        listWrap.append(liHtml)

        if(!content) {
            $.radio('column.item.edit').broadcast({
                wrap: listWrap
            })
        }

    } else {
        $.radio('log').broadcast({
            key: errorKey,
            value: errorValue
        })
    }

})

}, this);
