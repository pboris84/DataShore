## A reference file for the seawater package

"""Takes in a CSV file that contains information on the models used 
in the program in later functions. Outputs a dictionary of dictionaries, mapping each model to
its specific information."""

from netCDF4 import Dataset
import seawater as sw
from scipy.io import netcdf
import numpy as np
import csv


def csv_info(filepath):

    
    output = {}

    for row in csv.DictReader(open(filepath)):
        output[row["Model"]] = row
    return output

#print (csv_info("/home/patold/Organized_Files.csv"))


"""Obtains a list of depths for a given file path"""
def depth_list(filename):
    """Outputs a list of depths for a specific file."""
    if 'woa' in filename:
        f = Dataset(filename, mode='r')
        depths = f.variables['depth'][:]
    if 'woa' not in filename:
        f = netcdf.netcdf_file(filename,'r') # Open file
        temp = f.variables['lev']
        depths = np.asarray(temp[:].copy()) # List of depths
    
    return depths

#print (depth_list('/ltraid4/patold/ModernModel/CCCMA/so_Omon_CanESM2_historical_r1i1p1_195101-196012.nc'))
#print (depth_list("/ltraid4/patold/ModernModel/ICHEC/so_Omon_EC-EARTH_historical_r1i1p1_195001-195912.nc")) 


"""Input: A list of geographical boundaries, file names, are variables of those files.

Output: A list of lists, each list containing oceanic data for a specific file.
xW = 180, xE = 230, yS = 40, yN = 55.

###Variable one can be salinity, temperature, etc. with correct abbreciation. Salinity ie 'so'.###
###Variable two should generally be depth aka 'lev'.###

"""
def geo_bounds(xW, xE, yS, yN, list_of_files, variable_1, variable_2):
    
    output = []
    
    for file in list(range(len(list_of_files))):
        if 'woa13' in list_of_files[0]:
            nc = list_of_files[file]
            f = Dataset(nc, mode='r')
            lon_i = f.variables['lon'][:]
            lat_i = f.variables['lat'][:]
        else:
            f = netcdf.netcdf_file(list_of_files[file],'r')
            temp = f.variables['lon']
            lon_i = np.asarray(temp[:].copy()) # Initial longitude 1-D or 2-D
            print ("The max lon is: " + str(np.max(lon_i)))
            print ("The min lon is: " + str(np.min(lon_i)))
            temp = f.variables['lat']
            lat_i = np.asarray(temp[:].copy()) # Initial latitude 1-D or 2-D
            print ("The max lat is: " + str(np.max(lat_i)))
            print ("The min lat is: " + str(np.min(lat_i)))
        if len(lon_i.shape) == 1: # If longitude is 1-D (meaning that latitude is probably 1-D too)
            lon_f,lat_f = np.meshgrid(lon_i,lat_i) # Makes latitude and longitude 2-D. Cred to Earl
            mask1 = (lon_f>=xW)&(lon_f<=xE)
            mask2 = (lat_f>=yS)&(lat_f<=yN)
            mask = mask1 & mask2
        elif len(lat_i.shape) == 2: # If longitude is 2-D, mask over initial longitude and latitude
            ### Masks to find specific area based off of parameter input. All mask variables 
            ### are boolean
            mask1 = (lon_i>=xW)&(lon_i<=xE) 
            mask2 = (lat_i>=yS)&(lat_i<=yN)
            mask = mask1 & mask2
        if 'woa13' not in list_of_files[0]:
            temp = f.variables[str(variable_1)]
            var_1 = np.asarray(temp[:].copy())
            temp = f.variables[str(variable_2)]
            var_2 = np.asarray(temp[:].copy())
        else:
            var_1 = f.variables[variable_1]
            var_2 = f.variables[variable_2]
        S_timemean=np.nanmean(var_1,axis=0) # Makes a time average, goes from 4-D array to 3-D
        # Helps to eliminate "nan" values.
        print (S_timemean)
        fixed_S_timemean = np.ma.masked_invalid(S_timemean, copy=True)
        print ("FIXED TIME MEAN: ")
        print (fixed_S_timemean)
        S_timespacemean = [] # List of avg salinity values for given area with averaged time.
        for i in list(range(len(var_2))):
            depths_2d = fixed_S_timemean[i,:,:] #2-D array containing salinity values
            vals = depths_2d[mask]
            if variable_1 == "thetao":
                filter_value = 500
            else:
                filter_value = 50
            good_vals = vals<filter_value # boolean statements. Filters out bad values.
            lst = []
            if np.any(vals == 0.0):
                for i in vals:
                    if i != 0.0:
                        lst.append(i)
                if variable_1 == 'thetao':
                    if np.mean(lst) - 273.15 > -50:
                        S_timespacemean.append(np.mean(lst)-273.15)
                    else:
                        S_timespacemean.append(np.mean(lst))
                else:
                    S_timespacemean.append(np.mean(lst))
            else:
                if np.any(vals<0.5): # If salinity is in parts per million
                    # List of salinity values, all oceanic due to mask_badval.
                    filtered = vals[good_vals]*1000 
                else:
                    # List of salinity values, all oceanic due to mask_badval.
                    filtered = vals[good_vals]
                if variable_1 == 'thetao': 
                    # Average temperature values of junk2 and append to S_timespacemean
                    S_timespacemean.append(np.mean(filtered)-273.15)
                else:
                    S_timespacemean.append(np.mean(filtered))
        output.append(S_timespacemean)
        f.close()

    return output

    
"""Finds the average value for each place in each list. Averages all the ones place, twos place, 
etc. Ex: Input: [[1, 10, 62], [3, 13, 22], [4, 50, 71]]. This is used in this program for finding the 
average of oceanic data for different files. For example, if the salinity of an area is found from 
geo_bounds for the 1950s and again for the 1960s, it finds the average of each grid point and 
outputs that.
1+3+4 = 8/3=2.66
Output: [2.66, 23.66, 51.66].
lol_vals stands for list of list values."""

def avg_all_files(lol_vals):
    
    output = []
    for i in list(range(len(lol_vals[0]))): # Loops through length of inner list
        temp = []
        for j in list(range(len(lol_vals))): # Loops through length of outter list
            temp.append(lol_vals[j][i])
        output.append(np.mean(temp))
        
    return output
    
    
    
"""Outputs a list of pressures based off of the inputs depth and latitude."""
def pressure(filename, yS, yN):

    avg_lat = (yS+yN)/2.0
    depths = depth_list(filename)
    pressure = sw.pres(depths, avg_lat)
        
    return pressure
    
    