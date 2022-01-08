// ==UserScript==
// @name         Timologio credential store
// @namespace    marios-8543-timologio-userscripts
// @version      0.1
// @description  Αποθήκευση στοιχείων εισόδου
// @author       marios8543
// @match        https://mydata.aade.gr/timologio/Account/Login
// @match        https://mydata.aade.gr/timologio/Account/login
// @grant        none
// ==/UserScript==

(function () {
    var storedCredsFlag = false;

    for (const key of ["UserName", "VatNumber", "SubscriptionKey"]) {
        if (localStorage.getItem(key)) {
            document.getElementById(key).value = localStorage.getItem(key);
            storedCredsFlag = true;
        }
    }

    let form = document.querySelector("form");
    form.onsubmit = function __submit (e) {
        if (e) e.preventDefault();
        if (!storedCredsFlag) {
            fetch("https://mydata.aade.gr/timologio/Account/Login", {
                method: 'POST',
                body: new FormData(form)
            }).then(function (response) {
                if (response.redirected) {
                    if (confirm("Θέλετε να αποθηκευτούν τα στοιχεία εισόδου;")) {
                        localStorage.setItem("UserName", document.getElementById("UserName").value);
                        localStorage.setItem("VatNumber", document.getElementById("VatNumber").value);
                        localStorage.setItem("SubscriptionKey", document.getElementById("SubscriptionKey").value);
                    }
                    window.location = "https://mydata.aade.gr/timologio";
                }
                else {
                    alert("Λάθος στοιχεία εισόδου");
                }
            });
        }
        else {
            for (const key of ["UserName", "VatNumber", "SubscriptionKey"]) {
                if (document.getElementById(key).value != localStorage.getItem(key)) {
                    storedCredsFlag = false;
                    __submit();
                    return;
                }
            }
            form.submit();
        }
    }
})();
