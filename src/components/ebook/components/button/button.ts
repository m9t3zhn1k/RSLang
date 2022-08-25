import { BaseComponent } from '../../../base-component/base-component';
import './button.scss'
export default class Button extends BaseComponent {

    constructor(parent: HTMLElement, buttonText: string) {
        super(parent,'button', ['button'], buttonText);
    }
} 