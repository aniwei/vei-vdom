function VirtualProp (name, value) {
  this.type  = '#prop';
  this.name  = name;
  this.value = value;
  this.vtype = 20;
}

VirtualProp.prototype = {
  stringify: function () {
    var value = this.value;

    switch (value.type) {
      case 'literal':
        return value.value;

      case 'identifier':
        return `{{ ${value.value} }}`;
    }
  }
}

module.exports = VirtualProp;