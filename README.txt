Documentation:

This uses ES6 Promises and additional validation can be added in the first
function. Callbacks are chained additionally for each step, including the
generation of the PDF.

The following GET parameters are all required, note that images as urls
must be URL encoded. An exampel usage is bellow.

Request parameters:
	university_logo_url
	date_string
	name_string
	title_string
	description_string
	signature_image_url
	signature_block_string
	verification_string
	issuing_logo_url
	distinctions_flag_binary
	template_background_fill


Example Usage:
http://localhost:8080/generate?university_logo_url=https%3A%2F%2Fi.imgur.com%2FlQD0haj.png&date_string=asdf&name_string=John%20Smith&title_string=Dynamic%20Algorithms%20and%20Analysis&description_string=a%209%20week%2C%20online%2C%20non-credit%20course%20authorized%20by%20University%20of%20Colorado%20and%20offered%20through%20EdX&signature_image_url=https%3A%2F%2Fi.imgur.com%2FE0nT3JW.png&signature_block_string=Dr.%20Instructor&verification_string=asdf&issuing_logo_url=https%3A%2F%2Fi.imgur.com%2FS9neADV.png&distinctions_flag_binary=1&template_background_fill=%23faebd7












----------------------------Note To Playposit (Not documentation)------------------------------



Since the PDF resource was not one of the 7 enumerated requirements, I used my own library.

You will need to NPM install all packages. I was considering putting the entire thing
it's own module but decided it woudl be too complicated for an API with one route. Also,
configuration vars should be but in envirmonmental vars but I just put them on the top
of the file for now.

Also the CSS required for PDFs will make the HTML look wierd in the browser.

Thanks for your consideration!
