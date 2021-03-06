// ==UserScript==
// @name         Timologio deltio apostolis
// @namespace    marios8543-timologio-userscripts
// @version      0.1
// @description  Επιτρέπει την έκδοση ανεπίσημων δελτίων αποστολής
// @author       marios8543
// @match        https://mydata.aade.gr/timologio/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js
// ==/UserScript==

(function () {
    if (window.location.href.includes("NewInvoiceByCustomerList")) {
        GM_xmlhttpRequest({
            method: "GET",
            url: "https://raw.githubusercontent.com/marios8543/timologio-userscripts/main/tim-js-patch/timologio-invoice2pdf.js",
            onload: function (response) {
                let invoice2pdfjs = document.createElement("script");
                invoice2pdfjs.innerHTML = response.responseText;
                document.body.appendChild(invoice2pdfjs);
            }
        });

        let da_create_button = document.createElement("button");
        da_create_button.setAttribute("class", "btn btn-dark font-weight-bold rounded");
        da_create_button.innerHTML = "Έκδοση δελτίου αποστολής";
        da_create_button.onclick = function (ev) {
            ev.preventDefault();
            let aa = createDeltioAp();
            alert(`Εκδόθηκε δελτίο αποστολής με Α/Α ${aa}`);
        }

        let da_selection = document.createElement("select");
        da_selection.setAttribute("id", "deltio_ap_selection");
        da_selection.setAttribute("class", "custom-select mr-sm-2");
        da_selection.setAttribute("style", "width: 20%; margin-left: 10px;")
        da_selection.onchange = function (e) {
            let val = $("#deltio_ap_selection").val();
            restoreDeltioAp(val);
        }

        setTimeout(function () {
            $("#deltio_ap_selection").append(`<option value="" selected>Δελτία αποστολής</option>`);
            for (const [key, value] of Object.entries(__getDeltia())) {
                if (key.startsWith(getInvoice().counterpart.vatNumber)) {
                    let desc = value.invoiceLines[0].itemDescr;
                    $("#deltio_ap_selection").append(`<option value="${key}">${desc}</option>`);
                }
            }
        }, 100);

        document.getElementById("myform").getElementsByClassName("input-group-sm")[0].appendChild(da_create_button);
        document.getElementById("myform").getElementsByClassName("input-group-sm")[0].appendChild(da_selection);
    }

    function createDeltioAp() {
        let inv = getInvoice();
        let [aa, key] = __createDeltioAp(inv);
        __printDeltioAp(inv, aa, key);
        __sendDeltioAp(inv, aa, key);
        return aa;
    }

    function restoreDeltioAp(code) {
        let inv = __getDeltia()[code];
        __setInvoice(inv);
    }

    function deleteDeltioAp(code) {
        let das = __getDeltia();
        delete das[code];
        localStorage.setItem("deltia-apostolis", JSON.stringify(das));
    }

    function __sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function __getIncAa() {
        let aa = parseInt(localStorage.getItem("deltio-apos-aa") || "-1");
        aa++;
        localStorage.setItem("deltio-apos-aa", aa);
        return aa;
    }

    function __getDeltia() {
        let str = localStorage.getItem("deltia-apostolis");
        if (!str) {
            localStorage.setItem("deltia-apostolis", "{}");
            return {};
        }
        return JSON.parse(str);
    }

    function __createDeltioAp(inv) {
        let aa = __getIncAa();
        let key = `${inv.counterpart.vatNumber}_${aa}`;

        let das = __getDeltia();
        das[key] = inv;
        localStorage.setItem("deltia-apostolis", JSON.stringify(das));
        return [aa, key];
    }

    function __createBarcode(text) {
        var canvas = document.createElement("canvas");
        JsBarcode(canvas, text);
        return canvas.toDataURL("image/png");
    }

    function __printDeltioAp(inv, aa, code) {
        $.ajax({
            type: "POST",
            url: "/timologio/Invoice/PrintPreviewInvoice2Pdf",
            data: { inv: inv },
            success: function (res, status) {
                delete res.mark;
                res.invoice.mark = code;
                res.invoiceTitle = "Δελτίο Αποστολής";
                res.invoice.invoiceHeader.aa = aa;
                res.base64QR = __createBarcode(code);
                renderPrintDoc(res, false);
            }
        });
    }

    function __sendDeltioAp(inv, aa, code) {
        let url = localStorage.getItem("deltio-apostolis-remote-url");
        if (url) {
            GM_xmlhttpRequest({
                method: "POST",
                url: url,
                data: JSON.stringify({inv: inv, aa: aa, code: code}),
                headers: { "Content-Type": "application/json" }
            });
        }
    }

    async function __setInvoice(data) {
        $('#_invoiceType').val(data._invoiceType).change();
        while (true) {
            if (invoice_validationDoc != null) break;
            await __sleep(100);
        }
        $('#correlatedInvoice').val(data.CorrelatedInvoice);
        $('#selfPricing').prop("checked", data.selfPricing);
        $('#paymentType').val(data.paymentType);

        $('#series').append(`<option value="${data.invoiceHeader.series}" selected>${data.invoiceHeader.series}</option>`)
        $('#aa').val(data.invoiceHeader.aa);
        $('#IssueDate').val(data.invoiceHeader.issueDate);
        $('#DispatchDate').val(data.invoiceHeader.dispatchDate);
        $('#DispatchTime').val(data.DispatchTime);
        $('#vehiclenumber').val(data.invoiceHeader.vehicleNumber);
        $('#movePurpose').val(data.invoiceHeader.movePurpose);
        $('#vatPaymentSuspension').prop("checked", data.invoiceHeader.vatPaymentSuspension);
        $('#currency').val(data.invoiceHeader.currency);
        $('#exchangeRate').val(data.invoiceHeader.exchangeRate);

        $('#issuerbranch').val(data.issuer.branch);

        $('#invCounterpart').val(data.counterpart.vatNumber);
        $('#counterpartBranch').val(data.counterpart.branch);
        $('#country').val(data.counterpart.country);
        $('#counterpartData').val(data.counterpart.name);
        $('#counterpartAddress').val(data.counterpart.address.street);
        $('#counterpartTK').val(data.counterpart.address.postalCode);
        $('#counterpartCity').val(data.counterpart.address.city);

        $('#invoiceNotes').val(data.invoiceNotes);
        for (let i = 0; i < data.invoiceLines.length; i++) {
            let itm = data.invoiceLines[i];

            $("#itemLine").val(itm.itemCode).change();
            getItemDefaultValues(invoiceFormat, _companyVat);

            while (true) {
                if (getClassificationsLines() != '[]') break;
                await __sleep(100);
            }
            if (itm.measurementUnit) $("#unit").val(itm.measurementUnit);
            if (itm.quantity) $("#itemQuantity").val(itm.quantity);
            if (itm.vatExemptionCategory) $("#vatExemptionCategory").val(itm.vatExemptionCategory);
            $("#unitPrice").val(itm.unitPrice);
            $("#vatPercentage").val(itm.vatCategory);
            $("#discount").val(itm.discountValue);
            refreshInvoiceLineValues(null, "frmModalInvoiceLine");

            addNewInvoiceLine("btnNewInvoiceLine", "frmModalInvoiceLine", "tblInvoiceLines");
        }
        calcSummaryValues('tblTaxes', 'tblInvoiceLines', 'b_summary');
    }

})();
