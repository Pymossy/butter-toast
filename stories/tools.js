import React from 'react';
import { action, configureActions } from '@storybook/addon-actions';
import ButterToast, { Cinnamon } from '../src';
import Funnies from 'funnies';
import { sample } from 'lodash';
const funnies = new Funnies();

const intervals = [];
const dismiss = (e, toast, dismiss) => { action('onDismiss callback:')(e, toast, dismiss); dismiss(); };
const onClick = action('onClick callback:');

const chooseIcon = () => sample([ 'trash', 'pencil', 'info', 'times', 'warning', 'check', 'phone', 'bolt', 'circle-thin', 'ellipsis-h', 'wifi' ]);

export function start({ kind, sticky = true, scheme, icon, dismissible = true } = {}) {
    let interval;
    intervals.forEach(clearInterval);
    intervals.length = 0;

    let counter = 0;

    const fire = () => {
        counter += 1;

        if (sticky && counter > 4) {
            clearInterval(interval);
        }

        const style = `scheme-${scheme}`;
        const content = funnies.message();
        const Icon = <i className={`fa fa-${chooseIcon()}`}/>;

        const base = { sticky, onClick, dismiss, timeout: 7000 };

        if (kind === 'crisp') {
            ButterToast.raise({
                ...base,
                content: <Cinnamon.Crisp scheme={style}
                    title="crisp example"
                    dismissible={dismissible}
                    content={content}
                    icon={icon ? Icon : null}/>
            });
        }

        if (kind === 'crunch') {
            ButterToast.raise({
                ...base,
                content: <Cinnamon.Crunch scheme={style}
                    title="crunch example"
                    dismissible={dismissible}
                    content={content}
                    icon={icon ? Icon : null}/>
            });
        }
        if (kind === 'slim') {
            ButterToast.raise({
                ...base,
                content: <Cinnamon.Slim scheme={style}
                    content={content}/>
            });
        }

    };
    // setTimeout(fire);
    interval = setInterval(fire, 2000);
    intervals.push(interval);
}

export const dismissAll = () => {
    window.dispatchEvent(new CustomEvent('ButterToast', {detail:{ dismiss: 'all' }}));
};
