import { createElement, Component } from 'react';
import hoist from 'hoist-non-react-statics';
import getDisplayName from 'react-display-name';

export const toggleAware = ({
    onDelay = 0,
    offDelay = 0,
    handler = 'onToggle',
    key = 'isToggled',
} = {}) => (OriginalComponent) => {
    // create higher order component to track state
    class WrappedComponent extends Component {

        static displayName = `ToggleAware(${getDisplayName(OriginalComponent)})`;

        constructor() {
            super();

            this.timeout = null;
            this.goal = false;
            this.state = {
                active: false,
            };
        }

        componentWillUnmount() {
            if (this.timeout) clearTimeout(this.timeout);
        }

        onToggle = (...args) => {
            if (this.props[handler]) this.props[handler](...args);
            if (this.timeout) clearTimeout(this.timeout);

            // eye on the prize
            const goal = this.goal = !this.goal;
            const delay = goal ? onDelay : offDelay;

            const commit = () => {
                this.timeout = null;
                this.setState({ active: goal });
            };


            if (delay) {
                this.timeout = setTimeout(commit, delay);
            } else {
                commit();
            }
        };

        render() {
            const props = {
                ...this.props,
                [key]: this.state.active,
                [handler]: this.onToggle,
            };

            return createElement(OriginalComponent, props);
        }
    }

    return hoist(WrappedComponent, Component);
};
