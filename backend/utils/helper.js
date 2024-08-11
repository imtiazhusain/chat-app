import fs from "fs";
import path from "path";
class HelperMethods {
  static generateOTP() {
    let otp = "";
    for (let i = 0; i <= 3; i++) {
      const randVal = Math.round(Math.random() * 9);
      otp = otp + randVal;
    }
    return otp;
  }

  // Function to delete a file if it exists
  static deleteFileIfExists = (fileName) => {
    // Resolve the file path from the base directory

    const rootDirectory = path.resolve();

    let res = path.join(
      rootDirectory,
      "backend",
      "public",
      "uploads",
      fileName
    );

    // Check if the file exists
    if (fs.existsSync(res)) {
      // If the file exists, delete it
      fs.unlink(res, (err) => {
        if (err) {
          console.error("Error deleting the file:", err);
          return;
        }
        console.log("File deleted successfully");
      });
    } else {
      // If the file does not exist, do nothing
      console.log("No file to delete");
    }
  };
}

export default HelperMethods;
