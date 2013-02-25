(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('column.events', function() {

var resizeTimer;
$(window).on('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        $.radio('column.resize').broadcast()
    }, 300);
});

$('.events-wrap').on('click', function(e) {
    var el = $(e.target)
      , eventKey = el.data('event-key')
      , eventWrap = el.data('event-wrap') || '.events-wrap'

    if(eventKey) {
        $.radio(eventKey).broadcast({
            wrap: el.closest(eventWrap),
            timestamp: +new Date()
        })
    } else {
        $.radio('log').broadcast({ 
            key:'column.events warn',
            value: ' no event key'
        })
    }
})

$.radio('column.events.drag.bind').subscribe(function(data) {
    var wrap = data && data.wrap

    //TODO : IE compatible drag & drop
    $(wrap).dagron({
        handle: '.handle'
        , target: '.droptarget'
        , start: function (el) {
            // el is the item you started dragging
            if($(el).hasClass('item-open')) {
                $.radio('column.item.close').broadcast({
                    wrap: $(el)
                })
            }
        }
        , drag: function (el) {
            // el is dragged element
            $('.dragging').removeClass('dragging')
            $(el).addClass('dragging')
            console.log('dragging',el);
        }
        , drop: function (el) {
            // el is the target the dragged item was dropped on
            $.radio('column.item.move').broadcast({
                el: $('.dragging'),
                target: el
            })
            console.log('drop ',el);
        }
        , enter: function (el) {
            // el is the element target you entered into
            $('.drag-enter').removeClass('drag-enter')
            $(el).addClass('drag-enter')
            console.log('enter ',el);
        }
        , leave: function (el) {
            // el is the item left from
            console.log('leave ',el);
        }
        , end: function (el) {
            // el is the element you stopped dragging
            console.log('end dragg ',el);
            $('.drag-enter').removeClass('drag-enter')
        }
    })

    $.radio('log').broadcast({
        key: 'column.events.bind.drag',
        value: wrap
    })

})

}, this);
