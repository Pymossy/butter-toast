import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { generateId } from '../lib';
import styles, { POS_TOP, POS_BOTTOM, POS_LEFT, POS_RIGHT, POS_CENTER } from './styles';
import Tray from '../Tray';
export const CUSTOM_EVENT_NAME = 'ButterToast';

function dispatchCustomEvent(payload) {
    const event = new CustomEvent(CUSTOM_EVENT_NAME, {
        detail: Object.assign({}, payload)
    });

    window.dispatchEvent(event);
}

class ButterToast extends Component {

    static raise(payload = {}) {
        const id = generateId();
        dispatchCustomEvent({ id, ...payload });
        return id;
    }

    static dismiss(id) { dispatchCustomEvent({ dismiss: id }); }
    static dismissAll() { dispatchCustomEvent({ dismiss: 'all' }); }

    raise = (payload = {}) => {
        const id = generateId();
        this.tray.push({ id, ...payload });
        return id;
    }

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

        const style = styles(position, spacing);
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
    className: PropTypes.string,
    namespace: PropTypes.string,
    position: PropTypes.oneOf([
        PropTypes.objectOf({
            vertical: PropTypes.oneOf([POS_TOP, POS_BOTTOM]),
            horizontal: PropTypes.oneOf([POS_LEFT, POS_RIGHT, POS_CENTER])
        }),
        null
    ]),
    timout: PropTypes.number,
    spacing: PropTypes.number
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
