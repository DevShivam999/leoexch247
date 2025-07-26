export const PdfFile = async (data: any, type = "AccountStatement") => {
  
  const { jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");
  const { RoleSwitch } = await import("./RoleSwitch");

  const doc = new jsPDF();

  const columns = Object.keys(data[0]);
  const rows = data.map((item: any) =>
    columns.map((col) =>
      Array.isArray(item[col]) ?item[col][0]? RoleSwitch(item[col][0]):item[col] : item[col]
    )
  );

  doc.text(`${type} Report`, 14, 10);

  autoTable(doc, {
    head: [columns],
    body: rows,
    startY: 20,
  });

  doc.save(`${type}.pdf`);
};
