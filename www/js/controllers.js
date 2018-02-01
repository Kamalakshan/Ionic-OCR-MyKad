angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope) {})
.controller('OCRCtrl', function($scope) {

  $scope.Result = 'No Result yet';
  var resultDiv = document.getElementById('resultDiv');
  var resultImgDiv = document.getElementById('imageDiv');
  var resultImg = document.getElementById('documentImage');

  resultImgDiv.style.visibility = "hidden"

  /**
   * Use these scanner types
   * Available: "PDF417", "USDL", "Bar Decoder", "Zxing", "MRTD", "UKDL", "MyKad"
   * PDF417 - scans PDF417 barcodes
   * USDL - scans barcodes located on the back of US driver's license
   * Bar Decoder - scans code39 and code128 type barcodes. Both Code 39 and Code 128 are scanned by default when using Bar Decoder.
   * Zxing - scans various types of codes (i.e. QR, Aztec). Types of scanned codes can be modified in plugin classes (Explained later in this readme). By default, scanned codes are set to: Code 39, Code 128, EAN 13, EAN 8, QR, UPCA, UPCE
   * MRTD - scans Machine Readable Travel Document, contained in various IDs and passports
   * UKDL - scans the front of United Kingom driver's license
   * MyKad - scans the front of Malaysian ID cards
   * Variable << types >> declared below has to contain all the scanners needed by your application. Applying additional scanners will slow down the scanning process
   */
  var types = ["PDF417", "UKDL", "MRTD","MyKad"];
  //var types = ["MyKad"];

  /**
   * Image type defines type of the image that will be returned in scan result (image is returned as Base64 encoded JPEG)
   * available:
   *  "IMAGE_NONE" : do not return image in scan result
   *  "IMAGE_SUCCESSFUL_SCAN" : return full camera frame of successful scan
   *  "IMAGE_CROPPED" : return cropped document image (successful scan)
   *
   */
  var imageType = "IMAGE_CROPPED"

// Note that each platform requires its own license key

// This license key allows setting overlay views for this application ID: com.microblink.blinkid
  var licenseiOs = "OLJJAUDF-CIV2HMG3-ZFEVNWIC-2FNSXP3W-YLKHF4MV-LTSI5GR7-I5ARBPXV-WRCTMCMT";

// This license is only valid for package name "com.microblink.blinkid"
  var licenseAndroid = "C5MXHQN4-M2TNJ7G6-KE22BH35-AUF5J7E6-3VWOBFCB-S7MRMRWK-APYIIURP-TQL3UNO5";

  //from tuneTalk app
  //var licenseAndroid = "GJM2KABS-PP4R34QP-E3QKVNKC-ZVEC23PV-XWITBAYW-VRAJEURG-5U32YQES-KI7BUJNZ";

  $scope.ReadMyKadOCR = function(){
    cordova.plugins.blinkIdScanner.scan(
      // Register the callback handler
      function callback(scanningResult) {

        // handle cancelled scanning
        if (scanningResult.cancelled == true) {
          resultDiv.innerHTML = "Cancelled!";
          return;
        }

        // Obtain list of recognizer results
        var resultList = scanningResult.resultList;
        // Image is returned as Base64 encoded JPEG
        var image = scanningResult.resultImage;

        if (image) {
          resultImg.src = "data:image/jpg;base64, " + image;
          resultImgDiv.style.visibility = "visible"
        } else {
          resultImgDiv.style.visibility = "hidden"
        }

        // Iterate through all results
        for (var i = 0; i < resultList.length; i++) {

          // Get individual resilt
          var recognizerResult = resultList[i];
          if (recognizerResult.resultType == "Barcode result") {
            // handle Barcode scanning result

            var raw = "";
            if (typeof(recognizerResult.raw) != "undefined" && recognizerResult.raw != null) {
              raw = " (raw: " + hex2a(recognizerResult.raw) + ")";
            }
            resultDiv.innerHTML = "Data: " + recognizerResult.data + raw +
              " (Type: " + recognizerResult.type + ")";

          } else if (recognizerResult.resultType == "USDL result") {
            // handle USDL parsing result

            var fields = recognizerResult.fields;

            resultDiv.innerHTML = /** Personal information */
              "USDL version: " + fields[kPPStandardVersionNumber] + "; " +
              "Family name: " + fields[kPPCustomerFamilyName] + "; " +
              "First name: " + fields[kPPCustomerFirstName] + "; " +
              "Date of birth: " + fields[kPPDateOfBirth] + "; " +
              "Sex: " + fields[kPPSex] + "; " +
              "Eye color: " + fields[kPPEyeColor] + "; " +
              "Height: " + fields[kPPHeight] + "; " +
              "Street: " + fields[kPPAddressStreet] + "; " +
              "City: " + fields[kPPAddressCity] + "; " +
              "Jurisdiction: " + fields[kPPAddressJurisdictionCode] + "; " +
              "Postal code: " + fields[kPPAddressPostalCode] + "; " +

              /** License information */
              "Issue date: " + fields[kPPDocumentIssueDate] + "; " +
              "Expiration date: " + fields[kPPDocumentExpirationDate] + "; " +
              "Issuer ID: " + fields[kPPIssuerIdentificationNumber] + "; " +
              "Jurisdiction version: " + fields[kPPJurisdictionVersionNumber] + "; " +
              "Vehicle class: " + fields[kPPJurisdictionVehicleClass] + "; " +
              "Restrictions: " + fields[kPPJurisdictionRestrictionCodes] + "; " +
              "Endorsments: " + fields[kPPJurisdictionEndorsementCodes] + "; " +
              "Customer ID: " + fields[kPPCustomerIdNumber] + "; ";

          } else if (recognizerResult.resultType == "MRTD result") {

            var fields = recognizerResult.fields;

            resultDiv.innerHTML = /** Personal information */
              "Family name: " + fields[kPPmrtdPrimaryId] + "; <br>" +
              "First name: " + fields[kPPmrtdSecondaryId] + "; <br>" +
              "Date of birth: " + fields[kPPmrtdBirthDate] + "; <br>" +
              "Sex: " + fields[kPPmrtdSex] + "; <br>" +
              "Nationality: " + fields[kPPmrtdNationality] + "; <br>" +
              "Date of Expiry: " + fields[kPPmrtdExpiry] + "; <br>" +
              "Document Code: " + fields[kPPmrtdDocCode] + "; <br>" +
              "Document Number: " + fields[kPPmrtdDocNumber] + "; <br>" +
              "Issuer: " + fields[kPPmrtdIssuer] + "; <br>" +
              "ID Type: " + fields[kPPmrtdDataType] + "; <br>" +
              "Opt1: " + fields[kPPmrtdOpt1] + "; <br>" +
              "Opt2: " + fields[kPPmrtdOpt2] + "; <br>";

          } else if (recognizerResult.resultType == "UKDL result") {

            var fields = recognizerResult.fields;

            resultDiv.innerHTML = /** Personal information */
              "ID Type: " + fields[kPPukdlDataType] + "; " +
              "Date of Expiry: : " + fields[kPPukdlExpiry] + "; " +
              "Issue Date: " + fields[kPPukdlIssueDate] + "; " +
              "Driver Number: " + fields[kPPukdlDriverNumber] + "; " +
              "Address: " + fields[kPPukdlAddress] + "; " +
              "Birth Data: " + fields[kPPukdlBirthData] + "; " +
              "First name: " + fields[kPPukdlFirstName] + "; " +
              "Last name: " + fields[kPPukdlLastName] + "; ";

          } else if (recognizerResult.resultType == "MyKad result") {

            var fields = recognizerResult.fields;

            resultDiv.innerHTML = /** Personal information */
              "ID Type: " + fields[kPPmyKadDataType] + "; <br>" +
              "NRIC Number: " + fields[kPPmyKadNricNumber] + "; <br>" +
              "Address: " + fields[kPPmyKadAddress] + "; <br>" +
              "Birth Date: " + fields[kPPmyKadBirthDate] + "; <br>" +
              "Full Name: " + fields[kPPmyKadFullName] + "; <br>" +
              "Religion: " + fields[kPPmyKadReligion] + "; <br>" +
              "Sex: " + fields[kPPmyKadSex] + "; <br>";
          }
        }
      },

      // Register the error callback
      function errorHandler(err) {
        alert('Error: ' + err);
      },

      types, imageType, licenseiOs, licenseAndroid
    );
  };

})
.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
