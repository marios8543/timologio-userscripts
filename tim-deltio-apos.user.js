// ==UserScript==
// @name         Timologio deltio apostolis
// @namespace    marios8543-timologio-userscripts
// @version      0.1
// @description  Επιτρέπει την έκδοση ανεπίσημων δελτίων αποστολής
// @author       marios8543
// @match        https://mydata.aade.gr/timologio/customer/NewCustomer
// @grant        none
// ==/UserScript==

(function () {

    function __addProdLine(data) {
        
    }

    function __setInvoice(data) {
        $('#_invoiceType').val(data._invoiceType).change();
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
            $("#itemLine").val(itm.itemCode);
            getItemDefaultValues(invoiceFormat, _companyVat);
            
            setTimeout(function() {
                if (itm.measurementUnit) $("#unit").val(itm.measurementUnit);
                if (itm.quantity) $("#itemQuantity").val(itm.quantity);
                if (itm.vatExemptionCategory) $("#vatExemptionCategory").val(itm.vatExemptionCategory);
                $("#unitPrice").val(itm.unitPrice);
                $("#vatPercentage").val(itm.vatCategory);
                $("#discount").val(itm.discountValue);
                addNewInvoiceLine("btnNewInvoiceLine", "frmModalInvoiceLine", "tblInvoiceLines");
            }, 1000);
        }
    }

})();