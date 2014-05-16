/**
 * Show functions to be exported from the design doc.
 */

var templates = require('duality/templates'),
	fields = require('couchtypes/fields'),
	Form = require('couchtypes/forms').Form;


exports.welcome = function (doc, req) {
	var myForm = new Form ({target: fields.string()});
    return {
        title: 'It worked!',
        content: templates.render('landing.html', req, {})
    };
};

exports.not_found = function (doc, req) {
    return {
        title: '404 - Not Found',
        content: templates.render('404.html', req, {})
    };
};

exports.my_form = function (doc, req) {
	var myForm = new Form ({first_name: fields.string(), last_name: fields.string()});
	return {
	  title : 'My First Form',
	  content: templates.render('form.html', req, {
			form_title : 'My Form',
			method : 'POST',
			action : '../_update/update_my_form',
			form : myForm.toHTML(req),
			button: 'Validate'})
	}
};

exports.my_form_content = function(doc, req) {
	return {
		title: 'Content of my Form',
		content: templates.render('base.html', req, {content : '<b>First Name</b> : ' +  doc.first_name + '<br/><b>Last Name</b> : ' + doc.last_name}) 
	};
};


exports.go = function(doc, req) {
  //!json templates
  if(!doc && !req.id) {
    return {
    	code: 302,
    	headers: {"Location": "http://127.0.0.1:5984/microlinks/_design/microlinks/_rewrite/"},
    	body: "If you don't get redirected, please go to " +"http://127.0.0.1:5984/microlinks/_design/microlinks/_rewrite/"+ "\n"
  	}
  }

  var source;
  if(doc) {
    source = doc._id;
  } else if(req.id) {
    source = req.id;
  }

  var sane_source = source.replace(/[\,\.\)]$/, "");

  if(source != sane_source) {
    // redirect to real short
    return {
      code: 302,
      headers: {"Location": "http://127.0.0.1:5984/" + sane_source},
      body: "If you don't get redirected, please go to http://jan.io/" + sane_source + "\n"
    };
  }

  return {
    code: 302,
    headers: {"Location": doc.target},
    body: "If you don't get redirected, please go to " + doc.target + "\n"
  };
};

