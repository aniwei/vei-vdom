function VirtualText (text) {
  this.type  = '#text';
  this.text  = text;
  this.vtype = 11;
}

VirtualText.prototype = {
  stringify: function () {
    var text = this.text.trim();

    return text ? this.text : text;
  }
}

module.exports = VirtualText;