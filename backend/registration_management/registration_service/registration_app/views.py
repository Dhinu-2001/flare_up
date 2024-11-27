import json
from django.shortcuts import redirect, render
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import requests
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import RegistrationSerializer

# Create your views here.
import stripe

stripe.api_key = "sk_test_51QOwBVEoHTcQ6zGjYZRfLB0YO1wkbcJlx68RHvUe5dW1kytGPlEemeb00nFH3kO50MEsyAxGN0e69Hj3AEjKe59P00qhpAac1z"


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
                    "quantity": data["quantity"],
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
                "user_id": session.metadata.get("user_id", ""),
                "ticket_quantity": session.metadata.get("quantity", ""),
                "status": payment_intent.status,
            }
            print(payment_details)
            
            serializer = RegistrationSerializer(data = payment_details)
            if serializer.is_valid():
                serializer.save()
                
                return render(request, "payment_success.html", {"payment_details": payment_details})
            else:
                print(serializer.error_messages)
                return render(request, "payment_failed.html", {"payment_details": payment_details})

            
        except Exception as e:
            print(str(e))
            return Response(
                {"message": "failed"}, status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

       