/* ΤΡΟΠΟΠΟΙΗΜΕΝΗ ΕΚΔΟΣΗ ΤΟΥ invoice2pdf.js ΜΕ ΥΠΟΣΤΗΡΙΞΗ ΓΙΑ QRCODE/BARCODE */

var data2print = {};

var coloredPrint = true;

var _g_h_lastTableY = 0;
var _g_h_RptFooter = 0;
var _g_LastPrintedRow = 0;
var _g_TotalBodyHeightPrintedPerPage = 0;
var _g_h_Printed_TblItems = 0;

function renderPrintDoc(data2print, preview) {
	console.log("Running modified renderPrintDoc v2. tel&email support");

	if (data2print == null || data2print === null || data2print == 'null' || data2print == undefined || data2print == 'undefined') {
		return;
	}

	var pdf = new jsPDF({
		filters: ["ASCIIHexEncode"],
		compress: true
	});

	pdf.addFileToVFS("OpenSans-Regular.ttf", font);
	pdf.addFont("OpenSans-Regular.ttf", "OpenSans-Regular", "normal");
	pdf.addFileToVFS("OpenSans-Bold.ttf", fontBold);
	pdf.addFont("OpenSans-Bold.ttf", "OpenSans-Bold", "bold");

	pdf.setFont("OpenSans-Regular");
	pdf.setFontSize(10);

	pdf.addPage();
	header(pdf, data2print, preview);
	pdf.setPage(1);
	pdf.deletePage(2);

	var cols5 = [{ first: 'Κωδ.', second: 'Περιγραφή', third: 'Ποσότητα', fourth: 'M.M', fifth: 'Τιμή(€)', sixth: 'Έκπτωση (€)', seventh: 'Αξία (€)', eighth: 'ΦΠΑ %', nineth: 'ΦΠΑ (€)', tenth: 'Τελ. Αξία (€)' }];
	var rows5 = [];
	var lastInvoiceLine;
	data2print.invoice.invoiceLines.forEach(function (item, index) {
		if (index === data2print.invoice.invoiceLines.length - 1) {
			lastInvoiceLine = item;
		}
		else {
			rows5.push({
				first: item.itemCode,
				second: item.itemDescr,
				third: item.quantity,
				fourth: item.measurementUnitDescr,
				fifth: new Number(parseFloat(item.itemUnitPrice).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }),
				sixth: new Number(parseFloat(item.discountAmount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }),
				seventh: new Number(parseFloat(item.netValue).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }),
				eighth: item.vatCategoryDescription,
				nineth: new Number(parseFloat(item.vatAmount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }),
				tenth: new Number(parseFloat(item.totalValue).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 })
			});
		}
	});

	//Last I add the totals
	var totalDiscount = 0;
	if (data2print.totalDiscountValue != null) {
		totalDiscount = data2print.totalDiscountValue;
	}

	var rowsTaxesTitles = getPaymentAndTaxesTitlesTable(data2print);

	var invNotes = '';
	if (data2print.invoice.invoiceNotes != null) {
		invNotes = data2print.invoice.invoiceNotes;
	}
	var fillColorfootLines = [5, 46, 102];
	var textColorfootLines = 255;

	var fillColorfootLinesData = [229, 237, 247];
	if (coloredPrint === true) {
		fillColorfootLines = [5, 46, 102];
		textColorfootLines = 255;
		fillColorfootLinesData = [255, 255, 255];
	}
	else {
		fillColorfootLines = [200, 209, 221];
		textColorfootLines = [5, 46, 102];
		fillColorfootLinesData = [230, 244, 251];
	}

	var footLines = [
		[
			{ content: lastInvoiceLine.itemCode, colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: lastInvoiceLine.itemDescr, colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: lastInvoiceLine.quantity, colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: lastInvoiceLine.measurementUnitDescr, colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: new Number(parseFloat(lastInvoiceLine.itemUnitPrice).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: new Number(parseFloat(lastInvoiceLine.discountAmount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: new Number(parseFloat(lastInvoiceLine.netValue).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: lastInvoiceLine.vatCategoryDescription, colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: new Number(parseFloat(lastInvoiceLine.vatAmount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: new Number(parseFloat(lastInvoiceLine.totalValue).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', fillColor: 255 } }

		],
		[
			{ content: 'Σύνολα', colSpan: 5, styles: { halign: 'right', fillColor: 255 } },
			{ content: new Number(parseFloat(totalDiscount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: new Number(parseFloat(data2print.invoice.invoiceSummary.totalNetValue).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: '', colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: new Number(parseFloat(data2print.invoice.invoiceSummary.totalVatAmount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', fillColor: 255 } },
			{ content: new Number(parseFloat(data2print.totalValue).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', fillColor: 255 } },

		],
		[
			{ content: '', colSpan: 10, styles: { halign: 'center', fillColor: 255 } },

		],
		[
			{ content: 'Συνολ. Αξία', colSpan: 1, styles: { halign: 'center', textColor: textColorfootLines, fillColor: fillColorfootLines, fontSize: 7 } },
			{ content: '(-) Παρακρατούμενοι', colSpan: 1, styles: { halign: 'center', textColor: textColorfootLines, fillColor: fillColorfootLines, fontSize: 7 } },
			{ content: 'Παρακρατούμενοι (πλφ) ', colSpan: 1, styles: { halign: 'center', textColor: textColorfootLines, fillColor: fillColorfootLines, fontSize: 7 } },
			{ content: '(-) Κρατήσεις', colSpan: 2, styles: { halign: 'center', textColor: textColorfootLines, fillColor: fillColorfootLines, fontSize: 7 } },
			{ content: 'Κρατήσεις (πλφ)', colSpan: 1, styles: { halign: 'center', textColor: textColorfootLines, fillColor: fillColorfootLines, fontSize: 7 } },
			{ content: '(+) Χαρτόσημο', colSpan: 1, styles: { halign: 'center', textColor: textColorfootLines, fillColor: fillColorfootLines, fontSize: 7 } },
			{ content: '(+) Τέλη', colSpan: 1, styles: { halign: 'center', textColor: textColorfootLines, fillColor: fillColorfootLines, fontSize: 7 } },
			{ content: '(+) Λοιποί Φόροι', colSpan: 2, styles: { halign: 'center', textColor: textColorfootLines, fillColor: fillColorfootLines, fontSize: 7 } },

		],
		[
			{ content: '', colSpan: 10, styles: { halign: 'center', fillColor: 255 } },

		],
		[
			//{ content: parseFloat(data2print.totalValue).toFixed(2), colSpan: 1, styles: { halign: 'center', lineWidth: 0.1, textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			{ content: new Number(parseFloat(data2print.totalValue).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			//{ content: parseFloat(data2print.invoice.totalWithHeldDecreasePaid).toFixed(2), colSpan: 1, styles: { halign: 'center', lineWidth: 0.1, textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			{ content: new Number(parseFloat(data2print.invoice.totalWithHeldDecreasePaid).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			//{ content: parseFloat(data2print.invoice.totalWithHeldInfo).toFixed(2), colSpan: 1, styles: { halign: 'center', lineWidth: 0.1, textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			{ content: new Number(parseFloat(data2print.invoice.totalWithHeldInfo).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			//{ content: parseFloat(data2print.invoice.totalDeductionsDecreasePaid).toFixed(2), colSpan: 2, styles: { halign: 'center', lineWidth: 0.1, textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			{ content: new Number(parseFloat(data2print.invoice.totalDeductionsDecreasePaid).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 2, styles: { halign: 'center', textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			//{ content: parseFloat(data2print.invoice.totalDeductionsInfo).toFixed(2), colSpan: 1, styles: { halign: 'center', lineWidth: 0.1, textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			{ content: new Number(parseFloat(data2print.invoice.totalDeductionsInfo).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			//{ content: parseFloat(data2print.invoice.invoiceSummary.totalStampDutyAmount).toFixed(2), colSpan: 1, styles: { halign: 'center', lineWidth: 0.1, textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			{ content: new Number(parseFloat(data2print.invoice.invoiceSummary.totalStampDutyAmount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			//{ content: parseFloat(data2print.invoice.invoiceSummary.totalFeesAmount).toFixed(2), colSpan: 1, styles: { halign: 'center', lineWidth: 0.1, textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			{ content: new Number(parseFloat(data2print.invoice.invoiceSummary.totalFeesAmount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 1, styles: { halign: 'center', textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			//{ content: parseFloat(data2print.invoice.invoiceSummary.totalOtherTaxesAmount).toFixed(2), colSpan: 2, styles: { halign: 'center', lineWidth: 0.1, textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },
			{ content: new Number(parseFloat(data2print.invoice.invoiceSummary.totalOtherTaxesAmount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 2, styles: { halign: 'center', textColor: 0, fillColor: fillColorfootLinesData, fontSize: 7 } },

		],
		[
			{ content: '', colSpan: 10, styles: { halign: 'center', fillColor: 255 } },

		],
		[
			//{ content: 'Πληρωτέο (€) : ' + parseFloat(data2print.invoice.invoiceSummary.totalGrossValue).toFixed(2), colSpan: 10, styles: { halign: 'right', lineWidth: 0.1, textColor: 0, fillColor: [243, 191, 204], font: 'OpenSans-Bold', fontSize: 14 } }
			{ content: 'Πληρωτέο (€) : ' + new Number(parseFloat(data2print.invoice.invoiceSummary.totalGrossValue).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }), colSpan: 10, styles: { halign: 'right', textColor: [5, 46, 102], fillColor: '#dcf0ff', font: 'OpenSans-Bold', fontSize: 13 } }
		],
		[
			{ content: '', colSpan: 10, styles: { halign: 'center', fillColor: 255 } },

		],
		[
			//{ content: 'Παρατηρήσεις:', colSpan: 2, styles: { halign: 'center', fillColor: [235, 236, 240], textColor: 0, font: 'OpenSans-Bold'} },
			//{ content: invNotes, colSpan: 8, styles: { halign: 'left', fillColor: [235, 236, 240], textColor: 0, font: 'OpenSans-Regular'} }
			{ content: 'Παρατηρήσεις: ' + invNotes, colSpan: 10, styles: { halign: 'left', fillColor: 255, textColor: [5, 46, 102], font: 'OpenSans-Regular', fontSize: 7 } },
			//{ content: invNotes, colSpan: 8, styles: { halign: 'left', fillColor: [235, 236, 240], textColor: 0, font: 'OpenSans-Regular' } }
		],
		[
			{ content: '', colSpan: 10, styles: { halign: 'center', fillColor: 255 } },

		],
		rowsTaxesTitles,
		addDummyRowInPaymentAndTaxesTable(data2print)
	];

	footLines = getPaymentAndTaxesTableData(data2print, footLines);
	//printTaxLines(footLines, rowsTaxesTest);

	var fillColorItemsHead = [5, 46, 102];
	var textColorItemsHead = 255;
	var fillColorItemsLines = [229, 237, 247];
	var textColorItemsLines = [110, 112, 113];
	if (coloredPrint === true) {
		fillColorItemsHead = [5, 46, 102]
		textColorItemsHead = 255;
		fillColorItemsLines = [229, 237, 247];
		textColorItemsLines = [110, 112, 113];
	}
	else {
		fillColorItemsHead = [200, 209, 221];
		textColorItemsHead = [5, 46, 102];
		fillColorItemsLines = [230, 244, 251];
		textColorItemsLines = [110, 112, 113];
	}

	pdf.autoTable({
		head: cols5,
		body: rows5,
		foot: footLines,
		//startY: pdf.lastAutoTable.finalY,
		//startY: _g_h_lastTableY + 5,
		showFoot: 'lastPage',
		theme: 'plain',
		didDrawPage: function (data) {
			_g_TotalBodyHeightPrintedPerPage = 0;
			header(pdf, data2print, preview);
		},
		didParseCell(data) {
			//if (data.row.section === 'body' && data.row.index === rows5.length - 1)
			//{
			//	data.cell.styles.fillColor = '#dcf0ff';
			//	if (data.column.index === 0)
			//	{
			//		data.cell.colSpan = 5;
			//		data.cell.styles.halign = 'right';					
			//             }				
			//}

			if (data.row.section === 'foot' && data.row.index === 1) {
				data.cell.styles.fillColor = '#dcf0ff';
				if (data.column.index === 0) {
					data.cell.colSpan = 5;
					data.cell.styles.halign = 'right';
				}
			}
		},
		willDrawCell: function (data) {
			//if (data.row.section === 'body' && data.row.index === rows5.length - 1)
			//{
			//	pdf.setFontSize(9);
			//	pdf.setTextColor(5, 46, 102); // Blue
			//	pdf.setFillColor('#dcf0ff');
			//	if (data.column.index === 0) {
			//		data.cell.styles.halign = 'right';
			//	}
			//	else
			//	{
			//		data.cell.styles.halign = 'center';
			//             }				
			//}
			if (data.row.section === 'foot' && data.row.index === 1) {
				pdf.setFontSize(9);
				pdf.setTextColor(5, 46, 102); // Blue
				pdf.setFillColor('#dcf0ff');
				if (data.column.index === 0) {
					data.cell.styles.halign = 'right';
				}
				else {
					data.cell.styles.halign = 'center';
				}
			}
		},
		didDrawCell: function (data) {
			//if (data.cell.text != null && data.cell.text != 'undefined' && data.cell.text != '') {
			//	pdf.setDrawColor(5, 46, 102); // Blue
			//	pdf.roundedRect(data.cell.x, data.cell.y+0.4, data.cell.width - 0.4, data.cell.height - 0.5, 1, 1, 'S');
			//}
			if (data.row.section === 'head' && data.column.index === 0) {
				pdf.setDrawColor(5, 46, 102); // Blue
				pdf.setLineWidth(0.4);
				pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.2, 190.5, data.row.height + 0.2, 1, 1, 'S');
			}
			if (data.row.section === 'body') {
				pdf.setDrawColor(5, 46, 102); // Blue
				if (data.column.index === 9) {
					pdf.roundedRect(data.cell.x, data.cell.y + 0.4, data.cell.width - 0.1, data.cell.height - 0.5, 1, 1, 'S');
				}
				else {
					pdf.roundedRect(data.cell.x, data.cell.y + 0.4, data.cell.width - 0.4, data.cell.height - 0.5, 1, 1, 'S');
				}
				//if (data.row.index === rows5.length - 1)
				//{
				//	pdf.setLineWidth(0.2);
				//	//pdf.setDrawColor('#dcf0ff');
				//	pdf.roundedRect(data.cell.x - 0.2, data.cell.y + 0.2, data.cell.width + 0.1, data.cell.height - 0.3, 1, 1, 'S');				
				//}
				//else
				//{
				//	pdf.setDrawColor(5, 46, 102); // Blue
				//	if (data.column.index === 9) {
				//		pdf.roundedRect(data.cell.x, data.cell.y + 0.4, data.cell.width - 0.1, data.cell.height - 0.5, 1, 1, 'S');
				//	}
				//	else {
				//		pdf.roundedRect(data.cell.x, data.cell.y + 0.4, data.cell.width - 0.4, data.cell.height - 0.5, 1, 1, 'S');
				//	}					
				//}				
			}
			if (data.row.section === 'foot') {
				if (data.row.index === 0) //last line of items - first of footlines
				{
					pdf.setDrawColor(5, 46, 102); // Blue
					if (data.column.index === 9) {
						pdf.roundedRect(data.cell.x, data.cell.y + 0.4, data.cell.width - 0.1, data.cell.height - 0.5, 1, 1, 'S');
					}
					else {
						pdf.roundedRect(data.cell.x, data.cell.y + 0.4, data.cell.width - 0.4, data.cell.height - 0.5, 1, 1, 'S');
					}
				}

				if (data.row.index === 1) //line of SubTotals
				{
					pdf.setLineWidth(0.2);
					//pdf.setDrawColor('#dcf0ff');
					pdf.roundedRect(data.cell.x - 0.2, data.cell.y + 0.2, data.cell.width + 0.1, data.cell.height - 0.3, 1, 1, 'S');
				}

				if (data.cell.text != null && data.cell.text != 'undefined' && data.cell.text != '') {
					if (data.row.index === 3) //totals of taxes...(titles)
					{
						pdf.setDrawColor(5, 46, 102);
						//pdf.setDrawColor(0);
						pdf.setLineWidth(0.4);
						pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.2, data.cell.width + 0.3, data.cell.height + 0.3, 1, 1, 'S');
					}

					if (data.row.index === 11) //row of heads (payment and tax analysis tablw)
					{
						pdf.setDrawColor(0, 145, 212);
						//pdf.setDrawColor(0);
						pdf.setLineWidth(0.4);
						pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.2, data.cell.width + 0.2, data.cell.height + 0.1, 1, 1, 'S');
					}

					if (data.row.index >= 13) //row data of payment and analysis taxis table
					{
						//pdf.setDrawColor(0, 145, 212);
						//pdf.setDrawColor(0);
						if (data.column.index === 0) {
							pdf.setLineWidth(0.2);
							pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.2, data.cell.width + 0.2, data.cell.height + 0.1, 1, 1, 'S');
						}
						else if (data.column.index == 3) {
							pdf.setLineWidth(0.2);
							pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.2, data.cell.width - 0.3, data.cell.height, 1, 1, 'S');
						}
						else {
							pdf.setLineWidth(0.2);
							pdf.roundedRect(data.cell.x + 0.1, data.cell.y - 0.2, data.cell.width + 0.3, data.cell.height, 1, 1, 'S');
						}
					}
				}
				if (data.cell.colSpan === 10 && data.cell.text[0] === '') {
					if (data.row.index == 4) //dummy space row between taxtable headrow and body rows
					{
						data.row.height = 0.5;
					}
					else if (data.row.index == 6)//dummy space row between taxtable body and grandtotal row
					{
						data.row.height = 1;
					}
					else {
						data.row.height = 3;
					}
				}
				if (data.cell.colSpan != 10) {
					if (isDummyFootRow(data.table.foot[data.row.index])) {
						data.row.height = 1;
					}
				}

				if (data.row.index === 5) //totals of taxes...(data)
				{
					pdf.setDrawColor(5, 46, 102); // Blue
					pdf.setLineWidth(0.2);
					if (data.column.index == 8) {
						pdf.roundedRect(data.cell.x, data.cell.y - 0.2, data.cell.width, data.cell.height, 1, 1, 'S');
					}
					else {
						pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.2, data.cell.width - 0.4, data.cell.height, 1, 1, 'S');
					}
				}

				if (data.row.index === 7) //Grand Total
				{
					pdf.setDrawColor('#dcf0ff');
					//pdf.setDrawColor(0);
					pdf.setLineWidth(0.3);
					pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.1, data.cell.width + 0.3, data.cell.height + 0.4, 1, 1, 'S');
				}

				if (data.row.index === 9) //Notes
				{
					//pdf.setDrawColor('#dcf0ff');
					//pdf.setDrawColor(0);
					pdf.setLineWidth(0.1);
					pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.1, data.cell.width + 0.3, data.cell.height - 0.1, 1, 1, 'S');
				}
			}
		},
		styles: {
			fontSize: 8,
			font: 'OpenSans-Regular',
			//fillColor: fillColorItemsLines,
			textColor: textColorItemsLines,
			halign: 'center'
			//lineWidth:0
		},
		columnStyles: {
			fourth: { cellWidth: 15 }
		},
		headStyles: {
			//font: 'OpenSans-Bold',
			textColor: textColorItemsHead,
			//fillColor: [41, 128, 185],			
			fillColor: fillColorItemsHead,
			halign: 'center',
		},
		margin: {
			//top: 135,
			top: _g_h_lastTableY + 5,
			left: 10,
			right: 10,
			bottom: 10
		},
	});

	var finalY = pdf.lastAutoTable.finalY;
	console.error(pdf.lastAutoTable.finalY);
	//if (pdf.lastAutoTable.finalY > 200) {
	//	pdf.addPage();
	//	finalY = header(pdf, data2print, preview);
	//}


	var pageCount = pdf.internal.getNumberOfPages(); //Total Page Number
	for (i = 0; i < pageCount; i++) {
		pdf.setPage(i);
		if (i > 0) {
			//	console.error(i);
			header(pdf, data2print, preview);
		}
		let pageCurrent = pdf.internal.getCurrentPageInfo().pageNumber;
		let str = 'Σελίδα ' + pageCurrent;
		// Total page number plugin only available in jspdf v1.0+
		if (typeof pdf.putTotalPages === 'function') {
			str = str + ' από ' + pdf.internal.getNumberOfPages()
		}
		pdf.setFontSize(8);
		pdf.text(str, (pdf.internal.pageSize.getWidth() / 2) - 10, pdf.internal.pageSize.height - 10);

		pdf.setFontSize(6);
		pdf.setTextColor(80);
		pdf.text('Η ευθύνη για το περιεχόμενο του παραστατικού ανήκει αποκλειστικά στον εκδότη αυτού', (pdf.internal.pageSize.getWidth() / 2) - 41, pdf.internal.pageSize.height - 5);

		pdf.setFontSize(6);
		pdf.setTextColor(80);
		pdf.text('Εκδόθηκε από την εφαρμογή:', 5, pdf.internal.pageSize.height - 13);
		pdf.addImage(base64AADELogo, 'JPEG', 5, pdf.internal.pageSize.height - 11, 40, 5.3);

		if (data2print.base64QR != '' && data2print.base64QR != null && data2print.base64QR != undefined) {
			pdf.addImage(data2print.base64QR, 'JPEG', pdf.internal.pageSize.getWidth() - 50, pdf.internal.pageSize.height - 30, 50, 20, undefined, 'FAST');
		}
	}

	/*
	var elem = document.getElementById("table");
	var res = doc.autoTableHtmlToJson(elem);
	doc.autoTable(res.columns, res.data2print,{
		styles: {
			fontSize: 12,
			font: 'OpenSans-Regular'
		},
		columnStyles: {
			fontSize: 12,
			font: 'OpenSans-Regular'
		},
		   headerStyles: {
			fontStyle: 'OpenSans-Regular'
		},
		   margin: { top: 60 }}
		);
	*/

	//var string = pdf.output('datauristring');
	//var embed = "<embed width='100%' height='100%' src='" + string + "'/>"
	//var x = window.open();
	//x.document.open();
	//x.document.write(embed);
	//x.document.close();

	//pdf.output('dataurlnewwindow');
	pdf.save('printinvoice.pdf');
}

function printPreview2pdf(invoice) {
	//$('#waitingModalprint').data('backdrop', 'static');
	//$('#waitingModalprint').modal('show');

	data2print = invoice;

	if (data2print == null || data2print === null || data2print == 'null' || data2print == undefined || data2print == 'undefined') {
		return;
	}

	renderPrintDoc(data2print, true);
}

function print2pdf(mark) {
	//$('#waitingModalprint').data('backdrop', 'static');
	//$('#waitingModalprint').modal('show');
	$.ajax({
		async: false,
		url: _g_Application_Url + '/Invoice/PrintInvoice2Pdf?mark=' + mark,
		success: function (response) {
			data2print = response;
			//console.error(data2print);
		},
		error: function (e) {
			console.error("error");
		}
	});

	if (data2print == null || data2print === null || data2print == 'null' || data2print == undefined || data2print == 'undefined') {
		return;
	}

	renderPrintDoc(data2print);
}

var header = function (pdf, data2print, preview) {

	var lastTableY = 0;

	var maxRowsHeight = 0;
	var cols1 = [{ first: 'first', third: 'second' }];
	//{ first: 'Επάγγελμα', second: data2print.invoice.issuer.JobDescription },
	var issuerAddress = '';
	var issuerJob = '';
	var issuerDoy = '';
	if (data2print.invoice.issuer.address != null) {
		issuerAddress = data2print.invoice.issuer.address.street;
	}
	if (data2print.invoice.issuer != null) {
		issuerJob = data2print.invoice.issuer.jobDescription;
		issuerDoy = data2print.invoice.issuer.doy;
	}
	var rows1 = [
		{ first: 'Επωνυμία', third: data2print.invoice.issuer.name },
		{ first: 'Α.Φ.Μ.', third: data2print.invoice.issuer.vatNumber },
		{ first: 'Επάγγελμα', third: issuerJob },
		{ first: 'Δ.Ο.Υ.', third: issuerDoy },
		{ first: 'Διεύθυνση', third: issuerAddress }
	];

	if (localStorage.getItem("company-phone")) {
		rows1.push({first: 'Τηλέφωνο', third: localStorage.getItem("company-phone")});
	}
	if (localStorage.getItem("company-email")) {
		rows1.push({first: 'E-Mail', third: localStorage.getItem("company-email")});
	}

	var fillColor = 255;//white
	if (coloredPrint === true) {
		fillColor = 230;
	}
	pdf.autoTable({
		head: cols1,
		body: rows1,
		showHead: false,
		willDrawCell: function (data) {
			maxRowsHeight = data.row.height;
		},
		didDrawCell: function (data) {
			if (data.cell.text != null && data.cell.text != 'undefined' && data.cell.text != '') {
				if (data.column.index == 0) {
					pdf.setDrawColor(5, 46, 102); // Blue
					pdf.setFillColor(255, 255, 255); //white
				}
				if (data.column.index == 1) {
					pdf.setDrawColor(5, 46, 102); // Blue
					//pdf.setFillColor('#dcf0ff');
				}
				pdf.roundedRect(data.cell.x, data.cell.y, data.cell.width - 1, maxRowsHeight - 1, 1, 1, 'S');
				//pdf.roundedRect(data.cell.x, data.cell.y, data.cell.width - 1, data.cell.contentHeight - 0.8, 1, 1, 'S');
				//pdf.text(data.cell.getTextPos().x, data.cell.getTextPos().y + data.cell.contentHeight / 2 - data.cell.styles.cellPadding, data.cell.text);
				//pdf.text(data.cell.getTextPos().x, data.cell.getTextPos().y + data.cell.contentHeight / 2 - 2, data.cell.text);
			}
		},
		styles: {
			fontSize: 9,
			font: 'OpenSans-Regular'
		},
		theme: 'plain',
		startY: 10,
		columnStyles: {
			first: {
				//font: 'OpenSans-Bold',
				cellWidth: 30,
				textColor: [5, 46, 102],
				//valign: 'center'
				//fillColor: fillColor
			},
			third: {
				textColor: 80,
				//fillColor: '#dcf0ff'
				//fillColor: fillColor			
			},
			fontSize: 10
		},
		headStyles: {
			fontStyle: 'OpenSans-Regular'
		},
		margin: {
			top: 0,
			//top: pdf.lastAutoTable.finalY + 5,
			right: 75,
		}
	});

	lastTableY = pdf.lastAutoTable.finalY;

	pdf.autoTable({
		didDrawPage: function (d) {
			pdf.setFontSize(20);
			pdf.setTextColor(40);
			//if (base64Img) {
			//	pdf.addImage(base64Img, 'JPEG', 140, 5, 40, 40)
			if (data2print.logoBase64 !== null && data2print.logoBase64 !== '') {
				//pdf.addImage(data2print.logoBase64, 'JPEG', 145, 10, 45, 35)
				pdf.addImage(data2print.logoBase64, 'JPEG', 145, 10, 45, 35, undefined, 'FAST');
			}
		},
		margin: { top: 10 },
	});


	var colsInvoiceTitle = [{ first: 'first' }];
	var rowscInvoiceTitle = [];
	if (preview == true || preview === true || preview == 'true' || preview === 'true') {
		rowscInvoiceTitle = [
			{ first: 'Π ρ ο ε π ι σ κ ό π η σ η ', styles: { halign: 'center', fillColor: [5, 46, 102], textColor: [255, 0, 0], lineWidth: 0, fontSize: 8 } },
			{ first: data2print.invoiceTitle }
		];
	}
	else {
		rowscInvoiceTitle = [
			{ first: data2print.invoiceTitle }
		];
	}
	//var rowscInvoiceTitle = [
	//	{ first: data2print.invoiceTitle }
	//];
	var footInvoiceTitle = [];
	if (data2print.invoice != null && data2print.invoice.correlatedInvoice != null && data2print.invoice.correlatedInvoice != '') {
		footInvoiceTitle = [
			[
				//{ content: 'Συσχετιζόμενο: ' + data2print.invoice.correlatedInvoice, styles: { halign: 'center', fillColor: 230, textColor: [5, 46, 102], lineWidth: 0, fontSize: 8 } },
				{ content: 'Συσχετιζόμενο: ' + data2print.invoice.correlatedInvoice, styles: { halign: 'center', fillColor: [5, 46, 102], textColor: 255, lineWidth: 0, fontSize: 8 } }
			]
		];
	}

	pdf.autoTable({
		head: colsInvoiceTitle,
		body: rowscInvoiceTitle,
		foot: footInvoiceTitle,
		showHead: false,
		theme: 'plain',
		//startY: pdf.lastAutoTable.finalY + 5,
		startY: lastTableY + 5,
		didDrawCell: function (data) {
			if (data.cell.text != null && data.cell.text != 'undefined' && data.cell.text != '') {
				if (data.column.index == 0) {
					pdf.setDrawColor(5, 46, 102); // Blue
					//pdf.setFillColor(255); //white
				}
				pdf.setDrawColor(5, 46, 102); // Blue
				pdf.setLineWidth(0.4);
				pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.2, data.cell.width + 0.4, data.row.height + 0.4, 1, 1, 'S');
				//pdf.roundedRect(data.cell.x, data.cell.y, data.cell.width - 1, data.cell.contentHeight - 0.8, 1, 1, 'S');
				//pdf.text(data.cell.getTextPos().x, data.cell.getTextPos().y + data.cell.contentHeight / 2 - data.cell.styles.cellPadding, data.cell.text);
				//pdf.text(data.cell.getTextPos().x, data.cell.getTextPos().y + data.cell.contentHeight / 2 - 2, data.cell.text);
			}
		},
		didParseCell: function (data) {
			if (preview == true || preview === true || preview == 'true' || preview === 'true') {
				if (data.row.section === 'body' && data.row.index === 0) {
					data.cell.styles.textColor = "red";
					data.cell.styles.fontSize = 14;
				}
			}
		},
		styles: {
			overflow: 'hidden',
			fontSize: 12,
			font: 'OpenSans-Regular',
			halign: 'center',
			//fillColor: 230
			fillColor: [5, 46, 102]// Blue
		},
		columnStyles: {
			first: {
				font: 'OpenSans-Bold',
				textColor: 255
			},
			fontSize: 12,
		},
		margin: { top: 10 }
	});

	var cols2 = [{ 1: '1', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6', 7: '7' }];
	var rows2 = [
		{
			1: 'Σειρά: ' + data2print.invoice.invoiceHeader.series, 2: '', 3: 'Α.Α.: ' + data2print.invoice.invoiceHeader.aa, 4: '', 5: "Ημερομηνία: " + data2print.invoiceIssueDate,
			6: '', 7: 'ΜΑΡΚ: ' + data2print.invoice.mark
		}
	];


	//var rows2 = [
	//	{ first: 'Σειρά: ' + data2print.invoice.invoiceHeader.series, second: 'Α.Α.: ' + data2print.invoice.invoiceHeader.aa, third: "Ημερομηνία: " + data2print.invoiceIssueDate, 
	//		fourth: 'ΜΑΡΚ: ' + data2print.invoice.mark, fourth: 'Συσχετιζόμενο: ' + data2print.invoice.CorrelatedInvoice }
	//];
	pdf.autoTable({
		head: cols2,
		body: rows2,
		showHead: false,
		theme: 'plain',
		didDrawCell: function (data) {
			if (data.cell.text != null && data.cell.text != 'undefined' && data.cell.text != '') {
				pdf.setDrawColor('#dcf0ff');
				pdf.setLineWidth(0.3);
				pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.2, data.cell.width + 0.3, data.row.height + 0.3, 1, 1, 'S');
			}
		},
		startY: pdf.lastAutoTable.finalY + 5,
		styles: {
			overflow: 'hidden',
			fontSize: 9,
			font: 'OpenSans-Regular',
			textColor: 80,
			//fillColor: 230,
		},
		columnStyles: {
			1: {
				cellWidth: 'auto',
				fillColor: '#dcf0ff'
			},
			2: {
				cellWidth: 1
			},
			3: {
				cellWidth: 'auto',
				fillColor: '#dcf0ff'
			},
			4: {
				cellWidth: 1
			},
			5: {
				cellWidth: 'auto',
				fillColor: '#dcf0ff'
			},
			6: {
				cellWidth: 1
			},
			7: {
				cellWidth: 'auto',
				fillColor: '#dcf0ff'
			}
		},
		margin: { top: 10 }
	});

	var finalY = pdf.lastAutoTable.finalY + 8;

	var counterpartVat = '';
	var counterpartName = '';
	var counterpartAddress = '';
	if (data2print.invoice.counterpart != null) {
		counterpartVat = data2print.invoice.counterpart.vatNumber;
		counterpartName = data2print.invoice.counterpart.name;
		if (data2print.invoice.counterpart.address != null) {
			counterpartAddress = data2print.invoice.counterpart.address.street;
		}

	}
	var cols3 = [{ first: 'first', second: 'second' }];
	var rows3 = [
		{ first: 'Α.Φ.Μ.: ', second: counterpartVat },
		{ first: '', second: '' },
		{ first: 'Επωνυμία: ', second: counterpartName },
		{ first: '', second: '' },
		{ first: 'Διεύθυνση: ', second: counterpartAddress },
	];

	var cols4 = [{ first: 'first', second: 'second' }];
	var rows4 = [
		{ first: 'Σκοπός Διακίνησης: ', second: data2print.movePurposeDescription },
		{ first: '', second: '' },
		{ first: 'Αρ. οχήματος: ', second: data2print.invoice.invoiceHeader.vehicleNumber },
		{ first: '', second: '' },
		{ first: 'Ημ. Αποστολής: ', second: data2print.invoiceDispathDate },
		{ first: '', second: '' },
		{ first: 'Ώρα Αποστολής: ', second: data2print.invoice.dispatchTime }
	];

	pdf.setTextColor(5, 46, 102);
	pdf.setFontSize(10);
	pdf.text('Στοιχεία Πελάτη', 15, finalY);
	pdf.autoTable({
		head: cols3,
		body: rows3,
		startY: finalY + 2,
		showHead: false,
		willDrawCell: function (data) {
			maxRows1H = data.row.height;
			if (data.row.index === 1 || data.row.index == 3) {
				pdf.setFillColor(255); //white
			}
		},
		didDrawCell: function (data) {
			if (data.row.index === 1 || data.row.index == 3) {
				data.row.height = 2;
			}
			if (data.cell.text != null && data.cell.text != 'undefined' && data.cell.text != '') {
				if (data.column.index == 0) {
					pdf.setDrawColor(5, 46, 102); // Blue
					pdf.roundedRect(data.cell.x, data.cell.y, data.cell.width - 1, maxRows1H - 0.2, 1, 1, 'S');
				}
				if (data.column.index == 1) {
					pdf.setDrawColor('#dcf0ff'); // light Blue
					//pdf.setDrawColor(0); // light Blue
					pdf.setLineWidth(0.3);
					pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.2, data.cell.width + 0.3, data.row.height + 0.3, 1, 1, 'S');
				}
			}
		},
		theme: 'plain',
		styles: {
			//overflow: 'hidden',
			fontSize: 9,
			font: 'OpenSans-Regular',
		},
		columnStyles: {
			first: {
				//font: 'OpenSans-Bold',
				textColor: [5, 46, 102],
				fillColor: 255
			},
			second: {
				textColor: 80,
				fillColor: '#dcf0ff',
			}
		},
		margin: {
			right: 107
		}
	});

	if (data2print.invoice.invoiceHeader.movePurpose != null || data2print.invoice.DispatchTime != null ||
		data2print.invoiceDispathDate != null || data2print.invoice.vehicleNumber != null) {
		pdf.setTextColor(5, 46, 102);
		pdf.setFontSize(10);
		pdf.text('Στοιχεία Διακίνησης', 108, finalY)
		pdf.autoTable({
			head: cols4,
			body: rows4,
			showHead: false,
			willDrawCell: function (data) {
				maxRows1H = data.row.height;
				if (data.row.index === 1 || data.row.index == 3 || data.row.index == 5) {
					pdf.setFillColor(255); //white
				}
			},
			didDrawCell: function (data) {
				if (data.row.index === 1 || data.row.index == 3 || data.row.index == 5) {
					data.row.height = 2;
				}
				if (data.cell.text != null && data.cell.text != 'undefined' && data.cell.text != '') {
					if (data.column.index == 0) {
						pdf.setDrawColor(5, 46, 102); // Blue
						pdf.roundedRect(data.cell.x, data.cell.y, data.cell.width - 1, maxRows1H - 0.2, 1, 1, 'S');
					}
					if (data.column.index == 1) {
						pdf.setDrawColor('#dcf0ff'); // light Blue
						//pdf.setDrawColor(0); // light Blue
						pdf.setLineWidth(0.3);
						pdf.roundedRect(data.cell.x - 0.2, data.cell.y - 0.2, data.cell.width + 0.3, data.row.height + 0.3, 1, 1, 'S');
					}
				}
			},
			theme: 'plain',
			startY: finalY + 2,
			styles: {
				//overflow: 'hidden',
				fontSize: 9,
				font: 'OpenSans-Regular',
			},
			columnStyles: {
				first: {
					//font: 'OpenSans-Bold',
					textColor: [5, 46, 102],
					fillColor: 255
				},
				second: {
					textColor: 80,
					fillColor: '#dcf0ff',
				}
			},
			margin: {
				left: 107
			},
		});
	}

	_g_h_lastTableY = pdf.lastAutoTable.finalY;
	//alert(_g_h_lastTableY);

	return pdf.lastAutoTable.finalY;
}

function getHigherCell(row) {
	var h = 0;

	for (var i = 0; i < row.cells.length; i++) {
		var cell = row.cells[i];
		if (cell.contentHeight > h) {
			h = cell.contentHeight;
		}
	}

	return h;
}

function getPaymentAndTaxesTitlesTable(data2print) {

	var result = [];

	var fillColorPayment = [0, 145, 212];
	var textColorPayment = [255, 255, 255];

	var fontPayment = 'OpenSans-Regular';

	//if (coloredPrint === true) {
	//	fillColorPayment = [5, 46, 102];
	//	textColorPayment = [255, 255, 255];
	//	fontPayment = 'OpenSans-Bold';
	//}
	//else {
	//	fillColorPayment = [180, 193, 209];
	//	textColorPayment = [5, 46, 102];
	//	fontPayment = 'OpenSans-Regular';
	//}

	if (data2print.invoice.invoiceTaxes != null) {
		result.push({
			content: 'Τρόπος Πληρωμής',
			colSpan: 2,
			//styles: { halign: 'center', fillColor: [41, 128, 185], textColor: 255, fontSize: 8, font: 'OpenSans-Bold', lineWidth: 0.1 }
			styles: { halign: 'center', fillColor: fillColorPayment, textColor: textColorPayment, fontSize: 8, font: fontPayment }
		});
		result.push({
			content: '',
			colSpan: 1,
			styles: { halign: 'center', fillColor: 255, textColor: 255, fontSize: 8, font: 'OpenSans-Bold' }
		});
		result.push({
			content: 'Ανάλυση Φόρων/ Τελών / Χαρτοσήμων',
			colSpan: 7,
			//styles: { halign: 'center', fillColor: [41, 128, 185], textColor: 255, fontSize: 8, font: 'OpenSans-Bold', lineWidth: 0.1 }
			styles: { halign: 'center', fillColor: fillColorPayment, textColor: textColorPayment, fontSize: 8, font: fontPayment }
		});
	}
	else {
		result.push({
			content: 'Τρόπος Πληρωμής',
			colSpan: 2,
			//styles: { halign: 'center', fillColor: [41, 128, 185], textColor: 255, fontSize: 8, font: 'OpenSans-Bold', lineWidth: 0.1 }
			styles: { halign: 'center', fillColor: fillColorPayment, textColor: textColorPayment, fontSize: 8, font: fontPayment }
		});
		result.push({
			content: '',
			colSpan: 1,
			styles: { halign: 'center', fillColor: 255, textColor: 255, fontSize: 8, font: 'OpenSans-Bold' }
		});
		result.push({
			content: '',
			colSpan: 7,
			styles: { halign: 'center', fillColor: 255, textColor: 255, font: 'OpenSans-Bold' }
		});
	}

	return result;
}

function addDummyRowInPaymentAndTaxesTable(data2print) {

	var result = [];

	var fillColorPayment = [255, 255, 255];
	var textColorPayment = [255, 255, 255];
	var fontPayment = 'OpenSans-Regular';

	if (data2print.invoice.invoiceTaxes != null) {
		result.push({
			content: '',
			colSpan: 2,
			//styles: { halign: 'center', fillColor: [41, 128, 185], textColor: 255, fontSize: 8, font: 'OpenSans-Bold', lineWidth: 0.1 }
			styles: { halign: 'center', fillColor: fillColorPayment, textColor: textColorPayment, fontSize: 8, font: fontPayment }
		});
		result.push({
			content: '',
			colSpan: 1,
			styles: { halign: 'center', fillColor: 255, textColor: 255, fontSize: 8, font: 'OpenSans-Bold' }
		});
		result.push({
			content: '',
			colSpan: 7,
			//styles: { halign: 'center', fillColor: [41, 128, 185], textColor: 255, fontSize: 8, font: 'OpenSans-Bold', lineWidth: 0.1 }
			styles: { halign: 'center', fillColor: fillColorPayment, textColor: textColorPayment, fontSize: 8, font: fontPayment }
		});
	}
	else {
		result.push({
			content: '',
			colSpan: 2,
			//styles: { halign: 'center', fillColor: [41, 128, 185], textColor: 255, fontSize: 8, font: 'OpenSans-Bold', lineWidth: 0.1 }
			styles: { halign: 'center', fillColor: fillColorPayment, textColor: textColorPayment, fontSize: 8, font: fontPayment }
		});
		result.push({
			content: '',
			colSpan: 1,
			styles: { halign: 'center', fillColor: fillColorPayment, textColor: textColorPayment, fontSize: 8, font: 'OpenSans-Bold' }
		});
		result.push({
			content: '',
			colSpan: 7,
			styles: { halign: 'center', fillColor: fillColorPayment, textColor: textColorPayment, font: 'OpenSans-Bold' }
		});
	}

	return result;
}

function getPaymentAndTaxesTableData(data2print, footlines) {

	if (data2print.invoice.invoiceTaxes != null) {
		data2print.invoice.invoiceTaxes.forEach(function (item, index) {

			var tmp = [];
			if (index == 0) {
				tmp.push({
					content: data2print.paymentDescription,
					colSpan: 2,
					styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 8, font: 'OpenSans-Regular' }
					//styles: { halign: 'center', fillColor: 255, textColor: 156, fontSize: 8, font: 'OpenSans-Regular', lineWidth: 0.1 }
				});
				tmp.push({
					content: '',
					colSpan: 1,
					styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 8, font: 'OpenSans-Regular' }
				});
				tmp.push({
					content: item.taxTitle,
					colSpan: 5,
					styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 7, font: 'OpenSans-Regular' }
				});
				tmp.push({
					//content: parseFloat(item.taxAmount).toFixed(2),
					content: new Number(parseFloat(item.taxAmount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }),
					colSpan: 3,
					styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 7, font: 'OpenSans-Regular' }
				});

				footlines.push(tmp);
			}
			else {
				tmp.push({
					content: '',
					colSpan: 2,
					styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 8, font: 'OpenSans-Regular' }
				});
				tmp.push({
					content: '',
					colSpan: 1,
					styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 8, font: 'OpenSans-Regular' }
				});
				tmp.push({
					content: item.taxTitle,
					colSpan: 5,
					styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 7, font: 'OpenSans-Regular' }
				});
				tmp.push({
					//content: parseFloat(item.taxAmount).toFixed(2),
					content: new Number(parseFloat(item.taxAmount).toFixed(2)).toLocaleString("el-GR", { minimumFractionDigits: 2 }),
					colSpan: 3,
					styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 7, font: 'OpenSans-Regular' }
				});

				footlines.push(tmp);
			}
		});
	}
	else {

		var tmp = [];

		tmp.push({
			content: data2print.paymentDescription,
			colSpan: 2,
			styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 8, font: 'OpenSans-Regular' }
		});
		tmp.push({
			content: '',
			colSpan: 1,
			styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 8, font: 'OpenSans-Regular' }
		});
		tmp.push({
			content: '',
			colSpan: 5,
			styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 7, font: 'OpenSans-Regular' }
		});
		tmp.push({
			content: '',
			colSpan: 2,
			styles: { halign: 'center', fillColor: 255, textColor: 0, fontSize: 7, font: 'OpenSans-Regular' }
		});

		footlines.push(tmp);
	}

	return footlines;
}

function calcTableBodyHeight(tbl) {

	var height = 0;

	for (var i = 0; i < tbl.body.length; i++) {
		height += tbl.body[i].height;
	}

	return height;
}

function calcTableDrawnBodyHeight(tbl, rowIndex) {

	var height = 0;

	for (var i = 0; i <= rowIndex - 1; i++) {
		height += tbl.body[i].height;
	}

	return height;
}

function isDummyFootRow(tableFoot) {
	isDummy = true;

	for (var i = 0; i < tableFoot.raw.length; i++) {
		if (tableFoot.raw[i].content != '') {
			isDummy = false;
			break;
		}

	}

	return isDummy;
}
