import React from 'react'; // eslint-disable-line no-unused-vars
import { storiesOf, action } from '@storybook/react';
import { Button } from '@storybook/components';
import addons from '@storybook/addons';
import { quotes, icons, rand } from './helpers';
import ButterToast, { CinnamonSugar } from '../src';
import './style.scss';

let toasts = [];
function raise(e, options = {}) {
    e.preventDefault();

    const toast = CinnamonSugar.crunch({
        title: rand(['WOW!', 'Awesome!', 'Whoopsie', 'Error']),
        message: rand(quotes),
        theme: rand(['red', 'blue', 'purple', 'orange', 'green', 'grey']),
        icon: rand(icons),
        onClick: action('clickity')
    });

    ButterToast.raise(toast, options);
}

function raiseRandomTimeout(e, name) {
    raise(e, {toastTimeout: (Math.round(Math.random()*7000) + 3000), name});
}

function toastShowed(toastId){
    toasts.push(toastId);
}

function toastHidden(toastId){
    toasts = toasts.filter((id) => id !== toastId);
}
function dismissWithName(e, name){
    e.preventDefault();
    ButterToast.dismiss({name});
}
function dismissAll(e){
    e.preventDefault();
    ButterToast.dismiss();
}
function raiseSticky(e) {
    raise(e, {
        sticky: true,
        dismissOnClick: true,
        name: 'slim t5'
    });
}

function raiseDismissOnClick(e) {
    raise(e, {
        dismissOnClick: true,
        name: 'slim t2'
    });
}

storiesOf('Toast', module) // eslint-disable-line no-undef
    .add('bottom-left (pauseOnHover example)', () => (
        <div>
            <ButterToast name="slim t1" pauseOnHover trayPosition="bottom-left"/>
            <a href="#!" onClick={(e) => raise(e, {name: 'slim t1'})}>Raise a toast!</a>
        </div>
    ))
    .add('top-right: Dismiss on Click', () => (
        <div>
            <ButterToast name="slim t2" trayPosition="top-right"/>
            <a href="#!" onClick={raiseDismissOnClick}>Raise a toast!</a>
        </div>
    ))
    .add('top-left', () => (
        <div>
            <ButterToast name="slim t3" trayPosition="top-left"/>
            <a href="#!" onClick={(e) => raise(e, {name: 'slim t3'})}>Raise a toast!</a>
        </div>
    ))
    .add('bottom-center', () => (
        <div>
            <ButterToast name="slim t4" trayPosition="bottom-center"/>
            <a href="#!" onClick={(e) => raise(e, {name: 'slim t4'})}>Raise a toast!</a>
        </div>
    ))
    .add('top-center: Sticky', () => (
        <div>
            <ButterToast name="slim t5" theme="cinnamon-sugar" trayPosition="top-center"/>
            <a href="#!" onClick={raiseSticky}>Sticky Toast!</a>
        </div>
    ))
    .add('bottom-right: Random Timeout', () => (
        <div>
            <ButterToast name="slim t6" renderInContext={true} toastShowed={toastShowed} toastHidden={toastHidden}/>
            <ButterToast name="slim t16" renderInContext={true}/>
            <div><a href="#!" onClick={(e) => raiseRandomTimeout(e, 'slim t6')}>Raise a toast!</a></div>
            <div><a href="#!" onClick={(e) => raiseRandomTimeout(e, 'slim t16')}>Raise a toast with diffrent name!</a></div>
            <div className="dismiss-section">
                <Button onClick={dismissAll}>
                    Dismiss All
                </Button>
                <Button onClick={(e) => dismissWithName(e, 'slim t6')}>
                    Dismiss With Name (slim t6)
                </Button>
            </div>
        </div>
    ));