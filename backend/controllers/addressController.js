import Address from "../models/addressModel.js";

export const addAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      addressType,
    } = req.body;

    // Validation
    if (
      !fullName ||
      !phone ||
      !addressLine1 ||
      !city ||
      !state ||
      !country ||
      !postalCode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const address = await Address.create({
      user: req.user._id,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      addressType,
    });

    res.status(201).json({
      success: true,
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({
      user: req.user._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      totalAddresses: addresses.length,
      addresses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateAddress = async (req, res) => {
  try {
    const {
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      postalCode,
      addressType,
    } = req.body;

    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    address.fullName = fullName || address.fullName;
    address.phone = phone || address.phone;
    address.addressLine1 = addressLine1 || address.addressLine1;
    address.addressLine2 = addressLine2 ?? address.addressLine2;
    address.city = city || address.city;
    address.state = state || address.state;
    address.country = country || address.country;
    address.postalCode = postalCode || address.postalCode;
    address.addressType = addressType || address.addressType;

    await address.save();

    res.status(200).json({
      success: true,
      message: "Address updated successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: "Address not found",
      });
    }

    await address.deleteOne();

    res.status(200).json({
      success: true,
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};