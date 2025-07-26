export default async function ExcelFile(data: any, type = "AccountStatement") {
  const XLSX = await import("xlsx");
  const { saveAs } = await import("file-saver");
  const { RoleSwitch } = await import("./RoleSwitch");

  const newData = type !== "AccountStatement"
    ? data.map((p: any) =>
        p?.roles ? { ...p, roles: RoleSwitch(p.roles[0]) } : p.roles
      )
    : data;

  const worksheet = XLSX.utils.json_to_sheet(newData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report Data");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const result = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(result, `${type}.xlsx`);
}
