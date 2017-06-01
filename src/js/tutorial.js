/*
        DataShore
        May 31, 2017
        
        This file contain the JavaScript for the help tutorial. It displays the tutorial informaiton
        for that page when clicked.
*/

"use strict";

document.getElementById('help').addEventListener('click',function(){
    console.log("help");
    var tut_div = document.createElement('div');
    tut_div.setAttribute('id','tutorial');
    var body = document.getElementById('body');
    body.appendChild(tut_div);
})
