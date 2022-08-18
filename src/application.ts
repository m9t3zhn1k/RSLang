import { Footer } from './components/footer/footer';
import { Header } from './components/header/header';
import { Main } from './components/main/main';

import './styles/global.scss';

export class Application {
  private header: Header;

  private main: Main;

  private footer: Footer;

  constructor() {
    this.header = new Header(document.body);
    this.main = new Main(document.body, this.header.navigation.navigationButtons);
    this.footer = new Footer(document.body);
  }
}
