import React from 'react';
import PropTypes from 'prop-types';
import Div, { SCHEME_GREY, SCHEME_RED, SCHEME_ORANGE, SCHEME_GREEN, SCHEME_BLUE } from './style';
import { getRenderable } from '../../lib';

function Crunch({ dismissible, title, content, icon, dismiss, toastId, scheme, onClick, position }) {

    return (
        <Div hasIcon={!!icon} scheme={scheme} hasOnClick={!!onClick} dismissible={dismissible} position={position}>
            {dismissible && <button onClick={dismiss} className="btn-dismiss">&times;</button>}
            <span onClick={onClick}>
                { icon && <div className="bt-icon">{getRenderable(icon)}</div> }
                { title && <strong className="title">{getRenderable(title)}</strong> }
                {content && <div className="content">{getRenderable(content)}</div>}
            </span>
        </Div>
    );
}

export default Crunch;
export { SCHEME_GREY, SCHEME_RED, SCHEME_ORANGE, SCHEME_GREEN, SCHEME_BLUE };

Crunch.prototypes = {
    content: PropTypes.node,
    icon: PropTypes.node,
    className: PropTypes.string,
    scheme: PropTypes.oneOf([SCHEME_GREY, SCHEME_RED, SCHEME_ORANGE, SCHEME_GREEN, SCHEME_BLUE]),
    toastId: PropTypes.string,
    dismiss: PropTypes.func,
    onClick: PropTypes.func,
    dismissible: PropTypes.bool
};

Crunch.defaultProps = {
    dismissible: true,
    scheme: SCHEME_GREY,
    title: null,
    content: null,
    icon: null
};
