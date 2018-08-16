import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styles, { POS_RIGHT, POS_TOP } from './styles';
import Tray from '../Tray';
export const CUSTOM_EVENT_NAME = 'ButterToast';

function dispatchCustomEvent(payload) {
    const event = new CustomEvent(CUSTOM_EVENT_NAME, {
        detail: Object.assign({}, payload)
    });

    window.dispatchEvent(event);
}

class ButterToast extends Component {

    static raise(payload = {}) { dispatchCustomEvent(payload); }
    static dismiss(id) { dispatchCustomEvent({ dismiss: id }); }
    static dismissAll(id) { dispatchCustomEvent({ dismiss: 'all' }); }

    raise = (payload) => this.tray.push(payload);
    dismiss = (id) => this.tray.push(id);
    dismissAll = () => this.tray.dismissAll();

    componentDidMount() {

        if (this.props.renderInContext) {
            return;
        }

        const {
            position,
            timeout,
            spacing,
            namespace
        } = this.props;

        const style = styles({ vertical: position.vertical, horizontal: position.horizontal, spacing });
        this.root = document.createElement('aside');
        this.root.setAttribute('class', this.className);
        Object.assign(this.root.style, style);
        document.body.appendChild(this.root);

        ReactDOM.render(<Tray ref={this.createTrayRef}
            namespace={namespace}
            spacing={spacing}
            timeout={timeout}
            position={position}/>,
        this.root);
    }

    componentWillUnmount() {
        if (!this.root) {
            return;
        }

        delete window._btTrays[this.id];
        ReactDOM.unmountComponentAtNode(this.root);
        this.root.parentNode.removeChild(this.root);
        delete this.root;
    }

    createTrayRef = (ref) => {
        window._btTrays = window._btTrays || {};

        if (!ref) {
            return;
        }

        this.id = ref.id;
        this.tray = ref;

        window._btTrays[ref.id] = ref;
    }

    get className() {
        const {
            className,
            namespace
        } = this.props;

        return [
            className,
            namespace
        ].reduce((className, current) => current ? `${className} ${current}` : className, 'butter-toast');
    }

    render() {

        const {
            renderInContext,
            timeout,
            spacing,
            namespace
        } = this.props;

        if (renderInContext) {

            return (
                <aside className={this.className}>
                    <Tray ref={this.createTrayRef}
                        namespace={namespace}
                        spacing={spacing}
                        timeout={timeout}/>
                </aside>
            );
        } else {
            return null;
        }
    }
}

ButterToast.propTypes = {
    renderInContext: PropTypes.bool,
    className: PropTypes.string
};

ButterToast.defaultProps = {
    className: '',
    namespace: '',
    position: {
        vertical: POS_TOP,
        horizontal: POS_RIGHT
    },
    timeout: 6000,
    spacing: 10
};

export default ButterToast;
