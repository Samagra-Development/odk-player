"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initializeODKPlayer = exports.default = void 0;
require("core-js/modules/es.array.includes.js");
require("core-js/modules/es.json.stringify.js");
require("core-js/modules/es.promise.js");
require("core-js/modules/es.string.includes.js");
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
/* Utility method to get renderable form link from enketo express.
* @param {string} formID - ID of the form to be rendered
* @param {function} setFormUrl - URL of the deployed Open Rosa Compliant server for handling form APIs
* @param {boolean} offline - Boolean to decide whether form should work offline or not
* @returns (null)
*/
const getSurveyUrl = async function getSurveyUrl(formId, setFormUrl) {
  let offline = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
  try {
    const formCache = JSON.parse(localStorage.getItem('form_cache') || '{}');
    let formRes = formCache["".concat(formId, "_").concat(offline ? 'offline' : 'online')];
    if (formRes) {
      console.log("Returning from Cache: ", "".concat(formId, "_").concat(offline ? 'offline' : 'online'));
      setFormUrl(formRes);
      return;
    }
    let res = await fetch("".concat(sessionStorage.getItem('enketo_express_server_uri'), "/api/v2/survey/").concat(offline ? 'offline' : "iframe"), {
      method: 'POST',
      headers: {
        Authorization: 'Basic ' + btoa('enketorules:'),
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        server_url: sessionStorage.getItem('open_rosa_server_uri'),
        form_id: formId
      })
    });
    res = await res.json();
    formCache["".concat(formId, "_").concat(offline ? 'offline' : 'online')] = offline ? res.offline_url : res.iframe_url;
    localStorage.setItem('form_cache', JSON.stringify(formCache));
    setFormUrl(offline ? res.offline_url : res.iframe_url);
  } catch (err) {
    console.log(err);
  }
};

/* Method to initialize ODK player with required URIs.
* @param {string} enketoUri - URL of the deployed Enketo Express instance
* @param {string} serverUri - URL of the deployed Open Rosa Compliant server for handling form APIs
* @returns (null)
*/
const initializeODKPlayer = (enketoUri, serverUri) => {
  if (!enketoUri || !serverUri) {
    throw new Error("Please provide valid initialization URIs");
  }
  sessionStorage.setItem("enketo_express_server_uri", enketoUri);
  sessionStorage.setItem("open_rosa_server_uri", serverUri);
};

/*
* Enketo based implementation to render ODK Forms
* Currently supports rendering both online and offline forms
* TODO : add functionality to preview & edit submitted instances 
* @component ODKPlayer
* @param {Object} props - The props object
* @param {string} formId - The id of the form to be rendered 
* @param {sring} height - Height of the iframe
* @param {sring} width - Width of the iframe
* @param {boolean} offline - Boolean to decide whether form should work offline or not
* @param {function} onChange - Callback function to be executed on any form change event
* @param {function} onSuccess - Callback function to be executed on successful submission of form
* @param {function} onFailure - Callback function to be executed on failure of form submission 
* @return {JSX.Element} - Renders the ODK form in an iframe 
*/
exports.initializeODKPlayer = initializeODKPlayer;
const ODKPlayer = _ref => {
  let {
    formId,
    height = '100vh',
    width = '100vw',
    offline = false,
    onChange = function () {},
    onSuccess = function () {},
    onFailure = function () {}
  } = _ref;
  const [formUrl, setFormUrl] = (0, _react.useState)('');
  const handleEventTrigger = async e => {
    // Calling onChange handler
    onChange(e);
    if (e !== null && e !== void 0 && e.data) {
      var _data$state;
      const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;

      // Calling onSuccess handler if form is successfully submitted
      if ((data === null || data === void 0 ? void 0 : data.state) == "ON_FORM_SUCCESS_COMPLETED") onSuccess(e);

      // Calling onFailure handler if submission is failed due to any reason
      if (data !== null && data !== void 0 && (_data$state = data.state) !== null && _data$state !== void 0 && _data$state.includes("ON_FORM_FAILURE")) onFailure(e);
    }
  };

  // Binding form events to onChange
  const bindEventListener = () => {
    window.addEventListener("message", handleEventTrigger);
  };

  // Unbinding form events
  const unbindEventListener = () => {
    window.removeEventListener('message', handleEventTrigger);
  };
  (0, _react.useEffect)(() => {
    bindEventListener();
    getSurveyUrl(formId, setFormUrl, offline);
    return () => unbindEventListener();
  }, []);
  return /*#__PURE__*/_react.default.createElement("div", null, formUrl && /*#__PURE__*/_react.default.createElement("iframe", {
    src: formUrl,
    style: {
      height,
      width
    }
  }));
};
var _default = exports.default = ODKPlayer;