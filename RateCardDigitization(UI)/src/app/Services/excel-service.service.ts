import { Injectable } from '@angular/core';
//import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import * as Excel from 'exceljs';

@Injectable({
  providedIn: 'root'
})
export class ExcelServiceService {
  constructor(private datePipe: DatePipe) {

  }

  generateExcelForReports(header: any, data: any, fileName: any) {
    //Create workbook and worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('Report 1');

    let headerRow = worksheet.addRow(header);

    // Cell Style : Fill and Border
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFFFF00' },
        bgColor: { argb: 'FF0000FF' }
      }
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }

    })
    // worksheet.addRows(data);

    // Add Data and Conditional Formatting
    data.forEach((d:any) => {
      let row = worksheet.addRow(d);
      row.eachCell((cell, number) => {
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }        
        if (worksheet.getCell(cell.address).value instanceof Date) {
          if(worksheet!=null && worksheet!=null)
          var dateValue = worksheet?.getCell(cell?.address)?.value?.toString();
          worksheet.getCell(cell.address).value = moment(dateValue).format("DD-MMM-YY");
        }
      })
    }
    );
    worksheet.columns.forEach(function (column, i) {
      if (i !== 0) {
        var maxLength = 0;
        column?.eachCell?.({ includeEmpty: true }, function (cell) {
          var columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 10 : maxLength;
      }
    });
    this.AdjustColumnWidth(worksheet);
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fileName);
    })

  }

  private AdjustColumnWidth(worksheet:Excel.Worksheet) {
    worksheet.columns.forEach(column => {
      const lengths = column?.values?.map((v:any) => v.toString().length);
      var maxLength = 0
      if(lengths!=undefined){
         maxLength = Math.max(...lengths.filter(v => typeof v === 'number'));      
      }
      column.width = maxLength;
    });
  }


}