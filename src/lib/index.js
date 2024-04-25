import React, { useEffect, useState } from "react";

/* Utility method to get renderable form link from enketo express.
* @param {string} formID - ID of the form to be rendered
* @param {function} setFormUrl - URL of the deployed Open Rosa Compliant server for handling form APIs
* @param {boolean} offline - Boolean to decide whether form should work offline or not
* @returns (null)
*/
const getSurveyUrl = async (formId, setFormUrl, offline = false) => {
    try {
        let res = await fetch(`${sessionStorage.getItem('enketo_express_server_uri')}/api/v2/survey/${offline ? 'offline' : "iframe"}`, {
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
        setFormUrl(offline ? res.offline_url : res.iframe_url)
    } catch (err) {
        console.log(err);
    }

}

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
}


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
const ODKPlayer = ({
    formId,
    height = '100vh',
    width = '100vw',
    offline = false,
    onChange = function () { },
    onSuccess = function () { },
    onFailure = function () { }
}) => {
    const [formUrl, setFormUrl] = useState('');

    const handleEventTrigger = async (e) => {
        // Calling onChange handler
        onChange(e)

        if (e?.data) {
            const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;

            // Calling onSuccess handler if form is successfully submitted
            if (data?.state == "ON_FORM_SUCCESS_COMPLETED") onSuccess(e);

            // Calling onFailure handler if submission is failed due to any reason
            if (data?.state?.includes("ON_FORM_FAILURE")) onFailure(e);
        }
    }

    // Binding form events to onChange
    const bindEventListener = () => {
        window.addEventListener("message", handleEventTrigger);
    };

    useEffect(() => {
        bindEventListener();
        getSurveyUrl(formId, setFormUrl, offline);
    }, [])

    return (<div>
        {formUrl && <iframe src={formUrl} style={{ height, width }} />}
    </div>
    )
};

export { initializeODKPlayer };
export default ODKPlayer;