import os
import requests
import json
import logging
import subprocess

from flask import request, abort
from src.common.objects import SDAManager, Port


class DeviceAPI:
    def __init__(self):
        pass

    @classmethod
    def register_api(cls, app):
        # Get/Set SDA Manager IP
        @app.route("/sdamanager/address", methods=["GET", "POST"])
        def sda_manager_address():
            logging.info("[" + request.method + "] sda manager address - IN")

            if request.method == "GET":
                return SDAManager().get_sda_manager_ip(), 200
            elif request.method == "POST":
                data = json.loads(request.data)
                SDAManager.set_sda_manager_ip(data["ip"])
                return SDAManager().get_sda_manager_ip(), 200
            else:
                return abort(404)

        # Get/Set Reverse Proxy
        @app.route("/sdamanager/reverseproxy", methods=["GET", "POST"])
        def sda_manager_reverseproxy():
            logging.info("[" + request.method + "] sda manager reverse proxy - IN")

            if request.method == "GET":
                return SDAManager().get_reverse_proxy(), 200
            elif request.method == "POST":
                data = json.loads(request.data)
                SDAManager.set_reverse_proxy(data["enabled"])
                return SDAManager().get_reverse_proxy(), 200
            else:
                return abort(404)

        # Get devices(SDAs) Info.
        @app.route("/sdamanager/devices", methods=["GET"])
        def sda_manager_devices():
            logging.info("[" + request.method + "] sda manager devices - IN")

            l = list()
            ret = dict()

            response = requests.get(
                url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes",
                timeout=1500)

            if response.status_code is not 200:
                logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                abort(500)

            for obj in response.json()["nodes"]:
                d = dict()
                if "id" in obj:
                    d.update({"id": str(obj["id"])})

                    res = requests.get(
                        url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/" + str(obj["id"]) + "/configuration",
                        timeout=1500)
                    if res.status_code is 200:
                        for prop in res.json()["properties"]:
                            if "devicename" in prop:
                                d.update({"name": str(prop["devicename"])})
                if "ip" in obj:
                    d.update({"ip": str(obj["ip"])})
                if "status" in obj:
                    d.update({"status": str(obj["status"])})
                l.append(d)

            ret.update({"devices": l})
            return json.dumps(json.dumps(ret)), 200

        # Set device Info.
        @app.route("/sdamanager/device", methods=["POST"])
        def sda_manager_device():
            logging.info("[" + request.method + "] sda manager device - IN")
            data = json.loads(request.data)
            if "id" in data:
                SDAManager.set_device_id(data["id"])
            if "ip" in data:
                SDAManager.set_device_ip(data["ip"])
            return "device", 200

        # Get/Update Device Info
        @app.route("/sdamanager/device/info", methods=["GET", "POST"])
        def sda_manager_device_info():
            logging.info("[" + request.method + "] sda manager device - IN")
            if request.method == "GET":
                d = dict()
                response = requests.get(
                    url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                        + SDAManager.get_device_id() + "/configuration",
                    timeout=1500)
                
                if response.status_code is not 200:
                    logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                    abort(500)
                if "properties" in response.json():
                    for prop in response.json()["properties"]:
                        if "devicename" in prop:
                            d.update({"name": str(prop["devicename"])})
                        elif "pinginterval" in prop:
                            d.update({"pinginterval": str(prop["pinginterval"])})

                return json.dumps(d), 200

            elif request.method == "POST":
                response = requests.post(
                    url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                        + SDAManager.get_device_id() + "/configuration",
                    data=request.data,
                    timeout=1500)
                if response.status_code is not 200:
                    logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                    abort(500)
                return "", 200
            else:
                return abort(404)

        # Get Resource.
        @app.route("/sdamanager/monitoring/resource", methods=["GET"])
        def sda_manager_resource():
            logging.info("[" + request.method + "] sda manager resource - IN")
            d = dict()
            response = requests.get(
                url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/monitoring/nodes/"
                    + SDAManager.get_device_id() + "/resource",
                timeout=1500)
            if response.status_code is not 200:
                logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                abort(500)
                
            d = response.json()
            return json.dumps(d), 200

        # Get apps Info.
        @app.route("/sdamanager/apps", methods=["GET"])
        def sda_manager_apps():
            logging.info("[" + request.method + "] sda manager apps - IN")

            l = list()
            apps = list()
            ret = dict()

            response = requests.get(
                url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                    + SDAManager.get_device_id(),
                timeout=1500)

            if response.status_code is not 200:
                logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                abort(500)

            root_path = os.getcwd()

            if not os.path.exists(root_path + "/static/user/apps"):
                with open(root_path + "/static/user/apps", 'w'): pass

            with open(root_path + "/static/user/apps", 'r') as content_file:
                content = content_file.read()
                if content != "":
                    apps = json.loads(content)["apps"]

            for obj in response.json()["apps"]:
                d = dict()
                d.update({"id": str(obj)})
                response2 = requests.get(
                    url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                        + SDAManager.get_device_id() + "/apps/" + str(obj),
                    timeout=1500)

                if response2.status_code is not 200:
                    logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                    abort(500)

                d.update({"services": len(response2.json()["services"])})
                d.update({"state": response2.json()["state"]})

                for app in apps:
                    if "id" in app and app["id"] == str(obj):
                        d.update({"name": app["name"]})

                l.append(d)
            response3 = requests.get(
                url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/" + SDAManager.get_device_id() + "/configuration",
                timeout=1500)
            if response3.status_code is not 200:
                logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                abort(500)

            if "properties" in response3.json():
                for prop in response3.json()["properties"]:
                    if "devicename" in prop:
                        device_name = str(prop["devicename"])
                        ret.update({"device": device_name + "(" + SDAManager.get_device_ip() + ")", "apps": l})

            return json.dumps(json.dumps(ret)), 200

        # Set app Id
        @app.route("/sdamanager/app", methods=["POST", "DELETE"])
        def sda_manager_app():
            logging.info("[" + request.method + "] sda manager app - IN")
            if request.method == "POST":

                l = list()
                ret = dict()

                data = json.loads(request.data)
                SDAManager.set_app_id(data["id"])

                response = requests.get(
                    url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                        + SDAManager.get_device_id() + "/apps/" + SDAManager.get_app_id(),
                    timeout=1500)

                if response.status_code is not 200:
                    logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                    abort(500)

                for obj in response.json()["services"]:
                    d = dict()
                    d.update({"name": str(obj["name"])})
                    d.update({"state": str(obj["state"]["status"])})
                    d.update({"exitcode": str(obj["state"]["exitcode"])})
                    l.append(d)

                ret.update({"services": l})

                return json.dumps(json.dumps(ret)), 200
            elif request.method == "DELETE":
                response = requests.delete(
                    url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                        + SDAManager.get_device_id() + "/apps/" + SDAManager.get_app_id(),
                    timeout=1500)

                if response.status_code is not 200:
                    logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                    abort(500)

                return "", 200
            else:
                return abort(404)

        # Install an app
        @app.route("/sdamanager/app/install", methods=["POST"])
        def sda_manager_app_install():
            logging.info("[" + request.method + "] sda manager app install - IN")

            l = list()
            d = dict()
            data = json.loads(request.data)

            response = requests.post(
                url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                    + SDAManager.get_device_id() + "/apps/deploy",
                data=data["data"],
                timeout=1500)

            if response.status_code is not 200:
                logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                abort(500)

            d.update({"id": response.json()["id"], "name": data["name"]})

            root_path = os.getcwd()

            if not os.path.exists(root_path + "/static/user/apps"):
                with open(root_path + "/static/user/apps", 'w'): pass

            with open(root_path + "/static/user/apps", 'r') as content_file:
                content = content_file.read()
                if content == "":
                    apps = {"apps": l}
                else:
                    apps = json.loads(content)

            with open(root_path + "/static/user/apps", 'w+') as content_file:
                apps["apps"].append(d)
                content_file.write(json.dumps(apps))

            return "", 200

        # Start an app
        @app.route("/sdamanager/app/start", methods=["GET"])
        def sda_manager_app_start():
            logging.info("[" + request.method + "] sda manager app update - IN")

            response = requests.post(
                url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                    + SDAManager.get_device_id() + "/apps/" + SDAManager.get_app_id()
                    + "/start",
                timeout=1500)

            if response.status_code is not 200:
                logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                abort(500)

            return "", 200

        # Stop an app
        @app.route("/sdamanager/app/stop", methods=["GET"])
        def sda_manager_app_stop():
            logging.info("[" + request.method + "] sda manager app update - IN")

            response = requests.post(
                url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                    + SDAManager.get_device_id() + "/apps/" + SDAManager.get_app_id()
                    + "/stop",
                timeout=1500)

            if response.status_code is not 200:
                logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                abort(500)

            return "", 200

        # Update an app
        @app.route("/sdamanager/app/update", methods=["GET"])
        def sda_manager_app_update():
            logging.info("[" + request.method + "] sda manager app update - IN")

            response = requests.post(
                url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                    + SDAManager.get_device_id() + "/apps/" + SDAManager.get_app_id()
                    + "/update",
                timeout=1500)

            if response.status_code is not 200:
                logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                abort(500)

            return "", 200

        # Get/Update app Yaml file to SDA DB
        @app.route("/sdamanager/app/yaml", methods=["GET", "POST"])
        def sda_manager_app_yaml():
            logging.info("[" + request.method + "] sda manager app YAML - IN")

            if request.method == "GET":
                d = dict()
                response = requests.get(
                    url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                        + SDAManager.get_device_id() + "/apps/" + SDAManager.get_app_id(),
                    timeout=1500)

                if response.status_code is not 200:
                    logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                    abort(500)

                if "description" in response.json():
                    d = response.json()["description"]

                return json.dumps(json.dumps(d)), 200
            elif request.method == "POST":
                data = json.loads(request.data)

                response = requests.post(
                    url="http://" + SDAManager().get_sda_manager_endpoint() + "/api/v1/management/nodes/"
                        + SDAManager.get_device_id() + "/apps/" + SDAManager.get_app_id(),
                    data=data["data"],
                    timeout=1500)

                if response.status_code is not 200:
                    logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                    abort(500)

                return "", 200

        # Get/Write Git address to Web client DB
        @app.route("/sdamanager/git", methods=["GET", "POST", "DELETE"])
        def sda_manager_git():
            logging.info("[" + request.method + "] sda manager Git - IN")

            root_path = os.getcwd()

            if not os.path.exists(root_path + "/static/user/gits"):
                with open(root_path + "/static/user/gits", 'w'): pass

            if request.method == "GET":
                with open(root_path + "/static/user/gits", 'r') as content_file:
                    content = content_file.read()

                return json.dumps(content), 200
            elif request.method == "POST":
                with open(root_path + "/static/user/gits", 'r') as content_file:
                    content = content_file.read()

                    if content == "":
                        gits = {"gits": list()}
                    else:
                        gits = json.loads(content)

                    gits["gits"].append(json.loads(request.data))

                with open(root_path + "/static/user/gits", 'w+') as content_file:
                    content_file.write(json.dumps(gits))

                return "", 200
            elif request.method == "DELETE":
                with open(root_path + "/static/user/gits", 'w+') as content_file:
                    content_file.write(request.data)
                
                return "", 200

            else:
                logging.error("Unknown Method - OUT")
                return abort(404)

        # Get Recipe
        @app.route("/sdamanager/recipe", methods=["post"])
        def get_recipe():
            url = json.loads(request.data)["repo"]
            url = url.replace("https://", "")
            url_arr = url.split('/')
            gitaddress = url_arr[0]
            username = url_arr[1]
            reponame = url_arr[2]
            if len(url_arr)>3:
                branch = url_arr[4]
            else:
                branch = "master"
            filepath = "docker-compose.yml"

            if gitaddress == "github.sec.samsung.net":
                token = "7b9e3ba11366db09ad9cfbf409750cfdc6ba7edc"
                recipe = "https://"+token+"@github.sec.samsung.net/raw/"
            else:
                recipe = "https://raw.githubusercontent.com/"
            recipe += username+"/"+reponame+"/"+branch+"/"+filepath
            
            ret = subprocess.Popen("curl -s "+recipe,
                shell=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE)
            content, error = ret.communicate()
            return json.dumps(content), 200

        # Unregister Device
        @app.route("/sdamanager/unregister", methods=["POST"])
        def sda_manager_device_unregister():
            logging.info("[" + request.method + "] sda manager device register - IN")

            response = requests.post(
                url="http://" + SDAManager.get_sda_manager_endpoint() + "/api/v1/management/nodes/" + SDAManager.get_device_id() + "/unregister",
                timeout=1500)

            if response.status_code is not 200:
                logging.error("SDAM Server Return Error, Error Code(" + str(response.status_code) + ") - OUT")
                abort(500)

            return "", 200