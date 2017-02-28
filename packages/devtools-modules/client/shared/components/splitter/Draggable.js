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

  componentWillMount() {
    // In some situations we don't properly get the mouseup event. This can
    // happen when mouseup happens outside of the browser window. In that case
    // we don't want to attach the event listeners again at mousedown.
    this.areEventsBound = false;
  },

  startDragging(ev) {
    ev.preventDefault();
    const elt = ReactDOM.findDOMNode(this);
    if (!this.areEventsBound) {
      this.areEventsBound = true;
      const document = elt.ownerDocument;
      document.addEventListener("mousemove", this.onMove);
      document.addEventListener("mouseup", this.onUp);
    }
    this.props.onStart && this.props.onStart();
  },

  onMove(ev) {
    ev.preventDefault();
    // We pass the whole event because we don't know which properties
    // the callee needs.
    this.props.onMove(ev);
  },

  onUp(ev) {
    ev.preventDefault();
    this.unattachListeners();
    this.props.onStop && this.props.onStop();
  },

  unattachListeners() {
    const document = ReactDOM.findDOMNode(this).ownerDocument;
    document.removeEventListener("mousemove", this.onMove);
    document.removeEventListener("mouseup", this.onUp);
    this.areEventsBound = false;
  },

  render() {
    return dom.div({
      style: this.props.style,
      className: this.props.className,
      onMouseDown: this.startDragging
    });
  },

  componentWillUnmount() {
    this.unattachListeners();
  },
});

module.exports = Draggable;
