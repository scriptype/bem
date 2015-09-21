/*!
 *
 *    A small utility for creating dynamic BEM class names.
 *
 *    `element` and `modifier` delimiters can be customized.
 *    Defaults are, respectively: `__` and `--`.
 *
 *    UMD is borrowed from Q promise library. «https://github.com/kriskowal/q/blob/v1/q.js»
 *
 *    M. Enes Ertarhanacı, 2015
 *    «scriptyper@gmail.com»
 *
 */
(function (definition) {
  "use strict";

  if (typeof bootstrap === "function") {
    bootstrap("bem", definition);

    // CommonJS
  } else if (typeof exports === "object" && typeof module === "object") {
    module.exports = definition();

    // RequireJS
  } else if (typeof define === "function" && define.amd) {
    define(definition);

    // SES (Secure EcmaScript)
  } else if (typeof ses !== "undefined") {
    if (!ses.ok()) {
      return;
    } else {
      ses.makeBem = definition;
    }

    // <script>
  } else if (typeof window !== "undefined" || typeof self !== "undefined") {

    var global = typeof window !== "undefined" ? window : self;

    var previousBem = global.bem;
    global.bem = definition();

    global.bem.noConflict = function () {
      global.bem = previousBem;
      return this;
    };

  } else {
    throw new Error("This environment was not anticipated by bem. Please file a bug.");
  }

})(function () {

  var _delimiters = {
    element: '__',
    modifier: '--'
  }

  var _validations = {
    messages: {
      block: 'You must specify the name of block.',
      element: 'Element name must be a string.',
      modifier: 'Modifiers must be supplied in the `{name : bool || fn}` style.'
    },

    blockName(blockName) {
      if (
          typeof blockName === 'undefined' ||
          typeof blockName !== 'string' ||
          !blockName.length
      ) {
        console.warn(this.messages.block);
        return false
      }
      return true
    },

    element(element) {
      if (
          typeof element !== 'undefined' &&
          typeof element !== 'string'
      ) {
        console.warn(this.messages.element);
        return false
      }
      return true
    },

    modifiers(modifiers) {
      if (
          typeof modifiers !== 'undefined' &&
          (typeof modifiers !== 'object' ||
          toString.call(modifiers) !== '[object Object]')
      ) {
        console.warn(this.messages.modifier);
        return false
      }
      return true
    },

    validate(options) {
      return (
          this.blockName(options.block) &&
          this.element(options.element) &&
          this.modifiers(options.modifiers)
      )
    }
  };

  function setDelimiters (options) {
    typeof options.modifier !== 'undefined' && (
        _delimiters.modifier = options.modifier
    );

    typeof options.element !== 'undefined' && (
        _delimiters.element = options.element
    );
  }

  function makeClassName (options) {
    if (!_validations.validate(options)) {
      return null
    }

    var blockName = options.block;
    var element = options.element;
    var modifiers = options.modifiers;

    var _classNameWithElement = blockName;
    var _fullClassName = [];

    !!element && (
        _classNameWithElement += `${_delimiters.element}${element}`
    );

    !!modifiers && (
        Object.keys(modifiers).forEach( (mod) => {
          let condition = modifiers[mod];
          let pass = (typeof condition === 'function') ?
              condition(blockName, element, modifiers) :
              condition;

          !!pass && (
              _fullClassName.push(
                  `${_classNameWithElement}${_delimiters.modifier}${mod} `
              )
          )
        })
    );

    return `${_classNameWithElement} ${_fullClassName.join('')}`.slice(0, -1);

  }

  return { setDelimiters, makeClassName }
});