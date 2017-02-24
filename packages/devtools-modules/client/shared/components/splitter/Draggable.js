/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const React = require("react");
const ReactDOM = require("react-dom");
const { DOM: dom, PropTypes } = React;

const Draggable = React.createClass({
  displayName: "Draggable",

  propTypes: {
    onMove: PropTypes.func.isRequired,
    onStart: PropTypes.func,
    onStop: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  },

  startDragging(ev) {
    ev.preventDefault();
    const elt = ReactDOM.findDOMNode(this);
    // We use setCapture's retargeting option to get the events even when the
    // cursor moves over iframe children.
    elt.setCapture(true);
    elt.addEventListener("mousemove", this.onMove);
    elt.addEventListener("mouseup", this.onUp);
    this.props.onStart && this.props.onStart();
  },

  onMove(ev) {
    ev.preventDefault();
    // because we use setCapture, the event's properties are correct even with
    // iframes. We pass the whole event because we don't know which properties
    // our user needs.
    this.props.onMove(ev);
  },

  onUp(ev) {
    ev.preventDefault();
    const elt = ReactDOM.findDOMNode(this);
    elt.removeEventListener("mousemove", this.onMove);
    elt.removeEventListener("mouseup", this.onUp);
    this.props.onStop && this.props.onStop();
  },

  render() {
    return dom.div({
      style: this.props.style,
      className: this.props.className,
      onMouseDown: this.startDragging
    });
  }
});

module.exports = Draggable;
