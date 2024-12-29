from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Registration
from django.db.models import Sum

class total_income(APIView):            
    def get(self, request, host_id):
        total_income= (
            Registration.objects.filter(
                hoster_id=host_id
            )
            .aggregate(income=Sum("amount_received"))
        )['income'] or 0

        print('TOTAL', total_income)

        return Response({'total income':total_income}, status=status.HTTP_200_OK)