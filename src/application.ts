import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Main } from './components/main/main';
import { IBaseComponent, IHeader } from './types/types';
import './styles/global.scss';

export class Application {
  private header: IHeader;

  private main: IBaseComponent;

  private footer: Footer;

  constructor() {
    this.header = new Header(document.body);
    this.main = new Main(document.body, this.header.navigation.navigationButtons, this.header.wave);
    this.footer = new Footer(document.body);
  }
}
