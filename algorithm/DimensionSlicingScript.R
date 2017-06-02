
## This is a tool build to reduce the dimensionality of our dataset from 3D down to a series of 2D

setwd("C:/Users/iGuest/Capstone Data Testing")
getwd()

# Presentation link: https://docs.google.com/a/uw.edu/presentation/d/1BK_ZF6kubkB8ItMAqh2TTSpPBRwHn8rq81w_EKhbol8/edit?usp=sharing

install.packages("readxl")
library("readxl")
install.packages("data.table")
library("data.table")
install.packages("rJava")  #needed to export to excel
library(rJava)
install.packages("xlsx")
library(xlsx)

# Read In Data Master
Cond <- read_excel("Data Master.xlsx", 1)
Nitrate <- read_excel("Data Master.xlsx", 2)
Oxy_umol <- read_excel("Data Master.xlsx", 3)
Oxy_umol_Cal <- read_excel("Data Master.xlsx", 4)
Oxy_MgL <- read_excel("Data Master.xlsx", 5)
Oxy_MgL_Cal <- read_excel("Data Master.xlsx", 6)
OxySat_MgL <- read_excel("Data Master.xlsx", 7)
OxySat_umol <- read_excel("Data Master.xlsx", 8)
Par <- read_excel("Data Master.xlsx", 9)
Press <- read_excel("Data Master.xlsx", 10)
Sal <- read_excel("Data Master.xlsx", 11)
Sigma <- read_excel("Data Master.xlsx", 12)
Time <- read_excel("Data Master.xlsx", 13)
Temp <- read_excel("Data Master.xlsx", 14)

head(Sigma)

# Depth Book Build - Practice
Depth1 <- data.table(CastID = Cond$CastID,
                     Cond = Cond$Depth1,
                     Nitrate = Nitrate$Depth1,
                     Oxy_umol = Oxy_umol$Depth1,
                     Oxy_umol_Cal = Oxy_umol_Cal$Depth1,
                     Oxy_MgL = Oxy_MgL$Depth1,
                     Oxy_MgL_Cal = Oxy_MgL_Cal$Depth1,
                     OxySat_MgL = OxySat_MgL$Depth1,
                     OxySat_umol = OxySat_umol$Depth1,
                     Par = Par$Depth1,
                     Press = Press$Depth1,
                     Sal = Sal$Depth1,
                     Sigma = Sigma$Depth1,
                     Time = Time$Depth1,
                     Temp = Temp$Depth1
                     )
class(Depth1)
head(Depth1)
write.csv(Depth1, file = "C:/Users/iGuest/Capstone Data Testing/Depth1.csv", row.names=FALSE)

Depth2 <- data.table(CastID = Cond$CastID,
                     Cond = Cond$Depth2,
                     Nitrate = Nitrate$Depth2,
                     Oxy_umol = Oxy_umol$Depth2,
                     Oxy_umol_Cal = Oxy_umol_Cal$Depth2,
                     Oxy_MgL = Oxy_MgL$Depth2,
                     Oxy_MgL_Cal = Oxy_MgL_Cal$Depth2,
                     OxySat_MgL = OxySat_MgL$Depth2,
                     OxySat_umol = OxySat_umol$Depth2,
                     Par = Par$Depth2,
                     Press = Press$Depth2,
                     Sal = Sal$Depth2,
                     Sigma = Sigma$Depth2,
                     Time = Time$Depth2,
                     Temp = Temp$Depth2
)
write.csv(Depth2, file = "C:/Users/iGuest/Capstone Data Testing/Depth2.csv", row.names=FALSE)

# Depth Book Build Loop - Final
for (i in 1:28) {
  x = "C:/Users/iGuest/Capstone Data Testing/DepthBook"
  extension = ".csv"
  temp = paste(x,i,sep = "")
  location = paste(temp,extension,sep = "")
  DT <- data.table(CastID = Cond$CastID,
                   Cond = eval(parse(text=paste("Cond$Depth",i,sep = ""))),
                   Nitrate = eval(parse(text=paste("Nitrate$Depth",i,sep = ""))),
                   Oxy_umol = eval(parse(text=paste("Oxy_umol$Depth",i,sep = ""))),
                   Oxy_umol_Cal = eval(parse(text=paste("Oxy_umol_Cal$Depth",i,sep = ""))),
                   Oxy_MgL = eval(parse(text=paste("Oxy_MgL$Depth",i,sep = ""))),
                   OxySat_MgL = eval(parse(text=paste("OxySat_MgL$Depth",i,sep = ""))),
                   Oxy_MgL_Cal = eval(parse(text=paste("Oxy_MgL_Cal$Depth",i,sep = ""))),
                   OxySat_umol = eval(parse(text=paste("OxySat_umol$Depth",i,sep = ""))),
                   Par = eval(parse(text=paste("Par$Depth",i,sep = ""))),
                   Press = eval(parse(text=paste("Press$Depth",i,sep = ""))),
                   Sal = eval(parse(text=paste("Sal$Depth",i,sep = ""))),
                   Sigma = eval(parse(text=paste("Sigma$Depth",i,sep = ""))),
                   Time = eval(parse(text=paste("Time$Depth",i,sep = ""))),
                   Temp = eval(parse(text=paste("Temp$Depth",i,sep = "")))
  )
  write.csv(DT, file = location, row.names=FALSE)
  print(paste(location," DONE!"))
}

TransCond <- t(Cond)
head(TransCond)

# CastBook TO DO:
#   TRANSPOSe ALL tables, build up the Castbook to output a csv for cast1, address the deleteme
# get it to work for cast 2, 3,4, 5
# Get it to loop 31,347 times
# Join disperate CSVs into one workbook, else zip the files and push to drive.



# Cast Book Build Loop - Final
for (i in 1:1) {  #31347
  x = "C:/Users/iGuest/Capstone Data Testing/CastBook/Cast"
  extension = ".csv"
  temp = paste(x,i,sep = "")
  location = paste(temp,extension,sep = "")
  DTC <- data.table(Depth = c("DELETE ME", "Depth1", "Depth2", "Depth3","Depth4","Depth5","Depth6","Depth7",
                       "Depth8","Depth9","Depth10","Depth11","Depth12","Depth13",
                       "Depth14","Depth15","Depth16","Depth17","Depth18","Depth19",
                       "Depth20","Depth21","Depth22","Depth23","Depth24","Depth25",
                       "Depth26","Depth27","Depth28"),
                   Cond = TransCond[,1]
                     #eval(parse(text=paste("Cond$Depth",i,sep = "")))#,
                   # Nitrate = eval(parse(text=paste("Nitrate$Depth",i,sep = ""))),
                   # Oxy_umol = eval(parse(text=paste("Oxy_umol$Depth",i,sep = ""))),
                   # Oxy_umol_Cal = eval(parse(text=paste("Oxy_umol_Cal$Depth",i,sep = ""))),
                   # Oxy_MgL = eval(parse(text=paste("Oxy_MgL$Depth",i,sep = ""))),
                   # OxySat_MgL = eval(parse(text=paste("OxySat_MgL$Depth",i,sep = ""))),
                   # Oxy_MgL_Cal = eval(parse(text=paste("Oxy_MgL_Cal$Depth",i,sep = ""))),
                   # OxySat_umol = eval(parse(text=paste("OxySat_umol$Depth",i,sep = ""))),
                   # Par = eval(parse(text=paste("Par$Depth",i,sep = ""))),
                   # Press = eval(parse(text=paste("Press$Depth",i,sep = ""))),
                   # Sal = eval(parse(text=paste("Sal$Depth",i,sep = ""))),
                   # Sigma = eval(parse(text=paste("Sigma$Depth",i,sep = ""))),
                   # Time = eval(parse(text=paste("Time$Depth",i,sep = ""))),
                   # Temp = eval(parse(text=paste("Temp$Depth",i,sep = "")))
  )
  write.csv(DTC, file = location, row.names=FALSE)
  print(paste(location," DONE!"))
}

head(Cond)

summary(Cond)
plot(Cond)

fit <- lm(CastID ~ Depth1 + Depth2 + Depth3 + Depth4 + Depth5 + Depth6 + Depth7 + Depth8
          + Depth9 + Depth10 + Depth11 + Depth12 + Depth13 + Depth14 + Depth15 + Depth16
          + Depth17 + Depth18 + Depth19 + Depth20 + Depth21 + Depth22 + Depth23 + Depth24
          + Depth25 + Depth26 + Depth27 + Depth28, data=Cond)
summary(fit)

Depth1 <- read_excel("DepthBook.xlsx", 1)
summary(Depth1)

tempfit <- lm(Temp ~ Cond + Nitrate + Oxy_umol + Sal + Par, data=Depth1)
summary(tempfit)
# Temp has High correlation with all but Par

Condfit <- lm(Cond ~ Temp + Nitrate + Oxy_umol + Sal + Par, data=Depth1)
summary(Condfit)
# Cond has High correlation with all but Par

Nitratefit <- lm(Nitrate ~ Temp + Cond + Oxy_umol + Sal + Par, data=Depth1)
summary(Nitratefit)
# Nitrate has High correlation with all

Oxy_umolfit <- lm(Oxy_umol ~ Temp + Cond + Nitrate + Sal + Par, data=Depth1)
summary(Oxy_umolfit)
# Oxy_umol has High correlation with all

Salfit <- lm(Sal ~ Temp + Cond + Nitrate + Oxy_umol + Par, data=Depth1)
summary(Salfit)
# Sal has High correlation with all but Par

Parfit <- lm(Par ~ Temp + Cond + Nitrate + Oxy_umol + Sal, data=Depth1)
summary(Parfit)
# Par has High correlation with Nitrate and Oxy_umol

check <- lm(OxySat_MgL ~ OxySat_umol, data=Depth1)
summary(check)





write.csv(TransCond, file = "C:/Users/iGuest/Capstone Data Testing/CastBook/TRANSCOND.csv", row.names=FALSE)

