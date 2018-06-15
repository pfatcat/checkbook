
//add to the date prototype...sneaky
// Date.prototype.toISODate = function() {
//   var mm = this.getMonth() + 1; // getMonth() is zero-based
//   var dd = this.getDate();

//   return [this.getFullYear(),
//           (mm>9 ? '' : '0') + mm,
//           (dd>9 ? '' : '0') + dd
//          ].join('');
// };

module.exports = {
  createGuid: function (){
      function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
          .toString(16)
          .substring(1);
      }
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    },
  toMMDDYYYY: function (date){
        return (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear()
  },
  toISODate: function (date){

          //TEXT as ISO8601 strings ("YYYY-MM-DD HH:MM:SS.SSS").
          let mm = date.getMonth() + 1 // getMonth() is zero-based
          let dd = date.getDate()
          const yyyy = date.getFullYear()

          mm = (mm>9 ? "" : "0") + mm
          dd = (dd>9 ? "" : "0") + dd

          return yyyy + "-" + mm + "-" + dd + " 00:00:00.000"
  },
  parseOFXDate: function(ofxDate){
      const yyyy = ofxDate.substring(0, 4)
      const mm = ofxDate.substring(4, 6)
      const dd = ofxDate.substring(6, 8)
      const hh = ofxDate.substring(8, 10)
      const mi = ofxDate.substring(10, 12)
      const ss = ofxDate.substring(12, 14)

      return yyyy + "-" + mm + "-" + dd + " " + hh + ":" + mi + ":" + ss + ".000"
  },
  nullToSpace: function(value){
    return value == null ? "" : value
  }
}

