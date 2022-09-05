import { BaseComponent } from '../base-component/base-component';
import './loader.scss';

class Loader {
  private preloaderWrapper?: BaseComponent;

  public createLoader(parentElement: HTMLElement): void {
    this.preloaderWrapper = new BaseComponent(parentElement, 'div', ['preloader']);
    new BaseComponent(this.preloaderWrapper.element, 'div', ['preloader-loading']);
  }

  public destroy(): void {
    this.preloaderWrapper?.remove();
  }
}

export default Loader;
