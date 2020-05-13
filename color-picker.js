import { LitElement, html } from 'lit-element';

class ColorPicker extends LitElement {
  static get properties() {
    return { name: { type: String } };
  }

  constructor() {
    super();
    this.name = 'Color';
  }
  
  render() {
    return html`<p>Hello, ${this.name}!</p>`;
  }
}

customElements.define('color-picker', ColorPicker);
