# bem

A small utility for creating dynamic BEM classnames.

### Usage

`var bem = require('bem');`

or

`define(['path/to/bem'], function...)`

or

`<script type='text/javascript' src='path/to/bem.min.js'></script>`

then

```js
var itemClasses = bem.makeClassName({
  block: 'foo-list',
  element: 'item',
  modifiers: {
    active: function (blockName, element, modifiers) {
      return true // logic
    },
    hidden: true // hardcode
  }
})

// "foo-list__item foo-list__item--active  foo-list__item--hidden"
```

`block` is mandatory to at least have a base class string.
`element` and `modifiers` options are optional.
`modifiers` is an object accepting multiple modifier conditions.

### Customize

You don't have to use default delimiters for elements and modifiers:

```js
bem.setDelimiters({
  modifier: '__'
  element: '⛄',
})

// bem.makeClass(...)
```

### Development

I've preferred to use ES6 syntax and APIs in the source code. This means, we
need babel to transpile it. And uglify for uglify.

 - `npm i -g babel`
 - `npm i -g uglify`
 - `npm run build`