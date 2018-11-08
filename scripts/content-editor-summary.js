window.onload = function() {
	
	//Adding CSS to the page in the head of the frame
	var link = document.createElement('link');
	link.setAttribute('rel', 'stylesheet');
	// Temporary link to the css file externally
	link.setAttribute('href', 'https://raw.githubusercontent.com/ramzizaz/chrome-ext/master/css/SearchResultPopup.css');

	// Adding javascript for the popup, can replace with externally hosted file as well
	var script = document.createElement('script');
	//myFunc should retrieve the data, then modify the span to show the data
	var funcVar = function myFunction(personId) {
		
		var url = 'https://www.editorialmanager.com/ponetest/addtnlPeopleDetails.aspx?peopleID='+personId;

		var staffPeopleNote;
		//Code to retrieve data from referenced url	
		fetch(url).then(function(response) {
	        // When the page is loaded convert it to text
	        return response.text()
	    })
	    .then(function(html) {
	        // Initialize the DOM parser
	        var parser = new DOMParser();

	        // Parse the text
	        var doc = parser.parseFromString(html, "text/html");
	        // Get the staff people note from the additional people details page
	        staffPeopleNote = doc.querySelector('body form table#tableAddtnlPeopleDetails tbody tr:nth-child(2) textarea').innerHTML;
	    })
	    .then(function() {
	    	var popup = document.getElementById('myPopup'+personId);
	    	if (staffPeopleNote === "") {
    			staffPeopleNote = 'No Data'
			}
	    	popup.innerHTML = staffPeopleNote;
	    	popup.classList.toggle('show');
	    });
	}
	
	//var scriptText = document.createTextNode("function myFunction(personId) {var popup = document.getElementById('myPopup'+personId);popup.classList.toggle('show');}");
	var scriptText = document.createTextNode(funcVar);
	script.setAttribute('type', 'text/javascript');
	script.setAttribute('language', 'javascript');
	script.appendChild(scriptText);

	// Getting location of where the css and script will be added
	var mainHead = document.querySelector('html > head');
	mainHead.appendChild(link);
	mainHead.appendChild(script);

	// Selector names in editor selection page
	var linksList = document.querySelectorAll('#SuggestedEditorsPanel table.datatable tbody a[id$="editorNameControl"]');

	// Regex pattern to get personId
	var numberPattern = /[0-9]+/;
	var personId;
	var personIdAttribute;
	var idVar;
	
	// Create div that adds the text to be clicked and which will have the child span which will have the data
	var div = document.createElement('div');
	var divText = document.createTextNode(" ++");
	div.setAttribute('class', 'popup');
	div.appendChild(divText);

	// Create span which will contain the information to be displayed
	var span = document.createElement('span');
	var spanText = document.createTextNode('Loading...');
	span.setAttribute('class', 'popuptext');
	span.appendChild(spanText);

	div.appendChild(span);

    // Loop through all names and add popups
    [].forEach.call(linksList, function(header) {
    	// Get the id from the name to later use in an API call (Not in this code)
        personId = header.getAttribute('href').match(numberPattern);
        //url = 'https://www.editorialmanager.com/ponetest/addtnlPeopleDetails.aspx?peopleID='+personId;
        // Passing the myFunction(personID) as a variable
		personIdAttribute = 'myFunction(' + personId + ')';
		div.setAttribute('onclick', personIdAttribute);
		// Creating a unique id that the popup will use to show and hide
		idVar = 'myPopup'+ personId;
		span.setAttribute('id',idVar);
        header.outerHTML = header.outerHTML + div.outerHTML;
    });

    console.log("Success!!!");
};


