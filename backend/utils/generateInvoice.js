import PDFDocument from "pdfkit";

const generateInvoice = (order, res) => {
  const doc = new PDFDocument({ margin: 40 });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=Invoice-${order._id}.pdf`
  );

  doc.pipe(res);

  // Company
  doc.fontSize(20).text("Simplifyte E-Commerce", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(18).text("Invoice", {
    align: "center",
  });

  doc.moveDown();

  // Customer
  doc.fontSize(12);
  doc.text(`Invoice ID : ${order._id}`);
  doc.text(`Customer : ${order.user.name}`);
  doc.text(`Email : ${order.user.email}`);
  doc.text(`Date : ${order.createdAt.toDateString()}`);

  doc.moveDown();

  // Shipping Address
  doc.fontSize(14).text("Shipping Address");

  doc.fontSize(12);
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

  // Products
  doc.fontSize(14).text("Products");

  order.orderItems.forEach((item, index) => {
    doc.moveDown();

    doc.fontSize(12);

    doc.text(`${index + 1}. ${item.name}`);

    doc.text(`Quantity : ${item.quantity}`);

    doc.text(`Price : Rs.${item.price}`);

    doc.text(`Total : Rs.${item.price * item.quantity}`);
  });

  doc.moveDown();

  // Payment
  doc.fontSize(14).text("Payment");

  doc.fontSize(12);

  doc.text(`Payment Method : ${order.paymentMethod}`);

  doc.text(`Payment Status : ${order.paymentStatus}`);

  doc.text(`Order Status : ${order.orderStatus}`);

  doc.moveDown();

  // Summary
  doc.fontSize(14).text("Summary");

  doc.fontSize(12);

  doc.text(`Items Price : Rs.${order.itemsPrice}`);

  doc.text(`Shipping : Rs.${order.shippingPrice}`);

  doc.text(`Tax : Rs.${order.taxPrice}`);

  doc.fontSize(15);

  doc.text(`Grand Total : Rs.${order.totalPrice}`);

  doc.moveDown(2);

  doc.text("Thank you for shopping with Simplifyte ❤️", {
    align: "center",
  });

  doc.end();
};

export default generateInvoice;