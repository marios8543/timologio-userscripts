$('#tblInvoiceLines tr:last').after(`
<tr>
    <td>${itm.lineNumber}</td>
    <td>${itm.itemDescr}</td>
    <td>${itm.quantity}</td>
    <td>${itm.measurementUnit}</td>
    <td>${itm.unitPrice}</td>
    <td>${itm.vatCategory}</td>
    <td>${itm.netValueWithoutDiscount}</td>
    <td>${itm.discountValue}</td>
    <td>${itm.netValueWithDiscount}</td>
    <td>${itm.vatAmount}</td>
    <td>${itm.totalValue}</td>
    <td hidden="" data-bound-id=""></td>
    <td hidden="" data-bound-id=""></td>
    <td hidden=""></td>
    <td hidden=""></td>
    <td hidden=""></td>
    <td hidden=""></td>
    <td hidden=""></td>
    <td hidden="" data-bound-id="0"></td>
    <td hidden="" data-bound-id="0"></td>
    <td hidden="" data-bound-id=""></td>
    <td hidden="">0</td>
    <td hidden="" data-bound-id=""></td>
    <td hidden="">0</td>
    <td hidden="" data-bound-id=""></td>
    <td hidden="">0</td>
    <td hidden="" data-bound-id=""></td>
    <td hidden="">0</td>
    <td hidden="">0</td>
    <td hidden="">${itm.discountAmount}</td>
    <td hidden="">${itm.discountType}</td>
    <td hidden="" data-classifications='${JSON.stringify(itm.classifications)}'></td>
    <td><button type="button" class="btn btn-info btn-group-sm btn-sm" title="Επεξεργασία" data-dlg="addInvoiceLineModal" data-tbl="tblInvoiceLines" onclick="editInvoiceLine(this)"> <span class="btn-label"><svg class="svg-inline--fa fa-pen fa-w-16" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="pen" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M290.74 93.24l128.02 128.02-277.99 277.99-114.14 12.6C11.35 513.54-1.56 500.62.14 485.34l12.7-114.22 277.9-277.88zm207.2-19.06l-60.11-60.11c-18.75-18.75-49.16-18.75-67.91 0l-56.55 56.55 128.02 128.02 56.55-56.55c18.75-18.76 18.75-49.16 0-67.91z"></path></svg><!-- <i class="fa fa-pen"></i> --></span></button> </td>
    <td><button type="button" class="btn btn-danger btn-group-sm btn-sm" title="Διαγραφή" onclick="deleteInvoiceLine(this)"><span class="btn-label"><svg class="svg-inline--fa fa-times-circle fa-w-16" aria-hidden="true" focusable="false" data-prefix="fa" data-icon="times-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm121.6 313.1c4.7 4.7 4.7 12.3 0 17L338 377.6c-4.7 4.7-12.3 4.7-17 0L256 312l-65.1 65.6c-4.7 4.7-12.3 4.7-17 0L134.4 338c-4.7-4.7-4.7-12.3 0-17l65.6-65-65.6-65.1c-4.7-4.7-4.7-12.3 0-17l39.6-39.6c4.7-4.7 12.3-4.7 17 0l65 65.7 65.1-65.6c4.7-4.7 12.3-4.7 17 0l39.6 39.6c4.7 4.7 4.7 12.3 0 17L312 256l65.6 65.1z"></path></svg><!-- <i class="fa fa-times-circle"></i> --></span></button></td>
</tr>
`);