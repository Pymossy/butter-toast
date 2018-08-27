import styled from 'styled-components';
import { POS_RIGHT, POS_CENTER } from '../ButterToast/styles';

const Ul = styled.ul`
    position: relative;
    padding: 0;
    margin: 0;
    list-style-type: none;

    > li {
        position: absolute;
        transition transform .3s;

        > .bt-toast {
            opacity: 0;
            transition: opacity .5s;
        }

        > .bt-toast.shown {
            opacity: 1;
            transform: scale(1);
            transition-delay: .1s;
        }

        > .bt-toast.removed {
            transform: scale(.9);
            transition: opacity .3s, transform .3s;
        }
    }
`;

const Li = styled.li`
    ${({ position, spacing, offset, height }) => {
        let translateY;

        if (offset === 0 && !height && position.vertical === 'POS_TOP') {
            translateY = 'translateY(-100%)';
        } else {
            translateY = `translateY(${offset}px)`;
        }

        switch (position.horizontal) {
            case POS_RIGHT:
                return `right: ${spacing}px; transform: ${translateY}`;
            case POS_CENTER:
                return `transform: translateX(-50%) ${translateY};`;
            default:
                return `left: ${spacing}px; transform: ${translateY}`;
        }
    }}
`;

export {
    Ul,
    Li
};
