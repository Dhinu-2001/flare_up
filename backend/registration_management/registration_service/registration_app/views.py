import json
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegistrationSerializer
from kafka_app.kafka_utils.producer import KafkaProducerService
from .models import Registration

# Create your views here.
import stripe
import environ

env = environ.Env()

environ.Env.read_env()


stripe.api_key = env('STRIPE_API_KEY')


@csrf_exempt
def create_checkout_session(request):
    try:
        if request.method == "POST":
            data = json.loads(request.body)
            print(data)
            session = stripe.checkout.Session.create(
                line_items=[
                    {
                        "price_data": {
                            "currency": "inr",
                            "product_data": {
                                "name": data["title"],
                                # "images":data['banner']
                            },
                            "unit_amount": data["price"] * 100,
                        },
                        "quantity": data["quantity"],
                    }
                ],
                mode="payment",
                success_url="http://localhost:8083/success-payment/?session_id={CHECKOUT_SESSION_ID}",
                cancel_url="http://localhost:4242/cancel",
                metadata={
                    "user_id": data["user_id"],
                    "event_id": data["event_id"],
                    "event_title": data["title"],
                    "quantity": data["quantity"],
                    "hoster_id": data["hoster_id"]
                },
            )
            print("reacher regitration")
            return JsonResponse({"stripe_session": session}, status=200)
    except Exception as e: 
        return JsonResponse(
            {"error": "Stripe payment failed", "details": str(e)},
            status=503,
        )


class HandleSuccessPayment(APIView):
    def get(self, request):
        print("Get method")
        try:
            session_id = request.GET.get("session_id")

            if not session_id:
                return Response({"message": "session_id is missing"}, status=400)

            # Retrieve the session from Stripe
            session = stripe.checkout.Session.retrieve(session_id)

            # Retrieve payment intent for more details
            payment_intent = stripe.PaymentIntent.retrieve(session.payment_intent)

            # Extract necessary details
            payment_details = {
                "transaction_id": session.payment_intent,
                "amount_received": payment_intent.amount_received
                / 100,  # Convert to major currency unit
                "currency": payment_intent.currency,
                "customer_email": session.customer_details.email,
                "event_id": session.metadata.get("event_id", ""),
                "event_title": session.metadata.get("event_title", ""),
                "user_id": session.metadata.get("user_id", ""),
                "hoster_id": session.metadata.get("hoster_id", ""),
                "ticket_quantity": session.metadata.get("quantity", ""),
                "status": payment_intent.status,
            }
            print(payment_details)
            
            serializer = RegistrationSerializer(data = payment_details)
            if serializer.is_valid():
                serializer.save()
                
                kafka_data = serializer.data
                kafka_data["event_title"] = payment_details["event_title"]               
                print('kafka_data',kafka_data)
                
                kafka_producer = KafkaProducerService(config={}) 
                kafka_producer.send_payment_notification_message(kafka_data)
                
                return render(request, "payment_success.html", {"payment_details": payment_details})
            else:
                print(serializer.error_messages)
                return render(request, "payment_failed.html", {"payment_details": payment_details})

            
        except Exception as e:
            print(str(e))
            return Response(
                {"message": "failed"}, status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

class RegistrationsByHosterView(APIView):
    def get(self, request, user_id):
        # Query registrations based on hoster_id
        registrations = Registration.objects.filter(hoster_id=user_id)
        
        if registrations.exists():
            # Serialize the query result
            serializer = RegistrationSerializer(registrations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        return Response(
            {"detail": "No registrations found for the given hoster_id."},
            status=status.HTTP_404_NOT_FOUND
        )