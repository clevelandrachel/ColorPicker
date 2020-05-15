
import { LitElement, html, css, customElement, property } from 'lit-element';
import { render as litRender } from 'lit-html/lib/shady-render.js';

import { useEffect, useState, useRef } from React;
import { React, ReactDOM, PropTypes, w3color }  from ReactDOM;
import { Grid, Typography, Button } from '@material-ui/core';


 class ColorPicker extends LitElement {
  state = { currentHex: "" };

  onChange = e => {
    this.setState({ currentHex: e.target.value });
  };

 render() {
    return (
<> 
        <TextField
          label="Hex">
          <Input value={this.state.currentHex} onChange={this.onChange} />
        </TextField>
        {this.render()}
       </> 
    
  

/* <ColorSlider
        hue={color.hue}
        saturation={color.sat * 100}
        lightness={color.lightness * 100}
        onChange={onChange}
      />
      <div className="values">
        <h1>{color.toHexString()}</h1>
        <h1>{color.toRgbString()}</h1>
      </div> */
 
    )
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
 
  
//Register componet 
customElements.define('color-picker', ColorPicker);
