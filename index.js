import { LitElement, html, customElement } 
from 'https://unpkg.com/lit-element/lit-element.js?module';

class ColorPicker extends LitElement {
 
  
  state = { currentHex: "" };

  onChange = e => {
    this.setState({ currentHex: e.target.value });
  };

  render() {
      <TextField
          label="Hex">
          <Input value={this.state.currentHex} onChange={this.onChange} />
        </TextField>
        {this.render()}
     
}
render() {
    if (this.state.currentHex) {
      return (
        <p>
          This is selected {this.state.currentHex}!
        </p>
      );
    }
  }
} 

customElement('color-picker')(ColorPicker);
