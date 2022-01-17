// ==UserScript==
// @name         Timologio persistent notes
// @namespace    marios8543-timologio-userscripts
// @version      0.1
// @description  Συμπληρώνει αυτόματα ενα μήνυμα στα σχόλια/παρατηρήσεις
// @author       marios8543
// @match        https://mydata.aade.gr/timologio/invoice/*
// @match        https://mydata.aade.gr/timologio/company/*
// @grant        none
// ==/UserScript==

(function () {
    if (window.location.href.startsWith("https://mydata.aade.gr/timologio/company")) {
        let settingsList = document.getElementById("container-fluid-text").
        getElementsByTagName("form")[0].getElementsByClassName("card-body disabled border")[0];

        $(settingsList).append(`
            <div class="row">
                <div class="col-12 mb-3 input-group-sm">
                    <label class="col-form-label-sm mb-0 pb-0 captionLabels" for="_persistentNote">
                        Σχόλια/παρατηρήσεις τιμολογίων:
                    </label>
                    <textarea class="form-control" id="persistentNote" type="text">${localStorage.getItem("persistent-note")}
                    </textarea>
                </div>
            </div>
        `);

        document.getElementById("container-fluid-text").getElementsByTagName("form")[0].onsubmit = function(e) {
            e.preventDefault();
            localStorage.setItem("persistent-note", document.getElementById("persistentNote").value);
            e.target.submit();
        }
    }
    else {
        setTimeout(function() {
          document.getElementById("invoiceNotes").value = localStorage.getItem("persistent-note");
        }, 500);
    }
})();
