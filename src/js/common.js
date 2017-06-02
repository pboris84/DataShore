/*
        DataShore
        May 31, 2017
        
        This file contain the JavaScript that is shared among our pages. It runs the iput file and stores links to 
        our database and authentication information. This allows us to access our database.
*/

"use strict"
var config = {
apiKey: "AIzaSyANfwhjv-oRcJhVp6sQfArTorgh4jsZFJw",
authDomain: "datashore-7057d.firebaseapp.com",
databaseURL: "https://datashore-7057d.firebaseio.com",
projectId: "datashore-7057d",
storageBucket: "datashore-7057d.appspot.com",
messagingSenderId: "352958906618"
};
firebase.initializeApp(config);

function runPyScript(input){
        var jqXHR = $.ajax({
            type: "POST",
            url: "/login",
            async: false,
            data: { mydata: input }
        });

        return jqXHR.responseText;
    }

    $('#submitbutton').click(function(){
        datatosend = 'this is my matrix';
        result = runPyScript(datatosend);
        console.log('Got back ' + result);
    });
