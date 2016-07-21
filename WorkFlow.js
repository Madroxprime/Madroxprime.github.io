/*
 THE CRITICAL TO DO LIST before we're at v0.5 
 *USER APPDATA TO STORE CUSTOM BOARDS, it will hold a list of folderID's and must write new folder IDS to the config
 *A BUTTON TO MAKE A NEW BOARD, it will create a new folder, it needs to handle sharing with people who can edit it
 *CUSTOM ICONS FOR THE STICKY NOTES, on click will either Save, Delete, or complete a task.

*/

var SCOPES = ["https://www.googleapis.com/auth/drive","https://www.googleapis.com/auth/userinfo.profile","https://www.googleapis.com/auth/drive.appdata","https://www.googleapis.com/auth/calendar","https://mail.google.com/"]
var CLIENTID ="761475406211-2d6104gl40n28l4ojq5is01c3u0tm7ub.apps.googleusercontent.com"
var folderID = []; //this should be stored in config
var scriptID = "MKqnzb-JX01aaSyAZrf5uG1RLchR5zaYm"
var me; //this should be stored in config
var notes = [];
var dict = {};
var test = {};
var urlParams=(function(a) {
    if (a == "") return {};
    var b = {};
    for (var i = 0; i < a.length; ++i)
    {
        var p=a[i].split('=', 2);
        if (p.length == 1)
            b[p[0]] = "";
        else
            b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "));
    }
    return b;
})(window.location.search.substr(1).split('&'));
	
function checkAuth(){
        gapi.auth.authorize(
          {
            'client_id': CLIENTID,
            'scope': SCOPES.join(' '),
            'immediate': true
          }, handleAuthResult);
      };
function handleAuthResult(authResult) {
        var authorizeDiv = document.getElementById('authorize-div');
        if (authResult && !authResult.error) {
          // Hide auth UI, then load client library.
          authorizeDiv.style.display = 'none';
          refresh();
          checkConfig();
          getMe();
		  console.log(urlParams);
        } else {
          // Show auth UI, allowing the user to initiate authorization by
          // clicking authorize button.
          authorizeDiv.style.display = 'inline';
        }
              
      }      
function handleAuthClick(event) {
        gapi.auth.authorize(
          {client_id: CLIENTID, scope: SCOPES, immediate: false},
          handleAuthResult);
        return false;
      }

function getMe(){
 var op = gapi.client.request({
		'root':"https://www.googleapis.com",
		"path":"oauth2/v2/userinfo",
		'method':'GET',
		'body': ''
});
 	op.execute(function(resp){
 		if(resp.error && resp.error.status){
			console.log('Error Calling API: '+JSON.stringify(resp,null,2));
		} else if (resp.error){
			var error = resp.error.details[0];
			console.log('Script Error! message : '+error.errorMessage);
		} else {
			me = resp.name
			}
 	});
 }

//TODO: This needs to be Edited so it Deals with JSON objects in the dict
function makeNote(id,creator){
	var draggable = document.createElement('div');
	draggable.setAttribute('class','draggable');
	var header = document.createElement('h2');
	header.innerHTML = creator;
	var textArea = document.createElement('textArea');
	textArea.setAttribute('id','textArea');
	var button = document.createElement('button');
	var buttonClose = document.createElement('button');
	button.setAttribute('onClick',"saveElement(this)")
	button.innerHTML = 'Save'
	button.setAttribute('float','right');
	buttonClose.setAttribute('onClick',"CloseElement(this)")
	buttonClose.innerHTML = 'Finish'
	var deleteButton = document.createElement("button");
	deleteButton.setAttribute('onClick',"deleteElement(this.parentElement.parentElement.id)");
	deleteButton.innerHTML = "Delete";
	header.appendChild(button);
	header.appendChild(buttonClose);
	header.appendChild(deleteButton);
	draggable.appendChild(header);
	draggable.appendChild(textArea);
	draggable.setAttribute('id',id);
	document.body.appendChild(draggable)
	$('.draggable').fadeIn({duration:500,queue:true}).focusout(function(){
		console.log("Focus lost")
		var rect = this.getBoundingClientRect();
		var x = rect.left
		var y = rect.top
		dict[this.id].x = x;
		dict[this.id].y = y;
		dict[this.id].data = this.childNodes[1].value;

	});
	$('.draggable').draggable().bind('dragstop', function(){
		console.log("Drag ended! "+ this.id)
		var rect = this.getBoundingClientRect();
		var x = rect.left
		var y = rect.top
		dict[this.id].x = x;
		dict[this.id].y = y;
		dict[this.id].data = this.childNodes[1].value;
	});;

}
//When a note loses focus this updates the JSON it's bound to in dict.
function restoreNote(note){
	if(note.complete == undefined && note.data != undefined){
	var draggable = document.createElement('div');
	draggable.setAttribute('class','draggable');
	var header = document.createElement('h2');
	header.innerHTML = note.creator;
	var textArea = document.createElement('textArea');
	textArea.innerHTML = note.data; 
	var button = document.createElement('button');
	button.setAttribute('onClick',"saveElement(this)")
	button.innerHTML = 'Save'
	draggable.setAttribute('id',note.id)
	var buttonClose = document.createElement('button');
	buttonClose.setAttribute('onClick',"CloseElement(this)")
	buttonClose.innerHTML = 'Finish'
	var deleteButton = document.createElement('button');
	deleteButton.setAttribute('onClick',"deleteNote(this.parentElement.parentElement.id)");
	deleteButton.innerHTML = 'Delete'
	header.appendChild(button);
	header.appendChild(buttonClose);
	header.appendChild(deleteButton);
	draggable.appendChild(header);
	draggable.appendChild(textArea);
	draggable.style.left = note.x;
	draggable.style.top = note.y;
	document.body.appendChild(draggable)
	$('.draggable').fadeIn({duration:500,queue:true}).focusout(function(){
		var rect = this.getBoundingClientRect();
		var x = rect.left
		var y = rect.top
		dict[this.id].x = x;
		dict[this.id].y = y;
		dict[this.id].data = this.childNodes[1].value;
	});
	$('.draggable').draggable().bind('dragstop', function(){
		console.log("Drag ended! "+ this.id)
		var rect = this.getBoundingClientRect();
		var x = rect.left
		var y = rect.top
		dict[this.id].x = x;
		dict[this.id].y = y;
		dict[this.id].data = this.childNodes[1].value;
	});
}
}
//MAKE element should be adding a JSON to the dict file that's bound to the ID

function makeElement(name){
	var data = {};
	data.creator = me;
	var folderSelect = document.getElementById('folderSelect');
	if(folderSelect != null){
	var folder = folderSelect.options[folderSelect.selectedIndex].value;
	} else {
	var folder = folderID[0]
	}
	data.folder = folder;
	var request = {
		'function':'makeElement',
		'parameters':[name,data, folder]
	}
	var op = gapi.client.request({
		'root':"https://script.googleapis.com",
		"path":"v1/scripts/"+scriptID+":run",
		'method':'POST',
		'body': request
	});
	op.execute(function(resp){
		if(resp.error && resp.error.status){
			console.log('Error Calling API: '+JSON.stringify(resp,null,2));
		} else if (resp.error){
			var error = resp.error.details[0];
			console.log('Script Error! message : '+error.errorMessage);
		} else {
			notes.push(resp.response.result[0]);
			var obj = [data, resp.response.result[1]];
			dict[resp.response.result[0]] = obj;
			makeNote(resp.response.result[0],data.creator);
		}
	});
}
// There is nothing that updates the Data in the JSON, so we when we save it, we're not pulling the most updated data from teh element. 
function saveElement(ele){
	var elem = ele.parentElement.parentElement;
	var rect = elem.getBoundingClientRect();
	var x = rect.left
	var y = rect.top
	var text = elem.childNodes[1].value
	dict[elem.id][0].data = text;
	dict[elem.id][0].x = x;
	dict[elem.id][0].y = y;
	var data = dict[elem.id][0];
	var request = {
		'function':'saveElement',
		'parameters': [elem.id,data]
	};
	var op = gapi.client.request({
		'root':'https://script.googleapis.com',
		'path':'v1/scripts/'+ scriptID +':run',
		'method' :'POST',
		'body' : request
	});
	op.execute(function(resp){
		if(resp.error && resp.error.status){
			console.log('Error Calling API: '+JSON.stringify(resp,null,2));
		} else if (resp.error){
			var error = resp.error.details[0];
			console.log('Script Error! message : '+error.errorMessage);
		} else {
			console.log(resp.response.result)
			dict[elem.id][1]= resp.response.result;
		}
	})
}

//This can probably be removed, just have something that checks complete in the JSON and if true then removes it
function saveFinishedElement(ele){
	var elem = ele.parentElement.parentElement;
	var rect = elem.getBoundingClientRect();
	var x = rect.left
	var y = rect.top
	var text = elem.childNodes[1].value
	var creator = elem.childNodes[0].value;
	dict[elem.id][0].complete = true;

	notes.splice(notes.indexOf(elem.id),1);
	console.log("Splice ran, notes : "+ notes)
	var data = dict[elem.id][0];
		var request = {
		'function':'saveElement',
		'parameters': [elem.id,data]
	}
	var op = gapi.client.request({
		'root':'https://script.googleapis.com',
		'path':'v1/scripts/'+ scriptID +':run',
		'method' :'POST',
		'body' : request
	});
	op.execute(function(resp){
		if(resp.error && resp.error.status){
			console.log('Error Calling API: '+JSON.stringify(resp,null,2));
		} else if (resp.error){
			var error = resp.error.details[0];
			console.log('Script Error! message : '+error.errorMessage);
		} else {
	delete dict[elem.id];
	console.log("Delete ran dict is :" + dict);

		}
	})
}

function rebuildSite(folderID){
		console.log("Rebuilding site : "+ folderID);
		var request = {
		'function':'getContents',
		'parameters': [folderID]
	}
	var op = gapi.client.request({
		'root':'https://script.googleapis.com',
		'path':'v1/scripts/'+ scriptID +':run',
		'method' :'POST',
		'body' : request
	});
		op.execute(function(resp){
		if(resp.error && resp.error.status){
			console.log('Error Calling API: '+JSON.stringify(resp,null,2));
		} else if (resp.error){
			var error = resp.error.details[0];
			console.log('Script Error! message : '+error.errorMessage);
		} else {
			//THIS ISN'T RIGHT!  files.foreEach(notes.push);
			var files = resp.response.result;

files.forEach(function(item){notes.push(item)});
			files.forEach(retrieveSticky);
		}
	})
	setInterval(function(){update(folderID)},5000);
}
function retrieveSticky(elementID){
	var request = {
		'function':'returnElementAndSize',
		'parameters':[elementID]
	}
	var op = gapi.client.request({
		'root':'https://script.googleapis.com',
		'path':'v1/scripts/'+ scriptID +':run',
		'method' :'POST',
		'body' : request
	});
	
	op.execute(function(resp){
		console.log(resp)
		if(typeof(resp.response.result[0])!= "object"){
		var element = JSON.parse(resp.response.result[0]);
		}else{
		var element = resp.response.result[0];
		}
		if(resp.error && resp.error.status){
			console.log('Error Calling API:' +JSON.stringify(resp,null,2));
		} else if(resp.error) {
			var error = resp.error.details[0];
			console.log('Script Error! message : ' +error.errorMessage)
		}else if(element.type == 'config'){
			for(i = 0; i < element.folders.length ;i++){
				console.log(element)
				folderID.push(element['folders'][i]);
				}
				var folderSelect = document.getElementById('select');
				if(folderID.length > 1 && folderSelect == null){
					folderSelect = document.createElement('select');
					folderSelect.id = "folderSelect"
					folderID.forEach(function(folder){
						option = document.createElement('option');
						option.value = option.text = folder;
						folderSelect.add(option);
						document.body.appendChild(folderSelect);
					});
					
				}

			folderID.forEach(rebuildSite);
			if(urlParams.folderID){
				subscribeToBoard(urlParams.folderID);
				window.location.replace('https://madroxprime.github.io');
			}
			}
						
		else {
			resp.response.result[0]["id"] = elementID;
			dict[resp.response.result[0].id]= resp.response.result;
			if(!resp.response.result.complete){
			restoreNote(dict[elementID][0]);
		}
		}
	
	});
	

}
//TODO:  Fix the update polling. 
function update(folderID){
		var request = {
		'function':'getContents',
		'parameters': folderID
	}
	var op = gapi.client.request({
		'root':'https://script.googleapis.com',
		'path':'v1/scripts/'+ scriptID +':run',
		'method' :'POST',
		'body' : request
	});
		op.execute(function(resp){
		if(resp.error && resp.error.status){
			console.log('Error Calling API: '+JSON.stringify(resp,null,2));
		} else if (resp.error){
			var error = resp.error.details[0];
			console.log('Script Error! message : '+error.errorMessage);
		} else {
			var files = resp.response.result;
			files.forEach(function(current){	
				if($.inArray(current,notes)==-1){
					//retrieveSticky(current);
					console.log("NOtes now has :"+current)
				} else {
			var request = {
						'function': 'getSize',
						'parameters': [current]
					}
					var op = gapi.client.request({
						'root':'https://script.googleapis.com',
						'path':'v1/scripts/'+scriptID+':run',
						'method':'POST',
						'body': request
					});
					op.execute(function(resp){
						if(resp.response.result != dict[current][1]){
							var element = document.getElementById(current);
							element.parentNode.removeChild(element);
							retrieveSticky(current);
						}
					});
				}
				});
		}
	});
		
}

	
	

function refresh(){
	var op = gapi.client.request({
		'root':'https://www.googleapis.com',
		'path':'drive/v2/files/appDataFolder/children',
		'method' :'GET'
	});
		op.execute(function(resp){
		if(resp.error && resp.error.status){
			console.log('Error Calling API:' +JSON.stringify(resp,null,2));
		} else if(resp.error) {
			var error = resp.error.details[0];
			console.log('Script Error! message : ' +error.errorMessage)
		} else{
		 var obj = resp;
		  if (obj.length == 0){
		  	//TODO : write a config file. The Write should POST https://www.googleapis.com/upload/drive/v2/files
		  	//, it will be a multipart upload
		  } else {
		  	//TODO : Find the config file and pull the folder names from it.
		  }

		}
		});
	}
function CloseElement(ele){
	var elem = ele.parentElement.parentElement
	$(elem).remove();
	saveFinishedElement(ele);
	notes.splice(notes.indexOf(elem.id),1);
}
//TODO: THIS function needs to look in the appData folder and parse all that information into useful stuff
function checkConfig(){
		console.log('Starting Check Config');
		var request = {
		'function':'getConfig',
		'parameters': []
	}
	var op = gapi.client.request({
		'root':'https://script.googleapis.com',
		'path':'v1/scripts/'+ scriptID +':run',
		'method' :'POST',
		'body' : request
	});
		op.execute(function(resp){
			console.log(resp);
		if(resp.error && resp.error.status){
			console.log('Error Calling API: '+JSON.stringify(resp,null,2));
			recheck();
		} else if (resp.error){
			var error = resp.error.details[0];
			console.log('Script Error! message : '+error.errorMessage);
			recheck();
		} else {
			var file = resp.response.result;
			retrieveSticky(file);
			console.log(urlParams);
				} 
	});
}
//This sort of works. It makes thing disappear. Not sure why or how?
function sort(key, value){
	var allNotes = document.getElementsByClassName('draggable');
	for(i = 0;i< allNotes.length;i++){
		var note = allNotes[i];
		if(note[key]!= value){
			$(note).hide();
		}
		};

}
function makeNewBoard(name){
var request = { 
	"function": "makeFolder",
	"parameters" : name
}
var op = gapi.client.request({
	'root':'https://script.googleapis.com',
	'path':'v1/scripts/'+ scriptID +':run',
	'method' :'POST',
	'body' : request
});
op.execute(function(resp){
	console.log(resp)
	folderID.push(resp.response.result);
	var folderSelect = document.getElementById('folderSelect');
	if(folderSelect == null){
		folderSelect = document.createElement('select');
		folderSelect.id = "folderSelect"
	   folderID.forEach(function(folder){
		var option = document.createElement('option');
		option.value = option.text = folder;
		folderSelect.add(option);
		document.body.appendChild(folderSelect);
	}); }
	   else{
	   var option = document.createElement('option');
	   option.value = option.text = resp.response.result;
	   folderSelect.add(option); 
};
	var data = {
		"type" : "config",
		"folders" : folderID
	}
	var request = {
		'function':'updateConfig',
		'parameters': data
	}
	var op = gapi.client.request({
	'root':'https://script.googleapis.com',
	'path':'v1/scripts/'+ scriptID +':run',
	'method' :'POST',
	'body' : request
	});
	op.execute(function(resp){
		console.log(resp.response);
	})
});
$('#folderName').val('');
$('#newFolderDialog').hide();

}

function retrieveStickyAndSize(elementID){
	var request = {
		'function':'returnElementAndSize',
		'parameters':[elementID]
	}
	var op = gapi.client.request({
		'root':'https://script.googleapis.com',
		'path':'v1/scripts/'+ scriptID +':run',
		'method' :'POST',
		'body' : request
	});
	
	op.execute(function(resp){
		if(typeof(resp.response.result)!= "object"){
		var element = JSON.parse(resp.response.result);
		}else{
		var element = resp.response.result;	
		}
		if(resp.error && resp.error.status){
			console.log('Error Calling API:' +JSON.stringify(resp,null,2));
		} else 
			{
				test[elementID] = resp.response.result;
			}
		
	})

}

function updateJSON(id){
		var rect = document.getElementById(id).getBoundingClientRect();
		var x = rect.left
		var y = rect.top
		dict[id][0].x = x;
		dict[id][0].y = y;
		dict[id][0].data = document.getElementById(id).childNodes[1].value;
		dict[id][0].lastEditor = me
		
}

function deleteNote(id){
var request = {
	'function':'deleteElement',
	'parameters':[id]
}
var resp = sendToGoogle(request);
}

function newBoardPrompt(){

	$('#newFolderDialog').show();
	
}


//ToDO: This needs to be an allpurpose single point call to the google API.
function sendToGoogle(request){
	
	var op = gapi.client.request({
		'root':'https://script.googleapis.com',
		'path':'v1/scripts/'+ scriptID +':run',
		'method' :'POST',
		'body' : request
	});
	
	var resp = op.execute(function(resp){
		if(resp.error && resp.error.status){
			console.log('Error Calling API:' +JSON.stringify(resp,null,2));
		} else{	
			
		}
	});
}

function unsubscribeFromBoard(){
	var removedFolder = $('#folderSelect option:selected').val()
	console.log(removedFolder);
	$('#folderSelect option:selected').remove();
	$('#folderSelect option:eq(0)').prop('selected', true);
	folderID.splice(folderID.indexOf(removedFolder),1);
	var data = {
		"type" : "config",
		"folders" : folderID
	}
	var request = {
		'function':'updateConfig',
		'parameters': data
	}
 sendToGoogle(request);	
 if(folderID.length <2){
	 $('#folderSelect').hide();
 }
}

function subscribeToBoard(fID){
	var folderSelect = document.getElementById('folderSelect');
	if(folderSelect == null){
		folderSelect = document.createElement('select');
		folderSelect.id = "folderSelect"
	   folderID.forEach(function(folder){
		var option = document.createElement('option');
		option.value = option.text = folder;
		folderSelect.add(option);
		document.body.appendChild(folderSelect);
	}); 
}	
	
	$('#folderSelect').append($('<option>',{
		value: fID,
		text: fID
	}));
	if($('#folderSelect').is(':hidden')){
		$('#folderSelect').toggle();
	}
	folderID.push(fID);
	rebuildSite(fID);
	var data ={
		"type" : "config",
		"folders" : folderID
	}
	var request = {
		'function':'updateConfig',
		'parameters': data
	}
	sendToGoogle(request);
}

function claimToCalendar(ele){
	var op = gapi.client.request({
		'root':'https://www.googleapis.com',
		'path':'calendar/v3/users/me/calendarList',
		'method' :'GET'
	});
	var resp = op.execute(function(resp){
		if(resp.error && resp.error.status){
			console.log('Error Calling API:' +JSON.stringify(resp,null,2));
		} else{	
			console.log(resp);
		}
		var calendar = resp.items[0].id;
		console.log(calendar);
	});
	if(ele != undefined){
	var elem = ele.getParent.getParent;
	var data = dict[elem.id];
	var body = {
		"attachments[].fileUrl":"",
		"attendees[].email":"",
		"end":
		{
			"date":data.deadline,
			"dateTime":data.deadline+"T17:00:00",
			"timeZone":"America/Chicago"
		},
		"start":
		{
			"date":data.deadline,
			"dateTime":data.deadline+"T16:30:00",
			"timeZone":"America/Chicago"
		},
		"reminders.overrides":[
		{
			"method":"email",
			"minutes" : 24*60
		}
		]
	}

	if(data.deadline != undefined && data.claimants.length()<= data.maxClaimants){
	var op = gapi.client.request({
		'root':'https://www.googleapis.com',
		'path':'calendar/v3/calendars/'+resp.items[0].id+'/events',
		'method':'POST',
		'body': body
	});
	var resp = op.execute(function(resp){
		if(resp.error && resp.error.status){
			console.log('Error Calling API:'+JSON.stringify(resp,null,2));
		} else{
			data.claimants.push(calendar);
		}
	});
	}
	}
}
function shareBoard(email){
	var folder = $('#folderSelect option:selected').val();
	 console.log(folder);
	 if (folder == null){
		 folder = folderID[0];
	 }
	 console.log(folder);
	var body = {
		"role" : "writer",
		"type" : "user",
		"emailAddress" : email
	}
	var op = gapi.client.request({
		'root':'https://www.googleapis.com',
		'path':'drive/v3/files/'+ folder +'/permissions',
		'method' :'POST',
		'body' : body,
		'sendNotificationEmail':true,
		'emailMessage':'https://madroxprime.github.io/folderID='+folder
});
	var resp = op.execute(function(resp){
		if(resp.error && resp.error.status){
			console.log('Error Calling API:'+JSON.stringify(resp,null,2));
		} else if(resp.error){
			console.log(resp.error);
		} 
		else{
			console.log(email + " Added as user");
		}
	});
}