import React from 'react';
import Toggler from '@fiverr/ui_toggle';
import { getRenderable } from '../lib';
import classNames from 'classnames';

class Toast extends Toggler {

    state = {
        shown: false
    }

    createRef = (ref = { addEventListener: () => null }) => {
        this.toastRef = ref;
    }

    componentDidMount() {
        setTimeout(this.open);
    }

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

    togglerDidOpen() {
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

    togglerWillClose(done) {
        const ref = this.toastRef;
        this.clearTimeout();

        this.setState({ shown: false, removed: true }, () => {
            ref.addEventListener('transitionend', function cb(e) {
                if (e.target === ref) {
                    ref.removeEventListener(e.type, cb);
                    done();
                }
            });
        });
    }

    togglerDidClose() {
        this.props.remove();
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

    toggleContent() {
        const { dismiss, toast, pauseOnHover, position, ...props } = this.props;
        const { shown, removed } = this.state;

        return (
            <div ref={this.createRef}
                onMouseEnter={() => pauseOnHover && this.clearTimeout()}
                onMouseLeave={() => pauseOnHover && this.startTimeout()}
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
