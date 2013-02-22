(function(name, definition, context) {
  if (typeof module != 'undefined' && module.exports) module.exports = definition()
  else if (typeof context['define'] == 'function' && context['define']['amd']) define(name, definition)
  else context[name] = definition()
})('View', function() {

    var View = {
        render: function() {
        }
    };

    return View;

}, this);
