# react-toggle-aware [![Build Status](https://travis-ci.org/azuqua/react-toggle-aware.svg?branch=master)](https://travis-ci.org/azuqua/react-toggle-aware)

A tiny higher order component to track toggle state.

### Example
```js
import { Component } from 'react';
import { toggleAware } from 'react-toggle-aware';

@toggleAware({ // same as default options
    onDelay: 0,
    offDelay: 0,
    handler: 'onToggle',
    key: 'isToggled'
})
class CustomComponent extends Component {

    render() {
        // props will include the toggle handler
        let { isToggled, className, ...props } = this.props;

        if (isToggled) className += ' on';

        return (
            <div {...props} className={className}>

            </div>
        )
    }
};
```

### API

##### As a decorator
```js
@toggleAware(options)
export default class Test extends React.Component {
    /* your code */
}
```

##### As a function

```js
class Test extends React.Component {
    /* your code */
}

export default toggleAware(options)(Test);
```
#### Options

##### `onDelay` defaults to `0`
Time in `ms` to wait before setting the `active` status to `true`.

##### `offDelay` defaults to `0`
Time in `ms` to wait before setting the `active` status to `false`.

##### `handler` defaults to `'onToggle'`
Property name to expose the `handler` as.

##### `key` defaults to `'isToggled'`
Property name to expose the `active` status as.
