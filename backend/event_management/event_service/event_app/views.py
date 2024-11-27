from django.shortcuts import render
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import (
    EventCreateSerializer,
    EventRetrieveSerializer,
    EventCategorySerializer,
    EventTypeSerializer,
    KeyParticipantSerializer,
)
from .models import EventCategory, EventType, Event as Event_db, KeyParticipant as KeyParticipant_db
from django.core.exceptions import ObjectDoesNotExist
import datetime

# Create your views here.


class Events(APIView):
    def post(self, request):
        print("event service reached")
        serializer = EventCreateSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "Event created successfully"},
                status=status.HTTP_201_CREATED,
            )
        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        events = Event_db.objects.all()
        serializer = EventRetrieveSerializer(events, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class Event(APIView):
    def get(self, request, event_id):
        print("reached", event_id)
        try:
            event_object = Event_db.objects.get(id=event_id)
            serializer = EventRetrieveSerializer(event_object)
            event_data = serializer.data
            print('event data', event_data)
            
            # key_participants = KeyParticipant_db.objects.prefetch_related("key_participants").get(event=event_object)
            # print(key_participants)

            # Fetching hoster details
            try:
                response = requests.get(
                    f"http://localhost:8081/user/{int(event_data['host_id'])}/"
                )
                user_data = response.json() if response.status_code == 200 else None
                print('user request data', user_data)

                response_data = {
                    "event_data": event_data,  
                    "user_data": user_data if user_data else "Failed to retrieve user data"
                }

                gateway_response = Response(response_data, status=response.status_code)
                return gateway_response
            except requests.exceptions.RequestException:
                response_data = {
                    "event_data": serializer.data,
                    "user_data": "User service is unavailable"
                }
                return Response(response_data, status=status.HTTP_200_OK)

        except Event_db.DoesNotExist:
            return Response(
                {"error": "Event not found"},
                status=status.HTTP_404_NOT_FOUND
            )
            
    def put(self, request,event_id):
        print('reache patch', request.data)
        try:
            event = Event_db.objects.get(id=event_id)
            serializer = EventCreateSerializer(event, data=request.data, partial=False)
            
            if serializer.is_valid():
                serializer.save()
                return Response({"message": "Event updated successfully"},status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)
            
class EventsByHoster(APIView):
    def get(self, request, hoster_id):
        try:
            event_objects = Event_db.objects.filter(host_id=hoster_id)
            serializer = EventRetrieveSerializer(event_objects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':str(e)},status=status.HTTP_400_BAD_REQUEST)

class UpdateEventStatus(APIView):
    def post(self, request, event_id):
        event_status = request.data.get("event_status")
        
        if not event_status:
            return Response(
                {'error': 'Event status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if event_status not in ['Active', 'Cancelled', 'Cancel status request']:
            return Response(
                {'error': 'Invalid event status. Valid values are "Active" or "Cancelled".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            print('event status',event_status)
            event = Event_db.objects.get(id=event_id)
            if event.approval_status == 'Waiting for approval':
                if event_status == 'Active':
                    event.status = 'Draft'
                else:
                    event.status = event_status
                event.status_request = False
            elif event_status == 'Cancel status request':
                event.status_request = False
            else:
                event.status_request = True
            # event.updated_at = datetime.datetime.now()
            event.save()

            return Response(
                {'message': "Event approval status updated successfully"},
                status=status.HTTP_200_OK
            )
        except ObjectDoesNotExist:
            return Response(
                {'error': 'Event not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error updating event approval status: {str(e)}")
            return Response(
                {'error': 'Event approval status update failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class UpdateApprovalStatus(APIView):
    def post(self, request, event_id):
        approval_status = request.data.get("approval_status")
        
        if not approval_status:
            return Response(
                {'error': 'Approval status is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if approval_status not in ['Approved', 'Rejected', 'Allow request', 'Reject request', 'Cancelled by Admin']:
            return Response(
                {'error': 'Invalid approval status. Valid values are "approved" or "rejected".'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            event = Event_db.objects.get(id=event_id)
            if approval_status in ['Allow request', 'Reject request']:
                if approval_status == 'Allow request':
                    if event.status ==  'Active':
                        event.status = 'Cancelled'
                        event.status_request = False
                    else:
                        event.status = 'Active'
                        event.status_request = False
                else:
                    event.status_request = False
            elif approval_status == 'Cancelled by Admin':
                event.status = 'Cancelled by Admin'
            else:
                event.approval_status = approval_status
                if approval_status == 'Approved':
                    event.status = 'Active'
            event.approval_updated_at = datetime.datetime.now()
            event.save()

            return Response(
                {'message': "Event approval status updated successfully"},
                status=status.HTTP_200_OK
            )
        except ObjectDoesNotExist:
            return Response(
                {'error': 'Event not found'},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            print(f"Error updating event approval status: {str(e)}")
            return Response(
                {'error': 'Event approval status update failed'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
class EventsByCategory(APIView):
    def get(self, request, category_name):
        try:
            print(category_name)
            category_object = (
                EventCategory.objects.prefetch_related("event_types")
                .filter(name=category_name)
                .all()
            ) 
            
            print(category_object)
            
            cate_object = EventCategory.objects.get(name=category_name)
            event_objects = Event_db.objects.filter(category=cate_object)
            
            print(event_objects)
            
            serializer = EventRetrieveSerializer(event_objects, many=True)
            print('after serializer')
            
            category_data = []
            for category in category_object:
                category_data.append(
                    {
                    "id": category.id,
                    "name": category.name,
                    "description": category.description,
                    "status": category.status,
                    "updated_at": category.updated_at,
                    "event_types": [
                        {
                            "id": event_type.id,
                            "name": event_type.name,
                            "description": event_type.description,
                            "status": event_type.status,
                            "updated_at": event_type.updated_at,
                        }
                        for event_type in category.event_types.all()
                    ],
                    }
                )

            response_data = {
                'category_data': category_data,
                'event_data': serializer.data
            }
            return Response(response_data, status=status.HTTP_200_OK)
                
        except EventCategory.DoesNotExist:
            return Response({'error':f'Category {category_name} does not exist'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({'error':str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class KeyParticipants(APIView):
    def post(self, request, event_id):
        try:
            event_object = Event_db.objects.get(id=event_id)
            key_participants = request.data.get('key_participants')
            print('key participants', key_participants)
            if not key_participants or len(key_participants) == 0:
                return Response({'error':'Please provide details of key participants'})
            
            try:
                KeyParticipant_db.objects.filter(event=event_object).delete()
            except KeyParticipant_db.DoesNotExist:
                return Response({'error':'Data does not found.'}, status=status.HTTP_400_BAD_REQUEST)
            
            
            for participant in key_participants:
                serializer = KeyParticipantSerializer(data=participant)
                if serializer.is_valid():
                    serializer.save()
                else:
                    print(serializer.errors)
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            return Response({'message':'Key participants successfully updated'}, status=status.HTTP_201_CREATED)
        except Exception as e:
            print('EXCEPTION', str(e))
            return Response({'error':str(e)}, status=status.HTTP_400_BAD_REQUEST)
            
            

class CreateCategory(APIView):
    def post(self, request):
        print("reached event service")
        data = request.data
        print(data)
        serializer = EventCategorySerializer(data=data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {"message": "New Category added successfully"},
                status=status.HTTP_201_CREATED,
            )
        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class EventTypesAndCategories(APIView):
    def get(self, request):
        categories = EventCategory.objects.prefetch_related("event_types").all()

        data = []
        for category in categories:
            data.append(
                {
                    "id": category.id,
                    "name": category.name,
                    "description": category.description,
                    "status": category.status,
                    "updated_at": category.updated_at,
                    "event_types": [
                        {
                            "id": event_type.id,
                            "name": event_type.name,
                            "description": event_type.description,
                            "status": event_type.status,
                            "updated_at": event_type.updated_at,
                        }
                        for event_type in category.event_types.all()
                    ],
                }
            )

        return Response(data, status=status.HTTP_200_OK)

