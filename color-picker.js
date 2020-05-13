import { LitElement, html, property, customElement } from 'lit-element';

import { React, ReactDOM, PropTypes, w3color } = window;
import { useEffect, useState, useRef } = React;
import { render } = ReactDOM;

class ColorPicker extends LitElement {
  static get properties() {
    return { name: { type: String } };
  }

  constructor() {
    super();
    this.name = 'Color';
  }
  
  render() {
    return html`
       <div className="container" style={{ "--color": color.toHslString() }}>
      <div className="image"></div>
      <div className="title">
        <h1>Color Slider</h1>
      </div>
      
      <div className="current-color" id="outer-grid"><label for="hex_code">Current Selection</label><textarea class="form-control" id="Textarea">{color.toHexString()}</textarea>
    </div>
      
      <ColorSlider
        hue={color.hue}
        saturation={color.sat * 100}
        lightness={color.lightness * 100}
        onChange={onChange}
      />
      <div className="values">
        <h1>{color.toHslString()}</h1>
        <h1>{color.toHexString()}</h1>
        <h1>{color.toRgbString()}</h1>
      </div>
    </div>
    `;
  }
}

customElements.define('color-picker', ColorPicker);


/**
 * The color between two points
 */
const getAngle = (event, element, buffer) => {
  const { clientX: x, clientY: y } =
    event.touches && event.touches.length ? event.touches[0] : event;
  const {
    x: handleX,
    y: handleY,
    width: handleWidth,
    height: handleHeight
  } = element.getBoundingClientRect();
  const handleCenterPoint = {
    x: handleX + handleWidth / 2,
    y: handleY + handleHeight / 2
  };
  const angle =
    (Math.atan2(handleCenterPoint.y - y, handleCenterPoint.x - x) * 180) /
    Math.PI;
  return Math.max(buffer, Math.min(180 - buffer, Math.abs(angle)));
};

const getInitialAngle = (value, buffer) => {
  return ((180 - buffer * 2) / 100) * value + buffer;
};

const ColorSlider = ({
  hue: propsHue = 180,
  saturation: propsSaturation = 100,
  lightness: propsLightness = 50,
  handleSize = 50,
  BUFFER = 40,
  onChange
}) => {
  const [hue, setHue] = useState(propsHue);
  const [cursor, setCursor] = useState("touch");
  const [lightness, setLightness] = useState(propsLightness);
  const [saturation, setSaturation] = useState(propsSaturation);
  const [saturationAngle, setSaturationAngle] = useState(
    getInitialAngle(saturation, BUFFER)
  );
  const [lightnessAngle, setLightnessAngle] = useState(
    180 + (180 - getInitialAngle(lightness, BUFFER))
  );
  const handleRef = useRef(null);
  const trackRef = useRef(null);

  /**
   * Updates hue based on the pointer position
   */
  const updateHue = (e) => {
    // Return if moving handle
    if (e.target.dataset.hslSliderHandle) return;
    const { clientX: x } = e.touches && e.touches.length ? e.touches[0] : e;
    const {
      left: trackLeft,
      width: trackWidth
    } = trackRef.current.getBoundingClientRect();
    const newValue = (x - trackLeft) / trackWidth;
    setHue(Math.max(0, Math.min(360, newValue * 360)));
  };

  /*
   * @param {Object} event - pointer event
   */
  const updateLightness = (event) => {
    const angle = getAngle(event, handleRef.current, BUFFER);
    const lightness = ((angle - BUFFER) / (180 - BUFFER * 2)) * 100;
    setLightnessAngle(180 + (180 - angle));
    setLightness(lightness);
  };

  const updateSaturation = (event) => {
    const angle = getAngle(event, handleRef.current, BUFFER);
    const saturation = ((angle - BUFFER) / (180 - BUFFER * 2)) * 100;
    setSaturation(saturation);
    setSaturationAngle(angle);
  };

  /**
   * A method to handle event listening on handle
   */
  const handleUp = (onMove) => {
    const up = () => {
      setCursor("touch");
      document.documentElement.style.setProperty("--cursor", "initial");
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchend", up);
    };
    return up;
  };

  /**
   * Method to assign event listening for handle
   */
  const handleDown = (onMove, stopPropagation) => (e) => {
    if (stopPropagation) e.stopPropagation();
    setCursor("touching");
    document.documentElement.style.setProperty("--cursor", "touching");
    window.addEventListener("mousemove", onMove);
    window.addEventListener("touchmove", onMove);
    window.addEventListener("mouseup", handleUp(onMove));
    window.addEventListener("touchend", handleUp(onMove));
  };

  useEffect(() => {
    if (onChange) onChange({ hue, saturation, lightness });
  }, [hue, saturation, lightness]);

  useEffect(() => {
    trackRef.current.addEventListener("click", updateHue);
    return () => {
      trackRef.current.removeEventListener("click", updateHue);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      className="clr-slider"
      style={{
        "--handle-size": handleSize,
        "--lightness": lightness,
        "--saturation": saturation
      }}
    >
      <div
        className="clr-slider__handle"
        ref={handleRef}
        style={{
          "--cursor": cursor,
          "--value": Math.max(0, Math.min(100, (hue / 360) * 100)),
          "--hue": hue
        }}
        onMouseDown={handleDown(updateHue)}
        onTouchStart={handleDown(updateHue)}
        title="Set hue"
      >
        <div
          data-clr-slider-handle="true"
          className="clr-slider__handle clr-slider__handle--saturation"
          onMouseDown={handleDown(updateSaturation, true)}
          onTouchStart={handleDown(updateSaturation, true)}
          style={{ "--angle": saturationAngle }}
          title="Set saturation"
        />
        <div
          data-clr-slider-handle="true"
          className="clr-slider__handle clr-slider__handle--lightness"
          onMouseDown={handleDown(updateLightness, true)}
          onTouchStart={handleDown(updateLightness, true)}
          style={{ "--angle": lightnessAngle }}
          title="Set lightness"
        />
      </div>
    </div>
  );
};
ColorSlider.propTypes = {
  hue: PropTypes.number,
  handleSize: PropTypes.number,
  saturation: PropTypes.number,
  lightness: PropTypes.number,
  BUFFER: PropTypes.number,
  onChange: PropTypes.func
};
const App = () => {
  const [color, setColor] = useState(new w3color("hsl(180, 100%, 50%"));
  const onChange = ({ hue, saturation, lightness }) => {
    setColor(new w3color(`hsl(${hue}, ${saturation}%), ${lightness}%`));
  }}