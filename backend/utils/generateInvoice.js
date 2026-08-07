import PDFDocument from "pdfkit";

const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=TrendWave-Invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  // ===========================
  // Header
  // ===========================
  doc
    .fontSize(24)
    .fillColor("#2563EB")
    .text("TrendWave", { align: "center" });

  doc
    .fontSize(12)
    .fillColor("black")
    .text("Fashion & Lifestyle Store", {
      align: "center",
    });

  doc.moveDown();

  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  doc.moveDown();

  // ===========================
  // Invoice Title
  // ===========================
  doc
    .fontSize(18)
    .text("INVOICE", {
      align: "center",
    });

  doc.moveDown();

  // ===========================
  // Invoice Details
  // ===========================

  doc.fontSize(12);

  doc.text(`Invoice ID : ${order._id}`);
  doc.text(`Invoice Date : ${new Date(order.createdAt).toLocaleDateString()}`);
  doc.text(`Order Status : ${order.orderStatus}`);
  doc.text(`Payment Status : ${order.paymentStatus}`);

  doc.moveDown();

  // ===========================
  // Customer Details
  // ===========================

  doc
    .fontSize(14)
    .fillColor("#2563EB")
    .text("Customer Details");

  doc.fillColor("black").fontSize(12);

  doc.text(`Name : ${order.user.name}`);
  doc.text(`Email : ${order.user.email}`);

  doc.moveDown();

  // ===========================
  // Shipping Address
  // ===========================

  doc
    .fontSize(14)
    .fillColor("#2563EB")
    .text("Shipping Address");

  doc.fillColor("black").fontSize(12);

  doc.text(order.shippingAddress.fullName);
  doc.text(order.shippingAddress.phone);
  doc.text(order.shippingAddress.addressLine1);

  if (order.shippingAddress.addressLine2) {
    doc.text(order.shippingAddress.addressLine2);
  }

  doc.text(
    `${order.shippingAddress.city}, ${order.shippingAddress.state}`
  );

  doc.text(
    `${order.shippingAddress.country} - ${order.shippingAddress.postalCode}`
  );

  doc.moveDown();

 // ===========================
// Product Table
// ===========================

doc
  .fontSize(14)
  .fillColor("#2563EB")
  .text("Products");

doc.moveDown();

const tableTop = doc.y;

doc.font("Helvetica-Bold").fontSize(12);

// Table Header
doc.text("Product", 50, tableTop);
doc.text("Qty", 290, tableTop);
doc.text("Price", 360, tableTop);
doc.text("Total", 460, tableTop);

// Header Line
doc
  .moveTo(50, tableTop + 18)
  .lineTo(550, tableTop + 18)
  .stroke();

doc.font("Helvetica");

let y = tableTop + 30;

// Table Rows
order.orderItems.forEach((item) => {
  doc.text(item.name, 50, y, {
    width: 220,
    ellipsis: true,
  });

  doc.text(item.quantity.toString(), 290, y);

  doc.text(`Rs. ${item.price}`, 360, y);

  doc.text(`Rs. ${item.price * item.quantity}`, 460, y);

  y += 25;
});

// Bottom Line
doc
  .moveTo(50, y)
  .lineTo(550, y)
  .stroke();

// Move cursor after table
doc.y = y + 15;

  doc
    .fontSize(14)
    .fillColor("#2563EB")
    .text("Payment Information");

  doc.fillColor("black").fontSize(12);

  doc.text(`Payment Method : ${order.paymentMethod}`);
  doc.text(`Payment Status : ${order.paymentStatus}`);

  doc.moveDown();

  // ===========================
  // Order Summary
  // ===========================

  doc
    .fontSize(14)
    .fillColor("#2563EB")
    .text("Order Summary");

  doc.fillColor("black").fontSize(12);

  doc.text(`Items Price : Rs. ${order.itemsPrice}`);
  doc.text(`Shipping : Rs. ${order.shippingPrice}`);
  doc.text(`Tax : Rs. ${order.taxPrice}`);

  doc.moveDown(0.5);

  doc.font("Helvetica-Bold");

  doc.fontSize(15).text(`Grand Total : Rs. ${order.totalPrice}`);

  doc.moveDown(2);

  doc
    .moveTo(50, doc.y)
    .lineTo(550, doc.y)
    .stroke();

  doc.moveDown();

  // ===========================
  // Footer
  // ===========================

  doc
    .fontSize(12)
    .fillColor("gray")
    .text("Thank you for shopping with TrendWave!", {
      align: "center",
    });

  doc
    .fontSize(10)
    .text("For support: support@trendwave.com", {
      align: "center",
    });

  doc.end();
};

export default generateInvoice;