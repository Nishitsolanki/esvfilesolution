exports.isValidEmail = (email) => {
    // Basic email validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

exports.isValidMobileNumber = (mobileNumber) => {
    // Basic mobile number validation
    const mobileRegex = /^[6-9]\d{9}$/;
    return mobileRegex.test(mobileNumber);
};

exports.validImage = function(image){
    return /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/.test(image)
  }