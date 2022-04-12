// ==UserScript==
// @name         Timologio telephone in PDF
// @namespace    marios8543-timologio-userscripts
// @version      0.1
// @description  Προσθέτει πεδία τηλεφώνου και email στα τιμολόγια
// @author       marios8543
// @match        https://mydata.aade.gr/timologio/invoice/*
// @match        https://mydata.aade.gr/timologio/company/*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    if (window.location.href.startsWith("https://mydata.aade.gr/timologio/company")) {
        let settingsList = document.getElementById("container-fluid-text").
            getElementsByTagName("form")[0].getElementsByClassName("card-body disabled border")[0];

        const emailRowDiv = document.createElement("div");
        emailRowDiv.setAttribute("class", "row");

        const emailDiv = document.createElement("div");
        emailDiv.setAttribute("class", "col-12 mb-3 input-group-sm");

        const emailLabel = document.createElement("label");
        emailLabel.setAttribute("class", "col-form-label-sm mb-0 pb-0 captionLabels");
        emailLabel.setAttribute("for", "company_Phone");
        emailLabel.innerText = "E-Mail:"
        emailDiv.appendChild(emailLabel);

        const emailInput = document.createElement("input");
        emailInput.setAttribute("class", "form-control valid");
        emailInput.setAttribute("placeholder", "E-Mail");
        emailInput.setAttribute("id", "company_Email");
        emailDiv.appendChild(emailInput);

        emailRowDiv.appendChild(emailDiv);

        settingsList.getElementsByClassName("row")[4].after(emailRowDiv);

        if (localStorage.getItem("company-email")) {
            document.getElementById("company_Email").value = localStorage.getItem("company-email");
        }

        document.getElementById("container-fluid-text").getElementsByTagName("form")[0].onsubmit = function (e) {
            e.preventDefault();
            localStorage.setItem("company-phone", document.getElementById("company_Phone").value);
            localStorage.setItem("company-email", document.getElementById("company_Email").value)
            e.target.submit();
        }
    }
    else {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://raw.githubusercontent.com/marios8543/timologio-userscripts/main/tim-js-patch/timologio-invoice2pdf.js",
            onload: function (response) {
                let invoice2pdfjs = document.createElement("script");
                invoice2pdfjs.innerHTML = response.responseText;
                document.body.appendChild(invoice2pdfjs);
            }
        });
    }
})();