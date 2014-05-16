/**
 * Update functions to be exported from the design doc.
 */
function f(n) {    // Format integers to have at least two digits.
    return n < 10 ? '0' + n : n;
}

Date.prototype.rfc3339 = function() {
    return this.getUTCFullYear()   + '-' +
         f(this.getUTCMonth() + 1) + '-' +
         f(this.getUTCDate())      + 'T' +
         f(this.getUTCHours())     + ':' +
         f(this.getUTCMinutes())   + ':' +
         f(this.getUTCSeconds())   + 'Z';
};

// This is a format that collates in order and tends to work with
// JavaScript's new Date(string) date parsing capabilities, unlike rfc3339.
Date.prototype.toJSON = function() {
    return this.getUTCFullYear()   + '/' +
         f(this.getUTCMonth() + 1) + '/' +
         f(this.getUTCDate())      + ' ' +
         f(this.getUTCHours())     + ':' +
         f(this.getUTCMinutes())   + ':' +
         f(this.getUTCSeconds())   + ' +0000';
};

// from http://blog.dansnetwork.com/2008/11/01/javascript-iso8601rfc3339-date-parser/
Date.prototype.setISO8601 = function(dString) {

  var regexp = /(\d\d\d\d)(-)?(\d\d)(-)?(\d\d)(T)?(\d\d)(:)?(\d\d)(:)?(\d\d)(\.\d+)?(Z|([+-])(\d\d)(:)?(\d\d))/;

  if (dString.toString().match(new RegExp(regexp))) {
    var d = dString.match(new RegExp(regexp));
    var offset = 0;

    this.setUTCDate(1);
    this.setUTCFullYear(parseInt(d[1],10));
    this.setUTCMonth(parseInt(d[3],10) - 1);
    this.setUTCDate(parseInt(d[5],10));
    this.setUTCHours(parseInt(d[7],10));
    this.setUTCMinutes(parseInt(d[9],10));
    this.setUTCSeconds(parseInt(d[11],10));
    if (d[12])
    this.setUTCMilliseconds(parseFloat(d[12]) * 1000);
    else
    this.setUTCMilliseconds(0);
    if (d[13] != 'Z') {
      offset = (d[15] * 60) + parseInt(d[17],10);
      offset *= ((d[14] == '-') ? -1 : 1);
      this.setTime(this.getTime() - offset * 60 * 1000);
    }
  }
  else {
    this.setTime(Date.parse(dString));
  }
  return this;
};

Date.prototype.setRFC3339 = Date.prototype.setISO8601;



var templates = require('duality/templates'),
	fields = require('couchtypes/fields'),
	Form = require('couchtypes/forms').Form;

exports.update_my_form = function (doc, req) {
    var form = new Form({first_name: fields.string(), last_name: fields.string()});
    form.validate(req);

	/**
	 * We do that because we are not using CouchType
	 * CouchType takes care of generating a uuid
	 */
	form.values._id = req.uuid;

 if (form.isValid()) {
        return [form.values, {content: 'Hello ' + form.values.first_name +', '+ form.values.last_name , title: 'Result'}];
    }
 else {
        var content = templates.render('form.html', req, {
            form_title: 'My Form',
			method: 'POST',
			action: '../_update/update_my_form',
            form: form.toHTML(req),
			input: 'Validate'
        });
        return [null, {content: content, title: 'My First Form'}];
    }
};



exports.shorten = function(doc, req) {
  // !json templates
  // !code vendor/date/date.js

  if(doc) {
    return [null, "You can't edit shorts"];
  }
  var doc = {};
  doc.target = req.query.target || req.form.target;

  var shortio = function() {
    /* Borrowed from Jason Davies */
    function generateSecret(length) {
      var tab = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      var secret = '';
      for (var i=0; i<length; i++) {
        secret += tab.charAt(Math.floor(Math.random() * tab.length));
      }
      return secret;
    }
    return generateSecret(4);
  }

  var shortened = shortio();
  doc._id = shortened;
  doc.date = (new Date()).rfc3339();
  var shortlink = req.headers.Referer + shortened;
 return [doc, "/microlinks/_design/microlinks/_show/go/"+shortened];
};
