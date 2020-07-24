from math import pi
#circular coords libraries
from functools import partial
import pyproj
from shapely.ops import transform
from shapely.geometry import Point
#open route service libraries
import openrouteservice
from openrouteservice import convert

#map plotting
import numpy as np
import math
import pandas as pd
import matplotlib.pyplot as plt

#albes python to get current location
import geocoder

# %%
#################################
###########FRONT END#############
#################################

#getting current location
g = geocoder.ip('me')
lat = g.lat
lon = g.lng

#Requested running distance
original_run = 20


#%%
#################################
########### TESTING #############
#################################

#Plots circular generated coordinates in a map image
plot_option = False

#Prints out delta for optimization (finding the accurate total distance)
print_delta = True

#Prints in case the API fucksup
api_check = True


#%%
#################################
###########FUNCTIONS#############
#################################

# generates list with coordinate pairs in tuples, from the center
def geodesic_point_buffer(lat, lon, radius, angle = pi/2):
    """
    Parameters
    ----------
    lat : float
        Lattitude of the coordinate.
    lon : flat
        Longitude of the coordinate.
    radius : float
        Radius of the route.

    Returns
    -------
    TYPE
        list of the coords as tuples [(lat, lng), ..., (lat, lng)]

    """
    #correcting for the lng and lat side orientation
    angle += pi/2
    
    #Performs cartographic transformations. Converts from longitude, latitude to native map projection x,y coordinates and vice versa using PROJ
    proj_wgs84 = pyproj.Proj('+proj=longlat +datum=WGS84')
    
    #radius is in km
    # Azimuthal equidistant projection
    aeqd_proj = '+proj=aeqd +lat_0={lat} +lon_0={lon} +x_0=0 +y_0=0'
    project = partial(
        pyproj.transform,
        pyproj.Proj(aeqd_proj.format(lat=lat, lon=lon)),
        proj_wgs84)
    #on Point(lat,lng) higher the buffer on lat - the higher the lat, same for lng
    #multiplying the lat or lng inside the Point() with 1000*radius, makes the point go to one of the edges
    #buf = Point(radius* math.cos(angle), radius * math.sin(angle)).buffer(radius * 1000)  # distance in metres
    buf = Point(radius * 1000 * math.cos(angle), radius * 1000 * math.sin(angle)).buffer(radius * 1000)  # distance in metres
    
    return transform(project, buf).exterior.coords[:]

#just to separate lat and long
def plotting_coords_in_map(map_file, coords):
    """
    Parameters
    ----------
    map_file : string
        It's the file path to the map image.
    c : list
        list of the coords as tuples [(lat, lng), ..., (lat, lng)].

    Returns
    -------
    None. Just plots

    """
    lat_list = []
    lng_list = []
    
    for c in coords:
        lat_list.append(c[0])
        lng_list.append(c[1])
    
    
    #define bouding box of the map
    bounding_box = (min(lng_list), max(lng_list), min(lat_list), max(lat_list))
    
    #load map image
    map_image = plt.imread(map_file)
    
    fig, ax = plt.subplots(figsize = (8,7))
    
    ax.scatter(lng_list, lat_list, zorder=1, alpha=0.7, c='r', s=50)
    ax.scatter(lat, lon, zorder=2, alpha=0.7, c='b', s=500)
    
    ax.set_title('Plotting the route')
    ax.set_xlim(bounding_box[0], bounding_box[1],bounding_box[2], bounding_box[3])
    ax.imshow(map_image, zorder=0, extent=bounding_box, aspect='auto')
    
def getting_route(lat, lon, run, angle = pi/2):
    """

    Parameters
    ----------
    lat : float
        Lattitude of the coordinate.
    lon : flat
        Longitude of the coordinate.
    run : float
        Running distance requested by the user.

    Returns
    -------
    TYPE
        DESCRIPTION.

    """
    radius = run/(2*pi)
     
    
    #2pi*r = P <=> r = P/2*pi
    
    #generate the coords
    #coords = geodesic_point_buffer(lat, lon, radius)
    coords = geodesic_point_buffer(lat, lon, radius, angle)
    
    #turn coords in list in order to reduce to half
    #coords = []
    
    # for c in b:
    #     c1 = c[0]
    #     c2 = c[1]
    #     cf = (c1, c2)
    #     coords.append(cf)
        
    #reduce to half, api only accepts 50 data points
    while len(coords) > 50:
        coords = coords[::2]
    
    #for testing
    if plot_option:
        plotting_coords_in_map('map.png', coords)      
        print("map ploted")
    
    #python openstreetmaps.py 
    #API key
    client = openrouteservice.Client(key='5b3ce3597851110001cf62486de2e441b89443d498ab388a56a562d4')
    
    #coords = ((8.34234,48.23424),(8.34423,48.26424), (8.34523,48.24424), (8.41423,48.21424))
    
    #api needs coords in tupple
    coords_b = tuple(coords)
    
    #get the full route
    routes = client.directions(coords_b, profile='cycling-regular', optimize_waypoints=False)
    
    total_distance = routes['routes'][0]['summary']['distance']
    
    return (routes, total_distance)

def relative_error(total_distancem, original_run):
    return (total_distance - original_run*1000)/(original_run*1000)

def closer_to_target(prev_option, routes, distance, original_run):
    """
    Parameters
    ----------
    prev_option : tuple (routes json, distance float)
        previous distance.
    routes : json object
        routes json related to the current closest option.
    distance : float
        current calculated distance.
    original_run : float
        current target distance for the run.

    Returns
    -------
    tuple (routes json, distance float)
        closest tuple to the distance run

    """
    prev_distance = prev_option[1]
    prev_distance_error = abs(original_run - prev_distance)
    distance_error = abs(original_run - distance)
    
    #check the lowest error to the target
    if prev_distance_error < distance_error:
        return prev_option
    return (routes, distance)

#%%
#################################
######     MAIN       ###########
#################################

#tuning the distance due to mapping
run = original_run/3

angles = [0, pi/2, pi, 3/4*pi]
angles_degrees = ['0', '90', '180', '270']

#storing the different possibilities in tuples (routes and distance)
routing_options = []

#storing the decoded coords for each option
decoded_options = {}

for (n, angle) in enumerate(angles):

    #100m of error on the total route
    precision = 100
    learning_rate = 1
    
    routes, total_distance = getting_route(lat, lon, run, angle)
    lowest_option = (routes, total_distance)
    delta = relative_error(total_distance, original_run)
    
    #optimization
    while True:
        
        #error here, because your are getting another value instead of taking the correct one
        if abs(total_distance - original_run*1000) < precision:
            # (routes, total_distance) = getting_route(lat, lon, run)
            routing_options.append(lowest_option)
            break
        else:
            #store last value of run
            run_prev = run
            delta_prev = delta
            
            #relative error for optimization reference
            delta = relative_error(total_distance, original_run)
            
            run = run_prev - learning_rate*delta
            #in case delta changes to negative or vice-versa
            
            if (delta*delta_prev > 0 and delta < 0) or (delta*delta_prev < 0 and delta > 0):
                learning_rate = .2
            
            #in case the API fucks up somehow
            try:    
                #get a new distance value
                (routes, total_distance) = getting_route(lat, lon, run)
            except:
                #for testing
                if api_check:
                    print("API fuckup")
                routing_options.append(lowest_option)
                break
            
            #store the info closest to target distance
            lowest_option = closer_to_target(lowest_option, routes, total_distance, original_run)
            
            
            #for testing
            if print_delta:
                print('Delta = ', delta,', learning Rate = ', learning_rate)
                if total_distance < (original_run*1000 - precision):
                    print('Lower', total_distance)
                elif total_distance > (original_run*1000 + precision):
                    print('Greater', total_distance)
        
    #for testing
    if print_delta:
        print('Done', lowest_option[1])
                
        
    
    # get the geometry from the routes and decode_polyline needs the geometry only
    geometry = lowest_option[0]['routes'][0]['geometry']
    decoded = convert.decode_polyline(geometry)
    
    decoded_options[angles_degrees[n]] = decoded["coordinates"]





""" routes = client.directions(coords, profile='cycling-regular', optimize_waypoints=True)



openrouteservice.directions.directions(client, coordinates, profile='driving-car', format_out=None, format='json', preference=None, units=None, language=None, geometry=None, geometry_simplify=None, instructions=None, instructions_format=None, alternative_routes=None, roundabout_exits=None, attributes=None, maneuvers=None, radiuses=None, bearings=None, skip_segments=None, continue_straight=None, elevation=None, extra_info=None, suppress_warnings=None, optimized=None, optimize_waypoints=None, options=None, validate=True, dry_run=None)
profile (string) – Specifies the mode of transport to use when calculating directions. One of [“driving-car”, “driving-hgv”, “foot-walking”, “foot-hiking”, “cycling-regular”, “cycling-road”,”cycling-mountain”, “cycling-electric”,]. Default “driving-car”.
elevation (boolean) – Specifies whether to return elevation values for points. Default False.
extra_info (list or tuple of strings) – Returns additional information on [“steepness”, “suitability”, “surface”, “waycategory”, “waytype”, “tollways”, “traildifficulty”, “roadaccessrestrictions”]. Must be a list of strings. Default None.


"""


