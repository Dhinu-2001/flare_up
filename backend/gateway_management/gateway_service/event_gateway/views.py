import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import environ
env = environ.Env()
environ.Env.read_env()

# Create your views here.

class EventsAPI(APIView):
    def post(self, request):
        try:
            print('event gateway reached')
            data = request.data
            print(data)
            response = requests.post(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/",
                json=data,
                headers={"Content-Type": 'application/json'},
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_201_CREATED)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
    def get(self, request):
        try:
            response =  requests.get(f"http://{env('EVENT_SVC_ADDRESS')}/events/")
            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class EventAPI(APIView):
    def get(self, request, event_id):
        try:
            print('reached api gateway', event_id)
            response = requests.get(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/event/{event_id}/",
                
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
    def put(self, request, event_id):
        try:
            print('reached api gateway', event_id)
            data = request.data
            print(data)
            response = requests.put(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/event/{event_id}/",
                json=data,
                headers={"Content-Type": 'application/json'},
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class EventsByHosterAPI(APIView):
    def get(self, request, hoster_id):
        try:
            print('reached api gateway', hoster_id)
            response = requests.get(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/events/hoster/{hoster_id}/",
                
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)


class UpdateEventStatusAPI(APIView):
    def post(self, request, event_id):
        try:
            print(' reached event update')
            data = request.data
            print(data)
            response = requests.post(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/event/{event_id}/update_event_status/",
                json=data,
                headers={"Content-Type": 'application/json'},
            )
            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_201_CREATED)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class UpdateApprovalStatusAPI(APIView):
    def post(self, request, event_id):
        try:
            print('reached approval update')
            data = request.data
            print(data)
            response = requests.post(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/event/{event_id}/update_status/",
                json=data,
                headers={"Content-Type": 'application/json'},
            )
            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_201_CREATED)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class KeyParticipantsAPI(APIView):
    def post(self, request, event_id):
        try:
            print('reached approval update')
            data = request.data
            print(data)
            response = requests.post(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/event/{event_id}/key_participants/",
                json=data,
                headers={"Content-Type": 'application/json'},
            )
            if response.status_code == 200:
                return Response(response.json(), status=status.HTTP_201_CREATED)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
                    
class EventsByCategoryAPI(APIView):
    def get(self, request, category_name):
        try:
            print('reached api gateway', category_name)
            response = requests.get(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/events/category/{category_name}/",
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
        

class EventTypesAndCategoriesAPI(APIView):
    def get(self, request):
        try:
            print('reached api gateway')
            response = requests.get(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/event-types-and-categories/",
                
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class CreateCategoryAPI(APIView):
    def post(self, request):
        try:
            print('reached event gateway')
            response = requests.post(
            f"http://{env('EVENT_SVC_ADDRESS')}/events/create_category/",
                json=request.data,
                headers={"Content-Type": 'application/json'},  
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_201_CREATED)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
       
class CategoryAPI(APIView):
    def get(self, request, category_name):
        try:
            print('reached api gateway', category_name)
            response = requests.get(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/category/{category_name}/",
                
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
       
class TypeAPI(APIView):
    def post(self, request):
        try:
            print('reached event gateway')
            response = requests.post(
            f"http://{env('EVENT_SVC_ADDRESS')}/events/type/",
                json=request.data,
                headers={"Content-Type": 'application/json'},  
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_201_CREATED)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)