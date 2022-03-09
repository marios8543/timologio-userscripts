from win32com.client import Dispatch
from http.server import BaseHTTPRequestHandler, HTTPServer
from os import path
import sys

LABEL_TEMPLATE = """
<?xml version="1.0" encoding="utf-8"?>
<DieCutLabel Version="8.0" Units="twips">
	<PaperOrientation>Landscape</PaperOrientation>
	<Id>Address</Id>
	<IsOutlined>false</IsOutlined>
	<PaperName>30252 Address</PaperName>
	<DrawCommands>
		<RoundRectangle X="0" Y="0" Width="1581" Height="5040" Rx="270" Ry="270" />
	</DrawCommands>
	<ObjectInfo>
		<AddressObject>
			<Name>ADDR</Name>
			<ForeColor Alpha="255" Red="0" Green="0" Blue="0" />
			<BackColor Alpha="0" Red="255" Green="255" Blue="255" />
			<LinkedObjectName />
			<Rotation>Rotation0</Rotation>
			<IsMirrored>False</IsMirrored>
			<IsVariable>True</IsVariable>
			<GroupID>-1</GroupID>
			<IsOutlined>False</IsOutlined>
			<HorizontalAlignment>Center</HorizontalAlignment>
			<VerticalAlignment>Middle</VerticalAlignment>
			<TextFitMode>ShrinkToFit</TextFitMode>
			<UseFullFontHeight>True</UseFullFontHeight>
			<Verticalized>False</Verticalized>
			<StyledText>
				<Element>
					<String xml:space="preserve">ADDRESS</String>
					<Attributes>
						<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
						<ForeColor Alpha="255" Red="0" Green="0" Blue="0" HueScale="100" />
					</Attributes>
				</Element>
			</StyledText>
			<ShowBarcodeFor9DigitZipOnly>False</ShowBarcodeFor9DigitZipOnly>
			<BarcodePosition>Suppress</BarcodePosition>
			<LineFonts>
				<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
				<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
				<Font Family="Arial" Size="12" Bold="False" Italic="False" Underline="False" Strikeout="False" />
			</LineFonts>
		</AddressObject>
		<Bounds X="332" Y="150" Width="4455" Height="1260" />
	</ObjectInfo>
</DieCutLabel>
"""

if getattr(sys, 'frozen', False):
    curdir = path.dirname(sys.executable)
else:
    curdir = path.dirname(path.abspath(__file__))
label = path.join(curdir, 'template.label')
if not path.isfile(label):
    label_file = open(label, "w+")
    label_file.write(LABEL_TEMPLATE)
    label_file.close()


def print_label(text):
    labelCom = Dispatch('Dymo.DymoAddIn')
    labelText = Dispatch('Dymo.DymoLabels')
    labelCom.Open(label)
    labelCom.SelectPrinter('DYMO LabelWriter 450')
    labelText.SetField('ADDR', text)

    labelCom.StartPrintJob()
    labelCom.Print(1, False)
    labelCom.EndPrintJob()


class Handler(BaseHTTPRequestHandler):
    def _set_response(self):
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode("utf-8")
        print(post_data, "\n\n")
        print_label(post_data)
        self._set_response()
        self.wfile.write("OK".encode("utf-8"))


server = HTTPServer(("", 5000), Handler)
server.serve_forever()
