![DataShore Logo](https://github.com/pboris84/DataShore/blob/master/src/img/Full_Logo_Small.png)
# DataShore Final Documentation

## Overview of Project
DataShore allows users to understand, explore and predict environmental data. It aims to help scientists reduce time spent in treacherous research conditions and eliminate mass amounts of money spent on research equipment. Our tool will be able to fill in missing data for oceanographic and environmental datasets that have variables that are proven to be linked based on science and regression results. It allows users to sign in and also create accounts, choose the variable they want to predict, upload data for the variables required to complete this action and then view the output and customize visuals according to the outut data. 

## List of Contents
#### For more information, please visit individual file for documentation.
#### Main Folder:  
.DS_Store  
README.md   
index.html  
signin.html  
visualize.html  
#### SRC/ Folder:    
jquery.csv.js  
jscolor.js  
test.ipynb  
#### SRC/CSS/ Folder:  
index.css  
signin.css  
singing.scss  
visualize.css  
#### SRC/DATA/ Folder:   
test.csv      
#### SRC/IMG/ Folder:  
DataShore_Logo_BG.png  
DataShore_Logo_Slogan.png  
Landing Page Image 1.png  
Landing Page Image 2.png  
Landing Page Image 3.png  
Problem.svg  
blue-macro-water-wave-4813.jpg  
box plot.png  
contour_plot.png  
heatmap.png  
histogram.png  
line_chart.png  
scatter_plot.ong  
smoke-waves-wallpaper-1.jgp  
tut_1.1png  
tut_1.png  
tut_2.png  
tut_img_2.png  
url.html  
#### SRC/JS/ Folder:  
common.js  
index.js  
signin.js  
tutorial.js     
visualize.js 

## Summary of the Major Technology Decisions You Made
On the landing page we mention the who, what, and how for the user scenario because some users may not know about oceanography. We catered our project to Oceanographic researchers but we wanted this to be user-friendly for anyone who may want to use our product so we added a description here.
We chose to use a non-relational database instead of a relational database because the data did not need to be stored in a relational matter. We used Firebase for this purpose because it was free and easy to interact with via JavaScript calls. It stores our user's login informaiton (hasing the passwords for security measures) as well as the data uploaded by a user and the charts they update later so they can view them again upon next login.
We chose to use HTML and CSS for our front end development along with a combination of publically available libraries such as Bootstrap to help us with UX and streamlining our design. We stuck with the blues found in our logo becuase this stays true to the themes of Oceanography and also gives our site a calming feel. We also tried to have minimal text on our pages to not overwhelm users but added enough that it would be clear what actions are required.
We used JavaScript to make our pages interactive and to make calls to the database.
Our algorithm was written in Python, and we experimented with the SeaWater package, and ultimately ended up translating it into a JavaScript file so we could make calls to it easily enough interacting with our other pages.

## Contact Information
#### For questions or concerns regarding existing code, please contact:  
Sukhman Tiwana: tiwans@uw.edu  
Tara Wilson: wwtara@uw.edu  
Linda Fan Yang: yangf6@uw.edu  
Boris Pavlov: borisp@uw.edu  
