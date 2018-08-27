import React, { Component } from 'react';
import { getRenderable } from '../lib';
import { toastStyle } from './style';
import classNames from 'classnames';

class Toast extends Component {

    state = {
        shown: false
    }

    createRef = (ref = { addEventListener: () => null }) => {
        this.toastRef = ref;
    }

    componentDidMount() {
        setTimeout(this.open);
    }

    componentWillUnmount() {
        this.clearTimeout();
    }

    open = () => this.setState({ isOpen: true }, this.toastDidOpen);

    startTimeout = () => {
        const { toast } = this.props;

        if (toast.sticky) {
            return;
        }

        const timeout = typeof this.remaining === 'number' ? this.remaining : toast.timeout;
        const add = timeout < 200 ? 200 : 0;

        this.clearTimeout();
        this.timeout = setTimeout(this.close, timeout + add);
        this.ends = Date.now() + timeout + add;
        this.remaining = undefined;
    }

    clearTimeout = () => {
        if (this.props.toast.sticky) {
            return;
        }

        this.remaining = this.calcRemaining();
        clearTimeout(this.timeout);
    }

    calcRemaining = () => this.ends - Date.now();

    toastDidOpen() {
        const ref = this.toastRef;
        const {
            setHeight, toast
        } = this.props;

        setTimeout(() => {
            this.setState({
                shown: true
            }, () => {
                setHeight(toast.id, ref.clientHeight);
                this.startTimeout();
            });
        });
    }

    close = () => {
        const toastRef = this.toastRef;
        this.clearTimeout();

        const remove = () => this.setState({isOpen: false}, this.props.remove);

        this.setState({ shown: false, removed: true }, () => {
            toastRef.addEventListener('transitionend', function cb(e) {
                if (e.target === toastRef) {
                    toastRef.removeEventListener(e.type, cb);
                    remove();
                }
            });
        });
    }

    get className() {
        return [
            'shown',
            'removed'
        ].reduce((className, current) => this.state[current]
            ? `${className} ${current}`
            : className, 'bt-toast');
    }

    get dismiss() {
        const { toast, dismiss } = this.props;
        if (typeof toast.dismiss === 'function') {
            return (e) => toast.dismiss(e, toast, dismiss)
        }
        return dismiss;
    }

    render() {
        const { dismiss, toast, pauseOnHover, position, ...props } = this.props;
        const { shown, removed } = this.state;

        return (
            <div ref={this.createRef}
                onMouseEnter={() => pauseOnHover && this.clearTimeout()}
                onMouseLeave={() => pauseOnHover && this.startTimeout()}
                style={toastStyle({shown, removed})}
                className={this.className}>
                {getRenderable(toast.content, {
                    toastId: toast.id,
                    dismiss: this.dismiss,
                    onClick: toast.onClick ? (e) => toast.onClick(e, toast, dismiss) : undefined,
                    calcRemaining: this.calcRemaining,
                    position,
                    ...props
                })}
            </div>
        );
    }
}

export default Toast;

Toast.defaultProps = {
    bindBodyClickListener: false,
    pauseOnHover: true,
    toast: {}
};
