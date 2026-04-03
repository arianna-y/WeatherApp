from flask import Flask, request, jsonify
import requests

import datetime,zoneinfo

_tbl_weather_api_keys = {
    'index' : 0,
    'keys' : [
        'MMT88ph5GNoICcbkbLp41qJfEN2gIm7R',     # api 1
        '9sHXDuFtyFCDTwe8Jiua45lFWdzAA0ZF',     # api 2
        'kiz6yr0vfkBhDmIlK4N43Ex5HPkZbl6B',     # api 3
        '3VfHuaCi0ij4ElJzU3C9KDhewEnROxrd',     # api 4
        'Y5QQkpg5xnTv7MwnuprlXZcTsEe0V8NN',     # api 5
    ],
}

def get_weather_api_key():
    idx = _tbl_weather_api_keys['index']
    key = _tbl_weather_api_keys['keys'][idx]
    app.logger.warning(f'{idx=}')
    app.logger.warning(f'{key=}')
    idx += 1
    if idx >= len(_tbl_weather_api_keys['keys']):
        idx = 0
    _tbl_weather_api_keys['index'] = idx
    return key

# weather_api_key = 'MMT88ph5GNoICcbkbLp41qJfEN2gIm7R'      # api 1
# weather_api_key = '9sHXDuFtyFCDTwe8Jiua45lFWdzAA0ZF'      # api 2
# weather_api_key = 'kiz6yr0vfkBhDmIlK4N43Ex5HPkZbl6B'      # api 3
# weather_api_key = '3VfHuaCi0ij4ElJzU3C9KDhewEnROxrd'      # api 4
# weather_api_key = 'Y5QQkpg5xnTv7MwnuprlXZcTsEe0V8NN'      # api 5

app = Flask(__name__)
app.logger.warning('Test warning')

# if __name__ == '__main__':
#     app.run(debug=True)

@app.route("/")
def index():
#     return "<h1>test</h1>"
    app.logger.warning('Hello')
    return app.send_static_file('main.html')

if __name__ == '__main__':
    app.run(debug=True)



# @app.route('/weather_display')
# def weather_display():
#     app.logger.warning("this is a test")
#     weather_data = get_current_weather_info();
#     if weather_data is None:
#         app.logger.error("failed to fetch weather data")
#     return render_template('weather_display.html', weather_data=weather_data)

# Handle Weather Form Submission
@app.route("/get_weather", methods=["GET"])
def get_weather():
    app.logger.warning('get_weather')
    app.logger.warning(f'{request=}')
    app.logger.warning(f'{request.args=}')
    auto_detect = 'auto_detect' in request.args
    app.logger.warning(f'DBG: {auto_detect=}')
    show_detail = 'detail' in request.args;
    app.logger.warning(f'DBG: {show_detail=}')
    weather_data = None

    # street = "2605 Severance Street"
    # city = "los angeles"
    # state = "CA"

    # if auto-detect location button is selected, use IPInfo
    # otherwise use manually inputted info and google maps geocoding API
    app.logger.warning("DBG")
    if auto_detect:
        app.logger.warning("auto_datect location by IP")
        lat, lon, formatted_address = get_ip_location()
    else:
        street = request.args['street']
        city = request.args['city']
        state = request.args['state']
        app.logger.warning("location by IP by address")
        address = f"{street}, {city}, {state}"
        lat, lon, formatted_address = get_lat_lon_address(address)
        # print(get_weather_info(street, city, state))
        # app.logger.warning(f"{get_weather_info(street, city, state}=)}")

    if show_detail:
        start_time = datetime.datetime.combine(
            datetime.date.fromisoformat(request.args['date']),
            datetime.time(6, 0, 0, 0, tzinfo=zoneinfo.ZoneInfo('America/Los_Angeles'))
        ).isoformat()
        app.logger.debug(f'show_detail: {start_time=}')
        weather_range = get_timelines_weather_info(lat, lon, start=start_time, step='1d')
        weather_hourly = get_timelines_weather_info(lat, lon, start=start_time, step='1h')
        if weather_range and weather_range and weather_hourly:
            weather_data = {
                'data' : weather_range['data']['timelines'][0]['intervals'][1],
            }
            weather_data['location'] = { 'formatted_address' : formatted_address }
            weather_data['chart'] = {
                'timelines' : {
                    'range' : weather_range['data']['timelines'],
                    'hourly' : weather_hourly['data']['timelines'],
                },
                'range' : [],
                'hourly' : {},
            }
            # temporature range
            for item in weather_range['data']['timelines'][0]['intervals']:
                weather_data['chart']['range'].append([
                    datetime.datetime.fromisoformat(item['startTime']).timestamp() * 1000,
                    item['values']['temperatureMin'],
                    item['values']['temperatureMax']
                ])
            # hourly
            weather_data['chart']['hourly']['type'] = 'Feature'
            weather_data['chart']['hourly']['geometry'] = {
                'type' : 'Point',
                'coordinates' : [
                    float(lat), float(lon), 25
                ],
            }
            weather_data['chart']['hourly']['properties'] = {
                'meta' : {
                    "units": {
                    "air_pressure_at_sea_level": "hPa",
                    "air_temperature": "celsius",
                    "cloud_area_fraction": "%",
                    "precipitation_amount": "mm",
                    "relative_humidity": "%",
                    "wind_from_direction": "degrees",
                    "wind_speed": "m/s"
                    }
                }
            }
            weather_data['chart']['hourly']['properties']['timeseries'] = []
            app.logger.warning(f"{weather_hourly['data']['timelines']=}")
            app.logger.warning(f"{len(weather_hourly['data']['timelines'][0]['intervals'])=}")
            for item in weather_hourly['data']['timelines'][0]['intervals']:
                adjusted_time = datetime.datetime.fromisoformat(item['startTime']).timestamp()
                adjusted_time += int(datetime.datetime.now(
                                        zoneinfo.ZoneInfo('America/Los_Angeles')
                                    ).utcoffset().total_seconds())
                adjusted_time = datetime.datetime.fromtimestamp(adjusted_time).isoformat()
                weather_data['chart']['hourly']['properties']['timeseries'].append({
                    'time' : adjusted_time, # item['startTime'],
                    'data' : {
                        'instant' : {
                            'details' : {
                                'air_pressure_at_sea_level' : item['values']['pressureSurfaceLevel'],
                                'air_temperature': item['values']['temperatureMin'],
                                'cloud_area_fraction' : 0,
                                'wind_from_direction' : item['values']['windDirection'],
                                'wind_speed' : item['values']['windSpeed'],
                            }
                        },
                        # 'next_12_hours': {
                        #     'summary': {
                        #         'symbol_code': 'cloudy'
                        #     },
                        #     'details': {}
                        # },
                        'next_1_hours': {
                            'summary': {
                                'symbol_code': 'cloudy'
                            },
                            'details': {
                                'precipitation_amount': item['values']['precipitationIntensity'],
                                'relative_humidity' : item['values']['humidity'],
                            }
                        },
                        # 'next_6_hours': {
                        #     'summary': {
                        #         'symbol_code': "cloudy"
                        #     },
                        #     'details': {
                        #         # 'precipitation_amount': 0
                        #     }
                        # }
                    }
                })
        else:
            return None
        return weather_data
    else:
        # call tomorrow.io API with latitude and longitude to get weather data
        app.logger.warning(f"{lat=} {lon=}")
        weather_data = get_current_weather_info(lat, lon)
        app.logger.warning(f"{weather_data=}")
        start_time = datetime.datetime.combine(
            datetime.datetime.fromisoformat(
                weather_data['data']['time'][:-1] + '+00:00'
            ).astimezone(
                zoneinfo.ZoneInfo('America/Los_Angeles')
            ).date(),
            datetime.time(6, 0, 0, 0, zoneinfo.ZoneInfo('America/Los_Angeles'))
        ).isoformat()
        weather_timelines = get_timelines_weather_info(lat, lon, start=start_time)

        # render weather details
        if weather_data:
            weather_data['location'] = { 'formatted_address' : formatted_address }
            weather_data['timelines'] = weather_timelines['data']['timelines']
            return weather_data
        else:
            app.logger.warning("no data")
            return None
    

# Helper Functions
def get_ip_location():
    app.logger.warning("get_ip_location")
    response = requests.get("https://ipinfo.io/?token=90b78b139469fe")
    data = response.json()
    # print(f"IPInfo API Response: {data}")
    app.logger.warning(f"{type(data)=} {repr(data)=}")
    lat, lon = data['loc'].split(',')
    formatted_address = data['city'] + ', ' + data['region'] + ' ' + data['country']
    return lat, lon, formatted_address

def get_lat_lon_address(address):
    app.logger.debug(f'get_lat_lon_address: {address=}')
    google_api_key = 'AIzaSyBEKi5arBSHzyGPuzMsXmLeuOi-gbMXNK4'
    response = requests.get(f'https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={google_api_key}')
    app.logger.warning(f"{address}")
    data = response.json()
    app.logger.warning(f"Google Maps API Resonse: {data}")

    if 'results' in data and len(data['results']) > 0:
        location = data['results'][0]['geometry']['location']
        latitude = location['lat']
        longitude = location['lng']
        formatted_address = data['results'][0]['formatted_address']
        app.logger.warning(f"Latitude: {location['lat']}, Longitude: {location['lng']}, Formatted Address: {'formatted_address'}")
        return latitude, longitude, formatted_address
    else:
        return None, None 
    
# Get weather data from Tomorrow.io API
def get_current_weather_info(lat, lon):
    req_url = f'https://api.tomorrow.io/v4/weather/realtime?location={lat},{lon}&units=imperial&apikey={get_weather_api_key()}'
    app.logger.warning(f'{req_url=}')
    response = requests.get(req_url)
    app.logger.warning(response)
    if response.status_code == 200:
        app.logger.warning(response.json)
        return response.json()
    else:
        app.logger.warning("no response found")
        return None

        
def get_timelines_weather_info(lat, lon, start='now', step='1d'):
    req_url = f'https://api.tomorrow.io/v4/timelines?apikey={get_weather_api_key()}'
    app.logger.warning(f'get_timelines_weather_info: {req_url=}')
    app.logger.warning(f'{start=}')
    req_payload = {
        'location' : f'{lat},{lon}',
        'fields' : [
            'temperatureMax',
            'temperatureMin',
            'weatherCode',
            'windSpeed',
            'windDirection',
            'precipitationType',
            'precipitationProbability',
            'precipitationIntensity',
            'pressureSurfaceLevel',
            'humidity',
            'visibility'
        ],
        'units' : 'imperial',
        'timesteps' : [ step ],
        'startTime' : start,
        # 'endTime' : 'nowPlus5d'
        'timezone' : 'America/Los_Angeles'
    }
    if step == '1d':
        req_payload['fields'].append('sunriseTime')
        req_payload['fields'].append('sunsetTime')

    req_headers = {
        'accept' : 'application/json',
        'Accept-Encoding' : 'gzip',
        'content-type' : 'application/json'
    }


    app.logger.warning(f'{req_url=}')
    response = requests.post(req_url, json=req_payload, headers=req_headers)
    app.logger.warning(f'{response.text=}')
    app.logger.warning(response)
    if response.status_code == 200:
        app.logger.warning(response.json)
        return response.json()
    else:
        app.logger.warning("no response found")
        return None
