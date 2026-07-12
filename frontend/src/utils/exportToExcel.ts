import ExcelJS from "exceljs";
import {IOrder} from "@/interfaces/IOrder";
import {formatDate} from "@/utils/date";

export const exportToExcel = async (data: IOrder[]) => {
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet('Orders')

    worksheet.columns = [
        {header: 'ID', key: 'rowNumber'},
        {header: 'Name', key: 'name'},
        {header: 'Surname', key: 'surname'},
        {header: 'Email', key: 'email'},
        {header: 'Phone', key: 'phone'},
        {header: 'Age', key: 'age'},
        {header: 'Course', key: 'course'},
        {header: 'Course_Format', key: 'course_format'},
        {header: 'Course_Type', key: 'course_type'},
        {header: 'Status', key: 'status'},
        {header: 'Summa', key: 'sum'},
        {header: 'Already_Paid', key: 'already_paid'},
        {header: 'Created_At', key: 'created_at'},
        {header: 'Group', key: 'group'},
        {header: 'Manager', key: 'managerInfo'},

    ] as ExcelJS.Column[];

    const headerRow = worksheet.getRow(1);
    headerRow.eachCell((cell) => {
        cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: {argb: 'FF76B852'}
        };
        cell.border = {
            top: {style: 'medium'},
            left: {style: 'medium'},
            bottom: {style: 'medium'},
            right: {style: 'medium'}
        };
        cell.font = {
            color: {argb: 'FFFFFFFF'},
            bold: true
        };
    });

    data.forEach(item => {
            const rowData = {
                ...item,
                created_at: formatDate(item.created_at)
            };

            const row = worksheet.addRow(rowData);

            for (let i = 1; i <= worksheet.columnCount; i++) {
                const cell = row.getCell(i);

                cell.border = {
                    top: {style: 'thin'},
                    left: {style: 'thin'},
                    bottom: {style: 'thin'},
                    right: {style: 'thin'}
                }
            }
        }
    )

    const columns = worksheet.columns as ExcelJS.Column[];

    columns?.forEach(column => {
        let maxLength = 0;
        column.eachCell({includeEmpty: true}, cell => {
            const columnLength = cell.value ? cell.value.toString().length : 10;
            if (columnLength > maxLength) {
                maxLength = columnLength;
            }
        });
        column.width = Math.min(maxLength + 2, 30);
    });

    const buffer = await workbook.xlsx.writeBuffer()
    const blob = new Blob([buffer], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')
    a.href = url
    a.download = 'orders.xlsx'
    a.click()

    URL.revokeObjectURL(url)
}