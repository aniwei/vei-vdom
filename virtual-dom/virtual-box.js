function VirtualBox (children) {
  this.type       = '#box';
  this.children   = children;
  this.vtype      = 21;
}

VirtualBox.prototype = {
  stringify: function () {
    return '';
  }
}

module.exports = VirtualBox;