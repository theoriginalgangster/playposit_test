// Author: Alexander Kleinhans
// Date: Sep 11, 2017

//----------------------------------
// LIBS 
//----------------------------------
var pdf = require('html-pdf');
var fs = require('fs');
var express = require('express');
var app = express();
var ejs = require('ejs');

//----------------------------------
// CONF
//----------------------------------
// Non-request specific configuration should normally 
// be read from env vars.
var certificate_dir = "./certificates/";
var port = 8080;
var pdf_config = {
		"width": "11in",
		"height": "8.5in",
	}

//----------------------------------
// TEMPLATE  
//----------------------------------
// Load the certificate template at initialization so
// the template is cached in memory and doesn't have to
// be read off disk every time.
var certificate_template = fs.readFileSync('./templates/certificate.ejs', 'utf8');

//----------------------------------
// ROUTES
//----------------------------------
// This file generates a PDF document based on the docs and saves
// them to a file with the verification string as it's assumed it
// is the GUID. If a request is sent to the API with the same
// verificataion string (since it's not generated here), it will
// sipmly write over the file.
//
// This uses native ES6 Promises so we can use callbacks, run them
// asynchrenously, chain more actions as we discover we need them
// and avoid callback hell while doing so.
app.get('/generate', function(req, res) {
	// 1) Validate request parameters.
	// 2) Generate PDF.
	// 3) Respond with status code 200
	// catch) On any error, respond with 500 and error.
	(function() {
		// Validate request and query parameters.
		return new Promise(function(resolve, reject) {
			// Make sure all the parameters are there.
			if (req.query.university_logo_url == undefined ||
			req.query.date_string == undefined ||
			req.query.name_string == undefined ||
			req.query.title_string == undefined ||
			req.query.description_string == undefined ||
			req.query.signature_image_url == undefined ||
			req.query.signature_block_string == undefined ||
			req.query.verification_string == undefined ||
			req.query.issuing_logo_url == undefined ||
			req.query.distinctions_flag_binary == undefined ||
			req.query.template_background_fill == undefined) {
				reject("Invalid request; missing parameters.");
			}
			// Any additional validation should be added here.
			// Reject promise if they don't pass. 
			// 	Note: image sizes already adjusted in template.
			//
			// Normally do some more error checking like
			// url encoding necessary things, checking for max lengths
			// based on some configuration, checking max file size of
			// image_url maybe, and validating the hex value of
			// the background template, but I'm not going to do
			// all of that now.
			// 
			// Otherwise resolve promise.
			resolve();
		});
	})()
	.then(function() {
		// Render the  HTML version of the certificate and write to disk.
		return new Promise(function(resolve, reject) {
			// Generate the HTML string using the EJS template engine.
			var html = ejs.render(certificate_template, {
				university_logo_url: req.query.university_logo_url,
				date_string: req.query.date_string,
				name_string: req.query.name_string,
				title_string: req.query.title_string,
				description_string: req.query.description_string,
				signature_image_url: req.query.signature_image_url,
				signature_block_string: req.query.signature_block_string,
				verification_string: req.query.verification_string,
				issuing_logo_url: req.query.issuing_logo_url,
				distinctions_flag_binary: req.query.distinctions_flag_binary,
				template_background_fill: req.query.template_background_fill
			});
			// Create the pdf and write to disk.
			var pdf_filename = certificate_dir + req.query.verification_string + ".pdf"; 
			// I'm assuming verification_string is the GUID, otherwise, it's 
			// just gonna  write over it.
			pdf.create(html, pdf_config).toFile(pdf_filename, function(err, res) {
				if (err) {
					reject("Error generating PDF: " + err);
				}
			});
			resolve();
		});
	})
	.then(function() {
		// Everything went well. Respond with 200. This is default.
		res.send("Success!");
	})
	.catch(function(err) {
		// Something went wrong. Respond with 500.
		res.statusCode = 500;
		res.send("Oops, something went wrong... " + err);
		// Log in your favorite way (or right way to stdout like 12 factor apps).
		console.log("ERROR: " + err);
	});
});

app.listen(port);
console.log('Certificate generator is listenting on port 8080');
