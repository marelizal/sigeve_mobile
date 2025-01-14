import React, { useState } from 'react';
import { View, StyleSheet, Button, Platform } from 'react-native';
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

type Item = {
  code?: string;
  detail: string;
  quantity: number;
  unitPrice: number;
};

type TicketData = {
  remitNumber: string;
  date: string;
  cuit: string;
  ingrBr: string;
  startDate: string;
  customerName: string;
  address: string;
  iva: string;
  customerCuit: string;
  items: Item[];
  total: number;
};

const createTicketHtml = (data: TicketData): string => `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
    <style>
      body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto; }
      .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
      .company-info { text-align: left; font-size: 12px; }
      .remito-info { text-align: right; font-size: 12px; border: 1px solid black; padding: 5px; }
      .customer-info { border: 1px solid black; padding: 10px; margin-bottom: 20px; font-size: 12px; }
      .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
      .items-table th, .items-table td { text-align: left; padding: 5px; font-size: 12px; }
      .total { text-align: right; font-weight: bold; font-size: 14px;margin-bottom: 60px; }
    </style>
  </head>
  <body>
    <div class="header">
      <div class="company-info">
        <strong>DISTRIBUCION GD PLUS</strong><br/>
        DIA A DIA CON USTEDES<br/>
        OCARANZA GUSTAVO ARIEL<br/>
        Colón 696 Sgo del Estero<br/>
        Tel.: 385 4991540<br/>
        ocaranzagustavo.palau@gmail.com<br/>
        IVA RESPONSABLE INSCRIPTO
      </div>
      <div class="remito-info">
        <strong>REMITO</strong><br/>
        N°: ${data.remitNumber}<br/>
        FECHA: ${data.date}<br/>
        CUIT: ${data.cuit}<br/>
        Ingr.Br.: ${data.ingrBr}<br/>
        Inicio Act.: ${data.startDate}
      </div>
    </div>

    <div class="customer-info">
      SR/ES: ${data.customerName}<br/>
      DOMICILIO: ${data.address}<br/>
      I.V.A: ${data.iva}<br/>
      CUIT: ${data.customerCuit}
    </div>

    <table class="items-table">
      <thead>
        <tr>
          <th>CODIGO</th>
          <th>DETALLE</th>
          <th>CANT.</th>
          <th>P.UNIT</th>
          <th>IMPORTE</th>
        </tr>
      </thead>
      <tbody>
        ${data.items.map(item => `
          <tr>
            <td>${item.code || ''}</td>
            <td>${item.detail}</td>
            <td>${item.quantity}</td>
            <td>${item.unitPrice.toFixed(2)}</td>
            <td>${(item.quantity * item.unitPrice).toFixed(2)}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>

    <div class="total">
      TOTAL ${data.total.toFixed(2)}
    </div>
   <p>Gracias por su compra</p>    
  </body>
</html>
`;

export default function TicketPrinter(): JSX.Element {
  const [selectedPrinter, setSelectedPrinter] = useState<Print.Printer | undefined>();

  const sampleData: TicketData = {
    remitNumber: '00001-00078239',
    date: '30/12/24',
    cuit: '20268533177',
    ingrBr: '20268533177',
    startDate: '16/07/2018',
    customerName: 'DESP TOBBER',
    address: 'AVENIDA VICTOR ALCORTA N 3078 BARRIO INDEPENDENCIA',
    iva: 'CONSUMIDOR FINAL',
    customerCuit: '00000000001',
    items: [
      { detail: 'PAN PEBETON X 12 UN', quantity: 3, unitPrice: 2990.59 },
      { detail: 'PREPIZZAS X2', quantity: 2, unitPrice: 1323.45 },
      { detail: 'PAN HAMBURGUESA', quantity: 6, unitPrice: 814.27 },
      { detail: 'PAN PANCHOS X6 UN', quantity: 5, unitPrice: 814.27 }
    ],
    total: 20575.64
  };

  const print = async (): Promise<void> => {
    try {
      await Print.printAsync({
        html: createTicketHtml(sampleData),
        printerUrl: selectedPrinter?.url,
      });
    } catch (error) {
      console.error('Error printing:', error);
    }
  };

  const selectPrinter = async (): Promise<void> => {
    try {
      const printer = await Print.selectPrinterAsync();
      setSelectedPrinter(printer);
    } catch (error) {
      console.error('Error selecting printer:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Imprimir Ticket" onPress={print} />
      {Platform.OS === 'ios' && (
        <Button title="Seleccionar Impresora" onPress={selectPrinter} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    gap: 10,
    padding: 20,
  },
});
