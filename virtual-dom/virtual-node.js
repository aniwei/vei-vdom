var kebaCase    = require('lodash.kebabcase');
//var encode      = require('he').encode;
var VirtualText = require('./virtual-text');

const toString = Object.prototype.toString;

// vtype: 2 - defined, 3 - text, 1 - JSXExpression

function VirtualNode (type, props, children, vtype, host) {
    this.type     = type;
    this.props    = props;
    this.vtype    = vtype;
    this.host     = host;

    if (this.vtype === 2) {
      this.type.toString = () => {
        return this.type.name;
      }
    }

    if (!children) {
      children = [];

      if (props.children) {
        children.push(props.children);
      }
    } 

    this.children = flattenChildren(children);
}

VirtualNode.prototype = {
  stringify: function (parent) {
    const node = this;
    if (node === undefined) {
      return '';
    }

    const attributes = [];
    const html = [];
    const children = node.children;

    const toStyle = (style) => {
      const css = [];

      for (const key in style) {
        css.push(
          `${kebaCase(key)}: ${sytle[key]};`
        );
      }

      return css.join('');
    }

    if (node instanceof VirtualNode) {
      const props = node.props;

      html.push(
        '<' + node.type
      );

      for (let key in  props) {
        const prop = key;
        const value = props[prop];
        const onlyProp = value === true || value === 'true';
        let attribute;
        let type;

        type = onlyProp ? prop : 'prop';        
        
        key = wechatAttributes[key] || kebaCase(key);

        switch (key) {
          case 'style':
            attribute = `style="${toStyle(value)}"`;
            break;
          case 'prop':
            attribute = props;
            break
          default:
            if (!(typeof value === 'function')) {
              attribute = `${prop}="${value ? value : value}"`;
            }
        }
        
        attributes.push(attribute);
      }

      if (attributes.length > 0) {
        html.push(` ${attributes.join(' ')}`);
      }

      if (closeElement.indexOf(node.type) > -1) {
        html.push(' />');
      } else {
        html.push('>');

        if (children && children.length > 0) {
          children.forEach((child) => {
            html.push(child.stringify(node));
          });
        }

        html.push(
          `</${node.type}>`
        );
      }
    }

    return html.join('');
  },

  flatten: function () {
    let list = [this];

    if (this.children.length > 0) {
      this.children.forEach(function (child) {
        if (child.vtype > 2) {
          return list.push(child);
        }

        var flat = child.flatten();

        list = list.concat(flat);
      });
    }

    return list;
  },

  map: function (callback) {
    var flat;

    if (typeof callback === 'function') {
      flat = this.flatten();

      return flat.map(callback);
    }
  },

  forEach: function (callback) {
    this.map(callback);
  },

  everyProperty: function (callback) {
    var keys;
    var props = this.props;

    if (typeof callback === 'function') {
      if (props) {
        keys = Object.keys(props);

        keys.forEach(function (key) {
          callback(key, props[key], props);
        });
      }
    }
  },

  allProperties: function () {
    var keys;
    var props = this.props || {};

    if (props) {
      keys = Object.keys(props);

      return keys.map(function (key) {
        return {
          key:    key,
          value:  props[key]
        }
      });
    }
  }
}

module.exports = VirtualNode;

const flattenChildren = (list) => {
  let child;
  const children = [];

  while (list.length) {
    child = list.pop();

    if (typeOf(child) === 7) {
      child.forEach(c => list.push(c));
    } else {
      const childType = typeOf(child);

      if (childType < 3) {
        continue;
      }

      // number string symbol
      if (childType < 6) {
        child = new VirtualText(child);
      }

      children.unshift(child);
    }
  }

  return children;
}

const typeOf = (object) => {
  const undefined = void 0;

  if (object === undefined) {
    return 0;
  }

  return types[toString.call(object)] || 8
}

const closeElement = [
  'icon',
  'progress',
  'checkbox',
  'input',
  'radio',
  'switch',
  'textarea'
];

const wechatAttributes = {
  'class':                  'class',
  'className':              'class',
  'activeColor':            'activeColor',
  'backgroundColor':        'backgroundColor',
};

const types = {
  '[object Null]':      1,
  '[object Boolean]':   2,
  '[object Number]':    3,
  '[object String]':    4,
  '[object Symbol]':    5,
  '[object Function]':  6,
  '[object Array]':     7,
};