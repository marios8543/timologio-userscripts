// ==UserScript==
// @name         Timologio customer mass add
// @namespace    marios8543-timologio-userscripts
// @version      0.1
// @description  Προσθέτει μαζικά στο πελατολόγιο απο λίστα ΑΦΜ
// @author       marios8543
// @match        https://mydata.aade.gr/timologio/customer/NewCustomer
// @grant        none
// ==/UserScript==

(function () {
    var _companyVat = document.getElementsByClassName("nav-link")[0].innerText.split("ΑΦΜ : ")[1].split(")")[0].trim();

    function __add_field_prompt() {
        let div = document.createElement("div");
        div.appendChild(document.createElement("br"));

        let field = document.createElement("textarea");
        field.setAttribute("id", "mass_add_area");
        div.appendChild(field);
        div.appendChild(document.createElement("br"))

        let add_button = document.createElement("button");
        add_button.setAttribute("class", "btn btn-dark font-weight-bold rounded");
        add_button.innerHTML = "Υποβολή";
        div.appendChild(add_button);
        div.appendChild(document.createElement("br"));
        add_button.onclick = function (ev) {
            ev.preventDefault();
            __mass_add();
        }

        document.getElementById("myform").getElementsByClassName("input-group-sm")[0].appendChild(div);
    }

    function __mass_add() {
        let json_string = document.getElementById("mass_add_area").value;
        let data = JSON.parse(json_string);
        for (let i = 0; i < data.length; i++) {
            let afm = data[i].split(" ")[0];
            let tel = data[i].split(" ")[1];

            console.log(`afm ${afm}   tel ${tel}`);
            __add_customer(afm, tel);
        }
    }

    function __add_customer(afm, tel) {
        $.ajax({
            url: '/timologio/Customer/GetCustomerByTaxis',
            type: "GET",
            dataType: "JSON",
            data: {
                companyVat: _companyVat,
                customerVat: afm
            },
            success: function (data) {
                if (data.errorDescr != "") {
                    let msg = data.errorDescr;
                    alert(afm +msg);
                }
                else {
                    __send_add_request({
                        CustomerVat: afm,
                        CustomerName: data.n,
                        CustomerAddress: data.a,
                        CustomerCity: data.ct,
                        CustomerZipCode: data.z,
                        Doy: data.do,
                        CustomerPhone1: tel
                    });
                }
            },
            error: function (error) { }
        });
    }

    function __send_add_request(obj) {
        console.log(_companyVat);
        let rq = {
            CompanyVAT: _companyVat,
            CustomerType: '2',
            Country: 'GR',
        }
        Object.assign(rq, obj);
        console.log(rq);
        $.ajax({
            method: "POST",
            url: "https://mydata.aade.gr/timologio/customer/NewCustomer",
            data: rq
        });
    }

    let button = document.createElement("button");
    button.setAttribute("class", "btn btn-dark font-weight-bold rounded");
    button.innerHTML = "Μαζική προσθήκη";
    button.onclick = function (ev) {
        ev.preventDefault();
        __add_field_prompt();
    }
    document.getElementById("myform").getElementsByClassName("input-group-sm")[0].appendChild(button);
})();