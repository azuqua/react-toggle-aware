import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { toggleAware } from '../src/toggleAware';

describe('toggleAware decorator', function() {

    it('should be a function', function() {
        expect(toggleAware).to.be.instanceOf(Function);
    });

    it('should optionally take an options object', function() {
        expect(() => toggleAware()).to.not.throw();
        expect(() => toggleAware({})).to.not.throw();
    });

    it('should return a toggleAware component factory', function() {
        expect(toggleAware()).to.be.instanceOf(Function);
    });
});

describe('toggleAware component factory', function() {

    let factory = null;
    before(function() {
        factory = toggleAware();
    });

    it('should be a function', function() {
        expect(factory).to.be.instanceOf(Function);
    });

    it('must accept one Component class', function() {
        class Test extends React.Component {};
        expect(() => factory()).to.throw();
        expect(() => factory(Test)).to.not.throw();
    });

    it('must return a WrappedComponent', function() {
        class Test extends React.Component {};
        const res = factory(Test);

        // expect(res).to.be.instanceOf(React.Component); // TODO why doesn't this work??
        expect(res.displayName).to.equal('ToggleAware(Test)');
    });
});

describe('toggleAware Component', function() {

    class _Test extends React.Component {
        render() {
            props = this.props;
            return <div {...this.props} />;
        }
    }

    let props = null;
    beforeEach(function() {
        props = null;
    });

    it('should use the default options if none are provided', function() {
        const Test = toggleAware()(_Test);
        TestUtils.renderIntoDocument(<Test />);

        // has default property names
        expect(props.isToggled).to.exist;
        expect(props.onToggle).to.be.instanceOf(Function);

        // starts inactive
        expect(props.isToggled).to.be.false;

        // syncronously becomes active
        props.onToggle();
        expect(props.isToggled).to.be.true;

        // syncronously becomes inactive
        props.onToggle();
        expect(props.isToggled).to.be.false;
    });

    it('should honor the "onDelay" option', function(done) {
        const Test = toggleAware({ onDelay: 100 })(_Test);
        TestUtils.renderIntoDocument(<Test />);

        // starts inactive
        expect(props.isToggled).to.be.false;

        // asynchronously becomes active
        props.onToggle();
        expect(props.isToggled).to.be.false;
        setTimeout(function() {
            expect(props.isToggled).to.be.true;
            done();
        }, 300);
    });

    it('should honor the "offDelay" option', function(done) {
        const Test = toggleAware({ offDelay: 100 })(_Test);
        TestUtils.renderIntoDocument(<Test />);

        // starts inactive
        expect(props.isToggled).to.be.false;

        // syncronously becomes active
        props.onToggle();
        expect(props.isToggled).to.be.true;

        // asynchronously becomes inactive
        props.onToggle();
        setTimeout(function() {
            expect(props.isToggled).to.be.false;
            done();
        }, 300);
    });

    it('should honor the "handler" property', function() {
        const Test = toggleAware({ handler: 'foo' })(_Test);
        TestUtils.renderIntoDocument(<Test />);

        expect(props.foo).to.be.instanceOf(Function);
        expect(props.onToggle).to.be.undefined;
    });

    it('should allow name collisions of "handler" property name', function() {
        const Test = toggleAware()(_Test);
        const spy = sinon.spy();
        TestUtils.renderIntoDocument(<Test onToggle={spy} />);
        props.onToggle();
        expect(spy).to.be.called;
        expect(props.isToggled).to.be.true;
    });

    it('should honor the "key" property', function() {
        const Test = toggleAware({ key: 'foo' })(_Test);
        TestUtils.renderIntoDocument(<Test />);

        expect(props.foo).to.be.false;
        expect(props.isToggled).to.be.undefined;
    });
});
