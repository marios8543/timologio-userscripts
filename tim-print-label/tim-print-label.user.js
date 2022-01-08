// ==UserScript==
// @name         Timologio label print button
// @namespace    timologio-userscripts
// @version      0.1
// @description  Εκτύπωση ετικέτας στοιχείων πελάτη
// @author       marios8543
// @match        https://mydata.aade.gr/timologio/invoice/NewInvoiceByCustomerList*
// @grant        GM_xmlhttpRequest
// ==/UserScript==

(function () {
    function __printLabel() {
        let info = getInvoice().counterpart;
        let text = `${info.name.trim()}\n${info.address.street.trim()}, ${info.address.postalCode.trim()}, ${info.address.city.trim()}`;
        console.log(text);
        GM_xmlhttpRequest({
            method: "POST",
            url: "http://127.0.0.1:5000/print_label",
            data: text,
          
            onload: function (response) {
                console.log(response);
            }
        });
    }

    let label_button = document.createElement("button");
    label_button.setAttribute("class", "btn btn-dark font-weight-bold rounded");
    label_button.innerHTML = "Εκτύπωση ετικέτας";
    label_button.onclick = function (ev) {
        ev.preventDefault();
        console.log("printing label");
        __printLabel();
    }
    document.getElementById("myform").getElementsByClassName("input-group-sm")[0].appendChild(label_button);
})();
