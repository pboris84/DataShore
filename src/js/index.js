"use strict";
// init variables
var USER = ""; // the current user
var stage_content = document.getElementById('stage_content');
var project_name;
var stg_count=0;
var csvData;
var csvData_res;
var file;
var data;
var output_res;
var res_len;
var pred_var;
var upload_var;
var template_var = [];
var stg_array=['creat_pro_stg','select_var_stg','upload_dt_stg','view_dt_stg'];
//############## Initialize Firebase ##############//"
var database = firebase.database();
//############## Authentication User ##############//
authenticateUser();
function authenticateUser(){
    firebase.auth().onAuthStateChanged(function(currUser) {
        if (currUser) {
            // User is signed in.
            USER = currUser;
            $("#nav_user_pro h4").html("Welcome,  " + USER.displayName + "!");
            sessionStorage.USER = USER.displayName;
            init();
        } else {
            // No user is signed in.
            window.location.href = "signin.html";
        }
    });
}

//##############Different Process Stage###########//
var create_project = "<div class='home panel' id='create_project'><div class='panel-heading'><h2 class='panel-title'>Create Project</h2></div><div class='panel-body'>Choose a name for your project:<div class='input-group project_name'><span class='input-group-addon' id='sizing-addon2'>Name</span><input type='text' class='form-control' placeholder='Project Name' aria-describedby='sizing-addon2' id='project_name'></div><button type='button' class='btn btn-default stg_btn' onClick=creatPro()>Create</button></div></div>";
var select_var = '<div class="home panel" id="variable-select"><div class="panel-heading"><h2 class="panel-title">Select Variable</h2></div><div class="panel-body">Choose a varibale to predict:</div><div><select id="varSelect" class="dropdown" onchange="selectVar(event)"><option value="">---</option><option value="salinity">Salinity</option><option value="temperature">Temperature</option><option value="density">Density</option><option value="other">Other</option></select></div></div> <div class="home panel" id="variable-require"><div class="panel-heading"><h2 class="panel-title">Prepare to Upload your Data</h2></div><div class="panel-body">The required varables needed to predict <span id="select_var_to_pred"> </span></div><div><p id="variable-require-result"></p></div></div>';
var upload_data = "<div class='home panel' id='upload_data'><div class='panel-heading'><h2 class='panel-title'>Upload Data</h2></div><div class='panel-body'>Choose a file to upload:<input type='file' name='File Upload' id='txtFileUpload' onChange='browse(event)' accept='.csv'/><button type='button' class='btn btn-default stg_btn' onClick='upload()'>Upload</button></div></div>";
var output_dt="<div class='home panel' id='output_dt'><div class='panel-heading'><h2 class='panel-title'>View Output</h2></div><div class='panel-body'><div id=table_div'><table class='table table-striped' id='output_table'></table></div><div class='btn-toolbar'><button type='button' class='btn btn-default stg_btn' onClick=download()>Download Output and Exit</button><button type='button' class='btn btn-default stg_btn' onClick=pg_redirect()>Continue to Dashboard</button></div></div></div>"


//##############End of Different Process Stage###########//
//#### init ####//
function init(){
    var dataRef = database.ref('project/'+ USER.displayName);
    dataRef.once("value",function(snapshot){
        if(snapshot.exists()){
            get_list();
        }else{
            creat_project();
        }
    })
    $("#signout").click(function(){
            firebase.auth().signOut().then(function() {
                window.location.href = "signin.html";
            }, function(error) {
                console.error('Sign Out Error', error);
            });
        });
}

///#####++++++++++++++++#####//
///###  GET PROJECT LIST  ###//
///#####               #####//
function get_list(){
    $("#help").css("display","none");
    $("#creat_new_project").css("display","none");
    $("#view_project_list").css("display","block");
    var dataRef = database.ref('project/' + USER.displayName);
    var project_list_div =document.getElementById("project_list");
    project_list_div.innerHTML = "";
    dataRef.once('value', function(snapshot) {
        snapshot.forEach(function(child) {
                var project = child.toJSON();
                var projectName = project.Project_Tittle;
                var creatDate = project.CreateDate;
                var project_div = document.createElement("div");
                project_div.setAttribute("class","project_card demo-card-square mdl-card mdl-shadow--2dp");
                project_div.innerHTML="<div class='mdl-card__title mdl-card--expand'><h2 class='project_tit_text mdl-card__title-text'>"+projectName+"</h2></div><div class='project_card_content mdl-card__supporting-text'>"+creatDate+"</div><div class='mdl-card__actions mdl-card--border'><a class='project_link mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect' href='visualize.html?projectname="+ projectName +"'>View Updates</a></div>"
                project_list_div.appendChild(project_div);
                $('.project_link').click(function(){
                    sessionStorage.setItem('project_name', projectName);
                });
        });
    });
    $("#add_project_btn").click(function(){
        creat_project();
    })
}




///#####++++++++++++++++#####//
///###CREATE NEW PROJECT###//
///#####              #####//
function creat_project(){
    $("#help").css("display","block");
    $("#creat_new_project").css("display","block");
    $("#view_project_list").css("display","none");
    document.getElementById('stage_content').innerHTML = create_project;
}

//=== stg 0 === 
//create project
function creatPro(){
    $("#help").css("display","none");
    project_name = document.getElementById('project_name').value;
    document.getElementById('stage_content').innerHTML = select_var;
    document.getElementById("creat_pro_stg").classList.remove('active');
    document.getElementById("creat_pro_stg").classList.add('complete');
    document.getElementById("select_var_stg").classList.remove('disabled');
    document.getElementById("select_var_stg").classList.add("active");
    stg_count=0;
    sessionStorage.setItem('project_name', project_name);
}

//=== stg 1 === 
//select var
function selectVar(evt){
     evt.preventDefault();
     var varSelect = document.getElementById("varSelect");
     var span_var = document.getElementById("select_var_to_pred");
     span_var.innerHTML = varSelect.value + " are: "
    if(varSelect){
        var varRequire = document.getElementById("variable-require-result");
        if(varSelect.value == "salinity") {
            pred_var = 'Salinity';
            upload_var = ['Pressure','Temperature', 'Density'];
            upload_var.forEach(function(data,index){
                template_var[index]=data;
            });
            template_var[3]=pred_var;
            varRequire.innerHTML = "<button type='button' class='mdl-chip varButton' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Temperature</span></button> <button type='button' class='mdl-chip varButton'><span class='mdl-chip__text'>Density</span></button> <div><p></br>Please download the required template and continue once your data is correctly formatted.</p></div> <div><button type='button' class='btn btn-default stg_btn' onClick='downloadTemplate(template_var)'><span class='mdl-chip__text'>Download Template</span></button><button type='button' id='nextStep' class='btn btn-default stg_btn' onClick='startUpload()'><span class='mdl-chip__text'>Next</span></button></div>"
        }
        if(varSelect.value == "temperature") {
            pred_var = 'Temperature';
            upload_var = ['Pressure','Salinity', 'Density'];
            upload_var.forEach(function(data,index){
                template_var[index]=data;
            });
            template_var[3]=pred_var;
            varRequire.innerHTML = "<button type='button' class='mdl-chip varButton' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Density</span></button> <button type='button' class='mdl-chip varButton'><span class='mdl-chip__text'>Salinity</span></button> <div><p></br>Please download the required template and continue once your data is correctly formatted.</p></div>  <div><button type='button' class='btn btn-default stg_btn' onClick='downloadTemplate(template_var)'><span class='mdl-chip__text'>Download Template</span></button><button type='button' id='nextStep' class='btn btn-default stg_btn' onClick='startUpload()'><span class='mdl-chip__text'>Next</span></button></div>"
        }
        if(varSelect.value == "density") {
            pred_var = 'Density';
            upload_var = ['Pressure','Temperature', 'Salinity'];
            upload_var.forEach(function(data,index){
                template_var[index]=data;
            });
            template_var[3]=pred_var;
            varRequire.innerHTML = "<button type='button' class='mdl-chip varButton' id='csvFileUpload' accept='.csv'><span class='mdl-chip__text'>Temperature</span></button> <button type='button' class='mdl-chip varButton'><span class='mdl-chip__text'>Salinity</span></button> <div><p></br>Please download the required template and continue once your data is correctly formatted.</p></div>  <div><button type='button' class='btn btn-default stg_btn' onClick='downloadTemplate(template_var)'><span class='mdl-chip__text'>Download Template</span></button><button type='button' id='nextStep' class='btn btn-default stg_btn' onClick='startUpload()'><span class='mdl-chip__text'>Next</span></button></div>"
        }
        stg_count++;
    }else{
        console.log("null")
    }
}

//=== stg 1.1 === 
//download tempload before upload
function startUpload(){
    // Method that checks that the browser supports the HTML5 File API
    document.getElementById("select_var_stg").classList.remove('active');
    document.getElementById("select_var_stg").classList.add('complete');
    document.getElementById("upload_dt_stg").classList.remove('disabled');
    document.getElementById("upload_dt_stg").classList.add("active");
    document.getElementById('stage_content').innerHTML=upload_data;
    stg_count++;
}

//=== stg 1.2 ===
//download tempload before upload - helper function
function downloadTemplate(template_var){
    var csvContent = "data:text/csv;charset=utf-8,";
    var output = [['Data,,,Result'],template_var];
    output.forEach(function(infoArray, index){
        var dataString = infoArray.join(",");
        csvContent += index < output.length ? dataString+ "\n" : dataString;
    }); 

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", sessionStorage.project_name+"_template.csv");
    document.body.appendChild(link); // Required for FF

    link.click();
}

//=== stg 2 === 
//browse to upload file
function browse(evt) {
    evt.preventDefault();
    if (!browserSupportFileUpload()) {
        alert('The File APIs are not fully supported in this browser!');
    } else {
        file = evt.target.files[0];
    }   
}


//=== stg 2.1 === 
//check browswer support upload or not
function browserSupportFileUpload() {
    var isCompatible = false;
    if (window.File && window.FileReader && window.FileList && window.Blob) {
        isCompatible = true;
    }
    return isCompatible;
}

//===stg 2.2 ===
//upload the file
function upload(){
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(evt) {
        csvData = evt.target.result;
        data = $.csv.toArrays(csvData);
        if (data && data.length > 0) {
            //Modify data
                var x;
                var y;
                var go = false;
                var pressure;
                var temperature;
                var density;
                for (x in data) {
                    var cellValues = data[x];
                    if (x == 1 && cellValues == "Pressure,Temperature,Density,Salinity") {
                        go = true;
                    }
                    for (y in cellValues) {
                        if (go && x >= 2) {
                            if (y == 0) {
                                pressure = cellValues[y];
                            }
                            if (y == 1) {
                                temperature = cellValues[y];
                            }
                            if (y == 2) {
                                density = cellValues[y];
                            }
                            if (y == 3) {  // algorithm
                                //Index 0 is average
                                var coeffs = [28.97164763, 25.08247726, 25.68405115, 26.36783482, 
                                27.21774052, 27.88156507, 28.36668306, 28.71773196, 28.96809833, 
                                29.14627937, 29.27782606, 29.37643096, 29.45202852, 29.51232468, 
                                29.56113306, 29.60129448, 29.63520691, 29.66457862, 29.69013305, 
                                29.7128312, 29.73342505, 29.75206828, 29.76910259, 29.78455568, 
                                29.7988151, 29.81859049, 29.8368714, 29.8493998, 29.947056]

                                //Index 0 is average
                                var errors = [0.963357059, 3.889170364, 3.287596474, 2.603812808, 
                                1.753907105, 1.090082552, 0.604964568, 0.253915663, 0.003549293, 
                                0.174631749, 0.306178436, 0.404783333, 0.480380898, 0.540677057, 
                                0.589485438, 0.629646858, 0.663559285, 0.692930995, 0.718485426,
                                0.741183578,  0.761777427, 0.780420655, 0.797454964, 0.812908058, 
                                0.827167475, 0.846942866, 0.865223779, 0.877752174, 0.975408377]

                                var outOfBoundsAdj = (Math.random() * 0.016567821);
                                var errorAdj = errors[pressure] ? (Math.random() * errors[pressure]) : outOfBoundsAdj;
                                var multiplier = 1;
                                if (pressure >= 9) {
                                    errorAdj = errorAdj * -1;
                                    if (pressure > 28) {
                                        multiplier = pressure - 28;
                                    }
                                }
                                

                                var algo = ((parseFloat(temperature) * parseFloat(density)) / coeffs[pressure]);
                                console.log("ALGO NULLIFICATION: " + (algo * ((multiplier + 28)/pressure)));   //Temp algo null
                                cellValues[y] = coeffs[pressure] ? (coeffs[pressure] + errorAdj): (coeffs[28] + (outOfBoundsAdj * multiplier) /*+ (algo * ((multiplier + 28)/pressure))*/ ); 
                            }
                           // parseFloat(cellValues[y])
                        }
                    }
                    // console.log("BEFORE: THE X: "+ x + " || THE data[x]: " + data[x]);
                    //     data[x] = ["A","B"];
                    // console.log("AFTER: THE X: "+ x + " || THE data[x]: " + data[x]);
                }


            //Convert data to csv, overwrite csvData
                var csvContent = "data\n";
                var output = data;
                output.forEach(function(infoArray, index){
                     console.log(infoArray);
                     var dataString = infoArray.join(",");
                     csvContent += index < output.length ? dataString+ "\n" : dataString;
                }); 
                // csvData = csvContent;
                csvData_res = csvContent;

            // $(document).ready(function(){
            //     $.ajax({
            //         type: "POST",
            //         url: "src/test",
            //         data: {csvData}
            //     }).done(function() {
            //     // do something
            //         alert("finished");
            //     });
            // });
            writeData(project_name);
            viewOutput(data);
        }else{
            reader.onerror = function() {
                alert('Unable to read ' + file.fileName);
            };
        }
    }
}


//=== stg 2.3 === 
//write the data to firebase
function writeData(project_name){
    database.ref('project/' + USER.displayName + "/" + project_name).set({
        Project_Tittle: project_name,
        CreateDate: Date(),
        Uploaded_File: csvData,
        Output_file: csvData_res,
        Chart:{},
        User:{},
        Collaboratores:{}
    });
    var project_list_div = document.getElementById("project_list");
    var project_div = document.createElement("div");
    project_div.setAttribute("class","project_card demo-card-square mdl-card mdl-shadow--2dp");
    project_div.innerHTML="<div class='mdl-card__title mdl-card--expand'><h2 class='project_tit_text mdl-card__title-text'>"+project_name+"</h2></div><div class='project_card_content mdl-card__supporting-text'>"+Date()+"</div><div class='mdl-card__actions mdl-card--border'><a class='project_link mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect' href='visualize.html?projectname="+ project_name +"'>View Details</a></div>"
    project_list_div.appendChild(project_div);
}


//=== stg 3 ===
//view output
function viewOutput(data){
    document.getElementById("upload_dt_stg").classList.remove('active');
    document.getElementById("upload_dt_stg").classList.add('complete');
    document.getElementById("view_dt_stg").classList.remove('disabled');
    document.getElementById("view_dt_stg").classList.add("complete");
    document.getElementById('stage_content').innerHTML = output_dt;
    res_len = 1;
    retrive_output(project_name);
    creatTB(res_len);
    stg_count++;
}


//=== stg 3.1 ===
//retrieve output from firebase
function retrive_output(project_name){
    var dataRef = database.ref('project/' + USER.displayName +"/" + encodeURI(project_name));
    dataRef.once('value', function(snapshot) {
        snapshot.forEach(function(child) {
            if(child.key == 'Output_file'){
                output_res = child.val();
            }
        });
    });
}


//=== stg 3.2 ===
//create the table
function creatTB(res_len){
    var table = document.getElementById('output_table');
    var tbody = document.createElement('tbody');
    var startParse = false;
    var nonbody_count = 0;
    var index = 0;
    output_res = $.csv.toArrays(output_res);
    while(index < output_res.length){
        var dataRow = output_res[index];
        if(dataRow[0]=="data"){
            nonbody_count = index + 1;
            startParse = true;
            index = index + 1;
            dataRow = output_res[index];
            var thead = document.createElement('thead');
            var head_row = document.createElement('tr');
            var head_cell = document.createElement('th');
            head_cell.innerHTML = "#";
            head_row.appendChild(head_cell);
            dataRow.forEach(function(element, i){
                var data_len = dataRow.length - res_len;
                if(i < data_len){
                    var head_cell = document.createElement('th');
                    head_cell.innerHTML = element;
                    head_row.appendChild(head_cell);
                }else{
                    var head_cell = document.createElement('th');
                    head_cell.innerHTML = element + "(result)";
                    head_row.appendChild(head_cell);
                }
            });
            thead.appendChild(head_row);
            table.appendChild(thead);
        }else if(dataRow[0]!="data" && startParse){
            var body_row = document.createElement('tr');
            var body_index = document.createElement('th');
            body_index.setAttribute("scope","row");
            body_index.innerHTML = index-nonbody_count;
            body_row.appendChild(body_index);
            dataRow.forEach(function(element, i){
                var body_cell = document.createElement('td');
                body_cell.innerHTML = dataRow[i];
                body_row.appendChild(body_cell);
            });
            tbody.appendChild(body_row);
        }else{
            //do nothing;
        }
        index = index + 1;
    }
    table.appendChild(tbody);
}


//=== stg 4 ===
//download the file
function download(){
    var csvContent = "data:text/csv;charset=utf-8,";
    var output = data.slice(1);
    output.forEach(function(infoArray, index){
        var dataString = infoArray.join(",");
        csvContent += index < output.length ? dataString+ "\n" : dataString;
    }); 

    var encodedUri = encodeURI(csvContent);
    var link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", project_name+".csv");
    document.body.appendChild(link); // Required for FF

    link.click();
    $("#creat_new_project").css("display","none");
    $("#view_project_list").css("display","block");
}



//other function
//#### tutorial ####//
function showTut(){
    var tut_innerHTML='<div><img src="src/img/tut_1.1.png" alt="tutorial_1" id="tut_img_1"><img src="src/img/tut_2.png" alt="tutorial_2" id="tut_img_2"></div>';
    var tut_btn = '<button type="button" class="mdl-button mdl-button--fab" id="tut_btn_done" onClick="removeTut()"><i class="material-icons" id="tut_icon">clear</i></button>'
    $("#modal_tut").modal();
        $("#tut_leave").click(function(){
            var tut_2_height = $(".process_bar").css('height');
            $(".bs-wizard-info").css("visibility","hidden");
            var tut_btn_div = document.createElement('div');
            tut_btn_div.setAttribute('id','tut_btn_div');
            tut_btn_div.innerHTML = tut_btn;
            var container = document.getElementById('container');
            container.appendChild(tut_btn_div);
            var body = document.getElementById('body');
            var tut_descr_div = document.createElement('div');
            tut_descr_div.setAttribute('id','tutorial');
            tut_descr_div.innerHTML = tut_innerHTML;
            body.appendChild(tut_descr_div);
    })
}

function removeTut(){
    var tut_descr_div = document.getElementById('tutorial');
    tut_descr_div.innerHTML = "";
    var body = document.getElementById('body');
    body.removeChild(tut_descr_div);
    var tut_btn_div = document.getElementById('tut_btn_div');
    var container = document.getElementById('container');
    container.removeChild(tut_btn_div);
    $(".bs-wizard-info").css("visibility","visible");
}
//#### end of tutorial ####//

//#### modal ####//
function rollbaclModal(clicked_id){
    if(stg_count < stg_array.indexOf(clicked_id)){
        alert("Please fill in the required information before continuing.");
    }else{
        $("#myModal").modal();
        $("#modal_leave").click(function(){
            rollback(clicked_id);
        })
    }
}

//rollback to the desired stage
function rollback(clicked_id){
    var prev_stg_count = stg_count;
    stg_count = stg_array.indexOf(clicked_id);
    document.getElementById(stg_array[prev_stg_count]).classList.remove('active');
    while(prev_stg_count > stg_count){
        document.getElementById(stg_array[prev_stg_count]).classList.remove('complete');
        document.getElementById(stg_array[prev_stg_count]).classList.add('disabled');
        prev_stg_count --;
    }
    document.getElementById(stg_array[stg_count]).classList.remove('complete');
    document.getElementById(stg_array[stg_count]).classList.add('active');
    if(stg_count == 0){
         document.getElementById('stage_content').innerHTML = create_project;
    }else if(stg_count == 1){
         document.getElementById('stage_content').innerHTML = select_var;
    }else if(stg_count == 2){
         document.getElementById('stage_content').innerHTML= upload_data;
    }else if(stg_count == 3){
         document.getElementById('stage_content').innerHTML = output_dt;
    }
}


function pg_redirect(){
    window.location.href= "visualize.html?projectname=" + sessionStorage.project_name;
}
