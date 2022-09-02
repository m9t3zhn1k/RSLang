import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Main } from './components/main/main';
import { IBaseComponent, IHeader } from './types/types';
import './styles/global.scss';
import ButtonBack from './components/back-top/back-top';

export class Application {
  private header: IHeader;

  private main: IBaseComponent;

  private footer: Footer;

  constructor() {
    this.header = new Header(document.body);
    this.footer = new Footer(document.body);
    this.main = new Main(document.body, this.header.navigation.navigationButtons, this.header, this.footer);
    document.body.appendChild(this.footer.element);
    new ButtonBack();
  }
}
