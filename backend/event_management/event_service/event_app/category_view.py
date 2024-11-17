from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import EventCategory, EventType
from .serializers import EventTypeSerializer

class Category(APIView):
    def get(self, request, category_name):
        print(category_name)
        category_object = (
            EventCategory.objects.prefetch_related("event_types")
            .filter(name=category_name)
            .all()
        )

        data = []
        for category in category_object:
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
    
class Types(APIView):
    def post(self, request):
        print('reached event service')
        data = request.data
        print(data)
        serializer = EventTypeSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message':'New Type added successfully'}, status=status.HTTP_201_CREATED)
        print("Serializer Errors:", serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)