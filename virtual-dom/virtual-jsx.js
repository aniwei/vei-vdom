function VirtualJSX (identifier) {
  this.type       = '#jsx';
  this.identifier = identifier;
  this.vtype      = 12;
}

VirtualJSX.prototype = {
  stringify: function () {
    var identifier = this.identifier.trim();

    return identifier ? `{{ ${identifier} }}` : identifier;
  }
}

module.exports = VirtualJSX;