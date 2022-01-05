// ==UserScript==
// @name         Timologio description enchancement
// @namespace    marios8543-timologio-userscripts
// @version      0.1
// @description  Ορισμός περιγραφής προιόντος απευθείας στο τιμολόγιο / Παράκαμψη λίστας αγαθών.
// @author       marios8543
// @match        https://mydata.aade.gr/timologio/invoice/NewInvoiceByCustomerList*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';
    let PRODUCT_ID = `${Math.floor(Math.random() * 100)}`;
    const PROION_ID = 137883;
    const YPHRESIA_ID = 137940;

    function __isParoxhYp() {
        let invoice = getInvoice();
        return invoice._invoiceType == '20';
    }

    function __deleteProduct(productCode, callback) {
        $.ajax({
            type: "POST",
            url: _g_Application_Url + '/Product/Delete',
            data: {
                PrdCode: productCode
            },
            success: function (res, status) {
                console.log(`Deleted product ${productCode}`);
                callback();
            },
            error: function (error) {
                console.log(error);
                callback();
            }
        });
    }

    function __saveProduct(description, is_yphresia, callback) {
        $.ajax({
            type: "POST",
            url: '/timologio/Product/create',
            data: {
                prd: {
                    afm: null,
                    productType: is_yphresia ? 2 : 1,
                    productCategory: is_yphresia ? YPHRESIA_ID : PROION_ID,
                    productCode: PRODUCT_ID,
                    productDescription: description,
                    unitPrice: "0",
                    vatCategory: "1",
                    unit: "",
                    specialType: "",
                    feesWithVAT: "",
                    otherTaxesWithVAT: "",
                    productClassifications: [
                        {
                            classificationCategoryCode: `category1_${is_yphresia ? 3 : 2}`,
                            classificationTypeCode: "E3_561_001",
                            _invoiceType: is_yphresia ? 20 : 1
                        }
                    ]
                }
            },
            success: function (res, status) {
                if (res != null && res.success == true) {
                    console.log(`Created product ${description}`);
                    localStorage.setItem("last_prd_id", PRODUCT_ID);
                    callback();
                }
            },
            error: function (response, error, status) { console.log(response); }
        });
    }

    function __main() {
        let description = document.getElementById("c_product_description").value;
        let last_prd_id = localStorage.getItem("last_prd_id") || "";
        __deleteProduct(last_prd_id, function () {
            __saveProduct(description, __isParoxhYp(), function () {
                let option = document.createElement("option");
                option.setAttribute("value", PRODUCT_ID);
                option.setAttribute("selected", "");
                option.innerHTML = description;
                document.getElementById("itemLine").appendChild(option);
                getItemDefaultValues(invoiceFormat, _companyVat);
            });
        });
    }

    let desc_input = document.createElement("input");
    desc_input.setAttribute("placeholder", "Περιγραφή");
    desc_input.setAttribute("style", "width: 95%;");
    desc_input.setAttribute("id", "c_product_description");

    let desc_ok = document.createElement("button");
    desc_ok.innerHTML = "OK";

    let new_div = document.createElement("div");
    new_div.appendChild(desc_input);
    new_div.appendChild(desc_ok);

    let fake_input = document.createElement("input")
    fake_input.setAttribute("id", "itemLine");
    fake_input.setAttribute("style", "display:none;");

    desc_ok.onclick = function (e) {
        e.preventDefault();
        __main();
    }

    let t = setInterval(function () {
        try {
            document.getElementById("modalInvoiceRow1").getElementsByClassName("select2 select2-container select2-container--default")[0].replaceWith(new_div);
            clearInterval(t);
        } catch (error) { }
    }, 100);
})();
