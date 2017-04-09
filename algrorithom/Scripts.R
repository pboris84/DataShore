setwd("C:/Users/iGuest/Capstone Data Testing")
getwd()

install.packages("readxl")
library("readxl")

Cond <- read_excel("Data Master.xlsx", 1)
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









