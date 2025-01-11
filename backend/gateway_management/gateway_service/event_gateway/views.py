import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from concurrent.futures import ThreadPoolExecutor
from collections import defaultdict
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
        
        
class TicketDownloadAPI(APIView):
    def get(self, request, transaction_id):
        try:
            print('reached api gateway', transaction_id)
            response = requests.get(
                f"http://{env('EVENT_SVC_ADDRESS')}/participants/ticket-download/{transaction_id}/",
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        
class ParticipantsByEventAPI(APIView):
    def get(self, request, event_id):
        try:
            print('reached api gateway', event_id)
            response = requests.get(
                f"http://{env('EVENT_SVC_ADDRESS')}/participants/event/{event_id}/",
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

def fetch_service_data(url):
    try:
        response = requests.get(url)
        return response.json() if response.status_code == 200 else None
    except:
        return None

class AnalyticsHosterAPI(APIView):
    def get(self, request, hoster_id):
        try:
            print('reached api gateway', hoster_id)
            
            # Service Addresses
            event_service = env('EVENT_SVC_ADDRESS')
            registration_service = env('REGISTRATION_SVC_ADDRESS')
            
            # Defining endpoints
            urls = {
                'overall_event_participant' : f"http://{event_service}/analytics/get_event_participant_stats/{hoster_id}/",
                'event_count_on_catgory' : f"http://{event_service}/analytics/event_count_on_category/{hoster_id}/",
                'participant_count_on_category' : f"http://{event_service}/analytics/participant_count_on_category/{hoster_id}/",
                'total_income' : f"http://{registration_service}/total_income/{hoster_id}/",
            }
            
            # Fetch data parallel with ThreadPoolExecutor
            with ThreadPoolExecutor(max_workers=4) as executor:
                futures = {
                    key: executor.submit(fetch_service_data, url)
                    for key, url in urls.items()
                }

                results = {
                    key: future.result()
                    for key, future in futures.items()
                }
            print('RESULT',results['total_income'])

            response_data = {
                'total_events': results['overall_event_participant'].get('total events', 0),
                'total_participants': results['overall_event_participant'].get('total participants', 0),
                'total_income': results['total_income'].get('total income', 0),
                'overall_event_participant': results['overall_event_participant'].get('event_participant_stats', []),
                'event_count_on_catgory': results['event_count_on_catgory'].get('result', []),
                'participant_count_on_category': results['participant_count_on_category'].get('result', []),
            }
            print('RESULT OF THREAD CALL', response_data)

            
            return Response(response_data, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            print('EXECEPTION',e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        


class AnalyticsAdminAPI(APIView):
    def get(self, request, admin_id):
        try:
            print('reached api gateway', admin_id)
            
            # Service Addresses
            event_service = env('EVENT_SVC_ADDRESS')
            registration_service = env('REGISTRATION_SVC_ADDRESS')
            
            # Defining endpoints
            urls = {
                'overall_event_participant' : f"http://{event_service}/analytics/admin/get_event_participant_stats/{admin_id}/",
                'event_count_on_catgory' : f"http://{event_service}/analytics/admin/event_count_on_category/{admin_id}/",
                'participant_count_on_category' : f"http://{event_service}/analytics/admin/participant_count_on_category/{admin_id}/",
                
            }
            
            # Fetch data parallel with ThreadPoolExecutor
            with ThreadPoolExecutor(max_workers=4) as executor:
                futures = {
                    key: executor.submit(fetch_service_data, url)
                    for key, url in urls.items()
                }

                results = {
                    key: future.result()
                    for key, future in futures.items()
                }

            response_data = {
                'total_events': results['overall_event_participant'].get('total events', 0),
                'total_participants': results['overall_event_participant'].get('total participants', 0),
                'overall_event_participant': results['overall_event_participant'].get('event_participant_stats', []),
                'event_count_on_catgory': results['event_count_on_catgory'].get('result', []),
                'participant_count_on_category': results['participant_count_on_category'].get('result', []),
            }
            print('RESULT OF THREAD CALL', response_data)

            
            return Response(response_data, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            print('EXECEPTION', e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        

class GetUserDataEventAnalyticsAPI(APIView):
    def get(self, request, user_id):
        try:
            print('reached api gateway', user_id)
            
            # Service Addresses
            user_service = env('USER_SVC_ADDRESS')
            event_service = env('EVENT_SVC_ADDRESS')
            
            # Defining endpoints
            urls = {
                'user_data' : f"http://{user_service}/user-profile/{user_id}/",
                'event_analytics' : f"http://{event_service}/analytics/get_user_event_analytics/{user_id}/",
                
            }
            
            # Fetch data parallel with ThreadPoolExecutor
            with ThreadPoolExecutor(max_workers=4) as executor:
                futures = {
                    key: executor.submit(fetch_service_data, url)
                    for key, url in urls.items()
                }

                results = {
                    key: future.result()
                    for key, future in futures.items()
                }
            
            print('RESULT', results)

            response_data = {
                'user_data': results.get('user_data', 0),
                'event_analytics': results['event_analytics'].get('result', 0),
            }
            print('RESULT OF THREAD CALL', response_data)

            
            return Response(response_data, status=status.HTTP_200_OK)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
        except Exception as e:
            print('EXECEPTION', e)
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
class GetUserTicketBookingDetailsAPI(APIView):
    def get(self, request, user_id):
        try:
            print('reached api gateway', user_id)
            response = requests.get(
                f"http://{env('EVENT_SVC_ADDRESS')}/events/get_user_ticket_booking_details/{user_id}/",
            )
            if response.status_code == 201:
                return Response(response.json(), status=status.HTTP_200_OK)
            return Response(response.json(), status=response.status_code)
        except requests.exceptions.RequestException:
            return Response({'error': 'Event service is unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
